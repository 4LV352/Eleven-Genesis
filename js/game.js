// =========================================================
// ELEVEN GENESIS — GAME ENGINE
// Estado do jogo, simulação de partidas, mercado, finanças.
// 100% vanilla JS. Persiste em localStorage.
// =========================================================

const STORAGE_KEY = "eleven_genesis_save_v1";

// =========================================================
// DADOS INICIAIS
// =========================================================

const CLUB_NAMES = [
  "Real Olympia", "Porto Velho FC", "Atenas United", "Aurora SC",
  "Cruzeiro Azul", "Viking FC", "Monte Belo", "São Jorge EC",
  "Norte City", "Três Lagos"
];

const FIRST_NAMES = ["Rafael", "Lucas", "Diego", "Bruno", "Gabriel", "André", "Caio", "Thiago", "Matheus", "Pedro", "João", "Vinicius", "Igor", "Samuel", "Leandro", "Gustavo", "Felipe", "Leonardo", "Marcelo", "Daniel", "Rodrigo", "Henrique", "Eduardo", "Carlos", "Alex"];
const LAST_NAMES = ["Silva", "Santos", "Costa", "Pereira", "Almeida", "Ferreira", "Oliveira", "Souza", "Lima", "Ribeiro", "Gomes", "Martins", "Rocha", "Nunes", "Cardoso", "Teixeira", "Barros", "Moraes", "Mendes", "Castro"];

const POSITIONS = ["GOL", "ZAG", "ZAG", "LE", "LD", "VOL", "VOL", "MEI", "MEI", "ATA", "ATA"];
const POSITION_COLORS = {
  GOL: "#F59E0B",
  ZAG: "#3B82F6",
  LE: "#8B5CF6",
  LD: "#8B5CF6",
  VOL: "#10B981",
  MEI: "#06B6D4",
  ATA: "#EF4444"
};

// =========================================================
// UTIL
// =========================================================
const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const makeId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `eg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
};
const fmtMoney = (m) => {
  const abs = Math.abs(m);
  const prefix = m < 0 ? "-" : "";
  if (abs >= 1) return `${prefix}€ ${abs.toFixed(1)}M`;
  return `${prefix}€ ${(abs * 1000).toFixed(0)}K`;
};

// =========================================================
// GERAÇÃO DE JOGADORES
// =========================================================
function genPlayer(tier = 70) {
  const pos = pick(POSITIONS);
  const base = clamp(tier + rnd(-12, 12), 45, 95);
  const name = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
  const age = rnd(17, 34);
  const overall = clamp(base + (age < 23 ? rnd(-2, 5) : age > 30 ? rnd(-5, 0) : 0), 45, 95);
  const pace = clamp(overall + rnd(-10, 10), 40, 99);
  const shot = clamp(overall + rnd(-15, 15), 40, 99);
  const pass = clamp(overall + rnd(-10, 10), 40, 99);
  const def = clamp(overall + rnd(-15, 15), 40, 99);
  const wage = Math.max(0.05, (overall / 100) * 0.5 + rnd(0, 20) / 100);
  const value = Math.max(0.5, (overall / 100) ** 2 * 40);
  return {
    id: makeId(),
    name, pos, age, overall, pace, shot, pass, def,
    wage: +wage.toFixed(2),
    value: +value.toFixed(1),
    morale: rnd(65, 90),
    fitness: 100,
    status: "ok"
  };
}

function genSquad(tier = 72, size = 16) {
  const squad = [];
  const posNeeded = ["GOL", "GOL", "ZAG", "ZAG", "ZAG", "LE", "LD", "VOL", "VOL", "MEI", "MEI", "MEI", "ATA", "ATA", "ATA"];
  for (let i = 0; i < size; i++) {
    const p = genPlayer(tier);
    if (posNeeded[i]) p.pos = posNeeded[i];
    squad.push(p);
  }
  return squad;
}

// =========================================================
// ESTADO INICIAL
// =========================================================
function createInitialState() {
  const opponents = CLUB_NAMES.map((name, i) => ({
    id: "club-" + i,
    name,
    tier: rnd(65, 85),
    color: ["#7c3aed", "#0ea5e9", "#eab308", "#f43f5e", "#14b8a6", "#f97316", "#a855f7", "#22c55e", "#6366f1", "#ef4444"][i % 10]
  }));

  const league = [
    { id: "genesis", name: "Genesis FC", isPlayer: true, tier: 72, color: "#D4A63A",
      P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, pts: 0 },
    ...opponents.map(c => ({ ...c, P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, pts: 0, isPlayer: false }))
  ];

  // Calendário: 10 rodadas (jogador enfrenta cada oponente 1x)
  const fixtures = opponents.map((opp, i) => ({
    id: "fx-" + i,
    round: i + 1,
    day: 1 + i * 7,
    homeId: i % 2 === 0 ? "genesis" : opp.id,
    awayId: i % 2 === 0 ? opp.id : "genesis",
    played: false,
    result: null
  }));

  return {
    day: 1,
    season: "2025/26",
    weekIncome: 1.2,
    reputation: 3,
    balance: 25.0,
    squad: genSquad(72, 16),
    league,
    fixtures,
    market: genSquad(75, 8).map(p => ({ ...p, asking: +(p.value * (1 + Math.random() * 0.4)).toFixed(1) })),
    news: [
      { id: "n0", type: "important", time: "Agora", title: "Bem-vindo ao Genesis FC", excerpt: "Sua missão: levar o clube ao título da Primeira Liga." }
    ],
    transactions: [
      { day: 1, label: "Patrocínio inicial", amount: 25.0 }
    ],
    form: [],
    lastMatch: null
  };
}

// =========================================================
// LOAD / SAVE
// =========================================================
function loadGame() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    return JSON.parse(raw);
  } catch (e) {
    return createInitialState();
  }
}

function saveGame(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) { /* silent */ }
}

function resetGame() {
  localStorage.removeItem(STORAGE_KEY);
  return createInitialState();
}

// =========================================================
// CLUBES
// =========================================================
function getClub(state, id) {
  return state.league.find(c => c.id === id);
}
function getMyClub(state) {
  return state.league.find(c => c.isPlayer);
}

// =========================================================
// SIMULAÇÃO DE PARTIDA
// =========================================================
function simulateMatch(state, fixture) {
  const home = getClub(state, fixture.homeId);
  const away = getClub(state, fixture.awayId);
  const playerClub = getMyClub(state);

  // Força do elenco do jogador baseada no overall médio
  const avgOverall = state.squad.reduce((s, p) => s + p.overall, 0) / Math.max(1, state.squad.length);
  const avgMorale = state.squad.reduce((s, p) => s + p.morale, 0) / Math.max(1, state.squad.length);

  const homeStr = home.isPlayer
    ? avgOverall * 0.8 + avgMorale * 0.1 + 3 // fator casa
    : home.tier + rnd(-5, 5);
  const awayStr = away.isPlayer
    ? avgOverall * 0.8 + avgMorale * 0.1
    : away.tier + rnd(-5, 5);

  const homeExp = (homeStr / (homeStr + awayStr)) * 3.2;
  const awayExp = (awayStr / (homeStr + awayStr)) * 2.8;

  const homeGoals = Math.max(0, Math.round(homeExp + (Math.random() - 0.5) * 2.2));
  const awayGoals = Math.max(0, Math.round(awayExp + (Math.random() - 0.5) * 2.0));

  const result = {
    fixtureId: fixture.id,
    homeId: home.id,
    awayId: away.id,
    homeName: home.name,
    awayName: away.name,
    homeColor: home.color,
    awayColor: away.color,
    homeGoals,
    awayGoals,
    day: fixture.day,
    competition: `Primeira Liga · Rodada ${fixture.round}`
  };

  // Atualizar tabela
  home.P++; away.P++;
  home.GF += homeGoals; home.GA += awayGoals;
  away.GF += awayGoals; away.GA += homeGoals;
  if (homeGoals > awayGoals) { home.W++; away.L++; home.pts += 3; }
  else if (homeGoals < awayGoals) { away.W++; home.L++; away.pts += 3; }
  else { home.D++; away.D++; home.pts++; away.pts++; }

  // Marcar fixture como jogado
  fixture.played = true;
  fixture.result = result;

  // Se o jogador participou, atualizar form, moral, finanças
  if (home.isPlayer || away.isPlayer) {
    const myGoals = home.isPlayer ? homeGoals : awayGoals;
    const theirGoals = home.isPlayer ? awayGoals : homeGoals;
    let outcome;
    if (myGoals > theirGoals) {
      outcome = "W";
      playerClub.pts; // (já atualizado acima)
      state.balance += 0.8;
      state.transactions.unshift({ day: state.day, label: `Prêmio de vitória vs ${home.isPlayer ? away.name : home.name}`, amount: 0.8 });
      state.squad.forEach(p => p.morale = clamp(p.morale + rnd(3, 8), 0, 100));
      state.news.unshift({ id: "n" + Date.now(), type: "important", time: "Pós-jogo", title: `Vitória por ${myGoals}×${theirGoals}!`, excerpt: "A torcida celebra o resultado. Moral em alta." });
    } else if (myGoals < theirGoals) {
      outcome = "L";
      state.squad.forEach(p => p.morale = clamp(p.morale - rnd(5, 12), 0, 100));
      state.news.unshift({ id: "n" + Date.now(), type: "urgent", time: "Pós-jogo", title: `Derrota por ${myGoals}×${theirGoals}`, excerpt: "Diretoria pede reação imediata. Moral em queda." });
    } else {
      outcome = "D";
      state.balance += 0.3;
      state.transactions.unshift({ day: state.day, label: `Empate vs ${home.isPlayer ? away.name : home.name}`, amount: 0.3 });
      state.squad.forEach(p => p.morale = clamp(p.morale + rnd(-3, 3), 0, 100));
      state.news.unshift({ id: "n" + Date.now(), type: "info", time: "Pós-jogo", title: `Empate em ${myGoals}×${theirGoals}`, excerpt: "Um ponto somado. Poderia ser melhor." });
    }
    state.form.push(outcome);
    if (state.form.length > 5) state.form.shift();
    state.lastMatch = result;
  }

  simulateOtherMatches(state, fixture.round);

  // Limitar notícias a 10
  if (state.news.length > 10) state.news = state.news.slice(0, 10);
  if (state.transactions.length > 20) state.transactions = state.transactions.slice(0, 20);

  return result;
}

// =========================================================
// SIMULAR OUTROS JOGOS DA RODADA (para realismo da tabela)
// =========================================================
function simulateOtherMatches(state, currentRound) {
  state.simulatedRounds = state.simulatedRounds || [];
  if (state.simulatedRounds.includes(currentRound)) return;
  const clubs = state.league.filter(c => !c.isPlayer);
  for (let i = 0; i < clubs.length - 1; i += 2) {
    const home = clubs[(i + currentRound) % clubs.length];
    const away = clubs[(i + currentRound + 1) % clubs.length];
    if (!home || !away || home.id === away.id) continue;
    const homeGoals = Math.max(0, Math.round((home.tier / 80) + Math.random() * 2.2));
    const awayGoals = Math.max(0, Math.round((away.tier / 85) + Math.random() * 2));
    home.P++; away.P++;
    home.GF += homeGoals; home.GA += awayGoals;
    away.GF += awayGoals; away.GA += homeGoals;
    if (homeGoals > awayGoals) { home.W++; away.L++; home.pts += 3; }
    else if (homeGoals < awayGoals) { away.W++; home.L++; away.pts += 3; }
    else { home.D++; away.D++; home.pts++; away.pts++; }
  }
  state.simulatedRounds.push(currentRound);
}

// =========================================================
// AVANÇAR DIA
// =========================================================
function advanceDay(state) {
  state.day++;
  // Renda semanal a cada 7 dias
  if (state.day % 7 === 0) {
    const wages = state.squad.reduce((s, p) => s + p.wage, 0);
    const profit = state.weekIncome - wages;
    state.balance += profit;
    state.transactions.unshift({ day: state.day, label: "Receita semanal", amount: state.weekIncome });
    state.transactions.unshift({ day: state.day, label: "Folha salarial", amount: -wages });
    // Pequeno evento aleatório
    if (Math.random() < 0.3) {
      const events = [
        { type: "info", title: "Patrocinador bônus", excerpt: "Bônus por desempenho: +€ 500K", amount: 0.5 },
        { type: "info", title: "Loja do clube", excerpt: "Vendas de camisa acima do esperado.", amount: 0.3 }
      ];
      const ev = pick(events);
      state.balance += ev.amount;
      state.transactions.unshift({ day: state.day, label: ev.title, amount: ev.amount });
      state.news.unshift({ id: "n" + Date.now() + Math.random(), type: ev.type, time: `Dia ${state.day}`, title: ev.title, excerpt: ev.excerpt });
    }
  }
  return state;
}

// =========================================================
// MERCADO
// =========================================================
function buyPlayer(state, playerId) {
  const idx = state.market.findIndex(p => p.id === playerId);
  if (idx < 0) return { ok: false, msg: "Jogador não encontrado." };
  const p = state.market[idx];
  if (state.balance < p.asking) return { ok: false, msg: "Saldo insuficiente." };
  if (state.squad.length >= 25) return { ok: false, msg: "Elenco cheio (máx. 25)." };

  state.balance -= p.asking;
  state.transactions.unshift({ day: state.day, label: `Contratação: ${p.name}`, amount: -p.asking });
  state.squad.push({ ...p, morale: 80 });
  state.market.splice(idx, 1);
  state.news.unshift({
    id: "n" + Date.now(),
    type: "important",
    time: `Dia ${state.day}`,
    title: `${p.name} é o novo reforço!`,
    excerpt: `${p.pos}, ${p.age} anos, overall ${p.overall}. Custo: ${fmtMoney(p.asking)}.`
  });
  return { ok: true, msg: `${p.name} contratado!` };
}

function sellPlayer(state, playerId) {
  const idx = state.squad.findIndex(p => p.id === playerId);
  if (idx < 0) return { ok: false, msg: "Jogador não encontrado." };
  if (state.squad.length <= 11) return { ok: false, msg: "Elenco mínimo é 11." };
  const p = state.squad[idx];
  const offer = +(p.value * (0.8 + Math.random() * 0.4)).toFixed(1);
  state.balance += offer;
  state.transactions.unshift({ day: state.day, label: `Venda: ${p.name}`, amount: offer });
  state.squad.splice(idx, 1);
  state.news.unshift({
    id: "n" + Date.now(),
    type: "info",
    time: `Dia ${state.day}`,
    title: `${p.name} deixa o clube`,
    excerpt: `Vendido por ${fmtMoney(offer)}.`
  });
  return { ok: true, msg: `${p.name} vendido por ${fmtMoney(offer)}.` };
}

// =========================================================
// REFRESH DE MERCADO
// =========================================================
function refreshMarket(state) {
  if (state.balance < 0.1) return { ok: false, msg: "Sem saldo para prospectar." };
  state.balance -= 0.1;
  state.transactions.unshift({ day: state.day, label: "Prospecção de mercado", amount: -0.1 });
  state.market = genSquad(rnd(65, 85), 8).map(p => ({
    ...p,
    asking: +(p.value * (1 + Math.random() * 0.5)).toFixed(1)
  }));
  return { ok: true, msg: "Novos jogadores disponíveis!" };
}

// =========================================================
// TABELA
// =========================================================
function getLeagueTable(state) {
  return [...state.league].sort((a, b) =>
    b.pts - a.pts || (b.GF - b.GA) - (a.GF - a.GA) || b.GF - a.GF
  );
}

// =========================================================
// NEXT MATCH
// =========================================================
function getNextFixture(state) {
  return state.fixtures.find(f => !f.played);
}

// =========================================================
// RESET
// =========================================================
function newGame() {
  return resetGame();
}

// Exporta helpers
const GameUtil = { fmtMoney, rnd, pick, clamp, POSITION_COLORS };

window.Game = {
  loadGame,
  saveGame,
  resetGame,
  getClub,
  getMyClub,
  simulateMatch,
  simulateOtherMatches,
  advanceDay,
  buyPlayer,
  sellPlayer,
  refreshMarket,
  getLeagueTable,
  getNextFixture,
  newGame,
  GameUtil
};
