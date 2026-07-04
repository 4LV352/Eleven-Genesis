(function () {
    "use strict";

    const SAVE_KEY = "legendsDirectorSave";
    const $ = (selector, context = document) => context.querySelector(selector);
    const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

    let lastSignature = "";
    let lastEraId = "";
    let currentEraId = "";

    const ERA_TRANSITIONS = {
        "80": "Uma caixa chegou esta manhã. Dentro: uma televisão colorida. O presidente disse que os tempos estão mudando.",
        "90": "O computador entrou na sala pela porta lateral. Ainda faz barulho, ainda parece estranho, mas agora também observa o jogo.",
        "00": "O primeiro e-mail chegou antes do telefone tocar. A espera ficou menor, e o mundo ficou grande demais para caber em uma pasta.",
        "10": "A sala ganhou telas, dados e silêncio climatizado. O rádio virou memória, mas continua ali para lembrar como tudo começou."
    };

    const ROUTES = {
        radio: "newsCenter",
        phone: "market",
        newspaper: "league",
        notebook: "calendar",
        envelope: "club",
        board: "tactics",
        squad: "squad",
        scout: "scout",
        tv: "newsCenter",
        tape: "tactics",
        agenda: "calendar",
        fax: "market",
        computer: "scout",
        printer: "finances",
        disk: "club",
        internet: "market",
        email: "newsCenter",
        phoneMobile: "market",
        projector: "tactics",
        dashboard: "finances",
        tablet: "squad",
        cameras: "tactics",
        network: "scout",
        memory: "club"
    };

    const ERAS = [
        {
            id: "70",
            from: 1970,
            to: 1979,
            title: "Anos 70",
            range: "1970-1979",
            room: "Madeira, couro gasto, luz âmbar e papel.",
            window: "Campo de treino molhado, arquibancada de cimento e cidade baixa ao fundo.",
            tone: "Informação lenta. Decisão por intuição.",
            memory: "O rádio dita o ritmo do mundo. O telefone de disco ainda parece suficiente.",
            objects: [
                ["radio", "Radio AM", "Noticias chegam com chiado.", "◉"],
                ["phone", "Telefone de disco", "Scout, contatos e negociação.", "☎"],
                ["newspaper", "Jornal dobrado", "Liga, imprensa e moral.", "📰"],
                ["notebook", "Agenda espiral", "Semana escrita a mão.", "📓"],
                ["envelope", "Envelope da diretoria", "Clube, cobrança e contrato.", "✉"],
                ["board", "Quadro de pinos", "Tática física.", "⚽"],
                ["squad", "Fotos do elenco", "Jogadores como pessoas.", "▧"],
                ["scout", "Pasta do olheiro", "Relatórios incompletos.", "⌕"]
            ]
        },
        {
            id: "80",
            from: 1980,
            to: 1989,
            title: "Anos 80",
            range: "1980-1989",
            room: "A madeira continua, mas plástico, cor e televisão começam a disputar espaço.",
            window: "Refletores novos, cartazes coloridos e noites que parecem mais barulhentas.",
            tone: "A televisão chegou. O futebol começa a se ver.",
            memory: "A TV não substitui o rádio; ela disputa espaço com ele.",
            objects: [
                ["tv", "TV CRT", "Jogos, imagens e pressão.", "📺"],
                ["tape", "Fita cassete", "Análise lenta e repetida.", "▰"],
                ["phone", "Telefone fixo", "Mais ligações, menos silêncio.", "☎"],
                ["agenda", "Agenda de couro", "Calendário mais pesado.", "📒"],
                ["newspaper", "Jornais coloridos", "Manchetes mais agressivas.", "🗞"],
                ["board", "Post-its no quadro", "Tática em camadas.", "📌"],
                ["squad", "Fotos reveladas", "Memória de elenco.", "▧"],
                ["scout", "Pasta de viagem", "Observação presencial.", "⌕"]
            ]
        },
        {
            id: "90",
            from: 1990,
            to: 1999,
            title: "Anos 90",
            range: "1990-1999",
            room: "O digital entra pela porta lateral, ainda cercado de papel.",
            window: "Cidade mais ruidosa, estádio em reforma e brilho verde refletido no vidro.",
            tone: "Banco de dados, fax e impressão matricial começam a mudar a espera.",
            memory: "O computador ainda não manda. Ele sugere. O treinador desconfia.",
            objects: [
                ["computer", "Computador CRT", "Dados básicos de jogadores.", "🖥"],
                ["fax", "Fax", "Propostas chegam mais rápido.", "▤"],
                ["printer", "Impressora matricial", "Relatórios em pilha.", "▥"],
                ["disk", "Disquetes", "Memória física.", "▣"],
                ["tv", "TV maior", "Mais imagens do adversário.", "📺"],
                ["newspaper", "Revistas e jornais", "Opinião especializada.", "📰"],
                ["board", "Quadro tático", "Giz e suspeita.", "⚽"],
                ["squad", "Fichas atualizadas", "Contrato e forma.", "▧"]
            ]
        },
        {
            id: "00",
            from: 2000,
            to: 2009,
            title: "Anos 2000",
            range: "2000-2009",
            room: "Menos papel sobre a mesa, mais cabos, tela fria e mercado global.",
            window: "Estádio mais moderno, placas de patrocínio e cidade conectada.",
            tone: "Internet globaliza o jogo e acelera a informação.",
            memory: "O primeiro e-mail muda o peso da espera. Nem tudo precisa viajar.",
            objects: [
                ["internet", "Internet", "Mercado e fóruns globais.", "🌐"],
                ["email", "E-mail", "Comunicação instantânea.", "✉"],
                ["computer", "Monitor LCD", "Dados mais limpos.", "▣"],
                ["phoneMobile", "Celular", "Contato móvel.", "▯"],
                ["projector", "Projetor", "Reunião tática.", "▱"],
                ["scout", "Banco de scout", "Busca mais ampla.", "⌕"],
                ["board", "Quadro tático", "Ainda existe no centro.", "⚽"],
                ["newspaper", "Papel restante", "A memória não sai de uma vez.", "📰"]
            ]
        },
        {
            id: "10",
            from: 2010,
            to: 2099,
            title: "Anos 2010+",
            range: "2010+",
            room: "Centro de análise com múltiplas telas, mas parede cheia de cicatrizes.",
            window: "Arena moderna, centro de treinamento e noite azulada de monitor.",
            tone: "Dados em tempo real. O futebol virou operação.",
            memory: "O rádio virou lembrança na parede. A sala está mais fria, mas carrega tudo que viveu.",
            objects: [
                ["dashboard", "Dashboards", "Finanças, reputação e performance.", "📊"],
                ["tablet", "Tablet", "Elenco por toque.", "▯"],
                ["computer", "Múltiplas telas", "Dados paralelos.", "🖥"],
                ["cameras", "Câmeras táticas", "Performance visual.", "▣"],
                ["network", "Rede global", "Scout mundial.", "🌍"],
                ["memory", "Parede de memórias", "O clube lembra.", "🏆"],
                ["board", "Quadro antigo", "A tática ainda é humana.", "⚽"],
                ["newspaper", "Recortes antigos", "A história não desaparece.", "📰"]
            ]
        }
    ];

    function readSave() {
        try {
            const raw = localStorage.getItem(SAVE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (error) {
            return null;
        }
    }

    function getYear() {
        const save = readSave() || {};
        const headerYear = ($("#header-season")?.textContent || "").match(/19\d{2}|20\d{2}/)?.[0];
        const raw = window.GameState?.currentYear || save.currentYear || save.year || save.season || headerYear || 1970;
        return Math.max(1970, parseInt(raw, 10) || 1970);
    }

    function getClubName() {
        const save = readSave() || {};
        return window.GameState?.club?.name || save.club?.name || $("#header-club")?.textContent || "Eleven Genesis";
    }

    function eraForYear(year) {
        return ERAS.find((era) => year >= era.from && year <= era.to) || ERAS[0];
    }

    function setEraClass(era) {
        currentEraId = era.id;
        document.documentElement.classList.add("eg16-time-office-root");
        ERAS.forEach((item) => document.documentElement.classList.remove(`eg16-era-${item.id}`));
        document.documentElement.classList.add(`eg16-era-${era.id}`);
    }

    function screenRoot() {
        return document.getElementById("screen-root");
    }

    function activeScreenName() {
        return $(".desktop-nav-button.active, .nav-button.active")?.dataset?.screen || window.GameState?.currentScreen || "";
    }

    function isHomeScreen(root) {
        if (!root) return false;
        if (activeScreenName() === "home") return true;
        if (root.querySelector(".eg8-dashboard, [aria-label='Escritório do treinador'], .eg16-time-office")) return true;
        return /Escritório|Sala|Diretoria|Próximo jogo|Semana|Genesis/i.test((root.textContent || "").slice(0, 900));
    }

    function openObject(kind, label, text) {
        const route = ROUTES[kind] || "home";
        const drawer = ensureObjectDrawer();
        $("h2", drawer).textContent = label;
        $("p", drawer).textContent = text;
        $(".eg16-object-note", drawer).textContent = `${getClubName()} · ${eraForYear(getYear()).title}: ${eraForYear(getYear()).tone}`;
        const go = $("[data-eg16-go]", drawer);
        go.textContent = route === "home" ? "Voltar à sala" : "Abrir objeto";
        go.onclick = () => {
            drawer.classList.add("hidden");
            if (typeof window.switchScreen === "function") window.switchScreen(route);
        };
        drawer.classList.remove("hidden");
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
                <button type="button" class="eg16-drawer-close" data-eg16-close aria-label="Fechar">x</button>
                <span class="eg16-kicker">Objeto da sala</span>
                <h2></h2>
                <p></p>
                <div class="eg16-object-note"></div>
                <button class="btn btn-primary" type="button" data-eg16-go>Abrir objeto</button>
            </article>`;
        document.body.appendChild(drawer);
        drawer.addEventListener("click", (event) => {
            if (event.target.closest("[data-eg16-close]")) drawer.classList.add("hidden");
        });
        return drawer;
    }

    function showEraTransition(era, year) {
        if (!ERA_TRANSITIONS[era.id]) return;
        const key = `eg16-era-transition-${era.id}`;
        if (localStorage.getItem(key) === "1") return;
        localStorage.setItem(key, "1");
        const drawer = ensureObjectDrawer();
        $("h2", drawer).textContent = `${era.title}: a sala mudou`;
        $("p", drawer).textContent = ERA_TRANSITIONS[era.id];
        $(".eg16-object-note", drawer).textContent = `Temporada ${year}. O futebol muda. A sala lembra.`;
        const go = $("[data-eg16-go]", drawer);
        go.textContent = "Voltar à mesa";
        go.onclick = () => drawer.classList.add("hidden");
        drawer.classList.remove("hidden");
    }

    function renderOffice() {
        const root = screenRoot();
        if (!root || !isHomeScreen(root)) return;
        const year = getYear();
        const era = eraForYear(year);
        setEraClass(era);

        const signature = `${year}|${era.id}|${root.children.length}|${(root.textContent || "").slice(0, 120)}`;
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

        const club = getClubName();
        box.innerHTML = `
            <div class="eg16-hero">
                <div class="eg16-copy">
                    <span class="eg16-kicker">${club} · ${year}</span>
                    <h2>A sala atravessa décadas.</h2>
                    <p><span>${era.room}</span><span>${era.tone}</span><span>O jogador não lê que o tempo passou: ele vê.</span></p>
                </div>
                <div class="eg16-concept" role="img" aria-label="Evolução visual da sala do técnico entre décadas"></div>
            </div>
            <div class="eg16-era-line" aria-label="Linha do tempo da sala">
                ${ERAS.map((item) => `
                    <button type="button" class="eg16-era-pill ${item.id === era.id ? "active" : ""}" data-eg16-era="${item.id}">
                        <strong>${item.title}</strong>
                        <span>${item.range}</span>
                    </button>`).join("")}
            </div>
            <div class="eg16-mobile-table">Mobile não vira outra interface: é a mesma sala vista de cima, com os mesmos objetos ao alcance da mão.</div>
            <div class="eg16-room">
                <article class="eg16-desk">
                    <h3>Mesa do técnico · ${era.title}</h3>
                    <div class="eg16-objects">
                        ${era.objects.map(([kind, title, description, icon]) => `
                            <button type="button" class="eg16-object eg16-object-${kind}" data-eg16-object="${kind}" data-eg16-title="${escapeAttr(title)}" data-eg16-text="${escapeAttr(description)}">
                                <b>${icon}</b>
                                <strong>${title}</strong>
                                <small>${description}</small>
                            </button>`).join("")}
                    </div>
                </article>
                <article class="eg16-window">
                    <h3>Janela e memória</h3>
                    <div class="eg16-weather">
                        <div>
                            <strong>${era.window}</strong>
                            <span>O clube também envelhece lá fora.</span>
                        </div>
                    </div>
                    <div class="eg16-memory">${era.memory}</div>
                </article>
            </div>
            <div class="eg16-director-note"><strong>Regra do Eleven Genesis:</strong> se a função não existe como objeto da sala, ela ainda não pertence ao jogo.</div>`;

        wireOffice(box);
        if (lastEraId && lastEraId !== era.id) showEraTransition(era, year);
        lastEraId = era.id;
    }

    function escapeAttr(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    function wireOffice(box) {
        $$("[data-eg16-object]", box).forEach((button) => {
            button.addEventListener("click", () => {
                button.classList.add("eg16-object-touched");
                window.setTimeout(() => button.classList.remove("eg16-object-touched"), 420);
                openObject(button.dataset.eg16Object, button.dataset.eg16Title, button.dataset.eg16Text);
            });
        });
        $$("[data-eg16-era]", box).forEach((button) => {
            button.addEventListener("click", () => {
                const era = ERAS.find((item) => item.id === button.dataset.eg16Era);
                if (!era) return;
                setEraClass(era);
                $$(".eg16-era-pill", box).forEach((pill) => pill.classList.toggle("active", pill === button));
                $(".eg16-director-note", box).innerHTML = `<strong>${era.title}:</strong> ${era.memory}`;
            });
        });
    }

    function init() {
        renderOffice();
        const root = screenRoot();
        if (root) {
            new MutationObserver(() => requestAnimationFrame(renderOffice)).observe(root, {
                childList: true,
                subtree: true,
                characterData: true
            });
        }
        window.addEventListener("resize", () => {
            $(".eg16-time-office")?.classList.toggle("eg16-compact", window.innerWidth < 760);
        });
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
}());
