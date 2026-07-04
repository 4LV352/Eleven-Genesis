(function () {
    "use strict";

    const $ = (selector, context = document) => context.querySelector(selector);
    const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

    let lastSignature = "";
    let lastEraId = "";
    let audioEnabled = false;
    let audioContext = null;

    function engine() {
        return window.EG17EraEngine || null;
    }

    function activeScreenName() {
        return $(".desktop-nav-button.active, .nav-button.active")?.dataset?.screen || window.GameState?.currentScreen || "";
    }

    function isHomeScreen(root) {
        if (!root) return false;
        if (activeScreenName() === "home") return true;
        if (root.querySelector(".eg16-time-office, .eg8-dashboard, [aria-label='Escritório do treinador'], .eg12-office-desk")) return true;
        return /Escritório|Sala|Diretoria|Próximo jogo|Semana|Genesis/i.test((root.textContent || "").slice(0, 900));
    }

    function setEraState(era, year) {
        const api = engine();
        const eras = api ? api.getEras() : [era];
        document.documentElement.classList.add("eg16-time-office-root");
        document.body.setAttribute("data-game-era", era.id);
        document.body.setAttribute("data-game-year", String(year));
        eras.forEach((item) => document.documentElement.classList.remove(`eg16-era-${item.id}`));
        document.documentElement.classList.add(`eg16-era-${era.id}`);
    }

    function screenRoot() { return document.getElementById("screen-root"); }

    function renderOffice() {
        const api = engine();
        const root = screenRoot();
        if (!api || !root || !isHomeScreen(root)) return;

        const year = api.getCurrentYear();
        const era = api.getEraForYear(year);
        const eras = api.getEras();
        const club = api.getClubName();
        const [moodTitle, moodText] = api.getRoomMood(year);
        const memories = api.getCareerMemories(year);
        setEraState(era, year);
        api.saveRoomState({ lastYear: year, lastEra: era.id });

        const signature = `${year}|${era.id}|${club}|${root.children.length}|${(root.textContent || "").slice(0, 80)}`;
        let box = $(".eg16-time-office", root);
        if (signature === lastSignature && box) return;
        lastSignature = signature;

        if (!box) {
            box = document.createElement("section");
            box.className = "eg16-time-office";
            box.setAttribute("aria-label", "Sala do técnico que atravessa décadas");
            const target = root.querySelector(".eg8-dashboard, [aria-label='Escritório do treinador'], .eg12-office-desk, section") || root;
            target.insertAdjacentElement(target === root ? "afterbegin" : "beforebegin", box);
        }

        box.innerHTML = `
            <div class="eg16-presence" aria-hidden="true"><i></i><span></span></div>
            <div class="eg16-hero">
                <div class="eg16-copy">
                    <span class="eg16-kicker">${escapeHtml(club)} · ${year} · ${era.title}</span>
                    <h2>A sala é a narrativa.</h2>
                    <p><span>${escapeHtml(era.room)}</span><span>${escapeHtml(era.philosophy)}</span><span>Não é uma skin por década: é o mesmo escritório acumulando tempo.</span></p>
                    <div class="eg16-hero-actions">
                        <button type="button" class="eg16-sound" data-eg16-sound>${audioEnabled ? "Som ligado" : "Ativar som da sala"}</button>
                        <button type="button" class="eg16-advance" data-action="advance-week">Avançar semana</button>
                    </div>
                </div>
                <div class="eg16-concept" role="img" aria-label="Referência visual das eras do Eleven Genesis"></div>
            </div>
            <div class="eg16-era-line" aria-label="Linha do tempo da sala">
                ${eras.map((item) => `
                    <button type="button" class="eg16-era-pill ${item.id === era.id ? "active" : ""}" data-eg16-era="${item.id}">
                        <strong>${item.title}</strong><span>${item.range}</span>
                    </button>`).join("")}
            </div>
            <div class="eg16-mobile-table">Mobile é a mesma sala vista de cima: os objetos não desaparecem, apenas ficam ao alcance do polegar.</div>
            <div class="eg16-room">
                <article class="eg16-desk">
                    <div class="eg16-section-head"><h3>Mesa do técnico</h3><span>${escapeHtml(moodTitle)}</span></div>
                    <p class="eg16-mood">${escapeHtml(moodText)}</p>
                    <div class="eg16-objects">
                        ${era.objects.map(([role, title, description, icon, status]) => `
                            <button type="button" class="eg16-object eg16-object-${status}" data-eg16-role="${role}" data-eg16-title="${escapeAttr(title)}" data-eg16-text="${escapeAttr(description)}">
                                <b>${icon}</b><strong>${escapeHtml(title)}</strong><small>${escapeHtml(description)}</small>
                            </button>`).join("")}
                    </div>
                </article>
                <article class="eg16-window">
                    <div class="eg16-section-head"><h3>Janela viva</h3><span>o clube envelhece lá fora</span></div>
                    <div class="eg16-weather"><strong>${escapeHtml(era.window)}</strong><span>Clima, estádio e cidade acompanham a carreira.</span></div>
                    <div class="eg16-audio-stack"><strong>Camada sonora</strong>${era.sound.map((sound) => `<span>${escapeHtml(sound)}</span>`).join("")}</div>
                </article>
                <article class="eg16-memory-wall">
                    <div class="eg16-section-head"><h3>Parede de memórias</h3><span>${memories.length} marcas</span></div>
                    <div class="eg16-memories">
                        ${memories.map(([, title, text]) => `<div class="eg16-memory-item"><strong>${escapeHtml(title)}</strong><small>${escapeHtml(text)}</small></div>`).join("")}
                    </div>
                </article>
                <article class="eg16-mechanics">
                    <div class="eg16-section-head"><h3>Como se trabalha em ${era.range}</h3><span>mecânica muda junto</span></div>
                    <ul>${era.mechanics.map((mechanic) => `<li>${escapeHtml(mechanic)}</li>`).join("")}</ul>
                </article>
            </div>
            <div class="eg16-director-note"><strong>Regra de direção:</strong> se a função não existe como objeto da sala, ela ainda não pertence ao jogo. A UI não explica a época; ela é a época.</div>`;

        wireOffice(box, era, year);
        if (lastEraId && lastEraId !== era.id) showEraTransition(era, year);
        lastEraId = era.id;
    }

    function wireOffice(box, era, year) {
        $$("[data-eg16-role]", box).forEach((button) => {
            button.addEventListener("click", () => {
                engine()?.rememberObject(`${era.id}:${button.dataset.eg16Title || button.dataset.eg16Role}`);
                touchPresence(box);
                playBlip(era.id);
                openObject(button.dataset.eg16Role, button.dataset.eg16Title, button.dataset.eg16Text, era, year);
            });
        });
        $$("[data-eg16-era]", box).forEach((button) => {
            button.addEventListener("click", () => {
                const previewEra = engine()?.getEras().find((item) => item.id === button.dataset.eg16Era);
                if (!previewEra) return;
                setEraState(previewEra, previewEra.from);
                $$(".eg16-era-pill", box).forEach((pill) => pill.classList.toggle("active", pill === button));
                $(".eg16-director-note", box).innerHTML = `<strong>Prévia de ${previewEra.title}:</strong> ${escapeHtml(previewEra.philosophy)} A sala muda sem perder a própria geometria.`;
            });
        });
        $("[data-eg16-sound]", box)?.addEventListener("click", () => {
            audioEnabled = !audioEnabled;
            if (audioEnabled) initAudio();
            $("[data-eg16-sound]", box).textContent = audioEnabled ? "Som ligado" : "Ativar som da sala";
            playBlip(era.id);
        });
    }

    function touchPresence(box) {
        const presence = $(".eg16-presence", box);
        if (!presence) return;
        presence.classList.remove("eg16-hand-in");
        void presence.offsetWidth;
        presence.classList.add("eg16-hand-in");
    }

    function initAudio() {
        try { audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)(); }
        catch (_) { audioContext = null; }
    }

    function playBlip(eraId) {
        if (!audioEnabled) return;
        initAudio();
        if (!audioContext) return;
        const map = { "70": 180, "80": 220, "90": 260, "00": 340, "10": 420, "30": 520 };
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.frequency.value = map[eraId] || 240;
        osc.type = eraId === "70" ? "sawtooth" : "sine";
        gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.045, audioContext.currentTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.16);
        osc.connect(gain).connect(audioContext.destination);
        osc.start();
        osc.stop(audioContext.currentTime + 0.18);
    }

    function openObject(role, label, text, era, year) {
        const route = engine()?.getRouteForRole(role) || "home";
        const drawer = ensureObjectDrawer();
        $("h2", drawer).textContent = label;
        $("p", drawer).textContent = text;
        $(".eg16-object-note", drawer).textContent = `${engine()?.getClubName() || "Eleven Genesis"} · ${year}: ${era.philosophy}`;
        $(".eg16-object-ritual", drawer).textContent = objectRitual(role, era);
        const go = $("[data-eg16-go]", drawer);
        go.textContent = route === "home" ? "Voltar à sala" : "Abrir função na sala";
        go.onclick = () => {
            drawer.classList.add("hidden");
            if (typeof window.switchScreen === "function" && route !== "home") window.switchScreen(route);
        };
        drawer.classList.remove("hidden");
    }

    function objectRitual(role, era) {
        const rituals = {
            media: `Você não abre uma tela de notícias. Você liga ${era.id === "70" ? "o rádio" : era.id === "80" ? "a televisão" : "a mídia da sala"} e espera o mundo falar.`,
            contact: "O contato nunca é instantâneo por padrão: a tecnologia da época define a ansiedade da resposta.",
            press: "A imprensa chega como objeto físico ou registro histórico. Manchetes mudam a moral antes de mudar números.",
            schedule: "A semana é uma coisa concreta: página, agenda, calendário ou painel. O tempo tem peso.",
            board: "A tática continua humana. Mesmo com dados, a decisão final acontece diante do quadro.",
            squad: "Jogadores não são linhas de tabela: são fichas, fotos, relatórios, carga e história.",
            market: "O mercado evolui de carta para dados, mas a incerteza nunca desaparece.",
            analysis: "A análise fica mais rápida a cada década; a responsabilidade também.",
            finance: "A gestão cresce junto com a sala: de envelope para dashboard, sem apagar o passado.",
            memory: "Este objeto não é decoração. É prova de que o tempo passou dentro da sala."
        };
        return rituals[role] || "A função existe como objeto antes de existir como interface.";
    }

    function ensureObjectDrawer() {
        let drawer = document.getElementById("eg16-object-drawer");
        if (drawer) return drawer;
        drawer = document.createElement("div");
        drawer.id = "eg16-object-drawer";
        drawer.className = "eg16-object-drawer hidden";
        drawer.innerHTML = `
            <div class="eg16-drawer-backdrop" data-eg16-close></div>
            <article class="eg16-drawer-card" role="dialog" aria-modal="true" aria-label="Objeto da sala">
                <button type="button" class="eg16-drawer-close" data-eg16-close aria-label="Fechar">×</button>
                <span class="eg16-kicker">Objeto da sala</span>
                <h2></h2><p></p>
                <div class="eg16-object-note"></div>
                <div class="eg16-object-ritual"></div>
                <button class="btn btn-primary" type="button" data-eg16-go>Abrir função na sala</button>
            </article>`;
        document.body.appendChild(drawer);
        drawer.addEventListener("click", (event) => {
            if (event.target.closest("[data-eg16-close]")) drawer.classList.add("hidden");
        });
        return drawer;
    }

    function showEraTransition(era, year) {
        const api = engine();
        const text = api?.getTransitionText(era.id);
        if (!api || !text || api.hasSeenTransition(era.id)) return;
        api.markTransitionSeen(era.id, year);
        const drawer = ensureObjectDrawer();
        $("h2", drawer).textContent = `${era.title}: a sala mudou`;
        $("p", drawer).textContent = text;
        $(".eg16-object-note", drawer).textContent = `Temporada ${year}. O futebol muda. A sala lembra.`;
        $(".eg16-object-ritual", drawer).textContent = "Nenhum recurso aparece como popup frio: cada tecnologia chega com história, peso e consequência.";
        const go = $("[data-eg16-go]", drawer);
        go.textContent = "Voltar à mesa";
        go.onclick = () => drawer.classList.add("hidden");
        drawer.classList.remove("hidden");
    }

    function escapeHtml(value) {
        return String(value || "").replace(/[&<>]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[char]));
    }

    function escapeAttr(value) {
        return escapeHtml(value).replace(/"/g, "&quot;");
    }

    function init() {
        renderOffice();
        const root = screenRoot();
        if (root) new MutationObserver(() => requestAnimationFrame(renderOffice)).observe(root, { childList: true, subtree: true, characterData: true });
        window.addEventListener("resize", () => $(".eg16-time-office")?.classList.toggle("eg16-compact", window.innerWidth < 760));
        window.EG17RoomEngine = { render: renderOffice, openObject };
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
}());
