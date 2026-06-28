// =========================================================
// ELEVEN GENESIS — MAIN CONTROLLER
// UI, navegação, render, eventos. 100% vanilla JS.
// =========================================================
const Game = window.Game;

let state = Game.loadGame();
let currentView = "club";

// =========================================================
// HELPERS
// =========================================================
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const fmtMoney = Game.GameUtil.fmtMoney;
const POS_COLORS = Game.GameUtil.POSITION_COLORS;
let booted = false;

function crestSVG(color = "#D4A63A", text = "11", size = "lg") {
  return `<svg class="eg-crest eg-crest--${size}" viewBox="0 0 40 48">
    <path d="M20 2 L38 8 V26 C38 38 28 44 20 46 C12 44 2 38 2 26 V8 Z" fill="#071A12" stroke="${color}" stroke-width="1.5"/>
    <text x="20" y="30" font-family="Bebas Neue" font-size="16" fill="${color}" text-anchor="middle">${text}</text>
  </svg>`;
}

function toast(msg, type = "info") {
  const t = $("#toast");
  t.textContent = msg;
  t.className = `eg-toast eg-toast--${type} eg-toast--show`;
  if (navigator.vibrate) navigator.vibrate(15);
  setTimeout(() => t.classList.remove("eg-toast--show"), 2400);
}

function openModal() { $("#modalMatch").classList.add("eg-modal--open"); }
function closeModal() { $("#modalMatch").classList.remove("eg-modal--open"); }

// =========================================================
// NAV
// =========================================================
function navigate(view) {
  currentView = view;
  $$(".eg-view").forEach((v) => (v.style.display = v.dataset.view === view ? "" : "none"));
  $$("#bottomNav .eg-nav-bottom__item").forEach((b) => {
    const isActive = b.dataset.nav === view;
    b.classList.toggle("eg-nav-bottom__item--active", isActive);
    if (isActive) b.setAttribute("aria-current", "page");
    else b.removeAttribute("aria-current");
  });
  const titles = { club: "Genesis FC", squad: "Elenco", matches: "Jogos", market: "Mercado", finance: "Finanças" };
  $("#headerTitle").textContent = titles[view];
  $("#headerBadge").textContent = `Dia ${state.day}`;
  render(view);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// =========================================================
// RENDER: CLUB
// =========================================================
function renderClub() {
  const me = Game.getMyClub(state);
  const next = Game.getNextFixture(state);
  const pos = Game.getLeagueTable(state).findIndex((c) => c.isPlayer) + 1;
  const avgMorale = Math.round(state.squad.reduce((s, p) => s + p.morale, 0) / Math.max(1, state.squad.length));

  // Hero de partida
  if (next) {
    const home = Game.getClub(state, next.homeId);
    const away = Game.getClub(state, next.awayId);
    $("#matchCompetition").textContent = `Primeira Liga · Rodada ${next.round}`;
    $("#homeCrest").innerHTML = crestSVG(home.color, home.isPlayer ? "11" : home.name.slice(0, 3).toUpperCase());
    $("#awayCrest").innerHTML = crestSVG(away.color, away.isPlayer ? "11" : away.name.slice(0, 3).toUpperCase());
    $("#homeTeamName").textContent = home.name;
    $("#awayTeamName").textContent = away.name;
    $("#awayPosition").textContent = `${Game.getLeagueTable(state).findIndex(c => c.id === away.id) + 1}º`;
    const daysTo = next.day - state.day;
    $("#matchCountdown").innerHTML = daysTo > 0 ? `● em ${daysTo} dia${daysTo > 1 ? "s" : ""}` : `● Hoje`;
    $("#matchMeta").innerHTML = `<strong>DIA ${next.day} · 20:30</strong> · ${next.homeId === "genesis" ? "Arena Genesis" : "Fora"}`;
    $("#btnPlayMatch").textContent = daysTo > 0 ? `Avançar ${daysTo} dia${daysTo > 1 ? "s" : ""}` : "Jogar partida";
  } else {
    $("#matchCompetition").textContent = "FIM DA TEMPORADA";
    $("#matchCountdown").innerHTML = "● Encerrada";
    $("#homeTeamName").textContent = "Temporada";
    $("#awayTeamName").textContent = "Concluída";
    $("#btnPlayMatch").textContent = "Nova temporada";
  }

  // Stats
  $("#seasonStats").innerHTML = `
    <div class="eg-stat-card"><span class="eg-stat-card__label">Posição</span><span class="eg-stat-card__value">${pos}º</span></div>
    <div class="eg-stat-card"><span class="eg-stat-card__label">Pontos</span><span class="eg-stat-card__value">${me.pts}</span></div>
    <div class="eg-stat-card"><span class="eg-stat-card__label">Saldo</span><span class="eg-stat-card__value">${me.GF - me.GA >= 0 ? "+" : ""}${me.GF - me.GA}</span></div>
    <div class="eg-stat-card"><span class="eg-stat-card__label">Moral</span><span class="eg-stat-card__value">${avgMorale}</span></div>`;

  // Form
  const fg = $("#formGroup");
  fg.innerHTML = state.form.length === 0
    ? `<span class="eg-text-muted" style="font-size:var(--text-sm)">Ainda sem jogos</span>`
    : state.form.map((r) => {
        const letter = r === "W" ? "V" : r === "L" ? "D" : "E";
        return `<span class="eg-form eg-form--${r}">${letter}</span>`;
      }).join("");
  const W = state.form.filter(r => r === "W").length;
  const D = state.form.filter(r => r === "D").length;
  const L = state.form.filter(r => r === "L").length;
  $("#formSummary").textContent = state.form.length
    ? `${W} vitórias · ${D} empates · ${L} derrotas nos últimos ${state.form.length}`
    : "Sua primeira partida se aproxima.";

  // News
  $("#newsStack").innerHTML = state.news.map((n) => `
    <article class="eg-news eg-news--${n.type}">
      <div>
        <div class="eg-news__time">${n.type === "urgent" ? "● Urgente" : n.type === "important" ? "Importante" : "Info"} · ${n.time}</div>
        <h3 class="eg-news__title">${n.title}</h3>
        <p class="eg-news__excerpt">${n.excerpt}</p>
      </div>
    </article>`).join("");
}

// =========================================================
// RENDER: SQUAD
// =========================================================
function renderSquad() {
  $("#squadCount").textContent = `${state.squad.length} jogadores`;
  const sorted = [...state.squad].sort((a, b) => b.overall - a.overall);
  $("#squadList").innerHTML = sorted.map((p) => `
    <div class="eg-card eg-card--interactive" data-player="${p.id}" style="padding:var(--space-4)">
      <div class="eg-flex eg-items-center eg-gap-3">
        <div style="width:44px;height:44px;border-radius:var(--radius-lg);background:linear-gradient(135deg,${POS_COLORS[p.pos] || "#555"} 0%,rgba(0,0,0,.4) 100%);display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:var(--text-sm);color:white;letter-spacing:var(--tracking-display);flex-shrink:0">${p.pos}</div>
        <div style="flex:1;min-width:0">
          <div class="eg-display eg-text-strong" style="font-size:var(--text-lg);line-height:1.1">${p.name}</div>
          <div class="eg-text-muted" style="font-size:var(--text-xs)">${p.age} anos · ${fmtMoney(p.wage)}/sem · valor ${fmtMoney(p.value)}</div>
        </div>
        <div style="text-align:right">
          <div style="font-family:var(--font-display);font-size:var(--text-4xl);line-height:1;letter-spacing:var(--tracking-display);color:${p.overall >= 80 ? "var(--c-accent)" : p.overall >= 70 ? "var(--c-primary)" : "var(--c-text-strong)"}">${p.overall}</div>
          <div class="eg-text-muted" style="font-size:var(--text-xs);text-transform:uppercase">OVR</div>
        </div>
      </div>
      <div class="eg-mt-4" style="display:flex;flex-direction:column;gap:6px">
        <div class="eg-stat"><span class="eg-stat__label" style="min-width:60px">RIT</span><div class="eg-bar eg-bar--thin" style="flex:1"><div class="eg-bar__fill" style="width:${p.pace}%"></div></div><span class="eg-stat__value" style="font-size:var(--text-sm)">${p.pace}</span></div>
        <div class="eg-stat"><span class="eg-stat__label" style="min-width:60px">FIN</span><div class="eg-bar eg-bar--thin" style="flex:1"><div class="eg-bar__fill" style="width:${p.shot}%"></div></div><span class="eg-stat__value" style="font-size:var(--text-sm)">${p.shot}</span></div>
        <div class="eg-stat"><span class="eg-stat__label" style="min-width:60px">PAS</span><div class="eg-bar eg-bar--thin" style="flex:1"><div class="eg-bar__fill" style="width:${p.pass}%"></div></div><span class="eg-stat__value" style="font-size:var(--text-sm)">${p.pass}</span></div>
        <div class="eg-stat"><span class="eg-stat__label" style="min-width:60px">DEF</span><div class="eg-bar eg-bar--thin" style="flex:1"><div class="eg-bar__fill" style="width:${p.def}%"></div></div><span class="eg-stat__value" style="font-size:var(--text-sm)">${p.def}</span></div>
      </div>
      <div class="eg-flex eg-justify-between eg-items-center eg-mt-4" style="padding-top:var(--space-3);border-top:var(--border-soft)">
        <div>
          <div class="eg-text-muted" style="font-size:var(--text-xs);text-transform:uppercase">Moral</div>
          <div class="eg-bar eg-bar--thin" style="width:120px;margin-top:4px"><div class="eg-bar__fill ${p.morale < 50 ? "eg-bar--danger" : p.morale > 75 ? "eg-bar--gold" : ""}" style="width:${p.morale}%"></div></div>
        </div>
        <button class="eg-btn eg-btn--danger eg-btn--sm" data-action="sell" data-id="${p.id}">Vender</button>
      </div>
    </div>`).join("");

  // Liga botões de vender
  $$("#squadList [data-action='sell']").forEach((b) => {
    b.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = b.dataset.id;
      const p = state.squad.find(x => x.id === id);
      if (!p) return;
      if (!confirm(`Vender ${p.name} por aproximadamente ${fmtMoney(p.value)}?`)) return;
      const res = Game.sellPlayer(state, id);
      Game.saveGame(state);
      toast(res.msg, res.ok ? "success" : "error");
      renderSquad();
    });
  });
}

// =========================================================
// RENDER: MATCHES
// =========================================================
function renderMatches() {
  const table = Game.getLeagueTable(state);
  $("#leagueTable").innerHTML = `
    <thead>
      <tr><th>#</th><th>Clube</th><th class="eg-table__num">J</th><th class="eg-table__num">V</th><th class="eg-table__num">E</th><th class="eg-table__num">D</th><th class="eg-table__num">SG</th><th class="eg-table__num">Pts</th></tr>
    </thead>
    <tbody>
      ${table.map((c, i) => `
        <tr class="${c.isPlayer ? "eg-table__row--highlight" : ""}">
          <td class="eg-table__num">${i + 1}</td>
          <td><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${c.color};margin-right:8px;vertical-align:middle"></span>${c.isPlayer ? `<strong>${c.name}</strong>` : c.name}</td>
          <td class="eg-table__num">${c.P}</td>
          <td class="eg-table__num">${c.W}</td>
          <td class="eg-table__num">${c.D}</td>
          <td class="eg-table__num">${c.L}</td>
          <td class="eg-table__num">${c.GF - c.GA >= 0 ? "+" : ""}${c.GF - c.GA}</td>
          <td class="eg-table__num"><strong>${c.pts}</strong></td>
        </tr>`).join("")}
    </tbody>`;

  const next = state.fixtures.filter(f => !f.played).slice(0, 5);
  $("#fixturesList").innerHTML = next.length === 0
    ? `<div class="eg-card eg-text-muted">Sem jogos restantes.</div>`
    : next.map((f) => {
        const home = Game.getClub(state, f.homeId);
        const away = Game.getClub(state, f.awayId);
        return `
          <div class="eg-card" style="padding:var(--space-4)">
            <div class="eg-text-muted" style="font-size:var(--text-xs);text-transform:uppercase;letter-spacing:.05em">Rodada ${f.round} · Dia ${f.day}</div>
            <div class="eg-flex eg-items-center eg-justify-between eg-mt-2">
              <div class="eg-flex eg-items-center eg-gap-2" style="flex:1"><span>${crestSVG(home.color, home.isPlayer ? "11" : home.name.slice(0,3).toUpperCase(), "sm")}</span><span class="eg-display eg-text-strong">${home.name}</span></div>
              <div class="eg-text-muted" style="font-size:var(--text-sm)">vs</div>
              <div class="eg-flex eg-items-center eg-gap-2 eg-justify-between" style="flex:1;justify-content:flex-end"><span class="eg-display eg-text-strong">${away.name}</span><span>${crestSVG(away.color, away.isPlayer ? "11" : away.name.slice(0,3).toUpperCase(), "sm")}</span></div>
            </div>
          </div>`;
      }).join("");

  const past = state.fixtures.filter(f => f.played).reverse().slice(0, 5);
  $("#resultsList").innerHTML = past.length === 0
    ? `<div class="eg-card eg-text-muted">Nenhum resultado ainda.</div>`
    : past.map((f) => {
        const r = f.result;
        const myHome = r.homeId === "genesis";
        const myGoals = myHome ? r.homeGoals : r.awayGoals;
        const thGoals = myHome ? r.awayGoals : r.homeGoals;
        const outcome = myGoals > thGoals ? "W" : myGoals < thGoals ? "L" : "D";
        return `
          <div class="eg-card" style="padding:var(--space-4)">
            <div class="eg-flex eg-justify-between eg-items-center">
              <div class="eg-text-muted" style="font-size:var(--text-xs);text-transform:uppercase">Rodada ${f.round}</div>
              <span class="eg-form eg-form--${outcome}">${outcome === "W" ? "V" : outcome === "L" ? "D" : "E"}</span>
            </div>
            <div class="eg-score" style="font-size:var(--text-3xl);margin-top:var(--space-2)">
              <span>${r.homeName}</span>
              <span>${r.homeGoals}</span>
              <span class="eg-score__sep">×</span>
              <span>${r.awayGoals}</span>
              <span>${r.awayName}</span>
            </div>
          </div>`;
      }).join("");
}

// =========================================================
// RENDER: MARKET
// =========================================================
function renderMarket() {
  $("#marketBudget").textContent = fmtMoney(state.balance);
  $("#marketList").innerHTML = `
    <div class="eg-flex eg-gap-2 eg-mt-2" style="margin-bottom:var(--space-4)">
      <button class="eg-btn eg-btn--secondary eg-btn--sm" id="btnRefreshMarket">Prospectar (€ 100K)</button>
    </div>
    ${state.market.map((p) => `
      <div class="eg-card" style="padding:var(--space-4)">
        <div class="eg-flex eg-items-center eg-gap-3">
          <div style="width:44px;height:44px;border-radius:var(--radius-lg);background:linear-gradient(135deg,${POS_COLORS[p.pos] || "#555"} 0%,rgba(0,0,0,.4) 100%);display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:var(--text-sm);color:white;letter-spacing:var(--tracking-display);flex-shrink:0">${p.pos}</div>
          <div style="flex:1;min-width:0">
            <div class="eg-display eg-text-strong" style="font-size:var(--text-lg)">${p.name}</div>
            <div class="eg-text-muted" style="font-size:var(--text-xs)">${p.age} anos · OVR ${p.overall} · ${fmtMoney(p.wage)}/sem</div>
          </div>
          <div style="text-align:right">
            <div class="eg-text-gold eg-display" style="font-size:var(--text-xl);line-height:1">${fmtMoney(p.asking)}</div>
            <div class="eg-text-muted" style="font-size:var(--text-xs)">pedido</div>
          </div>
        </div>
        <div class="eg-mt-4">
          <button class="eg-btn ${state.balance >= p.asking ? "eg-btn--primary" : "eg-btn--secondary"} eg-btn--sm eg-btn--block" data-action="buy" data-id="${p.id}" ${state.balance < p.asking ? "disabled" : ""}>
            ${state.balance >= p.asking ? "Contratar" : "Sem saldo"}
          </button>
        </div>
      </div>`).join("")}`;

  $("#btnRefreshMarket").addEventListener("click", () => {
    const res = Game.refreshMarket(state);
    Game.saveGame(state);
    toast(res.msg, res.ok ? "success" : "error");
    renderMarket();
  });
  $$("#marketList [data-action='buy']").forEach((b) => {
    b.addEventListener("click", () => {
      const id = b.dataset.id;
      const res = Game.buyPlayer(state, id);
      Game.saveGame(state);
      toast(res.msg, res.ok ? "success" : "error");
      renderMarket();
    });
  });
}

// =========================================================
// RENDER: FINANCE
// =========================================================
function renderFinance() {
  const wages = state.squad.reduce((s, p) => s + p.wage, 0);
  const profit = state.weekIncome - wages;
  $("#finBalance").textContent = fmtMoney(state.balance);
  $("#finIncome").textContent = fmtMoney(state.weekIncome);
  $("#finWages").textContent = fmtMoney(wages);
  const pEl = $("#finProfit");
  pEl.textContent = fmtMoney(profit);
  pEl.style.color = profit >= 0 ? "var(--c-primary)" : "var(--c-loss)";
  $("#finRep").textContent = "★".repeat(state.reputation) + "☆".repeat(5 - state.reputation);

  $("#transactionsList").innerHTML = state.transactions.slice(0, 10).map((t) => `
    <div class="eg-flex eg-justify-between eg-items-center" style="padding:var(--space-2) 0;border-bottom:var(--border-soft)">
      <div>
        <div class="eg-text-strong" style="font-size:var(--text-sm)">${t.label}</div>
        <div class="eg-text-muted" style="font-size:var(--text-xs)">Dia ${t.day}</div>
      </div>
      <div class="eg-num" style="color:${t.amount >= 0 ? "var(--c-primary)" : "var(--c-loss)"}">
        ${t.amount >= 0 ? "+" : ""}${fmtMoney(t.amount)}
      </div>
    </div>`).join("") || `<div class="eg-text-muted">Sem transações ainda.</div>`;
}

// =========================================================
// DISPATCH
// =========================================================
function render(view = currentView) {
  switch (view) {
    case "club": renderClub(); break;
    case "squad": renderSquad(); break;
    case "matches": renderMatches(); break;
    case "market": renderMarket(); break;
    case "finance": renderFinance(); break;
  }
  $("#headerBadge").textContent = `Dia ${state.day}`;
}

// =========================================================
// PARTIDA — avançar dia até jogo e simular
// =========================================================
async function handlePlayMatch() {
  const next = Game.getNextFixture(state);
  if (!next) {
    // Nova temporada
    if (confirm("Iniciar nova temporada? O progresso atual será substituído.")) {
      state = Game.newGame();
      Game.saveGame(state);
      toast("Nova temporada iniciada!", "success");
      navigate("club");
    }
    return;
  }

  const daysTo = next.day - state.day;
  if (daysTo > 0) {
    // Avançar dias
    for (let i = 0; i < daysTo; i++) Game.advanceDay(state);
    Game.saveGame(state);
    toast(`+${daysTo} dia${daysTo > 1 ? "s" : ""} avançado${daysTo > 1 ? "s" : ""}`, "info");
    renderClub();
    // Scroll pro botão
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  // Dia do jogo — mostrar loading e simular
  showSplash("Aquecendo os jogadores…");
  await delay(900);
  updateSplash("Analisando o adversário…");
  await delay(700);
  updateSplash("Entrando em campo…");
  await delay(700);

  const result = Game.simulateMatch(state, next);
  Game.advanceDay(state);
  Game.saveGame(state);

  hideSplash();
  showMatchModal(result);
}

function showMatchModal(r) {
  $("#modalCompetition").textContent = r.competition;
  $("#modalHomeCrest").innerHTML = crestSVG(r.homeColor, r.homeName.slice(0, 3).toUpperCase(), "lg");
  $("#modalAwayCrest").innerHTML = crestSVG(r.awayColor, r.awayName.slice(0, 3).toUpperCase(), "lg");
  $("#modalHomeName").textContent = r.homeName;
  $("#modalAwayName").textContent = r.awayName;
  $("#modalHomeScore").textContent = r.homeGoals;
  $("#modalAwayScore").textContent = r.awayGoals;
  const myHome = r.homeId === "genesis";
  const myG = myHome ? r.homeGoals : r.awayGoals;
  const thG = myHome ? r.awayGoals : r.homeGoals;
  let status, statusColor;
  if (myG > thG) { status = "VITÓRIA!"; statusColor = "var(--c-primary)"; }
  else if (myG < thG) { status = "DERROTA"; statusColor = "var(--c-loss)"; }
  else { status = "EMPATE"; statusColor = "var(--c-draw)"; }
  const st = $("#modalStatus");
  st.textContent = status;
  st.style.color = statusColor;

  $("#modalSummary").innerHTML = `
    <div class="eg-flex eg-justify-between eg-items-center">
      <span class="eg-text-muted">Competição</span>
      <span class="eg-text-strong">${r.competition}</span>
    </div>
    <div class="eg-flex eg-justify-between eg-items-center" style="margin-top:var(--space-2)">
      <span class="eg-text-muted">Resultado</span>
      <span class="eg-text-strong">${status}</span>
    </div>
    <div class="eg-flex eg-justify-between eg-items-center" style="margin-top:var(--space-2)">
      <span class="eg-text-muted">Prêmio</span>
      <span class="eg-text-strong">${myG > thG ? "+€ 800K" : myG < thG ? "—" : "+€ 300K"}</span>
    </div>`;
  openModal();
}

// =========================================================
// SPLASH
// =========================================================
function showSplash(label = "Carregando…") {
  const s = $("#splash");
  if (!s) return;
  $("#splashLabel").textContent = label;
  s.style.display = "flex";
  s.style.opacity = "1";
}
function updateSplash(label) { $("#splashLabel").textContent = label; }
function hideSplash() {
  const s = $("#splash");
  if (!s) return;
  s.style.transition = "opacity 400ms ease";
  s.style.opacity = "0";
  setTimeout(() => (s.style.display = "none"), 400);
}
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// =========================================================
// BOOT
// =========================================================
function bindEvents() {
  // Bottom nav
  $$("#bottomNav .eg-nav-bottom__item").forEach((b) => {
    b.addEventListener("click", () => navigate(b.dataset.nav));
  });
  // Play match
  $("#btnPlayMatch").addEventListener("click", handlePlayMatch);
  $("#btnGoTable").addEventListener("click", () => navigate("matches"));
  $("#btnNewCareer").addEventListener("click", () => {
    if (!confirm("Iniciar uma nova carreira? O save atual será apagado.")) return;
    state = Game.newGame();
    Game.saveGame(state);
    toast("Nova carreira iniciada.", "success");
    navigate("club");
  });
  // Modal
  $("#btnModalClose").addEventListener("click", () => {
    closeModal();
    navigate("club");
  });
  $("#modalMatch .eg-modal__backdrop").addEventListener("click", () => {
    closeModal();
    navigate("club");
  });
  // Teclado (atalhos desktop)
  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    const map = { "1": "club", "2": "squad", "3": "matches", "4": "market", "5": "finance" };
    if (map[e.key]) navigate(map[e.key]);
    if (e.key === " " && currentView === "club") { e.preventDefault(); handlePlayMatch(); }
    if (e.key === "Escape") closeModal();
  });
}

function boot() {
  if (booted) return;
  booted = true;

  try {
    if (!Game) throw new Error("Game engine indisponível.");
    bindEvents();
    setTimeout(() => {
      $("#app").style.display = "";
      hideSplash();
      navigate("club");
    }, 300);
  } catch (error) {
    console.error(error);
    const label = $("#splashLabel");
    if (label) label.textContent = "Não foi possível carregar. Recarregue o jogo.";
    const app = $("#app");
    if (app) app.style.display = "";
    hideSplash();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
