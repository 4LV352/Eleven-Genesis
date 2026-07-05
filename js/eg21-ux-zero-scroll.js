(function(){
  'use strict';
  const root = () => document.getElementById('screen-root');
  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

  function currentScene(){
    return root()?.dataset?.eg20Scene || document.body.dataset.eg20CurrentScene || '';
  }

  function removeInvasiveAnalogBlocks(){
    const r = root();
    if(!r || !document.body.classList.contains('eg18-scene-mode')) return;
    // EG15 still tries to append newspaper/pinboard/insight as long-page blocks.
    // In EG21 these live behind objects/cenas, never as global stacked sections.
    $$(':scope > .eg15-newspaper, :scope > .eg15-pin-board, :scope > .eg15-era-strip, :scope > .eg15-office-map', r)
      .forEach(el => el.remove());
  }

  function reinforceRoomBrand(){
    const title = $('.eg18-room-title h1');
    if(!title || title.dataset.eg21BrandFixed) return;
    title.innerHTML = '<span class="eg21-brand-line">Eleven Genesis</span><span class="eg21-room-line">Sala do treinador</span>';
    title.dataset.eg21BrandFixed = 'true';
  }

  function labelScreens(){
    const r = root();
    if(!r) return;
    const scene = currentScene();
    if(scene && r.classList.contains('eg18-screen-shell')){
      r.setAttribute('aria-label', 'Cena: ' + scene);
      r.classList.add('eg-scene-active');
      const screen = $(':scope > .screen', r);
      if(screen) screen.classList.add('eg-scene', 'eg-panel');
      $$('.eg18-scene-bar', r).forEach(el => el.classList.add('eg-dock'));
    }
  }

  function addScenePurpose(){
    const r = root();
    if(!r || !r.classList.contains('eg18-screen-shell')) return;
    const screen = $(':scope > .screen', r);
    if(!screen || screen.querySelector('.eg21-scene-purpose')) return;
    const scene = currentScene();
    const copy = {
      market: 'Foco: escolher, observar ou negociar. O fichário mostra só o necessário para decidir.',
      league: 'Foco: entender a competição. Tabela, pressão e próxima rodada sem ruído.',
      club: 'Foco: ler a instituição. Estrutura, torcida, reputação e objetivos do clube.',
      tactics: 'Foco: preparar o jogo. Quadro, escalação e ajuste tático.',
      squad: 'Foco: conhecer o elenco. Fichas, moral e papéis dentro do vestiário.',
      calendar: 'Foco: organizar a semana. Treinos, jogo e recuperação.',
      scout: 'Foco: interpretar relatórios incompletos. Em 1970, certeza é luxo.',
      marketing: 'Foco: ouvir a torcida e cuidar da marca.'
    };
    if(!copy[scene]) return;
    const note = document.createElement('div');
    note.className = 'eg21-scene-purpose';
    note.textContent = copy[scene];
    note.style.cssText = 'margin:0 0 12px;padding:10px 12px;border:1px solid rgba(215,173,69,.28);border-radius:12px;background:rgba(9,8,5,.42);color:#f3ddb0;font:700 12px/1.35 Courier New,monospace;letter-spacing:.02em;';
    screen.insertAdjacentElement('afterbegin', note);
  }

  function fixSceneScroll(){
    if(document.body.classList.contains('eg18-scene-mode')){
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
  }

  function apply(){
    removeInvasiveAnalogBlocks();
    reinforceRoomBrand();
    labelScreens();
    addScenePurpose();
    fixSceneScroll();
  }

  function init(){
    apply();
    const r = root();
    if(r) new MutationObserver(() => requestAnimationFrame(apply)).observe(r,{childList:true,subtree:false});
    const app = document.getElementById('app');
    if(app) new MutationObserver(() => requestAnimationFrame(apply)).observe(app,{attributes:true,childList:false,subtree:false});
    window.addEventListener('resize', apply, {passive:true});
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
