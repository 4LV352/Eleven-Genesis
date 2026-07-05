# RELATORIO EG21 UX/UI

## Auditoria

- Estrutura analisada com `rg --files`.
- HTML principal: `index.html`.
- CSS principais: `css/app.css`, `css/responsive.css`, `css/tension.css`, `css/analog-era.css`, `css/eg15-physical-room.css`, `css/eg16-time-office.css`, `css/eg18-scene-navigation.css`, `css/eg21-ux-zero-scroll.css`.
- JS principais: `js/app.js`, `js/storage.js`, `js/navigation.js`, `js/ui.js`, `js/eventBus.js`, `js/matchdayRitual.js`, `js/analog-era.js`, `js/eg15-physical-room.js`, `js/eg16-time-office.js`, `js/eg17-era-engine.js`, `js/eg18-scene-navigation.js`, `js/eg21-ux-zero-scroll.js`.
- O ZIP EG21 foi extraido temporariamente em `.tmp-eg21-ref` apenas como referencia e os temporarios foram removidos apos a validacao.

## Problemas encontrados

- EG15 ainda tentava inserir jornal, mural e insights como blocos globais.
- EG16 ainda mantinha uma segunda sala visual que podia competir com o hub.
- As cenas internas ainda dependiam de scroll do painel e precisavam de enquadramento mais rígido.
- O jornal estava ligado visualmente à Liga; agora existe separacao entre cena `newsCenter` e cena `league`.
- O dock inferior ainda era util como apoio, mas precisava ser discreto e secundario aos objetos.

## Solucoes aplicadas

- Adicionado `css/eg21-ux-zero-scroll.css`.
- Adicionado `js/eg21-ux-zero-scroll.js`.
- `index.html` atualizado para carregar a camada EG21 depois da EG18.
- `SceneManager` consolidado com API:
  - `SceneManager.go(sceneName, options)`
  - `SceneManager.current()`
  - `SceneManager.backToOffice()`
- `TransitionManager` preservado e alinhado com tipos conceituais:
  - `fade`
  - `ball-swipe`
  - `eg-logo`
  - `paper`
  - `crt`
- A carreira passa a travar scroll global; scroll fica restrito ao painel da cena.
- Blocos invasivos de EG15 sao removidos/ocultados em modo cena.
- Radio AM vira elemento compacto no canto, expandindo apenas em hover/focus.
- Hub da sala separa Jornal (`newsCenter`) de Liga (`league`).
- Criadas classes reutilizaveis:
  - `.eg-scene`
  - `.eg-scene-active`
  - `.eg-panel`
  - `.eg-dock`
  - `.eg-drawer`
  - `.eg-table-wrap`
- Adicionadas variaveis de identidade:
  - `--eg-bg`
  - `--eg-panel`
  - `--eg-gold`
  - `--eg-green`
  - `--eg-paper`
  - `--eg-wood`
  - `--eg-text`
  - `--eg-muted`

## Arquivos alterados

- `index.html`
- `js/eg18-scene-navigation.js`
- `js/eg21-ux-zero-scroll.js`
- `css/eg21-ux-zero-scroll.css`
- `RELATORIO_EG21_UX_UI.md`

## Validacao recomendada

- Home/splash: confirmar logo EG e texto Eleven Genesis sem cobertura.
- Fluxo: home -> nova carreira -> office.
- Office -> market -> voltar.
- Office -> club -> voltar.
- Office -> league -> voltar.
- Office -> newsCenter -> voltar.
- Office -> calendar -> voltar.
- Desktop e mobile: confirmar que cenas principais cabem na viewport e listas usam scroll interno.

## Proximos passos

- Extrair renderizadores grandes de `js/app.js` para cenas dedicadas.
- Criar drawer mobile real para detalhes de jogador no mercado e elenco.
- Criar abas internas reais para Liga: Classificacao, Rodada, Artilheiros, Noticias.
- Transformar Calendario em agenda paginada.
- Transformar Taticas em quadro com controles por abas no mobile.
