(function () {
    "use strict";

    const SAVE_KEY = "legendsDirectorSave";
    const MENU_PREFS_KEY = "legendsDirectorMenuPrefs";
    const MARKET_FAVORITES_KEY = "legendsDirectorMarketFavorites";
    const SAVE_VERSION = 4;
    const GAME_VERSION = "Alpha 0.5.1";
    const START_YEAR = 1970;
    const NEWS_CATEGORIES = ["Clube", "Liga", "Mercado", "Diretoria", "Torcida", "Lesões", "Jovens", "Financeiro"];
    const PLAYER_POSITIONS = ["GK", "RB", "CB", "LB", "RWB", "LWB", "CDM", "CM", "CAM", "RM", "LM", "RW", "LW", "CF", "ST"];
    const PLAYER_ATTRIBUTES = ["pace", "shooting", "passing", "dribbling", "defending", "physical", "goalkeeping", "vision", "technique", "stamina", "leadership", "mentality"];
    const SCOUT_REGIONS = ["southAmerica", "northAmerica", "europe", "africa", "asia", "oceania"];
    const ATTRIBUTE_LABELS = {
        pace: "Pace",
        shooting: "Shooting",
        passing: "Passing",
        dribbling: "Dribbling",
        defending: "Defending",
        physical: "Physical",
        goalkeeping: "Goalkeeping",
        vision: "Vision",
        technique: "Technique",
        stamina: "Stamina",
        leadership: "Leadership",
        mentality: "Mentality"
    };
    const POSITION_WEIGHTS = {
        GK: { goalkeeping: 0.42, mentality: 0.13, leadership: 0.1, physical: 0.1, passing: 0.08, technique: 0.07, vision: 0.05, stamina: 0.05 },
        RB: { pace: 0.18, defending: 0.2, stamina: 0.14, physical: 0.12, passing: 0.1, dribbling: 0.08, technique: 0.08, mentality: 0.06, vision: 0.04 },
        CB: { defending: 0.3, physical: 0.18, mentality: 0.12, leadership: 0.1, stamina: 0.09, passing: 0.08, pace: 0.06, technique: 0.04, vision: 0.03 },
        LB: { pace: 0.18, defending: 0.2, stamina: 0.14, physical: 0.12, passing: 0.1, dribbling: 0.08, technique: 0.08, mentality: 0.06, vision: 0.04 },
        RWB: { pace: 0.19, stamina: 0.17, defending: 0.16, dribbling: 0.12, passing: 0.1, physical: 0.09, technique: 0.08, vision: 0.05, mentality: 0.04 },
        LWB: { pace: 0.19, stamina: 0.17, defending: 0.16, dribbling: 0.12, passing: 0.1, physical: 0.09, technique: 0.08, vision: 0.05, mentality: 0.04 },
        CDM: { defending: 0.21, physical: 0.15, passing: 0.14, mentality: 0.12, stamina: 0.1, vision: 0.09, leadership: 0.08, technique: 0.07, pace: 0.04 },
        CM: { passing: 0.18, vision: 0.15, stamina: 0.12, technique: 0.12, mentality: 0.1, dribbling: 0.09, defending: 0.08, physical: 0.08, leadership: 0.05, pace: 0.03 },
        CAM: { vision: 0.19, technique: 0.17, passing: 0.15, dribbling: 0.14, shooting: 0.1, mentality: 0.08, pace: 0.06, stamina: 0.05, leadership: 0.03, physical: 0.03 },
        RM: { pace: 0.16, dribbling: 0.15, passing: 0.13, stamina: 0.12, technique: 0.12, vision: 0.08, shooting: 0.08, defending: 0.06, mentality: 0.05, physical: 0.05 },
        LM: { pace: 0.16, dribbling: 0.15, passing: 0.13, stamina: 0.12, technique: 0.12, vision: 0.08, shooting: 0.08, defending: 0.06, mentality: 0.05, physical: 0.05 },
        RW: { pace: 0.18, dribbling: 0.18, technique: 0.13, shooting: 0.12, passing: 0.09, vision: 0.08, stamina: 0.07, mentality: 0.06, physical: 0.05, defending: 0.04 },
        LW: { pace: 0.18, dribbling: 0.18, technique: 0.13, shooting: 0.12, passing: 0.09, vision: 0.08, stamina: 0.07, mentality: 0.06, physical: 0.05, defending: 0.04 },
        CF: { technique: 0.16, shooting: 0.16, vision: 0.13, dribbling: 0.13, passing: 0.1, mentality: 0.09, pace: 0.08, physical: 0.07, stamina: 0.05, leadership: 0.03 },
        ST: { shooting: 0.24, physical: 0.13, pace: 0.12, technique: 0.11, mentality: 0.1, dribbling: 0.09, stamina: 0.07, vision: 0.06, leadership: 0.04, passing: 0.04 }
    };
    const BASE_FORMATIONS = {
        "4-4-2": [[50, 91], [17, 73], [39, 75], [61, 75], [83, 73], [18, 50], [40, 51], [60, 51], [82, 50], [42, 22], [58, 22]],
        "4-3-3": [[50, 91], [17, 73], [39, 75], [61, 75], [83, 73], [34, 53], [50, 48], [66, 53], [20, 23], [50, 17], [80, 23]],
        "4-2-3-1": [[50, 91], [17, 73], [39, 75], [61, 75], [83, 73], [41, 58], [59, 58], [22, 36], [50, 32], [78, 36], [50, 16]],
        "3-5-2": [[50, 91], [30, 75], [50, 78], [70, 75], [13, 48], [35, 54], [50, 47], [65, 54], [87, 48], [42, 20], [58, 20]],
        "5-3-2": [[50, 91], [12, 68], [30, 75], [50, 78], [70, 75], [88, 68], [35, 51], [50, 48], [65, 51], [42, 21], [58, 21]]
    };
    const MENTALITIES = ["Muito defensiva", "Defensiva", "Equilibrada", "Ofensiva", "Muito ofensiva"];
    const PLAY_STYLES = ["Posse", "Contra-ataque", "Bola longa", "Pressão alta", "Defesa baixa", "Tiki-taka", "Vertical"];
    const SET_PIECES = ["captain", "penalties", "freeKicks", "corners"];
    const SET_PIECE_LABELS = { captain: "Capitão", penalties: "Pênaltis", freeKicks: "Faltas", corners: "Escanteios" };
    const LANGUAGE_KEYS = {
        "Português": "pt-BR",
        "English": "en",
        "Español": "es"
    };
    const I18N = {
        "pt-BR": {
            "brand.name": "Eleven Genesis",
            "brand.initials": "EG",
            "brand.tagline": "Football Manager Premium",
            "brand.version": "Versão {version}",
            "splash.loading": "Carregando sua jornada...",
            "splash.alpha": "Versão Alpha",
            "menu.newCareer": "Nova Carreira",
            "menu.continueCareer": "Continuar Carreira",
            "menu.noCareer": "Nenhuma carreira encontrada.",
            "menu.settings": "Configurações",
            "menu.language": "Idioma",
            "menu.credits": "Créditos",
            "menu.lastSave": "Último save",
            "menu.currentClub": "Clube atual",
            "menu.season": "Temporada",
            "menu.alpha": "Alpha",
            "menu.noClub": "Nenhum clube",
            "menu.never": "Nunca",
            "settings.title": "Configurações",
            "settings.subtitle": "Ajustes da carreira e preferências do jogo.",
            "settings.audio": "Áudio",
            "settings.volume": "Volume",
            "settings.currentVolume": "Volume atual",
            "settings.language": "Idioma",
            "settings.save": "Salvar",
            "settings.load": "Carregar",
            "settings.resetCareer": "Resetar carreira",
            "settings.back": "Voltar",
            "settings.autoSave": "Auto-save",
            "settings.autoSaveText": "Salva automaticamente ao trocar de tela e avançar a semana.",
            "settings.active": "Ativo",
            "settings.inactive": "Inativo",
            "settings.enable": "Ativar",
            "settings.disable": "Desativar",
            "settings.saved": "Carreira salva.",
            "settings.languageChanged": "Idioma: {language}.",
            "clubSelect.title": "Escolha seu clube",
            "clubSelect.subtitle": "Você assume o vestiário, a torcida e a pressão de um projeto real de futebol.",
            "clubSelect.reputation": "Reputação",
            "clubSelect.budget": "Orçamento",
            "clubSelect.difficulty": "Dificuldade",
            "clubSelect.expectation": "Expectativa",
            "clubSelect.stadium": "Estádio",
            "clubSelect.city": "Cidade",
            "clubSelect.accept": "Assumir o clube",
            "clubSelect.easy": "Alta pressão",
            "clubSelect.medium": "Projeto competitivo",
            "clubSelect.hard": "Reconstrução",
            "clubSelect.challenge.giant": "Um gigante exige vitórias imediatas, elenco forte e presença constante no topo.",
            "clubSelect.challenge.big": "Clube de massa, calendário intenso e cobrança por campanha continental.",
            "clubSelect.challenge.medium": "Projeto de crescimento, torcida exigente e espaço para construir identidade.",
            "clubSelect.challenge.small": "Desafio duro: pouco orçamento, muita paixão e cada ponto vale uma história.",
            "nav.home": "Home",
            "nav.squad": "Elenco",
            "nav.tactics": "Tática",
            "nav.league": "Liga",
            "nav.club": "Clube",
            "nav.settings": "Configurações",
            "home.coachRoom": "Sala do Treinador",
            "home.coach": "Treinador",
            "home.season": "Temporada",
            "home.division": "Divisão",
            "home.position": "Posição",
            "home.week": "Semana",
            "home.nextMatch": "Próxima Partida",
            "home.prepareMatch": "Preparar Partida",
            "home.lastResult": "Último Resultado",
            "home.headline": "Manchete",
            "home.objective": "Objetivo Principal",
            "home.morale": "Moral",
            "home.fans": "Torcida",
            "home.board": "Diretoria",
            "home.market": "Mercado",
            "home.structure": "Estrutura",
            "home.finances": "Finanças",
            "home.competition": "Competição",
            "home.date": "Data",
            "home.location": "Local",
            "home.home": "Casa",
            "home.away": "Fora",
            "home.press": "Imprensa",
            "home.mvp": "MVP",
            "home.goals": "Gols",
            "home.advanceWeek": "Avançar Semana",
            "home.save": "Salvar",
            "home.menu": "Menu",
            "home.open": "Abrir",
            "home.noRecentSigning": "Sem contratação recente",
            "home.noOtherNews": "Semana focada no campo",
            "home.happy": "felizes",
            "home.energy": "energia",
            "home.points": "pts",
            "home.goalDifference": "saldo",
            "home.available": "disponíveis",
            "home.scout": "Scout",
            "home.academy": "Base",
            "home.coachSummary.good": "O clube vive uma semana de confiança e a arquibancada espera protagonismo.",
            "home.coachSummary.warning": "A semana pede resposta: elenco, torcida e diretoria aguardam sinais claros.",
            "home.coachSummary.neutral": "O trabalho segue no centro de treinamento, com decisões importantes pela frente.",
            "home.press.home": "A imprensa local fala em obrigação de controlar o jogo desde o primeiro minuto.",
            "home.press.away": "Fora de casa, o plano precisa ser frio: competir, sofrer pouco e atacar no momento certo.",
            "home.headline.derby": "Clássico decisivo neste fim de semana.",
            "home.headline.win": "A torcida espera mais uma vitória.",
            "home.headline.market": "Novo reforço movimenta os bastidores.",
            "home.headline.finance": "As finanças preocupam a diretoria.",
            "home.headline.default": "Semana grande no comando do clube.",
            "nav.market": "Mercado",
            "nav.scout": "Scout",
            "nav.academy": "Base",
            "nav.marketing": "Marketing",
            "calendar.title": "Calendário",
            "calendar.previousWeek": "Semana anterior",
            "calendar.nextWeek": "Semana seguinte",
            "calendar.week": "Semana",
            "calendar.round": "Rodada",
            "calendar.transferOpen": "Janela de transferências",
            "calendar.transferClosed": "Mercado em ritmo normal",
            "calendar.internationalBreak": "Pausa para seleções",
            "calendar.clubWeek": "Semana de clube",
            "calendar.upcoming": "Próximas partidas",
            "calendar.next": "Próximo",
            "calendar.latestResults": "Últimos resultados",
            "calendar.noResults": "Nenhum resultado registrado.",
            "calendar.competitions": "Competições em andamento",
            "calendar.future": "Preparação futura",
            "calendar.futureText": "Champions, Libertadores, Mundial, Copa Nacional, Seleções, Hall da Fama e recordes históricos estão reservados na arquitetura.",
            "calendar.trainingAndMatch": "Semana de treinos e jogo",
            "calendar.nationalBreakPlanned": "Pausa para seleções prevista",
            "notifications.title": "Central de Notificações",
            "notifications.subtitle": "Acontecimentos do clube, mercado, finanças e temporada.",
            "notifications.clear": "Limpar",
            "notifications.open": "Abrir",
            "notifications.markRead": "Marcar como lida",
            "notifications.read": "Lida",
            "notifications.empty": "Nenhuma notificação salva.",
            "notifications.nonePending": "Nenhuma notificação pendente",
            "notifications.saved": "Central salva todos os acontecimentos.",
            "notifications.new": "novas",
            "summary.title": "Resumo da Semana",
            "summary.close": "Fechar",
            "summary.football": "Futebol",
            "summary.club": "Clube",
            "summary.finance": "Financeiro",
            "summary.market": "Mercado",
            "summary.academy": "Base",
            "summary.structure": "Estrutura",
            "summary.news": "Notícias",
            "summary.narratives": "Narrativas",
            "summary.best": "Melhor",
            "summary.worst": "Pior",
            "summary.position": "Classificação",
            "summary.fans": "Torcida",
            "summary.morale": "Moral",
            "summary.board": "Diretoria",
            "summary.income": "Receitas",
            "summary.expenses": "Despesas",
            "summary.balance": "Novo saldo",
            "summary.observed": "Observados",
            "summary.negotiations": "Negociações",
            "summary.opportunities": "Oportunidades",
            "summary.noNews": "Sem manchetes novas.",
            "summary.openCalendar": "Abrir Calendário",
            "summary.notifications": "Notificações",
            "summary.noUpdates": "Sem novidades",
            "summary.newTalents": "Novos talentos",
            "summary.activeImprovements": "Melhorias em andamento",
            "summary.previousQueue": "Fila anterior",
            "weekly.narrative.win": "A torcida comemorou uma vitória importante e o ambiente no clube ficou mais leve.",
            "weekly.narrative.loss": "A derrota trouxe cobrança interna, mas a comissão já iniciou a reação para a próxima semana.",
            "weekly.narrative.draw": "O empate manteve a temporada em aberto e dividiu opiniões nas arquibancadas.",
            "weekly.narrative.boardHappy": "O presidente demonstrou satisfação com o trabalho realizado.",
            "weekly.narrative.fansHappy": "Os torcedores apareceram mais confiantes nas conversas da semana.",
            "weekly.narrative.academy": "Um jovem da base chamou atenção da comissão técnica.",
            "weekly.narrative.quiet": "A semana foi de trabalho silencioso, ajustes internos e preparação para os próximos compromissos.",
            "marketing.title": "Marketing",
            "marketing.subtitle": "Patrocínios, campanhas e loja oficial como novas fontes de receita.",
            "marketing.masterSponsor": "Patrocinador Master",
            "marketing.secondarySponsor": "Patrocinador Secundário",
            "marketing.materialSupplier": "Fornecedor de Material",
            "marketing.officialStore": "Loja Oficial",
            "marketing.proposals": "Propostas de patrocínio",
            "marketing.accept": "Aceitar",
            "marketing.reject": "Recusar",
            "marketing.negotiate": "Negociar",
            "marketing.accepted": "Proposta aceita.",
            "marketing.rejected": "Proposta recusada.",
            "marketing.negotiated": "Proposta renegociada.",
            "marketing.noProposals": "Nenhuma proposta disponível.",
            "marketing.weeklyValue": "Valor semanal",
            "marketing.reputationFit": "Aderência à reputação",
            "marketing.fanReach": "Alcance da torcida",
            "marketing.storeSales": "Vendas estimadas",
            "marketing.storeRevenue": "Receita semanal",
            "marketing.bestShirt": "Camisa mais vendida",
            "marketing.campaigns": "Campanhas",
            "marketing.runCampaign": "Executar campanha",
            "marketing.campaignActive": "Campanha executada.",
            "marketing.futureStore": "Arquitetura da loja",
            "marketing.futureStoreText": "Camisas, bonés, cachecóis, bolas e produtos comemorativos já possuem pontos de evolução preparados.",
            "marketing.campaign.fanDay": "Dia do Torcedor",
            "marketing.campaign.ticketPromo": "Promoção de Ingressos",
            "marketing.campaign.idolEvent": "Evento com Ídolo",
            "marketing.campaign.shirtWeek": "Semana da Camisa",
            "marketing.none": "Sem contrato",
            "academy.title": "Categorias de Base",
            "academy.subtitle": "Formação de jovens talentos para sustentar a evolução do clube ao longo dos anos.",
            "academy.level": "Nível da Base",
            "academy.youngsters": "Jovens",
            "academy.averageQuality": "Qualidade média",
            "academy.weeklyInvestment": "Investimento semanal",
            "academy.evolution": "Evolução da Base",
            "academy.events": "Eventos da Base",
            "academy.noEvents": "Nenhum evento recente da Base.",
            "academy.noPlayers": "Nenhum jovem cadastrado na Base.",
            "academy.promote": "Promover ao elenco",
            "academy.keep": "Manter na Base",
            "academy.promoted": "Jovem promovido ao elenco.",
            "academy.kept": "Jovem mantido na Base.",
            "academy.generated": "Novo jovem revelado pela Base.",
            "academy.futureArchitecture": "Arquitetura preparada",
            "academy.futureArchitectureText": "Empréstimos, time B, Sub-17 e Sub-20 já possuem pontos reservados para futuras missões.",
            "academy.height": "Altura",
            "academy.weight": "Peso",
            "academy.foot": "Pé dominante",
            "academy.personality": "Personalidade",
            "academy.interest": "Interesse externo",
            "academy.event.striker": "Um atacante promissor surgiu na Base.",
            "academy.event.midfielder": "O treinador da Base recomenda promover um volante.",
            "academy.event.interest": "Um jovem despertou interesse de clubes.",
            "academy.event.generic": "A Base apresentou um novo jovem para avaliação.",
            "scout.title": "Rede de Observação",
            "scout.subtitle": "Conhecimento conquistado semana a semana pelo departamento de Scout.",
            "scout.level": "Nível atual do Scout",
            "scout.accuracy": "Precisão da análise",
            "scout.capacity": "Jogadores simultâneos",
            "scout.averageTime": "Tempo médio de observação",
            "scout.regions": "Regiões observadas",
            "scout.observedPlayers": "Jogadores observados",
            "scout.inProgress": "Observação em andamento",
            "scout.lastReport": "Último relatório",
            "scout.noReport": "Nenhum relatório concluído.",
            "scout.open": "Abrir Scout",
            "scout.week": "Semana",
            "scout.weeks": "semanas",
            "scout.progress": "Progresso",
            "scout.report": "Relatório",
            "scout.reportPending": "Relatório em construção.",
            "scout.completeReport": "Relatório completo",
            "scout.knownData": "Informações conhecidas",
            "scout.hiddenData": "Informações ainda ocultas",
            "scout.addFromMarket": "Adicionar pelo Mercado",
            "scout.remove": "Encerrar observação",
            "scout.completed": "Completo",
            "scout.active": "Em andamento",
            "scout.capacityFull": "Capacidade máxima de observação atingida.",
            "scout.started": "Observação iniciada.",
            "scout.removed": "Observação encerrada.",
            "scout.updated": "Relatórios do Scout atualizados.",
            "scout.noObserved": "Nenhum jogador em observação.",
            "scout.goMarket": "Ir ao Mercado",
            "scout.overallApprox": "Overall aproximado",
            "scout.potentialApprox": "Potencial aproximado",
            "scout.secondaryPositions": "Posições secundárias",
            "scout.morale": "Moral",
            "scout.fitness": "Condição",
            "scout.name": "Nome",
            "scout.club": "Clube",
            "scout.age": "Idade",
            "scout.nationality": "Nacionalidade",
            "scout.recommendation.greatPotential": "Grande potencial para o futuro.",
            "scout.recommendation.physical": "Excelente fisicamente.",
            "scout.recommendation.consistent": "Muito consistente.",
            "scout.recommendation.growth": "Pode evoluir bastante.",
            "scout.recommendation.notRecommended": "Não recomendamos a contratação.",
            "region.southAmerica": "América do Sul",
            "region.northAmerica": "América do Norte",
            "region.europe": "Europa",
            "region.africa": "África",
            "region.asia": "Ásia",
            "region.oceania": "Oceania",
            "market.title": "Mercado de Transferências",
            "market.subtitle": "Jogadores disponíveis, observados, favoritos e negociações ativas.",
            "market.balance": "Saldo disponível",
            "market.search": "Pesquisar por nome",
            "market.searchPlaceholder": "Nome do jogador",
            "market.filters": "Filtros",
            "market.sort": "Ordenação",
            "market.clearFilters": "Limpar filtros",
            "market.noPlayers": "Mercado sem jogadores disponíveis.",
            "market.openDetails": "Abrir detalhes",
            "market.currentClub": "Clube atual",
            "market.nationality": "Nacionalidade",
            "market.age": "Idade",
            "market.years": "anos",
            "market.position": "Posição",
            "market.overall": "Overall",
            "market.potential": "Potencial",
            "market.value": "Valor de mercado",
            "market.salary": "Salário",
            "market.contractTime": "Tempo de contrato",
            "market.contractStatus": "Situação contratual",
            "market.careerPhase": "Fase da carreira",
            "market.morale": "Moral",
            "market.fitness": "Condição física",
            "market.attributes": "Atributos",
            "market.careerEvolution": "Evolução da carreira",
            "market.primaryPosition": "Posição principal",
            "market.secondaryPositions": "Posições secundárias",
            "market.history": "Histórico resumido",
            "market.details": "Detalhes do jogador",
            "market.back": "Voltar ao mercado",
            "market.watch": "Observar",
            "market.watched": "Observado",
            "market.makeOffer": "Fazer proposta",
            "market.negotiateSalary": "Negociar salário",
            "market.negotiateContract": "Negociar contrato",
            "market.addFavorite": "Adicionar aos favoritos",
            "market.removeFavorite": "Remover dos favoritos",
            "market.cancelNegotiation": "Cancelar negociação",
            "market.negotiationStatus": "Negociação",
            "market.noNegotiation": "Sem negociação ativa",
            "market.offerAccepted": "Proposta aceita.",
            "market.offerRejected": "Proposta recusada.",
            "market.counterOffer": "Contraproposta recebida.",
            "market.salaryAdjusted": "Salário negociado.",
            "market.contractAdjusted": "Contrato negociado.",
            "market.negotiationCancelled": "Negociação cancelada.",
            "market.favoriteAdded": "Jogador adicionado aos favoritos.",
            "market.favoriteRemoved": "Jogador removido dos favoritos.",
            "market.watchAdded": "Jogador marcado para observação.",
            "market.watchRemoved": "Jogador removido da observação.",
            "market.insufficientFunds": "Dinheiro insuficiente para concluir a contratação.",
            "market.signed": "Contratação concluída.",
            "market.offerValue": "Valor da proposta",
            "market.counterValue": "Valor pedido",
            "market.salaryDemand": "Salário pedido",
            "market.contractDemand": "Contrato pedido",
            "market.futureReady": "Integrações preparadas",
            "market.futureReadyText": "Scout, base, empresários, empréstimos, cláusulas, pré-contratos e transferências internacionais já possuem pontos de integração reservados.",
            "market.quickOpen": "Abrir rapidamente",
            "market.favorites": "Favoritos",
            "market.none": "Nenhum",
            "market.modalTitle": "Escolher filtro",
            "market.close": "Fechar",
            "filter.position": "Posição",
            "filter.age": "Idade",
            "filter.overall": "Overall",
            "filter.potential": "Potencial",
            "filter.nationality": "Nacionalidade",
            "filter.value": "Valor",
            "filter.salary": "Salário",
            "filter.contract": "Situação contratual",
            "filter.club": "Clube",
            "filter.phase": "Fase da carreira",
            "filter.all": "Todos",
            "range.any": "Todos",
            "range.age.u21": "Até 21",
            "range.age.22-27": "22 a 27",
            "range.age.28-32": "28 a 32",
            "range.age.o32": "Acima de 32",
            "range.rating.u70": "Até 70",
            "range.rating.71-80": "71 a 80",
            "range.rating.81-88": "81 a 88",
            "range.rating.o88": "Acima de 88",
            "range.money.low": "Baixo",
            "range.money.medium": "Médio",
            "range.money.high": "Alto",
            "sort.overall": "Overall",
            "sort.potential": "Potencial",
            "sort.age": "Idade",
            "sort.value": "Valor",
            "sort.salary": "Salário",
            "sort.name": "Nome",
            "sort.club": "Clube",
            "sort.nationality": "Nacionalidade",
            "position.GK": "Goleiro",
            "position.RB": "Lateral direito",
            "position.CB": "Zagueiro",
            "position.LB": "Lateral esquerdo",
            "position.RWB": "Ala direito",
            "position.LWB": "Ala esquerdo",
            "position.CDM": "Volante",
            "position.CM": "Meio-campista",
            "position.CAM": "Meia ofensivo",
            "position.RM": "Meia direito",
            "position.LM": "Meia esquerdo",
            "position.RW": "Ponta direita",
            "position.LW": "Ponta esquerda",
            "position.CF": "Segundo atacante",
            "position.ST": "Centroavante",
            "contract.expiring": "Em fim de contrato",
            "contract.short": "Contrato curto",
            "contract.stable": "Contrato estável",
            "contract.long": "Contrato longo",
            "phase.Ainda não estreou": "Ainda não estreou",
            "phase.Jovem promessa": "Jovem promessa",
            "phase.Em crescimento": "Em crescimento",
            "phase.Auge": "Auge",
            "phase.Experiente": "Experiente",
            "phase.Declínio": "Declínio",
            "phase.Aposentado": "Aposentado",
            "country.Brasil": "Brasil",
            "country.Portugal": "Portugal",
            "country.Espanha": "Espanha",
            "country.Chile": "Chile",
            "country.Angola": "Angola",
            "country.Uruguai": "Uruguai",
            "country.Alemanha": "Alemanha",
            "country.Argentina": "Argentina",
            "country.Inglaterra": "Inglaterra",
            "country.Italia": "Itália",
            "country.Uniao Sovietica": "União Soviética",
            "country.Franca": "França",
            "country.Holanda": "Holanda",
            "country.Croacia": "Croácia",
            "country.Iugoslavia": "Iugoslávia",
            "country.Indefinido": "Indefinido",
            "attribute.pace": "Ritmo",
            "attribute.shooting": "Finalização",
            "attribute.passing": "Passe",
            "attribute.dribbling": "Drible",
            "attribute.defending": "Defesa",
            "attribute.physical": "Físico",
            "attribute.goalkeeping": "Goleiro",
            "attribute.vision": "Visão",
            "attribute.technique": "Técnica",
            "attribute.stamina": "Fôlego",
            "attribute.leadership": "Liderança",
            "attribute.mentality": "Mentalidade"
        },
        en: {},
        es: {}
    };
    I18N.en = {
        ...I18N["pt-BR"],
        "brand.tagline": "Premium Football Manager",
        "brand.version": "Version {version}",
        "splash.loading": "Loading your journey...",
        "splash.alpha": "Alpha Version",
        "menu.newCareer": "New Career",
        "menu.continueCareer": "Continue Career",
        "menu.noCareer": "No career found.",
        "menu.settings": "Settings",
        "menu.language": "Language",
        "menu.credits": "Credits",
        "menu.lastSave": "Last save",
        "menu.currentClub": "Current club",
        "menu.season": "Season",
        "menu.alpha": "Alpha",
        "menu.noClub": "No club",
        "menu.never": "Never",
        "settings.title": "Settings",
        "settings.subtitle": "Career settings and game preferences.",
        "settings.audio": "Audio",
        "settings.volume": "Volume",
        "settings.currentVolume": "Current volume",
        "settings.language": "Language",
        "settings.save": "Save",
        "settings.load": "Load",
        "settings.resetCareer": "Reset career",
        "settings.back": "Back",
        "settings.autoSave": "Auto-save",
        "settings.autoSaveText": "Saves automatically when changing screens and advancing the week.",
        "settings.active": "Active",
        "settings.inactive": "Inactive",
        "settings.enable": "Enable",
        "settings.disable": "Disable",
        "settings.saved": "Career saved.",
        "settings.languageChanged": "Language: {language}.",
        "nav.home": "Home",
        "nav.squad": "Squad",
        "nav.tactics": "Tactics",
        "nav.league": "League",
        "nav.club": "Club",
        "nav.settings": "Settings",
        "nav.market": "Market",
        "nav.academy": "Academy",
        "nav.marketing": "Marketing",
        "marketing.title": "Marketing",
        "marketing.subtitle": "Sponsorships, campaigns and official store as new revenue sources.",
        "marketing.masterSponsor": "Main Sponsor",
        "marketing.secondarySponsor": "Secondary Sponsor",
        "marketing.materialSupplier": "Kit Supplier",
        "marketing.officialStore": "Official Store",
        "marketing.proposals": "Sponsorship proposals",
        "marketing.accept": "Accept",
        "marketing.reject": "Reject",
        "marketing.negotiate": "Negotiate",
        "marketing.accepted": "Proposal accepted.",
        "marketing.rejected": "Proposal rejected.",
        "marketing.negotiated": "Proposal negotiated.",
        "marketing.noProposals": "No proposals available.",
        "marketing.weeklyValue": "Weekly value",
        "marketing.storeSales": "Estimated sales",
        "marketing.storeRevenue": "Weekly revenue",
        "marketing.bestShirt": "Best-selling shirt",
        "marketing.campaigns": "Campaigns",
        "marketing.runCampaign": "Run campaign",
        "marketing.campaignActive": "Campaign executed.",
        "marketing.futureStore": "Store architecture",
        "marketing.futureStoreText": "Shirts, caps, scarves, balls and commemorative products already have prepared evolution points.",
        "academy.title": "Youth Academy",
        "academy.subtitle": "Youth development for long-term club growth.",
        "academy.level": "Academy level",
        "academy.youngsters": "Youngsters",
        "academy.averageQuality": "Average quality",
        "academy.weeklyInvestment": "Weekly investment",
        "academy.evolution": "Academy evolution",
        "academy.events": "Academy events",
        "academy.noEvents": "No recent academy events.",
        "academy.noPlayers": "No youngsters in the academy.",
        "academy.promote": "Promote to squad",
        "academy.keep": "Keep in academy",
        "academy.promoted": "Youngster promoted to the squad.",
        "academy.kept": "Youngster kept in the academy.",
        "academy.generated": "New youngster developed by the academy.",
        "academy.futureArchitecture": "Prepared architecture",
        "academy.futureArchitectureText": "Loans, B team, Under-17 and Under-20 have reserved integration points for future missions.",
        "market.title": "Transfer Market",
        "market.subtitle": "Available, scouted, favorite players and active negotiations.",
        "market.balance": "Available balance",
        "market.search": "Search by name",
        "market.searchPlaceholder": "Player name",
        "market.sort": "Sort",
        "market.clearFilters": "Clear filters",
        "market.noPlayers": "No players available on the market.",
        "market.currentClub": "Current club",
        "market.nationality": "Nationality",
        "market.age": "Age",
        "market.years": "years",
        "market.position": "Position",
        "market.value": "Market value",
        "market.salary": "Salary",
        "market.contractTime": "Contract time",
        "market.contractStatus": "Contract status",
        "market.careerPhase": "Career phase",
        "market.morale": "Morale",
        "market.fitness": "Fitness",
        "market.attributes": "Attributes",
        "market.careerEvolution": "Career evolution",
        "market.primaryPosition": "Main position",
        "market.secondaryPositions": "Secondary positions",
        "market.history": "Short history",
        "market.details": "Player details",
        "market.back": "Back to market",
        "market.watch": "Scout",
        "market.watched": "Scouted",
        "market.makeOffer": "Make offer",
        "market.negotiateSalary": "Negotiate salary",
        "market.negotiateContract": "Negotiate contract",
        "market.addFavorite": "Add to favorites",
        "market.removeFavorite": "Remove from favorites",
        "market.cancelNegotiation": "Cancel negotiation",
        "market.negotiationStatus": "Negotiation",
        "market.noNegotiation": "No active negotiation",
        "market.offerAccepted": "Offer accepted.",
        "market.offerRejected": "Offer rejected.",
        "market.counterOffer": "Counteroffer received.",
        "market.salaryAdjusted": "Salary negotiated.",
        "market.contractAdjusted": "Contract negotiated.",
        "market.negotiationCancelled": "Negotiation cancelled.",
        "market.favoriteAdded": "Player added to favorites.",
        "market.favoriteRemoved": "Player removed from favorites.",
        "market.watchAdded": "Player marked for scouting.",
        "market.watchRemoved": "Player removed from scouting.",
        "market.insufficientFunds": "Not enough money to complete the signing.",
        "market.signed": "Signing completed.",
        "market.offerValue": "Offer value",
        "market.counterValue": "Requested value",
        "market.salaryDemand": "Requested salary",
        "market.contractDemand": "Requested contract",
        "market.futureReady": "Prepared integrations",
        "market.futureReadyText": "Scout, academy, agents, loans, clauses, pre-contracts and international transfers already have reserved integration points.",
        "market.quickOpen": "Quick open",
        "market.favorites": "Favorites",
        "market.none": "None",
        "market.close": "Close",
        "filter.position": "Position",
        "filter.age": "Age",
        "filter.nationality": "Nationality",
        "filter.value": "Value",
        "filter.salary": "Salary",
        "filter.contract": "Contract status",
        "filter.club": "Club",
        "filter.phase": "Career phase",
        "filter.all": "All",
        "range.any": "All",
        "range.age.u21": "Up to 21",
        "range.age.22-27": "22 to 27",
        "range.age.28-32": "28 to 32",
        "range.age.o32": "Over 32",
        "range.rating.u70": "Up to 70",
        "range.rating.71-80": "71 to 80",
        "range.rating.81-88": "81 to 88",
        "range.rating.o88": "Over 88",
        "range.money.low": "Low",
        "range.money.medium": "Medium",
        "range.money.high": "High",
        "sort.age": "Age",
        "sort.value": "Value",
        "sort.salary": "Salary",
        "sort.name": "Name",
        "sort.club": "Club",
        "sort.nationality": "Nationality",
        "position.GK": "Goalkeeper",
        "position.RB": "Right back",
        "position.CB": "Centre back",
        "position.LB": "Left back",
        "position.RWB": "Right wing back",
        "position.LWB": "Left wing back",
        "position.CDM": "Defensive midfielder",
        "position.CM": "Central midfielder",
        "position.CAM": "Attacking midfielder",
        "position.RM": "Right midfielder",
        "position.LM": "Left midfielder",
        "position.RW": "Right winger",
        "position.LW": "Left winger",
        "position.CF": "Second striker",
        "position.ST": "Striker",
        "contract.expiring": "Expiring contract",
        "contract.short": "Short contract",
        "contract.stable": "Stable contract",
        "contract.long": "Long contract"
    };
    I18N.es = {
        ...I18N["pt-BR"],
        "brand.tagline": "Football Manager Premium",
        "brand.version": "Versión {version}",
        "splash.loading": "Cargando tu aventura...",
        "splash.alpha": "Versión Alpha",
        "menu.newCareer": "Nueva Carrera",
        "menu.continueCareer": "Continuar Carrera",
        "menu.noCareer": "No se encontró ninguna carrera.",
        "menu.settings": "Configuración",
        "menu.language": "Idioma",
        "menu.credits": "Créditos",
        "menu.lastSave": "Último guardado",
        "menu.currentClub": "Club actual",
        "menu.season": "Temporada",
        "menu.alpha": "Alpha",
        "menu.noClub": "Ningún club",
        "menu.never": "Nunca",
        "settings.title": "Configuración",
        "settings.subtitle": "Ajustes de carrera y preferencias del juego.",
        "settings.audio": "Audio",
        "settings.volume": "Volumen",
        "settings.currentVolume": "Volumen actual",
        "settings.language": "Idioma",
        "settings.save": "Guardar",
        "settings.load": "Cargar",
        "settings.resetCareer": "Reiniciar carrera",
        "settings.back": "Volver",
        "settings.autoSave": "Auto-guardado",
        "settings.autoSaveText": "Guarda automáticamente al cambiar de pantalla y avanzar la semana.",
        "settings.active": "Activo",
        "settings.inactive": "Inactivo",
        "settings.enable": "Activar",
        "settings.disable": "Desactivar",
        "settings.saved": "Carrera guardada.",
        "settings.languageChanged": "Idioma: {language}.",
        "nav.home": "Inicio",
        "nav.squad": "Plantilla",
        "nav.tactics": "Táctica",
        "nav.league": "Liga",
        "nav.club": "Club",
        "nav.settings": "Configuración",
        "nav.market": "Mercado",
        "nav.academy": "Cantera",
        "nav.marketing": "Marketing",
        "marketing.title": "Marketing",
        "marketing.subtitle": "Patrocinios, campañas y tienda oficial como nuevas fuentes de ingresos.",
        "marketing.masterSponsor": "Patrocinador Principal",
        "marketing.secondarySponsor": "Patrocinador Secundario",
        "marketing.materialSupplier": "Proveedor de Material",
        "marketing.officialStore": "Tienda Oficial",
        "marketing.proposals": "Propuestas de patrocinio",
        "marketing.accept": "Aceptar",
        "marketing.reject": "Rechazar",
        "marketing.negotiate": "Negociar",
        "marketing.accepted": "Propuesta aceptada.",
        "marketing.rejected": "Propuesta rechazada.",
        "marketing.negotiated": "Propuesta renegociada.",
        "marketing.noProposals": "No hay propuestas disponibles.",
        "marketing.weeklyValue": "Valor semanal",
        "marketing.storeSales": "Ventas estimadas",
        "marketing.storeRevenue": "Ingreso semanal",
        "marketing.bestShirt": "Camiseta más vendida",
        "marketing.campaigns": "Campañas",
        "marketing.runCampaign": "Ejecutar campaña",
        "marketing.campaignActive": "Campaña ejecutada.",
        "marketing.futureStore": "Arquitectura de tienda",
        "marketing.futureStoreText": "Camisetas, gorras, bufandas, balones y productos conmemorativos ya tienen puntos de evolución preparados.",
        "academy.title": "Categorías de Cantera",
        "academy.subtitle": "Formación de jóvenes talentos para sostener la evolución del club.",
        "academy.level": "Nivel de la Cantera",
        "academy.youngsters": "Jóvenes",
        "academy.averageQuality": "Calidad media",
        "academy.weeklyInvestment": "Inversión semanal",
        "academy.evolution": "Evolución de la Cantera",
        "academy.events": "Eventos de Cantera",
        "academy.noEvents": "Sin eventos recientes de Cantera.",
        "academy.noPlayers": "No hay jóvenes en la Cantera.",
        "academy.promote": "Promover al plantel",
        "academy.keep": "Mantener en la Cantera",
        "academy.promoted": "Joven promovido al plantel.",
        "academy.kept": "Joven mantenido en la Cantera.",
        "academy.generated": "Nuevo joven revelado por la Cantera.",
        "academy.futureArchitecture": "Arquitectura preparada",
        "academy.futureArchitectureText": "Préstamos, equipo B, Sub-17 y Sub-20 ya tienen puntos de integración reservados.",
        "market.title": "Mercado de Fichajes",
        "market.subtitle": "Jugadores disponibles, observados, favoritos y negociaciones activas.",
        "market.balance": "Saldo disponible",
        "market.search": "Buscar por nombre",
        "market.searchPlaceholder": "Nombre del jugador",
        "market.sort": "Ordenación",
        "market.clearFilters": "Limpiar filtros",
        "market.noPlayers": "No hay jugadores disponibles en el mercado.",
        "market.currentClub": "Club actual",
        "market.nationality": "Nacionalidad",
        "market.age": "Edad",
        "market.years": "años",
        "market.position": "Posición",
        "market.value": "Valor de mercado",
        "market.salary": "Salario",
        "market.contractTime": "Tiempo de contrato",
        "market.contractStatus": "Situación contractual",
        "market.careerPhase": "Fase de carrera",
        "market.morale": "Moral",
        "market.fitness": "Condición física",
        "market.attributes": "Atributos",
        "market.careerEvolution": "Evolución de carrera",
        "market.primaryPosition": "Posición principal",
        "market.secondaryPositions": "Posiciones secundarias",
        "market.history": "Historial resumido",
        "market.details": "Detalles del jugador",
        "market.back": "Volver al mercado",
        "market.watch": "Observar",
        "market.watched": "Observado",
        "market.makeOffer": "Hacer propuesta",
        "market.negotiateSalary": "Negociar salario",
        "market.negotiateContract": "Negociar contrato",
        "market.addFavorite": "Añadir a favoritos",
        "market.removeFavorite": "Quitar de favoritos",
        "market.cancelNegotiation": "Cancelar negociación",
        "market.negotiationStatus": "Negociación",
        "market.noNegotiation": "Sin negociación activa",
        "market.offerAccepted": "Propuesta aceptada.",
        "market.offerRejected": "Propuesta rechazada.",
        "market.counterOffer": "Contraoferta recibida.",
        "market.salaryAdjusted": "Salario negociado.",
        "market.contractAdjusted": "Contrato negociado.",
        "market.negotiationCancelled": "Negociación cancelada.",
        "market.favoriteAdded": "Jugador añadido a favoritos.",
        "market.favoriteRemoved": "Jugador quitado de favoritos.",
        "market.watchAdded": "Jugador marcado para observación.",
        "market.watchRemoved": "Jugador retirado de observación.",
        "market.insufficientFunds": "Dinero insuficiente para completar el fichaje.",
        "market.signed": "Fichaje completado.",
        "market.offerValue": "Valor de la propuesta",
        "market.counterValue": "Valor pedido",
        "market.salaryDemand": "Salario pedido",
        "market.contractDemand": "Contrato pedido",
        "market.futureReady": "Integraciones preparadas",
        "market.futureReadyText": "Scout, cantera, representantes, préstamos, cláusulas, precontratos y transferencias internacionales ya tienen puntos de integración reservados.",
        "market.quickOpen": "Abrir rápido",
        "market.favorites": "Favoritos",
        "market.none": "Ninguno",
        "market.close": "Cerrar",
        "filter.position": "Posición",
        "filter.age": "Edad",
        "filter.nationality": "Nacionalidad",
        "filter.value": "Valor",
        "filter.salary": "Salario",
        "filter.contract": "Situación contractual",
        "filter.club": "Club",
        "filter.phase": "Fase de carrera",
        "filter.all": "Todos",
        "range.any": "Todos",
        "range.age.u21": "Hasta 21",
        "range.age.22-27": "22 a 27",
        "range.age.28-32": "28 a 32",
        "range.age.o32": "Más de 32",
        "range.rating.u70": "Hasta 70",
        "range.rating.71-80": "71 a 80",
        "range.rating.81-88": "81 a 88",
        "range.rating.o88": "Más de 88",
        "range.money.low": "Bajo",
        "range.money.medium": "Medio",
        "range.money.high": "Alto",
        "sort.age": "Edad",
        "sort.value": "Valor",
        "sort.salary": "Salario",
        "sort.name": "Nombre",
        "sort.club": "Club",
        "sort.nationality": "Nacionalidad",
        "position.GK": "Portero",
        "position.RB": "Lateral derecho",
        "position.CB": "Defensa central",
        "position.LB": "Lateral izquierdo",
        "position.RWB": "Carrilero derecho",
        "position.LWB": "Carrilero izquierdo",
        "position.CDM": "Mediocentro defensivo",
        "position.CM": "Centrocampista",
        "position.CAM": "Mediapunta",
        "position.RM": "Medio derecho",
        "position.LM": "Medio izquierdo",
        "position.RW": "Extremo derecho",
        "position.LW": "Extremo izquierdo",
        "position.CF": "Segundo delantero",
        "position.ST": "Delantero centro",
        "contract.expiring": "Contrato por vencer",
        "contract.short": "Contrato corto",
        "contract.stable": "Contrato estable",
        "contract.long": "Contrato largo"
    };
    const TACTICAL_PROFILE_OVERRIDES = {
        "cristiano-r": { naturalAreas: ["LW", "ST", "RW", "CF", "LM", "RM"], versatility: 65, preferredRoles: ["ST", "LW", "RW"], preferredSide: "Esquerda" },
        "lionel-m": { naturalAreas: ["RW", "CAM", "CF", "ST"], versatility: 60, preferredRoles: ["RW", "CAM", "CF"], preferredSide: "Direita" },
        "ronaldinho-g": { naturalAreas: ["LW", "CAM", "LM", "CF"], versatility: 78, preferredRoles: ["LW", "CAM"], preferredSide: "Esquerda" },
        "maldini-p": { naturalAreas: ["CB", "LB", "LWB"], versatility: 93, preferredRoles: ["CB", "LB"], preferredSide: "Esquerda" },
        "beckenbauer-f": { naturalAreas: ["CB", "CDM", "CM"], versatility: 92, preferredRoles: ["CB", "CDM"], preferredSide: "Centro" },
        "xavi-h": { naturalAreas: ["CM", "CDM", "CAM"], versatility: 84, preferredRoles: ["CM"], preferredSide: "Centro" },
        "iniesta-a": { naturalAreas: ["CM", "CAM", "LM"], versatility: 86, preferredRoles: ["CM", "CAM"], preferredSide: "Centro" },
        "buffon-g": { naturalAreas: ["GK"], versatility: 5, preferredRoles: ["GK"], preferredSide: "Centro" }
    };

    const clubCatalog = [
        createClub("rio-vermelho", "Rio Vermelho", "Rio de Janeiro", "Brasil", "brasil_serie_a", 88, 6800000, 72, "#c91f2c", "#10151f", "RV", "diamond", 8200000, "Gigante", 92, 86, 78000, 86, 82, "Estadio da Lagoa", "Ganhar liga"),
        createClub("sao-paulo-tricolor", "Sao Paulo Tricolor", "Sao Paulo", "Brasil", "brasil_serie_a", 84, 5200000, 74, "#f4f4f4", "#d32f2f", "SP", "stripe", 6100000, "Grande", 86, 82, 66000, 80, 78, "Arena Morumbi", "Classificar para continental"),
        createClub("minas-azul", "Minas Azul", "Belo Horizonte", "Brasil", "brasil_serie_a", 78, 3400000, 78, "#1d5fd1", "#f6f6f6", "MA", "circle", 3900000, "Medio", 77, 72, 42000, 75, 68, "Parque Pampulha", "Top 6"),
        createClub("porto-alegre-red", "Porto Alegre Red", "Porto Alegre", "Brasil", "brasil_serie_a", 80, 3900000, 76, "#b71c1c", "#ffffff", "PA", "chevron", 4300000, "Grande", 80, 76, 51000, 76, 70, "Estadio do Guaiba", "Top 4"),
        createClub("man-red", "Man Red", "Manchester", "Inglaterra", "england_premier", 92, 9800000, 68, "#da1f32", "#f2c94c", "MR", "shield", 9500000, "Gigante", 94, 90, 76000, 88, 86, "Red Trafford", "Ganhar liga"),
        createClub("man-blue", "Man Blue", "Manchester", "Inglaterra", "england_premier", 89, 9200000, 70, "#66b8ff", "#ffffff", "MB", "circle", 7200000, "Gigante", 84, 88, 55000, 84, 90, "Bluelands", "Ganhar liga"),
        createClub("north-london", "North London", "Londres", "Inglaterra", "england_premier", 85, 6400000, 73, "#f5f5f5", "#d71920", "NL", "cannon", 5200000, "Grande", 83, 84, 61000, 82, 80, "North Park", "Classificar para continental"),
        createClub("merseyside-red", "Merseyside Red", "Liverpool", "Inglaterra", "england_premier", 91, 8900000, 69, "#c8102e", "#f6f6f6", "MR", "bird", 8300000, "Gigante", 95, 88, 54000, 84, 84, "Anfield Road", "Ganhar liga"),
        createClub("madrid-chamartin", "Madrid Chamartin", "Madrid", "Espanha", "spain_primera", 94, 11200000, 66, "#f7f7f7", "#c9a227", "MC", "crown", 9800000, "Gigante", 98, 92, 81000, 90, 88, "Nuevo Chamartin", "Ganhar liga"),
        createClub("catalunya-fc", "Catalunya FC", "Barcelona", "Espanha", "spain_primera", 93, 10800000, 67, "#154284", "#a50044", "CF", "cross", 9700000, "Gigante", 97, 92, 99000, 94, 86, "Estadi Catalunya", "Ganhar liga"),
        createClub("madrid-rosas", "Madrid Rosas", "Madrid", "Espanha", "spain_primera", 86, 5900000, 71, "#d7195b", "#ffffff", "MR", "stripe", 4300000, "Grande", 82, 84, 68000, 80, 78, "Metropolitano Rosas", "Top 4"),
        createClub("sevilla-blanco", "Sevilla Blanco", "Sevilha", "Espanha", "spain_primera", 79, 3100000, 78, "#ffffff", "#d71920", "SB", "diamond", 2100000, "Medio", 74, 74, 43000, 76, 70, "Nervion Blanco", "Top 8"),
        createClub("milano-rosso", "Milano Rosso", "Milao", "Italia", "italy_serie_a", 88, 7200000, 70, "#d00027", "#111111", "MR", "cross", 6900000, "Gigante", 92, 86, 80000, 82, 82, "San Siro Rosso", "Ganhar liga"),
        createClub("milano-blu", "Milano Blu", "Milao", "Italia", "italy_serie_a", 87, 7000000, 71, "#0057b8", "#111111", "MB", "stripe", 6500000, "Gigante", 89, 86, 80000, 80, 84, "San Siro Blu", "Ganhar liga"),
        createClub("piemonte", "Piemonte", "Turim", "Italia", "italy_serie_a", 92, 9600000, 67, "#f8f8f8", "#111111", "PI", "star", 8900000, "Gigante", 96, 90, 41000, 82, 88, "Arena Piemonte", "Ganhar liga"),
        createClub("roma-capitolina", "Roma Capitolina", "Roma", "Italia", "italy_serie_a", 82, 4300000, 76, "#8e1b1b", "#f4b942", "RC", "wolf", 3100000, "Grande", 79, 78, 61000, 77, 73, "Olimpico Capitolino", "Top 6"),
        createClub("bayern-munchen", "Bayern Munchen", "Munique", "Alemanha", "germany_bundes", 93, 10600000, 66, "#dc052d", "#0066b2", "BM", "diamond", 9000000, "Gigante", 96, 92, 75000, 86, 88, "Munchen Arena", "Ganhar liga"),
        createClub("ruhr-gelb", "Ruhr Gelb", "Dortmund", "Alemanha", "germany_bundes", 84, 5200000, 75, "#f6d21a", "#111111", "RG", "circle", 5100000, "Grande", 82, 82, 81000, 88, 78, "Westfalen Gelb", "Top 3"),
        createClub("paris-sg", "Paris SG", "Paris", "Franca", "france_ligue", 89, 9100000, 68, "#163b73", "#d71920", "PS", "tower", 6100000, "Gigante", 75, 88, 48000, 82, 86, "Parc Parisien", "Ganhar liga"),
        createClub("monaco-azur", "Monaco Azur", "Monaco", "Franca", "france_ligue", 78, 3700000, 79, "#ffffff", "#d71920", "MA", "diamond", 900000, "Medio", 70, 80, 18500, 86, 80, "Stade Azur", "Revelar jovens"),
        createClub("lisboa-sl", "Lisboa SL", "Lisboa", "Portugal", "portugal_primeira", 86, 5600000, 72, "#d71920", "#ffffff", "SL", "eagle", 5900000, "Gigante", 88, 84, 65000, 88, 78, "Estadio da Luz Nova", "Ganhar liga"),
        createClub("lisboa-cp", "Lisboa CP", "Lisboa", "Portugal", "portugal_primeira", 82, 4200000, 76, "#168a4a", "#ffffff", "CP", "stripe", 4100000, "Grande", 84, 80, 50000, 90, 76, "Alvalade Verde", "Top 3"),
        createClub("porto-fc", "Porto FC", "Porto", "Portugal", "portugal_primeira", 85, 5100000, 73, "#0057b8", "#ffffff", "PF", "shield", 4800000, "Grande", 87, 82, 50000, 84, 80, "Dragao Norte", "Ganhar liga"),
        createClub("amsterdam-afc", "Amsterdam AFC", "Amsterdam", "Holanda", "netherlands_eredivisie", 84, 4700000, 74, "#d71920", "#ffffff", "AA", "cross", 5200000, "Grande", 92, 82, 55000, 96, 82, "Arena Amsterdam", "Ganhar liga"),
        createClub("rotterdam-fc", "Rotterdam FC", "Rotterdam", "Holanda", "netherlands_eredivisie", 77, 2900000, 80, "#d71920", "#111111", "RF", "stripe", 2300000, "Medio", 78, 72, 51000, 78, 68, "Maas Stadion", "Top 4"),
        createClub("buenos-aires-red", "Buenos Aires Red", "Buenos Aires", "Argentina", "argentina_primera", 83, 3900000, 75, "#d71920", "#ffffff", "BR", "stripe", 5200000, "Grande", 91, 76, 54000, 86, 74, "Monumental Sur", "Ganhar liga"),
        createClub("buenos-aires-blue", "Buenos Aires Blue", "Buenos Aires", "Argentina", "argentina_primera", 82, 3700000, 76, "#004b9b", "#f4c542", "BB", "star", 5000000, "Grande", 90, 76, 49000, 84, 74, "Bombonera Azul", "Ganhar liga")
    ];

    const leagueCatalog = [
        createLeague("brasil_serie_a", "Liga Brasileira", "Brasil", 1, ["rio-vermelho", "sao-paulo-tricolor", "minas-azul", "porto-alegre-red"]),
        createLeague("england_premier", "English Premier", "Inglaterra", 1, ["man-red", "man-blue", "north-london", "merseyside-red"]),
        createLeague("spain_primera", "Primera Espanhola", "Espanha", 1, ["madrid-chamartin", "catalunya-fc", "madrid-rosas", "sevilla-blanco"]),
        createLeague("italy_serie_a", "Serie Italia", "Italia", 1, ["milano-rosso", "milano-blu", "piemonte", "roma-capitolina"]),
        createLeague("germany_bundes", "Bundes Liga", "Alemanha", 1, ["bayern-munchen", "ruhr-gelb"]),
        createLeague("france_ligue", "Ligue Francaise", "Franca", 1, ["paris-sg", "monaco-azur"]),
        createLeague("portugal_primeira", "Primeira Portuguesa", "Portugal", 1, ["lisboa-sl", "lisboa-cp", "porto-fc"]),
        createLeague("netherlands_eredivisie", "Eredivisie Holland", "Holanda", 1, ["amsterdam-afc", "rotterdam-fc"]),
        createLeague("argentina_primera", "Primera Argentina", "Argentina", 1, ["buenos-aires-red", "buenos-aires-blue"])
    ];

    const competitionBlueprints = {
        nationalLeague: { name: "Liga Nacional", active: true },
        nationalCup: { name: "Copa Nacional", active: false },
        continentalCup: { name: "Competicao Continental", active: false },
        future: ["Champions", "Libertadores", "Selecoes", "Copa do Mundo", "Aposentadorias", "Novos jogadores"]
    };

    const playerDatabase = [
        ["rui-almeida", "Rui Almeida", "Rui", "Portugal", 1941, "GK", ["CB"], 188, 84, "Direito", "Lider sereno", 78, 67, 72, 88, 92, 14500, 880000, { pace: 42, shooting: 22, passing: 58, dribbling: 44, defending: 38, physical: 72, goalkeeping: 77, vision: 62, technique: 55, stamina: 68, leadership: 80, mentality: 76 }],
        ["marco-torres", "Marco Torres", "Torres", "Espanha", 1946, "RB", ["RWB", "CB"], 178, 74, "Direito", "Competitivo", 77, 64, 68, 84, 90, 10800, 760000, { pace: 76, shooting: 42, passing: 62, dribbling: 65, defending: 69, physical: 67, goalkeeping: 8, vision: 55, technique: 61, stamina: 77, leadership: 58, mentality: 68 }],
        ["hugo-ferraz", "Hugo Ferraz", "Ferraz", "Brasil", 1943, "CB", ["CDM"], 186, 83, "Direito", "Disciplinado", 80, 70, 70, 83, 88, 13200, 980000, { pace: 58, shooting: 34, passing: 59, dribbling: 48, defending: 78, physical: 80, goalkeeping: 7, vision: 54, technique: 57, stamina: 72, leadership: 73, mentality: 75 }],
        ["tomas-vidal", "Tomas Vidal", "Vidal", "Chile", 1948, "CB", ["LB"], 184, 81, "Esquerdo", "Reservado", 79, 58, 65, 80, 89, 9100, 690000, { pace: 61, shooting: 31, passing: 56, dribbling: 45, defending: 72, physical: 76, goalkeeping: 9, vision: 49, technique: 53, stamina: 70, leadership: 61, mentality: 67 }],
        ["paulo-esteves", "Paulo Esteves", "Paulinho", "Portugal", 1949, "LB", ["LWB", "LM"], 174, 70, "Esquerdo", "Ousado", 82, 61, 74, 86, 91, 9800, 840000, { pace: 80, shooting: 45, passing: 64, dribbling: 72, defending: 64, physical: 62, goalkeeping: 6, vision: 58, technique: 68, stamina: 79, leadership: 52, mentality: 66 }],
        ["nuno-castro", "Nuno Castro", "Castro", "Portugal", 1945, "CDM", ["CM", "CB"], 181, 78, "Direito", "Tatico", 81, 69, 71, 82, 90, 12600, 950000, { pace: 62, shooting: 48, passing: 72, dribbling: 61, defending: 75, physical: 74, goalkeeping: 6, vision: 69, technique: 70, stamina: 77, leadership: 76, mentality: 78 }],
        ["sergio-moura", "Sergio Moura", "Serginho", "Brasil", 1947, "CM", ["CDM", "CAM"], 176, 72, "Direito", "Profissional", 84, 72, 73, 85, 92, 15000, 1250000, { pace: 68, shooting: 61, passing: 78, dribbling: 73, defending: 61, physical: 67, goalkeeping: 5, vision: 80, technique: 78, stamina: 81, leadership: 70, mentality: 76 }],
        ["luis-barros", "Luis Barros", "Barros", "Portugal", 1951, "CM", ["CAM", "RM"], 172, 68, "Direito", "Criativo", 88, 55, 78, 82, 94, 8800, 1160000, { pace: 70, shooting: 57, passing: 74, dribbling: 76, defending: 49, physical: 58, goalkeeping: 5, vision: 77, technique: 81, stamina: 73, leadership: 48, mentality: 69 }],
        ["fabio-leal", "Fabio Leal", "Leal", "Brasil", 1950, "RW", ["RM", "LW"], 170, 66, "Esquerdo", "Imprevisivel", 86, 66, 77, 79, 93, 11800, 1390000, { pace: 84, shooting: 68, passing: 66, dribbling: 82, defending: 36, physical: 58, goalkeeping: 4, vision: 70, technique: 79, stamina: 75, leadership: 42, mentality: 68 }],
        ["andre-valente", "Andre Valente", "Valente", "Angola", 1944, "LW", ["LM", "CF"], 177, 73, "Direito", "Carismatico", 79, 74, 70, 81, 88, 14200, 1040000, { pace: 77, shooting: 72, passing: 65, dribbling: 77, defending: 41, physical: 69, goalkeeping: 5, vision: 66, technique: 75, stamina: 72, leadership: 66, mentality: 72 }],
        ["miguel-rocha", "Miguel Rocha", "Rocha", "Portugal", 1942, "ST", ["CF"], 183, 80, "Direito", "Frio", 82, 78, 69, 78, 87, 16400, 1320000, { pace: 65, shooting: 82, passing: 58, dribbling: 68, defending: 33, physical: 76, goalkeeping: 4, vision: 63, technique: 74, stamina: 70, leadership: 71, mentality: 80 }],
        ["caio-mendes", "Caio Mendes", "Caio", "Brasil", 1953, "GK", [], 190, 82, "Direito", "Ambicioso", 87, 45, 68, 76, 95, 7200, 740000, { pace: 39, shooting: 18, passing: 52, dribbling: 38, defending: 32, physical: 67, goalkeeping: 69, vision: 55, technique: 49, stamina: 63, leadership: 42, mentality: 61 }],
        ["diego-ramos", "Diego Ramos", "Ramos", "Uruguai", 1952, "CB", ["RB"], 185, 80, "Direito", "Intenso", 85, 49, 66, 74, 94, 7600, 810000, { pace: 64, shooting: 30, passing: 54, dribbling: 43, defending: 68, physical: 75, goalkeeping: 7, vision: 48, technique: 50, stamina: 72, leadership: 51, mentality: 65 }],
        ["victor-lemos", "Victor Lemos", "Lemos", "Brasil", 1954, "RWB", ["RB", "RM"], 173, 69, "Direito", "Energetico", 88, 42, 72, 80, 96, 6200, 900000, { pace: 82, shooting: 47, passing: 61, dribbling: 70, defending: 58, physical: 60, goalkeeping: 5, vision: 57, technique: 66, stamina: 84, leadership: 39, mentality: 62 }],
        ["bruno-salles", "Bruno Salles", "Salles", "Brasil", 1955, "CM", ["CDM"], 179, 74, "Direito", "Aplicado", 90, 38, 70, 78, 97, 5400, 870000, { pace: 67, shooting: 53, passing: 70, dribbling: 66, defending: 57, physical: 64, goalkeeping: 4, vision: 72, technique: 71, stamina: 76, leadership: 44, mentality: 65 }],
        ["renato-alves", "Renato Alves", "Renato", "Brasil", 1951, "CAM", ["CM", "CF"], 175, 70, "Esquerdo", "Criativo", 89, 63, 76, 83, 95, 10400, 1510000, { pace: 71, shooting: 66, passing: 76, dribbling: 80, defending: 38, physical: 59, goalkeeping: 4, vision: 82, technique: 83, stamina: 70, leadership: 54, mentality: 72 }],
        ["julio-matos", "Julio Matos", "Julio", "Portugal", 1950, "LM", ["LW", "LWB"], 171, 67, "Esquerdo", "Equilibrado", 83, 52, 71, 81, 92, 8300, 970000, { pace: 76, shooting: 59, passing: 69, dribbling: 74, defending: 52, physical: 57, goalkeeping: 5, vision: 66, technique: 72, stamina: 78, leadership: 45, mentality: 64 }],
        ["oscar-nunes", "Oscar Nunes", "Oscar", "Portugal", 1954, "ST", ["CF"], 181, 77, "Direito", "Confiante", 91, 40, 73, 77, 98, 6900, 1080000, { pace: 72, shooting: 76, passing: 55, dribbling: 69, defending: 29, physical: 71, goalkeeping: 4, vision: 59, technique: 72, stamina: 68, leadership: 41, mentality: 70 }],
        ["adrian-keller", "Adrian Keller", "Keller", "Alemanha", 1946, "GK", [], 191, 85, "Direito", "Analitico", 82, 70, 70, 82, 91, 16000, 1180000, { pace: 38, shooting: 16, passing: 57, dribbling: 39, defending: 34, physical: 75, goalkeeping: 78, vision: 61, technique: 53, stamina: 65, leadership: 74, mentality: 76 }],
        ["breno-duarte", "Breno Duarte", "Breno", "Brasil", 1952, "CB", ["CDM"], 187, 82, "Direito", "Agressivo", 86, 48, 67, 79, 95, 9400, 990000, { pace: 59, shooting: 35, passing: 56, dribbling: 44, defending: 73, physical: 79, goalkeeping: 7, vision: 50, technique: 52, stamina: 73, leadership: 55, mentality: 67 }],
        ["claudio-rios", "Claudio Rios", "Rios", "Argentina", 1951, "LB", ["LWB"], 176, 71, "Esquerdo", "Leal", 84, 54, 70, 82, 93, 8700, 920000, { pace: 78, shooting: 42, passing: 63, dribbling: 67, defending: 66, physical: 63, goalkeeping: 5, vision: 55, technique: 65, stamina: 79, leadership: 49, mentality: 65 }],
        ["dario-mendes", "Dario Mendes", "Dario", "Portugal", 1949, "RB", ["RWB"], 177, 73, "Direito", "Confiavel", 80, 60, 66, 84, 90, 9900, 860000, { pace: 74, shooting: 40, passing: 61, dribbling: 61, defending: 67, physical: 66, goalkeeping: 5, vision: 53, technique: 60, stamina: 75, leadership: 57, mentality: 66 }],
        ["enzo-pires", "Enzo Pires", "Enzo", "Uruguai", 1947, "CDM", ["CM"], 180, 76, "Direito", "Combativo", 83, 66, 69, 80, 92, 11500, 1020000, { pace: 63, shooting: 50, passing: 70, dribbling: 58, defending: 73, physical: 73, goalkeeping: 5, vision: 66, technique: 67, stamina: 78, leadership: 64, mentality: 74 }],
        ["felix-grant", "Felix Grant", "Grant", "Inglaterra", 1950, "CM", ["RM"], 178, 73, "Direito", "Profissional", 85, 61, 72, 83, 94, 12200, 1220000, { pace: 69, shooting: 58, passing: 75, dribbling: 70, defending: 58, physical: 65, goalkeeping: 4, vision: 74, technique: 74, stamina: 79, leadership: 59, mentality: 71 }],
        ["gustavo-lima", "Gustavo Lima", "Guga", "Brasil", 1955, "CM", ["CAM"], 174, 68, "Esquerdo", "Ousado", 92, 36, 75, 76, 98, 5600, 1110000, { pace: 72, shooting: 60, passing: 73, dribbling: 78, defending: 42, physical: 56, goalkeeping: 5, vision: 80, technique: 81, stamina: 69, leadership: 38, mentality: 64 }],
        ["hector-molina", "Hector Molina", "Molina", "Espanha", 1948, "CAM", ["CF"], 173, 69, "Direito", "Inventivo", 86, 73, 76, 79, 93, 14800, 1490000, { pace: 70, shooting: 67, passing: 79, dribbling: 82, defending: 36, physical: 58, goalkeeping: 4, vision: 84, technique: 85, stamina: 68, leadership: 62, mentality: 73 }],
        ["ivan-petrov", "Ivan Petrov", "Petrov", "Uniao Sovietica", 1953, "RW", ["RM"], 176, 71, "Esquerdo", "Ambicioso", 90, 43, 74, 78, 97, 7400, 1180000, { pace: 83, shooting: 65, passing: 63, dribbling: 79, defending: 35, physical: 61, goalkeeping: 5, vision: 66, technique: 77, stamina: 73, leadership: 43, mentality: 66 }],
        ["jamal-reed", "Jamal Reed", "Reed", "Inglaterra", 1951, "LW", ["LM"], 175, 70, "Direito", "Direto", 87, 57, 73, 81, 95, 10100, 1260000, { pace: 81, shooting: 69, passing: 62, dribbling: 78, defending: 39, physical: 64, goalkeeping: 5, vision: 64, technique: 75, stamina: 75, leadership: 46, mentality: 67 }],
        ["kevin-moretti", "Kevin Moretti", "Moretti", "Italia", 1945, "ST", ["CF"], 185, 82, "Direito", "Matador", 81, 77, 68, 76, 89, 17200, 1420000, { pace: 64, shooting: 84, passing: 56, dribbling: 66, defending: 31, physical: 78, goalkeeping: 4, vision: 62, technique: 73, stamina: 67, leadership: 68, mentality: 81 }],
        ["leon-ortiz", "Leon Ortiz", "Leon", "Argentina", 1954, "ST", ["CF", "LW"], 180, 75, "Esquerdo", "Confiante", 92, 39, 75, 82, 99, 7600, 1350000, { pace: 76, shooting: 77, passing: 58, dribbling: 75, defending: 28, physical: 68, goalkeeping: 4, vision: 63, technique: 77, stamina: 68, leadership: 39, mentality: 69 }],
        ["mario-novak", "Mario Novak", "Novak", "Iugoslavia", 1950, "GK", [], 189, 84, "Esquerdo", "Calmo", 84, 55, 69, 84, 94, 9600, 940000, { pace: 41, shooting: 17, passing: 54, dribbling: 37, defending: 33, physical: 70, goalkeeping: 73, vision: 58, technique: 50, stamina: 63, leadership: 52, mentality: 68 }],
        ["noel-duarte", "Noel Duarte", "Noel", "Portugal", 1953, "CB", ["LB"], 184, 79, "Esquerdo", "Estudioso", 88, 41, 68, 78, 96, 6900, 880000, { pace: 62, shooting: 29, passing: 58, dribbling: 45, defending: 70, physical: 74, goalkeeping: 7, vision: 51, technique: 55, stamina: 72, leadership: 46, mentality: 64 }],
        ["otto-schneider", "Otto Schneider", "Otto", "Alemanha", 1948, "RWB", ["RB", "RM"], 179, 75, "Direito", "Metodico", 82, 68, 69, 85, 91, 12400, 1060000, { pace: 77, shooting: 51, passing: 65, dribbling: 67, defending: 65, physical: 69, goalkeeping: 5, vision: 58, technique: 66, stamina: 82, leadership: 61, mentality: 70 }],
        ["pablo-sosa", "Pablo Sosa", "Sosa", "Uruguai", 1944, "CDM", ["CB"], 182, 80, "Direito", "Veterano", 78, 76, 67, 79, 88, 15200, 960000, { pace: 57, shooting: 48, passing: 68, dribbling: 54, defending: 76, physical: 77, goalkeeping: 5, vision: 65, technique: 64, stamina: 70, leadership: 78, mentality: 80 }],
        ["quentin-hall", "Quentin Hall", "Hall", "Inglaterra", 1952, "CM", ["CDM"], 180, 76, "Direito", "Inteligente", 87, 50, 71, 80, 96, 8500, 1070000, { pace: 66, shooting: 55, passing: 73, dribbling: 66, defending: 61, physical: 68, goalkeeping: 5, vision: 75, technique: 72, stamina: 77, leadership: 52, mentality: 70 }],
        ["rafael-vega", "Rafael Vega", "Vega", "Espanha", 1955, "CAM", ["CM", "RW"], 171, 66, "Esquerdo", "Artista", 94, 34, 76, 77, 99, 5800, 1280000, { pace: 73, shooting: 64, passing: 76, dribbling: 83, defending: 32, physical: 53, goalkeeping: 4, vision: 84, technique: 86, stamina: 67, leadership: 36, mentality: 63 }],
        ["silvio-costa", "Silvio Costa", "Silvio", "Brasil", 1949, "LM", ["LW", "RM"], 174, 69, "Direito", "Veloz", 84, 65, 72, 83, 92, 11900, 1140000, { pace: 82, shooting: 62, passing: 66, dribbling: 76, defending: 47, physical: 60, goalkeeping: 4, vision: 64, technique: 74, stamina: 77, leadership: 50, mentality: 67 }],
        ["theo-martin", "Theo Martin", "Theo", "Franca", 1953, "CF", ["ST", "CAM"], 179, 73, "Direito", "Elegante", 91, 46, 74, 81, 98, 8000, 1330000, { pace: 72, shooting: 74, passing: 68, dribbling: 77, defending: 34, physical: 66, goalkeeping: 4, vision: 73, technique: 80, stamina: 69, leadership: 44, mentality: 70 }]
    ];

    const historicalPlayerProfiles = [
        ["pele", "Pele", "Pele", "Brasil", 1940, "CF", 99, 99, 99, "lendario"],
        ["lionel-m", "Lionel M.", "Lionel", "Argentina", 1953, "RW", 99, 99, 98, "lendario"],
        ["cristiano-r", "Cristiano R.", "Cristiano", "Portugal", 1952, "ST", 99, 99, 98, "lendario"],
        ["maradona-d", "Maradona D.", "Diego", "Argentina", 1951, "CAM", 98, 98, 98, "lendario"],
        ["ronaldo-f", "Ronaldo F.", "Ronaldo", "Brasil", 1954, "ST", 98, 98, 97, "lendario"],
        ["ronaldinho-g", "Ronaldinho G.", "R10", "Brasil", 1953, "LW", 97, 97, 96, "lendario"],
        ["cruyff-j", "Cruyff J.", "Johan", "Holanda", 1947, "CF", 97, 97, 96, "lendario"],
        ["zidane-z", "Zidane Z.", "Zizou", "Franca", 1950, "CAM", 96, 96, 95, "lendario"],
        ["beckenbauer-f", "Beckenbauer F.", "Kaiser", "Alemanha", 1945, "CB", 96, 96, 95, "lendario"],
        ["xavi-h", "Xavi H.", "Xavi", "Espanha", 1951, "CM", 95, 95, 94, "elite"],
        ["iniesta-a", "Iniesta A.", "Andres", "Espanha", 1952, "CM", 95, 95, 94, "elite"],
        ["rivaldo", "Rivaldo", "Riva", "Brasil", 1953, "CAM", 95, 95, 93, "elite"],
        ["kaka-r", "Kaka R.", "Kaka", "Brasil", 1954, "CAM", 94, 94, 92, "elite"],
        ["maldini-p", "Maldini P.", "Paolo", "Italia", 1950, "CB", 94, 94, 92, "elite"],
        ["buffon-g", "Buffon G.", "Gigi", "Italia", 1948, "GK", 94, 94, 92, "elite"],
        ["henry-t", "Henry T.", "Titi", "Franca", 1953, "ST", 93, 93, 91, "elite"],
        ["neymar-j", "Neymar J.", "Ney", "Brasil", 1955, "LW", 93, 94, 90, "elite"],
        ["modric-l", "Modric L.", "Luka", "Croacia", 1951, "CM", 92, 92, 90, "estrela"],
        ["adrian-keller", "Adrian Keller", "Keller", "Alemanha", 1946, "GK", 82, 84, 70, "comum"],
        ["breno-duarte", "Breno Duarte", "Breno", "Brasil", 1952, "CB", 78, 86, 48, "comum"],
        ["claudio-rios", "Claudio Rios", "Rios", "Argentina", 1951, "LB", 77, 84, 54, "comum"],
        ["dario-mendes", "Dario Mendes", "Dario", "Portugal", 1949, "RB", 76, 80, 60, "comum"],
        ["enzo-pires", "Enzo Pires", "Enzo", "Uruguai", 1947, "CDM", 80, 83, 66, "comum"],
        ["felix-grant", "Felix Grant", "Grant", "Inglaterra", 1950, "CM", 81, 85, 61, "comum"],
        ["gustavo-lima", "Gustavo Lima", "Guga", "Brasil", 1955, "CM", 78, 92, 36, "promessa"],
        ["hector-molina", "Hector Molina", "Molina", "Espanha", 1948, "CAM", 83, 86, 73, "estrela"],
        ["ivan-petrov", "Ivan Petrov", "Petrov", "Uniao Sovietica", 1953, "RW", 79, 90, 43, "promessa"],
        ["jamal-reed", "Jamal Reed", "Reed", "Inglaterra", 1951, "LW", 80, 87, 57, "comum"],
        ["kevin-moretti", "Kevin Moretti", "Moretti", "Italia", 1945, "ST", 84, 81, 77, "estrela"],
        ["leon-ortiz", "Leon Ortiz", "Leon", "Argentina", 1954, "ST", 82, 92, 39, "promessa"],
        ["mario-novak", "Mario Novak", "Novak", "Iugoslavia", 1950, "GK", 77, 84, 55, "comum"],
        ["noel-duarte", "Noel Duarte", "Noel", "Portugal", 1953, "CB", 76, 88, 41, "promessa"],
        ["otto-schneider", "Otto Schneider", "Otto", "Alemanha", 1948, "RWB", 80, 82, 68, "comum"],
        ["pablo-sosa", "Pablo Sosa", "Sosa", "Uruguai", 1944, "CDM", 82, 78, 76, "estrela"],
        ["quentin-hall", "Quentin Hall", "Hall", "Inglaterra", 1952, "CM", 79, 87, 50, "comum"],
        ["rafael-vega", "Rafael Vega", "Vega", "Espanha", 1955, "CAM", 80, 94, 34, "promessa"],
        ["silvio-costa", "Silvio Costa", "Silvio", "Brasil", 1949, "LM", 80, 84, 65, "comum"],
        ["theo-martin", "Theo Martin", "Theo", "Franca", 1953, "CF", 81, 91, 46, "promessa"]
    ];

    let GameState = null;
    let toastTimer = null;
    const UIState = {
        currentDrawer: null
    };
    let marketSearchTimer = null;

    window.ElevenGenesisAudio = window.ElevenGenesisAudio || {
        enabled: false,
        playUiEffect() {}
    };

    function createBaseState() {
        return {
            currentYear: START_YEAR,
            season: START_YEAR,
            round: 1,
            club: null,
            world: {
                leagues: leagueCatalog.map(cloneLeague),
                competitions: structuredCloneSafe(competitionBlueprints)
            },
            league: {
                clubs: clubCatalog.map(cloneClub),
                table: [],
                results: [],
                champion: null,
                rounds: 0,
                country: "",
                division: 1,
                name: ""
            },
            budget: 0,
            boardConfidence: 70,
            board: {
                objectives: [],
                lastProgressAverage: 0,
                lastReview: null,
                warning: null
            },
            questions: {
                pending: null,
                history: [],
                cooldown: 0
            },
            publicRelations: {
                fanMoodModifier: 0,
                sponsorTrust: 50,
                futureBudgetBoost: 0
            },
            fans: {
                index: 50,
                history: [],
                comments: [],
                complaints: [],
                praises: [],
                expectation: "",
                ticketPricePolicy: "Normal",
                lovedPlayerIds: [],
                lastResultStreak: { type: "neutra", count: 0 }
            },
            dressingRoom: {
                history: [],
                conflicts: [],
                praises: [],
                lastResultStreak: { type: "neutra", count: 0 }
            },
            currentScreen: "menu",
            settings: {
                autoSave: true,
                volume: 70,
                darkMode: true,
                animationSpeed: "normal",
                language: "Português",
                ...loadMenuPreferences()
            },
            saveMeta: {
                saveCount: 0,
                lastSavedAt: null
            },
            saveVersion: SAVE_VERSION,
            squad: [],
            market: [],
            squadView: {
                search: "",
                position: "ALL",
                sort: "overall"
            },
            marketView: createDefaultMarketView(),
            transferMarket: createDefaultTransferMarketState(),
            scout: createDefaultScoutState(),
            academy: createDefaultAcademyState(),
            marketing: createDefaultMarketingState(),
            seasonFlow: createDefaultSeasonFlowState(),
            tactics: createDefaultTactics(),
            selectedPlayerId: null,
            lastResult: "Nenhuma partida disputada",
            nextOpponentId: null,
            messages: [],
            news: [],
            newsFilter: "Todas",
            selectedNewsId: null,
            transferLog: [],
            aiActivity: [],
            staff: createDefaultStaffState(),
            training: createDefaultTrainingState(),
            finance: {
                income: 0,
                expenses: 0,
                ticketRevenue: 0,
                transferSpend: 0,
                transferIncome: 0,
                sponsorship: 0,
                wagesPaid: 0,
                stadiumMaintenance: 0,
                structureMaintenance: 0,
                staff: 0,
                transferInstallments: 0,
                bonuses: 0,
                merchandising: 0,
                television: 0,
                prizeMoney: 0,
                continentalRevenue: 0,
                history: [],
                alerts: [],
                weeklySnapshots: []
            }
        };
    }

    function createDefaultTactics() {
        return {
            baseFormation: "4-3-3",
            mentality: "Equilibrada",
            playStyle: "Posse",
            selectedPlayerId: null,
            starters: [],
            bench: [],
            setPieces: {
                captain: null,
                penalties: null,
                freeKicks: null,
                corners: null
            },
            ai: {}
        };
    }

    function createDefaultMarketView() {
        return {
            search: "",
            sort: "overall",
            filters: {
                position: "ALL",
                age: "any",
                overall: "any",
                potential: "any",
                nationality: "ALL",
                value: "any",
                salary: "any",
                contract: "ALL",
                club: "ALL",
                phase: "ALL"
            },
            detailPlayerId: null
        };
    }

    function createDefaultTransferMarketState() {
        return {
            observedPlayerIds: [],
            negotiations: {},
            futureIntegrations: {
                scout: true,
                academy: true,
                agents: true,
                loans: true,
                clauses: true,
                preContracts: true,
                internationalTransfers: true
            }
        };
    }

    function createDefaultScoutState() {
        return {
            assignments: {},
            reports: [],
            regions: [...SCOUT_REGIONS],
            search: {
                age: "any",
                position: "ALL",
                overall: "any",
                potential: "any",
                nationality: "ALL",
                value: "any"
            },
            lastUpdatedRound: 1
        };
    }

    function createDefaultAcademyState() {
        return {
            prospects: [],
            events: [],
            keptPlayerIds: [],
            futureArchitecture: {
                loans: true,
                bTeam: true,
                under17: true,
                under20: true
            },
            lastGeneratedRound: 0
        };
    }

    function createDefaultMarketingState() {
        return {
            sponsors: {
                master: null,
                secondary: null,
                material: null
            },
            proposals: [],
            store: {
                estimatedSales: 0,
                weeklyRevenue: 0,
                bestSeller: "Camisa titular",
                products: {
                    shirts: true,
                    caps: true,
                    scarves: true,
                    balls: true,
                    commemorative: true
                }
            },
            campaigns: [],
            history: [],
            lastProposalRound: 0
        };
    }

    function createDefaultStaffState() {
        const roles = [
            ["headCoach", "Treinador", "Tático", 7, 22000],
            ["assistant", "Auxiliar", "Gestão de grupo", 6, 12500],
            ["fitnessCoach", "Preparador Físico", "Resistência", 6, 10500],
            ["technicalCoach", "Preparador Técnico", "Técnica individual", 6, 10800],
            ["doctor", "Médico", "Prevenção de lesões", 6, 11800],
            ["scout", "Olheiro", "Potencial", 6, 9600],
            ["psychologist", "Psicólogo", "Moral", 5, 8200],
            ["director", "Diretor de Futebol", "Negociação", 6, 15000]
        ];
        return {
            members: roles.map(([id, role, specialty, level, salary], index) => ({
                id,
                name: `${role} ${index + 1}`,
                role,
                level,
                salary,
                specialty,
                experience: 4 + index,
                contract: { yearsRemaining: 2 + (index % 3), expiresYear: START_YEAR + 2 + (index % 3) },
                morale: 72
            })),
            history: [],
            aiChanges: []
        };
    }

    function createDefaultTrainingState() {
        return {
            focus: "balanced",
            individualPlans: {},
            history: [],
            weeklyIntensity: 60,
            lastProcessedRound: 0
        };
    }

    function createDefaultSeasonFlowState() {
        return {
            calendar: {
                currentWeek: 1,
                viewedWeek: 1,
                records: []
            },
            notifications: [],
            weeklySummaries: [],
            lastSummaryId: null,
            futureArchitecture: {
                champions: true,
                libertadores: true,
                worldCup: true,
                nationalCup: true,
                nationalTeams: true,
                hallOfFame: true,
                managerHall: true,
                historicalRecords: true,
                unlimitedSeasons: true
            }
        };
    }

    function cloneClub(club) {
        return {
            ...club,
            colors: [...club.colors],
            crest: { ...club.crest },
            stadium: normalizeStadium(club.stadium, club),
            structure: normalizeClubStructure(club.structure, club),
            objectives: [...club.objectives],
            finances: { ...club.finances }
        };
    }

    function cloneLeague(league) {
        return {
            ...league,
            clubs: [...league.clubs],
            table: Array.isArray(league.table) ? [...league.table] : [],
            rounds: Array.isArray(league.rounds) ? [...league.rounds] : []
        };
    }

    function structuredCloneSafe(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function createStadiumUpgrades(reputation, capacity) {
        const baseCost = Math.max(120000, Math.round(capacity * 5.8));
        return {
            capacity: createStadiumUpgrade("Aumentar capacidade", 1, 8, baseCost * 2.4, 4, "Aumenta público potencial e bilheteria."),
            pitch: createStadiumUpgrade("Melhorar gramado", Math.max(1, Math.round(reputation / 18)), 8, baseCost * 0.9, 2, "Melhora estado do gramado e reduz críticas."),
            lighting: createStadiumUpgrade("Melhorar iluminação", Math.max(1, Math.round(reputation / 22)), 7, baseCost * 0.75, 2, "Prepara jogos grandes e eventos noturnos."),
            stands: createStadiumUpgrade("Melhorar arquibancadas", Math.max(1, Math.round(reputation / 20)), 8, baseCost * 1.1, 3, "Aumenta conforto e ocupação média."),
            boxes: createStadiumUpgrade("Melhorar camarotes", Math.max(1, Math.round(reputation / 24)), 6, baseCost * 1.35, 3, "Aumenta receita por jogo."),
            food: createStadiumUpgrade("Melhorar praça de alimentação", Math.max(1, Math.round(reputation / 25)), 6, baseCost * 0.55, 2, "Gera receita adicional por torcedor."),
            store: createStadiumUpgrade("Melhorar loja oficial", Math.max(1, Math.round(reputation / 25)), 6, baseCost * 0.65, 2, "Prepara venda de camisas e produtos."),
            parking: createStadiumUpgrade("Melhorar estacionamento", Math.max(1, Math.round(reputation / 24)), 6, baseCost * 0.7, 2, "Aumenta acesso, ocupação e satisfação.")
        };
    }

    function createStadiumUpgrade(label, level, maxLevel, baseCost, weeks, benefit) {
        return {
            label,
            level: clamp(level, 1, maxLevel),
            maxLevel,
            baseCost: Math.round(baseCost),
            weeks,
            benefit
        };
    }

    function normalizeStadium(stadium, club = {}) {
        const capacity = stadium?.capacity || club.stadiumCapacity || 25000;
        const upgrades = createStadiumUpgrades(club.reputation || 70, capacity);
        const savedUpgrades = stadium?.upgrades && !Array.isArray(stadium.upgrades) ? stadium.upgrades : {};
        Object.keys(upgrades).forEach((key) => {
            upgrades[key] = { ...upgrades[key], ...(savedUpgrades[key] || {}) };
            upgrades[key].level = clamp(upgrades[key].level || 1, 1, upgrades[key].maxLevel);
        });
        return {
            name: stadium?.name || "Estádio do Clube",
            capacity,
            level: stadium?.level || Math.max(1, Math.round((club.facilities || 60) / 12)),
            ticketRevenue: stadium?.ticketRevenue || Math.round(8 + (club.reputation || 70) * 0.11),
            upgrades,
            activeProjects: Array.isArray(stadium?.activeProjects) ? stadium.activeProjects : [],
            pitchState: stadium?.pitchState || Math.max(58, Math.min(92, (club.facilities || 60) + 4)),
            occupancyBase: stadium?.occupancyBase || Math.max(48, Math.min(92, Math.round((club.reputation || 70) * 0.72 + (club.tradition || 70) * 0.22))),
            eventArchitecture: {
                concerts: false,
                specialEvents: false,
                internationalMatches: false,
                ...(stadium?.eventArchitecture || {})
            }
        };
    }

    function getStadiumUpgradeCost(key) {
        const upgrade = GameState.club.stadium.upgrades[key];
        return Math.round(upgrade.baseCost * (1 + upgrade.level * 0.42) * getEconomicMultiplier(GameState.currentYear));
    }

    function getStadiumOccupancyRate() {
        const stadium = GameState.club.stadium;
        const formBonus = getFanMood().score * 0.18;
        const comfortBonus = ((stadium.upgrades.stands?.level || 1) + (stadium.upgrades.parking?.level || 1) + (stadium.upgrades.food?.level || 1)) * 1.4;
        const pricePenalty = Math.max(0, (stadium.ticketRevenue || 12) - 16) * 1.8;
        return clamp(Math.round((stadium.occupancyBase || 60) + formBonus + comfortBonus - pricePenalty), 35, 100);
    }

    function getAverageMatchRevenue() {
        const stadium = GameState.club.stadium;
        const attendance = Math.round(stadium.capacity * (getStadiumOccupancyRate() / 100));
        const premiumBonus = 1 + ((stadium.upgrades.boxes?.level || 1) * 0.025) + ((stadium.upgrades.food?.level || 1) * 0.018) + ((stadium.upgrades.store?.level || 1) * 0.014);
        return Math.round(attendance * (stadium.ticketRevenue || 12) * premiumBonus);
    }

    function getWeeklyStadiumMaintenance() {
        const stadium = GameState.club.stadium;
        const upgradeLevels = Object.values(stadium.upgrades || {}).reduce((sum, upgrade) => sum + (upgrade.level || 1), 0);
        return Math.round(stadium.capacity * 0.42 + upgradeLevels * 8500);
    }

    function createClubStructure(facilities, youth, scout, reputation = 70) {
        return {
            departments: {
                training: createStructureDepartment("Centro de Treinamento", Math.round(facilities / 12), "Melhora evolução dos jogadores.", "Jogadores evoluem com mais frequência."),
                medical: createStructureDepartment("Departamento Médico", Math.round(facilities / 14), "Reduz tempo de recuperação de lesões.", "Lesões passam a ter recuperação mais curta."),
                scout: createStructureDepartment("Scout", Math.round(scout / 12), "Melhora precisão do potencial observado.", "Relatórios de potencial ficam mais confiáveis."),
                youth: createStructureDepartment("Categorias de Base", Math.round(youth / 12), "Aumenta qualidade dos jovens.", "Novos jovens chegam com potencial superior."),
                marketing: createStructureDepartment("Marketing", Math.round(reputation / 14), "Aumenta receitas e torcida.", "Patrocínio e torcida crescem gradualmente."),
                administration: createStructureDepartment("Administração", Math.round(facilities / 15), "Reduz custos operacionais.", "Manutenção estrutural fica mais eficiente.")
            },
            queue: [],
            history: []
        };
    }

    function createStructureDepartment(label, level, description, nextBenefit) {
        return {
            label,
            level: clamp(level, 1, 10),
            maxLevel: 10,
            description,
            nextBenefit
        };
    }

    function normalizeClubStructure(structure, club = {}) {
        const base = createClubStructure(club.facilities || 60, club.youthQuality || 60, club.scoutQuality || 60, club.reputation || 70);
        const savedDepartments = structure?.departments || {};
        Object.keys(base.departments).forEach((key) => {
            base.departments[key] = {
                ...base.departments[key],
                ...(savedDepartments[key] || {}),
                level: clamp(savedDepartments[key]?.level || base.departments[key].level, 1, 10)
            };
        });
        base.queue = Array.isArray(structure?.queue) ? structure.queue : [];
        base.history = Array.isArray(structure?.history) ? structure.history : [];
        return base;
    }

    function getStructureDepartmentCost(key) {
        const department = GameState.club.structure.departments[key];
        const base = {
            training: 180000,
            medical: 150000,
            scout: 130000,
            youth: 170000,
            marketing: 120000,
            administration: 140000
        }[key] || 130000;
        return Math.round(base * (1 + department.level * 0.55) * getEconomicMultiplier(GameState.currentYear));
    }

    function getStructureDepartmentWeeks(key) {
        const department = GameState.club.structure.departments[key];
        return Math.max(2, Math.min(7, 1 + Math.ceil(department.level / 2)));
    }

    function getStructureAverageLevel() {
        const departments = Object.values(GameState.club.structure?.departments || {});
        if (!departments.length) return 1;
        return Math.round((departments.reduce((sum, department) => sum + department.level, 0) / departments.length) * 10) / 10;
    }

    function isStructureUpgradeQueued(key) {
        return (GameState.club.structure.queue || []).some((project) => project.key === key);
    }

    function startStructureUpgrade(key) {
        const structure = GameState.club.structure;
        const department = structure.departments[key];
        if (!department) return;
        if (department.level >= department.maxLevel) {
            showToast("Departamento já está no nível máximo.");
            return;
        }
        if (isStructureUpgradeQueued(key)) {
            showToast("Esta melhoria já está em andamento.");
            return;
        }
        if (structure.queue.length) {
            showToast("Já existe uma melhoria estrutural em andamento.");
            return;
        }
        const cost = getStructureDepartmentCost(key);
        if (GameState.budget < cost) {
            showToast("Saldo insuficiente para melhorar este departamento.");
            return;
        }
        applyFinanceMovement("expense", "Estrutura", `Melhoria iniciada: ${department.label}`, cost);
        structure.queue.push({
            key,
            label: department.label,
            totalWeeks: getStructureDepartmentWeeks(key),
            remainingWeeks: getStructureDepartmentWeeks(key),
            cost,
            startedAt: new Date().toISOString()
        });
        addNews("Clube", `${department.label} em melhoria`, `O clube iniciou investimento em ${department.label}.`, `Custo: ${money(cost)}. Benefício: ${department.nextBenefit}`);
        saveCareer();
        renderStructure();
    }

    function processStructureProjects() {
        const structure = GameState.club.structure;
        if (!structure?.queue?.length) return;
        structure.queue.forEach((project) => {
            project.remainingWeeks = Math.max(0, project.remainingWeeks - 1);
        });
        const completed = structure.queue.filter((project) => project.remainingWeeks === 0);
        completed.forEach((project) => completeStructureUpgrade(project.key));
        structure.queue = structure.queue.filter((project) => project.remainingWeeks > 0);
    }

    function completeStructureUpgrade(key) {
        const structure = GameState.club.structure;
        const department = structure.departments[key];
        if (!department) return;
        department.level = clamp(department.level + 1, 1, department.maxLevel);
        applyStructureBenefits(key);
        const record = {
            id: `structure-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            date: new Date().toISOString(),
            label: department.label,
            level: department.level
        };
        structure.history.unshift(record);
        structure.history = structure.history.slice(0, 20);
        addNews("Clube", `${department.label} alcança nível ${department.level}`, department.nextBenefit, `A estrutura do clube foi atualizada e os benefícios já passam a influenciar a carreira.`);
    }

    function applyStructureBenefits(key) {
        const club = GameState.club;
        const department = club.structure.departments[key];
        if (key === "training") club.facilities = clamp(club.facilities + 3, 1, 99);
        if (key === "medical") club.facilities = clamp(club.facilities + 2, 1, 99);
        if (key === "scout") club.scoutQuality = clamp(club.scoutQuality + 4, 1, 99);
        if (key === "youth") club.youthQuality = clamp(club.youthQuality + 4, 1, 99);
        if (key === "marketing") {
            club.fans += Math.round(club.fans * 0.018);
            GameState.publicRelations.sponsorTrust = clamp((GameState.publicRelations.sponsorTrust || 50) + 2, 0, 100);
        }
        if (key === "administration") {
            club.finances.wageBudget = Math.round((club.finances.wageBudget || 1) * 1.01);
        }
        if (department) club.facilities = clamp(Math.max(club.facilities, department.level * 8), 1, 99);
    }

    function isStadiumUpgradeInProgress(key) {
        return (GameState.club.stadium.activeProjects || []).some((project) => project.key === key);
    }

    function startStadiumUpgrade(key) {
        const stadium = GameState.club.stadium;
        const upgrade = stadium.upgrades[key];
        if (!upgrade) return;
        if (upgrade.level >= upgrade.maxLevel) {
            showToast("Melhoria já está no nível máximo.");
            return;
        }
        if (isStadiumUpgradeInProgress(key)) {
            showToast("Esta obra já está em andamento.");
            return;
        }
        const cost = getStadiumUpgradeCost(key);
        if (GameState.budget < cost) {
            showToast("Saldo insuficiente para iniciar esta obra.");
            return;
        }
        applyFinanceMovement("expense", "Estádio", `Obra iniciada: ${upgrade.label}`, cost);
        stadium.activeProjects.push({
            key,
            label: upgrade.label,
            totalWeeks: upgrade.weeks,
            remainingWeeks: upgrade.weeks,
            cost,
            startedAt: new Date().toISOString()
        });
        addNews("Clube", `${upgrade.label} em andamento`, `O clube iniciou uma obra no ${stadium.name}.`, `Custo: ${money(cost)}. Prazo: ${upgrade.weeks} semana${upgrade.weeks > 1 ? "s" : ""}. Benefício: ${upgrade.benefit}`);
        saveCareer();
        renderStadium();
    }

    function processStadiumProjects() {
        const stadium = GameState.club.stadium;
        if (!Array.isArray(stadium.activeProjects) || !stadium.activeProjects.length) return;
        const completed = [];
        stadium.activeProjects.forEach((project) => {
            project.remainingWeeks = Math.max(0, project.remainingWeeks - 1);
            if (project.remainingWeeks === 0) completed.push(project);
        });
        completed.forEach((project) => completeStadiumUpgrade(project.key));
        stadium.activeProjects = stadium.activeProjects.filter((project) => project.remainingWeeks > 0);
    }

    function completeStadiumUpgrade(key) {
        const stadium = GameState.club.stadium;
        const upgrade = stadium.upgrades[key];
        if (!upgrade) return;
        upgrade.level = clamp(upgrade.level + 1, 1, upgrade.maxLevel);
        if (key === "capacity") {
            const increase = Math.round(stadium.capacity * 0.08);
            stadium.capacity += increase;
            GameState.club.stadiumCapacity = stadium.capacity;
        }
        if (key === "pitch") stadium.pitchState = clamp(stadium.pitchState + 8, 1, 100);
        if (key === "lighting" && upgrade.level >= 4) stadium.eventArchitecture.internationalMatches = true;
        if (key === "stands" || key === "parking") stadium.occupancyBase = clamp(stadium.occupancyBase + 3, 35, 100);
        if (key === "boxes") stadium.ticketRevenue += 1;
        if (key === "food") stadium.eventArchitecture.specialEvents = true;
        if (key === "store") GameState.finance.merchandising += Math.round(GameState.club.fans / 120);
        if (key === "parking") stadium.eventArchitecture.concerts = true;
        stadium.level = Math.max(stadium.level, Math.round(Object.values(stadium.upgrades).reduce((sum, item) => sum + item.level, 0) / 6));
        registerFanReaction("Melhoria do estádio", 3, `A torcida aprovou a conclusão de ${upgrade.label}.`, "news");
        addNews("Clube", `${upgrade.label} concluída`, `A obra no ${stadium.name} foi entregue.`, upgrade.benefit);
    }

    function createClub(id, name, city, country, leagueId, reputation, budget, boardConfidence, primary, secondary, initials, symbol, fans, size, tradition, facilities, capacity, youth, scout, stadiumName, mainObjective) {
        const ticketBase = Math.round(8 + reputation * 0.11);
        return {
            id,
            name,
            city,
            country,
            leagueId,
            reputation,
            budget,
            boardConfidence,
            color: primary,
            colors: [primary, secondary],
            crest: { initials, symbol },
            fans,
            size,
            tradition,
            facilities,
            stadiumCapacity: capacity,
            youthQuality: youth,
            scoutQuality: scout,
            structure: createClubStructure(facilities, youth, scout, reputation),
            stadium: {
                name: stadiumName,
                capacity,
                level: Math.max(1, Math.round(facilities / 12)),
                ticketRevenue: ticketBase,
                upgrades: createStadiumUpgrades(reputation, capacity),
                activeProjects: [],
                pitchState: Math.max(58, Math.min(92, facilities + 4)),
                occupancyBase: Math.max(48, Math.min(92, Math.round(reputation * 0.72 + tradition * 0.22))),
                eventArchitecture: {
                    concerts: false,
                    specialEvents: false,
                    internationalMatches: false
                }
            },
            objectives: buildClubObjectives(mainObjective, reputation),
            finances: {
                wageBudget: Math.round(budget * 0.28),
                transferPower: Math.round(budget * (reputation >= 88 ? 0.78 : reputation >= 80 ? 0.62 : 0.48))
            },
            founded: 1880 + (Math.abs(id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)) % 92),
            history: `${name} representa ${city} com uma cultura de futebol baseada em ${tradition >= 82 ? "tradição vencedora" : reputation >= 78 ? "ambição competitiva" : "crescimento sustentável"}, torcida ativa e pressão permanente por evolução.`,
            kits: {
                home: { name: "Principal", colors: [primary, secondary] },
                away: { name: "Visitante", colors: [secondary, primary] },
                third: { name: "Alternativo", colors: ["#f5f5ef", primary] }
            },
            sponsorship: {
                master: reputation >= 88 ? "Genesis Bank" : reputation >= 80 ? "Atlas Energia" : "Nova Arena",
                value: Math.round(budget * 0.08)
            },
            popularity: clamp(Math.round((fans / 100000) + reputation * 0.55 + tradition * 0.2), 1, 99),
            prestige: clamp(Math.round(reputation * 0.62 + tradition * 0.3 + facilities * 0.08), 1, 99),
            aiSquadSize: 24
        };
    }

    function createLeague(id, name, country, division, clubs) {
        return {
            id,
            name,
            country,
            division,
            clubs,
            champion: null,
            table: [],
            rounds: []
        };
    }

    function buildClubObjectives(mainObjective, reputation) {
        const objectives = [mainObjective];
        if (reputation >= 88) objectives.push("Chegar longe na competicao continental");
        if (reputation >= 82) objectives.push("Manter elenco competitivo");
        if (reputation < 78) objectives.push("Controlar financas");
        if (reputation < 82) objectives.push("Revelar jovens");
        return objectives;
    }

    function money(value) {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0
        }).format(value || 0);
    }

    function number(value) {
        return new Intl.NumberFormat("pt-BR").format(value || 0);
    }

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function getLanguageKey() {
        return LANGUAGE_KEYS[GameState?.settings?.language] || "pt-BR";
    }

    function t(key, params = {}) {
        const lang = getLanguageKey();
        const fallback = I18N["pt-BR"][key] || key;
        const template = I18N[lang]?.[key] || fallback;
        return Object.entries(params).reduce((text, [paramKey, paramValue]) => {
            return text.replaceAll(`{${paramKey}}`, String(paramValue));
        }, template);
    }

    function translatePosition(position) {
        return t(`position.${position || "CM"}`);
    }

    function translateCountry(country) {
        return t(`country.${country || "Indefinido"}`);
    }

    function translateCareerPhase(phase) {
        return t(`phase.${phase || "Auge"}`);
    }

    function applyStaticI18n() {
        document.querySelectorAll("[data-i18n]").forEach((element) => {
            element.textContent = t(element.dataset.i18n);
        });
        document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
            element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
        });
    }

    function loadMenuPreferences() {
        return window.EGStorage ? (window.EGStorage.read(MENU_PREFS_KEY) || {}) : {};
    }

    function saveMenuPreferences() {
        const prefs = {
            volume: GameState.settings.volume,
            darkMode: GameState.settings.darkMode,
            animationSpeed: GameState.settings.animationSpeed,
            language: GameState.settings.language
        };
        if (window.EGStorage) window.EGStorage.write(MENU_PREFS_KEY, prefs);
    }

    function changeLanguage(language) {
        GameState.settings.language = language;
        saveMenuPreferences();
        if (GameState.club) saveCareer();
        renderCurrentScreen();
        showToast(t("settings.languageChanged", { language: GameState.settings.language }));
    }

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function hashText(value) {
        return String(value || "").split("").reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) | 0, 0);
    }

    function deterministicNumber(seed, min, max) {
        const range = max - min + 1;
        return min + (Math.abs(hashText(seed)) % range);
    }

    function createPlayerFromRecord(record, source, index, clubModifier = 0) {
        const [
            id, name, nickname, country, birthYear, primaryPosition, secondaryPositions, height, weight, dominantFoot,
            personality, potential, reputation, morale, energy, fitness, salary, marketValue, attributes
        ] = record;
        const profileIndex = source === "market" ? index + 18 : index;
        const profile = historicalPlayerProfiles[profileIndex];
        const profileOverall = profile ? profile[6] : potential;
        const profilePotential = profile ? profile[7] : potential;
        const profileReputation = profile ? profile[8] : reputation;
        const profilePosition = profile ? profile[5] : primaryPosition;
        const profileRarity = profile ? profile[9] : "comum";
        const profileBoost = Math.round((profileOverall - 78) * 0.7);
        const adjustedAttributes = {};
        PLAYER_ATTRIBUTES.forEach((attribute) => {
            adjustedAttributes[attribute] = clamp((attributes[attribute] || 1) + clubModifier + profileBoost, 1, 99);
        });
        const player = {
            id: `${source}-${id}-${index}`,
            databaseId: profile ? profile[0] : id,
            name: profile ? profile[1] : name,
            fullName: profile ? profile[2] : name,
            shortName: profile ? profile[1] : name,
            nickname: profile ? profile[2] : nickname,
            country: profile ? profile[3] : country,
            birthYear: profile ? profile[4] : birthYear,
            primaryPosition: profilePosition,
            secondaryPositions: [...secondaryPositions],
            height,
            weight,
            dominantFoot,
            personality,
            potential: clamp(profilePotential + clubModifier, 1, 99),
            reputation: clamp(profileReputation + clubModifier, 1, 99),
            morale: clamp(morale, 1, 99),
            energy: clamp(energy, 1, 99),
            fitness: clamp(fitness, 1, 99),
            rarity: profileRarity,
            contract: {
                yearsRemaining: 1 + (index % 4),
                expiresYear: START_YEAR + 1 + (index % 4)
            },
            salary,
            marketValue,
            attributes: adjustedAttributes
        };
        return normalizePlayer(player);
    }

    function normalizePlayer(player) {
        const currentYear = GameState ? GameState.currentYear : START_YEAR;
        const primaryPosition = player.primaryPosition || player.position || "CM";
        const tacticalProfile = normalizeTacticalProfile(player, primaryPosition);
        const normalized = {
            ...player,
            name: player.name || player.nome || "Jogador",
            fullName: player.fullName || player.name || player.nome || "Jogador",
            shortName: player.shortName || player.name || player.nome || "Jogador",
            nickname: player.nickname || player.apelido || player.name || "Jogador",
            country: player.country || player.pais || "Indefinido",
            birthYear: player.birthYear || (currentYear - (player.age || 24)),
            primaryPosition,
            secondaryPositions: Array.isArray(player.secondaryPositions) ? player.secondaryPositions : [],
            height: player.height || 178,
            weight: player.weight || 74,
            dominantFoot: player.dominantFoot || "Direito",
            personality: player.personality || "Profissional",
            potential: clamp(player.potential || player.overall || 65, 1, 99),
            reputation: clamp(player.reputation || Math.max(35, (player.overall || 65) - 5), 1, 99),
            rarity: player.rarity || "comum",
            tacticalProfile,
            morale: clamp(player.morale || 75, 1, 99),
            energy: clamp(player.energy || 85, 1, 99),
            fitness: clamp(player.fitness || 90, 1, 99),
            contract: player.contract && typeof player.contract === "object" ? player.contract : { yearsRemaining: 2, expiresYear: currentYear + 2 },
            salary: player.salary || Math.max(4500, (player.overall || 65) * 150),
            marketValue: player.marketValue || player.value || Math.max(150000, (player.overall || 65) * 16000),
            status: player.status || "Disponível",
            injuries: Array.isArray(player.injuries) ? player.injuries : [],
            cards: {
                yellow: player.cards?.yellow ?? deterministicNumber(`${player.id}-yellow`, 0, 4),
                red: player.cards?.red ?? deterministicNumber(`${player.id}-red`, 0, 1)
            },
            statistics: {
                appearances: player.statistics?.appearances ?? deterministicNumber(`${player.id}-apps`, 0, 18),
                goals: player.statistics?.goals ?? (["ST", "CF", "LW", "RW", "CAM"].includes(primaryPosition) ? deterministicNumber(`${player.id}-goals`, 0, 11) : deterministicNumber(`${player.id}-goals`, 0, 3)),
                assists: player.statistics?.assists ?? (["CM", "CAM", "LW", "RW", "RM", "LM"].includes(primaryPosition) ? deterministicNumber(`${player.id}-assists`, 0, 9) : deterministicNumber(`${player.id}-assists`, 0, 4)),
                cleanSheets: player.statistics?.cleanSheets ?? (primaryPosition === "GK" ? deterministicNumber(`${player.id}-cs`, 0, 8) : 0),
                averageRating: player.statistics?.averageRating ?? (6.2 + deterministicNumber(`${player.id}-rating`, 0, 24) / 10)
            },
            history: Array.isArray(player.history) ? player.history : [],
            seasons: Array.isArray(player.seasons) ? player.seasons : [],
            attributes: normalizeAttributes(player.attributes, player.overall || 65, primaryPosition)
        };
        normalized.contract.yearsRemaining = normalized.contract.yearsRemaining || Math.max(1, (normalized.contract.expiresYear || currentYear + 1) - currentYear);
        normalized.contract.expiresYear = normalized.contract.expiresYear || currentYear + normalized.contract.yearsRemaining;
        normalized.position = normalized.primaryPosition;
        normalized.age = calculateAge(normalized, currentYear);
        normalized.overall = calculateCurrentOverall(normalized);
        normalized.careerPhase = getCareerPhase(normalized, currentYear);
        normalized.marketValue = calculateMarketValue(normalized, currentYear);
        normalized.value = normalized.marketValue;
        if (!normalized.history.length) {
            normalized.history = [
                { season: currentYear, club: GameState?.club?.name || "Clube atual", event: "Integrado ao elenco principal", value: normalized.marketValue },
                { season: currentYear - 1, club: "Formação", event: `Evoluiu como ${normalized.primaryPosition}`, value: Math.round(normalized.marketValue * 0.72) }
            ];
        }
        if (!normalized.seasons.length) {
            normalized.seasons = [
                {
                    season: currentYear,
                    club: GameState?.club?.name || "Clube atual",
                    appearances: normalized.statistics.appearances,
                    goals: normalized.statistics.goals,
                    assists: normalized.statistics.assists,
                    rating: normalized.statistics.averageRating
                }
            ];
        }
        if (normalized.fitness < 45 && !normalized.injuries.length) normalized.injuries = [{ type: "Desgaste muscular", weeks: 1 }];
        normalized.status = normalized.loan ? "Emprestado" : normalized.suspendedWeeks ? "Suspenso" : normalized.injuries.length ? "Lesionado" : normalized.energy < 35 ? "Cansado" : normalized.morale < 35 ? "Insatisfeito" : "Disponível";
        return normalized;
    }

    function normalizeTacticalProfile(player, primaryPosition) {
        const override = TACTICAL_PROFILE_OVERRIDES[player.databaseId];
        const naturalAreas = override?.naturalAreas || player.tacticalProfile?.naturalAreas || inferNaturalAreas(primaryPosition, player.secondaryPositions || []);
        return {
            naturalAreas,
            versatility: clamp(override?.versatility ?? player.tacticalProfile?.versatility ?? inferVersatility(player, primaryPosition), 1, 100),
            adaptationCurve: player.tacticalProfile?.adaptationCurve || "gradual",
            preferredRoles: override?.preferredRoles || player.tacticalProfile?.preferredRoles || naturalAreas.slice(0, 3),
            preferredSide: override?.preferredSide || player.tacticalProfile?.preferredSide || inferPreferredSide(primaryPosition, player.dominantFoot)
        };
    }

    function inferNaturalAreas(primaryPosition, secondaryPositions) {
        const areas = new Set([primaryPosition, ...(secondaryPositions || [])]);
        if (primaryPosition === "ST") ["CF"].forEach((area) => areas.add(area));
        if (primaryPosition === "CF") ["ST", "CAM"].forEach((area) => areas.add(area));
        if (primaryPosition === "LW") ["LM", "CF"].forEach((area) => areas.add(area));
        if (primaryPosition === "RW") ["RM", "CF"].forEach((area) => areas.add(area));
        if (primaryPosition === "CAM") ["CM", "CF"].forEach((area) => areas.add(area));
        if (primaryPosition === "CM") ["CDM", "CAM"].forEach((area) => areas.add(area));
        if (primaryPosition === "RB") areas.add("RWB");
        if (primaryPosition === "LB") areas.add("LWB");
        return [...areas];
    }

    function inferVersatility(player, primaryPosition) {
        if (primaryPosition === "GK") return 5;
        const secondaryCount = Array.isArray(player.secondaryPositions) ? player.secondaryPositions.length : 0;
        const mentality = player.attributes?.mentality || 60;
        const technique = player.attributes?.technique || 60;
        return clamp(42 + secondaryCount * 12 + Math.round((mentality + technique) / 12), 1, 100);
    }

    function inferPreferredSide(position, foot) {
        if (["RB", "RWB", "RM", "RW"].includes(position)) return "Direita";
        if (["LB", "LWB", "LM", "LW"].includes(position)) return "Esquerda";
        if (foot === "Esquerdo") return "Esquerda";
        return "Centro";
    }

    function normalizeAttributes(attributes, fallbackOverall, position) {
        const fallback = createFallbackAttributes(fallbackOverall, position);
        const normalized = {};
        PLAYER_ATTRIBUTES.forEach((attribute) => {
            normalized[attribute] = clamp(Math.round((attributes && attributes[attribute]) || fallback[attribute]), 1, 99);
        });
        return normalized;
    }

    function createFallbackAttributes(overall, position) {
        const base = clamp(overall || 62, 1, 99);
        const attrs = {};
        PLAYER_ATTRIBUTES.forEach((attribute) => {
            attrs[attribute] = clamp(base - 8 + ((attribute.length * 7) % 17), 1, 99);
        });
        if (position === "GK") {
            attrs.goalkeeping = clamp(base + 8, 1, 99);
            attrs.shooting = clamp(base - 35, 1, 99);
            attrs.defending = clamp(base - 20, 1, 99);
        } else {
            attrs.goalkeeping = clamp(base - 55, 1, 30);
        }
        return attrs;
    }

    function byPositionThenOverall(a, b) {
        const order = Object.fromEntries(PLAYER_POSITIONS.map((position, index) => [position, index + 1]));
        return (order[a.primaryPosition || a.position] || 99) - (order[b.primaryPosition || b.position] || 99) ||
            calculateCurrentOverall(b) - calculateCurrentOverall(a) ||
            a.name.localeCompare(b.name);
    }

    function calculateAge(player, currentYear) {
        return Math.max(0, (currentYear || START_YEAR) - (player.birthYear || START_YEAR));
    }

    function getCareerPhase(player, currentYear) {
        const age = calculateAge(player, currentYear);
        const overall = player.attributes ? calculateCurrentOverall(player, { skipAgeRefresh: true }) : (player.overall || 0);
        if (age < 16) return "Ainda não estreou";
        if (age >= 39 || overall < 35) return "Aposentado";
        if (age <= 18) return "Jovem promessa";
        if (age <= 23) return "Em crescimento";
        if (age <= 30) return "Auge";
        if (age <= 34) return "Experiente";
        return "Declínio";
    }

    function careerCurveModifier(age, potential, base) {
        const potentialGap = Math.max(0, potential - base);
        if (age < 16) return -10;
        if (age <= 18) return potentialGap * 0.1 - 2;
        if (age <= 23) return potentialGap * 0.28 + 1.5;
        if (age <= 30) return Math.min(4, potentialGap * 0.08);
        if (age <= 34) return -((age - 30) * 1.25);
        return -5 - ((age - 35) * 2.4);
    }

    function calculateCurrentOverall(player, options = {}) {
        const position = player.primaryPosition || player.position || "CM";
        const weights = POSITION_WEIGHTS[position] || POSITION_WEIGHTS.CM;
        let weighted = 0;
        let totalWeight = 0;
        Object.keys(weights).forEach((attribute) => {
            weighted += (player.attributes?.[attribute] || 1) * weights[attribute];
            totalWeight += weights[attribute];
        });
        const attributeBase = totalWeight ? weighted / totalWeight : 50;
        const age = options.skipAgeRefresh ? ((GameState ? GameState.currentYear : START_YEAR) - player.birthYear) : calculateAge(player, GameState ? GameState.currentYear : START_YEAR);
        const potential = player.potential || attributeBase;
        const curve = careerCurveModifier(age, potential, attributeBase);
        const moraleImpact = ((player.morale || 50) - 50) * 0.035;
        const energyImpact = ((player.energy || 50) - 50) * 0.025;
        const fitnessImpact = ((player.fitness || 50) - 50) * 0.03;
        const secondaryBonus = player.secondaryPositions && player.secondaryPositions.includes(position) ? 1 : 0;
        return clamp(Math.round(attributeBase + curve + moraleImpact + energyImpact + fitnessImpact + secondaryBonus), 1, 99);
    }

    function getEconomicMultiplier(currentYear) {
        const decades = Math.max(0, ((currentYear || START_YEAR) - START_YEAR) / 10);
        return Math.pow(1.85, decades);
    }

    function calculateMarketValue(player, currentYear) {
        const overall = calculateCurrentOverall(player);
        const age = calculateAge(player, currentYear);
        const potentialGap = Math.max(0, (player.potential || overall) - overall);
        const phase = getCareerPhase(player, currentYear);
        const positionFactor = player.primaryPosition === "ST" || player.primaryPosition === "CF" || player.primaryPosition === "CAM" ? 1.18 :
            player.primaryPosition === "GK" || player.primaryPosition === "CB" ? 0.92 : 1;
        const rarityFactor = { lendario: 3.6, elite: 2.35, estrela: 1.55, promessa: 1.35, comum: 1 }[player.rarity] || 1;
        const phaseFactor = {
            "Ainda não estreou": 0.25,
            "Jovem promessa": 1.1,
            "Em crescimento": 1.35,
            "Auge": 1.5,
            "Experiente": 0.9,
            "Declínio": 0.48,
            "Aposentado": 0.05
        }[phase] || 1;
        const ageFactor = age <= 23 ? 1.22 : age <= 30 ? 1.08 : age <= 34 ? 0.78 : 0.42;
        const reputationFactor = 0.65 + ((player.reputation || overall) / 100);
        const base = Math.pow(overall, 2.18) * 135;
        const value = base * (1 + potentialGap * 0.035) * positionFactor * rarityFactor * phaseFactor * ageFactor * reputationFactor * getEconomicMultiplier(currentYear);
        return Math.max(25000, Math.round(value / 1000) * 1000);
    }

    function refreshPlayerRuntime(player) {
        player.age = calculateAge(player, GameState.currentYear);
        player.contract.yearsRemaining = Math.max(0, player.contract.expiresYear - GameState.currentYear);
        player.overall = calculateCurrentOverall(player);
        player.careerPhase = getCareerPhase(player, GameState.currentYear);
        player.marketValue = calculateMarketValue(player, GameState.currentYear);
        player.position = player.primaryPosition;
        player.value = player.marketValue;
        return player;
    }

    function refreshAllPlayers() {
        if (!GameState) return;
        GameState.squad = (GameState.squad || []).map(normalizePlayer).map(refreshPlayerRuntime);
        GameState.market = (GameState.market || []).map(normalizePlayer).map(refreshPlayerRuntime);
        ensureTacticsState();
    }

    function ensureTacticsState() {
        if (!GameState) return;
        GameState.tactics = { ...createDefaultTactics(), ...(GameState.tactics || {}) };
        GameState.tactics.setPieces = { ...createDefaultTactics().setPieces, ...(GameState.tactics.setPieces || {}) };
        const squadIds = new Set(GameState.squad.map((player) => player.id));
        GameState.tactics.starters = (GameState.tactics.starters || []).filter((slot) => squadIds.has(slot.playerId)).slice(0, 11);
        const starterIds = new Set(GameState.tactics.starters.map((slot) => slot.playerId));
        GameState.tactics.bench = (GameState.tactics.bench || []).filter((id) => squadIds.has(id) && !starterIds.has(id));
        if (GameState.tactics.starters.length < Math.min(11, GameState.squad.length)) {
            applyBaseFormation(GameState.tactics.baseFormation || "4-3-3", false);
        } else {
            GameState.squad.forEach((player) => {
                if (!starterIds.has(player.id) && !GameState.tactics.bench.includes(player.id)) {
                    GameState.tactics.bench.push(player.id);
                }
            });
        }
        SET_PIECES.forEach((key) => {
            if (!GameState.tactics.setPieces[key] || !squadIds.has(GameState.tactics.setPieces[key])) {
                GameState.tactics.setPieces[key] = GameState.tactics.starters[0]?.playerId || GameState.squad[0]?.id || null;
            }
        });
        ensureAITactics();
    }

    function applyBaseFormation(formationName, shouldRender = true) {
        const coordinates = BASE_FORMATIONS[formationName] || BASE_FORMATIONS["4-3-3"];
        GameState.tactics.baseFormation = formationName;
        const ordered = [...GameState.squad].sort(byPositionThenOverall);
        GameState.tactics.starters = ordered.slice(0, 11).map((player, index) => ({
            playerId: player.id,
            x: coordinates[index][0],
            y: coordinates[index][1]
        }));
        GameState.tactics.bench = ordered.slice(11).map((player) => player.id);
        if (shouldRender) {
            saveCareer();
            renderTactics();
            showToast(`${formationName} aplicada como ponto de partida.`);
        }
    }

    function ensureAITactics() {
        if (!GameState.league?.clubs) return;
        GameState.league.clubs.forEach((club) => {
            if (club.id === GameState.club?.id) return;
            if (!GameState.tactics.ai[club.id]) {
                const base = BASE_FORMATIONS[["4-4-2", "4-3-3", "4-2-3-1"][club.reputation % 3]];
                GameState.tactics.ai[club.id] = {
                    mentality: club.reputation >= 86 ? "Ofensiva" : "Equilibrada",
                    playStyle: club.reputation >= 86 ? "Pressão alta" : "Contra-ataque",
                    coordinates: base.map((point, index) => ({ slot: index, x: point[0], y: point[1] }))
                };
            }
        });
    }

    function getPlayerById(playerId) {
        return GameState.squad.find((player) => player.id === playerId) || null;
    }

    function getStarterSlot(playerId) {
        return GameState.tactics.starters.find((slot) => slot.playerId === playerId) || null;
    }

    function inferRoleFromCoordinates(x, y) {
        if (y >= 86) return "GK";
        if (y >= 68) {
            if (x < 20) return "LB";
            if (x > 80) return "RB";
            return "CB";
        }
        if (y >= 54) {
            if (x < 18) return "LWB";
            if (x > 82) return "RWB";
            return "CDM";
        }
        if (y >= 38) {
            if (x < 22) return "LM";
            if (x > 78) return "RM";
            return "CM";
        }
        if (y >= 23) {
            if (x < 24) return "LW";
            if (x > 76) return "RW";
            return "CAM";
        }
        if (x < 34) return "LW";
        if (x > 66) return "RW";
        return y < 18 ? "ST" : "CF";
    }

    function getRoleCoordinate(role) {
        const map = {
            GK: [50, 92], CB: [50, 74], LB: [16, 72], RB: [84, 72], LWB: [14, 56], RWB: [86, 56],
            CDM: [50, 58], CM: [50, 45], CAM: [50, 31], LM: [18, 43], RM: [82, 43],
            LW: [20, 22], RW: [80, 22], CF: [50, 23], ST: [50, 13]
        };
        return map[role] || [50, 50];
    }

    function getTacticalDistance(player, x, y) {
        const areas = player.tacticalProfile?.naturalAreas || [player.primaryPosition];
        return Math.min(...areas.map((area) => {
            const [ax, ay] = getRoleCoordinate(area);
            return Math.hypot(x - ax, y - ay);
        }));
    }

    function calculateTacticalOverall(player, slot) {
        const base = calculateCurrentOverall(player);
        const x = slot?.x ?? getRoleCoordinate(player.primaryPosition)[0];
        const y = slot?.y ?? getRoleCoordinate(player.primaryPosition)[1];
        const visualRole = inferRoleFromCoordinates(x, y);
        const distance = getTacticalDistance(player, x, y);
        const versatility = player.tacticalProfile?.versatility || 50;
        let loss = Math.pow(distance / 12, 1.35) * (1.35 - versatility / 120);
        if (player.primaryPosition === "GK" && visualRole !== "GK") loss += 55;
        if (player.primaryPosition !== "GK" && visualRole === "GK") loss += 70;
        const footBonus = getFootSideBonus(player, visualRole, x);
        return clamp(Math.round(base - loss + footBonus), 1, 99);
    }

    function getFootSideBonus(player, role, x) {
        if (!["LW", "RW", "LM", "RM", "LWB", "RWB"].includes(role)) return 0;
        const isLeftSide = x < 35;
        const invertedForward = (role === "LW" && player.dominantFoot === "Direito") || (role === "RW" && player.dominantFoot === "Esquerdo");
        const naturalWide = (isLeftSide && player.dominantFoot === "Esquerdo") || (!isLeftSide && player.dominantFoot === "Direito");
        if (invertedForward) return 1;
        if (naturalWide) return 0.5;
        return -0.5;
    }

    function getTacticalZone(player, slot) {
        const distance = getTacticalDistance(player, slot.x, slot.y);
        if (player.primaryPosition === "GK" && inferRoleFromCoordinates(slot.x, slot.y) !== "GK") return "red";
        if (distance <= 13) return "green";
        if (distance <= 31) return "yellow";
        return "red";
    }

    function getTeamTacticalAverage() {
        ensureTacticsState();
        if (!GameState.tactics.starters.length) return 0;
        const sum = GameState.tactics.starters.reduce((total, slot) => {
            const player = getPlayerById(slot.playerId);
            return total + (player ? calculateTacticalOverall(player, slot) : 0);
        }, 0);
        return Math.round(sum / GameState.tactics.starters.length);
    }

    function evolvePlayer(player) {
        const age = calculateAge(player, GameState.currentYear);
        const overall = calculateCurrentOverall(player);
        const potentialGap = Math.max(0, player.potential - overall);
        let growthChance = 0;
        let decline = 0;
        const trainingLevel = GameState?.club?.structure?.departments?.training?.level || 1;
        const trainingBoost = trainingLevel * 0.012;
        if (age <= 18) growthChance = 0.18 + trainingBoost;
        else if (age <= 23) growthChance = 0.42 + trainingBoost;
        else if (age <= 30) growthChance = 0.12 + trainingBoost * 0.6;
        else if (age <= 34) decline = 0.16;
        else decline = 0.42;

        PLAYER_ATTRIBUTES.forEach((attribute) => {
            if (attribute === "goalkeeping" && player.primaryPosition !== "GK") return;
            if (growthChance && potentialGap > 0 && Math.random() < growthChance) {
                const gain = age <= 23 && potentialGap > 8 ? 2 : 1;
                player.attributes[attribute] = clamp(player.attributes[attribute] + gain, 1, 99);
            }
            if (decline && Math.random() < decline) {
                const loss = age >= 35 ? 2 : 1;
                player.attributes[attribute] = clamp(player.attributes[attribute] - loss, 1, 99);
            }
        });

        player.energy = clamp(player.energy - (player.primaryPosition === "GK" ? 5 : 9), 1, 99);
        player.fitness = clamp(player.fitness - (age >= 32 ? 5 : 3), 1, 99);
        player.morale = clamp(player.morale + (Math.random() > 0.5 ? 1 : -1), 1, 99);
        return refreshPlayerRuntime(player);
    }

    function recoverSquadBetweenRounds() {
        const staff = getStaffEffect();
        GameState.squad.forEach((player) => {
            player.energy = clamp(player.energy + 6 + Math.floor(staff.physical / 4), 1, 99);
            player.fitness = clamp(player.fitness + 4 + Math.floor(staff.medical / 5), 1, 99);
            evolvePlayer(player);
        });
        GameState.squad.sort(byPositionThenOverall);
    }

    function createInitialSquad(club) {
        const modifier = Math.round((club.reputation - 65) / 5);
        return playerDatabase.slice(0, 18)
            .map((record, index) => createPlayerFromRecord(record, `squad-${club.id}`, index, modifier))
            .sort(byPositionThenOverall);
    }

    function createMarket() {
        return playerDatabase.slice(18, 38)
            .map((record, index) => createPlayerFromRecord(record, "market", index, 0))
            .sort((a, b) => calculateCurrentOverall(b) - calculateCurrentOverall(a));
    }

    function initializeLeague(selectedClub) {
        const leagueInfo = getLeagueById(selectedClub.leagueId) || leagueCatalog[0];
        const leagueClubIds = new Set(leagueInfo.clubs);
        const clubs = clubCatalog.filter((club) => leagueClubIds.has(club.id)).map(cloneClub);
        const selectedIndex = clubs.findIndex((club) => club.id === selectedClub.id);
        if (selectedIndex >= 0) {
            clubs[selectedIndex] = cloneClub(selectedClub);
        }

        return {
            id: leagueInfo.id,
            name: leagueInfo.name,
            country: leagueInfo.country,
            division: leagueInfo.division,
            clubs,
            table: clubs.map((club) => ({
                clubId: club.id,
                name: club.name,
                played: 0,
                wins: 0,
                draws: 0,
                losses: 0,
                goalsFor: 0,
                goalsAgainst: 0,
                goalDifference: 0,
                points: 0
            })),
            results: [],
            champion: null,
            rounds: []
        };
    }

    function getLeagueById(leagueId) {
        return leagueCatalog.find((league) => league.id === leagueId) || null;
    }

    function getClubById(id) {
        if (!GameState || !GameState.league) return null;
        return GameState.league.clubs.find((club) => club.id === id) || null;
    }

    function getPlayerClubStrength() {
        if (!GameState || !GameState.squad.length) return 60;
        if (GameState.tactics?.starters?.length) return getTeamTacticalAverage();
        const starters = [...GameState.squad].sort((a, b) => calculateCurrentOverall(b) - calculateCurrentOverall(a)).slice(0, 11);
        const average = starters.reduce((sum, player) => sum + calculateCurrentOverall(player), 0) / starters.length;
        return Math.round(average);
    }

    function getClubStrength(club) {
        if (!club) return 60;
        if (GameState.club && club.id === GameState.club.id) return getPlayerClubStrength();
        return Math.round(club.reputation * 0.75 + 18);
    }

    function pickNextOpponent() {
        const opponents = GameState.league.clubs.filter((club) => club.id !== GameState.club.id);
        const index = (GameState.round - 1) % opponents.length;
        GameState.nextOpponentId = opponents[index].id;
        return opponents[index];
    }

    function currentPosition() {
        updateLeagueTable(false);
        const index = GameState.league.table.findIndex((row) => row.clubId === GameState.club.id);
        return index >= 0 ? index + 1 : GameState.league.table.length;
    }

    function pushMessage(text) {
        GameState.messages.unshift(text);
        GameState.messages = GameState.messages.slice(0, 6);
        showToast(text);
    }

    function getEventFeedbackType(text = "") {
        const value = String(text).toLowerCase();
        if (value.includes("vitória") || value.includes("vitoria")) return "win";
        if (value.includes("derrota")) return "loss";
        if (value.includes("empate")) return "draw";
        if (value.includes("contrata")) return "signing";
        if (value.includes("objetivo")) return "objective";
        if (value.includes("notícia") || value.includes("noticia")) return "news";
        return "default";
    }

    function triggerGameFeedback(type = "default") {
        if (window.ElevenGenesisAudio?.playUiEffect) {
            window.ElevenGenesisAudio.playUiEffect(type);
        }
        if (navigator.vibrate) navigator.vibrate(type === "loss" ? 18 : type === "win" || type === "signing" ? [10, 24, 10] : 10);
    }

    function playEventPulse(type = "default") {
        const root = document.getElementById("app");
        if (!root) return;
        root.classList.remove("event-win", "event-loss", "event-draw", "event-signing", "event-news", "event-objective", "event-default");
        void root.offsetWidth;
        root.classList.add(`event-${type}`);
        window.setTimeout(() => root.classList.remove(`event-${type}`), 900);
    }

    function addNews(category, title, text, details = "") {
        if (!GameState) return null;
        const safeCategory = NEWS_CATEGORIES.includes(category) ? category : "Clube";
        const newsItem = {
            id: `news-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            title: String(title || "Atualização do clube"),
            category: safeCategory,
            date: new Date().toISOString(),
            text: String(text || title || "Uma nova atualização foi registrada."),
            details: String(details || text || title || "Detalhes indisponíveis.")
        };
        GameState.news.unshift(newsItem);
        GameState.news = GameState.news.slice(0, 90);
        addNotification(safeCategory, newsItem.title, newsItem.text, newsItem.id);
        playEventPulse("news");
        return newsItem;
    }

    function ensureSeasonFlowState() {
        if (!GameState) return;
        const fresh = createDefaultSeasonFlowState();
        GameState.seasonFlow = {
            ...fresh,
            ...(GameState.seasonFlow || {}),
            calendar: { ...fresh.calendar, ...(GameState.seasonFlow?.calendar || {}) },
            notifications: Array.isArray(GameState.seasonFlow?.notifications) ? GameState.seasonFlow.notifications : [],
            weeklySummaries: Array.isArray(GameState.seasonFlow?.weeklySummaries) ? GameState.seasonFlow.weeklySummaries : [],
            futureArchitecture: { ...fresh.futureArchitecture, ...(GameState.seasonFlow?.futureArchitecture || {}) }
        };
        GameState.seasonFlow.calendar.currentWeek = GameState.round || 1;
        if (!GameState.seasonFlow.calendar.viewedWeek) GameState.seasonFlow.calendar.viewedWeek = GameState.round || 1;
    }

    function addNotification(category, title, text, sourceId = null) {
        if (!GameState) return null;
        ensureSeasonFlowState();
        const notification = {
            id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            category,
            title: String(title || "Atualização"),
            text: String(text || title || "Novo acontecimento registrado."),
            sourceId,
            read: false,
            round: GameState.round || 1,
            season: GameState.season || START_YEAR,
            date: new Date().toISOString()
        };
        GameState.seasonFlow.notifications.unshift(notification);
        GameState.seasonFlow.notifications = GameState.seasonFlow.notifications.slice(0, 80);
        return notification;
    }

    function normalizeNewsItem(item, index = 0) {
        if (typeof item === "string") {
            return {
                id: `legacy-news-${index}`,
                title: item.slice(0, 72),
                category: "Clube",
                date: new Date(START_YEAR, 0, 1).toISOString(),
                text: item,
                details: item
            };
        }
        const category = NEWS_CATEGORIES.includes(item?.category) ? item.category : "Clube";
        return {
            id: item?.id || `legacy-news-${index}`,
            title: item?.title || item?.text || "Atualização do clube",
            category,
            date: item?.date || new Date(START_YEAR, 0, 1).toISOString(),
            text: item?.text || item?.title || "Uma atualização foi registrada.",
            details: item?.details || item?.text || item?.title || "Detalhes indisponíveis."
        };
    }

    function getLatestNews(limit = 3, category = "Todas") {
        const items = (GameState.news || []).map(normalizeNewsItem);
        const filtered = category === "Todas" ? items : items.filter((item) => item.category === category);
        return filtered
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, limit);
    }

    function formatNewsDate(value) {
        const date = value ? new Date(value) : new Date();
        if (Number.isNaN(date.getTime())) return "Data indefinida";
        return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
    }

    function ensureQuestionState() {
        if (!GameState.questions) GameState.questions = { pending: null, history: [], cooldown: 0 };
        if (!Array.isArray(GameState.questions.history)) GameState.questions.history = [];
        if (!GameState.publicRelations) {
            GameState.publicRelations = { fanMoodModifier: 0, sponsorTrust: 50, futureBudgetBoost: 0 };
        }
        return GameState.questions;
    }

    function createQuestionEvent(template) {
        return {
            id: `question-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            origin: template.origin,
            question: template.question,
            context: template.context,
            date: new Date().toISOString(),
            answers: template.answers.map((answer, index) => ({
                id: `${template.origin}-${index}`,
                text: answer.text,
                effects: answer.effects,
                feedback: answer.feedback
            }))
        };
    }

    function getQuestionTemplates() {
        const objective = getObjectiveSummary();
        const morale = getSquadMoraleSummary();
        const last = getLastResultDetails();
        const finances = getFinanceSummary();
        return [
            {
                origin: "Imprensa",
                question: "Qual é o objetivo desta temporada?",
                context: `A coletiva pergunta sobre a ambição do ${GameState.club.name} na ${GameState.league.name}.`,
                answers: [
                    { text: `Vamos buscar ${objective.main.toLowerCase()}.`, effects: { boardConfidence: 2, fanMood: 2, squadMorale: 1, reputation: 1 }, feedback: "A resposta mostrou ambição e alinhamento público com a diretoria." },
                    { text: "O foco é evoluir semana após semana.", effects: { boardConfidence: 1, fanMood: 0, squadMorale: 2 }, feedback: "O elenco recebeu bem o tom equilibrado." },
                    { text: "Não vou prometer nada antes de ver o time em campo.", effects: { boardConfidence: -2, fanMood: -2, squadMorale: -1 }, feedback: "A cautela foi vista como falta de convicção por parte do entorno." }
                ]
            },
            {
                origin: "Diretoria",
                question: "Você está satisfeito com o elenco atual?",
                context: `A diretoria quer entender se o orçamento deve ser protegido ou aberto para reforços.`,
                answers: [
                    { text: "Precisamos de um reforço importante.", effects: { boardConfidence: -1, futureBudget: 180000, sponsorTrust: 1 }, feedback: "A diretoria anotou a solicitação e reservou margem para discussão futura." },
                    { text: "Estou satisfeito e vou valorizar o grupo.", effects: { boardConfidence: 2, squadMorale: 3, fanMood: 1 }, feedback: "O vestiário gostou da confiança pública no elenco." },
                    { text: "O elenco precisa provar que merece ficar.", effects: { boardConfidence: 1, squadMorale: -4, fanMood: -1 }, feedback: "A cobrança agradou a diretoria, mas irritou parte do grupo." }
                ]
            },
            {
                origin: "Torcida",
                question: "Por que o time não convenceu no último jogo?",
                context: `O último resultado registrado foi ${last.score}.`,
                answers: [
                    { text: "Assumo a responsabilidade pelo desempenho.", effects: { boardConfidence: 1, fanMood: 2, squadMorale: 2 }, feedback: "A postura protegeu o elenco e reduziu a pressão externa." },
                    { text: "Faltou concentração dos jogadores.", effects: { boardConfidence: 0, fanMood: -1, squadMorale: -4 }, feedback: "A resposta aumentou a tensão interna no vestiário." },
                    { text: "Foi um jogo duro; vamos corrigir com trabalho.", effects: { boardConfidence: 1, fanMood: 1, squadMorale: 1 }, feedback: "A fala foi recebida como realista e construtiva." }
                ]
            },
            {
                origin: "Patrocinadores",
                question: "O clube pode entregar mais visibilidade nesta temporada?",
                context: `Os patrocinadores acompanham reputação, torcida e posição na tabela.`,
                answers: [
                    { text: "Vamos jogar para vencer e crescer a marca.", effects: { sponsorTrust: 5, futureBudget: 120000, fanMood: 2, reputation: 1 }, feedback: "Os patrocinadores gostaram do discurso agressivo de crescimento." },
                    { text: "A prioridade é estabilidade financeira.", effects: { sponsorTrust: 3, boardConfidence: 2, futureBudget: 60000 }, feedback: "A mensagem conservadora fortaleceu a relação institucional." },
                    { text: "O desempenho em campo falará por nós.", effects: { sponsorTrust: -2, boardConfidence: 0, fanMood: 1 }, feedback: "A resposta foi neutra, mas deixou parceiros esperando sinais concretos." }
                ]
            },
            {
                origin: "Jogadores",
                question: "O grupo quer saber se terá mais espaço nas próximas semanas.",
                context: `A moral média do elenco está em ${morale.average}/99.`,
                answers: [
                    { text: "Quem treinar bem terá oportunidade.", effects: { squadMorale: 3, boardConfidence: 1 }, feedback: "A meritocracia elevou a energia do grupo." },
                    { text: "A base titular será mantida por enquanto.", effects: { squadMorale: -2, boardConfidence: 1, fanMood: 1 }, feedback: "Os reservas ficaram frustrados, mas a mensagem trouxe estabilidade." },
                    { text: "Vou rodar o elenco para manter todos prontos.", effects: { squadMorale: 2, boardConfidence: -1, fanMood: 0 }, feedback: "O elenco gostou, mas a diretoria pediu cuidado com resultados." }
                ]
            }
        ];
    }

    function maybeCreateQuestionEvent(force = false) {
        if (!GameState?.club) return null;
        const questions = ensureQuestionState();
        if (questions.pending) return questions.pending;
        questions.cooldown = Math.max(0, questions.cooldown || 0);
        if (!force && questions.cooldown > 0) {
            questions.cooldown -= 1;
            return null;
        }
        const shouldAsk = force || Math.random() < 0.38 || GameState.boardConfidence < 42 || getSquadMoraleSummary().unhappy >= 3;
        if (!shouldAsk) return null;
        const templates = getQuestionTemplates();
        const template = templates[Math.floor(Math.random() * templates.length)];
        questions.pending = createQuestionEvent(template);
        questions.cooldown = 2;
        addNews("Clube", `Pergunta de ${questions.pending.origin.toLowerCase()} aguarda resposta`, questions.pending.question, questions.pending.context);
        showToast(`Nova pergunta: ${questions.pending.origin}`);
        return questions.pending;
    }

    function applyQuestionEffects(effects = {}) {
        if (typeof effects.boardConfidence === "number") {
            GameState.boardConfidence = clamp(GameState.boardConfidence + effects.boardConfidence, 0, 100);
        }
        if (typeof effects.fanMood === "number") {
            GameState.publicRelations.fanMoodModifier = clamp((GameState.publicRelations.fanMoodModifier || 0) + effects.fanMood, -20, 20);
            registerFanReaction(
                "Resposta pública",
                effects.fanMood,
                effects.fanMood > 0 ? "A torcida gostou da resposta dada publicamente." : "A torcida criticou o tom da resposta pública."
            );
        }
        if (typeof effects.squadMorale === "number") {
            GameState.squad.forEach((player) => {
                player.morale = clamp(player.morale + effects.squadMorale, 1, 99);
            });
            registerDressingRoomEvent(
                "Resposta ao grupo",
                effects.squadMorale,
                effects.squadMorale > 0 ? "O elenco reagiu bem à postura do treinador." : "A fala do treinador gerou incômodo no vestiário.",
                getSquadMoraleSummary().average - effects.squadMorale,
                getSquadMoraleSummary().average
            );
        }
        if (typeof effects.reputation === "number") {
            GameState.club.reputation = clamp(GameState.club.reputation + effects.reputation, 1, 99);
        }
        if (typeof effects.sponsorTrust === "number") {
            GameState.publicRelations.sponsorTrust = clamp((GameState.publicRelations.sponsorTrust || 50) + effects.sponsorTrust, 0, 100);
        }
        if (typeof effects.futureBudget === "number") {
            GameState.publicRelations.futureBudgetBoost = Math.max(0, (GameState.publicRelations.futureBudgetBoost || 0) + effects.futureBudget);
        }
    }

    function describeQuestionEffects(effects = {}) {
        const labels = [];
        if (effects.boardConfidence) labels.push(`Diretoria ${effects.boardConfidence > 0 ? "+" : ""}${effects.boardConfidence}`);
        if (effects.fanMood) labels.push(`Torcida ${effects.fanMood > 0 ? "+" : ""}${effects.fanMood}`);
        if (effects.squadMorale) labels.push(`Moral ${effects.squadMorale > 0 ? "+" : ""}${effects.squadMorale}`);
        if (effects.reputation) labels.push(`Reputação ${effects.reputation > 0 ? "+" : ""}${effects.reputation}`);
        if (effects.sponsorTrust) labels.push(`Patrocinadores ${effects.sponsorTrust > 0 ? "+" : ""}${effects.sponsorTrust}`);
        if (effects.futureBudget) labels.push(`Orçamento futuro +${money(effects.futureBudget)}`);
        return labels.join(" · ") || "Sem impacto direto";
    }

    function answerQuestion(answerId) {
        const questions = ensureQuestionState();
        const question = questions.pending;
        if (!question) return;
        const answer = question.answers.find((item) => item.id === answerId);
        if (!answer) return;
        applyQuestionEffects(answer.effects);
        const record = {
            id: `answer-${Date.now()}`,
            origin: question.origin,
            question: question.question,
            answer: answer.text,
            feedback: answer.feedback,
            effectsText: describeQuestionEffects(answer.effects),
            date: new Date().toISOString()
        };
        questions.history.unshift(record);
        questions.history = questions.history.slice(0, 40);
        questions.pending = null;
        addNews("Clube", `Resposta registrada: ${question.origin}`, answer.feedback, `${question.question} Resposta: ${answer.text}. Impactos: ${record.effectsText}.`);
        saveCareer();
        showToast("Resposta registrada.");
        renderCurrentScreen();
    }

    function updateQuestionModal() {
        const root = document.getElementById("modal-root");
        if (!root) return;
        if (!GameState?.club) {
            root.innerHTML = "";
            return;
        }
        const menuScreens = ["menu", "menuSettings", "menuCredits", "clubSelect"];
        const question = ensureQuestionState().pending;
        if (!question || menuScreens.includes(GameState.currentScreen)) {
            root.innerHTML = "";
            return;
        }
        root.innerHTML = `
            <div class="question-overlay" role="dialog" aria-modal="true" aria-labelledby="question-title">
                <section class="question-modal">
                    <div class="news-topline">
                        <span class="news-category">${escapeHtml(question.origin)}</span>
                        <span class="news-date">${formatNewsDate(question.date)}</span>
                    </div>
                    <h2 id="question-title">${escapeHtml(question.question)}</h2>
                    <p>${escapeHtml(question.context)}</p>
                    <div class="question-answers">
                        ${question.answers.map((answer) => `
                            <button class="question-answer" type="button" data-question-answer="${answer.id}">
                                <strong>${escapeHtml(answer.text)}</strong>
                                <span>${escapeHtml(describeQuestionEffects(answer.effects))}</span>
                            </button>
                        `).join("")}
                    </div>
                </section>
            </div>
        `;
        root.querySelectorAll("[data-question-answer]").forEach((button) => {
            button.addEventListener("click", () => answerQuestion(button.dataset.questionAnswer));
        });
    }

    function showToast(text) {
        const toast = document.getElementById("toast");
        if (!toast) return;
        const type = getEventFeedbackType(text);
        toast.textContent = text;
        toast.dataset.event = type;
        toast.classList.add("visible");
        triggerGameFeedback(type);
        playEventPulse(type);
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove("visible"), 2600);
    }

    function openUIDrawer(htmlContent, title = "Painel") {
        const overlay = document.getElementById("eg-drawer-overlay");
        const content = document.getElementById("eg-drawer-content");
        if (!overlay || !content) return;
        UIState.currentDrawer = title;
        content.innerHTML = htmlContent;
        overlay.dataset.drawer = title;
        overlay.classList.remove("hidden");
        overlay.setAttribute("aria-hidden", "false");
    }

    function closeUIDrawer() {
        const overlay = document.getElementById("eg-drawer-overlay");
        if (!overlay) return;
        UIState.currentDrawer = null;
        delete overlay.dataset.drawer;
        overlay.classList.add("hidden");
        overlay.setAttribute("aria-hidden", "true");
    }

    function renderPlayerDrawerContent(player) {
        if (!player) return `<div class="empty-state" id="eg-drawer-title">Jogador não encontrado.</div>`;
        const overall = calculateCurrentOverall(player);
        const age = calculateAge(player, GameState.currentYear);
        const position = translatePosition(player.primaryPosition || player.position || "-");
        const potential = player.potential || overall;
        return `
            <article class="stack player-drawer-profile">
                <span class="menu-kicker" id="eg-drawer-title">Perfil do jogador</span>
                <h2>${escapeHtml(player.name || player.fullName || "Jogador")}</h2>
                <div class="stat-grid compact">
                    <div class="stat"><span>OVR</span><strong>${overall}</strong></div>
                    <div class="stat"><span>POT</span><strong>${potential}</strong></div>
                    <div class="stat"><span>Posição</span><strong>${escapeHtml(position)}</strong></div>
                    <div class="stat"><span>Idade</span><strong>${age}</strong></div>
                    <div class="stat"><span>Moral</span><strong>${player.morale ?? "-"}</strong></div>
                    <div class="stat"><span>Condição</span><strong>${player.fitness ?? player.energy ?? "-"}</strong></div>
                </div>
                <div class="scout-report">
                    <span>Leitura do treinador</span>
                    <p>${escapeHtml(buildPlayerAtmosphereText(player, overall, potential))}</p>
                </div>
            </article>
        `;
    }

    function buildPlayerAtmosphereText(player, overall, potential) {
        const gap = potential - overall;
        if (gap >= 10) return "Ainda e bruto, mas existe potencial para virar assunto de arquibancada.";
        if ((player.morale || 0) >= 78) return "Chega confiante, treinando forte e pedindo passagem dentro do grupo.";
        if ((player.morale || 0) <= 45) return "O talento existe, mas a cabeca pesa. Precisa de gestao antes de cobranca publica.";
        if (overall >= 82) return "Jogador pronto para assumir responsabilidade. Nao e apenas atributo: e presenca.";
        return "Perfil util para compor elenco, mas exige contexto certo para render no nivel esperado.";
    }

    function saveCareer() {
        if (!GameState) return false;
        refreshAllPlayers();
        GameState.saveMeta = {
            ...(GameState.saveMeta || {}),
            saveCount: (GameState.saveMeta?.saveCount || 0) + 1,
            lastSavedAt: new Date().toISOString()
        };
        GameState.saveVersion = SAVE_VERSION;
        const saved = window.EGStorage.write(SAVE_KEY, GameState);
        updateMenuAvailability();
        return saved;
    }

    function loadCareer() {
        const parsed = window.EGStorage.read(SAVE_KEY);
        if (!parsed) {
            showToast("Nenhuma carreira salva encontrada.");
            return false;
        }

        try {
            GameState = migrateState(parsed);
            switchScreen(GameState.currentScreen || "home", { silent: true });
            showToast("Carreira carregada.");
            return true;
        } catch (error) {
            showToast("Save invalido. Inicie uma nova carreira.");
            return false;
        }
    }

    function migrateState(saved) {
        const fresh = createBaseState();
        const merged = { ...fresh, ...saved };
        merged.settings = { ...fresh.settings, ...(saved.settings || {}) };
        merged.world = saved.world && Array.isArray(saved.world.leagues) ? saved.world : fresh.world;
        merged.club = normalizeSavedClub(saved.club);
        merged.league = saved.league && Array.isArray(saved.league.table) ? migrateLeague(saved.league, merged.club) : (merged.club ? initializeLeague(merged.club) : fresh.league);
        merged.squad = Array.isArray(saved.squad) ? saved.squad : [];
        merged.market = Array.isArray(saved.market) ? saved.market : createMarket();
        merged.squadView = { ...fresh.squadView, ...(saved.squadView || {}) };
        merged.marketView = {
            ...fresh.marketView,
            ...(saved.marketView || {}),
            filters: { ...fresh.marketView.filters, ...(saved.marketView?.filters || {}) }
        };
        merged.transferMarket = {
            ...fresh.transferMarket,
            ...(saved.transferMarket || {}),
            observedPlayerIds: Array.isArray(saved.transferMarket?.observedPlayerIds) ? saved.transferMarket.observedPlayerIds : [],
            negotiations: saved.transferMarket?.negotiations && typeof saved.transferMarket.negotiations === "object" ? saved.transferMarket.negotiations : {},
            futureIntegrations: { ...fresh.transferMarket.futureIntegrations, ...(saved.transferMarket?.futureIntegrations || {}) }
        };
        merged.scout = {
            ...fresh.scout,
            ...(saved.scout || {}),
            assignments: saved.scout?.assignments && typeof saved.scout.assignments === "object" ? saved.scout.assignments : {},
            reports: Array.isArray(saved.scout?.reports) ? saved.scout.reports : [],
            regions: Array.isArray(saved.scout?.regions) ? saved.scout.regions : fresh.scout.regions,
            search: { ...fresh.scout.search, ...(saved.scout?.search || {}) }
        };
        merged.academy = {
            ...fresh.academy,
            ...(saved.academy || {}),
            prospects: Array.isArray(saved.academy?.prospects) ? saved.academy.prospects : [],
            events: Array.isArray(saved.academy?.events) ? saved.academy.events : [],
            keptPlayerIds: Array.isArray(saved.academy?.keptPlayerIds) ? saved.academy.keptPlayerIds : [],
            futureArchitecture: { ...fresh.academy.futureArchitecture, ...(saved.academy?.futureArchitecture || {}) }
        };
        merged.marketing = {
            ...fresh.marketing,
            ...(saved.marketing || {}),
            sponsors: { ...fresh.marketing.sponsors, ...(saved.marketing?.sponsors || {}) },
            proposals: Array.isArray(saved.marketing?.proposals) ? saved.marketing.proposals : [],
            store: { ...fresh.marketing.store, ...(saved.marketing?.store || {}), products: { ...fresh.marketing.store.products, ...(saved.marketing?.store?.products || {}) } },
            campaigns: Array.isArray(saved.marketing?.campaigns) ? saved.marketing.campaigns : [],
            history: Array.isArray(saved.marketing?.history) ? saved.marketing.history : []
        };
        merged.seasonFlow = {
            ...fresh.seasonFlow,
            ...(saved.seasonFlow || {}),
            calendar: { ...fresh.seasonFlow.calendar, ...(saved.seasonFlow?.calendar || {}) },
            notifications: Array.isArray(saved.seasonFlow?.notifications) ? saved.seasonFlow.notifications : [],
            weeklySummaries: Array.isArray(saved.seasonFlow?.weeklySummaries) ? saved.seasonFlow.weeklySummaries : [],
            futureArchitecture: { ...fresh.seasonFlow.futureArchitecture, ...(saved.seasonFlow?.futureArchitecture || {}) }
        };
        merged.tactics = { ...fresh.tactics, ...(saved.tactics || {}) };
        merged.tactics.setPieces = { ...fresh.tactics.setPieces, ...(saved.tactics?.setPieces || {}) };
        merged.messages = Array.isArray(saved.messages) ? saved.messages : [];
        merged.news = Array.isArray(saved.news) ? saved.news.map(normalizeNewsItem) : [];
        merged.newsFilter = saved.newsFilter || fresh.newsFilter;
        merged.selectedNewsId = saved.selectedNewsId || null;
        merged.transferLog = Array.isArray(saved.transferLog) ? saved.transferLog : [];
        merged.aiActivity = Array.isArray(saved.aiActivity) ? saved.aiActivity : [];
        merged.staff = {
            ...fresh.staff,
            ...(saved.staff || {}),
            members: Array.isArray(saved.staff?.members) ? saved.staff.members : fresh.staff.members,
            history: Array.isArray(saved.staff?.history) ? saved.staff.history : [],
            aiChanges: Array.isArray(saved.staff?.aiChanges) ? saved.staff.aiChanges : []
        };
        merged.training = {
            ...fresh.training,
            ...(saved.training || {}),
            individualPlans: saved.training?.individualPlans && typeof saved.training.individualPlans === "object" ? saved.training.individualPlans : {},
            history: Array.isArray(saved.training?.history) ? saved.training.history : []
        };
        merged.finance = {
            ...fresh.finance,
            ...(saved.finance || {}),
            history: Array.isArray(saved.finance?.history) ? saved.finance.history : [],
            alerts: Array.isArray(saved.finance?.alerts) ? saved.finance.alerts : [],
            weeklySnapshots: Array.isArray(saved.finance?.weeklySnapshots) ? saved.finance.weeklySnapshots : []
        };
        merged.board = { ...fresh.board, ...(saved.board || {}) };
        if (merged.club && (!Array.isArray(merged.board.objectives) || !merged.board.objectives.length)) {
            merged.board = createBoardState(merged.club);
        }
        merged.questions = {
            ...fresh.questions,
            ...(saved.questions || {}),
            history: Array.isArray(saved.questions?.history) ? saved.questions.history : [],
            pending: saved.questions?.pending || null
        };
        merged.publicRelations = { ...fresh.publicRelations, ...(saved.publicRelations || {}) };
        merged.fans = {
            ...fresh.fans,
            ...(saved.fans || {}),
            history: Array.isArray(saved.fans?.history) ? saved.fans.history : [],
            comments: Array.isArray(saved.fans?.comments) ? saved.fans.comments : [],
            complaints: Array.isArray(saved.fans?.complaints) ? saved.fans.complaints : [],
            praises: Array.isArray(saved.fans?.praises) ? saved.fans.praises : [],
            lovedPlayerIds: Array.isArray(saved.fans?.lovedPlayerIds) ? saved.fans.lovedPlayerIds : []
        };
        merged.dressingRoom = {
            ...fresh.dressingRoom,
            ...(saved.dressingRoom || {}),
            history: Array.isArray(saved.dressingRoom?.history) ? saved.dressingRoom.history : [],
            conflicts: Array.isArray(saved.dressingRoom?.conflicts) ? saved.dressingRoom.conflicts : [],
            praises: Array.isArray(saved.dressingRoom?.praises) ? saved.dressingRoom.praises : []
        };
        merged.saveMeta = { ...fresh.saveMeta, ...(saved.saveMeta || {}) };
        merged.saveVersion = SAVE_VERSION;
        GameState = merged;
        refreshAllPlayers();
        ensureTransferMarketState();
        ensureScoutState();
        ensureAcademyState();
        ensureMarketingState();
        ensureSeasonFlowState();
        ensureStaffState();
        ensureTrainingState();
        if (merged.club && !merged.nextOpponentId) {
            pickNextOpponent();
        }
        return merged;
    }

    function ensureTransferMarketState() {
        if (!GameState) return;
        const freshView = createDefaultMarketView();
        GameState.marketView = {
            ...freshView,
            ...(GameState.marketView || {}),
            filters: { ...freshView.filters, ...(GameState.marketView?.filters || {}) }
        };
        const freshMarket = createDefaultTransferMarketState();
        GameState.transferMarket = {
            ...freshMarket,
            ...(GameState.transferMarket || {}),
            observedPlayerIds: Array.isArray(GameState.transferMarket?.observedPlayerIds) ? GameState.transferMarket.observedPlayerIds : [],
            negotiations: GameState.transferMarket?.negotiations && typeof GameState.transferMarket.negotiations === "object" ? GameState.transferMarket.negotiations : {},
            futureIntegrations: { ...freshMarket.futureIntegrations, ...(GameState.transferMarket?.futureIntegrations || {}) }
        };
        const marketIds = new Set((GameState.market || []).map((player) => player.id));
        GameState.transferMarket.observedPlayerIds = GameState.transferMarket.observedPlayerIds.filter((id) => marketIds.has(id));
        Object.keys(GameState.transferMarket.negotiations).forEach((id) => {
            if (!marketIds.has(id)) delete GameState.transferMarket.negotiations[id];
        });
        if (GameState.marketView.detailPlayerId && !marketIds.has(GameState.marketView.detailPlayerId)) {
            GameState.marketView.detailPlayerId = null;
        }
    }

    function ensureScoutState() {
        if (!GameState) return;
        const fresh = createDefaultScoutState();
        GameState.scout = {
            ...fresh,
            ...(GameState.scout || {}),
            assignments: GameState.scout?.assignments && typeof GameState.scout.assignments === "object" ? GameState.scout.assignments : {},
            reports: Array.isArray(GameState.scout?.reports) ? GameState.scout.reports : [],
            regions: Array.isArray(GameState.scout?.regions) ? GameState.scout.regions : fresh.regions
        };
        const marketIds = new Set((GameState.market || []).map((player) => player.id));
        Object.keys(GameState.scout.assignments).forEach((playerId) => {
            if (!marketIds.has(playerId)) {
                delete GameState.scout.assignments[playerId];
            }
        });
        (GameState.transferMarket?.observedPlayerIds || []).forEach((playerId) => {
            if (marketIds.has(playerId) && !GameState.scout.assignments[playerId]) {
                startScoutObservation(playerId, { silent: true });
            }
        });
        GameState.transferMarket.observedPlayerIds = Object.keys(GameState.scout.assignments).filter((id) => marketIds.has(id));
    }

    function normalizeSavedClub(savedClub) {
        if (!savedClub) return null;
        const modern = clubCatalog.find((club) => club.id === savedClub.id);
        if (modern) {
            const merged = { ...cloneClub(modern), ...savedClub, budget: savedClub.budget || modern.budget, boardConfidence: savedClub.boardConfidence || modern.boardConfidence };
            merged.stadium = normalizeStadium(savedClub.stadium || modern.stadium, merged);
            merged.structure = normalizeClubStructure(savedClub.structure || modern.structure, merged);
            return merged;
        }
        const fallback = cloneClub(clubCatalog[0]);
        fallback.name = savedClub.name || fallback.name;
        fallback.city = savedClub.city || fallback.city;
        fallback.country = savedClub.country || fallback.country;
        fallback.budget = savedClub.budget || fallback.budget;
        fallback.boardConfidence = savedClub.boardConfidence || fallback.boardConfidence;
        fallback.stadium = normalizeStadium(savedClub.stadium || fallback.stadium, fallback);
        fallback.structure = normalizeClubStructure(savedClub.structure || fallback.structure, fallback);
        return fallback;
    }

    function migrateLeague(savedLeague, club) {
        if (!club) return savedLeague;
        const modernLeague = initializeLeague(club);
        const oldRows = Array.isArray(savedLeague.table) ? savedLeague.table : [];
        modernLeague.table = modernLeague.table.map((row) => {
            const old = oldRows.find((item) => item.clubId === row.clubId || item.name === row.name);
            return old ? { ...row, ...old, name: row.name, clubId: row.clubId } : row;
        });
        modernLeague.results = Array.isArray(savedLeague.results) ? savedLeague.results : [];
        modernLeague.champion = savedLeague.champion || null;
        return modernLeague;
    }

    function resetCareer() {
        const confirmed = window.confirm("Resetar carreira e apagar o save atual?");
        if (!confirmed) return;
        if (window.EGStorage) window.EGStorage.remove(SAVE_KEY);
        GameState = createBaseState();
        renderMenu();
        showToast("Carreira resetada.");
    }

    function startNewCareer(clubId) {
        if (!clubId) {
            GameState = createBaseState();
            renderClubSelect();
            return;
        }

        const selected = clubCatalog.find((club) => club.id === clubId);
        if (!selected) {
            showToast("Clube nao encontrado.");
            return;
        }

        const club = cloneClub(selected);
        GameState = createBaseState();
        GameState.club = club;
        GameState.budget = club.budget;
        GameState.boardConfidence = club.boardConfidence;
        GameState.board = createBoardState(club);
        GameState.questions = createBaseState().questions;
        GameState.publicRelations = createBaseState().publicRelations;
        GameState.fans = createFanState(club);
        GameState.dressingRoom = createDressingRoomState();
        GameState.league = initializeLeague(club);
        GameState.squad = createInitialSquad(club);
        GameState.market = createMarket();
        GameState.academy = createDefaultAcademyState();
        ensureAcademyState();
        GameState.fans.lovedPlayerIds = getLovedPlayers().map((player) => player.id);
        GameState.currentScreen = "home";
        pickNextOpponent();
        pushMessage(`Voce foi contratado pelo ${club.name}. Objetivo inicial: ${club.objectives[0]}.`);
        addNews(
            "Clube",
            `${club.name} confirma novo comandante`,
            `A diretoria apresentou você como treinador para iniciar o projeto em ${GameState.season}.`,
            `O contrato começa com o objetivo principal: ${club.objectives[0]}. O orçamento inicial é de ${money(GameState.budget)} e a confiança da diretoria está em ${GameState.boardConfidence}%.`
        );
        addNews(
            "Diretoria",
            "Objetivo da temporada definido",
            `A diretoria espera que o clube cumpra a meta: ${club.objectives[0]}.`,
            `O desempenho na liga, a estabilidade financeira e a evolução do elenco serão acompanhados semanalmente pela diretoria.`
        );
        saveCareer();
        switchScreen("home", { silent: true });
    }

    function generateSimpleMatch(homeClub, awayClub) {
        const homeStrength = getClubStrength(homeClub) + 5;
        const awayStrength = getClubStrength(awayClub);
        const homeChance = Math.max(0.2, Math.min(0.8, homeStrength / (homeStrength + awayStrength)));
        const homeGoals = weightedGoals(homeChance + 0.08);
        const awayGoals = weightedGoals(1 - homeChance);
        return { homeGoals, awayGoals };
    }

    function weightedGoals(edge) {
        const roll = Math.random();
        const boost = edge > 0.55 ? 0.08 : edge < 0.45 ? -0.05 : 0;
        if (roll < 0.22 - boost) return 0;
        if (roll < 0.58 - boost) return 1;
        if (roll < 0.82) return 2;
        if (roll < 0.95) return 3;
        return 4;
    }

    function applyResult(homeClub, awayClub, homeGoals, awayGoals) {
        const homeRow = GameState.league.table.find((row) => row.clubId === homeClub.id);
        const awayRow = GameState.league.table.find((row) => row.clubId === awayClub.id);
        if (!homeRow || !awayRow) return;

        homeRow.played += 1;
        awayRow.played += 1;
        homeRow.goalsFor += homeGoals;
        homeRow.goalsAgainst += awayGoals;
        awayRow.goalsFor += awayGoals;
        awayRow.goalsAgainst += homeGoals;

        if (homeGoals > awayGoals) {
            homeRow.wins += 1;
            awayRow.losses += 1;
            homeRow.points += 3;
        } else if (awayGoals > homeGoals) {
            awayRow.wins += 1;
            homeRow.losses += 1;
            awayRow.points += 3;
        } else {
            homeRow.draws += 1;
            awayRow.draws += 1;
            homeRow.points += 1;
            awayRow.points += 1;
        }

        homeRow.goalDifference = homeRow.goalsFor - homeRow.goalsAgainst;
        awayRow.goalDifference = awayRow.goalsFor - awayRow.goalsAgainst;
    }

    function simulateOtherMatches(usedOpponentId) {
        const available = GameState.league.clubs
            .filter((club) => club.id !== GameState.club.id && club.id !== usedOpponentId);

        for (let index = 0; index < available.length - 1; index += 2) {
            const homeClub = available[index];
            const awayClub = available[index + 1];
            const result = generateSimpleMatch(homeClub, awayClub);
            applyResult(homeClub, awayClub, result.homeGoals, result.awayGoals);
            GameState.league.results.unshift({
                round: GameState.round,
                home: homeClub.name,
                away: awayClub.name,
                homeGoals: result.homeGoals,
                awayGoals: result.awayGoals
            });
        }
    }

    function simulateClubAI() {
        if (!GameState || !GameState.league) return;
        const activeMarket = GameState.market;
        GameState.league.clubs.forEach((club) => {
            if (club.id === GameState.club.id) return;
            const budgetGrowth = Math.round((club.fans / 120) + (club.reputation * 9500));
            club.budget += budgetGrowth;
            club.aiCoachLevel = club.aiCoachLevel || deterministicNumber(`${club.id}-coach`, 4, 9);
            club.aiFinancialPressure = club.budget < club.reputation * 90000;
            if (Math.random() < 0.34 && activeMarket.length) {
                const affordable = activeMarket
                    .map((player, index) => ({ player, index }))
                    .filter((item) => item.player.marketValue < club.budget * 0.55)
                    .sort((a, b) => calculateCurrentOverall(b.player) - calculateCurrentOverall(a.player));
                if (affordable.length) {
                    const target = affordable[0];
                    club.budget -= target.player.marketValue;
                    club.aiSquadSize = (club.aiSquadSize || 24) + 1;
                    const activity = `${club.name} contratou ${target.player.name} por ${money(target.player.marketValue)}.`;
                    GameState.aiActivity.unshift(activity);
                    addNews("Mercado", `${club.name} se reforça`, activity, `A movimentação mostra que os rivais também estão ativos no mercado e ajustando seus elencos durante a temporada.`);
                    activeMarket.splice(target.index, 1);
                }
            } else if (Math.random() < 0.16) {
                club.aiRenewals = (club.aiRenewals || 0) + 1;
                club.budget -= Math.round(club.reputation * 2400);
                const activity = `${club.name} renovou contrato com peça importante do elenco.`;
                GameState.aiActivity.unshift(activity);
            } else if (Math.random() < 0.08 && club.aiCoachLevel < 7) {
                club.aiCoachLevel += 1;
                club.budget -= Math.round(club.reputation * 5200);
                const activity = `${club.name} demitiu o treinador e contratou nova comissão.`;
                GameState.aiActivity.unshift(activity);
                addNews("Liga", "Mudança no banco rival", activity, "A IA dos clubes reage a desempenho, reputação e pressão financeira.");
            } else if (Math.random() < 0.18 && (club.aiSquadSize || 24) > 20) {
                const saleValue = Math.round((club.reputation * 18000 + Math.random() * 220000) * getEconomicMultiplier(GameState.currentYear));
                club.budget += saleValue;
                club.aiSquadSize -= 1;
                const activity = `${club.name} vendeu um jogador do elenco por ${money(saleValue)}.`;
                GameState.aiActivity.unshift(activity);
                addNews("Mercado", `${club.name} negocia saída`, activity, `A venda aumenta o orçamento do rival e pode mudar sua estratégia para as próximas semanas.`);
            }
            if (club.aiFinancialPressure && (club.aiSquadSize || 24) > 19) {
                const savings = Math.round(club.reputation * 11000);
                club.budget += savings;
                club.aiSquadSize -= 1;
                GameState.aiActivity.unshift(`${club.name} reduziu folha salarial e equilibrou as finanças.`);
            }
        });
        GameState.aiActivity = GameState.aiActivity.slice(0, 8);
    }

    function updateLeagueTable(shouldSave = true) {
        if (!GameState || !GameState.league) return;
        GameState.league.table.sort((a, b) => {
            return b.points - a.points ||
                b.goalDifference - a.goalDifference ||
                b.goalsFor - a.goalsFor ||
                a.name.localeCompare(b.name);
        });
        if (shouldSave && GameState.settings.autoSave) saveCareer();
    }

    function createMatchDramaEvent(outcome, opponent, result, homeClub, awayClub, isClassic, playerHome, streak) {
        if (!GameState || !GameState.club || !opponent || !result) return null;
        const playerGoals = playerHome ? result.homeGoals : result.awayGoals;
        const opponentGoals = playerHome ? result.awayGoals : result.homeGoals;
        const margin = Math.abs(playerGoals - opponentGoals);
        const matchLabel = `${homeClub.name} ${result.homeGoals}x${result.awayGoals} ${awayClub.name}`;
        const rivalName = opponent.name;
        const clubName = GameState.club.name;
        const negativeRun = streak && streak.type === "derrota" && streak.count >= 2;
        const positiveRun = streak && streak.type === "vitoria" && streak.count >= 2;
        const shouldTrigger = isClassic || margin <= 1 || playerGoals >= 4 || opponentGoals >= 4 || negativeRun || positiveRun || outcome === "empate";
        if (!shouldTrigger) return null;

        if (outcome === "vitoria" && margin === 1) {
            return {
                minute: isClassic ? "90+3" : "88",
                type: isClassic ? "CLÁSSICO NO LIMITE" : "VITÓRIA DRAMÁTICA",
                context: "vitoria",
                headline: isClassic ? "O ESTÁDIO VEM ABAIXO!" : "GANHOU NA RAÇA!",
                narrative: `${matchLabel}. O ${clubName} sofreu, resistiu e encontrou forças no fim para derrubar ${rivalName}. Não foi só resultado: foi alívio, grito preso e arquibancada em combustão.`
            };
        }

        if (outcome === "derrota" && margin === 1) {
            return {
                minute: isClassic ? "90+2" : "86",
                type: isClassic ? "DOR DE CLÁSSICO" : "DERROTA AMARGA",
                context: "derrota",
                headline: isClassic ? "SILÊNCIO PESADO" : "ESCAPOU POR DETALHE",
                narrative: `${matchLabel}. O ${clubName} ficou perto de arrancar algo do jogo, mas o golpe final de ${rivalName} deixou a torcida entre vaias, silêncio e aquela sensação de que dava para ter sido diferente.`
            };
        }

        if (outcome === "empate") {
            return {
                minute: isClassic ? "90+4" : "89",
                type: isClassic ? "CLÁSSICO TRAVADO" : "PRESSÃO ATÉ O FIM",
                context: "empate",
                headline: isClassic ? "NINGUÉM RESPIRA" : "TUDO EM ABERTO",
                narrative: `${matchLabel}. O jogo terminou sem vencedor, mas não sem tensão. Cada ataque parecia carregar uma temporada inteira, e a torcida saiu com a garganta gasta e a cabeça cheia de perguntas.`
            };
        }

        if (outcome === "vitoria" && margin >= 3) {
            return {
                minute: "76",
                type: "NOITE DE GALA",
                context: "goleada-favor",
                headline: "A TORCIDA VIROU CARNAVAL!",
                narrative: `${matchLabel}. O ${clubName} atropelou ${rivalName} e transformou a rodada em festa. Quando a goleada virou realidade, o estádio deixou de assistir: passou a cantar junto.`
            };
        }

        if (outcome === "derrota" && margin >= 3) {
            return {
                minute: "76",
                type: "CRISE NA ARQUIBANCADA",
                context: "goleada-contra",
                headline: "VAIAS CORTAM A NOITE",
                narrative: `${matchLabel}. A derrota pesada contra ${rivalName} não foi apenas placar. Foi cobrança, rosto fechado e a sensação de que o próximo treino terá clima de reunião de emergência.`
            };
        }

        if (negativeRun) {
            return {
                minute: "90",
                type: "PRESSÃO POPULAR",
                context: "crise",
                headline: "A TORCIDA PERDE A PACIÊNCIA",
                narrative: `${matchLabel}. A sequência ruim já não é detalhe estatístico: virou assunto de arquibancada. O ${clubName} precisa dar resposta antes que a desconfiança vire rotina.`
            };
        }

        if (positiveRun) {
            return {
                minute: "90",
                type: "EMBALOU",
                context: "euforia",
                headline: "A CIDADE COMEÇA A ACREDITAR",
                narrative: `${matchLabel}. A sequência positiva colocou o ${clubName} em outro tom emocional. O resultado não vive sozinho: ele se soma à confiança de um clube que começa a parecer maior a cada rodada.`
            };
        }

        if (isClassic) {
            return {
                minute: "89",
                type: "CLÁSSICO EM BRASA",
                context: "classico",
                headline: "RIVALIDADE EM CADA BOLA",
                narrative: `${matchLabel}. Contra ${rivalName}, cada lance teve peso dobrado. A rodada virou disputa de orgulho, território e memória para a torcida.`
            };
        }

        return null;
    }

    function dispatchMatchDramaEvent(dramaEvent) {
        if (!dramaEvent || !window.EventBus || typeof window.EventBus.emit !== "function") return;
        window.EventBus.emit("LARGE_EVENT", dramaEvent);
    }

    function advanceRound() {
        if (!GameState || !GameState.club) return;
        const opponent = getClubById(GameState.nextOpponentId) || pickNextOpponent();
        const positionBefore = currentPosition();
        const playerHome = GameState.round % 2 === 1;
        const homeClub = playerHome ? GameState.club : opponent;
        const awayClub = playerHome ? opponent : GameState.club;
        const result = generateSimpleMatch(homeClub, awayClub);

        applyResult(homeClub, awayClub, result.homeGoals, result.awayGoals);
        simulateOtherMatches(opponent.id);
        GameState.league.results.unshift({
            round: GameState.round,
            home: homeClub.name,
            away: awayClub.name,
            homeGoals: result.homeGoals,
            awayGoals: result.awayGoals
        });
        GameState.league.results = GameState.league.results.slice(0, 24);

        const playerGoals = playerHome ? result.homeGoals : result.awayGoals;
        const opponentGoals = playerHome ? result.awayGoals : result.homeGoals;
        const outcome = playerGoals > opponentGoals ? "vitoria" : playerGoals < opponentGoals ? "derrota" : "empate";
        const streak = updateFanStreak(outcome);
        const moraleStreak = updateDressingRoomStreak(outcome);
        const moraleDelta = outcome === "vitoria" ? 4 : outcome === "derrota" ? -5 : 1;
        applySquadMorale(
            moraleDelta + (moraleStreak.count >= 3 ? (outcome === "vitoria" ? 2 : outcome === "derrota" ? -2 : 0) : 0),
            "Resultado da rodada",
            outcome === "vitoria"
                ? "O elenco comemorou a última vitória."
                : outcome === "derrota"
                    ? (moraleStreak.count >= 3 ? "A sequência negativa começou a pesar no vestiário." : "A derrota abalou parte do grupo.")
                    : "O empate manteve o grupo estável.",
            { news: outcome !== "empate" }
        );
        const isClassic = opponent.city === GameState.club.city || opponent.country === GameState.club.country && Math.abs((opponent.reputation || 70) - (GameState.club.reputation || 70)) <= 4;
        const resultDelta = outcome === "vitoria" ? (isClassic ? 9 : 5) : outcome === "derrota" ? (isClassic ? -10 : -6) : (isClassic ? 1 : 0);
        const streakDelta = streak.count >= 3 ? (outcome === "vitoria" ? 4 : outcome === "derrota" ? -5 : 0) : 0;
        const fanComment = outcome === "vitoria"
            ? `A torcida comemorou a vitória${isClassic ? " em jogo de rivalidade" : ""}.`
            : outcome === "derrota"
                ? `A torcida ficou preocupada com a derrota${isClassic ? " em clássico" : ""}.`
                : "A torcida reagiu com cautela ao empate.";
        const dramaEvent = createMatchDramaEvent(outcome, opponent, result, homeClub, awayClub, isClassic, playerHome, streak);
        registerFanReaction("Resultado da rodada", resultDelta + streakDelta, streak.count >= 3 && outcome === "derrota" ? "A torcida está preocupada com a sequência de derrotas." : fanComment, "news");
        const revenue = playerHome ? getAverageMatchRevenue() : 85000;
        const prize = outcome === "vitoria" ? 150000 : outcome === "empate" ? 65000 : 25000;

        applyFinanceMovement("income", "Bilheteria", `Bilheteria da partida contra ${opponent.name}`, revenue);
        GameState.finance.ticketRevenue += revenue;
        applyFinanceMovement("income", "Premiações", `Bônus por resultado: ${outcome}`, prize);
        GameState.finance.prizeMoney += prize;
        GameState.boardConfidence = Math.max(0, Math.min(100, GameState.boardConfidence + (outcome === "vitoria" ? 3 : outcome === "empate" ? 0 : -3)));
        recoverSquadBetweenRounds();
        simulateClubAI();
        GameState.lastResult = `${homeClub.name} ${result.homeGoals}x${result.awayGoals} ${awayClub.name}`;
        GameState.round += 1;
        if (GameState.round > 22) {
            updateLeagueTable(false);
            GameState.league.champion = GameState.league.table[0]?.name || null;
            const worldLeague = GameState.world.leagues.find((league) => league.id === GameState.league.id);
            if (worldLeague) worldLeague.champion = GameState.league.champion;
            GameState.currentYear += 1;
            GameState.season = GameState.currentYear;
            GameState.round = 1;
            pushMessage(`${GameState.league.champion} terminou como campeao. Temporada ${GameState.season} iniciada.`);
        }

        updateLeagueTable(false);
        createRoundNews(outcome, opponent, result, homeClub, awayClub, positionBefore, currentPosition());
        pickNextOpponent();
        pushMessage(`Rodada avancada: ${GameState.lastResult}.`);
        saveCareer();
        renderCurrentScreen();
        dispatchMatchDramaEvent(dramaEvent);
    }

    function buyPlayer(playerId, agreedPrice = null) {
        ensureTransferMarketState();
        const index = GameState.market.findIndex((player) => player.id === playerId);
        if (index < 0) return;
        const player = GameState.market[index];
        const price = agreedPrice || player.marketValue || player.value;
        if (GameState.budget < price) {
            showToast(t("market.insufficientFunds"));
            return;
        }
        applyFinanceMovement("expense", "Transferências", `Compra de ${player.name}`, price);
        GameState.finance.transferSpend += price;
        GameState.squad.push(normalizePlayer({ ...player, id: `squad-bought-${Date.now()}` }));
        GameState.squad.sort(byPositionThenOverall);
        GameState.market.splice(index, 1);
        GameState.transferLog.unshift(`${GameState.club.name} contratou ${player.name} por ${money(price)}.`);
        GameState.transferLog = GameState.transferLog.slice(0, 8);
        const signedPlayer = GameState.squad.find((item) => item.name === player.name);
        const idolSigning = calculateCurrentOverall(player) >= 86 || player.reputation >= 84;
        registerFanReaction(
            "Contratação",
            idolSigning ? 7 : 3,
            idolSigning ? `A torcida comemorou a contratação de ${player.name}.` : `A torcida aprovou a chegada de ${player.name}.`,
            "news"
        );
        if (idolSigning && signedPlayer && !GameState.fans.lovedPlayerIds.includes(signedPlayer.id)) {
            GameState.fans.lovedPlayerIds.push(signedPlayer.id);
        }
        if (idolSigning) {
            applySquadMorale(2, "Contratação importante", `O elenco recebeu bem a chegada de ${player.name}.`, { news: true });
        } else {
            registerDressingRoomEvent("Reforço integrado", 1, `${player.name} foi apresentado ao grupo.`, getSquadMoraleSummary().average, getSquadMoraleSummary().average);
        }
        addNews(
            "Mercado",
            `${player.name} chega ao ${GameState.club.name}`,
            `O clube confirmou a contratação por ${money(price)}.`,
            `${player.name} atua como ${translatePosition(player.primaryPosition)} e chega com overall ${calculateCurrentOverall(player)}, potencial ${player.potential} e valor de mercado recalculado para ${money(player.marketValue)}.`
        );
        pushMessage(`${player.name} contratado por ${money(price)}.`);
        GameState.transferMarket.observedPlayerIds = GameState.transferMarket.observedPlayerIds.filter((id) => id !== playerId);
        delete GameState.transferMarket.negotiations[playerId];
        if (GameState.scout?.assignments) delete GameState.scout.assignments[playerId];
        removeMarketFavorite(playerId, false);
        GameState.marketView.detailPlayerId = null;
        saveCareer();
        renderMarket();
        showToast(t("market.signed"));
    }

    function sellSquadPlayer(playerId) {
        const index = GameState.squad.findIndex((player) => player.id === playerId);
        if (index < 0 || GameState.squad.length <= 16) {
            showToast("Elenco curto demais para vender.");
            return;
        }
        const player = GameState.squad[index];
        const staff = getStaffEffect();
        const interestedClub = GameState.league.clubs
            .filter((club) => club.id !== GameState.club.id)
            .sort((a, b) => Math.abs((b.reputation || 70) - player.reputation) - Math.abs((a.reputation || 70) - player.reputation))[0];
        const price = Math.round((player.marketValue || 0) * (0.88 + staff.negotiation / 80 + Math.random() * 0.18));
        applyFinanceMovement("income", "Venda de jogadores", `Venda de ${player.name}`, price);
        GameState.finance.transferIncome += price;
        GameState.budget += price;
        GameState.transferLog.unshift(`${player.name} vendido para ${interestedClub?.name || "clube interessado"} por ${money(price)}.`);
        GameState.transferLog = GameState.transferLog.slice(0, 10);
        GameState.squad.splice(index, 1);
        addNews("Mercado", `${player.name} deixa o clube`, `Venda concluída por ${money(price)}.`, `Diretor de futebol nível ${Math.round(staff.negotiation)} influenciou a negociação.`);
        saveCareer();
        switchScreen("squad");
    }

    function loanSquadPlayer(playerId) {
        const player = GameState.squad.find((item) => item.id === playerId);
        if (!player) return;
        player.status = "Emprestado";
        player.loan = { club: pickNextOpponent()?.name || "Clube parceiro", until: GameState.season + 1 };
        player.morale = clamp(player.morale + 4, 1, 99);
        GameState.budget += Math.round((player.salary || 0) * 0.35);
        GameState.transferLog.unshift(`${player.name} emprestado para ${player.loan.club}.`);
        addNews("Mercado", `${player.name} será emprestado`, `O empréstimo dá minutos ao atleta e reduz custo salarial.`, `Contrato de empréstimo até ${player.loan.until}.`);
        saveCareer();
        renderPlayerDetail();
    }

    function renewSquadPlayer(playerId) {
        const player = GameState.squad.find((item) => item.id === playerId);
        if (!player) return;
        const staff = getStaffEffect();
        const salaryIncrease = Math.max(800, Math.round((player.salary || 5000) * (0.08 + (100 - staff.negotiation * 7) / 900)));
        player.salary += salaryIncrease;
        player.contract.yearsRemaining = clamp((player.contract.yearsRemaining || 1) + 2, 1, 5);
        player.contract.expiresYear = GameState.currentYear + player.contract.yearsRemaining;
        player.morale = clamp(player.morale + 6, 1, 99);
        GameState.transferLog.unshift(`${player.name} renovou até ${player.contract.expiresYear}.`);
        addNews("Mercado", `${player.name} renova contrato`, `Novo vínculo até ${player.contract.expiresYear}.`, `O salário subiu ${money(salaryIncrease)} e a moral do jogador melhorou.`);
        saveCareer();
        renderPlayerDetail();
    }

    function switchScreen(screen, options = {}) {
        if (!GameState) GameState = createBaseState();
        const root = document.getElementById("screen-root");
        if (window.EGNavigation) window.EGNavigation.animateScreen(root);
        GameState.currentScreen = screen;
        renderCurrentScreen();
        if (!options.silent && GameState.club && GameState.settings.autoSave) saveCareer();
    }

    function renderCurrentScreen() {
        updateChrome();
        if (!GameState || GameState.currentScreen === "menu") return renderMenu();
        if (GameState.currentScreen === "menuSettings") return renderMenuSettings();
        if (GameState.currentScreen === "menuCredits") return renderCredits();
        if (GameState.currentScreen === "clubSelect") return renderClubSelect();
        if (!GameState.club) return renderMenu();

        const renderers = {
            home: renderDashboard,
            squad: renderSquad,
            tactics: renderTactics,
            market: renderMarket,
            scout: renderScout,
            staff: renderStaff,
            training: renderTraining,
            academy: renderAcademy,
            marketing: renderMarketing,
            calendar: renderCalendar,
            notifications: renderNotifications,
            league: renderLeague,
            club: renderClub,
            stadium: renderStadium,
            structure: renderStructure,
            matchPreview: renderMatchPreview,
            resultDetails: renderResultDetails,
            boardRoom: renderBoardRoom,
            newsCenter: renderNewsCenter,
            newsDetail: renderNewsDetail,
            questionHistory: renderQuestionHistory,
            finances: renderFinanceReport,
            dressingRoom: renderDressingRoom,
            fanMood: renderFanMoodScreen,
            settings: renderSettings,
            playerDetail: renderPlayerDetail
        };
        const renderer = renderers[GameState.currentScreen] || renderDashboard;
        try {
            renderer();
        } catch (error) {
            GameState.currentScreen = "home";
            renderDashboard();
            showToast("Tela recuperada automaticamente.");
        }
        const root = document.getElementById("screen-root");
        if (root && !root.textContent.trim()) {
            GameState.currentScreen = "home";
            renderDashboard();
        }
        updateQuestionModal();
    }

    function updateChrome() {
        const topbar = document.getElementById("topbar");
        const nav = document.getElementById("bottom-nav");
        const headerClub = document.getElementById("header-club");
        const headerSeason = document.getElementById("header-season");
        const inCareer = window.EGNavigation ? window.EGNavigation.isCareerScreen(GameState) : Boolean(GameState && GameState.club);

        document.body.dataset.theme = GameState?.settings?.darkMode === false ? "light" : "dark";
        document.body.dataset.animationSpeed = GameState?.settings?.animationSpeed || "normal";
        if (topbar) topbar.style.display = inCareer ? "flex" : "none";
        if (nav) nav.classList.toggle("visible", inCareer);
        const desktopSidebar = document.getElementById("desktop-sidebar");
        if (desktopSidebar) desktopSidebar.classList.toggle("visible", inCareer);
        if (headerClub) headerClub.textContent = inCareer ? GameState.club.name : t("brand.name");
        if (headerSeason) headerSeason.textContent = inCareer ? `${GameState.season} - Rodada ${GameState.round}` : "1970 - Rodada 1";

        if (window.EGNavigation) window.EGNavigation.setActiveNav(GameState.currentScreen);
        document.querySelectorAll(".desktop-nav-button").forEach((button) => {
            button.classList.toggle("active", button.dataset.screen === GameState.currentScreen);
        });
        applyStaticI18n();
    }

    function updateMenuAvailability() {
        const loadButton = document.getElementById("load-career");
        if (loadButton) loadButton.disabled = !window.EGStorage.has(SAVE_KEY);
    }

    function triggerMenuFeedback() {
        if (window.ElevenGenesisAudio?.playUiEffect) {
            window.ElevenGenesisAudio.playUiEffect("menu-select");
        }
        if (navigator.vibrate) navigator.vibrate(12);
    }

    function bindMenuParallax(root) {
        if (!root) return;
        root.addEventListener("pointermove", (event) => {
            const rect = root.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width - 0.5).toFixed(3);
            const y = ((event.clientY - rect.top) / rect.height - 0.5).toFixed(3);
            root.style.setProperty("--menu-parallax-x", x);
            root.style.setProperty("--menu-parallax-y", y);
        });
        root.addEventListener("pointerleave", () => {
            root.style.setProperty("--menu-parallax-x", "0");
            root.style.setProperty("--menu-parallax-y", "0");
        });
    }

    function renderMenu() {
        document.getElementById("app")?.classList.remove("splash-active");
        GameState.currentScreen = "menu";
        updateChrome();
        updateQuestionModal();
        const saveInfo = getSaveInfo();
        const root = document.getElementById("screen-root");
        root.innerHTML = `
            <section class="main-menu screen">
                <div class="menu-stadium" aria-hidden="true">
                    <span class="menu-stadium-light left"></span>
                    <span class="menu-stadium-light right"></span>
                    <span class="menu-stadium-pitch"></span>
                </div>
                <div class="menu-shell">
                    <div class="menu-brand">
                        <div class="menu-emblem">
                            <img src="assets/eleven-genesis-reference.jpeg" alt="${escapeHtml(t("brand.name"))}">
                        </div>
                        <span class="menu-kicker">${escapeHtml(t("brand.tagline"))}</span>
                        <h1>${escapeHtml(t("brand.name"))}</h1>
                        <p>${escapeHtml(t("brand.version", { version: GAME_VERSION }))}</p>
                    </div>
                    <div class="menu-actions">
                        <button class="btn btn-primary menu-button" id="new-career" type="button">${escapeHtml(t("menu.newCareer"))}</button>
                        <button class="btn menu-button" id="load-career" type="button" ${saveInfo.exists ? "" : "disabled"}>${escapeHtml(t("menu.continueCareer"))}</button>
                        ${saveInfo.exists ? "" : `<div class="menu-alert">${escapeHtml(t("menu.noCareer"))}</div>`}
                        <button class="btn btn-ghost menu-button" id="menu-settings" type="button">${escapeHtml(t("menu.settings"))}</button>
                        <button class="btn btn-ghost menu-button" id="menu-credits" type="button">${escapeHtml(t("menu.credits"))}</button>
                    </div>
                    <div class="menu-info-grid" aria-label="${escapeHtml(t("menu.alpha"))}">
                        <div class="menu-info-item"><span>${escapeHtml(t("menu.alpha"))}</span><strong>${escapeHtml(GAME_VERSION)}</strong></div>
                        <div class="menu-info-item"><span>${escapeHtml(t("menu.lastSave"))}</span><strong>${escapeHtml(saveInfo.lastSavedAt)}</strong></div>
                        <div class="menu-info-item"><span>${escapeHtml(t("menu.season"))}</span><strong>${escapeHtml(String(saveInfo.season))}</strong></div>
                        <div class="menu-info-item"><span>${escapeHtml(t("menu.currentClub"))}</span><strong>${escapeHtml(saveInfo.clubName)}</strong></div>
                    </div>
                    <div class="menu-audio-architecture" aria-hidden="true">
                        <div data-audio-hook="menu-select"></div>
                    </div>
                </div>
            </section>
        `;
        bindMenuParallax(root.querySelector(".main-menu"));
        document.querySelectorAll(".menu-button").forEach((button) => {
            button.addEventListener("pointerdown", () => {
                if (!button.disabled) triggerMenuFeedback();
            });
        });
        document.getElementById("new-career").addEventListener("click", (event) => {
            if (event.detail === 0) triggerMenuFeedback();
            startNewCareer();
        });
        document.getElementById("load-career").addEventListener("click", (event) => {
            if (event.detail === 0) triggerMenuFeedback();
            loadCareer();
        });
        document.getElementById("menu-settings").addEventListener("click", (event) => {
            if (event.detail === 0) triggerMenuFeedback();
            renderMenuSettings();
        });
        document.getElementById("menu-credits").addEventListener("click", (event) => {
            if (event.detail === 0) triggerMenuFeedback();
            renderCredits();
        });
        updateMenuAvailability();
    }

    function renderSplashScreen() {
        GameState.currentScreen = "menu";
        const app = document.getElementById("app");
        const root = document.getElementById("screen-root");
        if (!root) {
            renderMenu();
            return;
        }
        if (app) app.classList.add("splash-active");
        updateChrome();
        updateQuestionModal();
        root.innerHTML = `
            <section class="splash-screen" aria-label="${escapeHtml(t("brand.name"))}">
                <div class="splash-particles" aria-hidden="true">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div class="splash-card" role="status" aria-live="polite">
                    <div class="splash-logo-wrap">
                        <div class="splash-logo">${escapeHtml(t("brand.initials"))}</div>
                    </div>
                    <span class="splash-alpha">${escapeHtml(t("splash.alpha"))}</span>
                    <h1>${escapeHtml(t("brand.name"))}</h1>
                    <p class="splash-message">${escapeHtml(t("splash.loading"))}</p>
                    <div class="splash-progress" aria-hidden="true">
                        <span></span>
                    </div>
                </div>
            </section>
        `;
        window.setTimeout(() => {
            root.querySelector(".splash-screen")?.classList.add("is-leaving");
        }, 3000);
        window.setTimeout(renderMenu, 3480);
    }

    function getSaveInfo() {
        const saved = window.EGStorage ? window.EGStorage.read(SAVE_KEY) : null;
        if (!saved) {
            return {
                exists: false,
                clubName: t("menu.noClub"),
                season: "-",
                saveCount: 0,
                lastSavedAt: t("menu.never")
            };
        }
        try {
            return {
                exists: true,
                clubName: saved.club?.name || t("menu.noClub"),
                season: saved.season || saved.currentYear || START_YEAR,
                saveCount: saved.saveMeta?.saveCount || 1,
                lastSavedAt: formatSaveDate(saved.saveMeta?.lastSavedAt)
            };
        } catch (error) {
            return {
                exists: false,
                clubName: t("menu.noClub"),
                season: "-",
                saveCount: 0,
                lastSavedAt: t("menu.never")
            };
        }
    }

    function formatSaveDate(value) {
        if (!value) return "Sem registro";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "Sem registro";
        return date.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
    }

    function renderMenuSettings() {
        GameState.currentScreen = "menuSettings";
        updateChrome();
        document.getElementById("screen-root").innerHTML = `
            <section class="screen menu-panel stack">
                <div>
                    <h1>${escapeHtml(t("settings.title"))}</h1>
                    <p>${escapeHtml(t("settings.subtitle"))}</p>
                </div>
                <div class="card card-pad stack">
                    <label class="field">
                        <span>${escapeHtml(t("settings.volume"))}</span>
                        <input id="menu-volume" type="range" min="0" max="100" value="${GameState.settings.volume}">
                    </label>
                    <div class="row-card">
                        <div class="row-main"><strong>${escapeHtml(t("settings.currentVolume"))}</strong><span id="volume-value">${GameState.settings.volume}%</span></div>
                    </div>
                    <label class="field">
                        <span>${escapeHtml(t("settings.language"))}</span>
                        <select id="menu-language-select">
                            <option value="Português" ${GameState.settings.language === "Português" ? "selected" : ""}>Português</option>
                            <option value="English" ${GameState.settings.language === "English" ? "selected" : ""}>English</option>
                            <option value="Español" ${GameState.settings.language === "Español" ? "selected" : ""}>Español</option>
                        </select>
                    </label>
                    <div class="button-row">
                        <button class="btn btn-danger" id="menu-reset-game" type="button">Resetar jogo</button>
                        <button class="btn" id="menu-settings-back" type="button">${escapeHtml(t("settings.back"))}</button>
                    </div>
                </div>
            </section>
        `;
        document.getElementById("menu-volume").addEventListener("input", (event) => {
            GameState.settings.volume = Number(event.target.value);
            document.getElementById("volume-value").textContent = `${GameState.settings.volume}%`;
            saveMenuPreferences();
        });
        document.getElementById("menu-language-select").addEventListener("change", (event) => {
            changeLanguage(event.target.value);
        });
        document.getElementById("menu-reset-game").addEventListener("click", resetGameFromMenu);
        document.getElementById("menu-settings-back").addEventListener("click", renderMenu);
    }

    function renderCredits() {
        GameState.currentScreen = "menuCredits";
        updateChrome();
        document.getElementById("screen-root").innerHTML = `
            <section class="screen menu-panel stack">
                <div>
                    <h1>Créditos</h1>
                    <p>Informações do projeto.</p>
                </div>
                <div class="card card-pad stack">
                    <div class="logo-mark">${escapeHtml(t("brand.initials"))}</div>
                    <h2>${escapeHtml(t("brand.name"))}</h2>
                    <div class="row-card">${escapeHtml(t("brand.version", { version: GAME_VERSION }))}</div>
                    <div class="row-card">Projeto independente inspirado na experiência dos clássicos managers de futebol, sem utilizar conteúdo oficial protegido.</div>
                    <button class="btn" id="credits-back" type="button">Voltar</button>
                </div>
            </section>
        `;
        document.getElementById("credits-back").addEventListener("click", renderMenu);
    }

    function resetGameFromMenu() {
        if (!window.confirm("Resetar jogo e apagar a carreira salva?")) return;
        window.EGStorage.remove(SAVE_KEY);
        window.EGStorage.remove(MENU_PREFS_KEY);
        GameState = createBaseState();
        renderMenu();
        showToast("Jogo resetado.");
    }

    function renderClubSelect() {
        GameState.currentScreen = "clubSelect";
        updateChrome();
        const offerClubs = clubCatalog
            .filter((club) => ["rio-vermelho", "man-red", "north-london", "madrid-chamartin", "catalunya-fc", "milano-rosso", "piemonte", "bayern-munchen", "paris-sg", "lisboa-sl", "amsterdam-afc", "buenos-aires-blue"].includes(club.id));
        const cards = offerClubs.map((club) => {
            const league = getLeagueById(club.leagueId);
            const tier = getClubTier(club);
            const difficulty = club.reputation >= 88 ? t("clubSelect.easy") : club.reputation >= 80 ? t("clubSelect.medium") : t("clubSelect.hard");
            const challengeKey = tier === "Gigante" ? "clubSelect.challenge.giant" : tier === "Grande" ? "clubSelect.challenge.big" : tier === "Medio" ? "clubSelect.challenge.medium" : "clubSelect.challenge.small";
            return `
            <article class="club-offer-card" style="--club-a:${club.colors?.[0] || club.color};--club-b:${club.colors?.[1] || "#f7f8f4"}">
                <div class="club-offer-banner" aria-hidden="true"></div>
                <div class="club-offer-top">
                    ${renderClubCrest(club, "offer")}
                    <div>
                        <span class="menu-kicker">${escapeHtml(league?.name || "Liga Nacional")}</span>
                        <h2>${escapeHtml(club.name)}</h2>
                        <div class="meta"><span>${escapeHtml(club.city)}</span><span>${escapeHtml(club.country)}</span><span>${escapeHtml(club.stadium?.name || club.name)}</span></div>
                    </div>
                </div>
                <p>${escapeHtml(t(challengeKey))}</p>
                <div class="club-offer-stats">
                    <div><span>${escapeHtml(t("clubSelect.reputation"))}</span><strong>${club.reputation}</strong></div>
                    <div><span>${escapeHtml(t("clubSelect.budget"))}</span><strong>${money(club.budget)}</strong></div>
                    <div><span>${escapeHtml(t("clubSelect.difficulty"))}</span><strong>${escapeHtml(difficulty)}</strong></div>
                    <div><span>${escapeHtml(t("clubSelect.expectation"))}</span><strong>${escapeHtml(club.objectives[0])}</strong></div>
                </div>
                <button class="btn btn-primary" type="button" data-start-club="${club.id}">${escapeHtml(t("clubSelect.accept"))}</button>
            </article>
        `}).join("");

        document.getElementById("screen-root").innerHTML = `
            <section class="screen stack club-select-screen">
                <div class="club-select-hero">
                    <div class="club-select-lights" aria-hidden="true"></div>
                    <span class="menu-kicker">${escapeHtml(t("brand.name"))}</span>
                    <h1>${escapeHtml(t("clubSelect.title"))}</h1>
                    <p>${escapeHtml(t("clubSelect.subtitle"))}</p>
                </div>
                <div class="club-offer-grid">${cards}</div>
            </section>
        `;

        document.querySelectorAll("[data-start-club]").forEach((button) => {
            button.addEventListener("click", () => startNewCareer(button.dataset.startClub));
        });
    }

    function renderInternalHero(title, subtitle, icon = "EG") {
        return `
            <div class="internal-hero">
                <div class="internal-hero-field" aria-hidden="true"></div>
                <div class="internal-hero-content">
                    <span class="internal-hero-icon">${escapeHtml(icon)}</span>
                    <div>
                        <span class="menu-kicker">${escapeHtml(t("brand.name"))}</span>
                        <h1>${escapeHtml(title)}</h1>
                        <p>${escapeHtml(subtitle)}</p>
                    </div>
                </div>
            </div>
        `;
    }

    function getClubRanking() {
        ensureClubProfile(GameState.club);
        const row = getClubLeagueRow(GameState.club.id);
        const score = (GameState.club.reputation * 2) + (GameState.club.prestige || 60) + (row.points * 4) + GameState.boardConfidence;
        const leagueScores = GameState.league.clubs.map((club) => {
            const clubRow = getClubLeagueRow(club.id);
            return {
                clubId: club.id,
                score: (club.reputation * 2) + (club.prestige || club.tradition || 60) + (clubRow.points * 4) + (club.id === GameState.club.id ? GameState.boardConfidence : 65)
            };
        }).sort((a, b) => b.score - a.score);
        return {
            national: leagueScores.findIndex((item) => item.clubId === GameState.club.id) + 1,
            score: Math.round(score)
        };
    }

    function ensureClubProfile(club) {
        if (!club) return null;
        const colors = club.colors || [club.color || "#00A65A", "#F5F5EF"];
        club.founded = club.founded || (1880 + (Math.abs(hashText(club.id || club.name)) % 92));
        club.history = club.history || `${club.name} nasceu em ${club.city} e construiu sua identidade em torno de torcida, tradição e ambição esportiva.`;
        club.kits = club.kits || {
            home: { name: "Principal", colors },
            away: { name: "Visitante", colors: [colors[1], colors[0]] },
            third: { name: "Alternativo", colors: ["#f5f5ef", colors[0]] }
        };
        club.sponsorship = club.sponsorship || {
            master: club.reputation >= 88 ? "Genesis Bank" : club.reputation >= 80 ? "Atlas Energia" : "Nova Arena",
            value: Math.round((club.budget || GameState.budget || 1000000) * 0.08)
        };
        club.popularity = club.popularity || clamp(Math.round((club.fans || 100000) / 100000 + (club.reputation || 60) * 0.55 + (club.tradition || 60) * 0.2), 1, 99);
        club.prestige = club.prestige || clamp(Math.round((club.reputation || 60) * 0.62 + (club.tradition || 60) * 0.3 + (club.facilities || 60) * 0.08), 1, 99);
        return club;
    }

    function getRecentTransfers(limit = 4) {
        const log = (GameState.transferLog || []).slice(0, limit).map((text, index) => ({ text, type: "Contratação", round: Math.max(1, GameState.round - index) }));
        if (log.length) return log;
        return GameState.squad
            .slice(0, limit)
            .map((player) => ({ text: `${player.name} valorizado para ${money(player.marketValue)}`, type: "Elenco", round: GameState.round }));
    }

    function getDashboardCalendar(limit = 4) {
        const opponent = getClubById(GameState.nextOpponentId) || pickNextOpponent();
        return [
            { label: "Próximo jogo", value: `${GameState.club.name} x ${opponent.name}`, meta: getNextMatchDate() },
            { label: "Janela", value: isTransferWindow(GameState.round) ? "Transferências abertas" : "Mercado monitorado", meta: getCalendarMonth(GameState.round) },
            { label: "Financeiro", value: "Fechamento semanal", meta: `Semana ${GameState.round}` },
            { label: "Base e Scout", value: "Relatórios internos", meta: `${getScoutCapacity()} vagas de scout` }
        ].slice(0, limit);
    }

    function renderMiniList(items, emptyText) {
        return items.length ? items.map((item) => `
            <div class="row-card">
                <div class="row-main"><strong>${escapeHtml(item.title || item.value || item.text)}</strong><span>${escapeHtml(item.meta || item.type || "")}</span></div>
                ${item.text && item.title ? `<span class="muted">${escapeHtml(item.text)}</span>` : ""}
            </div>
        `).join("") : `<div class="empty-state">${escapeHtml(emptyText)}</div>`;
    }

    function renderKitSwatch(kit) {
        return `
            <div class="kit-swatch" style="--kit-a:${kit.colors[0]};--kit-b:${kit.colors[1]}">
                <span></span>
                <strong>${escapeHtml(kit.name)}</strong>
            </div>
        `;
    }

    function getPlayerTrend(player) {
        const overall = calculateCurrentOverall(player);
        const potentialGap = Math.max(0, player.potential - overall);
        if (potentialGap >= 8 && calculateAge(player, GameState.currentYear) <= 24) return "Em evolução";
        if (player.fitness < 50) return "Recuperação";
        if (player.morale < 45) return "Oscilando";
        return "Estável";
    }

    function getInterestedClubs(player, limit = 3) {
        return GameState.league.clubs
            .filter((club) => club.id !== GameState.club.id)
            .map((club) => ({
                club,
                score: 100 - Math.abs((club.reputation || 70) - (player.reputation || calculateCurrentOverall(player))) + deterministicNumber(`${club.id}-${player.id}`, 0, 18)
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map((item) => item.club.name);
    }

    function ensureStaffState() {
        const fresh = createDefaultStaffState();
        GameState.staff = {
            ...fresh,
            ...(GameState.staff || {}),
            members: Array.isArray(GameState.staff?.members) && GameState.staff.members.length ? GameState.staff.members : fresh.members,
            history: Array.isArray(GameState.staff?.history) ? GameState.staff.history : [],
            aiChanges: Array.isArray(GameState.staff?.aiChanges) ? GameState.staff.aiChanges : []
        };
        const byId = new Map(GameState.staff.members.map((member) => [member.id, member]));
        fresh.members.forEach((member) => {
            if (!byId.has(member.id)) GameState.staff.members.push(member);
        });
        return GameState.staff;
    }

    function ensureTrainingState() {
        const fresh = createDefaultTrainingState();
        GameState.training = {
            ...fresh,
            ...(GameState.training || {}),
            individualPlans: GameState.training?.individualPlans && typeof GameState.training.individualPlans === "object" ? GameState.training.individualPlans : {},
            history: Array.isArray(GameState.training?.history) ? GameState.training.history : []
        };
        return GameState.training;
    }

    function getStaffMember(id) {
        return ensureStaffState().members.find((member) => member.id === id) || createDefaultStaffState().members.find((member) => member.id === id);
    }

    function getStaffEffect() {
        ensureStaffState();
        const level = (id) => getStaffMember(id)?.level || 1;
        return {
            tactical: level("headCoach") + level("assistant") * 0.45,
            technical: level("technicalCoach") + level("headCoach") * 0.25,
            physical: level("fitnessCoach"),
            medical: level("doctor"),
            scout: level("scout"),
            morale: level("psychologist") + level("assistant") * 0.2,
            negotiation: level("director")
        };
    }

    function getTrainingDefinitions() {
        return {
            balanced: { label: "Equilibrado", attrs: ["stamina", "technique", "passing", "mentality"], energy: -4, morale: 1 },
            attacking: { label: "Treino ofensivo", attrs: ["shooting", "dribbling", "vision", "technique"], energy: -6, morale: 1 },
            defensive: { label: "Treino defensivo", attrs: ["defending", "physical", "mentality", "stamina"], energy: -6, morale: 0 },
            technical: { label: "Treino técnico", attrs: ["technique", "passing", "dribbling", "vision"], energy: -5, morale: 1 },
            physical: { label: "Treino físico", attrs: ["stamina", "physical", "pace"], energy: -9, morale: -1 },
            tactical: { label: "Treino tático", attrs: ["mentality", "leadership", "passing", "vision"], energy: -5, morale: 1 },
            recovery: { label: "Recuperação", attrs: ["stamina"], energy: 8, morale: 2 }
        };
    }

    function setTrainingFocus(focus) {
        const definitions = getTrainingDefinitions();
        if (!definitions[focus]) return;
        ensureTrainingState().focus = focus;
        saveCareer();
        renderTraining();
    }

    function setIndividualTraining(playerId, attribute) {
        if (!PLAYER_ATTRIBUTES.includes(attribute)) return;
        ensureTrainingState().individualPlans[playerId] = attribute;
        saveCareer();
        renderTraining();
    }

    function processTrainingWeek() {
        const training = ensureTrainingState();
        const staff = getStaffEffect();
        const definition = getTrainingDefinitions()[training.focus] || getTrainingDefinitions().balanced;
        const intensity = clamp(training.weeklyIntensity || 60, 20, 100);
        let evolved = 0;
        GameState.squad.forEach((player) => {
            const age = calculateAge(player, GameState.currentYear);
            const ageFactor = age <= 21 ? 1.55 : age <= 24 ? 1.25 : age <= 29 ? 0.85 : age <= 33 ? 0.45 : 0.18;
            const moraleFactor = 0.75 + (player.morale || 50) / 170;
            const energyFactor = 0.7 + (player.energy || 50) / 180;
            const staffFactor = 0.65 + ((staff.technical + staff.tactical + staff.physical) / 36);
            const gainChance = Math.min(0.78, (intensity / 130) * ageFactor * moraleFactor * energyFactor * staffFactor);
            const attrs = [...definition.attrs];
            const individual = training.individualPlans[player.id];
            if (individual) attrs.unshift(individual);
            attrs.slice(0, 4).forEach((attr) => {
                if (Math.random() < gainChance && player.attributes[attr] < player.potential) {
                    player.attributes[attr] = clamp(player.attributes[attr] + 1, 1, 99);
                    evolved += 1;
                }
            });
            player.energy = clamp((player.energy || 70) + definition.energy + Math.round(staff.physical / 3), 1, 99);
            player.fitness = clamp((player.fitness || 70) + (definition.label === "Recuperação" ? 7 : -Math.round(intensity / 34)) + Math.round(staff.medical / 4), 1, 99);
            player.morale = clamp((player.morale || 70) + definition.morale + Math.round(staff.morale / 7), 1, 99);
            refreshPlayerRuntime(player);
        });
        const record = {
            round: GameState.round,
            focus: definition.label,
            evolved,
            intensity,
            date: new Date().toISOString()
        };
        training.history.unshift(record);
        training.history = training.history.slice(0, 20);
        training.lastProcessedRound = GameState.round;
        if (evolved > 0) addNews("Clube", "Treinamento gera evolução", `${evolved} atributos evoluíram no elenco.`, `Foco semanal: ${definition.label}. Staff técnico e moral do grupo influenciaram o ganho.`);
        return record;
    }

    function renderDashboard() {
        const opponent = getClubById(GameState.nextOpponentId) || pickNextOpponent();
        const position = currentPosition();
        const leagueRow = getClubLeagueRow(GameState.club.id);
        const objective = getObjectiveSummary();
        const finances = getFinanceSummary();
        const morale = getSquadMoraleSummary();
        const fanMood = getFanMood();
        const nextMatchDate = getNextMatchDate();
        const matchLocation = GameState.round % 2 === 1 ? t("home.home") : t("home.away");
        const latestNews = getLatestNews(3);
        const financeAlerts = updateFinanceAlerts(finances);
        const alerts = [
            ...financeAlerts.slice(0, 1).map((alert) => ({ icon: "⚠", text: alert.text, action: "finances" })),
            morale.average < 55 ? { icon: "🧠", text: "O vestiário pede uma resposta antes da próxima partida.", action: "dressing" } : null,
            fanMood.score < 48 ? { icon: "📣", text: "A torcida está impaciente. O próximo jogo ganhou peso.", action: "fans" } : null
        ].filter(Boolean).slice(0, 3);
        const news = latestNews.length ? latestNews : [{ title: "Semana de trabalho", category: "Clube", text: "O clube prepara o próximo compromisso." }];

        document.getElementById("screen-root").innerHTML = `
            <section class="screen eg3-dashboard" aria-label="Sala do treinador">
                <section class="eg3-next-match" data-director-action="match" role="button" tabindex="0">
                    <div class="eg3-section-kicker">${escapeHtml(t("home.nextMatch"))}</div>
                    <div class="eg3-match-row">
                        <div class="eg3-match-team">
                            ${renderClubCrest(GameState.club)}
                            <strong>${escapeHtml(GameState.club.name)}</strong>
                        </div>
                        <div class="eg3-match-center">
                            <b>VS</b>
                            <span>${escapeHtml(nextMatchDate)}</span>
                            <small>${escapeHtml(GameState.league.name)}</small>
                        </div>
                        <div class="eg3-match-team">
                            ${renderClubCrest(opponent)}
                            <strong>${escapeHtml(opponent.name)}</strong>
                        </div>
                    </div>
                    <div class="eg3-match-footer">
                        <span>${escapeHtml(matchLocation)} · ${position}º colocado · ${leagueRow.points} pts</span>
                        <button class="btn btn-primary" type="button" data-director-action="match">${escapeHtml(t("home.prepareMatch"))} →</button>
                    </div>
                </section>

                <div class="eg3-dashboard-main">
                    <section class="eg3-dashboard-primary">
                        ${alerts.length ? `<div class="eg3-alerts">${alerts.map((alert) => `
                            <button class="eg3-alert" type="button" data-director-action="${escapeHtml(alert.action)}"><span>${escapeHtml(alert.icon)}</span><strong>${escapeHtml(alert.text)}</strong><em>→</em></button>
                        `).join("")}</div>` : ""}

                        <section class="eg3-panel eg3-news-panel">
                            <div class="eg3-panel-head"><span>Últimos acontecimentos</span><strong>${news.length}</strong></div>
                            <div class="eg3-news-list">
                                ${news.slice(0, 3).map((item) => `
                                    <button class="eg3-news-item" type="button" data-director-action="news">
                                        <span>${escapeHtml(item.category || "Clube")}</span>
                                        <strong>${escapeHtml(item.title || item.text)}</strong>
                                        <small>${escapeHtml(item.text || "Acompanhe os bastidores do clube.")}</small>
                                    </button>
                                `).join("")}
                            </div>
                        </section>
                    </section>

                    <aside class="eg3-dashboard-side">
                        <details class="eg3-accordion" open>
                            <summary><span>Objetivo da diretoria</span><strong>${objective.progressValue}%</strong></summary>
                            <div class="eg3-accordion-body">
                                <h3>${escapeHtml(objective.main)}</h3>
                                <p>${escapeHtml(objective.progress)}</p>
                                <i class="eg3-progress"><b style="width:${clamp(objective.progressValue || 0, 0, 100)}%"></b></i>
                            </div>
                        </details>
                        <details class="eg3-accordion">
                            <summary><span>Finanças</span><strong>${money(GameState.budget)}</strong></summary>
                            <div class="eg3-accordion-body eg3-finance-lines">
                                <p><span>Receita semanal</span><strong>${money(finances.weekIncome)}</strong></p>
                                <p><span>Despesa semanal</span><strong>${money(finances.weekExpenses)}</strong></p>
                                <p><span>Saldo projetado</span><strong>${money(GameState.budget + finances.weekIncome - finances.weekExpenses)}</strong></p>
                            </div>
                        </details>
                        <details class="eg3-accordion">
                            <summary><span>Clima do clube</span><strong>${escapeHtml(fanMood.label)}</strong></summary>
                            <div class="eg3-accordion-body eg3-finance-lines">
                                <p><span>Moral média</span><strong>${morale.average}/99</strong></p>
                                <p><span>Energia</span><strong>${morale.energy}/99</strong></p>
                                <p><span>Torcida</span><strong>${escapeHtml(fanMood.description)}</strong></p>
                            </div>
                        </details>
                    </aside>
                </div>

                <div class="director-actions eg3-director-actions">
                    <button class="btn btn-primary advance-week" id="advance-week" type="button">${escapeHtml(t("home.advanceWeek"))}</button>
                    <button class="btn" id="manual-save" type="button">${escapeHtml(t("home.save"))}</button>
                    <button class="btn btn-ghost" id="back-menu" type="button">${escapeHtml(t("home.menu"))}</button>
                </div>
            </section>
        `;
        document.querySelectorAll("[data-director-action]").forEach((button) => {
            button.addEventListener("click", (event) => {
                event.stopPropagation();
                handleDirectorAction(button.dataset.directorAction);
            });
            button.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") handleDirectorAction(button.dataset.directorAction);
            });
        });
        document.getElementById("advance-week")?.addEventListener("click", advanceWeek);
        document.getElementById("manual-save")?.addEventListener("click", () => { saveCareer(); showToast("Carreira salva."); });
        document.getElementById("back-menu")?.addEventListener("click", renderMenu);
        updateChrome();
    }

    function renderMessages() {
        if (!GameState.messages.length) return `<div class="empty-state">Nenhuma noticia ainda.</div>`;
        return `<div class="list">${GameState.messages.map((message) => `<div class="row-card">${message}</div>`).join("")}</div>`;
    }

    function renderSimpleList(items) {
        return `<div class="list">${items.slice(0, 6).map((item) => `<div class="row-card">${escapeHtml(item)}</div>`).join("")}</div>`;
    }

    function handleDirectorAction(action) {
        const routes = {
            match: "matchPreview",
            lastResult: "resultDetails",
            league: "league",
            board: "boardRoom",
            news: "newsCenter",
            calendar: "calendar",
            notifications: "notifications",
            market: "market",
            scout: "scout",
            academy: "academy",
            marketing: "marketing",
            staff: "staff",
            training: "training",
            club: "club",
            structure: "structure",
            squad: "squad",
            finances: "finances",
            dressing: "dressingRoom",
            fans: "fanMood"
        };
        switchScreen(routes[action] || "home");
    }

    function getClubLeagueRow(clubId) {
        updateLeagueTable(false);
        return GameState.league.table.find((row) => row.clubId === clubId) || {
            played: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            points: 0,
            goalDifference: 0
        };
    }

    function getOpponentPosition(opponentId) {
        updateLeagueTable(false);
        const index = GameState.league.table.findIndex((row) => row.clubId === opponentId);
        return index >= 0 ? index + 1 : GameState.league.table.length;
    }

    function getNextMatchDate() {
        const month = ((GameState.round - 1) % 10) + 2;
        const day = 2 + ((GameState.round * 4) % 24);
        return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${GameState.currentYear}`;
    }

    function getLastResultDetails() {
        const recent = GameState.league.results.find((result) => result.home === GameState.club.name || result.away === GameState.club.name);
        if (!recent) {
            return {
                score: "Sem jogos",
                opponent: "Aguardando estreia",
                scorer: "Ninguém",
                bestPlayer: getBestSquadPlayer()?.name || "Indefinido"
            };
        }
        const opponent = recent.home === GameState.club.name ? recent.away : recent.home;
        const attackingPlayers = GameState.squad
            .filter((player) => ["ST", "CF", "LW", "RW", "CAM"].includes(player.primaryPosition))
            .sort((a, b) => calculateCurrentOverall(b) - calculateCurrentOverall(a));
        return {
            score: `${recent.home} ${recent.homeGoals}x${recent.awayGoals} ${recent.away}`,
            opponent,
            scorer: attackingPlayers[0]?.name || getBestSquadPlayer()?.name || "Sem artilheiro",
            bestPlayer: getBestSquadPlayer()?.name || "Sem destaque"
        };
    }

    function getBestSquadPlayer() {
        return [...GameState.squad].sort((a, b) => calculateCurrentOverall(b) - calculateCurrentOverall(a))[0] || null;
    }

    function getClubTier(club = GameState.club) {
        if (!club) return "Pequeno";
        if (club.size === "Gigante" || club.reputation >= 88) return "Gigante";
        if (club.size === "Grande" || club.reputation >= 80) return "Grande";
        if (club.size === "Medio" || club.reputation >= 72) return "Medio";
        return "Pequeno";
    }

    function createBoardState(club) {
        return {
            objectives: createBoardObjectives(club),
            lastProgressAverage: 0,
            lastReview: null,
            warning: null
        };
    }

    function createBoardObjectives(club) {
        const tier = getClubTier(club);
        const deadline = `Fim de ${GameState?.season || START_YEAR}`;
        if (tier === "Gigante") {
            return [
                createBoardObjective("win-league", "Ganhar campeonato", "Terminar a liga em 1º lugar.", deadline, false),
                createBoardObjective("continental", "Classificar para competição continental", "Manter o clube no Top 4 da liga.", deadline, true),
                createBoardObjective("important-signing", "Contratar reforço importante", "Investir no mercado para manter o elenco competitivo.", deadline, true)
            ];
        }
        if (tier === "Grande") {
            return [
                createBoardObjective("top-table", "Terminar entre os primeiros", "Ficar no Top 6 da classificação.", deadline, false),
                createBoardObjective("continental", "Classificar para competição continental", "Brigar por uma vaga continental.", deadline, true),
                createBoardObjective("healthy-wages", "Manter folha salarial saudável", "Controlar salários dentro do orçamento previsto.", deadline, true)
            ];
        }
        if (tier === "Medio") {
            return [
                createBoardObjective("top-half", "Terminar na metade superior", "Ficar entre os seis primeiros.", deadline, false),
                createBoardObjective("healthy-wages", "Manter folha salarial saudável", "Evitar que a folha comprometa as finanças.", deadline, true),
                createBoardObjective("improve-structure", "Melhorar estrutura", "Elevar instalações, base ou scout ao longo da temporada.", deadline, true)
            ];
        }
        return [
            createBoardObjective("avoid-relegation", "Evitar rebaixamento", "Ficar fora das últimas posições da tabela.", deadline, false),
            createBoardObjective("develop-youth", "Revelar jovens", "Valorizar a base e preparar novos talentos.", deadline, true),
            createBoardObjective("improve-structure", "Melhorar estrutura", "Aumentar a qualidade operacional do clube.", deadline, true)
        ];
    }

    function createBoardObjective(id, title, description, deadline, secondary) {
        return {
            id,
            title,
            description,
            deadline,
            secondary,
            progress: 0,
            progressText: "Ainda sem avaliação",
            status: "Em andamento"
        };
    }

    function ensureBoardState() {
        if (!GameState.board || !Array.isArray(GameState.board.objectives) || !GameState.board.objectives.length) {
            GameState.board = createBoardState(GameState.club);
        }
        GameState.board.objectives = GameState.board.objectives.map((objective) => ({
            ...createBoardObjective(objective.id || "objective", objective.title || "Objetivo", objective.description || "", objective.deadline || `Fim de ${GameState.season}`, Boolean(objective.secondary)),
            ...objective
        }));
        return GameState.board;
    }

    function evaluateBoardObjective(objective) {
        const position = currentPosition();
        const tableSize = GameState.league.table.length || 12;
        const finances = getFinanceSummary();
        const wageBudget = GameState.club.finances?.wageBudget || Math.max(finances.wages, 1);
        const result = { progress: 0, progressText: "Em acompanhamento", status: "Em andamento" };

        if (objective.id === "win-league") {
            result.progress = clamp(Math.round(((tableSize - position + 1) / tableSize) * 100), 5, 100);
            result.progressText = position === 1 ? "Líder da liga" : `Atual: ${position}º lugar`;
        } else if (objective.id === "continental") {
            result.progress = clamp(Math.round(((7 - Math.min(position, 7)) / 6) * 100), 5, 100);
            result.progressText = position <= 4 ? "Dentro da zona continental" : `Fora do Top 4: ${position}º`;
        } else if (objective.id === "important-signing") {
            const spend = GameState.finance.transferSpend || 0;
            const target = Math.max(450000, Math.round((GameState.club.reputation || 75) * 9000));
            result.progress = clamp(Math.round((spend / target) * 100), spend > 0 ? 35 : 0, 100);
            result.progressText = spend > 0 ? `Investido: ${money(spend)}` : "Nenhum reforço confirmado";
        } else if (objective.id === "top-table") {
            result.progress = clamp(Math.round(((7 - Math.min(position, 7)) / 6) * 100), 5, 100);
            result.progressText = position <= 6 ? "Meta de Top 6 cumprida no momento" : `Atual: ${position}º`;
        } else if (objective.id === "top-half") {
            result.progress = clamp(Math.round(((7 - Math.min(position, 7)) / 6) * 100), 5, 100);
            result.progressText = position <= 6 ? "Na metade superior" : `Atual: ${position}º`;
        } else if (objective.id === "healthy-wages") {
            const ratio = finances.wages / Math.max(wageBudget, 1);
            result.progress = clamp(Math.round((1.2 - ratio) * 100), 0, 100);
            result.progressText = `${money(finances.wages)} de ${money(wageBudget)} previstos`;
        } else if (objective.id === "avoid-relegation") {
            const dangerLine = Math.max(10, tableSize - 2);
            result.progress = position < dangerLine ? 82 : clamp(100 - ((position - dangerLine + 1) * 22), 10, 55);
            result.progressText = position < dangerLine ? "Fora da zona de risco" : `Risco: ${position}º lugar`;
        } else if (objective.id === "develop-youth") {
            result.progress = clamp(GameState.club.youthQuality || 50, 5, 100);
            result.progressText = `Base ${GameState.club.youthQuality}/99`;
        } else if (objective.id === "improve-structure") {
            const structure = Math.round(((GameState.club.facilities || 50) + (GameState.club.youthQuality || 50) + (GameState.club.scoutQuality || 50)) / 3);
            result.progress = clamp(structure, 5, 100);
            result.progressText = `Estrutura geral ${structure}/99`;
        }

        if (result.progress >= 85) result.status = "Muito bem encaminhado";
        else if (result.progress >= 60) result.status = "Dentro do esperado";
        else if (result.progress < 35) result.status = "Atenção";
        return result;
    }

    function updateBoardObjectives(applyConfidence = false) {
        const board = ensureBoardState();
        let total = 0;
        board.objectives = board.objectives.map((objective) => {
            const evaluation = evaluateBoardObjective(objective);
            total += evaluation.progress;
            return { ...objective, ...evaluation };
        });
        const average = board.objectives.length ? Math.round(total / board.objectives.length) : 0;
        if (applyConfidence) {
            const previousWarning = board.warning;
            const adjustment = average >= 78 ? 2 : average >= 55 ? 0 : average >= 35 ? -1 : -3;
            GameState.boardConfidence = clamp(GameState.boardConfidence + adjustment, 0, 100);
            board.lastReview = `Semana ${GameState.round} - ${GameState.season}`;
            board.warning = getBoardWarning();
            if (board.warning && board.warning !== previousWarning) {
                addNews("Diretoria", "Diretoria aumenta pressão", board.warning, `A confiança atual é de ${GameState.boardConfidence}%. A demissão ainda não está implementada, mas o risco político já aparece no relatório.`);
            }
        } else {
            board.warning = getBoardWarning();
        }
        board.lastProgressAverage = average;
        return board;
    }

    function getBoardWarning() {
        if (GameState.boardConfidence < 20) return "Risco crítico de demissão caso os resultados não melhorem.";
        if (GameState.boardConfidence < 35) return "Risco de demissão em observação pela diretoria.";
        if (GameState.boardConfidence < 48) return "A diretoria espera evolução nas próximas semanas.";
        return null;
    }

    function getObjectiveSummary() {
        const board = updateBoardObjectives(false);
        const mainObjective = board.objectives.find((objective) => !objective.secondary) || board.objectives[0];
        return {
            main: mainObjective?.title || GameState.club.objectives[0] || "Construir uma temporada sólida",
            progress: mainObjective?.progressText || "Em andamento",
            deadline: mainObjective?.deadline || `Fim de ${GameState.season}`,
            progressValue: mainObjective?.progress || 0
        };
    }

    function getRecentNews() {
        const latest = getLatestNews(3);
        if (latest.length) return latest.map((item) => item.title);
        return [
            `${GameState.club.name} prepara a semana de trabalho.`,
            `Diretoria acompanha o objetivo: ${GameState.club.objectives[0]}.`,
            `${GameState.league.name} segue em disputa.`
        ];
    }

    function getFinanceSummary() {
        ensureMarketingState();
        const wages = GameState.squad.reduce((sum, player) => sum + (player.salary || 0), 0);
        const weeklyWages = Math.round(wages / 52);
        const marketingLevel = GameState.club.structure?.departments?.marketing?.level || 1;
        const administrationLevel = GameState.club.structure?.departments?.administration?.level || 1;
        const signedSponsorship = getSponsorWeeklyIncome();
        const baseSponsorship = Math.round((((GameState.club.reputation || 70) * 22000 + (GameState.club.fans || 1000000) / 55) / 4) * (1 + marketingLevel * 0.018));
        const activeCampaign = GameState.marketing.campaigns[0] && GameState.round - GameState.marketing.campaigns[0].round <= 2 ? GameState.marketing.campaigns[0] : null;
        const sponsorship = signedSponsorship || baseSponsorship;
        const ticketRevenue = Math.round(getAverageMatchRevenue() * (0.18 + (activeCampaign?.attendanceBoost || 0)));
        const stadiumMaintenance = getWeeklyStadiumMaintenance();
        const structureMaintenance = Math.round(((GameState.club.facilities || 50) + (GameState.club.youthQuality || 50) + (GameState.club.scoutQuality || 50)) * 620 * (1 - administrationLevel * 0.018));
        const staff = Math.round(((GameState.club.facilities || 50) * 420) + ((GameState.club.scoutQuality || 50) * 260) + ((GameState.club.youthQuality || 50) * 310));
        const staffPayroll = ensureStaffState().members.reduce((sum, member) => sum + (member.salary || 0), 0);
        const transferInstallments = Math.round((GameState.finance.transferSpend || 0) / 52);
        const bonuses = Math.round(Math.max(0, GameState.boardConfidence - 60) * 1800);
        const store = updateStoreProjection();
        const merchandising = Math.round(store.weeklyRevenue * (1 + (activeCampaign?.revenueBoost || 0)));
        const television = 0;
        const continentalRevenue = 0;
        const weekIncome = sponsorship + ticketRevenue + merchandising + television + continentalRevenue;
        const weekExpenses = weeklyWages + stadiumMaintenance + structureMaintenance + staff + staffPayroll + transferInstallments + bonuses;
        return {
            wages,
            weeklyWages,
            sponsorship,
            ticketRevenue,
            stadiumMaintenance,
            structureMaintenance,
            staff,
            staffPayroll,
            transferInstallments,
            bonuses,
            merchandising,
            television,
            continentalRevenue,
            weekExpenses,
            weekIncome,
            projectedBalance: GameState.budget + weekIncome - weekExpenses
        };
    }

    function recordFinanceMovement(type, category, label, amount) {
        const value = Math.round(amount || 0);
        if (!value) return null;
        const entry = {
            id: `fin-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            date: new Date().toISOString(),
            round: GameState.round,
            season: GameState.season,
            type,
            category,
            label,
            amount: value,
            balance: GameState.budget
        };
        GameState.finance.history.unshift(entry);
        GameState.finance.history = GameState.finance.history.slice(0, 60);
        return entry;
    }

    function applyFinanceMovement(type, category, label, amount) {
        const value = Math.round(amount || 0);
        if (!value) return null;
        if (type === "income") {
            GameState.budget += value;
            GameState.finance.income += value;
        } else {
            GameState.budget -= value;
            GameState.finance.expenses += value;
        }
        return recordFinanceMovement(type, category, label, value);
    }

    function closeWeeklyFinance(finances) {
        applyFinanceMovement("income", "Patrocínio", "Pagamento semanal de patrocínio", finances.sponsorship);
        GameState.finance.sponsorship += finances.sponsorship;
        applyFinanceMovement("income", "Bilheteria", "Receita comercial da semana", finances.ticketRevenue);
        GameState.finance.ticketRevenue += finances.ticketRevenue;
        applyFinanceMovement("income", "Loja Oficial", "Receita semanal da loja", finances.merchandising);
        GameState.finance.merchandising += finances.merchandising;
        applyFinanceMovement("expense", "Folha salarial", "Pagamento semanal de salários", finances.weeklyWages);
        GameState.finance.wagesPaid += finances.weeklyWages;
        applyFinanceMovement("expense", "Manutenção do estádio", "Custos operacionais do estádio", finances.stadiumMaintenance);
        GameState.finance.stadiumMaintenance += finances.stadiumMaintenance;
        applyFinanceMovement("expense", "Manutenção das estruturas", "Centro de treinamento, scout e base", finances.structureMaintenance);
        GameState.finance.structureMaintenance += finances.structureMaintenance;
        applyFinanceMovement("expense", "Funcionários", "Comissão técnica, análise, base e scout", finances.staff);
        GameState.finance.staff = (GameState.finance.staff || 0) + finances.staff;
        applyFinanceMovement("expense", "Staff", "Salários da comissão e diretoria de futebol", finances.staffPayroll);
        GameState.finance.staffPayroll = (GameState.finance.staffPayroll || 0) + finances.staffPayroll;
        applyFinanceMovement("expense", "Parcelas de transferências", "Amortização semanal de negociações", finances.transferInstallments);
        GameState.finance.transferInstallments = (GameState.finance.transferInstallments || 0) + finances.transferInstallments;
        applyFinanceMovement("expense", "Bônus", "Bônus de desempenho e metas internas", finances.bonuses);
        GameState.finance.bonuses += finances.bonuses;
        addFinanceSnapshot();
        updateFinanceAlerts(finances, true);
    }

    function addFinanceSnapshot() {
        GameState.finance.weeklySnapshots.unshift({
            date: new Date().toISOString(),
            season: GameState.season,
            round: GameState.round,
            balance: GameState.budget,
            income: GameState.finance.income,
            expenses: GameState.finance.expenses
        });
        GameState.finance.weeklySnapshots = GameState.finance.weeklySnapshots.slice(0, 12);
    }

    function updateFinanceAlerts(finances = getFinanceSummary(), notify = false) {
        const alerts = [];
        const wageBudget = GameState.club.finances?.wageBudget || Math.max(finances.wages, 1);
        const wageRatio = finances.wages / Math.max(wageBudget, 1);
        if (GameState.budget < 0) alerts.push({ level: "danger", text: "Caixa negativo. O clube precisa cortar custos ou gerar receita." });
        else if (GameState.budget < finances.weekExpenses * 2) alerts.push({ level: "warning", text: "Risco financeiro: saldo cobre poucas semanas de operação." });
        if (wageRatio > 1.08) alerts.push({ level: "warning", text: "Folha salarial muito alta para o orçamento previsto." });
        if (!alerts.length && GameState.budget > finances.weekExpenses * 8) alerts.push({ level: "good", text: "Boa saúde financeira. O clube opera com margem confortável." });
        if (!alerts.length) alerts.push({ level: "neutral", text: "Finanças estáveis, mas sem grande margem para erro." });
        GameState.finance.alerts = alerts;
        const critical = alerts.find((alert) => alert.level === "danger" || alert.level === "warning");
        if (critical && notify) addNews("Financeiro", "Alerta financeiro", critical.text, `Saldo atual: ${money(GameState.budget)}. Folha anual: ${money(finances.wages)}.`);
        return alerts;
    }

    function getFinanceChartPoints() {
        const snapshots = [...(GameState.finance.weeklySnapshots || [])].reverse();
        if (!snapshots.length) return [{ x: 0, y: 50, balance: GameState.budget }];
        const balances = snapshots.map((item) => item.balance);
        const min = Math.min(...balances);
        const max = Math.max(...balances);
        const span = Math.max(1, max - min);
        return snapshots.map((item, index) => ({
            x: snapshots.length === 1 ? 50 : Math.round((index / (snapshots.length - 1)) * 100),
            y: Math.round(92 - (((item.balance - min) / span) * 78)),
            balance: item.balance
        }));
    }

    function getSquadMoraleSummary() {
        if (!GameState.squad.length) return { average: 0, happy: 0, unhappy: 0, energy: 0 };
        const average = Math.round(GameState.squad.reduce((sum, player) => sum + player.morale, 0) / GameState.squad.length);
        const energy = Math.round(GameState.squad.reduce((sum, player) => sum + player.energy, 0) / GameState.squad.length);
        return {
            average,
            happy: GameState.squad.filter((player) => player.morale >= 75).length,
            unhappy: GameState.squad.filter((player) => player.morale < 55).length,
            energy
        };
    }

    function createDressingRoomState() {
        return {
            history: [],
            conflicts: [],
            praises: ["O grupo iniciou o trabalho com boa disposição."],
            lastResultStreak: { type: "neutra", count: 0 }
        };
    }

    function ensureDressingRoomState() {
        if (!GameState.dressingRoom) GameState.dressingRoom = createDressingRoomState();
        GameState.dressingRoom.history = Array.isArray(GameState.dressingRoom.history) ? GameState.dressingRoom.history : [];
        GameState.dressingRoom.conflicts = Array.isArray(GameState.dressingRoom.conflicts) ? GameState.dressingRoom.conflicts : [];
        GameState.dressingRoom.praises = Array.isArray(GameState.dressingRoom.praises) ? GameState.dressingRoom.praises : [];
        GameState.dressingRoom.lastResultStreak = GameState.dressingRoom.lastResultStreak || { type: "neutra", count: 0 };
        return GameState.dressingRoom;
    }

    function getSquadLeaders() {
        return [...GameState.squad]
            .sort((a, b) => ((b.attributes?.leadership || 50) + b.reputation + b.morale) - ((a.attributes?.leadership || 50) + a.reputation + a.morale))
            .slice(0, 4);
    }

    function getInfluentialPlayers() {
        return [...GameState.squad]
            .sort((a, b) => ((b.reputation * 1.2) + calculateCurrentOverall(b) + b.morale) - ((a.reputation * 1.2) + calculateCurrentOverall(a) + a.morale))
            .slice(0, 5);
    }

    function getLowMoralePlayers() {
        return [...GameState.squad].filter((player) => player.morale < 55).sort((a, b) => a.morale - b.morale);
    }

    function getHappyPlayers() {
        return [...GameState.squad].filter((player) => player.morale >= 75).sort((a, b) => b.morale - a.morale);
    }

    function applySquadMorale(delta, reason, comment, options = {}) {
        const before = getSquadMoraleSummary().average;
        GameState.squad.forEach((player) => {
            player.morale = clamp(player.morale + delta, 1, 99);
        });
        return registerDressingRoomEvent(reason, delta, comment, before, getSquadMoraleSummary().average, options);
    }

    function applyPlayerMorale(player, delta, reason, comment, options = {}) {
        if (!player) return null;
        const before = player.morale;
        player.morale = clamp(player.morale + delta, 1, 99);
        return registerDressingRoomEvent(reason, delta, comment, before, player.morale, { ...options, playerId: player.id, playerName: player.name });
    }

    function registerDressingRoomEvent(reason, delta, comment, before, after, options = {}) {
        const dressingRoom = ensureDressingRoomState();
        const entry = {
            id: `moral-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            date: new Date().toISOString(),
            reason,
            delta,
            comment,
            before,
            after,
            playerId: options.playerId || null,
            playerName: options.playerName || null
        };
        dressingRoom.history.unshift(entry);
        dressingRoom.history = dressingRoom.history.slice(0, 32);
        if (delta < 0) dressingRoom.conflicts.unshift(comment);
        if (delta > 0) dressingRoom.praises.unshift(comment);
        dressingRoom.conflicts = [...new Set(dressingRoom.conflicts)].slice(0, 6);
        dressingRoom.praises = [...new Set(dressingRoom.praises)].slice(0, 6);
        if (options.news) addNews("Clube", reason, comment, `Moral: ${before} para ${after}.`);
        return entry;
    }

    function updateDressingRoomStreak(outcome) {
        const dressingRoom = ensureDressingRoomState();
        if (dressingRoom.lastResultStreak.type === outcome) {
            dressingRoom.lastResultStreak.count += 1;
        } else {
            dressingRoom.lastResultStreak = { type: outcome, count: 1 };
        }
        return dressingRoom.lastResultStreak;
    }

    function updateDressingRoomWeeklyReview() {
        const low = getLowMoralePlayers();
        if (low.length >= 3) {
            registerDressingRoomEvent("Alerta de vestiário", -1, "Alguns jogadores estão descontentes.", getSquadMoraleSummary().average, getSquadMoraleSummary().average, { news: true });
        }
        const captain = getSquadLeaders()[0];
        if (captain && getSquadMoraleSummary().average < 55) {
            applySquadMorale(1, "Liderança interna", `${captain.name} pediu mais empenho ao grupo.`, { news: true });
        }
        ensureDressingRoomState();
    }

    function updatePlayerUsageMorale() {
        ensureTacticsState();
        const starterIds = new Set(GameState.tactics.starters.map((slot) => slot.playerId));
        const influentialBench = GameState.squad
            .filter((player) => !starterIds.has(player.id) && (calculateCurrentOverall(player) >= 80 || player.reputation >= 78))
            .slice(0, 3);
        influentialBench.forEach((player) => {
            applyPlayerMorale(player, -2, "Reserva incomodada", `${player.name} ficou no banco e demonstrou frustração.`);
        });

        GameState.tactics.starters.forEach((slot) => {
            const player = getPlayerById(slot.playerId);
            if (!player) return;
            const zone = getTacticalZone(player, slot);
            if (zone === "red") {
                applyPlayerMorale(player, -3, "Fora da posição natural", `${player.name} ficou desconfortável atuando muito longe de suas áreas naturais.`);
            } else if (zone === "yellow") {
                applyPlayerMorale(player, -1, "Adaptação tática", `${player.name} ainda se adapta à função escolhida.`);
            }
        });
    }

    function createFanState(club) {
        const baseIndex = clamp(Math.round((club.boardConfidence || 70) * 0.55 + (club.reputation || 70) * 0.25), 35, 78);
        return {
            index: baseIndex,
            history: [],
            comments: [`A torcida iniciou a temporada esperando ${club.objectives[0].toLowerCase()}.`],
            complaints: [],
            praises: ["Novo trabalho recebeu voto de confiança inicial."],
            expectation: getFanExpectation(club),
            ticketPricePolicy: "Normal",
            lovedPlayerIds: [],
            lastResultStreak: { type: "neutra", count: 0 }
        };
    }

    function ensureFanState() {
        if (!GameState.fans) GameState.fans = createFanState(GameState.club);
        GameState.fans.history = Array.isArray(GameState.fans.history) ? GameState.fans.history : [];
        GameState.fans.comments = Array.isArray(GameState.fans.comments) ? GameState.fans.comments : [];
        GameState.fans.complaints = Array.isArray(GameState.fans.complaints) ? GameState.fans.complaints : [];
        GameState.fans.praises = Array.isArray(GameState.fans.praises) ? GameState.fans.praises : [];
        GameState.fans.lovedPlayerIds = Array.isArray(GameState.fans.lovedPlayerIds) ? GameState.fans.lovedPlayerIds : [];
        GameState.fans.lastResultStreak = GameState.fans.lastResultStreak || { type: "neutra", count: 0 };
        if (!GameState.fans.expectation) GameState.fans.expectation = getFanExpectation(GameState.club);
        return GameState.fans;
    }

    function getFanExpectation(club = GameState.club) {
        const tier = getClubTier(club);
        if (tier === "Gigante") return "Brigar por título e vencer jogos grandes.";
        if (tier === "Grande") return "Ficar na parte alta e disputar vaga continental.";
        if (tier === "Medio") return "Competir com consistência e crescer a estrutura.";
        return "Evitar crise, revelar jovens e mostrar evolução.";
    }

    function getFanMoodLabel(score) {
        if (score < 15) return { key: "furious", label: "Revoltada", description: "A torcida cobra mudanças imediatas." };
        if (score < 30) return { key: "very-unhappy", label: "Muito Insatisfeita", description: "O ambiente nas arquibancadas está pesado." };
        if (score < 45) return { key: "unhappy", label: "Insatisfeita", description: "A torcida demonstra preocupação crescente." };
        if (score < 58) return { key: "neutral", label: "Neutra", description: "Os torcedores aguardam sinais mais claros." };
        if (score < 73) return { key: "happy", label: "Feliz", description: "A torcida aprova o rumo do trabalho." };
        if (score < 88) return { key: "very-happy", label: "Muito Feliz", description: "As arquibancadas estão embaladas pelo projeto." };
        return { key: "ecstatic", label: "Em Êxtase", description: "A cidade respira o clube." };
    }

    function getLovedPlayers() {
        return [...(GameState.squad || [])]
            .filter((player) => calculateCurrentOverall(player) >= 84 || player.reputation >= 82 || player.morale >= 86)
            .sort((a, b) => (b.reputation + calculateCurrentOverall(b)) - (a.reputation + calculateCurrentOverall(a)))
            .slice(0, 4);
    }

    function registerFanReaction(reason, delta, comment, type = "comment") {
        const fans = ensureFanState();
        const before = fans.index;
        fans.index = clamp(Math.round(fans.index + delta), 0, 100);
        const entry = {
            id: `fan-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            date: new Date().toISOString(),
            reason,
            delta,
            before,
            after: fans.index,
            comment
        };
        fans.history.unshift(entry);
        fans.history = fans.history.slice(0, 30);
        fans.comments.unshift(comment);
        fans.comments = fans.comments.slice(0, 8);
        if (delta < 0) fans.complaints.unshift(comment);
        if (delta > 0) fans.praises.unshift(comment);
        fans.complaints = fans.complaints.slice(0, 5);
        fans.praises = fans.praises.slice(0, 5);
        if (type === "news") addNews("Torcida", reason, comment, `Humor da torcida: ${before}/100 para ${fans.index}/100.`);
        return entry;
    }

    function updateFanStreak(outcome) {
        const fans = ensureFanState();
        if (fans.lastResultStreak.type === outcome) {
            fans.lastResultStreak.count += 1;
        } else {
            fans.lastResultStreak = { type: outcome, count: 1 };
        }
        return fans.lastResultStreak;
    }

    function evaluateFanFactors(context = {}) {
        const fans = ensureFanState();
        fans.expectation = getFanExpectation(GameState.club);
        const position = currentPosition();
        const tier = getClubTier();
        const complaints = [];
        const praises = [];
        if (position === 1) praises.push("Liderança da liga empolga a arquibancada.");
        if ((tier === "Gigante" || tier === "Grande") && position > 6) complaints.push("A posição na tabela está abaixo do tamanho do clube.");
        if ((tier === "Medio" || tier === "Pequeno") && position <= 6) praises.push("Campanha acima da expectativa anima a torcida.");
        if (GameState.boardConfidence < 40) complaints.push("A instabilidade institucional preocupa os torcedores.");
        if ((GameState.club.stadium?.ticketRevenue || 12) > 18) complaints.push("Preço dos ingressos começa a incomodar parte da torcida.");
        if ((GameState.club.facilities || 50) >= 85) praises.push("A evolução da estrutura reforça confiança no projeto.");
        getLovedPlayers().forEach((player) => {
            if (!fans.lovedPlayerIds.includes(player.id)) fans.lovedPlayerIds.push(player.id);
        });
        if (context.includeLovedPlayers) {
            getLovedPlayers().forEach((player) => praises.push(`${player.name} é um dos nomes mais queridos do elenco.`));
        }
        fans.complaints = [...new Set([...complaints, ...fans.complaints])].slice(0, 5);
        fans.praises = [...new Set([...praises, ...fans.praises])].slice(0, 5);
        return fans;
    }

    function updateFanWeeklyReview() {
        const fans = evaluateFanFactors({ includeLovedPlayers: true });
        const position = currentPosition();
        const tier = getClubTier();
        if ((tier === "Gigante" || tier === "Grande") && position > 7) {
            registerFanReaction("Posição na tabela", -3, "A torcida reclama que a campanha está abaixo da grandeza do clube.");
        } else if (position <= 3) {
            registerFanReaction("Posição na tabela", 3, "A torcida está feliz com a posição na parte alta da tabela.");
        } else if ((tier === "Medio" || tier === "Pequeno") && position <= 6) {
            registerFanReaction("Campanha acima da expectativa", 2, "A torcida reconhece que o clube está superando a expectativa da temporada.");
        }
        if ((GameState.club.stadium?.ticketRevenue || 12) > 18) {
            registerFanReaction("Preço dos ingressos", -2, "Parte da torcida reclama do preço dos ingressos.");
        }
        fans.expectation = getFanExpectation(GameState.club);
        return fans;
    }

    function getFanMood() {
        const fans = evaluateFanFactors();
        const fanModifier = GameState.publicRelations?.fanMoodModifier || 0;
        const adjustedScore = clamp(fans.index + fanModifier, 0, 100);
        return { ...getFanMoodLabel(adjustedScore), score: adjustedScore };
    }

    function createRoundNews(outcome, opponent, result, homeClub, awayClub, positionBefore, positionAfter) {
        const score = `${homeClub.name} ${result.homeGoals}x${result.awayGoals} ${awayClub.name}`;
        if (outcome === "vitoria") {
            addNews("Clube", `${GameState.club.name} vence ${opponent.name}`, `${score} pela ${GameState.league.name}.`, `A vitória melhora o ambiente interno, reforça a confiança da diretoria e mantém o clube em busca do objetivo da temporada.`);
        } else if (outcome === "derrota") {
            addNews("Clube", `${GameState.club.name} tropeça contra ${opponent.name}`, `${score} pela ${GameState.league.name}.`, `A derrota aumenta a pressão por reação na próxima semana e será observada pela diretoria.`);
        } else {
            addNews("Liga", `${GameState.club.name} empata na rodada`, `${score} pela ${GameState.league.name}.`, `O ponto somado mantém a disputa aberta e pode pesar na classificação ao fim da temporada.`);
        }

        if (positionBefore !== positionAfter) {
            const movement = positionAfter < positionBefore ? "subiu" : "caiu";
            addNews("Liga", `Mudança na tabela`, `${GameState.club.name} ${movement} para o ${positionAfter}º lugar.`, `Antes da rodada o clube estava em ${positionBefore}º. A nova posição reforça o impacto direto dos resultados semanais na campanha.`);
        }

        const best = getBestSquadPlayer();
        if (best && best.morale >= 78) {
            addNews("Clube", `${best.name} vive grande fase`, `${best.name} segue como referência técnica do elenco.`, `O jogador aparece com overall ${calculateCurrentOverall(best)}, moral ${best.morale}/99 e energia ${best.energy}/99.`);
        }

        const unhappy = GameState.squad.find((player) => player.morale < 45);
        if (unhappy) {
            addNews("Clube", `${unhappy.name} demonstra insatisfação`, `A moral do jogador caiu para ${unhappy.morale}/99.`, `A comissão acompanha o caso para evitar impacto no vestiário nas próximas semanas.`);
        }
    }

    function generateWeeklyNews(finances) {
        addNews(
            "Financeiro",
            "Relatório financeiro semanal fechado",
            `Receitas de ${money(finances.weekIncome)} e despesas de ${money(finances.weekExpenses)} foram registradas.`,
            `O saldo atual do clube é ${money(GameState.budget)}. A folha salarial anual estimada é de ${money(finances.wages)}.`
        );

        const fanMood = getFanMood();
        addNews("Torcida", `Torcida ${fanMood.label.toLowerCase()}`, fanMood.description, `O humor das arquibancadas está em ${fanMood.score}/100 após a semana competitiva.`);
        if (fanMood.score >= 72 && Math.random() < 0.34) {
            registerFanReaction("Presença no estádio", 1, "Os torcedores lotaram o estádio e empurraram o clube durante a semana.");
        }

        if (GameState.squad.length && Math.random() < 0.22) {
            const player = GameState.squad[Math.floor(Math.random() * GameState.squad.length)];
            const medicalLevel = GameState.club.structure?.departments?.medical?.level || 1;
            const weeks = Math.max(1, (Math.random() > 0.65 ? 2 : 1) - (medicalLevel >= 7 ? 1 : 0));
            player.injuries = [{ type: "Desconforto muscular", weeks }];
            player.status = "Lesionado";
            player.fitness = clamp((player.fitness || 70) - (weeks * 12), 1, 99);
            applyPlayerMorale(player, -2, "Lesão no elenco", `${player.name} ficou abalado com a lesão e o grupo sentiu a ausência.`, { news: false });
            addNews("Lesões", `${player.name} preocupa o departamento médico`, `${player.name} sentiu desconforto muscular e será reavaliado.`, `A previsão inicial é de ${weeks} semana${weeks > 1 ? "s" : ""} de cuidados. A condição física caiu para ${player.fitness}/99.`);
        }

        const youthChance = Math.min(0.52, (GameState.club.youthQuality || 50) / 180);
        if (Math.random() < youthChance) {
            addNews("Jovens", "Base chama atenção da comissão", `O trabalho de formação do ${GameState.club.name} recebeu avaliação positiva.`, `A qualidade da base está em ${GameState.club.youthQuality}/99 e prepara o terreno para futuras revelações.`);
        }

        if (Math.random() < 0.12 && GameState.budget > 0) {
            GameState.club.facilities = clamp((GameState.club.facilities || 50) + 1, 1, 99);
            registerFanReaction("Melhoria de estrutura", 2, "A torcida aprovou a melhoria na estrutura do clube.", "news");
            addNews("Clube", "Estrutura recebe melhoria pontual", `As instalações do clube subiram para ${GameState.club.facilities}/99.`, `A melhoria foi tratada como ajuste operacional de baixo impacto e já aparece no relatório de estrutura.`);
        }
    }

    function runWeeklyStep(label, callback, summary) {
        try {
            const result = callback();
            summary.steps.push({ label, ok: true });
            return result;
        } catch (error) {
            summary.steps.push({ label, ok: false, error: error.message });
            addNotification("Clube", `Etapa com problema: ${label}`, "A rotina semanal continuou normalmente após tratamento interno.");
            return null;
        }
    }

    function getCalendarMonth(week = GameState.round) {
        const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        return monthNames[Math.floor(((week - 1) % 48) / 4)] || "Dezembro";
    }

    function isTransferWindow(week = GameState.round) {
        const cycle = ((week - 1) % 22) + 1;
        return cycle <= 4 || cycle >= 18;
    }

    function isInternationalBreak(week = GameState.round) {
        return [6, 12, 19].includes(((week - 1) % 22) + 1);
    }

    function updateCalendarRecord(stage = "before") {
        ensureSeasonFlowState();
        const opponent = getClubById(GameState.nextOpponentId) || pickNextOpponent();
        const record = {
            id: `calendar-${GameState.season}-${GameState.round}-${stage}`,
            week: GameState.round,
            month: getCalendarMonth(GameState.round),
            season: GameState.season,
            round: GameState.round,
            stage,
            nextMatch: opponent ? `${GameState.club.name} x ${opponent.name}` : "A definir",
            latestResults: (GameState.league.results || []).slice(0, 5),
            competitions: [
                GameState.league.name || "Liga Nacional",
                GameState.world?.competitions?.nationalCup?.active ? "Copa Nacional" : "Copa Nacional preparada",
                GameState.world?.competitions?.continentalCup?.active ? "Continental" : "Continental preparado"
            ],
            internationalBreak: isInternationalBreak(GameState.round),
            transferWindow: isTransferWindow(GameState.round),
            date: new Date().toISOString()
        };
        GameState.seasonFlow.calendar.currentWeek = GameState.round;
        GameState.seasonFlow.calendar.viewedWeek = GameState.round;
        GameState.seasonFlow.calendar.records = [
            record,
            ...(GameState.seasonFlow.calendar.records || []).filter((item) => !(item.week === record.week && item.season === record.season && item.stage === record.stage))
        ].slice(0, 32);
        return record;
    }

    function createWeeklyContext(financesBefore) {
        const lastResultCount = GameState.league.results.length;
        const newsCount = GameState.news.length;
        const academyCount = GameState.academy?.prospects?.length || 0;
        const structureQueue = GameState.club.structure?.queue?.length || 0;
        return {
            id: `week-${GameState.season}-${GameState.round}-${Date.now()}`,
            season: GameState.season,
            week: GameState.round,
            month: getCalendarMonth(GameState.round),
            financesBefore,
            balanceBefore: GameState.budget,
            boardBefore: GameState.boardConfidence,
            moraleBefore: getSquadMoraleSummary().average,
            fanBefore: getFanMood().score,
            positionBefore: currentPosition(),
            lastResultCount,
            newsCount,
            academyCount,
            structureQueue,
            steps: []
        };
    }

    function createWeeklySummary(context, finances) {
        const result = GameState.league.results[0] || null;
        const best = getBestSquadPlayer();
        const worst = [...GameState.squad].sort((a, b) => (a.morale + a.fitness + calculateCurrentOverall(a)) - (b.morale + b.fitness + calculateCurrentOverall(b)))[0] || best;
        const morale = getSquadMoraleSummary();
        const fanMood = getFanMood();
        const newNews = GameState.news.slice(0, Math.max(0, GameState.news.length - context.newsCount)).map(normalizeNewsItem);
        const newAcademy = Math.max(0, (GameState.academy?.prospects?.length || 0) - context.academyCount);
        const summary = {
            id: context.id,
            season: context.season,
            week: context.week,
            month: context.month,
            football: {
                result: result ? `${result.home} ${result.homeGoals}x${result.awayGoals} ${result.away}` : "Semana sem partida oficial.",
                bestPlayer: best?.name || "Sem destaque",
                worstPlayer: worst?.name || "Sem avaliação",
                position: `${currentPosition()}º lugar`
            },
            club: {
                fanMood: `${fanMood.label} (${fanMood.score}/100)`,
                morale: `${morale.average}/99`,
                board: `${GameState.boardConfidence}%`
            },
            finance: {
                income: finances.weekIncome,
                expenses: finances.weekExpenses,
                balance: GameState.budget
            },
            market: {
                observed: GameState.transferMarket?.observedPlayerIds?.length || 0,
                negotiations: Object.keys(GameState.transferMarket?.negotiations || {}).length,
                opportunities: GameState.market.slice(0, 2).map((player) => player.name)
            },
            academy: {
                newTalents: newAcademy,
                averageQuality: getAcademyAverageQuality()
            },
            structure: {
                active: GameState.club.structure?.queue?.length || 0,
                previous: context.structureQueue
            },
            headlines: newNews.slice(0, 5).map((item) => item.title),
            narratives: createWeeklyNarratives(result, fanMood, newAcademy),
            steps: context.steps,
            date: new Date().toISOString()
        };
        ensureSeasonFlowState();
        GameState.seasonFlow.weeklySummaries.unshift(summary);
        GameState.seasonFlow.weeklySummaries = GameState.seasonFlow.weeklySummaries.slice(0, 24);
        GameState.seasonFlow.lastSummaryId = summary.id;
        return summary;
    }

    function createWeeklyNarratives(result, fanMood, newAcademy) {
        const narratives = [];
        if (result) {
            const playerWasHome = result.home === GameState.club.name;
            const gf = playerWasHome ? result.homeGoals : result.awayGoals;
            const ga = playerWasHome ? result.awayGoals : result.homeGoals;
            if (gf > ga) narratives.push(t("weekly.narrative.win"));
            else if (gf < ga) narratives.push(t("weekly.narrative.loss"));
            else narratives.push(t("weekly.narrative.draw"));
        }
        if (GameState.boardConfidence >= 70) narratives.push(t("weekly.narrative.boardHappy"));
        if (fanMood.score >= 72) narratives.push(t("weekly.narrative.fansHappy"));
        if (newAcademy > 0) narratives.push(t("weekly.narrative.academy"));
        if (!narratives.length) narratives.push(t("weekly.narrative.quiet"));
        return narratives;
    }

    function generateRandomWeeklyEvent() {
        if (Math.random() > 0.48) return null;
        const events = [
            () => {
                const player = GameState.squad[Math.floor(Math.random() * GameState.squad.length)];
                if (!player) return null;
                player.morale = clamp((player.morale || 70) + 3, 1, 99);
                return addNews("Clube", `${player.name} pede renovação`, `${player.name} sinalizou desejo de discutir um contrato mais longo.`, "O empresário entende que o bom momento do atleta merece reconhecimento.");
            },
            () => {
                const player = GameState.squad[Math.floor(Math.random() * GameState.squad.length)];
                if (!player) return null;
                player.cards.yellow = (player.cards?.yellow || 0) + 1;
                if (player.cards.yellow >= 5) {
                    player.suspendedWeeks = 1;
                    player.cards.yellow = 0;
                    return addNews("Clube", `${player.name} está suspenso`, "Acúmulo de cartões tira o jogador da próxima semana.", "O status será normalizado após o avanço semanal.");
                }
                return addNews("Clube", `${player.name} recebe cartão`, `Cartões amarelos acumulados: ${player.cards.yellow}.`, "A comissão acompanha risco de suspensão.");
            },
            () => addNews("Patrocinadores", "Patrocinador cobra exposição", "O parceiro comercial pediu maior presença em ações de matchday.", "Campanhas de marketing podem melhorar confiança comercial."),
            () => addNews("Imprensa", "Coletiva movimenta bastidores", "A imprensa questionou a evolução do projeto esportivo.", "Respostas públicas podem afetar diretoria, torcida e moral do elenco."),
            () => addNews("Promessas", "Promessa ganha moral", "Um jovem treinou acima do esperado durante a semana.", "O treino individual e a base influenciam esse tipo de evolução."),
            () => {
                const a = GameState.squad[deterministicNumber(`disc-${GameState.round}`, 0, Math.max(0, GameState.squad.length - 1))];
                const b = GameState.squad[deterministicNumber(`disc-b-${GameState.round}`, 0, Math.max(0, GameState.squad.length - 1))];
                if (!a || !b || a.id === b.id) return null;
                a.morale = clamp(a.morale - 3, 1, 99);
                b.morale = clamp(b.morale - 2, 1, 99);
                registerDressingRoomEvent("Discussão interna", -3, `${a.name} e ${b.name} discutiram após treino intenso.`, getSquadMoraleSummary().average + 3, getSquadMoraleSummary().average);
                return addNews("Diretoria", "Discussão no vestiário", "O psicólogo do clube foi acionado para conter desgaste interno.", "Staff psicológico reduz a chance de recorrência.");
            },
            () => {
                registerFanReaction("Homenagem da torcida", 4, "A torcida preparou uma homenagem ao elenco.", "news");
                return null;
            },
            () => addNews("Diretoria", "Diretoria marca reunião", "A diretoria solicitou uma conversa de acompanhamento da temporada.", "O encontro reforça a cobrança por evolução contínua.")
        ];
        const event = events[Math.floor(Math.random() * events.length)]();
        return event;
    }

    function processContractsAndMarket() {
        GameState.squad.forEach((player) => {
            if (player.suspendedWeeks) {
                player.suspendedWeeks -= 1;
                if (player.suspendedWeeks <= 0) delete player.suspendedWeeks;
            }
            if (player.injuries?.length) {
                player.injuries = player.injuries.map((injury) => ({ ...injury, weeks: Math.max(0, injury.weeks - 1) })).filter((injury) => injury.weeks > 0);
            }
            if ((player.contract?.yearsRemaining || 0) <= 1 && player.morale > 58 && Math.random() < 0.08) {
                player.morale = clamp(player.morale + 1, 1, 99);
                GameState.transferMarket.negotiations[player.id] = {
                    status: "renewal-interest",
                    salaryDemand: Math.round(player.salary * 1.12),
                    contractDemand: 3,
                    updatedRound: GameState.round
                };
            }
        });
        if (isTransferWindow(GameState.round) && GameState.market.length < 24) {
            const newPlayer = createAcademyProspect(GameState.market.length + GameState.round);
            newPlayer.id = `market-generated-${Date.now()}`;
            newPlayer.marketValue = calculateMarketValue(newPlayer, GameState.currentYear);
            GameState.market.push(normalizePlayer(newPlayer));
            addNews("Mercado", "Novo jogador entra no mercado", `${newPlayer.name} passou a ser monitorado por clubes.`, `Posição ${newPlayer.primaryPosition}, potencial ${newPlayer.potential}.`);
        }
    }

    function advanceWeek() {
        ensureSeasonFlowState();
        ensureAcademyState();
        ensureMarketingState();
        ensureStaffState();
        ensureTrainingState();
        const finances = getFinanceSummary();
        const context = createWeeklyContext(finances);
        const beforeRound = GameState.round;
        runWeeklyStep("Atualizar calendário", () => updateCalendarRecord("before"), context);
        runWeeklyStep("Atualizar recuperação", () => recoverSquadBetweenRounds(), context);
        runWeeklyStep("Processar treinamento", processTrainingWeek, context);
        runWeeklyStep("Atualizar condição física", () => {
            GameState.squad.forEach((player) => {
                player.energy = clamp(player.energy + 3, 1, 99);
                player.fitness = clamp(player.fitness + 2, 1, 99);
            });
        }, context);
        runWeeklyStep("Atualizar moral", () => {
            GameState.squad.forEach((player) => {
                const moodShift = Math.round((GameState.boardConfidence - 50) / 18);
                player.morale = clamp(player.morale + moodShift + (Math.random() > 0.55 ? 1 : -1), 1, 99);
            });
        }, context);
        runWeeklyStep("Atualizar lesões", () => null, context);
        runWeeklyStep("Atualizar Scout", advanceScoutWeek, context);
        runWeeklyStep("Atualizar Base", processAcademyWeek, context);
        runWeeklyStep("Atualizar Estrutura", () => {
            processStadiumProjects();
            processStructureProjects();
        }, context);
        runWeeklyStep("Atualizar Finanças", () => closeWeeklyFinance(finances), context);
        runWeeklyStep("Atualizar Patrocínios", processMarketingWeek, context);
        runWeeklyStep("Atualizar Mercado", processContractsAndMarket, context);
        runWeeklyStep("IA dos clubes", simulateClubAI, context);
        runWeeklyStep("Simular partidas", advanceRound, context);
        runWeeklyStep("Atualizar classificação", () => updateLeagueTable(false), context);
        runWeeklyStep("Gerar notícias", () => {
            updatePlayerUsageMorale();
            updateDressingRoomWeeklyReview();
            generateWeeklyNews(finances);
            updateBoardObjectives(true);
            updateFanWeeklyReview();
        }, context);
        runWeeklyStep("Gerar eventos", () => {
            generateRandomWeeklyEvent();
            maybeCreateQuestionEvent();
        }, context);
        runWeeklyStep("Atualizar Dashboard", () => {
            GameState.currentScreen = "home";
            updateCalendarRecord("after");
        }, context);
        const summary = createWeeklySummary(context, finances);
        runWeeklyStep("Salvar automaticamente", saveCareer, context);
        renderDashboard();
        updateQuestionModal();
        showWeeklySummaryModal(summary);
        pushMessage(`Semana ${beforeRound} concluída com novos acontecimentos no clube.`);
    }

    function renderMatchPreview() {
        const opponent = getClubById(GameState.nextOpponentId) || pickNextOpponent();
        document.getElementById("screen-root").innerHTML = `
            <section class="screen stack internal-screen match-preview-screen">
                ${renderInternalHero("Próxima Partida", "Prévia da semana competitiva.", "XI")}
                <div class="card card-pad stack internal-panel match-preview-panel">
                    <div class="stat-grid">
                        <div class="stat"><span>Adversário</span><strong>${opponent.name}</strong></div>
                        <div class="stat"><span>Competição</span><strong>${GameState.league.name}</strong></div>
                        <div class="stat"><span>Data</span><strong>${getNextMatchDate()}</strong></div>
                        <div class="stat"><span>Mando</span><strong>${GameState.round % 2 === 1 ? "Casa" : "Fora"}</strong></div>
                        <div class="stat"><span>Posição adversária</span><strong>${getOpponentPosition(opponent.id)}º</strong></div>
                        <div class="stat"><span>Força tática</span><strong>${getTeamTacticalAverage()}</strong></div>
                    </div>
                    <div class="row-card">Motor de partidas completo será implementado na missão correspondente. Por enquanto, a semana usa a simulação simplificada já funcional.</div>
                    <div class="button-row">
                        <button class="btn btn-primary" id="preview-advance" type="button">Avançar Semana</button>
                        <button class="btn" id="preview-back" type="button">Voltar</button>
                    </div>
                </div>
            </section>
        `;
        document.getElementById("preview-advance").addEventListener("click", advanceWeek);
        document.getElementById("preview-back").addEventListener("click", () => switchScreen("home"));
        updateChrome();
    }

    function renderResultDetails() {
        const detail = getLastResultDetails();
        document.getElementById("screen-root").innerHTML = `
            <section class="screen stack internal-screen result-screen">
                ${renderInternalHero("Detalhes do Resultado", GameState.league.name, "VS")}
                <div class="card card-pad stack internal-panel result-panel">
                    <div class="stat-grid">
                        <div class="stat"><span>Placar</span><strong>${detail.score}</strong></div>
                        <div class="stat"><span>Adversário</span><strong>${detail.opponent}</strong></div>
                        <div class="stat"><span>Artilheiro</span><strong>${detail.scorer}</strong></div>
                        <div class="stat"><span>Melhor jogador</span><strong>${detail.bestPlayer}</strong></div>
                    </div>
                    <button class="btn" id="result-back" type="button">Voltar</button>
                </div>
            </section>
        `;
        document.getElementById("result-back").addEventListener("click", () => switchScreen("home"));
        updateChrome();
    }

    function renderBoardRoom() {
        const board = updateBoardObjectives(false);
        const mainObjective = board.objectives.find((objective) => !objective.secondary) || board.objectives[0];
        const secondaryObjectives = board.objectives.filter((objective) => objective.secondary);
        const tier = getClubTier();
        const confidenceClass = GameState.boardConfidence < 35 ? "danger" : GameState.boardConfidence < 55 ? "warning" : "good";
        document.getElementById("screen-root").innerHTML = `
            <section class="screen stack internal-screen board-screen">
                ${renderInternalHero("Diretoria", "Objetivos, cobrança e confiança institucional.", "DIR")}
                <div class="card card-pad board-room stack internal-panel">
                    <div class="board-confidence ${confidenceClass}">
                        <div class="row-main">
                            <strong>Confiança da diretoria</strong>
                            <span>${GameState.boardConfidence}%</span>
                        </div>
                        <i><b style="width:${GameState.boardConfidence}%"></b></i>
                        <p>${board.warning || "A diretoria considera o trabalho dentro de uma faixa segura."}</p>
                    </div>
                    <div class="stat-grid">
                        <div class="stat"><span>Tamanho do clube</span><strong>${tier}</strong></div>
                        <div class="stat"><span>Prazo geral</span><strong>${mainObjective?.deadline || `Fim de ${GameState.season}`}</strong></div>
                        <div class="stat"><span>Confiança</span><strong>${GameState.boardConfidence}%</strong></div>
                        <div class="stat"><span>Progresso médio</span><strong>${board.lastProgressAverage}%</strong></div>
                    </div>
                    <div class="board-objectives">
                        <h2>Objetivo principal</h2>
                        ${mainObjective ? renderBoardObjective(mainObjective) : `<div class="empty-state">Nenhum objetivo principal definido.</div>`}
                    </div>
                    <div class="board-objectives">
                        <h2>Objetivos secundários</h2>
                        ${secondaryObjectives.length ? secondaryObjectives.map(renderBoardObjective).join("") : `<div class="empty-state">Nenhum objetivo secundário definido.</div>`}
                    </div>
                    <div class="button-row">
                        <button class="btn btn-primary" id="question-history" type="button">Histórico de Respostas</button>
                        <button class="btn" id="board-back" type="button">Voltar</button>
                    </div>
                </div>
            </section>
        `;
        document.getElementById("question-history").addEventListener("click", () => switchScreen("questionHistory"));
        document.getElementById("board-back").addEventListener("click", () => switchScreen("home"));
        updateChrome();
    }

    function renderBoardObjective(objective) {
        const objectiveClass = objective.progress < 35 ? "danger" : objective.progress < 60 ? "warning" : "good";
        return `
            <article class="board-objective ${objectiveClass}">
                <div class="row-main">
                    <strong>${escapeHtml(objective.title)}</strong>
                    <span class="pill">${objective.secondary ? "Secundário" : "Principal"}</span>
                </div>
                <p>${escapeHtml(objective.description)}</p>
                <div class="objective-progress">
                    <div class="row-main">
                        <span>${escapeHtml(objective.progressText)}</span>
                        <strong>${objective.progress}%</strong>
                    </div>
                    <i><b style="width:${objective.progress}%"></b></i>
                </div>
                <div class="meta"><span>${objective.status}</span><span>Prazo: ${objective.deadline}</span></div>
            </article>
        `;
    }

    function renderQuestionHistory() {
        const history = ensureQuestionState().history;
        document.getElementById("screen-root").innerHTML = `
            <section class="screen stack internal-screen history-screen">
                ${renderInternalHero("Histórico de Respostas", "Registro das coletivas e conversas institucionais.", "HIS")}
                <div class="card card-pad stack internal-panel">
                    <div class="stat-grid">
                        <div class="stat"><span>Respostas registradas</span><strong>${history.length}</strong></div>
                        <div class="stat"><span>Patrocinadores</span><strong>${GameState.publicRelations.sponsorTrust}/100</strong></div>
                        <div class="stat"><span>Humor externo</span><strong>${GameState.publicRelations.fanMoodModifier > 0 ? "+" : ""}${GameState.publicRelations.fanMoodModifier}</strong></div>
                        <div class="stat"><span>Orçamento futuro</span><strong>${money(GameState.publicRelations.futureBudgetBoost)}</strong></div>
                    </div>
                    <div class="question-history-list">
                        ${history.length ? history.map((item) => `
                            <article class="question-history-item">
                                <div class="news-topline">
                                    <span class="news-category">${escapeHtml(item.origin)}</span>
                                    <span class="news-date">${formatNewsDate(item.date)}</span>
                                </div>
                                <h2>${escapeHtml(item.question)}</h2>
                                <p><strong>Resposta:</strong> ${escapeHtml(item.answer)}</p>
                                <p>${escapeHtml(item.feedback)}</p>
                                <span class="muted">${escapeHtml(item.effectsText)}</span>
                            </article>
                        `).join("") : `<div class="empty-state">Nenhuma resposta registrada ainda. As perguntas aparecem automaticamente durante a carreira.</div>`}
                    </div>
                    <div class="button-row">
                        <button class="btn btn-primary" id="history-back-board" type="button">Diretoria</button>
                        <button class="btn" id="history-back-home" type="button">Central do Diretor</button>
                    </div>
                </div>
            </section>
        `;
        document.getElementById("history-back-board").addEventListener("click", () => switchScreen("boardRoom"));
        document.getElementById("history-back-home").addEventListener("click", () => switchScreen("home"));
        updateChrome();
    }

    function renderNewsCenter() {
        const selectedCategory = GameState.newsFilter || "Todas";
        const news = getLatestNews(90, selectedCategory);
        const categoryOptions = ["Todas", ...NEWS_CATEGORIES].map((category) => `<option value="${category}" ${category === selectedCategory ? "selected" : ""}>${category}</option>`).join("");
        document.getElementById("screen-root").innerHTML = `
            <section class="screen stack internal-screen news-screen">
                ${renderInternalHero("Notícias", "Central de informações do clube e do mundo.", "NOT")}
                <div class="card card-pad news-panel stack internal-panel">
                    <label class="field">
                        <span>Categoria</span>
                        <select id="news-filter">${categoryOptions}</select>
                    </label>
                    <div class="news-list">
                        ${news.length ? news.map((item) => `
                            <article class="news-item">
                                <div class="news-topline">
                                    <span class="news-category">${item.category}</span>
                                    <span class="news-date">${formatNewsDate(item.date)}</span>
                                </div>
                                <h2>${escapeHtml(item.title)}</h2>
                                <p>${escapeHtml(item.text)}</p>
                                <button class="btn btn-ghost" type="button" data-news-detail="${item.id}">Ver detalhes</button>
                            </article>
                        `).join("") : `<div class="empty-state">Nenhuma notícia registrada nesta categoria.</div>`}
                    </div>
                    <button class="btn" id="news-back" type="button">Voltar</button>
                </div>
            </section>
        `;
        document.getElementById("news-filter").addEventListener("change", (event) => {
            GameState.newsFilter = event.target.value;
            renderNewsCenter();
        });
        document.querySelectorAll("[data-news-detail]").forEach((button) => {
            button.addEventListener("click", () => openNewsDetail(button.dataset.newsDetail));
        });
        document.getElementById("news-back").addEventListener("click", () => switchScreen("home"));
        updateChrome();
    }

    function openNewsDetail(newsId) {
        GameState.selectedNewsId = newsId;
        switchScreen("newsDetail");
    }

    function renderNewsDetail() {
        const news = (GameState.news || []).map(normalizeNewsItem).find((item) => item.id === GameState.selectedNewsId) || getLatestNews(1)[0];
        document.getElementById("screen-root").innerHTML = `
            <section class="screen stack internal-screen news-detail-screen">
                ${renderInternalHero("Detalhes da Notícia", "Registro permanente da carreira.", "NOT")}
                <div class="card card-pad news-detail-card stack internal-panel">
                    ${news ? `
                        <div class="news-topline">
                            <span class="news-category">${news.category}</span>
                            <span class="news-date">${formatNewsDate(news.date)}</span>
                        </div>
                        <h2>${escapeHtml(news.title)}</h2>
                        <p>${escapeHtml(news.text)}</p>
                        <div class="row-card">${escapeHtml(news.details)}</div>
                    ` : `<div class="empty-state">Nenhuma notícia selecionada.</div>`}
                    <div class="button-row">
                        <button class="btn btn-primary" id="news-detail-back" type="button">Voltar para Notícias</button>
                        <button class="btn" id="news-detail-home" type="button">Central do Diretor</button>
                    </div>
                </div>
            </section>
        `;
        document.getElementById("news-detail-back").addEventListener("click", () => switchScreen("newsCenter"));
        document.getElementById("news-detail-home").addEventListener("click", () => switchScreen("home"));
        updateChrome();
    }

    function renderFinanceReport() {
        const finances = getFinanceSummary();
        const alerts = updateFinanceAlerts(finances);
        const chartPoints = getFinanceChartPoints();
        const polyline = chartPoints.map((point) => `${point.x},${point.y}`).join(" ");
        const incomeRows = [
            ["Patrocínio", finances.sponsorship],
            ["Bilheteria", finances.ticketRevenue],
            ["Venda de jogadores", GameState.finance.transferIncome || 0],
            ["Premiações", GameState.finance.prizeMoney || 0],
            ["Loja oficial", finances.merchandising],
            ["Televisão", finances.television],
            ["Continental", finances.continentalRevenue]
        ];
        const expenseRows = [
            ["Salários", finances.weeklyWages],
            ["Manutenção", finances.stadiumMaintenance + finances.structureMaintenance],
            ["Funcionários", finances.staff + finances.staffPayroll],
            ["Transferências", finances.transferInstallments],
            ["Bônus", finances.bonuses]
        ];
        const maxFinanceBar = Math.max(1, ...incomeRows.map((row) => row[1]), ...expenseRows.map((row) => row[1]));
        document.getElementById("screen-root").innerHTML = `
            <section class="screen stack internal-screen finance-screen">
                ${renderInternalHero("Finanças", "Fluxo de caixa, custos operacionais e saúde financeira.", "FIN")}
                <div class="card card-pad stack finance-room internal-panel">
                    <div class="stat-grid">
                        <div class="stat"><span>Saldo atual</span><strong>${money(GameState.budget)}</strong></div>
                        <div class="stat"><span>Receitas semanais</span><strong>${money(finances.weekIncome)}</strong></div>
                        <div class="stat"><span>Despesas semanais</span><strong>${money(finances.weekExpenses)}</strong></div>
                        <div class="stat"><span>Folha salarial</span><strong>${money(finances.wages)}</strong></div>
                        <div class="stat"><span>Funcionários</span><strong>${money(finances.staff + finances.staffPayroll)}</strong></div>
                        <div class="stat"><span>Parcelas de transferências</span><strong>${money(finances.transferInstallments)}</strong></div>
                        <div class="stat"><span>Receitas acumuladas</span><strong>${money(GameState.finance.income)}</strong></div>
                        <div class="stat"><span>Despesas acumuladas</span><strong>${money(GameState.finance.expenses)}</strong></div>
                    </div>
                    <div class="finance-alerts">
                        ${alerts.map((alert) => `<div class="finance-alert ${alert.level}">${escapeHtml(alert.text)}</div>`).join("")}
                    </div>
                    <div class="finance-chart">
                        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Gráfico de evolução financeira">
                            <polyline points="${polyline}" vector-effect="non-scaling-stroke"></polyline>
                        </svg>
                    </div>
                    <div class="finance-grid">
                        <div class="finance-section">
                            <h2>Receitas</h2>
                            ${incomeRows.map(([label, value]) => `
                                <div class="finance-bar-row"><div><span>${escapeHtml(label)}</span><strong>${money(value)}</strong></div><i><b style="width:${Math.round((value / maxFinanceBar) * 100)}%"></b></i></div>
                            `).join("")}
                        </div>
                        <div class="finance-section">
                            <h2>Despesas</h2>
                            ${expenseRows.map(([label, value]) => `
                                <div class="finance-bar-row expense"><div><span>${escapeHtml(label)}</span><strong>${money(value)}</strong></div><i><b style="width:${Math.round((value / maxFinanceBar) * 100)}%"></b></i></div>
                            `).join("")}
                        </div>
                    </div>
                    <div class="finance-section">
                        <h2>Histórico recente</h2>
                        ${GameState.finance.history.length ? GameState.finance.history.slice(0, 10).map((item) => `
                            <div class="row-card">
                                <div class="row-main">
                                    <strong>${escapeHtml(item.label)}</strong>
                                    <span class="${item.type === "income" ? "positive" : "negative"}">${item.type === "income" ? "+" : "-"}${money(item.amount)}</span>
                                </div>
                                <span class="muted">${formatNewsDate(item.date)} · ${escapeHtml(item.category)} · Saldo ${money(item.balance)}</span>
                            </div>
                        `).join("") : `<div class="row-card">Nenhuma movimentação registrada ainda.</div>`}
                    </div>
                    <button class="btn" id="finance-back" type="button">Voltar</button>
                </div>
            </section>
        `;
        document.getElementById("finance-back").addEventListener("click", () => switchScreen("home"));
        updateChrome();
    }

    function renderDressingRoom() {
        const morale = getSquadMoraleSummary();
        const dressingRoom = ensureDressingRoomState();
        const leaders = getSquadLeaders();
        const influential = getInfluentialPlayers();
        const lowMorale = getLowMoralePlayers();
        const happyPlayers = getHappyPlayers();
        document.getElementById("screen-root").innerHTML = `
            <section class="screen stack internal-screen dressing-screen">
                ${renderInternalHero("Vestiário", "Moral coletiva, liderança e ambiente interno.", "MOR")}
                <div class="card card-pad stack dressing-room internal-panel">
                    <div class="stat-grid">
                        <div class="stat"><span>Moral média</span><strong>${morale.average}/99</strong></div>
                        <div class="stat"><span>Felizes</span><strong>${morale.happy}</strong></div>
                        <div class="stat"><span>Insatisfeitos</span><strong>${morale.unhappy}</strong></div>
                        <div class="stat"><span>Energia média</span><strong>${morale.energy}</strong></div>
                    </div>
                    <div class="fan-meter"><i style="width:${morale.average}%"></i></div>
                    <div class="fan-columns">
                        <div class="fan-list">
                            <h2>Líderes do elenco</h2>
                            ${leaders.map((player) => `<div class="row-card"><strong>${escapeHtml(player.name)}</strong><span class="muted">Liderança ${player.attributes?.leadership || 50} · Moral ${player.morale} · Rep. ${player.reputation}</span></div>`).join("")}
                        </div>
                        <div class="fan-list">
                            <h2>Jogadores influentes</h2>
                            ${influential.map((player) => `<div class="row-card"><strong>${escapeHtml(player.name)}</strong><span class="muted">${player.primaryPosition} · Overall ${calculateCurrentOverall(player)} · Moral ${player.morale}</span></div>`).join("")}
                        </div>
                    </div>
                    <div class="fan-columns">
                        <div class="fan-list">
                            <h2>Jogadores em baixa</h2>
                            ${lowMorale.length ? lowMorale.slice(0, 6).map((player) => `<div class="row-card"><strong>${escapeHtml(player.name)}</strong><span class="muted">Moral ${player.morale} · Energia ${player.energy} · Cond. ${player.fitness}</span></div>`).join("") : `<div class="row-card">Nenhum jogador em baixa neste momento.</div>`}
                        </div>
                        <div class="fan-list">
                            <h2>Jogadores felizes</h2>
                            ${happyPlayers.length ? happyPlayers.slice(0, 6).map((player) => `<div class="row-card"><strong>${escapeHtml(player.name)}</strong><span class="muted">Moral ${player.morale} · Energia ${player.energy} · Cond. ${player.fitness}</span></div>`).join("") : `<div class="row-card">O grupo ainda busca um ambiente mais positivo.</div>`}
                        </div>
                    </div>
                    <div class="fan-columns">
                        <div class="fan-list">
                            <h2>Conflitos internos</h2>
                            ${(dressingRoom.conflicts.length ? dressingRoom.conflicts : ["Nenhum conflito dominante no momento."]).map((item) => `<div class="row-card">${escapeHtml(item)}</div>`).join("")}
                        </div>
                        <div class="fan-list">
                            <h2>Elogios recentes</h2>
                            ${(dressingRoom.praises.length ? dressingRoom.praises : ["O elenco aguarda resultados para ganhar confiança."]).map((item) => `<div class="row-card">${escapeHtml(item)}</div>`).join("")}
                        </div>
                    </div>
                    <div class="fan-list">
                        <h2>Eventos automáticos</h2>
                        ${dressingRoom.history.length ? dressingRoom.history.slice(0, 8).map((item) => `
                            <div class="row-card">
                                <div class="row-main"><strong>${escapeHtml(item.reason)}</strong><span class="${item.delta >= 0 ? "positive" : "negative"}">${item.delta >= 0 ? "+" : ""}${item.delta}</span></div>
                                <span class="muted">${formatNewsDate(item.date)} · ${escapeHtml(item.comment)}${item.playerName ? ` · ${escapeHtml(item.playerName)}` : ""}</span>
                            </div>
                        `).join("") : `<div class="row-card">Nenhum evento coletivo registrado ainda.</div>`}
                    </div>
                    <button class="btn" id="dressing-back" type="button">Voltar</button>
                </div>
            </section>
        `;
        document.getElementById("dressing-back").addEventListener("click", () => switchScreen("home"));
        updateChrome();
    }

    function renderFanMoodScreen() {
        const mood = getFanMood();
        const fans = evaluateFanFactors({ includeLovedPlayers: true });
        const lovedPlayers = getLovedPlayers();
        document.getElementById("screen-root").innerHTML = `
            <section class="screen stack internal-screen fan-screen">
                ${renderInternalHero("Torcida", "Percepção pública, reações e pressão das arquibancadas.", "FAN")}
                <div class="card card-pad stack fan-card mood-${mood.key} fan-room internal-panel">
                    <div class="fan-mood-hero">
                        <div>
                            <span class="menu-kicker">Humor atual</span>
                            <h2>${mood.label}</h2>
                            <p>${mood.description}</p>
                        </div>
                        <strong>${mood.score}/100</strong>
                    </div>
                    <div class="fan-meter"><i style="width:${mood.score}%"></i></div>
                    <div class="stat-grid">
                        <div class="stat"><span>Estado</span><strong>${mood.label}</strong></div>
                        <div class="stat"><span>Índice</span><strong>${mood.score}/100</strong></div>
                        <div class="stat"><span>Posição</span><strong>${currentPosition()}º</strong></div>
                        <div class="stat"><span>Ingressos</span><strong>${fans.ticketPricePolicy}</strong></div>
                    </div>
                    <div class="row-card"><strong>Expectativa da temporada</strong><span class="muted">${fans.expectation}</span></div>
                    <div class="fan-columns">
                        <div class="fan-list">
                            <h2>Principais elogios</h2>
                            ${(fans.praises.length ? fans.praises : ["A torcida ainda está avaliando o trabalho."]).map((item) => `<div class="row-card">${escapeHtml(item)}</div>`).join("")}
                        </div>
                        <div class="fan-list">
                            <h2>Principais reclamações</h2>
                            ${(fans.complaints.length ? fans.complaints : ["Nenhuma reclamação dominante nesta semana."]).map((item) => `<div class="row-card">${escapeHtml(item)}</div>`).join("")}
                        </div>
                    </div>
                    <div class="fan-list">
                        <h2>Jogadores queridos</h2>
                        ${lovedPlayers.length ? lovedPlayers.map((player) => `<div class="row-card"><strong>${escapeHtml(player.name)}</strong><span class="muted">${player.primaryPosition} · Overall ${calculateCurrentOverall(player)} · Reputação ${player.reputation}</span></div>`).join("") : `<div class="row-card">A torcida ainda não escolheu seus grandes favoritos do elenco.</div>`}
                    </div>
                    <div class="fan-list">
                        <h2>Comentários recentes</h2>
                        ${(fans.comments.length ? fans.comments : ["A torcida acompanha os primeiros passos da temporada."]).map((item) => `<div class="row-card">${escapeHtml(item)}</div>`).join("")}
                    </div>
                    <div class="fan-list">
                        <h2>Histórico de mudanças</h2>
                        ${fans.history.length ? fans.history.slice(0, 8).map((item) => `
                            <div class="row-card">
                                <div class="row-main"><strong>${escapeHtml(item.reason)}</strong><span class="${item.delta >= 0 ? "positive" : "negative"}">${item.delta >= 0 ? "+" : ""}${item.delta}</span></div>
                                <span class="muted">${formatNewsDate(item.date)} · ${escapeHtml(item.comment)} · ${item.before}/100 para ${item.after}/100</span>
                            </div>
                        `).join("") : `<div class="row-card">Nenhuma mudança registrada ainda.</div>`}
                    </div>
                    <button class="btn" id="fans-back" type="button">Voltar</button>
                </div>
            </section>
        `;
        document.getElementById("fans-back").addEventListener("click", () => switchScreen("home"));
        updateChrome();
    }

    function renderSquad() {
        refreshAllPlayers();
        const view = GameState.squadView;
        const players = getVisibleSquadPlayers();
        document.getElementById("screen-root").innerHTML = `
            <section class="screen eg3-squad">
                <header class="eg3-list-topbar">
                    <div class="eg3-searchbar"><span>🔍</span><input id="squad-search" type="search" value="${escapeHtml(view.search)}" placeholder="Buscar jogador..."></div>
                </header>
                <div class="eg3-chip-row">
                    ${PLAYER_POSITIONS.slice(0, 9).map((position) => `<button class="chip-pos ${view.position === position ? "active" : ""}" type="button" data-squad-pos="${position}">${escapeHtml(translatePosition(position))}</button>`).join("")}
                    ${view.position !== "ALL" || view.search ? `<button class="chip-pos eg3-clear-chip" id="squad-clear" type="button">Limpar</button>` : ""}
                </div>
                <div class="eg3-card-list eg3-squad-list">
                    ${players.map((player) => `
                        <button class="eg3-person-card eg3-squad-card" type="button" data-player-detail="${player.id}">
                            <div class="eg3-person-avatar">${escapeHtml(player.primaryPosition)}</div>
                            <div class="eg3-person-main">
                                <strong>${escapeHtml(player.name)}</strong>
                                <span>${escapeHtml(translatePosition(player.primaryPosition))} · ${calculateAge(player, GameState.currentYear)} anos</span>
                                <p>${escapeHtml(player.status || "Disponível")} · Moral ${player.morale}/99 · Energia ${player.energy}/99</p>
                            </div>
                            <div class="eg3-person-side"><small>OVR</small><b>${calculateCurrentOverall(player)}</b><em>${escapeHtml(player.fitness < 55 ? "Cansado" : player.status || "Em forma")}</em></div>
                        </button>
                    `).join("") || `<div class="empty-state">Nenhum jogador encontrado.</div>`}
                </div>
            </section>
        `;
        document.getElementById("squad-search")?.addEventListener("input", (event) => {
            GameState.squadView.search = event.target.value;
            renderSquad();
        });
        document.querySelectorAll("[data-squad-pos]").forEach((button) => button.addEventListener("click", () => {
            GameState.squadView.position = GameState.squadView.position === button.dataset.squadPos ? "ALL" : button.dataset.squadPos;
            renderSquad();
        }));
        document.getElementById("squad-clear")?.addEventListener("click", () => {
            GameState.squadView.search = "";
            GameState.squadView.position = "ALL";
            renderSquad();
        });
        document.querySelectorAll("[data-player-detail]").forEach((button) => {
            button.addEventListener("click", () => {
                GameState.selectedPlayerId = button.dataset.playerDetail;
                switchScreen("playerDetail");
            });
        });
        updateChrome();
    }

    function getVisibleSquadPlayers() {
        const view = GameState.squadView;
        const search = view.search.trim().toLowerCase();
        return [...GameState.squad]
            .filter((player) => {
                const nameMatch = !search || player.name.toLowerCase().includes(search) || player.nickname.toLowerCase().includes(search);
                const positionMatch = view.position === "ALL" || player.primaryPosition === view.position || player.secondaryPositions.includes(view.position);
                return nameMatch && positionMatch;
            })
            .sort((a, b) => {
                if (view.sort === "age") return calculateAge(a, GameState.currentYear) - calculateAge(b, GameState.currentYear) || a.name.localeCompare(b.name);
                if (view.sort === "name") return a.name.localeCompare(b.name);
                if (view.sort === "value") return b.marketValue - a.marketValue;
                if (view.sort === "position") return byPositionThenOverall(a, b);
                return calculateCurrentOverall(b) - calculateCurrentOverall(a) || a.name.localeCompare(b.name);
            });
    }

    function renderMiniMeter(label, value, type) {
        return `
            <span class="mini-meter ${type}">
                <span>${label}</span>
                <i><b style="width:${clamp(value, 1, 99)}%"></b></i>
                <strong>${Math.round(value)}</strong>
            </span>
        `;
    }

    function renderClubCrest(club, sizeClass = "") {
        const colors = club.colors || [club.color || "#16c784", "#ffffff"];
        const initials = club.crest?.initials || club.name.slice(0, 2).toUpperCase();
        const symbol = club.crest?.symbol || "diamond";
        return `
            <span class="club-crest ${sizeClass}" style="--crest-a:${colors[0]};--crest-b:${colors[1]}">
                <span class="crest-symbol ${symbol}"></span>
                <strong>${initials}</strong>
            </span>
        `;
    }

    function openPlayerDetail(playerId) {
        GameState.selectedPlayerId = playerId;
        switchScreen("playerDetail");
    }

    function renderPlayerDetail() {
        refreshAllPlayers();
        const player = GameState.squad.find((item) => item.id === GameState.selectedPlayerId) ||
            GameState.market.find((item) => item.id === GameState.selectedPlayerId);
        if (!player) {
            showToast("Jogador nao encontrado.");
            switchScreen("squad");
            return;
        }
        const age = calculateAge(player, GameState.currentYear);
        const overall = calculateCurrentOverall(player);
        const phase = getCareerPhase(player, GameState.currentYear);
        const trend = getPlayerTrend(player);
        const isOwnPlayer = GameState.squad.some((item) => item.id === player.id);
        const interestedClubs = getInterestedClubs(player);
        const valueGrowth = player.history?.[1]?.value ? Math.round(((player.marketValue - player.history[1].value) / Math.max(1, player.history[1].value)) * 100) : 0;
        document.getElementById("screen-root").innerHTML = `
            <section class="screen stack">
                <div class="player-hero card card-pad">
                    <div class="player-photo" aria-hidden="true">
                        <span>${player.nickname.slice(0, 2).toUpperCase()}</span>
                    </div>
                    <div class="stack">
                        <div>
                            <h1>${player.name}</h1>
                            <div class="meta"><span>${player.nickname}</span><span>${player.country}</span><span>${phase}</span><span>${escapeHtml(player.status)}</span></div>
                        </div>
                        <div class="stat-grid">
                            <div class="stat"><span>Idade</span><strong>${age}</strong></div>
                            <div class="stat"><span>Posicao</span><strong>${player.primaryPosition}</strong></div>
                            <div class="stat"><span>Overall</span><strong>${overall}</strong></div>
                            <div class="stat"><span>Potencial</span><strong>${player.potential}</strong></div>
                            <div class="stat"><span>Tendência</span><strong>${escapeHtml(trend)}</strong></div>
                            <div class="stat"><span>Valorização</span><strong>${valueGrowth >= 0 ? "+" : ""}${valueGrowth}%</strong></div>
                        </div>
                    </div>
                </div>

                <div class="grid">
                    <div class="card card-pad stack">
                        <h2>Dados do jogador</h2>
                        <div class="stat-grid">
                            <div class="stat"><span>Altura</span><strong>${player.height} cm</strong></div>
                            <div class="stat"><span>Peso</span><strong>${player.weight} kg</strong></div>
                            <div class="stat"><span>Pe dominante</span><strong>${player.dominantFoot}</strong></div>
                            <div class="stat"><span>Nascimento</span><strong>${player.birthYear}</strong></div>
                            <div class="stat"><span>Secundarias</span><strong>${player.secondaryPositions.join(", ") || "Nenhuma"}</strong></div>
                            <div class="stat"><span>Personalidade</span><strong>${player.personality}</strong></div>
                            <div class="stat"><span>Reputacao</span><strong>${player.reputation}</strong></div>
                            <div class="stat"><span>Fase</span><strong>${phase}</strong></div>
                            <div class="stat"><span>Status</span><strong>${escapeHtml(player.status)}</strong></div>
                            <div class="stat"><span>Clubes interessados</span><strong>${escapeHtml(interestedClubs.join(", "))}</strong></div>
                            <div class="stat"><span>Cartões</span><strong>${player.cards.yellow}A · ${player.cards.red}V</strong></div>
                            <div class="stat"><span>Áreas naturais</span><strong>${player.tacticalProfile.naturalAreas.join(", ")}</strong></div>
                            <div class="stat"><span>Versatilidade</span><strong>${player.tacticalProfile.versatility}</strong></div>
                            <div class="stat"><span>Funções preferidas</span><strong>${player.tacticalProfile.preferredRoles.join(", ")}</strong></div>
                            <div class="stat"><span>Lado preferido</span><strong>${player.tacticalProfile.preferredSide}</strong></div>
                        </div>
                    </div>
                    <div class="card card-pad stack">
                        <h2>Contrato e condicao</h2>
                        <div class="stat-grid">
                            <div class="stat"><span>Valor</span><strong>${money(player.marketValue)}</strong></div>
                            <div class="stat"><span>Salario</span><strong>${money(player.salary)}</strong></div>
                            <div class="stat"><span>Contrato</span><strong>${player.contract.yearsRemaining} ano(s)</strong></div>
                            <div class="stat"><span>Expira</span><strong>${player.contract.expiresYear}</strong></div>
                            <div class="stat"><span>Cláusula estimada</span><strong>${money(Math.round(player.marketValue * 1.65))}</strong></div>
                            <div class="stat"><span>Custo anual</span><strong>${money(player.salary * 52)}</strong></div>
                        </div>
                        <div class="meter-list">
                            ${renderAttributeMeter("Moral", player.morale)}
                            ${renderAttributeMeter("Energia", player.energy)}
                            ${renderAttributeMeter("Condicao fisica", player.fitness)}
                        </div>
                    </div>
                </div>

                <div class="card card-pad stack">
                    <h2>Atributos</h2>
                    <div class="attribute-grid">
                        ${PLAYER_ATTRIBUTES.map((attribute) => renderAttributeMeter(ATTRIBUTE_LABELS[attribute], player.attributes[attribute])).join("")}
                    </div>
                </div>

                <div class="grid">
                    <div class="card card-pad stack">
                        <h2>Estatísticas da temporada</h2>
                        <div class="stat-grid">
                            <div class="stat"><span>Jogos</span><strong>${player.statistics.appearances}</strong></div>
                            <div class="stat"><span>Gols</span><strong>${player.statistics.goals}</strong></div>
                            <div class="stat"><span>Assistências</span><strong>${player.statistics.assists}</strong></div>
                            <div class="stat"><span>Clean sheets</span><strong>${player.statistics.cleanSheets}</strong></div>
                            <div class="stat"><span>Nota média</span><strong>${player.statistics.averageRating.toFixed(1)}</strong></div>
                            <div class="stat"><span>Suspensão</span><strong>${player.suspendedWeeks ? `${player.suspendedWeeks} semana(s)` : "Não"}</strong></div>
                            <div class="stat"><span>Empréstimo</span><strong>${player.loan ? `${player.loan.club} até ${player.loan.until}` : "Não"}</strong></div>
                            <div class="stat"><span>Lesões</span><strong>${player.injuries.length ? player.injuries.map((item) => `${item.type} (${item.weeks}s)`).join(", ") : "Nenhuma"}</strong></div>
                        </div>
                    </div>
                    <div class="card card-pad stack">
                        <h2>Evolução</h2>
                        <div class="finance-bars">
                            ${renderAttributeMeter("Overall", overall)}
                            ${renderAttributeMeter("Potencial", player.potential)}
                            ${renderAttributeMeter("Moral", player.morale)}
                            ${renderAttributeMeter("Energia", player.energy)}
                        </div>
                    </div>
                </div>

                <div class="grid">
                    <div class="card card-pad stack">
                        <h2>Histórico</h2>
                        ${renderMiniList((player.history || []).map((item) => ({
                            title: `${item.season} · ${item.club}`,
                            text: `${item.event} · ${money(item.value || player.marketValue)}`,
                            meta: "Carreira"
                        })), "Sem histórico registrado.")}
                    </div>
                    <div class="card card-pad stack">
                        <h2>Temporadas</h2>
                        ${renderMiniList((player.seasons || []).map((item) => ({
                            title: `${item.season} · ${item.club}`,
                            text: `${item.appearances} jogos · ${item.goals} gols · ${item.assists} assistências · nota ${Number(item.rating).toFixed(1)}`,
                            meta: "Estatísticas"
                        })), "Sem temporadas registradas.")}
                    </div>
                </div>

                <div class="card card-pad stack">
                    ${isOwnPlayer ? `
                        <div class="button-row">
                            <button class="btn btn-primary" id="renew-player" type="button">Renovar contrato</button>
                            <button class="btn" id="loan-player" type="button">Emprestar</button>
                            <button class="btn btn-danger" id="sell-player" type="button">Vender</button>
                        </div>
                    ` : ""}
                    <button class="btn" id="back-to-squad" type="button">Voltar</button>
                </div>
            </section>
        `;
        if (isOwnPlayer) {
            document.getElementById("renew-player").addEventListener("click", () => renewSquadPlayer(player.id));
            document.getElementById("loan-player").addEventListener("click", () => loanSquadPlayer(player.id));
            document.getElementById("sell-player").addEventListener("click", () => sellSquadPlayer(player.id));
        }
        document.getElementById("back-to-squad").addEventListener("click", () => switchScreen("squad"));
        updateChrome();
    }

    function renderTactics() {
        refreshAllPlayers();
        ensureTacticsState();
        const starters = GameState.tactics.starters.map((slot) => ({ slot, player: getPlayerById(slot.playerId) })).filter((item) => item.player);
        const bench = GameState.tactics.bench.map((id) => getPlayerById(id)).filter(Boolean);
        document.getElementById("screen-root").innerHTML = `
            <section class="screen stack">
                <div>
                    <h1>Editor tático</h1>
                    <p>Arraste jogadores no campo ou toque em dois atletas para trocar. Formações são apenas pontos de partida.</p>
                </div>
                <div class="grid tactics-layout">
                    <div class="card card-pad stack">
                        <div class="squad-tools">
                            <label class="field">
                                <span>Modelo inicial</span>
                                <select id="formation-select">
                                    ${Object.keys(BASE_FORMATIONS).map((name) => `<option value="${name}" ${GameState.tactics.baseFormation === name ? "selected" : ""}>${name}</option>`).join("")}
                                </select>
                            </label>
                            <label class="field">
                                <span>Mentalidade</span>
                                <select id="mentality-select">
                                    ${MENTALITIES.map((name) => `<option value="${name}" ${GameState.tactics.mentality === name ? "selected" : ""}>${name}</option>`).join("")}
                                </select>
                            </label>
                            <label class="field">
                                <span>Estilo</span>
                                <select id="style-select">
                                    ${PLAY_STYLES.map((name) => `<option value="${name}" ${GameState.tactics.playStyle === name ? "selected" : ""}>${name}</option>`).join("")}
                                </select>
                            </label>
                        </div>
                        <div class="pitch" id="tactic-pitch">
                            <div class="pitch-zone zone-red top"></div>
                            <div class="pitch-zone zone-yellow top"></div>
                            <div class="pitch-zone zone-green"></div>
                            <div class="pitch-line halfway"></div>
                            <div class="pitch-box box-top"></div>
                            <div class="pitch-box box-bottom"></div>
                            ${starters.map(({ slot, player }) => renderTacticPlayer(player, slot)).join("")}
                        </div>
                        <div class="meta"><span>Verde: área natural</span><span>Amarelo: adaptação</span><span>Vermelho: perda alta</span><span>Média tática ${getTeamTacticalAverage()}</span></div>
                    </div>
                    <div class="card card-pad stack">
                        <h2>Banco</h2>
                        <div class="bench-list" id="bench-list">
                            ${bench.map((player) => renderBenchPlayer(player)).join("") || `<div class="empty-state">Sem reservas disponíveis.</div>`}
                        </div>
                        <h2>Bolas paradas</h2>
                        <div class="stack">
                            ${SET_PIECES.map((key) => `
                                <label class="field">
                                    <span>${SET_PIECE_LABELS[key]}</span>
                                    <select data-set-piece="${key}">
                                        ${GameState.squad.map((player) => `<option value="${player.id}" ${GameState.tactics.setPieces[key] === player.id ? "selected" : ""}>${player.name}</option>`).join("")}
                                    </select>
                                </label>
                            `).join("")}
                        </div>
                    </div>
                </div>
            </section>
        `;
        bindTacticsEvents();
        updateChrome();
    }

    function renderTacticPlayer(player, slot) {
        const role = inferRoleFromCoordinates(slot.x, slot.y);
        const tacticalOverall = calculateTacticalOverall(player, slot);
        const zone = getTacticalZone(player, slot);
        return `
            <button class="tactic-player zone-${zone}" type="button" draggable="true" data-tactic-player="${player.id}" style="left:${slot.x}%;top:${slot.y}%">
                <strong>${player.nickname}</strong>
                <span>${role} ${tacticalOverall}</span>
            </button>
        `;
    }

    function renderBenchPlayer(player) {
        const slot = { x: getRoleCoordinate(player.primaryPosition)[0], y: getRoleCoordinate(player.primaryPosition)[1] };
        return `
            <button class="bench-player" type="button" draggable="true" data-bench-player="${player.id}">
                <strong>${player.name}</strong>
                <span>${player.primaryPosition} ${calculateTacticalOverall(player, slot)}</span>
                <small>Moral ${player.morale} · Energia ${player.energy} · Cond. ${player.fitness}</small>
            </button>
        `;
    }

    function bindTacticsEvents() {
        document.getElementById("formation-select").addEventListener("change", (event) => applyBaseFormation(event.target.value));
        document.getElementById("mentality-select").addEventListener("change", (event) => {
            GameState.tactics.mentality = event.target.value;
            saveCareer();
            showToast(`Mentalidade: ${event.target.value}.`);
        });
        document.getElementById("style-select").addEventListener("change", (event) => {
            GameState.tactics.playStyle = event.target.value;
            saveCareer();
            showToast(`Estilo: ${event.target.value}.`);
        });
        document.querySelectorAll("[data-set-piece]").forEach((select) => {
            select.addEventListener("change", () => {
                GameState.tactics.setPieces[select.dataset.setPiece] = select.value;
                saveCareer();
                showToast(`${SET_PIECE_LABELS[select.dataset.setPiece]} atualizado.`);
            });
        });
        document.querySelectorAll("[data-tactic-player]").forEach((button) => {
            button.addEventListener("dragstart", (event) => {
                event.dataTransfer.setData("text/plain", `starter:${button.dataset.tacticPlayer}`);
            });
            button.addEventListener("click", (event) => {
                event.stopPropagation();
                handleTacticClick(button.dataset.tacticPlayer, "starter");
            });
        });
        document.querySelectorAll("[data-bench-player]").forEach((button) => {
            button.addEventListener("dragstart", (event) => {
                event.dataTransfer.setData("text/plain", `bench:${button.dataset.benchPlayer}`);
            });
            button.addEventListener("click", (event) => {
                event.stopPropagation();
                handleTacticClick(button.dataset.benchPlayer, "bench");
            });
        });
        const pitch = document.getElementById("tactic-pitch");
        pitch.addEventListener("click", (event) => {
            if (!GameState.tactics.selectedPlayerId) return;
            const [source, playerId] = GameState.tactics.selectedPlayerId.split(":");
            const rect = pitch.getBoundingClientRect();
            const x = clamp(((event.clientX - rect.left) / rect.width) * 100, 6, 94);
            const y = clamp(((event.clientY - rect.top) / rect.height) * 100, 6, 94);
            GameState.tactics.selectedPlayerId = null;
            movePlayerToPitch(playerId, source, x, y);
        });
        pitch.addEventListener("dragover", (event) => event.preventDefault());
        pitch.addEventListener("drop", (event) => {
            event.preventDefault();
            const [source, playerId] = event.dataTransfer.getData("text/plain").split(":");
            const rect = pitch.getBoundingClientRect();
            const x = clamp(((event.clientX - rect.left) / rect.width) * 100, 6, 94);
            const y = clamp(((event.clientY - rect.top) / rect.height) * 100, 6, 94);
            movePlayerToPitch(playerId, source, x, y);
        });
        const bench = document.getElementById("bench-list");
        bench.addEventListener("dragover", (event) => event.preventDefault());
        bench.addEventListener("drop", (event) => {
            event.preventDefault();
            const [source, playerId] = event.dataTransfer.getData("text/plain").split(":");
            if (source === "starter") movePlayerToBench(playerId);
        });
    }

    function handleTacticClick(playerId, source) {
        const selected = GameState.tactics.selectedPlayerId;
        if (!selected) {
            GameState.tactics.selectedPlayerId = `${source}:${playerId}`;
            showToast("Selecione outro jogador ou uma área do campo para trocar.");
            return;
        }
        const [selectedSource, selectedId] = selected.split(":");
        if (selectedId === playerId) {
            GameState.tactics.selectedPlayerId = null;
            return;
        }
        swapTacticPlayers(selectedId, selectedSource, playerId, source);
        GameState.tactics.selectedPlayerId = null;
        saveCareer();
        renderTactics();
    }

    function movePlayerToPitch(playerId, source, x, y) {
        if (source === "bench") {
            const outgoing = findClosestStarter(x, y);
            if (outgoing) {
                GameState.tactics.starters = GameState.tactics.starters.filter((slot) => slot.playerId !== outgoing.playerId);
                if (!GameState.tactics.bench.includes(outgoing.playerId)) GameState.tactics.bench.push(outgoing.playerId);
            }
            GameState.tactics.bench = GameState.tactics.bench.filter((id) => id !== playerId);
            GameState.tactics.starters.push({ playerId, x, y });
            if (GameState.tactics.starters.length > 11) GameState.tactics.starters.shift();
        } else {
            const slot = getStarterSlot(playerId);
            if (slot) {
                slot.x = x;
                slot.y = y;
            }
        }
        saveCareer();
        renderTactics();
    }

    function movePlayerToBench(playerId, shouldRender = true) {
        GameState.tactics.starters = GameState.tactics.starters.filter((slot) => slot.playerId !== playerId);
        if (!GameState.tactics.bench.includes(playerId)) GameState.tactics.bench.push(playerId);
        if (GameState.tactics.starters.length < 11 && GameState.tactics.bench.length) {
            const nextId = GameState.tactics.bench.find((id) => id !== playerId);
            if (nextId) {
                GameState.tactics.bench = GameState.tactics.bench.filter((id) => id !== nextId);
                GameState.tactics.starters.push({ playerId: nextId, x: 50, y: 50 });
            }
        }
        if (shouldRender) {
            saveCareer();
            renderTactics();
        }
    }

    function swapTacticPlayers(firstId, firstSource, secondId, secondSource) {
        if (firstSource === "starter" && secondSource === "starter") {
            const firstSlot = getStarterSlot(firstId);
            const secondSlot = getStarterSlot(secondId);
            if (!firstSlot || !secondSlot) return;
            [firstSlot.playerId, secondSlot.playerId] = [secondSlot.playerId, firstSlot.playerId];
            return;
        }
        const starterId = firstSource === "starter" ? firstId : secondId;
        const benchId = firstSource === "bench" ? firstId : secondId;
        const slot = getStarterSlot(starterId);
        if (!slot) return;
        slot.playerId = benchId;
        GameState.tactics.bench = GameState.tactics.bench.filter((id) => id !== benchId);
        GameState.tactics.bench.push(starterId);
    }

    function findClosestStarter(x, y) {
        return GameState.tactics.starters
            .map((slot) => ({ ...slot, distance: Math.hypot(slot.x - x, slot.y - y) }))
            .sort((a, b) => a.distance - b.distance)[0] || null;
    }

    function renderAttributeMeter(label, value) {
        const rounded = Math.round(clamp(value, 1, 99));
        return `
            <div class="attribute-meter">
                <div><span>${label}</span><strong>${rounded}</strong></div>
                <i><b style="width:${rounded}%"></b></i>
            </div>
        `;
    }

    function getMarketFavorites() {
        const stored = window.EGStorage ? window.EGStorage.read(MARKET_FAVORITES_KEY) : [];
        return Array.isArray(stored) ? stored : [];
    }

    function saveMarketFavorites(favorites) {
        if (window.EGStorage) window.EGStorage.write(MARKET_FAVORITES_KEY, [...new Set(favorites)]);
    }

    function isMarketFavorite(playerId) {
        return getMarketFavorites().includes(playerId);
    }

    function removeMarketFavorite(playerId, shouldRender = true) {
        saveMarketFavorites(getMarketFavorites().filter((id) => id !== playerId));
        if (shouldRender) renderMarket();
    }

    function toggleMarketFavorite(playerId) {
        ensureTransferMarketState();
        const favorites = getMarketFavorites();
        if (favorites.includes(playerId)) {
            saveMarketFavorites(favorites.filter((id) => id !== playerId));
            showToast(t("market.favoriteRemoved"));
        } else {
            favorites.push(playerId);
            saveMarketFavorites(favorites);
            showToast(t("market.favoriteAdded"));
        }
        renderMarket();
    }

    function toggleObservedPlayer(playerId) {
        ensureTransferMarketState();
        ensureScoutState();
        if (GameState.scout.assignments[playerId]) {
            delete GameState.scout.assignments[playerId];
            GameState.transferMarket.observedPlayerIds = GameState.transferMarket.observedPlayerIds.filter((id) => id !== playerId);
            showToast(t("market.watchRemoved"));
        } else {
            if (!startScoutObservation(playerId, { silent: true })) return;
            showToast(t("market.watchAdded"));
        }
        saveCareer();
        renderMarket();
    }

    function getPlayerCurrentClub(player) {
        if (player.currentClub) return player.currentClub;
        const clubs = GameState?.league?.clubs?.length ? GameState.league.clubs : clubCatalog;
        const seed = String(player.id || player.name || "").split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
        return clubs[seed % clubs.length]?.name || GameState.club?.name || t("market.none");
    }

    function getContractStatus(player) {
        const years = player.contract?.yearsRemaining ?? 0;
        if (years <= 1) return "expiring";
        if (years === 2) return "short";
        if (years <= 4) return "stable";
        return "long";
    }

    function getScoutLevel() {
        const structureLevel = GameState?.club?.structure?.departments?.scout?.level || Math.round((GameState?.club?.scoutQuality || 50) / 12) || 1;
        const staffLevel = getStaffMember("scout")?.level || 1;
        return clamp(Math.round((structureLevel + staffLevel) / 2), 1, 10);
    }

    function getScoutAccuracy() {
        return clamp(54 + getScoutLevel() * 4, 58, 94);
    }

    function getScoutCapacity() {
        return 2 + Math.floor(getScoutLevel() / 2);
    }

    function getScoutRequiredWeeks() {
        return clamp(5 - Math.floor((getScoutLevel() - 1) / 3), 2, 4);
    }

    function getScoutApproxValue(value) {
        const variance = Math.max(1, Math.round((100 - getScoutAccuracy()) / 9));
        const seed = (Number(value) || 0) % (variance * 2 + 1);
        return clamp(Math.round((Number(value) || 0) + seed - variance), 1, 99);
    }

    function getScoutAssignment(playerId) {
        ensureScoutState();
        return GameState.scout.assignments[playerId] || null;
    }

    function startScoutObservation(playerId, options = {}) {
        ensureTransferMarketState();
        const player = GameState.market.find((item) => item.id === playerId);
        if (!player) return false;
        const activeCount = Object.keys(GameState.scout?.assignments || {}).length;
        if (!GameState.scout.assignments[playerId] && activeCount >= getScoutCapacity()) {
            if (!options.silent) showToast(t("scout.capacityFull"));
            return false;
        }
        GameState.scout.assignments[playerId] = {
            playerId,
            startedRound: GameState.round,
            weeksObserved: GameState.scout.assignments[playerId]?.weeksObserved || 1,
            requiredWeeks: getScoutRequiredWeeks(),
            completed: false,
            reportText: GameState.scout.assignments[playerId]?.reportText || "",
            region: getPlayerScoutRegion(player)
        };
        if (!GameState.transferMarket.observedPlayerIds.includes(playerId)) {
            GameState.transferMarket.observedPlayerIds.push(playerId);
        }
        updateScoutAssignmentReport(playerId);
        if (!options.silent) {
            saveCareer();
            showToast(t("scout.started"));
        }
        return true;
    }

    function removeScoutObservation(playerId, shouldRender = true) {
        ensureScoutState();
        delete GameState.scout.assignments[playerId];
        GameState.transferMarket.observedPlayerIds = GameState.transferMarket.observedPlayerIds.filter((id) => id !== playerId);
        saveCareer();
        if (shouldRender) {
            renderScout();
            showToast(t("scout.removed"));
        }
    }

    function getPlayerScoutRegion(player) {
        const country = player.country || "";
        if (["Brasil", "Argentina", "Uruguai", "Chile"].includes(country)) return "southAmerica";
        if (["Inglaterra", "Portugal", "Espanha", "Alemanha", "Italia", "Franca", "Holanda", "Croacia", "Iugoslavia", "Uniao Sovietica"].includes(country)) return "europe";
        if (["Angola"].includes(country)) return "africa";
        return "southAmerica";
    }

    function advanceScoutWeek() {
        ensureScoutState();
        let updated = false;
        Object.keys(GameState.scout.assignments).forEach((playerId) => {
            const assignment = GameState.scout.assignments[playerId];
            assignment.requiredWeeks = getScoutRequiredWeeks();
            assignment.weeksObserved = clamp((assignment.weeksObserved || 1) + 1, 1, assignment.requiredWeeks);
            updateScoutAssignmentReport(playerId);
            updated = true;
        });
        GameState.scout.lastUpdatedRound = GameState.round;
        if (updated) {
            const latest = getLatestScoutReport();
            if (latest) addNews("Mercado", t("scout.updated"), latest.playerName, latest.text);
        }
    }

    function updateScoutAssignmentReport(playerId) {
        const assignment = GameState.scout.assignments[playerId];
        const player = GameState.market.find((item) => item.id === playerId);
        if (!assignment || !player) return;
        assignment.completed = (assignment.weeksObserved || 1) >= (assignment.requiredWeeks || getScoutRequiredWeeks());
        assignment.reportText = buildScoutReportText(player, assignment);
        if (assignment.completed) {
            const report = {
                id: `scout-${playerId}-${GameState.currentYear}-${GameState.round}`,
                playerId,
                playerName: player.name,
                text: assignment.reportText,
                date: new Date().toISOString(),
                week: GameState.round
            };
            GameState.scout.reports = [report, ...GameState.scout.reports.filter((item) => item.playerId !== playerId)].slice(0, 12);
        }
    }

    function buildScoutReportText(player, assignment) {
        const overall = calculateCurrentOverall(player);
        const potentialGap = (player.potential || overall) - overall;
        const phrases = [];
        if (player.potential >= 88 || potentialGap >= 8) phrases.push(t("scout.recommendation.greatPotential"));
        if ((player.attributes?.physical || 0) >= 76 || (player.attributes?.stamina || 0) >= 78) phrases.push(t("scout.recommendation.physical"));
        if ((player.morale || 0) >= 72 && (player.fitness || 0) >= 78) phrases.push(t("scout.recommendation.consistent"));
        if (potentialGap >= 5) phrases.push(t("scout.recommendation.growth"));
        if (overall < 68 && player.potential < 78) phrases.push(t("scout.recommendation.notRecommended"));
        if (!phrases.length) phrases.push(overall >= 80 ? t("scout.recommendation.consistent") : t("scout.recommendation.growth"));
        const known = getScoutKnowledgeStage(assignment);
        if (known < 4) return `${phrases[0]} ${t("scout.reportPending")}`;
        return `${phrases.slice(0, 2).join(" ")} ${t("scout.overallApprox")}: ${getScoutApproxValue(overall)}. ${t("scout.potentialApprox")}: ${getScoutApproxValue(player.potential || overall)}.`;
    }

    function getScoutKnowledgeStage(assignment) {
        const weeks = assignment?.weeksObserved || 1;
        const required = assignment?.requiredWeeks || getScoutRequiredWeeks();
        if (required <= 2 && weeks >= 2) return 4;
        if (required <= 3 && weeks >= 3) return 4;
        return clamp(weeks, 1, 4);
    }

    function getLatestScoutReport() {
        ensureScoutState();
        return GameState.scout.reports[0] || null;
    }

    function getAcademyLevel() {
        return clamp(GameState?.club?.structure?.departments?.youth?.level || Math.round((GameState?.club?.youthQuality || 50) / 12) || 1, 1, 10);
    }

    function getAcademyWeeklyInvestment() {
        const level = getAcademyLevel();
        return Math.round((45000 + level * 18500) * getEconomicMultiplier(GameState.currentYear));
    }

    function getAcademyAverageQuality() {
        ensureAcademyState();
        if (!GameState.academy.prospects.length) return 0;
        const total = GameState.academy.prospects.reduce((sum, player) => sum + calculateCurrentOverall(player) + (player.potential || 0), 0);
        return Math.round(total / (GameState.academy.prospects.length * 2));
    }

    function ensureAcademyState() {
        if (!GameState) return;
        const fresh = createDefaultAcademyState();
        GameState.academy = {
            ...fresh,
            ...(GameState.academy || {}),
            prospects: Array.isArray(GameState.academy?.prospects) ? GameState.academy.prospects : [],
            events: Array.isArray(GameState.academy?.events) ? GameState.academy.events : [],
            keptPlayerIds: Array.isArray(GameState.academy?.keptPlayerIds) ? GameState.academy.keptPlayerIds : [],
            futureArchitecture: { ...fresh.futureArchitecture, ...(GameState.academy?.futureArchitecture || {}) }
        };
        GameState.academy.prospects = GameState.academy.prospects.map(normalizePlayer).map(refreshPlayerRuntime);
        if (GameState.club && GameState.academy.prospects.length < 3) {
            const missing = 3 - GameState.academy.prospects.length;
            for (let index = 0; index < missing; index += 1) {
                addAcademyProspect(createAcademyProspect(index), t("academy.event.generic"), { silent: true });
            }
        }
    }

    function createAcademyProspect(index = 0) {
        const level = getAcademyLevel();
        const countries = [GameState.club?.country || "Brasil", "Brasil", "Argentina", "Portugal", "Espanha", "Uruguai"];
        const firstNames = ["Lucas", "Mateus", "Rafael", "Tiago", "Bruno", "Diego", "Enzo", "Nico", "Andre", "Caio", "Hugo", "Leo"];
        const lastNames = ["Silva", "Costa", "Almeida", "Ferreira", "Ramos", "Torres", "Pereira", "Mendes", "Lima", "Santos", "Vidal", "Rocha"];
        const positions = ["GK", "RB", "CB", "LB", "CDM", "CM", "CAM", "RW", "LW", "ST"];
        const primaryPosition = positions[Math.floor(Math.random() * positions.length)];
        const secondaryPositions = inferNaturalAreas(primaryPosition, []).filter((position) => position !== primaryPosition).slice(0, primaryPosition === "GK" ? 0 : 2);
        const age = 15 + Math.floor(Math.random() * 4);
        const baseOverall = clamp(42 + level * 3 + Math.round(Math.random() * 14), 38, 78);
        const potential = clamp(baseOverall + 10 + level * 2 + Math.round(Math.random() * 14), 55, 99);
        const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
        const prospect = {
            id: `academy-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`,
            databaseId: `academy-${index}`,
            name,
            fullName: name,
            shortName: name,
            nickname: name.split(" ")[0],
            country: countries[Math.floor(Math.random() * countries.length)],
            birthYear: GameState.currentYear - age,
            primaryPosition,
            secondaryPositions,
            height: 168 + Math.floor(Math.random() * 25),
            weight: 62 + Math.floor(Math.random() * 24),
            dominantFoot: Math.random() > 0.24 ? "Direito" : "Esquerdo",
            personality: ["Profissional", "Ambicioso", "Disciplinado", "Criativo", "Reservado", "Competitivo"][Math.floor(Math.random() * 6)],
            potential,
            reputation: clamp(28 + level * 3 + Math.round(Math.random() * 12), 20, 75),
            morale: clamp(65 + Math.round(Math.random() * 24), 1, 99),
            energy: clamp(72 + Math.round(Math.random() * 20), 1, 99),
            fitness: clamp(76 + Math.round(Math.random() * 18), 1, 99),
            rarity: potential >= 88 ? "promessa" : "comum",
            contract: { yearsRemaining: 3, expiresYear: GameState.currentYear + 3 },
            salary: Math.round((1200 + baseOverall * 95) * getEconomicMultiplier(GameState.currentYear)),
            marketValue: Math.round((90000 + potential * 9500 + level * 24000) * getEconomicMultiplier(GameState.currentYear)),
            attributes: createFallbackAttributes(baseOverall, primaryPosition),
            academy: {
                category: age <= 16 ? "Sub-17" : "Sub-20",
                canLoan: false,
                bTeamReady: false,
                joinedYear: GameState.currentYear
            }
        };
        return normalizePlayer(prospect);
    }

    function getAcademyEventForProspect(player) {
        if (["ST", "CF", "RW", "LW"].includes(player.primaryPosition)) return t("academy.event.striker");
        if (["CDM", "CM"].includes(player.primaryPosition)) return t("academy.event.midfielder");
        if ((player.potential || 0) >= 86 || Math.random() < 0.2) return t("academy.event.interest");
        return t("academy.event.generic");
    }

    function addAcademyProspect(player, text, options = {}) {
        GameState.academy.prospects.unshift(player);
        GameState.academy.prospects = GameState.academy.prospects.slice(0, 18);
        const event = {
            id: `academy-event-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            playerId: player.id,
            playerName: player.name,
            text,
            date: new Date().toISOString(),
            round: GameState.round
        };
        GameState.academy.events.unshift(event);
        GameState.academy.events = GameState.academy.events.slice(0, 12);
        if (!options.silent) {
            addNews("Jovens", text, player.name, `${player.name} tem ${calculateAge(player, GameState.currentYear)} anos, atua como ${translatePosition(player.primaryPosition)} e será acompanhado pela comissão da Base.`);
        }
        return player;
    }

    function processAcademyWeek() {
        ensureAcademyState();
        const level = getAcademyLevel();
        const chance = Math.min(0.62, 0.08 + level * 0.045 + (GameState.club.youthQuality || 50) / 900);
        const shouldGenerate = GameState.academy.prospects.length < 4 || Math.random() < chance;
        if (!shouldGenerate) return;
        const prospect = createAcademyProspect(GameState.academy.prospects.length);
        addAcademyProspect(prospect, getAcademyEventForProspect(prospect));
        GameState.academy.lastGeneratedRound = GameState.round;
        showToast(t("academy.generated"));
    }

    function keepAcademyProspect(playerId) {
        ensureAcademyState();
        if (!GameState.academy.keptPlayerIds.includes(playerId)) GameState.academy.keptPlayerIds.push(playerId);
        saveCareer();
        renderAcademy();
        showToast(t("academy.kept"));
    }

    function promoteAcademyProspect(playerId) {
        ensureAcademyState();
        const index = GameState.academy.prospects.findIndex((player) => player.id === playerId);
        if (index < 0) return;
        const prospect = GameState.academy.prospects[index];
        const promoted = normalizePlayer({
            ...prospect,
            id: `squad-academy-${Date.now()}`,
            contract: { yearsRemaining: 3, expiresYear: GameState.currentYear + 3 }
        });
        GameState.squad.push(promoted);
        GameState.squad.sort(byPositionThenOverall);
        GameState.academy.prospects.splice(index, 1);
        GameState.academy.events.unshift({
            id: `academy-promoted-${Date.now()}`,
            playerId: promoted.id,
            playerName: promoted.name,
            text: t("academy.promoted"),
            date: new Date().toISOString(),
            round: GameState.round
        });
        addNews("Jovens", t("academy.promoted"), promoted.name, `${promoted.name} foi integrado ao elenco profissional do ${GameState.club.name}.`);
        saveCareer();
        renderAcademy();
        showToast(t("academy.promoted"));
    }

    function ensureMarketingState() {
        if (!GameState) return;
        const fresh = createDefaultMarketingState();
        GameState.marketing = {
            ...fresh,
            ...(GameState.marketing || {}),
            sponsors: { ...fresh.sponsors, ...(GameState.marketing?.sponsors || {}) },
            proposals: Array.isArray(GameState.marketing?.proposals) ? GameState.marketing.proposals : [],
            store: { ...fresh.store, ...(GameState.marketing?.store || {}), products: { ...fresh.store.products, ...(GameState.marketing?.store?.products || {}) } },
            campaigns: Array.isArray(GameState.marketing?.campaigns) ? GameState.marketing.campaigns : [],
            history: Array.isArray(GameState.marketing?.history) ? GameState.marketing.history : []
        };
        if (!GameState.club) return;
        if (!GameState.marketing.proposals.length) generateMarketingProposals(true);
        updateStoreProjection();
    }

    function getMarketingLevel() {
        return clamp(GameState?.club?.structure?.departments?.marketing?.level || Math.round((GameState?.club?.reputation || 70) / 14) || 1, 1, 10);
    }

    function getRecentPerformanceScore() {
        const recent = (GameState.league?.results || []).filter((result) => result.home === GameState.club.name || result.away === GameState.club.name).slice(0, 5);
        if (!recent.length) return 55;
        const points = recent.reduce((sum, result) => {
            const home = result.home === GameState.club.name;
            const goalsFor = home ? result.homeGoals : result.awayGoals;
            const goalsAgainst = home ? result.awayGoals : result.homeGoals;
            return sum + (goalsFor > goalsAgainst ? 3 : goalsFor === goalsAgainst ? 1 : 0);
        }, 0);
        return clamp(Math.round((points / (recent.length * 3)) * 100), 15, 100);
    }

    function getSponsorBaseValue(slot) {
        const position = currentPosition();
        const tableSize = GameState.league.table.length || 12;
        const positionScore = Math.round(((tableSize - position + 1) / tableSize) * 100);
        const divisionFactor = Math.max(1, 1.12 - ((GameState.league.division || 1) - 1) * 0.12);
        const reputation = GameState.club.reputation || 70;
        const fans = GameState.club.fans || 1000000;
        const performance = getRecentPerformanceScore();
        const slotFactor = { master: 1, secondary: 0.52, material: 0.72 }[slot] || 0.5;
        return Math.round(((reputation * 1800) + (fans / 125) + (performance * 950) + (positionScore * 700)) * slotFactor * divisionFactor * (1 + getMarketingLevel() * 0.028) * getEconomicMultiplier(GameState.currentYear));
    }

    function createSponsorProposal(slot, index = 0) {
        const names = {
            master: ["Banco Continental", "Aurora Energia", "Imperial Seguros"],
            secondary: ["Rádio Popular", "Café Central", "Transportes União"],
            material: ["Norte Sports", "Atlas Equipamentos", "ProKit"]
        }[slot];
        const base = getSponsorBaseValue(slot);
        const multiplier = 0.92 + Math.random() * 0.22 + index * 0.04;
        return {
            id: `sponsor-${slot}-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`,
            slot,
            name: names[index % names.length],
            weeklyValue: Math.round(base * multiplier),
            durationWeeks: 26 + Math.floor(Math.random() * 27),
            reputationFit: clamp(Math.round((GameState.club.reputation || 70) + Math.random() * 16 - 8), 1, 100),
            fanReach: clamp(Math.round(((GameState.club.fans || 1000000) / 90000) + getMarketingLevel() * 6), 1, 100),
            negotiated: false
        };
    }

    function generateMarketingProposals(force = false) {
        ensureMarketingStateNoGenerate();
        if (!force && GameState.marketing.proposals.length && GameState.round - (GameState.marketing.lastProposalRound || 0) < 4) return;
        GameState.marketing.proposals = ["master", "secondary", "material"].flatMap((slot) => {
            if (GameState.marketing.sponsors[slot]) return [];
            return [createSponsorProposal(slot, 0), createSponsorProposal(slot, 1)];
        });
        GameState.marketing.lastProposalRound = GameState.round;
    }

    function ensureMarketingStateNoGenerate() {
        const fresh = createDefaultMarketingState();
        GameState.marketing = {
            ...fresh,
            ...(GameState.marketing || {}),
            sponsors: { ...fresh.sponsors, ...(GameState.marketing?.sponsors || {}) },
            proposals: Array.isArray(GameState.marketing?.proposals) ? GameState.marketing.proposals : [],
            store: { ...fresh.store, ...(GameState.marketing?.store || {}), products: { ...fresh.store.products, ...(GameState.marketing?.store?.products || {}) } },
            campaigns: Array.isArray(GameState.marketing?.campaigns) ? GameState.marketing.campaigns : [],
            history: Array.isArray(GameState.marketing?.history) ? GameState.marketing.history : []
        };
    }

    function acceptSponsorProposal(proposalId) {
        ensureMarketingState();
        const proposal = GameState.marketing.proposals.find((item) => item.id === proposalId);
        if (!proposal) return;
        GameState.marketing.sponsors[proposal.slot] = { ...proposal, signedRound: GameState.round };
        GameState.marketing.proposals = GameState.marketing.proposals.filter((item) => item.id !== proposalId && item.slot !== proposal.slot);
        GameState.publicRelations.sponsorTrust = clamp((GameState.publicRelations.sponsorTrust || 50) + 4, 0, 100);
        GameState.marketing.history.unshift({ text: `${proposal.name}: ${t("marketing.accepted")}`, round: GameState.round });
        saveCareer();
        renderMarketing();
        showToast(t("marketing.accepted"));
    }

    function rejectSponsorProposal(proposalId) {
        ensureMarketingState();
        const proposal = GameState.marketing.proposals.find((item) => item.id === proposalId);
        GameState.marketing.proposals = GameState.marketing.proposals.filter((item) => item.id !== proposalId);
        if (proposal) GameState.marketing.history.unshift({ text: `${proposal.name}: ${t("marketing.rejected")}`, round: GameState.round });
        saveCareer();
        renderMarketing();
        showToast(t("marketing.rejected"));
    }

    function negotiateSponsorProposal(proposalId) {
        ensureMarketingState();
        const proposal = GameState.marketing.proposals.find((item) => item.id === proposalId);
        if (!proposal) return;
        proposal.weeklyValue = Math.round(proposal.weeklyValue * (proposal.negotiated ? 1.02 : 1.12));
        proposal.durationWeeks = Math.max(13, proposal.durationWeeks - 4);
        proposal.negotiated = true;
        GameState.publicRelations.sponsorTrust = clamp((GameState.publicRelations.sponsorTrust || 50) - 1, 0, 100);
        saveCareer();
        renderMarketing();
        showToast(t("marketing.negotiated"));
    }

    function getSponsorWeeklyIncome() {
        ensureMarketingStateNoGenerate();
        return Object.values(GameState.marketing.sponsors || {}).reduce((sum, sponsor) => sum + (sponsor?.weeklyValue || 0), 0);
    }

    function updateStoreProjection() {
        const loved = getLovedPlayers()[0]?.name || GameState.squad[0]?.name || GameState.club?.name || "Clube";
        const marketingLevel = getMarketingLevel();
        const fanMood = getFanMood().score;
        const estimatedSales = Math.max(0, Math.round(((GameState.club?.fans || 1000000) / 2100) * (0.68 + marketingLevel * 0.045) * (0.75 + fanMood / 180)));
        const weeklyRevenue = Math.round(estimatedSales * (18 + marketingLevel * 1.8) * getEconomicMultiplier(GameState.currentYear));
        GameState.marketing.store.estimatedSales = estimatedSales;
        GameState.marketing.store.weeklyRevenue = weeklyRevenue;
        GameState.marketing.store.bestSeller = `Camisa ${loved}`;
        return GameState.marketing.store;
    }

    function getCampaignDefinitions() {
        return [
            { id: "fanDay", label: t("marketing.campaign.fanDay"), cost: 45000, fanDelta: 5, revenueBoost: 0.04, attendanceBoost: 0.05 },
            { id: "ticketPromo", label: t("marketing.campaign.ticketPromo"), cost: 32000, fanDelta: 3, revenueBoost: -0.02, attendanceBoost: 0.1 },
            { id: "idolEvent", label: t("marketing.campaign.idolEvent"), cost: 70000, fanDelta: 6, revenueBoost: 0.08, attendanceBoost: 0.03 },
            { id: "shirtWeek", label: t("marketing.campaign.shirtWeek"), cost: 52000, fanDelta: 2, revenueBoost: 0.14, attendanceBoost: 0.01 }
        ];
    }

    function runMarketingCampaign(campaignId) {
        ensureMarketingState();
        const campaign = getCampaignDefinitions().find((item) => item.id === campaignId);
        if (!campaign || GameState.budget < campaign.cost) {
            showToast("Saldo insuficiente.");
            return;
        }
        applyFinanceMovement("expense", "Marketing", campaign.label, campaign.cost);
        GameState.publicRelations.fanMoodModifier = clamp((GameState.publicRelations.fanMoodModifier || 0) + campaign.fanDelta, -20, 20);
        GameState.marketing.campaigns.unshift({ ...campaign, round: GameState.round, date: new Date().toISOString() });
        GameState.marketing.campaigns = GameState.marketing.campaigns.slice(0, 8);
        registerFanReaction(campaign.label, campaign.fanDelta, `${campaign.label} aproximou o clube da torcida.`, "news");
        updateStoreProjection();
        saveCareer();
        renderMarketing();
        showToast(t("marketing.campaignActive"));
    }

    function processMarketingWeek() {
        ensureMarketingState();
        Object.keys(GameState.marketing.sponsors).forEach((slot) => {
            const sponsor = GameState.marketing.sponsors[slot];
            if (!sponsor) return;
            sponsor.durationWeeks = Math.max(0, (sponsor.durationWeeks || 1) - 1);
            if (sponsor.durationWeeks === 0) {
                GameState.marketing.history.unshift({ text: `${sponsor.name}: contrato encerrado.`, round: GameState.round });
                GameState.marketing.sponsors[slot] = null;
            }
        });
        updateStoreProjection();
        generateMarketingProposals(false);
        GameState.marketing.history = GameState.marketing.history.slice(0, 16);
    }

    function getRangeMatch(value, range, type) {
        if (range === "any") return true;
        if (type === "age") {
            if (range === "u21") return value <= 21;
            if (range === "22-27") return value >= 22 && value <= 27;
            if (range === "28-32") return value >= 28 && value <= 32;
            if (range === "o32") return value > 32;
        }
        if (type === "rating") {
            if (range === "u70") return value <= 70;
            if (range === "71-80") return value >= 71 && value <= 80;
            if (range === "81-88") return value >= 81 && value <= 88;
            if (range === "o88") return value > 88;
        }
        if (type === "money") {
            if (range === "low") return value < 800000;
            if (range === "medium") return value >= 800000 && value < 2500000;
            if (range === "high") return value >= 2500000;
        }
        return true;
    }

    function getMarketFilterOptions(filterKey) {
        const filters = GameState.marketView.filters;
        if (filterKey === "position") {
            return [{ value: "ALL", label: t("filter.all") }, ...PLAYER_POSITIONS.map((position) => ({ value: position, label: translatePosition(position) }))];
        }
        if (filterKey === "age") {
            return ["any", "u21", "22-27", "28-32", "o32"].map((value) => ({ value, label: value === "any" ? t("range.any") : t(`range.age.${value}`) }));
        }
        if (filterKey === "overall" || filterKey === "potential") {
            return ["any", "u70", "71-80", "81-88", "o88"].map((value) => ({ value, label: value === "any" ? t("range.any") : t(`range.rating.${value}`) }));
        }
        if (filterKey === "value" || filterKey === "salary") {
            return ["any", "low", "medium", "high"].map((value) => ({ value, label: value === "any" ? t("range.any") : t(`range.money.${value}`) }));
        }
        if (filterKey === "contract") {
            return [{ value: "ALL", label: t("filter.all") }, ...["expiring", "short", "stable", "long"].map((value) => ({ value, label: t(`contract.${value}`) }))];
        }
        if (filterKey === "nationality") {
            const countries = [...new Set(GameState.market.map((player) => player.country || "Indefinido"))].sort((a, b) => translateCountry(a).localeCompare(translateCountry(b)));
            return [{ value: "ALL", label: t("filter.all") }, ...countries.map((country) => ({ value: country, label: translateCountry(country) }))];
        }
        if (filterKey === "club") {
            const clubs = [...new Set(GameState.market.map(getPlayerCurrentClub))].sort((a, b) => a.localeCompare(b));
            return [{ value: "ALL", label: t("filter.all") }, ...clubs.map((club) => ({ value: club, label: club }))];
        }
        if (filterKey === "phase") {
            const phases = [...new Set(GameState.market.map((player) => player.careerPhase || getCareerPhase(player, GameState.currentYear)))];
            return [{ value: "ALL", label: t("filter.all") }, ...phases.map((phase) => ({ value: phase, label: translateCareerPhase(phase) }))];
        }
        return [{ value: filters[filterKey] || "ALL", label: t("filter.all") }];
    }

    function getFilterLabel(filterKey) {
        const value = GameState.marketView.filters[filterKey];
        const option = getMarketFilterOptions(filterKey).find((item) => item.value === value);
        return option?.label || t("filter.all");
    }

    function getMarketSortOptions() {
        return ["overall", "potential", "age", "value", "salary", "name", "club", "nationality"].map((value) => ({
            value,
            label: t(`sort.${value}`)
        }));
    }

    function getVisibleMarketPlayers() {
        const view = GameState.marketView;
        const filters = view.filters;
        const query = (view.search || "").trim().toLocaleLowerCase();
        return [...GameState.market].filter((player) => {
            const overall = calculateCurrentOverall(player);
            const age = calculateAge(player, GameState.currentYear);
            if (query && !player.name.toLocaleLowerCase().includes(query)) return false;
            if (filters.position !== "ALL" && player.primaryPosition !== filters.position) return false;
            if (!getRangeMatch(age, filters.age, "age")) return false;
            if (!getRangeMatch(overall, filters.overall, "rating")) return false;
            if (!getRangeMatch(player.potential || overall, filters.potential, "rating")) return false;
            if (filters.nationality !== "ALL" && player.country !== filters.nationality) return false;
            if (!getRangeMatch(player.marketValue || 0, filters.value, "money")) return false;
            if (!getRangeMatch(player.salary || 0, filters.salary, "money")) return false;
            if (filters.contract !== "ALL" && getContractStatus(player) !== filters.contract) return false;
            if (filters.club !== "ALL" && getPlayerCurrentClub(player) !== filters.club) return false;
            if (filters.phase !== "ALL" && player.careerPhase !== filters.phase) return false;
            return true;
        }).sort((a, b) => {
            const sort = view.sort;
            if (sort === "potential") return (b.potential || 0) - (a.potential || 0);
            if (sort === "age") return calculateAge(a, GameState.currentYear) - calculateAge(b, GameState.currentYear);
            if (sort === "value") return (b.marketValue || 0) - (a.marketValue || 0);
            if (sort === "salary") return (b.salary || 0) - (a.salary || 0);
            if (sort === "name") return a.name.localeCompare(b.name);
            if (sort === "club") return getPlayerCurrentClub(a).localeCompare(getPlayerCurrentClub(b));
            if (sort === "nationality") return translateCountry(a.country).localeCompare(translateCountry(b.country));
            return calculateCurrentOverall(b) - calculateCurrentOverall(a);
        });
    }

    function showChoiceModal(title, options, onSelect) {
        const root = document.getElementById("modal-root");
        root.innerHTML = `
            <div class="market-modal-overlay" role="dialog" aria-modal="true">
                <section class="market-modal">
                    <div class="row-main">
                        <h2>${escapeHtml(title)}</h2>
                        <button class="icon-action" type="button" data-close-market-modal>${escapeHtml(t("market.close"))}</button>
                    </div>
                    <div class="market-modal-options">
                        ${options.map((option) => `
                            <button class="market-choice" type="button" data-choice-value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</button>
                        `).join("")}
                    </div>
                </section>
            </div>
        `;
        root.querySelector("[data-close-market-modal]").addEventListener("click", closeMarketModal);
        root.querySelectorAll("[data-choice-value]").forEach((button) => {
            button.addEventListener("click", () => {
                onSelect(button.dataset.choiceValue);
                closeMarketModal();
            });
        });
    }

    function closeMarketModal() {
        const root = document.getElementById("modal-root");
        if (root) root.innerHTML = "";
    }

    function openMarketFilter(filterKey) {
        showChoiceModal(t(`filter.${filterKey}`), getMarketFilterOptions(filterKey), (value) => {
            GameState.marketView.filters[filterKey] = value;
            saveCareer();
            renderMarket();
        });
    }

    function openMarketSort() {
        showChoiceModal(t("market.sort"), getMarketSortOptions(), (value) => {
            GameState.marketView.sort = value;
            saveCareer();
            renderMarket();
        });
    }

    function clearMarketFilters() {
        GameState.marketView = { ...GameState.marketView, ...createDefaultMarketView(), search: "" };
        saveCareer();
        renderMarket();
    }

    function analyzeTransferProposal(player, offerValue) {
        const buyerReputation = GameState.club?.reputation || 70;
        const importance = ((player.reputation || 60) + calculateCurrentOverall(player) + (player.potential || 60)) / 3;
        const age = calculateAge(player, GameState.currentYear);
        const morale = player.morale || 70;
        const years = player.contract?.yearsRemaining || 1;
        const sellerClub = GameState.league.clubs.find((club) => club.name === getPlayerCurrentClub(player)) || GameState.club;
        const financialPressure = sellerClub?.budget < (player.marketValue || 0) * 2 ? 10 : 0;
        const phase = player.careerPhase || getCareerPhase(player, GameState.currentYear);
        const phasePressure = ["Experiente", "Declínio"].includes(phase) ? 8 : phase === "Jovem promessa" ? -8 : 0;
        const askingPrice = Math.round((player.marketValue || 0) * (1.05 + importance / 240 + years * 0.035 - financialPressure / 100 - phasePressure / 100));
        const score = (offerValue / Math.max(1, askingPrice)) * 100 + (buyerReputation - 70) * 0.3 + (100 - morale) * 0.08 + financialPressure + phasePressure - years * 1.5;
        if (score >= 102) return { result: "accepted", price: offerValue };
        if (score >= 78) return { result: "counter", price: Math.max(offerValue, askingPrice) };
        return { result: "rejected", price: askingPrice };
    }

    function makeTransferOffer(playerId) {
        ensureTransferMarketState();
        const player = GameState.market.find((item) => item.id === playerId);
        if (!player) return;
        const previous = GameState.transferMarket.negotiations[playerId];
        const offerValue = previous?.counterValue || Math.round((player.marketValue || 0) * 1.03);
        const response = analyzeTransferProposal(player, offerValue);
        GameState.transferMarket.negotiations[playerId] = {
            status: response.result,
            offerValue,
            counterValue: response.result === "counter" ? response.price : null,
            salaryDemand: previous?.salaryDemand || player.salary,
            contractDemand: previous?.contractDemand || player.contract?.yearsRemaining || 2,
            updatedAt: new Date().toISOString()
        };
        if (response.result === "accepted") {
            saveCareer();
            buyPlayer(playerId, response.price);
            return;
        }
        saveCareer();
        renderMarket();
        showToast(response.result === "counter" ? t("market.counterOffer") : t("market.offerRejected"));
    }

    function negotiateMarketSalary(playerId) {
        ensureTransferMarketState();
        const player = GameState.market.find((item) => item.id === playerId);
        if (!player) return;
        const negotiation = GameState.transferMarket.negotiations[playerId] || {};
        const demand = Math.round((negotiation.salaryDemand || player.salary) * 1.08);
        GameState.transferMarket.negotiations[playerId] = { ...negotiation, status: negotiation.status || "salary", salaryDemand: demand, updatedAt: new Date().toISOString() };
        saveCareer();
        renderMarket();
        showToast(t("market.salaryAdjusted"));
    }

    function negotiateMarketContract(playerId) {
        ensureTransferMarketState();
        const player = GameState.market.find((item) => item.id === playerId);
        if (!player) return;
        const negotiation = GameState.transferMarket.negotiations[playerId] || {};
        const demand = clamp((negotiation.contractDemand || player.contract?.yearsRemaining || 2) + 1, 1, 5);
        GameState.transferMarket.negotiations[playerId] = { ...negotiation, status: negotiation.status || "contract", contractDemand: demand, updatedAt: new Date().toISOString() };
        saveCareer();
        renderMarket();
        showToast(t("market.contractAdjusted"));
    }

    function cancelMarketNegotiation(playerId) {
        ensureTransferMarketState();
        delete GameState.transferMarket.negotiations[playerId];
        saveCareer();
        renderMarket();
        showToast(t("market.negotiationCancelled"));
    }

    function renderMarketNegotiation(player) {
        const negotiation = GameState.transferMarket.negotiations[player.id];
        if (!negotiation) return `<div class="market-negotiation"><span>${escapeHtml(t("market.negotiationStatus"))}</span><strong>${escapeHtml(t("market.noNegotiation"))}</strong></div>`;
        const statusKey = negotiation.status === "accepted" ? "market.offerAccepted" : negotiation.status === "counter" ? "market.counterOffer" : negotiation.status === "rejected" ? "market.offerRejected" : "market.negotiationStatus";
        return `
            <div class="market-negotiation">
                <span>${escapeHtml(t("market.negotiationStatus"))}</span>
                <strong>${escapeHtml(t(statusKey))}</strong>
                <small>${escapeHtml(t("market.offerValue"))}: ${money(negotiation.offerValue)}</small>
                ${negotiation.counterValue ? `<small>${escapeHtml(t("market.counterValue"))}: ${money(negotiation.counterValue)}</small>` : ""}
                ${negotiation.salaryDemand ? `<small>${escapeHtml(t("market.salaryDemand"))}: ${money(negotiation.salaryDemand)}</small>` : ""}
                ${negotiation.contractDemand ? `<small>${escapeHtml(t("market.contractDemand"))}: ${negotiation.contractDemand}</small>` : ""}
            </div>
        `;
    }

    function renderMarketPlayerCard(player) {
        const age = calculateAge(player, GameState.currentYear);
        const overall = calculateCurrentOverall(player);
        const observed = GameState.transferMarket.observedPlayerIds.includes(player.id);
        const favorite = isMarketFavorite(player.id);
        const contractStatus = getContractStatus(player);
        return `
            <article class="market-player-card">
                <button class="market-card-main" type="button" data-market-detail="${player.id}">
                    <div class="market-avatar" aria-hidden="true"><i></i><b></b></div>
                    <div class="market-player-summary">
                        <div class="row-main">
                            <strong>${escapeHtml(player.name)}</strong>
                            <span class="overall-badge">${overall}</span>
                        </div>
                        <div class="meta">
                            <span>${escapeHtml(getPlayerCurrentClub(player))}</span>
                            <span>${escapeHtml(translateCountry(player.country))}</span>
                            <span>${age} ${escapeHtml(t("market.years"))}</span>
                            <span>${escapeHtml(translatePosition(player.primaryPosition))}</span>
                        </div>
                    </div>
                </button>
                <div class="market-facts">
                    <div class="stat"><span>${escapeHtml(t("market.potential"))}</span><strong>${player.potential}</strong></div>
                    <div class="stat"><span>${escapeHtml(t("market.value"))}</span><strong>${money(player.marketValue)}</strong></div>
                    <div class="stat"><span>${escapeHtml(t("market.salary"))}</span><strong>${money(player.salary)}</strong></div>
                    <div class="stat"><span>${escapeHtml(t("market.contractTime"))}</span><strong>${player.contract?.yearsRemaining || 0}</strong></div>
                    <div class="stat"><span>${escapeHtml(t("market.contractStatus"))}</span><strong>${escapeHtml(t(`contract.${contractStatus}`))}</strong></div>
                    <div class="stat"><span>${escapeHtml(t("market.careerPhase"))}</span><strong>${escapeHtml(translateCareerPhase(player.careerPhase))}</strong></div>
                    <div class="stat"><span>${escapeHtml(t("market.morale"))}</span><strong>${player.morale}</strong></div>
                    <div class="stat"><span>${escapeHtml(t("market.fitness"))}</span><strong>${player.fitness}</strong></div>
                </div>
                ${renderMarketNegotiation(player)}
                <div class="market-actions">
                    <button class="btn" type="button" data-observe-player="${player.id}">${escapeHtml(t(observed ? "market.watched" : "market.watch"))}</button>
                    <button class="btn btn-primary" type="button" data-offer-player="${player.id}">${escapeHtml(t("market.makeOffer"))}</button>
                    <button class="btn" type="button" data-salary-player="${player.id}">${escapeHtml(t("market.negotiateSalary"))}</button>
                    <button class="btn" type="button" data-contract-player="${player.id}">${escapeHtml(t("market.negotiateContract"))}</button>
                    <button class="btn" type="button" data-favorite-player="${player.id}">${escapeHtml(t(favorite ? "market.removeFavorite" : "market.addFavorite"))}</button>
                    <button class="btn btn-ghost" type="button" data-cancel-negotiation="${player.id}">${escapeHtml(t("market.cancelNegotiation"))}</button>
                </div>
            </article>
        `;
    }

    function renderMarketPlayerDetail(player) {
        const secondary = player.secondaryPositions?.length ? player.secondaryPositions.map(translatePosition).join(", ") : t("market.none");
        return `
            <section class="screen stack market-detail-screen internal-screen">
                ${renderInternalHero(t("market.details"), player.name, "MRK")}
                <button class="btn btn-ghost" type="button" id="market-back">${escapeHtml(t("market.back"))}</button>
                <div class="market-detail-hero card card-pad">
                    <div class="market-avatar large" aria-hidden="true"><i></i><b></b></div>
                    <div class="stack">
                        <span class="menu-kicker">${escapeHtml(t("market.details"))}</span>
                        <h1>${escapeHtml(player.name)}</h1>
                        <div class="meta">
                            <span>${escapeHtml(getPlayerCurrentClub(player))}</span>
                            <span>${escapeHtml(translateCountry(player.country))}</span>
                            <span>${calculateAge(player, GameState.currentYear)} ${escapeHtml(t("market.years"))}</span>
                        </div>
                    </div>
                </div>
                <div class="stat-grid">
                    <div class="stat"><span>${escapeHtml(t("market.primaryPosition"))}</span><strong>${escapeHtml(translatePosition(player.primaryPosition))}</strong></div>
                    <div class="stat"><span>${escapeHtml(t("market.secondaryPositions"))}</span><strong>${escapeHtml(secondary)}</strong></div>
                    <div class="stat"><span>${escapeHtml(t("market.overall"))}</span><strong>${calculateCurrentOverall(player)}</strong></div>
                    <div class="stat"><span>${escapeHtml(t("market.potential"))}</span><strong>${player.potential}</strong></div>
                    <div class="stat"><span>${escapeHtml(t("market.value"))}</span><strong>${money(player.marketValue)}</strong></div>
                    <div class="stat"><span>${escapeHtml(t("market.salary"))}</span><strong>${money(player.salary)}</strong></div>
                    <div class="stat"><span>${escapeHtml(t("market.currentClub"))}</span><strong>${escapeHtml(getPlayerCurrentClub(player))}</strong></div>
                    <div class="stat"><span>${escapeHtml(t("market.contractTime"))}</span><strong>${player.contract?.yearsRemaining || 0}</strong></div>
                </div>
                <div class="card card-pad stack">
                    <h2>${escapeHtml(t("market.attributes"))}</h2>
                    <div class="attribute-grid">
                        ${PLAYER_ATTRIBUTES.map((attribute) => renderAttributeMeter(t(`attribute.${attribute}`), player.attributes?.[attribute] || 1)).join("")}
                    </div>
                </div>
                <div class="card card-pad stack">
                    <h2>${escapeHtml(t("market.careerEvolution"))}</h2>
                    <div class="mini-bars">
                        ${renderAttributeMeter(t("market.overall"), calculateCurrentOverall(player))}
                        ${renderAttributeMeter(t("market.potential"), player.potential)}
                        ${renderAttributeMeter(t("market.morale"), player.morale)}
                        ${renderAttributeMeter(t("market.fitness"), player.fitness)}
                    </div>
                </div>
                <div class="card card-pad stack">
                    <h2>${escapeHtml(t("market.history"))}</h2>
                    <div class="stat-grid">
                        <div class="stat"><span>${escapeHtml(t("market.careerPhase"))}</span><strong>${escapeHtml(translateCareerPhase(player.careerPhase))}</strong></div>
                        <div class="stat"><span>${escapeHtml(t("market.contractStatus"))}</span><strong>${escapeHtml(t(`contract.${getContractStatus(player)}`))}</strong></div>
                    </div>
                    ${renderMarketNegotiation(player)}
                    <div class="market-actions">
                        <button class="btn" type="button" data-observe-player="${player.id}">${escapeHtml(t(GameState.transferMarket.observedPlayerIds.includes(player.id) ? "market.watched" : "market.watch"))}</button>
                        <button class="btn btn-primary" type="button" data-offer-player="${player.id}">${escapeHtml(t("market.makeOffer"))}</button>
                        <button class="btn" type="button" data-salary-player="${player.id}">${escapeHtml(t("market.negotiateSalary"))}</button>
                        <button class="btn" type="button" data-contract-player="${player.id}">${escapeHtml(t("market.negotiateContract"))}</button>
                        <button class="btn" type="button" data-favorite-player="${player.id}">${escapeHtml(t(isMarketFavorite(player.id) ? "market.removeFavorite" : "market.addFavorite"))}</button>
                        <button class="btn btn-ghost" type="button" data-cancel-negotiation="${player.id}">${escapeHtml(t("market.cancelNegotiation"))}</button>
                    </div>
                </div>
            </section>
        `;
    }

    function renderMarket() {
        refreshAllPlayers();
        ensureTransferMarketState();
        const detailPlayer = GameState.marketView.detailPlayerId ? GameState.market.find((player) => player.id === GameState.marketView.detailPlayerId) : null;
        if (detailPlayer) {
            document.getElementById("screen-root").innerHTML = renderMarketPlayerDetail(detailPlayer);
            bindMarketEvents();
            document.getElementById("market-back")?.addEventListener("click", () => { GameState.marketView.detailPlayerId = null; saveCareer(); renderMarket(); });
            updateChrome();
            return;
        }
        const players = getVisibleMarketPlayers().slice(0, 18);
        const favorites = getMarketFavorites().map((id) => GameState.market.find((player) => player.id === id)).filter(Boolean);
        const filterKeys = ["position", "age", "overall", "potential", "nationality", "value", "salary", "contract", "club", "phase"];
        const hasFilters = filterKeys.some((key) => GameState.marketView.filters[key] && GameState.marketView.filters[key] !== "ALL" && GameState.marketView.filters[key] !== "any");
        document.getElementById("screen-root").innerHTML = `
            <section class="screen eg3-market">
                <header class="eg3-list-topbar">
                    <div class="eg3-searchbar"><span>🔍</span><input id="market-search" type="search" value="${escapeHtml(GameState.marketView.search)}" placeholder="${escapeHtml(t("market.searchPlaceholder"))}"></div>
                    <button class="eg3-filter-trigger ${hasFilters ? "has-filters" : ""}" id="market-filters-open" type="button">Filtros${hasFilters ? " •" : ""}</button>
                </header>
                <div class="eg3-chip-row">
                    ${["ST", "CAM", "CM", "CB", "GK"].map((position) => `<button class="chip-pos ${GameState.marketView.filters.position === position ? "active" : ""}" type="button" data-market-pos="${position}">${escapeHtml(translatePosition(position))}</button>`).join("")}
                    <button class="chip-pos ${GameState.marketView.sort === "potential" ? "active" : ""}" type="button" data-market-sort-fast="potential">Potencial</button>
                    <button class="chip-pos ${favorites.length ? "active" : ""}" type="button" data-director-action="scout">Observados ${favorites.length}</button>
                    ${(hasFilters || GameState.marketView.search) ? `<button class="chip-pos eg3-clear-chip" id="market-clear-filters" type="button">Limpar</button>` : ""}
                </div>
                <div class="eg3-market-meta"><span>Saldo disponível</span><strong>${money(GameState.budget)}</strong></div>
                <div class="eg3-card-list eg3-market-list">
                    ${players.map((player) => {
                        const overall = calculateCurrentOverall(player);
                        const observed = GameState.transferMarket.observedPlayerIds.includes(player.id);
                        return `
                            <article class="eg3-person-card eg3-market-card">
                                <div class="eg3-person-avatar">${escapeHtml(player.primaryPosition)}</div>
                                <div class="eg3-person-main">
                                    <strong>${escapeHtml(player.name)}</strong>
                                    <span>${escapeHtml(translatePosition(player.primaryPosition))} · ${calculateAge(player, GameState.currentYear)} anos · ${escapeHtml(getPlayerCurrentClub(player))}</span>
                                    <p>OVR ${overall} · POT ${player.potential} · ${money(player.marketValue)}</p>
                                </div>
                                <div class="eg3-person-side market-actions">
                                    <button type="button" data-observe-player="${player.id}">${observed ? "Observado" : "Observar"}</button>
                                    <button type="button" data-offer-player="${player.id}">Negociar</button>
                                    <button type="button" data-market-detail="${player.id}">Perfil</button>
                                </div>
                            </article>
                        `;
                    }).join("") || `<div class="empty-state">${escapeHtml(t("market.noPlayers"))}</div>`}
                </div>
                <div class="eg3-filter-sheet hidden" id="market-filter-sheet" aria-hidden="true">
                    <div class="eg3-filter-backdrop" data-close-market-filters></div>
                    <section class="eg3-filter-panel">
                        <div class="eg3-filter-head"><strong>Filtros do mercado</strong><button class="icon-action" type="button" data-close-market-filters>×</button></div>
                        <div class="market-filter-grid">
                            ${filterKeys.map((key) => `
                                <label class="field"><span>${escapeHtml(t(`filter.${key}`))}</span><select data-market-filter-select="${key}">
                                    ${getMarketFilterOptions(key).map((option) => `<option value="${escapeHtml(option.value)}" ${GameState.marketView.filters[key] === option.value ? "selected" : ""}>${escapeHtml(option.label)}</option>`).join("")}
                                </select></label>
                            `).join("")}
                            <label class="field"><span>${escapeHtml(t("market.sort"))}</span><select id="market-sort-select">${getMarketSortOptions().map((option) => `<option value="${escapeHtml(option.value)}" ${GameState.marketView.sort === option.value ? "selected" : ""}>${escapeHtml(option.label)}</option>`).join("")}</select></label>
                        </div>
                        <div class="button-row"><button class="btn" type="button" id="market-apply-filters">Aplicar</button></div>
                    </section>
                </div>
            </section>
        `;
        document.getElementById("market-search")?.addEventListener("input", (event) => { GameState.marketView.search = event.target.value; renderMarket(); });
        document.querySelectorAll("[data-market-pos]").forEach((button) => button.addEventListener("click", () => { GameState.marketView.filters.position = GameState.marketView.filters.position === button.dataset.marketPos ? "ALL" : button.dataset.marketPos; saveCareer(); renderMarket(); }));
        document.querySelectorAll("[data-market-sort-fast]").forEach((button) => button.addEventListener("click", () => { GameState.marketView.sort = button.dataset.marketSortFast; saveCareer(); renderMarket(); }));
        document.getElementById("market-clear-filters")?.addEventListener("click", clearMarketFilters);
        document.getElementById("market-filters-open")?.addEventListener("click", () => document.getElementById("market-filter-sheet")?.classList.remove("hidden"));
        document.querySelectorAll("[data-close-market-filters]").forEach((el) => el.addEventListener("click", () => document.getElementById("market-filter-sheet")?.classList.add("hidden")));
        document.querySelectorAll("[data-market-filter-select]").forEach((select) => select.addEventListener("change", () => { GameState.marketView.filters[select.dataset.marketFilterSelect] = select.value; }));
        document.getElementById("market-sort-select")?.addEventListener("change", (event) => { GameState.marketView.sort = event.target.value; });
        document.getElementById("market-apply-filters")?.addEventListener("click", () => { saveCareer(); renderMarket(); });
        document.querySelectorAll("[data-director-action]").forEach((button) => button.addEventListener("click", () => handleDirectorAction(button.dataset.directorAction)));
        bindMarketEvents();
        updateChrome();
    }

    function bindMarketEvents() {
        document.querySelectorAll("[data-market-detail]").forEach((button) => {
            button.addEventListener("click", () => {
                GameState.marketView.detailPlayerId = button.dataset.marketDetail;
                saveCareer();
                renderMarket();
            });
        });
        document.querySelectorAll("[data-observe-player]").forEach((button) => {
            button.addEventListener("click", () => toggleObservedPlayer(button.dataset.observePlayer));
        });
        document.querySelectorAll("[data-offer-player]").forEach((button) => {
            button.addEventListener("click", () => makeTransferOffer(button.dataset.offerPlayer));
        });
        document.querySelectorAll("[data-salary-player]").forEach((button) => {
            button.addEventListener("click", () => negotiateMarketSalary(button.dataset.salaryPlayer));
        });
        document.querySelectorAll("[data-contract-player]").forEach((button) => {
            button.addEventListener("click", () => negotiateMarketContract(button.dataset.contractPlayer));
        });
        document.querySelectorAll("[data-favorite-player]").forEach((button) => {
            button.addEventListener("click", () => toggleMarketFavorite(button.dataset.favoritePlayer));
        });
        document.querySelectorAll("[data-cancel-negotiation]").forEach((button) => {
            button.addEventListener("click", () => cancelMarketNegotiation(button.dataset.cancelNegotiation));
        });
    }

    function renderScoutKnownData(player, assignment) {
        const stage = getScoutKnowledgeStage(assignment);
        const rows = [
            ["scout.name", player.name, 1],
            ["scout.club", getPlayerCurrentClub(player), 1],
            ["scout.age", `${calculateAge(player, GameState.currentYear)} ${t("market.years")}`, 1],
            ["scout.nationality", translateCountry(player.country), 1],
            ["scout.overallApprox", getScoutApproxValue(calculateCurrentOverall(player)), 2],
            ["scout.potentialApprox", getScoutApproxValue(player.potential || calculateCurrentOverall(player)), 3],
            ["scout.morale", player.morale, 4],
            ["scout.fitness", player.fitness, 4],
            ["scout.secondaryPositions", player.secondaryPositions?.length ? player.secondaryPositions.map(translatePosition).join(", ") : t("market.none"), 4]
        ];
        return rows.map(([labelKey, value, requiredStage]) => `
            <div class="stat ${stage < requiredStage ? "scout-hidden" : ""}">
                <span>${escapeHtml(t(labelKey))}</span>
                <strong>${stage >= requiredStage ? escapeHtml(value) : escapeHtml(t("scout.hiddenData"))}</strong>
            </div>
        `).join("");
    }

    function renderScoutAssignment(player, assignment) {
        const progress = Math.round(((assignment.weeksObserved || 1) / (assignment.requiredWeeks || getScoutRequiredWeeks())) * 100);
        const stage = getScoutKnowledgeStage(assignment);
        return `
            <article class="scout-card card card-pad stack">
                <div class="row-main">
                    <div>
                        <span class="menu-kicker">${escapeHtml(t(assignment.completed ? "scout.completed" : "scout.active"))}</span>
                        <h2>${escapeHtml(stage >= 1 ? player.name : t("scout.hiddenData"))}</h2>
                    </div>
                    <span class="overall-badge">${assignment.weeksObserved || 1}/${assignment.requiredWeeks || getScoutRequiredWeeks()}</span>
                </div>
                <div class="scout-progress">
                    <div class="row-main"><span>${escapeHtml(t("scout.progress"))}</span><strong>${progress}%</strong></div>
                    <i><b style="width:${progress}%"></b></i>
                </div>
                <div class="stat-grid scout-known-grid">
                    ${renderScoutKnownData(player, assignment)}
                </div>
                <div class="scout-report">
                    <span>${escapeHtml(t(stage >= 4 ? "scout.completeReport" : "scout.report"))}</span>
                    <p>${escapeHtml(assignment.reportText || t("scout.reportPending"))}</p>
                </div>
                <button class="btn btn-ghost" type="button" data-scout-remove="${player.id}">${escapeHtml(t("scout.remove"))}</button>
            </article>
        `;
    }

    function getScoutSearchResults() {
        const search = ensureScoutState().search || createDefaultScoutState().search;
        return GameState.market.filter((player) => {
            const age = calculateAge(player, GameState.currentYear);
            const overall = calculateCurrentOverall(player);
            if (search.position !== "ALL" && player.primaryPosition !== search.position && !player.secondaryPositions.includes(search.position)) return false;
            if (search.nationality !== "ALL" && player.country !== search.nationality) return false;
            if (!getRangeMatch(age, search.age, "age")) return false;
            if (!getRangeMatch(overall, search.overall, "overall")) return false;
            if (!getRangeMatch(player.potential, search.potential, "potential")) return false;
            if (!getRangeMatch(player.marketValue, search.value, "value")) return false;
            return true;
        }).sort((a, b) => (b.potential + calculateCurrentOverall(b)) - (a.potential + calculateCurrentOverall(a))).slice(0, 8);
    }

    function buildScoutCardNote(player) {
        const overall = calculateCurrentOverall(player);
        const potentialGap = (player.potential || overall) - overall;
        if (potentialGap >= 10) return "Promessa crua: o teto chama atencao, mas ainda precisa de acompanhamento.";
        if ((player.attributes?.physical || 0) >= 78) return "Fisicamente pronto para competir; pode ganhar espaco rapido.";
        if ((player.morale || 0) <= 45) return "Talento sob pressao: observar mentalidade antes de abrir negociacao.";
        if (overall >= 80) return "Jogador de impacto imediato; relatorio deve focar custo e encaixe.";
        return "Perfil de rotacao: util se o preco encaixar no planejamento.";
    }

    function renderScout() {
        refreshAllPlayers();
        ensureScoutState();
        const search = GameState.scout.search || createDefaultScoutState().search;
        const keyword = search.keyword || "";
        const assignments = Object.values(GameState.scout.assignments)
            .map((assignment) => ({ assignment, player: GameState.market.find((item) => item.id === assignment.playerId) }))
            .filter((item) => item.player);
        const latestReport = getLatestScoutReport();
        const nationalities = [...new Set(GameState.market.map((player) => player.country))].sort();
        let results = getScoutSearchResults().filter((player) => !keyword || player.name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase())).slice(0, 12);
        const filterKeys = ["age", "position", "overall", "potential", "nationality", "value"];
        const hasAdvancedFilters = filterKeys.some((key) => search[key] && search[key] !== "ALL" && search[key] !== "any");

        document.getElementById("screen-root").innerHTML = `
            <section class="screen eg3-scout" aria-label="Scout">
                <header class="eg3-list-topbar">
                    <div class="eg3-searchbar"><span>🔍</span><input id="scout-search-name" type="search" value="${escapeHtml(keyword)}" placeholder="Buscar jogador..."></div>
                    <button class="eg3-filter-trigger ${hasAdvancedFilters ? "has-filters" : ""}" type="button" id="scout-filter-toggle">Filtros${hasAdvancedFilters ? " •" : ""}</button>
                </header>
                <div class="eg3-chip-row" aria-label="Filtros rápidos">
                    ${["ST", "CF", "CAM", "CM", "CB", "GK"].map((pos) => `<button class="chip-pos ${search.position === pos ? "active" : ""}" type="button" data-scout-chip="${pos}">${escapeHtml(translatePosition(pos))}</button>`).join("")}
                    <button class="chip-pos ${search.potential === "o88" ? "active" : ""}" type="button" data-scout-potential="o88">★★★★★</button>
                    <button class="chip-pos ${search.age === "u21" ? "active" : ""}" type="button" data-scout-age="u21">Jovem</button>
                    ${(hasAdvancedFilters || keyword) ? `<button class="chip-pos eg3-clear-chip" type="button" id="scout-clear-filters">Limpar</button>` : ""}
                </div>
                <div class="eg3-scout-summary">
                    <strong>${results.length}</strong><span>nomes recomendados</span>
                    <em>${latestReport ? `${escapeHtml(latestReport.playerName)} foi o último relatório` : escapeHtml(t("scout.noReport"))}</em>
                </div>
                <div class="eg3-card-list eg3-scout-list">
                    ${results.map((player) => `
                        <article class="eg3-person-card eg3-scout-card" data-drawer-player="${player.id}">
                            <div class="eg3-person-avatar">⚽</div>
                            <div class="eg3-person-main">
                                <strong>${escapeHtml(player.name)}</strong>
                                <span>${escapeHtml(translatePosition(player.primaryPosition))} · ${calculateAge(player, GameState.currentYear)} anos · ${escapeHtml(translateCountry(player.country))}</span>
                                <p>${escapeHtml(buildScoutCardNote(player))}</p>
                            </div>
                            <div class="eg3-person-side">
                                <small>POT</small>
                                <b>${player.potential}</b>
                                <em>${money(player.marketValue)}</em>
                                <button type="button" data-scout-add-result="${player.id}">${GameState.scout.assignments[player.id] ? "Em obs." : "Observar"}</button>
                            </div>
                        </article>
                    `).join("") || `<div class="empty-state">Nenhum jogador encontrado.</div>`}
                </div>
                <details class="eg3-accordion eg3-observed-panel">
                    <summary><span>Relatórios em andamento</span><strong>${assignments.length}/${getScoutCapacity()}</strong></summary>
                    <div class="eg3-observed-list">
                        ${assignments.length ? assignments.map(({ player, assignment }) => renderScoutAssignment(player, assignment)).join("") : `<div class="empty-state">${escapeHtml(t("scout.noObserved"))}</div>`}
                    </div>
                </details>
                <div class="eg3-filter-sheet hidden" id="scout-filter-sheet" aria-hidden="true">
                    <div class="eg3-filter-backdrop" data-close-scout-filters></div>
                    <section class="eg3-filter-panel">
                        <div class="eg3-filter-head"><strong>Filtros avançados</strong><button class="icon-action" type="button" data-close-scout-filters>×</button></div>
                        <div class="market-filter-grid scout-filter-grid">
                            <label class="field"><span>Idade</span><select data-scout-search="age">${getMarketFilterOptions("age").map((option) => `<option value="${option.value}" ${search.age === option.value ? "selected" : ""}>${escapeHtml(option.label)}</option>`).join("")}</select></label>
                            <label class="field"><span>Posição</span><select data-scout-search="position"><option value="ALL">Todas</option>${PLAYER_POSITIONS.map((position) => `<option value="${position}" ${search.position === position ? "selected" : ""}>${escapeHtml(translatePosition(position))}</option>`).join("")}</select></label>
                            <label class="field"><span>Overall</span><select data-scout-search="overall">${getMarketFilterOptions("overall").map((option) => `<option value="${option.value}" ${search.overall === option.value ? "selected" : ""}>${escapeHtml(option.label)}</option>`).join("")}</select></label>
                            <label class="field"><span>Potencial</span><select data-scout-search="potential">${getMarketFilterOptions("potential").map((option) => `<option value="${option.value}" ${search.potential === option.value ? "selected" : ""}>${escapeHtml(option.label)}</option>`).join("")}</select></label>
                            <label class="field"><span>Nacionalidade</span><select data-scout-search="nationality"><option value="ALL">Todas</option>${nationalities.map((country) => `<option value="${country}" ${search.nationality === country ? "selected" : ""}>${escapeHtml(translateCountry(country))}</option>`).join("")}</select></label>
                            <label class="field"><span>Valor</span><select data-scout-search="value">${getMarketFilterOptions("value").map((option) => `<option value="${option.value}" ${search.value === option.value ? "selected" : ""}>${escapeHtml(option.label)}</option>`).join("")}</select></label>
                        </div>
                        <div class="button-row"><button class="btn" type="button" id="scout-apply-filters">Aplicar</button></div>
                    </section>
                </div>
            </section>
        `;
        document.getElementById("scout-search-name")?.addEventListener("input", (event) => {
            GameState.scout.search.keyword = event.target.value;
            renderScout();
        });
        document.querySelectorAll("[data-scout-chip]").forEach((button) => button.addEventListener("click", () => {
            GameState.scout.search.position = GameState.scout.search.position === button.dataset.scoutChip ? "ALL" : button.dataset.scoutChip;
            saveCareer();
            renderScout();
        }));
        document.querySelectorAll("[data-scout-potential]").forEach((button) => button.addEventListener("click", () => {
            GameState.scout.search.potential = GameState.scout.search.potential === button.dataset.scoutPotential ? "any" : button.dataset.scoutPotential;
            saveCareer();
            renderScout();
        }));
        document.querySelectorAll("[data-scout-age]").forEach((button) => button.addEventListener("click", () => {
            GameState.scout.search.age = GameState.scout.search.age === button.dataset.scoutAge ? "any" : button.dataset.scoutAge;
            saveCareer();
            renderScout();
        }));
        document.getElementById("scout-clear-filters")?.addEventListener("click", () => {
            GameState.scout.search = createDefaultScoutState().search;
            saveCareer();
            renderScout();
        });
        document.getElementById("scout-filter-toggle")?.addEventListener("click", () => {
            document.getElementById("scout-filter-sheet")?.classList.remove("hidden");
        });
        document.querySelectorAll("[data-close-scout-filters]").forEach((el) => el.addEventListener("click", () => document.getElementById("scout-filter-sheet")?.classList.add("hidden")));
        document.querySelectorAll("[data-scout-search]").forEach((select) => {
            select.addEventListener("change", () => { GameState.scout.search[select.dataset.scoutSearch] = select.value; });
        });
        document.getElementById("scout-apply-filters")?.addEventListener("click", () => { saveCareer(); renderScout(); });
        document.querySelectorAll("[data-drawer-player]").forEach((card) => {
            card.addEventListener("click", (event) => {
                if (event.target.closest("button")) return;
                const player = [...GameState.squad, ...GameState.market].find((item) => item.id === card.dataset.drawerPlayer);
                openUIDrawer(renderPlayerDrawerContent(player), player?.name || "Relatório");
            });
        });
        document.querySelectorAll("[data-scout-add-result]").forEach((button) => {
            button.addEventListener("click", (event) => {
                event.stopPropagation();
                button.classList.add("is-loading");
                button.textContent = "Observando...";
                const ok = startScoutObservation(button.dataset.scoutAddResult);
                if (ok !== false) setTimeout(() => renderScout(), 350); else button.classList.remove("is-loading");
            });
        });
        document.querySelectorAll("[data-scout-remove]").forEach((button) => button.addEventListener("click", () => removeScoutObservation(button.dataset.scoutRemove)));
        updateChrome();
    }

    function renderStaff() {
        const staff = ensureStaffState();
        const effects = getStaffEffect();
        const weeklyCost = staff.members.reduce((sum, member) => sum + (member.salary || 0), 0);
        document.getElementById("screen-root").innerHTML = `
            <section class="screen stack internal-screen staff-screen">
                ${renderInternalHero("Staff", "Comissão técnica, diretoria e especialistas com efeitos reais na carreira.", "STF")}
                <div class="card card-pad stack internal-panel">
                    <div class="stat-grid">
                        <div class="stat"><span>Custo semanal</span><strong>${money(weeklyCost)}</strong></div>
                        <div class="stat"><span>Tático</span><strong>${Math.round(effects.tactical)}</strong></div>
                        <div class="stat"><span>Técnico</span><strong>${Math.round(effects.technical)}</strong></div>
                        <div class="stat"><span>Médico</span><strong>${Math.round(effects.medical)}</strong></div>
                        <div class="stat"><span>Scout</span><strong>${Math.round(effects.scout)}</strong></div>
                        <div class="stat"><span>Negociação</span><strong>${Math.round(effects.negotiation)}</strong></div>
                    </div>
                    <div class="staff-grid">
                        ${staff.members.map((member) => `
                            <article class="manager-panel">
                                <div class="manager-panel-head"><span>${escapeHtml(member.role)}</span><strong>Nível ${member.level}</strong></div>
                                <h2>${escapeHtml(member.name)}</h2>
                                <div class="stat-grid compact">
                                    <div class="stat"><span>Salário</span><strong>${money(member.salary)}</strong></div>
                                    <div class="stat"><span>Especialidade</span><strong>${escapeHtml(member.specialty)}</strong></div>
                                    <div class="stat"><span>Experiência</span><strong>${member.experience}</strong></div>
                                    <div class="stat"><span>Contrato</span><strong>${member.contract.yearsRemaining}a</strong></div>
                                </div>
                                <button class="btn" type="button" data-staff-renew="${member.id}">Renovar / melhorar</button>
                            </article>
                        `).join("")}
                    </div>
                    <div class="finance-section">
                        <h2>Histórico</h2>
                        ${renderMiniList(staff.history.slice(0, 6).map((item) => ({ title: item.text, meta: `Semana ${item.round}` })), "Sem mudanças recentes.")}
                    </div>
                </div>
            </section>
        `;
        document.querySelectorAll("[data-staff-renew]").forEach((button) => {
            button.addEventListener("click", () => improveStaffMember(button.dataset.staffRenew));
        });
        updateChrome();
    }

    function improveStaffMember(memberId) {
        const member = ensureStaffState().members.find((item) => item.id === memberId);
        if (!member) return;
        const cost = Math.round(member.salary * (2.8 + member.level * 0.25));
        if (GameState.budget < cost) {
            showToast("Saldo insuficiente para melhorar staff.");
            return;
        }
        GameState.budget -= cost;
        member.level = clamp(member.level + 1, 1, 10);
        member.experience = clamp(member.experience + 1, 1, 20);
        member.salary = Math.round(member.salary * 1.08);
        member.contract.yearsRemaining = Math.max(member.contract.yearsRemaining, 2);
        const text = `${member.role} melhorou para nível ${member.level}.`;
        GameState.staff.history.unshift({ text, round: GameState.round, date: new Date().toISOString() });
        addNews("Clube", "Staff evolui", text, `Investimento de ${money(cost)} aprovado pela diretoria.`);
        saveCareer();
        renderStaff();
    }

    function renderTraining() {
        const training = ensureTrainingState();
        const definitions = getTrainingDefinitions();
        const latest = training.history[0];
        const topPlayers = [...GameState.squad]
            .sort((a, b) => (b.potential - calculateCurrentOverall(b)) - (a.potential - calculateCurrentOverall(a)))
            .slice(0, 8);
        document.getElementById("screen-root").innerHTML = `
            <section class="screen stack internal-screen training-screen">
                ${renderInternalHero("Treinamento", "Foco semanal, evolução natural e planos individuais.", "TRN")}
                <div class="card card-pad stack internal-panel">
                    <div class="stat-grid">
                        <div class="stat"><span>Foco atual</span><strong>${escapeHtml(definitions[training.focus].label)}</strong></div>
                        <div class="stat"><span>Intensidade</span><strong>${training.weeklyIntensity}%</strong></div>
                        <div class="stat"><span>Última evolução</span><strong>${latest ? latest.evolved : 0}</strong></div>
                        <div class="stat"><span>Semana processada</span><strong>${training.lastProcessedRound || "-"}</strong></div>
                    </div>
                    <label class="field"><span>Foco coletivo</span><select id="training-focus">
                        ${Object.entries(definitions).map(([key, item]) => `<option value="${key}" ${training.focus === key ? "selected" : ""}>${escapeHtml(item.label)}</option>`).join("")}
                    </select></label>
                    <label class="field"><span>Intensidade semanal</span><input id="training-intensity" type="range" min="20" max="100" value="${training.weeklyIntensity}"></label>
                    <div class="training-grid">
                        ${topPlayers.map((player) => `
                            <article class="manager-panel">
                                <div class="manager-panel-head"><span>${escapeHtml(player.primaryPosition)}</span><strong>${calculateCurrentOverall(player)}/${player.potential}</strong></div>
                                <h2>${escapeHtml(player.name)}</h2>
                                <p class="muted">${escapeHtml(getPlayerTrend(player))} · ${calculateAge(player, GameState.currentYear)} anos</p>
                                <label class="field"><span>Treino individual</span><select data-individual-training="${player.id}">
                                    ${PLAYER_ATTRIBUTES.map((attr) => `<option value="${attr}" ${training.individualPlans[player.id] === attr ? "selected" : ""}>${escapeHtml(ATTRIBUTE_LABELS[attr])}</option>`).join("")}
                                </select></label>
                            </article>
                        `).join("")}
                    </div>
                    <div class="finance-section">
                        <h2>Histórico</h2>
                        ${renderMiniList(training.history.slice(0, 8).map((item) => ({ title: `${item.focus}: ${item.evolved} evolução(ões)`, meta: `Semana ${item.round}`, text: `Intensidade ${item.intensity}%` })), "Nenhum treino processado ainda.")}
                    </div>
                </div>
            </section>
        `;
        document.getElementById("training-focus").addEventListener("change", (event) => setTrainingFocus(event.target.value));
        document.getElementById("training-intensity").addEventListener("input", (event) => {
            GameState.training.weeklyIntensity = Number(event.target.value);
            saveCareer();
        });
        document.querySelectorAll("[data-individual-training]").forEach((select) => {
            select.addEventListener("change", () => setIndividualTraining(select.dataset.individualTraining, select.value));
        });
        updateChrome();
    }

    function renderAcademyProspectCard(player) {
        const kept = GameState.academy.keptPlayerIds.includes(player.id);
        const overall = calculateCurrentOverall(player);
        const potential = player.potential || overall;
        const progress = clamp(Math.round((overall / Math.max(potential, 1)) * 100), 0, 100);
        return `
            <article class="eg3-academy-card">
                <div class="eg3-academy-top">
                    <div>
                        <span>${escapeHtml(player.academy?.category || "Sub-20")}</span>
                        <strong>${escapeHtml(player.name)}</strong>
                        <small>${escapeHtml(translatePosition(player.primaryPosition))} · ${calculateAge(player, GameState.currentYear)} anos · ${escapeHtml(translateCountry(player.country))}</small>
                    </div>
                    <div class="eg3-pot-hero"><small>POT</small><b>${potential}</b></div>
                </div>
                <div class="eg3-personality">💡 ${escapeHtml(player.personality || "Promissor")}</div>
                <div class="eg3-growth"><span>Atual ${overall}</span><i><b style="width:${progress}%"></b></i><span>${potential}</span></div>
                <div class="button-row academy-actions">
                    <button class="btn btn-primary" type="button" data-academy-promote="${player.id}">${escapeHtml(t("academy.promote"))}</button>
                    <button class="btn" type="button" data-academy-keep="${player.id}">${escapeHtml(t("academy.keep"))}${kept ? " ✓" : ""}</button>
                </div>
                <details class="eg3-player-details"><summary>Ver atributos</summary>
                    <div class="stat-grid academy-prospect-grid">
                        <div class="stat"><span>${escapeHtml(t("academy.height"))}</span><strong>${player.height} cm</strong></div>
                        <div class="stat"><span>${escapeHtml(t("academy.weight"))}</span><strong>${player.weight} kg</strong></div>
                        <div class="stat"><span>${escapeHtml(t("academy.foot"))}</span><strong>${escapeHtml(player.dominantFoot)}</strong></div>
                        <div class="stat"><span>${escapeHtml(t("market.overall"))}</span><strong>${overall}</strong></div>
                    </div>
                </details>
            </article>
        `;
    }

    function renderAcademy() {
        refreshAllPlayers();
        ensureAcademyState();
        const level = getAcademyLevel();
        const prospects = [...GameState.academy.prospects].sort((a, b) => (b.potential || 0) - (a.potential || 0));
        document.getElementById("screen-root").innerHTML = `
            <section class="screen eg3-academy">
                <header class="eg3-section-header">
                    <span>Centro de formação</span>
                    <h1>${escapeHtml(t("academy.title"))}</h1>
                    <p>${prospects.length} jovens disponíveis para avaliação · Nível ${level}/10</p>
                </header>
                <div class="eg3-academy-list">
                    ${prospects.length ? prospects.map(renderAcademyProspectCard).join("") : `<div class="empty-state">${escapeHtml(t("academy.noPlayers"))}</div>`}
                </div>
                <details class="eg3-accordion eg3-academy-events">
                    <summary><span>${escapeHtml(t("academy.events"))}</span><strong>${GameState.academy.events.length}</strong></summary>
                    <div class="eg3-observed-list">
                        ${GameState.academy.events.length ? GameState.academy.events.slice(0, 5).map((event) => `
                            <div class="row-card"><strong>${escapeHtml(event.text)}</strong><span class="muted">${escapeHtml(event.playerName)} · ${escapeHtml(t("scout.week"))} ${event.round}</span></div>
                        `).join("") : `<div class="empty-state">${escapeHtml(t("academy.noEvents"))}</div>`}
                    </div>
                </details>
            </section>
        `;
        document.querySelectorAll("[data-academy-promote]").forEach((button) => button.addEventListener("click", () => promoteAcademyProspect(button.dataset.academyPromote)));
        document.querySelectorAll("[data-academy-keep]").forEach((button) => button.addEventListener("click", () => keepAcademyProspect(button.dataset.academyKeep)));
        updateChrome();
    }

    function renderSponsorSlot(slot, labelKey) {
        const sponsor = GameState.marketing.sponsors[slot];
        return `
            <div class="stat">
                <span>${escapeHtml(t(labelKey))}</span>
                <strong>${escapeHtml(sponsor?.name || t("marketing.none"))}</strong>
                <span>${sponsor ? `${money(sponsor.weeklyValue)} · ${sponsor.durationWeeks} sem.` : ""}</span>
            </div>
        `;
    }

    function renderSponsorProposal(proposal) {
        const slotLabel = proposal.slot === "master" ? t("marketing.masterSponsor") : proposal.slot === "secondary" ? t("marketing.secondarySponsor") : t("marketing.materialSupplier");
        return `
            <article class="marketing-proposal card card-pad stack">
                <div class="row-main">
                    <div>
                        <span class="menu-kicker">${escapeHtml(slotLabel)}</span>
                        <h2>${escapeHtml(proposal.name)}</h2>
                    </div>
                    <span class="pill">${money(proposal.weeklyValue)}</span>
                </div>
                <div class="stat-grid marketing-mini-grid">
                    <div class="stat"><span>${escapeHtml(t("marketing.weeklyValue"))}</span><strong>${money(proposal.weeklyValue)}</strong></div>
                    <div class="stat"><span>${escapeHtml(t("marketing.reputationFit"))}</span><strong>${proposal.reputationFit}/100</strong></div>
                    <div class="stat"><span>${escapeHtml(t("marketing.fanReach"))}</span><strong>${proposal.fanReach}/100</strong></div>
                </div>
                <div class="marketing-actions">
                    <button class="btn btn-primary" type="button" data-sponsor-accept="${proposal.id}">${escapeHtml(t("marketing.accept"))}</button>
                    <button class="btn" type="button" data-sponsor-negotiate="${proposal.id}">${escapeHtml(t("marketing.negotiate"))}</button>
                    <button class="btn btn-ghost" type="button" data-sponsor-reject="${proposal.id}">${escapeHtml(t("marketing.reject"))}</button>
                </div>
            </article>
        `;
    }

    function renderMarketing() {
        ensureMarketingState();
        const finances = getFinanceSummary();
        const store = GameState.marketing.store;
        const campaigns = getCampaignDefinitions();
        document.getElementById("screen-root").innerHTML = `
            <section class="screen stack marketing-screen">
                <div>
                    <h1>${escapeHtml(t("marketing.title"))}</h1>
                    <p>${escapeHtml(t("marketing.subtitle"))}</p>
                </div>
                <div class="stat-grid">
                    ${renderSponsorSlot("master", "marketing.masterSponsor")}
                    ${renderSponsorSlot("secondary", "marketing.secondarySponsor")}
                    ${renderSponsorSlot("material", "marketing.materialSupplier")}
                    <div class="stat"><span>${escapeHtml(t("marketing.officialStore"))}</span><strong>${money(finances.merchandising)}</strong></div>
                </div>
                <div class="card card-pad stack">
                    <h2>${escapeHtml(t("marketing.officialStore"))}</h2>
                    <div class="stat-grid">
                        <div class="stat"><span>${escapeHtml(t("marketing.storeSales"))}</span><strong>${number(store.estimatedSales)}</strong></div>
                        <div class="stat"><span>${escapeHtml(t("marketing.storeRevenue"))}</span><strong>${money(store.weeklyRevenue)}</strong></div>
                        <div class="stat"><span>${escapeHtml(t("marketing.bestShirt"))}</span><strong>${escapeHtml(store.bestSeller)}</strong></div>
                    </div>
                    <p>${escapeHtml(t("marketing.futureStoreText"))}</p>
                </div>
                <div class="card card-pad stack">
                    <h2>${escapeHtml(t("marketing.campaigns"))}</h2>
                    <div class="marketing-campaign-grid">
                        ${campaigns.map((campaign) => `
                            <article class="row-card">
                                <div class="row-main"><strong>${escapeHtml(campaign.label)}</strong><span>${money(campaign.cost)}</span></div>
                                <div class="meta"><span>Torcida +${campaign.fanDelta}</span><span>Receita ${Math.round(campaign.revenueBoost * 100)}%</span></div>
                                <button class="btn btn-primary" type="button" data-campaign-run="${campaign.id}">${escapeHtml(t("marketing.runCampaign"))}</button>
                            </article>
                        `).join("")}
                    </div>
                </div>
                <div class="stack">
                    <h2>${escapeHtml(t("marketing.proposals"))}</h2>
                    <div class="marketing-proposal-grid">
                        ${GameState.marketing.proposals.length ? GameState.marketing.proposals.map(renderSponsorProposal).join("") : `<div class="empty-state">${escapeHtml(t("marketing.noProposals"))}</div>`}
                    </div>
                </div>
                <div class="card card-pad stack">
                    <h2>${escapeHtml(t("marketing.futureStore"))}</h2>
                    <p>${escapeHtml(t("marketing.futureStoreText"))}</p>
                </div>
            </section>
        `;
        document.querySelectorAll("[data-sponsor-accept]").forEach((button) => {
            button.addEventListener("click", () => acceptSponsorProposal(button.dataset.sponsorAccept));
        });
        document.querySelectorAll("[data-sponsor-reject]").forEach((button) => {
            button.addEventListener("click", () => rejectSponsorProposal(button.dataset.sponsorReject));
        });
        document.querySelectorAll("[data-sponsor-negotiate]").forEach((button) => {
            button.addEventListener("click", () => negotiateSponsorProposal(button.dataset.sponsorNegotiate));
        });
        document.querySelectorAll("[data-campaign-run]").forEach((button) => {
            button.addEventListener("click", () => runMarketingCampaign(button.dataset.campaignRun));
        });
        updateChrome();
    }

    function getCalendarRecordForViewedWeek() {
        ensureSeasonFlowState();
        const viewed = GameState.seasonFlow.calendar.viewedWeek || GameState.round;
        return (GameState.seasonFlow.calendar.records || []).find((record) => record.week === viewed && record.stage === "after") ||
            (GameState.seasonFlow.calendar.records || []).find((record) => record.week === viewed) ||
            updateCalendarRecord("current");
    }

    function renderCalendar() {
        ensureSeasonFlowState();
        const record = getCalendarRecordForViewedWeek();
        const viewed = GameState.seasonFlow.calendar.viewedWeek || GameState.round;
        const canNext = viewed < GameState.round;
        const canPrev = viewed > Math.max(1, GameState.round - 20);
        const upcoming = getClubById(GameState.nextOpponentId) || pickNextOpponent();
        document.getElementById("screen-root").innerHTML = `
            <section class="screen stack calendar-screen">
                <div class="calendar-hero card card-pad">
                    <div>
                        <span class="menu-kicker">${escapeHtml(t("calendar.title"))}</span>
                        <h1>${escapeHtml(record.month)} ${record.season}</h1>
                        <div class="meta"><span>${escapeHtml(t("calendar.week"))} ${viewed}</span><span>${escapeHtml(t("calendar.round"))} ${record.round}</span><span>${escapeHtml(record.transferWindow ? t("calendar.transferOpen") : t("calendar.transferClosed"))}</span><span>${escapeHtml(record.internationalBreak ? t("calendar.internationalBreak") : t("calendar.clubWeek"))}</span></div>
                    </div>
                    <div class="button-row">
                        <button class="btn" id="calendar-prev" type="button" ${canPrev ? "" : "disabled"}>${escapeHtml(t("calendar.previousWeek"))}</button>
                        <button class="btn" id="calendar-next" type="button" ${canNext ? "" : "disabled"}>${escapeHtml(t("calendar.nextWeek"))}</button>
                    </div>
                </div>
                <div class="grid">
                    <div class="card card-pad stack">
                        <h2>${escapeHtml(t("calendar.upcoming"))}</h2>
                        <div class="row-card"><strong>${escapeHtml(record.nextMatch || `${GameState.club.name} x ${upcoming.name}`)}</strong><span class="muted">${escapeHtml(GameState.league.name)} · ${getNextMatchDate()}</span></div>
                        <div class="row-card"><strong>${escapeHtml(record.internationalBreak ? t("calendar.nationalBreakPlanned") : t("calendar.trainingAndMatch"))}</strong><span class="muted">${escapeHtml(t("calendar.futureText"))}</span></div>
                    </div>
                    <div class="card card-pad stack">
                        <h2>${escapeHtml(t("calendar.latestResults"))}</h2>
                        ${(record.latestResults || []).length ? (record.latestResults || []).slice(0, 5).map((result) => `<div class="row-card">${escapeHtml(result.home)} ${result.homeGoals}x${result.awayGoals} ${escapeHtml(result.away)}</div>`).join("") : `<div class="empty-state">${escapeHtml(t("calendar.noResults"))}</div>`}
                    </div>
                    <div class="card card-pad stack">
                        <h2>${escapeHtml(t("calendar.competitions"))}</h2>
                        ${(record.competitions || []).map((competition) => `<div class="row-card">${escapeHtml(competition)}</div>`).join("")}
                    </div>
                    <div class="card card-pad stack">
                        <h2>${escapeHtml(t("calendar.future"))}</h2>
                        <div class="row-card">${escapeHtml(t("calendar.futureText"))}</div>
                    </div>
                </div>
            </section>
        `;
        document.getElementById("calendar-prev").addEventListener("click", () => {
            GameState.seasonFlow.calendar.viewedWeek = Math.max(1, viewed - 1);
            renderCalendar();
        });
        document.getElementById("calendar-next").addEventListener("click", () => {
            GameState.seasonFlow.calendar.viewedWeek = Math.min(GameState.round, viewed + 1);
            renderCalendar();
        });
        updateChrome();
    }

    function renderNotifications() {
        ensureSeasonFlowState();
        const notifications = GameState.seasonFlow.notifications;
        document.getElementById("screen-root").innerHTML = `
            <section class="screen stack notifications-screen">
                <div class="row-main">
                    <div>
                        <h1>${escapeHtml(t("notifications.title"))}</h1>
                        <p>${escapeHtml(t("notifications.subtitle"))}</p>
                    </div>
                    <button class="btn btn-ghost" id="clear-notifications" type="button" ${notifications.length ? "" : "disabled"}>${escapeHtml(t("notifications.clear"))}</button>
                </div>
                <div class="notifications-list">
                    ${notifications.length ? notifications.map((item) => `
                        <article class="notification-card ${item.read ? "read" : "unread"}">
                            <div>
                                <span class="menu-kicker">${escapeHtml(item.category)} · ${escapeHtml(t("calendar.week"))} ${item.round}</span>
                                <h2>${escapeHtml(item.title)}</h2>
                                <p>${escapeHtml(item.text)}</p>
                            </div>
                            <div class="button-row">
                                <button class="btn" type="button" data-notification-open="${item.id}">${escapeHtml(t("notifications.open"))}</button>
                                <button class="btn btn-ghost" type="button" data-notification-read="${item.id}">${escapeHtml(item.read ? t("notifications.read") : t("notifications.markRead"))}</button>
                            </div>
                        </article>
                    `).join("") : `<div class="empty-state">${escapeHtml(t("notifications.empty"))}</div>`}
                </div>
            </section>
        `;
        document.querySelectorAll("[data-notification-open]").forEach((button) => {
            button.addEventListener("click", () => openNotification(button.dataset.notificationOpen));
        });
        document.querySelectorAll("[data-notification-read]").forEach((button) => {
            button.addEventListener("click", () => markNotificationRead(button.dataset.notificationRead));
        });
        document.getElementById("clear-notifications").addEventListener("click", clearNotifications);
        updateChrome();
    }

    function openNotification(notificationId) {
        ensureSeasonFlowState();
        const notification = GameState.seasonFlow.notifications.find((item) => item.id === notificationId);
        if (!notification) return;
        notification.read = true;
        if (notification.sourceId) {
            GameState.selectedNewsId = notification.sourceId;
            saveCareer();
            switchScreen("newsDetail");
        } else {
            saveCareer();
            renderNotifications();
        }
    }

    function markNotificationRead(notificationId) {
        ensureSeasonFlowState();
        const notification = GameState.seasonFlow.notifications.find((item) => item.id === notificationId);
        if (notification) notification.read = true;
        saveCareer();
        renderNotifications();
    }

    function clearNotifications() {
        ensureSeasonFlowState();
        GameState.seasonFlow.notifications = [];
        saveCareer();
        renderNotifications();
    }

    function showWeeklySummaryModal(summary) {
        const root = document.getElementById("modal-root");
        if (!root || !summary) return;
        root.innerHTML = `
            <div class="weekly-summary-overlay" role="dialog" aria-modal="true">
                <section class="weekly-summary-modal">
                    <div class="row-main">
                        <div>
                            <span class="menu-kicker">${escapeHtml(t("summary.title"))}</span>
                            <h1>${escapeHtml(summary.month)} · ${escapeHtml(t("calendar.week"))} ${summary.week}</h1>
                        </div>
                        <button class="icon-action" id="weekly-summary-close" type="button">${escapeHtml(t("summary.close"))}</button>
                    </div>
                    <div class="weekly-summary-grid">
                        ${renderWeeklySummaryBlock(t("summary.football"), [summary.football.result, `${t("summary.best")}: ${summary.football.bestPlayer}`, `${t("summary.worst")}: ${summary.football.worstPlayer}`, `${t("summary.position")}: ${summary.football.position}`])}
                        ${renderWeeklySummaryBlock(t("summary.club"), [`${t("summary.fans")}: ${summary.club.fanMood}`, `${t("summary.morale")}: ${summary.club.morale}`, `${t("summary.board")}: ${summary.club.board}`])}
                        ${renderWeeklySummaryBlock(t("summary.finance"), [`${t("summary.income")}: ${money(summary.finance.income)}`, `${t("summary.expenses")}: ${money(summary.finance.expenses)}`, `${t("summary.balance")}: ${money(summary.finance.balance)}`])}
                        ${renderWeeklySummaryBlock(t("summary.market"), [`${t("summary.observed")}: ${summary.market.observed}`, `${t("summary.negotiations")}: ${summary.market.negotiations}`, `${t("summary.opportunities")}: ${summary.market.opportunities.join(", ") || t("summary.noUpdates")}`])}
                        ${renderWeeklySummaryBlock(t("summary.academy"), [`${t("summary.newTalents")}: ${summary.academy.newTalents}`, `${t("academy.averageQuality")}: ${summary.academy.averageQuality}`])}
                        ${renderWeeklySummaryBlock(t("summary.structure"), [`${t("summary.activeImprovements")}: ${summary.structure.active}`, `${t("summary.previousQueue")}: ${summary.structure.previous}`])}
                    </div>
                    <div class="card card-pad stack">
                        <h2>${escapeHtml(t("summary.news"))}</h2>
                        ${summary.headlines.length ? summary.headlines.map((headline) => `<div class="row-card">${escapeHtml(headline)}</div>`).join("") : `<div class="empty-state">${escapeHtml(t("summary.noNews"))}</div>`}
                    </div>
                    <div class="card card-pad stack">
                        <h2>${escapeHtml(t("summary.narratives"))}</h2>
                        ${summary.narratives.map((item) => `<div class="row-card">${escapeHtml(item)}</div>`).join("")}
                    </div>
                    <div class="button-row">
                        <button class="btn btn-primary" id="weekly-summary-calendar" type="button">${escapeHtml(t("summary.openCalendar"))}</button>
                        <button class="btn" id="weekly-summary-notifications" type="button">${escapeHtml(t("summary.notifications"))}</button>
                    </div>
                </section>
            </div>
        `;
        document.getElementById("weekly-summary-close").addEventListener("click", closeWeeklySummaryModal);
        document.getElementById("weekly-summary-calendar").addEventListener("click", () => {
            closeWeeklySummaryModal();
            switchScreen("calendar");
        });
        document.getElementById("weekly-summary-notifications").addEventListener("click", () => {
            closeWeeklySummaryModal();
            switchScreen("notifications");
        });
    }

    function renderWeeklySummaryBlock(title, lines) {
        return `
            <div class="weekly-summary-block">
                <h2>${escapeHtml(title)}</h2>
                ${lines.map((line) => `<div class="row-card">${escapeHtml(line)}</div>`).join("")}
            </div>
        `;
    }

    function closeWeeklySummaryModal() {
        const root = document.getElementById("modal-root");
        if (root) root.innerHTML = "";
    }

    function renderLeague() {
        updateLeagueTable(false);
        document.getElementById("screen-root").innerHTML = `
            <section class="screen stack">
                <div>
                    <h1>${GameState.league.name || "Liga Nacional"}</h1>
                    <p>${GameState.league.country} - Divisao ${GameState.league.division}. Liga ativa da carreira.</p>
                </div>
                <div class="card card-pad">
                    <div class="table-wrap">
                        <table>
                            <thead>
                                <tr><th>Pos</th><th>Clube</th><th>J</th><th>V</th><th>E</th><th>D</th><th>Pts</th><th>SG</th></tr>
                            </thead>
                            <tbody>
                                ${GameState.league.table.map((row, index) => `
                                    <tr class="${row.clubId === GameState.club.id ? "highlight-row" : ""}">
                                        <td>${index + 1}</td>
                                        <td>${row.name}</td>
                                        <td>${row.played}</td>
                                        <td>${row.wins}</td>
                                        <td>${row.draws}</td>
                                        <td>${row.losses}</td>
                                        <td>${row.points}</td>
                                        <td>${row.goalDifference}</td>
                                    </tr>
                                `).join("")}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="card card-pad">
                    <h2>Resultados recentes</h2>
                    ${GameState.league.results.length ? `<div class="list">${GameState.league.results.slice(0, 5).map((result) => `
                        <div class="row-card">Rodada ${result.round}: ${result.home} ${result.homeGoals}x${result.awayGoals} ${result.away}</div>
                    `).join("")}</div>` : `<div class="empty-state">Nenhuma rodada disputada.</div>`}
                </div>
                <div class="card card-pad">
                    <h2>Ligas preparadas</h2>
                    <div class="table-wrap">
                        <table>
                            <thead><tr><th>Liga</th><th>Pais</th><th>Div</th><th>Clubes</th><th>Campeao</th></tr></thead>
                            <tbody>
                                ${GameState.world.leagues.map((league) => `
                                    <tr class="${league.id === GameState.league.id ? "highlight-row" : ""}">
                                        <td>${league.name}</td>
                                        <td>${league.country}</td>
                                        <td>${league.division}</td>
                                        <td>${league.clubs.length}</td>
                                        <td>${league.champion || "Em disputa"}</td>
                                    </tr>
                                `).join("")}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        `;
        updateChrome();
    }

    function renderClub() {
        ensureClubProfile(GameState.club);
        const club = GameState.club;
        const fanMood = getFanMood();
        document.getElementById("screen-root").innerHTML = `
            <section class="screen stack">
                <div>
                    <h1>Clube</h1>
                    <p>Identidade, estrutura e objetivos do clube atual.</p>
                </div>
                <div class="card card-pad stack">
                    <div class="club-heading">
                        ${renderClubCrest(club, "large")}
                        <div>
                            <h2>${escapeHtml(club.name)}</h2>
                            <div class="meta"><span>${escapeHtml(club.city)}</span><span>${escapeHtml(club.country)}</span><span>${escapeHtml(club.size)}</span><span>Fundado em ${club.founded}</span></div>
                        </div>
                    </div>
                    <p class="eg-text">${escapeHtml(club.history)}</p>
                    <div class="stat-grid">
                        <div class="stat"><span>Nome</span><strong>${escapeHtml(club.name)}</strong></div>
                        <div class="stat"><span>Cidade</span><strong>${escapeHtml(club.city)}</strong></div>
                        <div class="stat"><span>Estadio</span><strong>${escapeHtml(club.stadium.name)}</strong></div>
                        <div class="stat"><span>Capacidade</span><strong>${number(club.stadium.capacity)}</strong></div>
                        <div class="stat"><span>Orcamento</span><strong>${money(GameState.budget)}</strong></div>
                        <div class="stat"><span>Reputacao</span><strong>${club.reputation}</strong></div>
                        <div class="stat"><span>Confianca</span><strong>${GameState.boardConfidence}%</strong></div>
                        <div class="stat"><span>Torcida</span><strong>${number(club.fans)}</strong></div>
                        <div class="stat"><span>Moral da torcida</span><strong>${escapeHtml(fanMood.label)}</strong></div>
                        <div class="stat"><span>Popularidade</span><strong>${club.popularity}</strong></div>
                        <div class="stat"><span>Prestigio</span><strong>${club.prestige}</strong></div>
                        <div class="stat"><span>Tradicao</span><strong>${club.tradition}</strong></div>
                        <div class="stat"><span>Instalacoes</span><strong>${club.facilities}</strong></div>
                        <div class="stat"><span>Base</span><strong>${club.youthQuality}</strong></div>
                        <div class="stat"><span>Scout</span><strong>${club.scoutQuality}</strong></div>
                        <div class="stat"><span>Patrocinio</span><strong>${escapeHtml(club.sponsorship.master)}</strong></div>
                        <div class="stat"><span>Valor do patrocinio</span><strong>${money(club.sponsorship.value)}</strong></div>
                        <div class="stat"><span>Bilheteria</span><strong>${money(club.stadium.ticketRevenue)} / torcedor</strong></div>
                    </div>
                    <div class="club-identity-grid">
                        <div>
                            <h2>Cores</h2>
                            <div class="color-row">${club.colors.map((color) => `<span class="color-swatch" style="--swatch:${color}"></span>`).join("")}</div>
                        </div>
                        <div>
                            <h2>Uniformes</h2>
                            <div class="kit-grid">${Object.values(club.kits).map(renderKitSwatch).join("")}</div>
                        </div>
                    </div>
                    <div>
                        <h2>Objetivos da diretoria</h2>
                        ${renderSimpleList(club.objectives)}
                    </div>
                    <div class="button-row">
                        <button class="btn btn-primary" id="open-structure" type="button">Abrir Estrutura</button>
                        <button class="btn" id="open-stadium" type="button">Abrir Estádio</button>
                    </div>
                </div>
            </section>
        `;
        document.getElementById("open-structure").addEventListener("click", () => switchScreen("structure"));
        document.getElementById("open-stadium").addEventListener("click", () => switchScreen("stadium"));
        updateChrome();
    }

    function renderStadium() {
        const stadium = GameState.club.stadium;
        const occupancy = getStadiumOccupancyRate();
        const avgRevenue = getAverageMatchRevenue();
        const maintenance = getWeeklyStadiumMaintenance();
        const projects = stadium.activeProjects || [];
        document.getElementById("screen-root").innerHTML = `
            <section class="screen stack">
                <div><h1>Estádio</h1><p>Ativo estratégico de receitas, público e estrutura do clube.</p></div>
                <div class="card card-pad stack stadium-room">
                    <div class="club-heading">
                        ${renderClubCrest(GameState.club, "large")}
                        <div>
                            <span class="menu-kicker">Casa do ${GameState.club.name}</span>
                            <h2>${escapeHtml(stadium.name)}</h2>
                            <div class="meta"><span>${number(stadium.capacity)} lugares</span><span>Nível ${stadium.level}</span><span>${occupancy}% ocupação média</span></div>
                        </div>
                    </div>
                    <div class="stat-grid">
                        <div class="stat"><span>Capacidade</span><strong>${number(stadium.capacity)}</strong></div>
                        <div class="stat"><span>Ocupação média</span><strong>${occupancy}%</strong></div>
                        <div class="stat"><span>Gramado</span><strong>${stadium.pitchState}/100</strong></div>
                        <div class="stat"><span>Instalações</span><strong>${stadium.level}</strong></div>
                        <div class="stat"><span>Receita por jogo</span><strong>${money(avgRevenue)}</strong></div>
                        <div class="stat"><span>Manutenção semanal</span><strong>${money(maintenance)}</strong></div>
                    </div>
                    <div class="stadium-projects">
                        <h2>Obras em andamento</h2>
                        ${projects.length ? projects.map((project) => {
                            const progress = Math.round(((project.totalWeeks - project.remainingWeeks) / project.totalWeeks) * 100);
                            return `
                                <div class="row-card">
                                    <div class="row-main"><strong>${escapeHtml(project.label)}</strong><span>${project.remainingWeeks} sem.</span></div>
                                    <div class="objective-progress"><i><b style="width:${progress}%"></b></i></div>
                                    <span class="muted">Investimento ${money(project.cost)}</span>
                                </div>
                            `;
                        }).join("") : `<div class="row-card">Nenhuma obra em andamento.</div>`}
                    </div>
                    <div class="stadium-upgrades">
                        ${Object.entries(stadium.upgrades).map(([key, upgrade]) => renderStadiumUpgrade(key, upgrade)).join("")}
                    </div>
                    <div class="button-row">
                        <button class="btn" id="stadium-club" type="button">Clube</button>
                        <button class="btn btn-primary" id="stadium-finances" type="button">Finanças</button>
                    </div>
                </div>
            </section>
        `;
        document.querySelectorAll("[data-stadium-upgrade]").forEach((button) => {
            button.addEventListener("click", () => startStadiumUpgrade(button.dataset.stadiumUpgrade));
        });
        document.getElementById("stadium-club").addEventListener("click", () => switchScreen("club"));
        document.getElementById("stadium-finances").addEventListener("click", () => switchScreen("finances"));
        updateChrome();
    }

    function renderStadiumUpgrade(key, upgrade) {
        const inProgress = isStadiumUpgradeInProgress(key);
        const maxed = upgrade.level >= upgrade.maxLevel;
        const cost = getStadiumUpgradeCost(key);
        return `
            <article class="stadium-upgrade">
                <div class="row-main">
                    <strong>${escapeHtml(upgrade.label)}</strong>
                    <span class="pill">${upgrade.level}/${upgrade.maxLevel}</span>
                </div>
                <p>${escapeHtml(upgrade.benefit)}</p>
                <div class="meta"><span>Custo ${money(cost)}</span><span>Prazo ${upgrade.weeks} sem.</span></div>
                <button class="btn btn-primary" type="button" data-stadium-upgrade="${key}" ${inProgress || maxed ? "disabled" : ""}>${maxed ? "Máximo" : inProgress ? "Em obra" : "Melhorar"}</button>
            </article>
        `;
    }

    function renderStructure() {
        const structure = GameState.club.structure;
        const queue = structure.queue || [];
        document.getElementById("screen-root").innerHTML = `
            <section class="screen stack internal-screen structure-screen">
                ${renderInternalHero("Estrutura", "Departamentos internos que sustentam evolução, saúde, scout e receitas.", "EST")}
                <div class="card card-pad stack structure-room internal-panel">
                    <div class="stat-grid">
                        <div class="stat"><span>Nível médio</span><strong>${getStructureAverageLevel()}/10</strong></div>
                        <div class="stat"><span>Centro de Treinamento</span><strong>${structure.departments.training.level}/10</strong></div>
                        <div class="stat"><span>Departamento Médico</span><strong>${structure.departments.medical.level}/10</strong></div>
                        <div class="stat"><span>Scout</span><strong>${structure.departments.scout.level}/10</strong></div>
                    </div>
                    <div class="stadium-projects">
                        <h2>Fila de melhorias</h2>
                        ${queue.length ? queue.map((project) => {
                            const progress = Math.round(((project.totalWeeks - project.remainingWeeks) / project.totalWeeks) * 100);
                            return `
                                <div class="row-card">
                                    <div class="row-main"><strong>${escapeHtml(project.label)}</strong><span>${project.remainingWeeks} sem.</span></div>
                                    <div class="objective-progress"><i><b style="width:${progress}%"></b></i></div>
                                    <span class="muted">Investimento ${money(project.cost)}</span>
                                </div>
                            `;
                        }).join("") : `<div class="row-card">Nenhuma melhoria estrutural em andamento.</div>`}
                    </div>
                    <div class="structure-grid">
                        ${Object.entries(structure.departments).map(([key, department]) => renderStructureDepartment(key, department)).join("")}
                    </div>
                    <div class="button-row">
                        <button class="btn" id="structure-club" type="button">Clube</button>
                        <button class="btn btn-primary" id="structure-stadium" type="button">Estádio</button>
                    </div>
                </div>
            </section>
        `;
        document.querySelectorAll("[data-structure-upgrade]").forEach((button) => {
            button.addEventListener("click", () => startStructureUpgrade(button.dataset.structureUpgrade));
        });
        document.getElementById("structure-club").addEventListener("click", () => switchScreen("club"));
        document.getElementById("structure-stadium").addEventListener("click", () => switchScreen("stadium"));
        updateChrome();
    }

    function renderStructureDepartment(key, department) {
        const inProgress = isStructureUpgradeQueued(key);
        const queueBlocked = GameState.club.structure.queue.length > 0 && !inProgress;
        const maxed = department.level >= department.maxLevel;
        return `
            <article class="structure-department">
                <div class="row-main">
                    <strong>${escapeHtml(department.label)}</strong>
                    <span class="pill">${department.level}/${department.maxLevel}</span>
                </div>
                <p>${escapeHtml(department.description)}</p>
                <div class="row-card"><span>Benefício atual</span><strong>${escapeHtml(getStructureCurrentBenefit(key, department.level))}</strong></div>
                <div class="row-card"><span>Próximo nível</span><strong>${escapeHtml(maxed ? "Departamento no nível máximo." : department.nextBenefit)}</strong></div>
                <div class="meta"><span>Custo ${money(getStructureDepartmentCost(key))}</span><span>Prazo ${getStructureDepartmentWeeks(key)} sem.</span></div>
                <button class="btn btn-primary" type="button" data-structure-upgrade="${key}" ${inProgress || queueBlocked || maxed ? "disabled" : ""}>${maxed ? "Máximo" : inProgress ? "Em melhoria" : queueBlocked ? "Fila ocupada" : "Melhorar"}</button>
            </article>
        `;
    }

    function getStructureCurrentBenefit(key, level) {
        const benefits = {
            training: `Evolução dos jogadores +${level}% em treinos.`,
            medical: `Recuperação de lesões até ${Math.min(35, level * 4)}% mais eficiente.`,
            scout: `Precisão de potencial observada em nível ${level}/10.`,
            youth: `Qualidade da base impulsionada para jovens melhores.`,
            marketing: `Receitas comerciais e torcida recebem bônus de ${level * 2}%.`,
            administration: `Custos operacionais reduzidos gradualmente.`
        };
        return benefits[key] || "Benefício operacional ativo.";
    }

    function exportSave() {
        saveCareer();
        const payload = JSON.stringify(GameState, null, 2);
        const blob = new Blob([payload], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `eleven-genesis-save-${GameState.club?.id || "carreira"}-${GameState.season}.json`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        showToast("Save exportado.");
    }

    function importSaveFromFile(event) {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            try {
                const parsed = JSON.parse(String(reader.result || "{}"));
                GameState = migrateState(parsed);
                saveCareer();
                switchScreen(GameState.currentScreen || "home", { silent: true });
                showToast("Save importado.");
            } catch (error) {
                showToast("Arquivo de save inválido.");
            } finally {
                event.target.value = "";
            }
        });
        reader.readAsText(file);
    }

    function renderSettings() {
        document.getElementById("screen-root").innerHTML = `
            <section class="screen stack internal-screen settings-screen">
                ${renderInternalHero(t("settings.title"), t("settings.subtitle"), "CFG")}
                <div class="card card-pad stack internal-panel">
                    <label class="field">
                        <span>${escapeHtml(t("settings.language"))}</span>
                        <select id="settings-language-select">
                            <option value="Português" ${GameState.settings.language === "Português" ? "selected" : ""}>Português</option>
                            <option value="English" ${GameState.settings.language === "English" ? "selected" : ""}>English</option>
                            <option value="Español" ${GameState.settings.language === "Español" ? "selected" : ""}>Español</option>
                        </select>
                    </label>
                    <label class="field">
                        <span>Volume</span>
                        <input id="settings-volume" type="range" min="0" max="100" value="${GameState.settings.volume}">
                    </label>
                    <label class="field">
                        <span>Velocidade das animações</span>
                        <select id="settings-animation-speed">
                            <option value="slow" ${GameState.settings.animationSpeed === "slow" ? "selected" : ""}>Lenta</option>
                            <option value="normal" ${GameState.settings.animationSpeed === "normal" ? "selected" : ""}>Normal</option>
                            <option value="fast" ${GameState.settings.animationSpeed === "fast" ? "selected" : ""}>Rápida</option>
                        </select>
                    </label>
                    <div class="row-card">
                        <div class="row-main">
                            <strong>Modo escuro</strong>
                            <span class="pill">${GameState.settings.darkMode ? "Ativo" : "Claro"}</span>
                        </div>
                        <span class="muted">Alterna a base visual preservando o contraste dos cards e botões.</span>
                        <button class="btn" id="toggle-dark-mode" type="button">${GameState.settings.darkMode ? "Usar modo claro" : "Usar modo escuro"}</button>
                    </div>
                    <div class="row-card">
                        <div class="row-main">
                            <strong>${escapeHtml(t("settings.autoSave"))}</strong>
                            <span class="pill">${escapeHtml(GameState.settings.autoSave ? t("settings.active") : t("settings.inactive"))}</span>
                        </div>
                        <span class="muted">${escapeHtml(t("settings.autoSaveText"))}</span>
                        <button class="btn" id="toggle-autosave" type="button">${escapeHtml(GameState.settings.autoSave ? t("settings.disable") : t("settings.enable"))}</button>
                    </div>
                    <div class="button-row">
                        <button class="btn btn-primary" id="settings-save" type="button">${escapeHtml(t("settings.save"))}</button>
                        <button class="btn" id="settings-load" type="button">${escapeHtml(t("settings.load"))}</button>
                        <button class="btn" id="settings-export" type="button">Exportar save</button>
                        <label class="btn import-save-label" for="settings-import">Importar save</label>
                        <input class="visually-hidden" id="settings-import" type="file" accept="application/json">
                        <button class="btn btn-danger" id="settings-reset" type="button">${escapeHtml(t("settings.resetCareer"))}</button>
                    </div>
                </div>
            </section>
        `;
        document.getElementById("settings-language-select").addEventListener("change", (event) => {
            changeLanguage(event.target.value);
        });
        document.getElementById("settings-volume").addEventListener("input", (event) => {
            GameState.settings.volume = Number(event.target.value);
            saveMenuPreferences();
            if (window.ElevenGenesisAudio) window.ElevenGenesisAudio.volume = GameState.settings.volume;
        });
        document.getElementById("settings-animation-speed").addEventListener("change", (event) => {
            GameState.settings.animationSpeed = event.target.value;
            saveMenuPreferences();
            updateChrome();
            saveCareer();
        });
        document.getElementById("toggle-dark-mode").addEventListener("click", () => {
            GameState.settings.darkMode = !GameState.settings.darkMode;
            saveMenuPreferences();
            updateChrome();
            saveCareer();
            renderSettings();
        });
        document.getElementById("toggle-autosave").addEventListener("click", () => {
            GameState.settings.autoSave = !GameState.settings.autoSave;
            saveCareer();
            renderSettings();
        });
        document.getElementById("settings-save").addEventListener("click", () => {
            saveCareer();
            showToast(t("settings.saved"));
        });
        document.getElementById("settings-load").addEventListener("click", loadCareer);
        document.getElementById("settings-export").addEventListener("click", exportSave);
        document.getElementById("settings-import").addEventListener("change", importSaveFromFile);
        document.getElementById("settings-reset").addEventListener("click", resetCareer);
        updateChrome();
    }

    function bindGlobalEvents() {
        const closeMobileMenu = () => {
            const menu = document.getElementById("eg3-mobile-menu");
            if (menu) {
                menu.classList.add("hidden");
                menu.setAttribute("aria-hidden", "true");
            }
        };
        const openMobileMenu = () => {
            const menu = document.getElementById("eg3-mobile-menu");
            if (menu) {
                menu.classList.remove("hidden");
                menu.setAttribute("aria-hidden", "false");
            }
        };
        const handleNavigationClick = (event) => {
            const actionButton = event.target.closest("[data-action]");
            if (actionButton) {
                const action = actionButton.dataset.action;
                if (action === "advance-week") advanceWeek();
                if (action === "menu-more") openMobileMenu();
                if (action === "close-menu-more") closeMobileMenu();
                return;
            }
            const button = event.target.closest("[data-screen]");
            if (!button) return;
            closeMobileMenu();
            switchScreen(button.dataset.screen);
        };
        document.getElementById("bottom-nav")?.addEventListener("click", handleNavigationClick);
        document.getElementById("eg3-mobile-menu")?.addEventListener("click", handleNavigationClick);
        document.getElementById("desktop-sidebar")?.addEventListener("click", (event) => {
            const advanceButton = event.target.closest("[data-action='advance-week']");
            if (advanceButton) {
                advanceWeek();
                return;
            }
            handleNavigationClick(event);
        });
        document.getElementById("eg-drawer-overlay")?.addEventListener("click", (event) => {
            if (event.target.id === "eg-drawer-overlay") closeUIDrawer();
        });
        document.getElementById("eg-drawer-close")?.addEventListener("click", closeUIDrawer);
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && UIState.currentDrawer) closeUIDrawer();
        });
        document.getElementById("settings-button")?.addEventListener("click", () => switchScreen("settings"));
        if (window.EGUI) window.EGUI.bindPressFeedback(() => triggerGameFeedback("tap"));
    }

    function boot() {
        GameState = createBaseState();
        bindGlobalEvents();
        renderSplashScreen();
    }

    Object.defineProperty(window, "GameState", {
        configurable: true,
        get: () => GameState
    });
    window.startNewCareer = startNewCareer;
    window.loadCareer = loadCareer;
    window.saveCareer = saveCareer;
    window.resetCareer = resetCareer;
    window.renderDashboard = renderDashboard;
    window.renderSquad = renderSquad;
    window.renderMarket = renderMarket;
    window.renderAcademy = renderAcademy;
    window.renderMarketing = renderMarketing;
    window.renderCalendar = renderCalendar;
    window.renderNotifications = renderNotifications;
    window.renderLeague = renderLeague;
    window.renderClub = renderClub;
    window.renderStadium = renderStadium;
    window.renderStructure = renderStructure;
    window.renderSettings = renderSettings;
    window.advanceRound = advanceRound;
    window.generateSimpleMatch = generateSimpleMatch;
    window.updateLeagueTable = updateLeagueTable;
    window.switchScreen = switchScreen;
    window.calculateCurrentOverall = calculateCurrentOverall;
    window.calculateAge = calculateAge;
    window.getCareerPhase = getCareerPhase;
    window.calculateMarketValue = calculateMarketValue;
    window.renderTactics = renderTactics;
    window.applyBaseFormation = applyBaseFormation;
    window.calculateTacticalOverall = calculateTacticalOverall;
    window.inferRoleFromCoordinates = inferRoleFromCoordinates;
    window.advanceWeek = advanceWeek;
    window.addNews = addNews;
    window.openNewsDetail = openNewsDetail;
    window.openUIDrawer = openUIDrawer;
    window.closeUIDrawer = closeUIDrawer;
    window.renderPlayerDrawerContent = renderPlayerDrawerContent;
    window.maybeCreateQuestionEvent = maybeCreateQuestionEvent;
    window.answerQuestion = answerQuestion;
    window.startStadiumUpgrade = startStadiumUpgrade;
    window.startStructureUpgrade = startStructureUpgrade;

    document.addEventListener("DOMContentLoaded", boot);
})();
