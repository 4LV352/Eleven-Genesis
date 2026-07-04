(function () {
    "use strict";

    const MENU_SCREENS = ["menu", "menuSettings", "menuCredits", "clubSelect", "contractSigned"];
    const LABELS = {
        home: "Sala",
        squad: "Elenco",
        tactics: "Tática",
        market: "Mercado",
        scout: "Telefone",
        academy: "Base",
        marketing: "Rádio",
        league: "Jornal",
        newsCenter: "Jornal",
        club: "Clube",
        calendar: "Agenda",
        matchPreview: "Partida",
        matchResult: "Resultado",
        settings: "Config."
    };

    let originalSwitchScreen = null;
    let transitionLocked = false;
    let lastHubSignature = "";
    let rootObserver = null;

    function $(selector, context = document) {
        return context.querySelector(selector);
    }

    function engine() {
        return window.EG17EraEngine || null;
    }

    function state() {
        return window.GameState || null;
    }

    function hasCareer() {
        return Boolean(state()?.club);
    }

    function currentScreen() {
        return state()?.currentScreen || "";
    }

    function isMenuScreen(screen) {
        return MENU_SCREENS.includes(screen);
    }

    function root() {
        return document.getElementById("screen-root");
    }

    function ensureOverlay() {
        let overlay = document.getElementById("eg18-transition");
        if (overlay) return overlay;
        overlay = document.createElement("div");
        overlay.id = "eg18-transition";
        overlay.className = "eg18-transition";
        overlay.innerHTML = `
            <div class="eg18-transition__shade"></div>
            <div class="eg18-transition__ball" aria-hidden="true">⚽</div>
            <div class="eg18-transition__logo" aria-hidden="true"><img src="assets/eleven-genesis-reference.jpeg" alt=""></div>
            <div class="eg18-transition__paper" aria-hidden="true"></div>
            <div class="eg18-transition__crt" aria-hidden="true"></div>
            <div class="eg18-transition__label">Eleven Genesis</div>`;
        document.body.appendChild(overlay);
        return overlay;
    }

    function transitionType(screen) {
        const eraId = engine()?.getCurrentEra()?.id || "70";
        if (screen === "home") return "logo";
        if (["league", "newsCenter", "newsDetail"].includes(screen)) return "paper";
        if (["matchPreview", "matchResult"].includes(screen)) return "football";
        if (["marketing"].includes(screen) && ["70", "80", "90"].includes(eraId)) return "crt";
        return "fade";
    }

    function transition(callback, screen) {
        if (transitionLocked) return;
        transitionLocked = true;
        const overlay = ensureOverlay();
        const label = LABELS[screen] || "Eleven Genesis";
        overlay.className = `eg18-transition eg18-transition--${transitionType(screen)}`;
        $(".eg18-transition__label", overlay).textContent = label;
        void overlay.offsetWidth;
        overlay.classList.add("is-active");
        window.setTimeout(() => {
            if (typeof callback === "function") callback();
        }, 260);
        window.setTimeout(() => {
            overlay.classList.remove("is-active");
            transitionLocked = false;
            applySceneFrame();
        }, 720);
    }

    function go(screen, options = {}) {
        if (!screen || !originalSwitchScreen) return;
        if (!hasCareer() || isMenuScreen(screen) || options.instant) {
            originalSwitchScreen(screen, options);
            window.requestAnimationFrame(applySceneFrame);
            return;
        }
        transition(() => {
            originalSwitchScreen(screen, { ...options, instant: true });
            window.requestAnimationFrame(applySceneFrame);
        }, screen);
    }

    function installSwitchWrapper() {
        if (originalSwitchScreen || typeof window.switchScreen !== "function") return;
        originalSwitchScreen = window.switchScreen;
        window.switchScreen = function wrappedSwitchScreen(screen, options = {}) {
            go(screen, options);
        };
    }

    function screenClickHandler(event) {
        const sceneButton = event.target.closest("[data-eg18-screen]");
        const screenButton = sceneButton || event.target.closest("[data-screen]");
        if (!screenButton || screenButton.closest("#eg3-mobile-menu")) return;
        const screen = sceneButton ? sceneButton.dataset.eg18Screen : screenButton.dataset.screen;
        if (!screen || !hasCareer() || isMenuScreen(screen)) return;
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        go(screen);
    }

    function actionClickHandler(event) {
        const actionButton = event.target.closest("[data-action='advance-week']");
        if (!actionButton || !hasCareer()) return;
        if (actionButton.closest(".eg18-room-hub, .eg18-scene-bar")) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            transition(() => {
                if (typeof window.advanceWeek === "function") window.advanceWeek();
            }, "matchPreview");
        }
        actionButton.classList.add("eg18-action-pulse");
        window.setTimeout(() => actionButton.classList.remove("eg18-action-pulse"), 480);
    }

    function getClubSnapshot() {
        const game = state() || {};
        const club = game.club || {};
        const year = engine()?.getCurrentYear() || game.currentYear || game.season || 1970;
        const era = engine()?.getCurrentEra() || { title: "Anos 70", room: "Sala do treinador", philosophy: "O futebol muda dentro do escritório." };
        const leagueRow = game.leagueTable?.find?.((row) => row.clubId === club.id) || {};
        const nextMatch = game.schedule?.find?.((match) => !match.played) || {};
        const opponentId = nextMatch.homeId === club.id ? nextMatch.awayId : nextMatch.homeId;
        const opponent = game.clubs?.find?.((item) => item.id === opponentId) || {};
        const moraleAverage = Array.isArray(game.players) && game.players.length
            ? Math.round(game.players.reduce((sum, player) => sum + (player.morale || 55), 0) / game.players.length)
            : 55;
        return {
            clubName: club.name || engine()?.getClubName() || "Eleven Genesis",
            year,
            era,
            position: leagueRow.position || "-",
            points: leagueRow.points || 0,
            morale: moraleAverage,
            opponent: opponent.name || "próximo rival",
            fans: game.fans?.mood || game.fansMood || "em espera"
        };
    }

    function renderHub() {
        const screenRoot = root();
        if (!screenRoot || !hasCareer() || currentScreen() !== "home") return;
        const snap = getClubSnapshot();
        const memories = engine()?.getCareerMemories(snap.year) || [];
        const signature = `${snap.clubName}|${snap.year}|${snap.era.id}|${snap.position}|${snap.points}|${snap.morale}|${memories.length}`;
        if (lastHubSignature === signature && $(".eg18-room-hub", screenRoot)) return;
        lastHubSignature = signature;
        screenRoot.classList.remove("eg18-screen-shell");
        screenRoot.innerHTML = `
            <section class="eg18-room-hub scene-office" aria-label="Sala viva do treinador">
                <div class="eg18-camera-frame" aria-hidden="true"></div>
                <div class="eg18-window" aria-hidden="true"><span>${escapeHtml(snap.era.window || "Campo de treino")}</span></div>
                <div class="eg18-wall-memory" aria-label="Parede de memórias">
                    ${renderMemories(memories)}
                </div>
                <header class="eg18-room-title">
                    <span class="eg18-kicker">${escapeHtml(snap.clubName)} · ${escapeHtml(String(snap.year))} · ${escapeHtml(snap.era.title)}</span>
                    <h1>Sala do treinador</h1>
                    <p>${escapeHtml(snap.era.room)} ${escapeHtml(snap.era.philosophy)}</p>
                </header>
                <main class="eg18-desk" aria-label="Mesa do treinador">
                    <div class="eg18-quick-status" aria-label="Resumo da carreira">
                        <span class="eg18-pill">Posição <strong>${escapeHtml(String(snap.position))}</strong></span>
                        <span class="eg18-pill">Pontos <strong>${escapeHtml(String(snap.points))}</strong></span>
                        <span class="eg18-pill">Moral <strong>${escapeHtml(String(snap.morale))}</strong></span>
                        <span class="eg18-pill">Próximo <strong>${escapeHtml(snap.opponent)}</strong></span>
                    </div>
                    <div class="eg18-object-grid">
                        <button class="eg18-object primary" type="button" data-eg18-screen="matchPreview" data-eg18-camera="board"><span class="ico">▶</span><span><strong>Próximo jogo</strong><small>Preparar partida</small></span></button>
                        <button class="eg18-object" type="button" data-eg18-screen="tactics" data-eg18-camera="board"><span class="ico">📋</span><span><strong>Quadro</strong><small>Tática e escalação</small></span></button>
                        <button class="eg18-object" type="button" data-eg18-screen="market" data-eg18-camera="folder"><span class="ico">▤</span><span><strong>Fichário</strong><small>Mercado e contratos</small></span></button>
                        <button class="eg18-object" type="button" data-eg18-screen="scout" data-eg18-camera="phone"><span class="ico">☎</span><span><strong>Telefone</strong><small>Olheiros e relatórios</small></span></button>
                        <button class="eg18-object" type="button" data-eg18-screen="squad" data-eg18-camera="photos"><span class="ico">▧</span><span><strong>Fotos</strong><small>Elenco</small></span></button>
                        <button class="eg18-object wide" type="button" data-eg18-screen="calendar" data-eg18-camera="agenda"><span class="ico">📓</span><span><strong>Agenda</strong><small>Semana e calendário</small></span></button>
                        <button class="eg18-object" type="button" data-eg18-screen="league" data-eg18-camera="paper"><span class="ico">📰</span><span><strong>Jornal</strong><small>Liga e notícias</small></span></button>
                        <button class="eg18-object eg18-radio-object" type="button" data-eg18-screen="marketing" data-eg18-camera="radio"><span class="ico">◉</span><span><strong>Rádio</strong><small>Torcida e marca</small></span><i></i></button>
                        <button class="eg18-object" type="button" data-eg18-screen="club" data-eg18-camera="envelope"><span class="ico">✉</span><span><strong>Envelope</strong><small>Diretoria e estrutura</small></span></button>
                        <button class="eg18-object" type="button" data-action="advance-week"><span class="ico">▶</span><span><strong>Avançar</strong><small>Semana seguinte</small></span></button>
                    </div>
                </main>
                ${sceneBar()}
            </section>`;
    }

    function renderMemories(memories) {
        const fallback = [["XI", "Eleven Genesis"], ["🏆", "Taças"], ["📰", "Manchetes"], ["◉", "Rádio"]];
        const items = memories.length ? memories.slice(-4).map(([, title]) => [title.slice(0, 2).toUpperCase(), title]) : fallback;
        return items.map(([mark, title]) => `<div class="eg18-memory-item" title="${escapeAttr(title)}">${escapeHtml(mark)}</div>`).join("");
    }

    function sceneBar() {
        return `
            <nav class="eg18-scene-bar" aria-label="Atalhos de cena">
                <button type="button" data-eg18-screen="home" title="Sala">⌂</button>
                <button type="button" data-eg18-screen="tactics" title="Tática">📋</button>
                <button type="button" data-eg18-screen="market" title="Mercado">▤</button>
                <button type="button" data-eg18-screen="squad" title="Elenco">▧</button>
                <button type="button" data-eg18-screen="calendar" title="Agenda">📓</button>
                <button type="button" data-action="advance-week" title="Avançar">▶</button>
            </nav>`;
    }

    function applySceneFrame() {
        installSwitchWrapper();
        const screenRoot = root();
        if (!screenRoot) return;
        document.body.classList.toggle("eg18-scene-mode", hasCareer());
        if (!hasCareer() || isMenuScreen(currentScreen())) {
            screenRoot.classList.remove("eg18-screen-shell");
            return;
        }
        if (currentScreen() === "home") {
            renderHub();
            return;
        }
        lastHubSignature = "";
        screenRoot.classList.add("eg18-screen-shell");
        if (!$(".eg18-back-home", screenRoot)) {
            screenRoot.insertAdjacentHTML("afterbegin", `<button class="eg18-back-home" type="button" data-eg18-screen="home">Voltar para a sala</button>`);
        }
        if (!$(".eg18-scene-bar", screenRoot)) {
            screenRoot.insertAdjacentHTML("beforeend", sceneBar());
        }
    }

    function observeRoot() {
        const screenRoot = root();
        if (!screenRoot || rootObserver) return;
        rootObserver = new MutationObserver(() => window.requestAnimationFrame(applySceneFrame));
        rootObserver.observe(screenRoot, { childList: true, subtree: false });
    }

    function escapeHtml(value) {
        return String(value || "").replace(/[&<>]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[char]));
    }

    function escapeAttr(value) {
        return escapeHtml(value).replace(/"/g, "&quot;");
    }

    function init() {
        installSwitchWrapper();
        observeRoot();
        document.addEventListener("click", screenClickHandler, true);
        document.addEventListener("click", actionClickHandler, true);
        applySceneFrame();
        window.EG18Scene = { go, transition, applySceneFrame };
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
}());
