(function () {
    "use strict";

    document.documentElement.classList.add("eg12-analog-era");
    document.body.classList.add("analog-era");

    const root = () => document.getElementById("screen-root");
    let modalOpen = false;
    let lastSignature = "";

    const analogPhrases = [
        "O relatório chegou com marca de café no canto. Alguém leu antes de você.",
        "O olheiro não tem certeza. Em 1970, certeza quase nunca chega antes da decisão.",
        "A ficha diz pouco. O vestiário dirá o resto.",
        "Você sabe o suficiente para se interessar. Não o suficiente para ter segurança.",
        "O papel não captura tudo. Às vezes é preciso ver o jogador suar."
    ];

    function hashText(text) {
        let h = 0;
        String(text || "").split("").forEach((ch) => { h = ((h << 5) - h) + ch.charCodeAt(0); h |= 0; });
        return Math.abs(h);
    }

    function pick(seed, list) {
        return list[hashText(seed) % list.length];
    }

    function ensureModalRoot() {
        let modal = document.getElementById("eg12-analog-modal");
        if (modal) return modal;
        modal = document.createElement("div");
        modal.id = "eg12-analog-modal";
        modal.className = "eg12-analog-modal hidden";
        modal.setAttribute("role", "dialog");
        modal.setAttribute("aria-modal", "true");
        modal.innerHTML = '<article class="eg12-modal-paper" id="eg12-modal-paper"></article>';
        document.body.appendChild(modal);
        modal.addEventListener("click", (event) => {
            if (event.target === modal) closeAnalogModal();
        });
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") closeAnalogModal();
        });
        return modal;
    }

    function openAnalogModal(html) {
        const modal = ensureModalRoot();
        const paper = document.getElementById("eg12-modal-paper");
        paper.innerHTML = html;
        modal.classList.remove("hidden");
        modalOpen = true;
        paper.querySelectorAll("[data-eg12-close]").forEach((button) => button.addEventListener("click", closeAnalogModal));
    }

    function closeAnalogModal() {
        const modal = document.getElementById("eg12-analog-modal");
        if (!modal) return;
        modal.classList.add("hidden");
        modalOpen = false;
    }

    function addOfficeDesk() {
        const screen = root();
        if (!screen || screen.querySelector(".eg12-office-desk")) return;
        const dashboard = screen.querySelector(".eg8-dashboard, [aria-label='Escritório do treinador']");
        if (!dashboard) return;
        const hero = dashboard.querySelector(".eg8-office-hero") || dashboard.firstElementChild;
        if (!hero) return;

        const note = document.createElement("div");
        note.className = "eg12-paper-note";
        note.textContent = "Sobre a mesa: rádio AM ligado baixo, uma pasta de olheiro, a agenda da semana e um jornal dobrado. Você não consulta sistemas. Você interpreta sinais.";
        hero.insertAdjacentElement("afterend", note);

        const desk = document.createElement("section");
        desk.className = "eg12-office-desk";
        desk.setAttribute("aria-label", "Mesa do treinador");
        desk.innerHTML = [
            ["📞", "Telefone", "Mercado e negociações", "market"],
            ["📰", "Jornal", "Notícias e repercussão", "news"],
            ["📂", "Pasta", "Elenco e relatórios", "squad"],
            ["📋", "Prancheta", "Tática e treino", "tactics"],
            ["📻", "Rádio AM", "Resultados do mundo", "league"]
        ].map(([icon, title, text, screenName]) => `
            <button type="button" class="eg12-desk-object" data-eg12-screen="${screenName}" ${title === "Rádio AM" ? 'data-analog-object="radio"' : ""}>
                <b>${icon}</b>
                <span><strong>${title}</strong><small>${text}</small></span>
            </button>
        `).join("");
        note.insertAdjacentElement("afterend", desk);
        desk.querySelectorAll("[data-eg12-screen]").forEach((button) => {
            button.addEventListener("click", () => {
                if (typeof window.switchScreen === "function") window.switchScreen(button.dataset.eg12Screen);
            });
        });
    }

    function decorateCareer() {
        const screen = root();
        if (!screen) return;
        const stage = screen.querySelector(".eg8-career-stage");
        if (!stage || stage.dataset.eg12Done) return;
        stage.dataset.eg12Done = "1";
        const hero = stage.querySelector(".eg8-stage-hero");
        if (!hero) return;
        const h1 = hero.querySelector("h1");
        const p = hero.querySelector("p");
        if (h1 && /Onde você quer escrever/i.test(h1.textContent)) {
            h1.textContent = "A mesa está vazia. Onde começa a sua história?";
            if (p) p.textContent = "Nada de catálogo. Primeiro o país. Depois a liga. Depois o clube. Uma decisão por vez, como uma vida que ainda não aconteceu.";
        } else if (h1 && /nível/i.test(h1.textContent)) {
            hero.insertAdjacentHTML("beforeend", '<div class="eg12-paper-note">O país já tem cheiro, jornal e torcida. Agora você escolhe o peso da divisão onde vai começar.</div>');
        } else if (h1 && /clube/i.test(h1.textContent)) {
            if (p) p.textContent = "Escolha apenas quem merece ser conhecido. A história completa fica na próxima sala.";
        }
    }

    function decorateClubProfile() {
        const screen = root();
        if (!screen) return;
        const profile = screen.querySelector(".eg8-club-profile");
        if (!profile || profile.dataset.eg12Done) return;
        profile.dataset.eg12Done = "1";
        const cover = profile.querySelector(".eg8-club-cover");
        if (cover) {
            cover.insertAdjacentHTML("beforeend", '<div class="eg12-paper-note">Você não está escolhendo um escudo. Está decidindo onde vai acordar toda segunda-feira depois de uma derrota.</div>');
        }
        const contract = profile.querySelector(".eg8-contract-bar");
        if (contract && !contract.querySelector(".eg12-contract-copy")) {
            contract.insertAdjacentHTML("afterbegin", '<p class="eg12-contract-copy">A caneta está na mesa. Depois da assinatura, o jornal da manhã já terá seu nome.</p>');
        }
    }

    function decoratePeople() {
        const screen = root();
        if (!screen) return;
        const candidates = screen.querySelectorAll(".market-card, .player-card, .academy-card, .squad-card, .player-row, .market-row, .row-card");
        candidates.forEach((card, index) => {
            if (card.dataset.eg12Person) return;
            const text = card.textContent || "";
            if (text.length < 12 || /contrato assinado|salvar|menu/i.test(text)) return;
            card.dataset.eg12Person = "1";
            if (card.querySelector(".eg12-player-note")) return;
            const note = document.createElement("small");
            note.className = "eg12-player-note";
            note.textContent = pick(text + index, analogPhrases);
            card.appendChild(note);
        });

        if (/Mercado|Scout|Base|Elenco/i.test(screen.textContent || "")) {
            screen.classList.add("eg12-list-mode");
            if (!screen.querySelector(".eg12-transmission-banner")) {
                const banner = document.createElement("div");
                banner.className = "eg12-transmission-banner";
                banner.textContent = /Mercado/i.test(screen.textContent || "")
                    ? "Telefone na mesa. Nenhum jogador é uma mercadoria: cada negociação muda uma vida e um vestiário."
                    : /Scout/i.test(screen.textContent || "")
                        ? "O olheiro trouxe poucas certezas e algumas suspeitas. Em 1970, isso é quase tudo que existe."
                        : "Primeira camada: pessoas. Os números ficam para quando você pedir profundidade.";
                const first = screen.querySelector(".screen, section, main") || screen.firstElementChild || screen;
                first.insertBefore(banner, first.children[1] || first.firstChild);
            }
        }
    }

    function decorateNewspaper() {
        const overlay = document.getElementById("tension-overlay");
        if (!overlay) return;
        overlay.classList.add("eg12-newspaper-moment");
        const type = document.getElementById("tension-type");
        if (type && !/JORNAL|EDIÇÃO/i.test(type.textContent)) type.textContent = "EDIÇÃO EXTRA";
    }

    function showWeekBeforeAdvance(callback) {
        const saved = readCurrentSave();
        const club = window.GameState?.club?.name || saved?.club?.name || "o clube";
        const year = window.GameState?.currentYear || saved?.currentYear || saved?.season || 1970;
        openAnalogModal(`
            <span class="eg6-paper-name">AGENDA DO TREINADOR</span>
            <span class="eg6-paper-date">Semana em ${year}</span>
            <h2>A semana não passa. Ela pesa.</h2>
            <p>Antes do próximo jogo, ${club} viveu pequenos acontecimentos que não cabem na tabela.</p>
            <div class="eg12-week-line"><strong>Segunda-feira</strong>O vestiário chegou com o resultado de domingo ainda preso no rosto.</div>
            <div class="eg12-week-line"><strong>Terça-feira</strong>O assistente deixou uma pasta na sua mesa. Duas observações sobre futebol. Uma sobre gente.</div>
            <div class="eg12-week-line"><strong>Quinta-feira</strong>O telefone tocou duas vezes. Na primeira, ninguém falou. Na segunda, era o olheiro.</div>
            <div class="eg12-week-line"><strong>Sábado</strong>O rádio AM trouxe um resultado do rival. O mundo continuou sem pedir licença.</div>
            <button class="btn btn-primary" type="button" id="eg12-continue-week">Continuar para o próximo compromisso</button>
        `);
        const btn = document.getElementById("eg12-continue-week");
        btn?.addEventListener("click", () => {
            closeAnalogModal();
            callback();
        }, { once: true });
    }

    function readCurrentSave() {
        try {
            const raw = window.localStorage?.getItem("legendsDirectorSave");
            return raw ? JSON.parse(raw) : null;
        } catch (error) {
            return null;
        }
    }

    function interceptAdvanceWeek() {
        document.addEventListener("click", (event) => {
            const button = event.target.closest("[data-action='advance-week'], #advance-week");
            if (!button || modalOpen) return;
            if (button.dataset.eg12Bypass === "1") return;
            if (typeof window.advanceWeek !== "function") return;
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            showWeekBeforeAdvance(() => {
                window.advanceWeek();
            });
        }, true);
    }

    function decorateScreen() {
        const screen = root();
        if (!screen) return;
        const signature = (screen.textContent || "").slice(0, 220) + screen.children.length;
        if (signature === lastSignature) return;
        lastSignature = signature;
        document.body.classList.add("analog-era");
        addOfficeDesk();
        decorateCareer();
        decorateClubProfile();
        decoratePeople();
        decorateNewspaper();
    }

    function init() {
        ensureModalRoot();
        interceptAdvanceWeek();
        decorateScreen();
        const observer = new MutationObserver(() => window.requestAnimationFrame(decorateScreen));
        const screen = root();
        if (screen) observer.observe(screen, { childList: true, subtree: true, characterData: true });
        const app = document.getElementById("app");
        if (app) observer.observe(app, { childList: true, subtree: true });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
