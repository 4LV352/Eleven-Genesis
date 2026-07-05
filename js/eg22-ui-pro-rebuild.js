(function(){
  'use strict';
  const ROOT_ID = 'screen-root';
  const q = (s,c=document)=>c.querySelector(s);
  const qa = (s,c=document)=>Array.from(c.querySelectorAll(s));
  const nonNewsScenes = () => !['newsCenter','newsDetail'].includes(document.body.dataset.eg20CurrentScene || q('#'+ROOT_ID)?.dataset.eg20Scene || '');
  let pending = false;

  function root(){ return document.getElementById(ROOT_ID); }

  function removePollution(){
    const r = root();
    if(!r) return;
    const scene = r.dataset.eg20Scene || document.body.dataset.eg20CurrentScene || '';
    // A newspaper must not be a global footer/panel outside its own scene.
    if(!['newsCenter','newsDetail'].includes(scene)){
      qa('.eg15-newspaper', r).forEach(el=>el.remove());
    }
    if(scene !== 'calendar'){
      qa('.eg15-pin-board', r).forEach(el=>el.remove());
    }
    qa('.eg15-era-strip,.eg15-office-map,.eg16-time-office', r).forEach(el=>el.remove());
  }

  function markScenes(){
    if(!document.body.classList.contains('eg22-ux')) document.body.classList.add('eg22-ux');
    const r = root();
    if(!r) return;
    const scene = r.dataset.eg20Scene || document.body.dataset.eg20CurrentScene || '';
    if(scene && document.body.dataset.eg22Scene !== scene) document.body.dataset.eg22Scene = scene;
    const shell = r.classList.contains('eg18-screen-shell');
    if(r.classList.contains('eg22-shell') !== shell) r.classList.toggle('eg22-shell', shell);
    const screen = q(':scope > .screen', r);
    if(screen){
      if(!screen.classList.contains('eg22-scene')) screen.classList.add('eg22-scene');
      const sceneName = scene || 'unknown';
      if(screen.getAttribute('data-eg22-scene') !== sceneName) screen.setAttribute('data-eg22-scene', sceneName);
    }
  }

  function fixBrand(){
    const title = q('.eg18-room-title h1');
    if(!title) return;
    // Normalize every broken title state into two clear lines.
    const already = q('.eg21-brand-line', title) && q('.eg21-room-line', title);
    if(!already){
      title.innerHTML = '<span class="eg21-brand-line">Eleven Genesis</span><span class="eg21-room-line">Sala do treinador</span>';
    }
  }

  function improveSceneCopy(){
    const r = root();
    if(!r || !r.classList.contains('eg18-screen-shell')) return;
    const scene = r.dataset.eg20Scene || '';
    const screen = q(':scope > .screen', r);
    if(!screen || screen.dataset.eg22Tuned === '1') return;
    screen.dataset.eg22Tuned = '1';
    const h1 = q('h1', screen);
    if(h1){
      const labels = {
        market:'Sala de negociações',
        league:'Central da liga',
        club:'Dossiê do clube',
        tactics:'Quadro tático',
        calendar:'Agenda da semana',
        squad:'Pasta do elenco',
        scout:'Telefone dos olheiros',
        marketing:'Rádio e torcida',
        newsCenter:'Correio Esportivo'
      };
      if(labels[scene]) h1.setAttribute('aria-label', labels[scene]);
    }
  }

  function ensureSafeScroll(){
    // Avoid global scroll wars; only the current scene or internal panels can scroll.
    if(document.body.classList.contains('eg18-scene-mode')){
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
  }

  function apply(){
    markScenes();
    fixBrand();
    removePollution();
    improveSceneCopy();
    ensureSafeScroll();
  }

  function schedule(){
    if(pending) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      apply();
    });
  }

  function init(){
    apply();
    const r = root();
    if(r) new MutationObserver(schedule).observe(r,{childList:true,subtree:false,attributes:true,attributeFilter:['data-eg20-scene']});
    const app = document.getElementById('app');
    if(app) new MutationObserver(schedule).observe(app,{attributes:true,attributeFilter:['class']});
    window.addEventListener('resize', schedule, {passive:true});
    window.EG22UX = { apply, schedule };
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
