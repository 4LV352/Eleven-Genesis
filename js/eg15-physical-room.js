(function(){
  'use strict';

  const SAVE_KEY = 'legendsDirectorSave';
  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
  let lastStamp = '';
  let bypassOffer = false;

  const insights = [
    ['1970', 'Olheiros ainda viajam de ônibus, trem e avião pequeno. Um relatório confiável pode levar semanas para chegar.'],
    ['Rádio AM', 'Muitos torcedores acompanham jogos pelo rádio. A narração cria ídolos antes da televisão mostrar o rosto deles.'],
    ['Mercado', 'Contratações dependem de telefonema, carta, telegrama e reputação pessoal. Informação perfeita não existe.'],
    ['Gramado', 'Chuva e barro mudam o jogo. Um time técnico pode virar um time de disputa em noventa minutos.'],
    ['Jornal', 'A manchete de segunda-feira pesa no vestiário. Às vezes ela motiva; às vezes ela divide.'],
    ['Viagem', 'Estradas longas e hotéis simples afetam preparo, humor e concentração. O calendário também é adversário.'],
    ['Televisão', 'A TV começa a mudar a economia do futebol, mas nem todo jogo aparece. Carisma ainda viaja pelo rádio e pelo jornal.'],
    ['Vestiário', 'Números ajudam pouco quando o capitão perdeu confiança. Em 1970, leitura humana vale tanto quanto estatística.']
  ];

  const radioLines = [
    'Rádio Genesis: linha chiando, mas a notícia chegou — o rival treinou portões fechados.',
    'Plantão esportivo: chuva prevista. O gramado pode pedir menos brilho e mais coragem.',
    'Da cabine: a torcida quer raça, mas a diretoria quer equilíbrio no caixa.',
    'Boletim AM: um olheiro voltou com três nomes e nenhuma certeza.',
    'Intervalo musical: café frio, papel amassado e uma escalação ainda sem resposta.'
  ];

  const drawerCopy = {
    tactics: ['Quadro negro', 'Giz, imãs e setas tortas. A pergunta não é só qual formação usar, mas quem aguenta executá-la quando o campo pesar.'],
    market: ['Fichário do mercado', 'Nenhum jogador está à venda como produto de prateleira. Primeiro vem o rumor, depois o telefonema, depois a espera.'],
    scout: ['Envelope do olheiro', 'O relatório chega incompleto: uma frase sobre técnica, outra sobre temperamento e uma mancha de café no canto.'],
    league: ['Jornal esportivo', 'A tabela não é só pontuação. É manchete, pressão, boato de bastidor e rival que cresce no rádio.'],
    calendar: ['Mural com alfinetes', 'A semana tem treino, viagem, hotel, chuva, rumor e partida. O jogo começa antes do apito.'],
    marketing: ['Rádio e cartazes', 'Patrocínio em 1970 passa por reputação local, jornal de bairro, camisa na rua e voz de locutor.'],
    club: ['Pasta administrativa', 'Obra, dívida, arquibancada e diretoria. O clube é uma instituição antes de ser uma tela.'],
    squad: ['Fichas do elenco', 'Cada atleta deve parecer uma pessoa: humor, medo, liderança, irritação e memória de jogo grande.']
  };

  function readSave(){
    try { return JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch(e){ return null; }
  }
  function seed(){
    const save = readSave();
    return ((save && (save.week || save.round || save.currentRound || 1)) || 1) + new Date().getDate();
  }
  function pick(list, n=seed()) { return list[Math.abs(n) % list.length]; }
  function screenRoot(){ return document.getElementById('screen-root'); }
  function activeScreenName(){
    const active = $('.desktop-nav-button.active, .nav-button.active');
    return active?.dataset?.screen || readSave()?.currentScreen || '';
  }

  function ensureRadio(){
    if ($('#eg15-radio')) return;
    const radio = document.createElement('aside');
    radio.id = 'eg15-radio';
    radio.className = 'eg15-radio';
    radio.innerHTML = '<button type="button" aria-label="Abrir rádio da década" class="eg15-radio-knob">📻</button><div><strong>RÁDIO AM</strong><span id="eg15-radio-line"></span></div>';
    document.body.appendChild(radio);
    $('#eg15-radio-line').textContent = pick(radioLines);
    radio.addEventListener('click', () => openDrawer('radio'));
  }

  function ensureDrawer(){
    let drawer = $('#eg15-object-drawer');
    if (drawer) return drawer;
    drawer = document.createElement('div');
    drawer.id = 'eg15-object-drawer';
    drawer.className = 'eg15-object-drawer hidden';
    drawer.innerHTML = '<div class="eg15-drawer-backdrop" data-eg15-close></div><article class="eg15-drawer-card"><button type="button" class="eg15-close" data-eg15-close>×</button><span class="eg15-kicker">OBJETO DA SALA</span><h2></h2><p></p><div class="eg15-drawer-insight"></div><button type="button" class="btn btn-primary" data-eg15-go>Ir para esta área</button></article>';
    document.body.appendChild(drawer);
    drawer.addEventListener('click', (e)=>{ if(e.target.closest('[data-eg15-close]')) drawer.classList.add('hidden'); });
    return drawer;
  }

  function openDrawer(kind){
    const d = ensureDrawer();
    const map = drawerCopy[kind] || ['Rádio AM', pick(radioLines), ''];
    $('h2', d).textContent = map[0];
    $('p', d).textContent = map[1];
    const ins = pick(insights, map[0].length);
    $('.eg15-drawer-insight', d).innerHTML = '<strong>Insight '+ins[0]+'</strong><br>'+ins[1];
    const go = $('[data-eg15-go]', d);
    go.style.display = drawerCopy[kind] ? '' : 'none';
    go.onclick = () => { d.classList.add('hidden'); window.switchScreen?.(kind); };
    d.classList.remove('hidden');
  }

  function buildOffice(){
    const root = screenRoot();
    if (!root || root.querySelector('.eg15-office-map')) return;
    const homeLike = /Escritório|Manager|Genesis|Rodada|Próximo|Diretoria|Notícias/i.test(root.textContent || '');
    if (!homeLike && activeScreenName() !== 'home') return;
    const save = readSave();
    const club = save?.club?.name || $('#header-club')?.textContent || 'Eleven Genesis';
    const year = save?.currentYear || save?.season || 1970;
    const section = document.createElement('section');
    section.className = 'eg15-office-map';
    section.innerHTML = `
      <div class="eg15-office-title">
        <span>SALA DO TREINADOR · ${year}</span>
        <h2>${club}: decisão por objetos, não por menus</h2>
        <p>Clique em um objeto da sala. Cada área do jogo vira algo físico da década de 70.</p>
      </div>
      <div class="eg15-room-board">
        <button data-eg15-object="tactics" class="eg15-object chalk"><b>▥</b><strong>Quadro de giz</strong><small>Tática</small></button>
        <button data-eg15-object="market" class="eg15-object file"><b>▤</b><strong>Fichário</strong><small>Mercado</small></button>
        <button data-eg15-object="scout" class="eg15-object envelope"><b>✉</b><strong>Envelope</strong><small>Scout</small></button>
        <button data-eg15-object="league" class="eg15-object paper"><b>📰</b><strong>Jornal</strong><small>Liga</small></button>
        <button data-eg15-object="calendar" class="eg15-object pins"><b>📌</b><strong>Mural</strong><small>Calendário</small></button>
        <button data-eg15-object="marketing" class="eg15-object radio"><b>◉</b><strong>Rádio</strong><small>Marketing</small></button>
        <button data-eg15-object="club" class="eg15-object folder"><b>▣</b><strong>Pasta</strong><small>Clube</small></button>
        <button data-eg15-object="squad" class="eg15-object cards"><b>▧</b><strong>Fichas</strong><small>Elenco</small></button>
      </div>`;
    const target = root.querySelector('.eg14-manager-room, .eg8-dashboard, section') || root;
    target.insertAdjacentElement(target.classList.contains('eg14-manager-room') ? 'beforebegin' : 'afterbegin', section);
    section.addEventListener('click', (e)=>{
      const btn = e.target.closest('[data-eg15-object]');
      if (!btn) return;
      btn.classList.add('eg15-touched');
      setTimeout(()=>btn.classList.remove('eg15-touched'), 450);
      openDrawer(btn.dataset.eg15Object);
    });
  }

  function injectInsight(){
    const root = screenRoot();
    if (!root || root.querySelector('.eg15-era-strip')) return;
    const current = activeScreenName();
    const ins = pick(insights, (root.textContent || '').length + seed());
    const strip = document.createElement('div');
    strip.className = 'eg15-era-strip';
    strip.innerHTML = `<strong>Insight da década · ${ins[0]}</strong><span>${ins[1]}</span>`;
    const place = root.querySelector('.internal-hero, .eg5-section-hero, header, .eg8-stage-hero, section') || root;
    place.insertAdjacentElement(place === root ? 'afterbegin' : 'afterend', strip);
    if (current === 'league' || /Liga|Tabela|Notícias/i.test(root.textContent || '')) addNewspaper();
    if (current === 'calendar' || /Calendário|Agenda|Semana/i.test(root.textContent || '')) addPinnedWeek();
  }

  function addNewspaper(){
    const root = screenRoot();
    if (!root || root.querySelector('.eg15-newspaper')) return;
    const paper = document.createElement('section');
    paper.className = 'eg15-newspaper';
    paper.innerHTML = '<div class="eg15-paper-name">CORREIO ESPORTIVO</div><h2>O futebol chegou em tinta antes de chegar em números</h2><p>As manchetes moldam pressão, moral e expectativa. Uma vitória curta pode parecer crise; um empate fora pode virar heroísmo.</p><div class="eg15-columns"><span>EDIÇÃO DA MANHÃ</span><span>BOATOS DE ARQUIBANCADA</span><span>RESULTADOS PELO RÁDIO</span></div>';
    root.appendChild(paper);
  }

  function addPinnedWeek(){
    const root = screenRoot();
    if (!root || root.querySelector('.eg15-pin-board')) return;
    const board = document.createElement('section');
    board.className = 'eg15-pin-board';
    board.innerHTML = ['Segunda: recuperação e silêncio', 'Terça: treino com campo pesado', 'Quarta: relatório do adversário', 'Sexta: telefonema do olheiro', 'Sábado: rádio ligado até tarde'].map(x=>`<article><i></i>${x}</article>`).join('');
    root.appendChild(board);
  }

  function humanizeNumbers(){
    const root = screenRoot();
    if (!root) return;
    $$('.stat, .metric, .kpi-card, .summary-card', root).forEach((el, i)=>{
      if (el.dataset.eg15Humanized) return;
      const txt = el.textContent || '';
      if (!/Moral|Confiança|Entrosamento|Fitness|Condição|Overall|Potencial|OVR|POT/i.test(txt)) return;
      el.dataset.eg15Humanized = '1';
      const note = document.createElement('small');
      note.className = 'eg15-interpretation';
      note.textContent = pick([
        'Leia como clima de vestiário, não como verdade absoluta.',
        'O assistente chama isso de sinal, não de certeza.',
        'Em 1970, esse número viraria uma frase no relatório.',
        'O campo pode desmentir esta ficha em cinco minutos.'
      ], i + txt.length);
      el.appendChild(note);
    });
  }

  function interceptOffers(){
    document.addEventListener('click', (e)=>{
      const btn = e.target.closest('[data-offer-player]');
      if (!btn || bypassOffer) return;
      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
      const modal = ensureDrawer();
      modal.classList.remove('hidden');
      $('h2', modal).textContent = 'Telegrama enviado';
      $('p', modal).textContent = 'A proposta não some no sistema. Ela passa por telefone ruim, assinatura, carimbo e espera. A resposta pode chegar como aceite, contraproposta ou silêncio.';
      $('.eg15-drawer-insight', modal).innerHTML = '<strong>Mercado de 1970</strong><br>Contratar é negociar informação imperfeita. O atraso faz parte da decisão.';
      const go = $('[data-eg15-go]', modal);
      go.style.display = '';
      go.textContent = 'Carimbar e enviar proposta';
      go.onclick = () => { modal.classList.add('hidden'); bypassOffer = true; btn.click(); bypassOffer = false; go.textContent = 'Ir para esta área'; };
    }, true);
  }

  function decorate(){
    const root = screenRoot();
    if (!root) return;
    const stamp = (root.textContent || '').slice(0,260) + '|' + root.children.length;
    document.documentElement.classList.add('eg15-physical-room');
    document.body.classList.add('eg15-physical-room');
    ensureRadio(); ensureDrawer();
    if (stamp !== lastStamp) {
      lastStamp = stamp;
      buildOffice();
      injectInsight();
      humanizeNumbers();
    } else {
      humanizeNumbers();
    }
  }

  function init(){
    interceptOffers();
    decorate();
    const root = screenRoot();
    if (root) new MutationObserver(()=>requestAnimationFrame(decorate)).observe(root,{childList:true,subtree:true,characterData:true});
    const app = document.getElementById('app');
    if (app) new MutationObserver(()=>requestAnimationFrame(decorate)).observe(app,{childList:true,subtree:true});
    setInterval(()=>{ const line = $('#eg15-radio-line'); if(line) line.textContent = pick(radioLines, Date.now()/15000|0); }, 15000);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
