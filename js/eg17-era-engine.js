(function () {
    "use strict";

    const SAVE_KEY = "legendsDirectorSave";
    const ROOM_SAVE_KEY = "elevenGenesisRoomState";

    const ROUTES = {
        media: "newsCenter",
        contact: "scout",
        press: "league",
        schedule: "calendar",
        board: "tactics",
        squad: "squad",
        direction: "club",
        market: "market",
        analysis: "tactics",
        finance: "finances",
        memory: "club"
    };

    const ERA_TRANSITIONS = {
        "80": "Uma caixa chegou pela manhã. O presidente disse que a televisão colorida era exagero, mas pediu que ela ficasse no canto. O rádio não saiu: apenas ganhou companhia.",
        "90": "O computador entrou pela porta lateral. A madeira continuou a mesma, mas agora há uma tela verde refletida no verniz da mesa.",
        "00": "O primeiro e-mail chegou antes do telefone tocar. O mundo ficou menor, a espera ficou mais curta, e a pasta de contratos pareceu velha de repente.",
        "10": "A sala ganhou telas, dados e silêncio climatizado. O quadro antigo ficou na parede porque algumas decisões ainda precisam de giz.",
        "30": "A análise ficou quase invisível: telas integradas, scout global e previsões. Mesmo assim, o velho rádio permanece na estante como prova do começo."
    };

    const ERAS = [
        {
            id: "70", from: 1970, to: 1979, title: "Anos 70", range: "1970-1979",
            philosophy: "Informação lenta. Decisão por intuição.",
            room: "Madeira, couro, luz âmbar e papel.",
            window: "Campo de treino molhado, arquibancada de cimento, ônibus antigo e cidade baixa ao fundo.",
            sound: ["rádio AM", "relógio", "telefone de disco", "máquina de escrever", "chuva na janela"],
            mechanics: ["Scout presencial: 14 dias", "Negociação por carta ou telefone", "Resultados rivais chegam com atraso", "Relatórios incompletos e humanos"],
            objects: [
                ["media", "Rádio AM", "Notícias chegam com chiado e atraso.", "◉", "active"],
                ["contact", "Telefone de disco", "Olheiros, contatos e rumores.", "☎", "active"],
                ["press", "Jornal dobrado", "Liga, imprensa e moral do clube.", "📰", "active"],
                ["schedule", "Caderno espiral", "Semanas escritas à mão.", "📓", "active"],
                ["direction", "Envelope da diretoria", "Cobranças, cartas e contratos.", "✉", "active"],
                ["board", "Quadro de pinos", "Tática física, giz e alfinetes.", "⚽", "active"],
                ["squad", "Fotos granuladas", "Elenco como pessoas, não números.", "▧", "active"],
                ["market", "Pasta de contratos", "Mercado lento e incerto.", "▤", "active"]
            ]
        },
        {
            id: "80", from: 1980, to: 1989, title: "Anos 80", range: "1980-1989",
            philosophy: "A televisão chegou. Mais imagem, mais pressão, mas ainda tudo passa por mãos humanas.",
            room: "A mesma madeira, agora com plástico, TV CRT, fitas cassete e jornais coloridos.",
            window: "Refletores novos, cartazes de patrocinadores e noites mais barulhentas no estádio.",
            sound: ["TV CRT", "cassete rebobinando", "telefone fixo", "papel", "rádio ao fundo"],
            mechanics: ["Scout presencial: 10 dias", "Fitas de adversários desbloqueadas", "Imprensa mais agressiva", "Patrocínios começam a pesar"],
            objects: [
                ["media", "TV CRT", "Jogos, imagens e manchetes televisivas.", "📺", "active"],
                ["analysis", "Fita cassete", "Análise lenta: pausar, rebobinar, anotar.", "▰", "active"],
                ["contact", "Telefone branco", "Mais ligações, menos silêncio.", "☎", "active"],
                ["schedule", "Agenda de couro", "Calendário mais profissional.", "📒", "active"],
                ["press", "Jornais coloridos", "O futebol começa a vender imagem.", "🗞", "active"],
                ["board", "Quadro com post-its", "Camadas táticas e recados.", "📌", "active"],
                ["memory", "Rádio na estante", "O passado não saiu da sala.", "◉", "relic"],
                ["squad", "Fotos reveladas", "Jogadores ganham reputação pública.", "▧", "active"]
            ]
        },
        {
            id: "90", from: 1990, to: 1999, title: "Anos 90", range: "1990-1999",
            philosophy: "O digital entra, mas ainda cercado por papel. O treinador confia, desconfiando.",
            room: "Computador CRT, fax, impressora matricial e disquetes dividem espaço com a mesa antiga.",
            window: "Estádio em reforma, cidade mais ruidosa e brilho verde do monitor no vidro.",
            sound: ["fax", "impressora matricial", "beep do PC", "CRT", "telefone"],
            mechanics: ["Scout por fax: 7 dias", "Banco de dados básico", "Relatórios impressos toda semana", "Negociações menos lentas"],
            objects: [
                ["analysis", "Computador CRT", "Banco de dados básico de jogadores.", "🖥", "active"],
                ["market", "Fax", "Propostas chegam em papel térmico.", "▤", "active"],
                ["finance", "Impressora matricial", "Relatórios em pilhas barulhentas.", "▥", "active"],
                ["memory", "Disquetes", "Memória física e frágil.", "▣", "active"],
                ["media", "TV maior", "Mais imagens do adversário.", "📺", "active"],
                ["press", "Revistas e jornais", "Opinião especializada aparece.", "📰", "active"],
                ["board", "Quadro tático", "Giz continua mais rápido que mouse.", "⚽", "active"],
                ["memory", "Rádio antigo", "Agora relíquia da primeira década.", "◉", "relic"]
            ]
        },
        {
            id: "00", from: 2000, to: 2009, title: "Anos 2000", range: "2000-2009",
            philosophy: "Internet globaliza o futebol. A espera diminui, mas a ansiedade aumenta.",
            room: "LCD, e-mail, celular, projetor e cabos. Menos papel, mais mundo.",
            window: "Estádio remodelado, placas de patrocínio e cidade conectada.",
            sound: ["e-mail", "mouse", "teclado", "modem distante", "celular vibrando"],
            mechanics: ["Scout digital: 4 dias", "E-mail e mercado global", "Fóruns influenciam reputação", "Análise em apresentações"],
            objects: [
                ["analysis", "Monitor LCD", "Dados mais limpos e rápidos.", "▣", "active"],
                ["contact", "E-mail", "Comunicação quase instantânea.", "✉", "active"],
                ["market", "Internet", "Mercado e fóruns globais.", "🌐", "active"],
                ["contact", "Celular", "Contato móvel e urgência.", "▯", "active"],
                ["board", "Projetor", "Reunião tática para o elenco.", "▱", "active"],
                ["press", "Recortes restantes", "O papel ainda resiste.", "📰", "relic"],
                ["memory", "CRT na estante", "A tecnologia também envelhece.", "🖥", "relic"],
                ["squad", "Banco de scout", "Busca mais ampla e comparável.", "⌕", "active"]
            ]
        },
        {
            id: "10", from: 2010, to: 2024, title: "Anos 2010", range: "2010-2024",
            philosophy: "Dados em tempo real. O futebol vira operação, mas a sala ainda carrega cicatrizes.",
            room: "Múltiplas telas, tablet, câmeras, dashboards e parede cheia de memória.",
            window: "Arena moderna, centro de treinamento e noite azulada de monitor.",
            sound: ["ar-condicionado", "notificações", "teclado", "tablet", "silêncio de análise"],
            mechanics: ["Scout digital: 48 horas", "Dashboards de performance", "Análise por vídeo avançada", "Torcida reage nas redes"],
            objects: [
                ["finance", "Dashboards", "Finanças, reputação e performance.", "📊", "active"],
                ["squad", "Tablet", "Elenco por toque.", "▯", "active"],
                ["analysis", "Múltiplas telas", "Dados em paralelo.", "🖥", "active"],
                ["board", "Câmeras táticas", "Performance visual.", "▣", "active"],
                ["contact", "Rede global", "Scout mundial.", "🌍", "active"],
                ["memory", "Parede de memórias", "O clube lembra.", "🏆", "active"],
                ["board", "Quadro antigo", "A tática ainda é humana.", "⚽", "relic"],
                ["press", "Recortes antigos", "História emoldurada.", "📰", "relic"]
            ]
        },
        {
            id: "30", from: 2025, to: 2039, title: "2025-2030", range: "2025-2030+",
            philosophy: "Previsão, IA e análise integrada. Não é ciberpunk: é futebol moderno com memória.",
            room: "Vidro fosco, telas integradas, sensores e uma estante que parece museu da carreira.",
            window: "Centro de performance, arena madura e a cidade refletida em painéis discretos.",
            sound: ["notificação suave", "ar-condicionado", "toque em vidro", "dados sincronizando", "silêncio"],
            mechanics: ["Scout preditivo: 24 horas", "Relatórios comparativos instantâneos", "Risco de lesão monitorado", "Decisões ainda são suas"],
            objects: [
                ["analysis", "Mesa inteligente", "Dados integrados na superfície.", "▧", "active"],
                ["contact", "Assistente de scout", "Busca global com contexto humano.", "◌", "active"],
                ["finance", "Painel do clube", "Operação, marca e estádio.", "📊", "active"],
                ["board", "Parede tática", "Vídeo, desenho e simulação.", "▣", "active"],
                ["squad", "Tablet técnico", "Elenco, moral e carga.", "▯", "active"],
                ["memory", "Museu da sala", "Rádio, CRT, fax e taças juntos.", "🏆", "active"],
                ["media", "Rádio preservado", "O começo ainda observa.", "◉", "relic"],
                ["press", "Jornal emoldurado", "A memória virou arquitetura.", "📰", "relic"]
            ]
        }
    ];

    const CAREER_MEMORIES = [
        [1970, "Chave da sala", "A primeira manhã na cadeira de couro."],
        [1974, "Recorte amarelado", "Uma manchete que o clube nunca jogou fora."],
        [1980, "Rádio na estante", "O mundo ainda chia baixinho."],
        [1986, "Foto de vestiário", "A primeira geração que virou lembrança."],
        [1990, "Disquete etiquetado", "O começo do banco de dados."],
        [1998, "Fax térmico", "Uma proposta que quase apagou com o tempo."],
        [2001, "Primeiro e-mail", "O dia em que a espera encurtou."],
        [2010, "Tablet antigo", "O toque entrou na rotina."],
        [2025, "Rádio emoldurado", "A sala ficou moderna, mas não esqueceu."],
        [2030, "Parede completa", "A carreira inteira agora olha de volta."]
    ];

    const ROOM_MOODS = [
        ["Manhã de treino", "Café quente, janela aberta e papéis alinhados."],
        ["Semana pesada", "Caneta caída, jornal dobrado errado e telefone perto demais."],
        ["Véspera de clássico", "A mesa está limpa. Só o quadro e a agenda importam."],
        ["Depois da chuva", "O vidro embaça, a cidade some e o rádio parece mais alto."]
    ];

    let roomState = readRoomState();

    function readCareerSave() {
        try { return JSON.parse(localStorage.getItem(SAVE_KEY) || "null"); }
        catch (_) { return null; }
    }

    function normalizeRoomState(parsed) {
        return {
            lastYear: parsed && parsed.lastYear || 1970,
            lastEra: parsed && parsed.lastEra || "70",
            seenObjects: parsed && Array.isArray(parsed.seenObjects) ? parsed.seenObjects : [],
            unlockedMemories: parsed && Array.isArray(parsed.unlockedMemories) ? parsed.unlockedMemories : [],
            transitions: parsed && parsed.transitions && typeof parsed.transitions === "object" ? parsed.transitions : {},
            updatedAt: parsed && parsed.updatedAt || null
        };
    }

    function readRoomState() {
        try { return normalizeRoomState(JSON.parse(localStorage.getItem(ROOM_SAVE_KEY) || "null")); }
        catch (_) { return normalizeRoomState(null); }
    }

    function saveRoomState(patch) {
        roomState = {
            ...roomState,
            ...(patch || {}),
            updatedAt: new Date().toISOString()
        };
        try { localStorage.setItem(ROOM_SAVE_KEY, JSON.stringify(roomState)); }
        catch (_) { /* localStorage can be unavailable in strict browser modes. */ }
        return getRoomState();
    }

    function getRoomState() {
        return {
            ...roomState,
            seenObjects: [...roomState.seenObjects],
            unlockedMemories: [...roomState.unlockedMemories],
            transitions: { ...roomState.transitions }
        };
    }

    function getCurrentYear() {
        const save = readCareerSave() || {};
        const headerYear = (document.getElementById("header-season")?.textContent || "").match(/19\d{2}|20\d{2}/)?.[0];
        const raw = window.GameState?.currentYear || save.currentYear || save.year || save.season || headerYear || 1970;
        return Math.max(1970, parseInt(raw, 10) || 1970);
    }

    function getClubName() {
        const save = readCareerSave() || {};
        return window.GameState?.club?.name || save.club?.name || document.getElementById("header-club")?.textContent || "Eleven Genesis";
    }

    function getEraForYear(year) {
        const parsedYear = Math.max(1970, parseInt(year, 10) || 1970);
        return ERAS.find((era) => parsedYear >= era.from && parsedYear <= era.to) || ERAS[ERAS.length - 1];
    }

    function getCareerMemories(year) {
        const unlocked = CAREER_MEMORIES.filter(([unlock]) => year >= unlock);
        const unlockedKeys = unlocked.map(([, title]) => title);
        const merged = [...new Set([...(roomState.unlockedMemories || []), ...unlockedKeys])];
        if (merged.length !== (roomState.unlockedMemories || []).length) saveRoomState({ unlockedMemories: merged });
        return unlocked;
    }

    function getRoomMood(year) {
        return ROOM_MOODS[Math.abs(year) % ROOM_MOODS.length];
    }

    function rememberObject(key) {
        if (!key || roomState.seenObjects.includes(key)) return getRoomState();
        return saveRoomState({ seenObjects: [...roomState.seenObjects, key].slice(-120) });
    }

    function markTransitionSeen(eraId, year) {
        if (!eraId) return getRoomState();
        return saveRoomState({ transitions: { ...(roomState.transitions || {}), [eraId]: year || getCurrentYear() } });
    }

    function hasSeenTransition(eraId) {
        return Boolean(roomState.transitions && roomState.transitions[eraId]);
    }

    function getRouteForRole(role) {
        return ROUTES[role] || "home";
    }

    window.EG17EraEngine = {
        getEras: () => ERAS.map((era) => ({ ...era, sound: [...era.sound], mechanics: [...era.mechanics], objects: era.objects.map((object) => [...object]) })),
        getCurrentYear,
        getClubName,
        getEraForYear,
        getCurrentEra: () => getEraForYear(getCurrentYear()),
        getRoomState,
        saveRoomState,
        rememberObject,
        getCareerMemories,
        getRoomMood,
        getTransitionText: (eraId) => ERA_TRANSITIONS[eraId] || "",
        hasSeenTransition,
        markTransitionSeen,
        getRouteForRole,
        getMechanics: () => [...getEraForYear(getCurrentYear()).mechanics]
    };
}());
