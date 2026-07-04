# RELATORIO EG20

## Auditoria executada

- Estrutura atual listada via `rg --files`.
- Projeto confirmado como HTML, CSS e JavaScript puro.
- HTML principal: `index.html`.
- CSS principais: `css/app.css`, `css/responsive.css`, `css/tension.css`, `css/analog-era.css`, `css/eg15-physical-room.css`, `css/eg16-time-office.css`, `css/eg18-scene-navigation.css`.
- JS principais: `js/app.js`, `js/storage.js`, `js/navigation.js`, `js/ui.js`, `js/eventBus.js`, `js/matchdayRitual.js`, `js/analog-era.js`, `js/eg15-physical-room.js`, `js/eg16-time-office.js`, `js/eg17-era-engine.js`, `js/eg18-scene-navigation.js`.

## Fluxo atual

- `js/app.js` concentra `GameState`, splash, menu, nova carreira, continuar carreira, renderizadores e fluxo semanal.
- `js/storage.js` encapsula `localStorage`.
- `js/navigation.js` aplica animacao basica e estado ativo.
- `js/eg17-era-engine.js` centraliza eras, objetos, memorias e persistencia da sala.
- `js/eg18-scene-navigation.js` passa a atuar como base EG20 de cenas, transicoes e hub da sala.

## Duplicacoes encontradas

- EG15 injeta mapa de sala, radio fixo, jornal e insights diretamente no DOM.
- EG16 injeta outra sala viva, objetos, drawer e transicoes de era.
- EG18 cria hub de sala, transicoes e shell de cena.
- A consolidacao EG20 preserva EG15/EG16 para compatibilidade, mas impede que essas camadas cubram splash, menu, logo ou hub principal.

## Alteracoes feitas

- Backup logico criado em `.eg20-backup/`.
- `js/app.js`: splash com logo EG e texto Eleven Genesis agora tambem aparece no desktop; o bypass que pulava o splash acima de 901px foi removido.
- `js/eg18-scene-navigation.js`: consolidado como camada EG20 com aliases `SceneManager`, `TransitionManager` e `RoomManager`, preservando `EG18Scene` para compatibilidade.
- `js/eg18-scene-navigation.js`: adicionadas classes de estado `eg20-menu-active`, `eg20-career-active`, `eg20-scene-mode` e `data-eg20-current-scene`.
- `css/eg18-scene-navigation.css`: adicionadas regras EG20 para proteger splash/menu/logo, ocultar camadas EG15/EG16 quando conflitam e dar identidade visual propria a cenas como jornal, radio, mercado, taticas, elenco e calendario.
- `RELATORIO_EG20.md`: criado este relatorio.

## Arquitetura consolidada

- `GameState`: permanece em `js/app.js`.
- `SaveManager`: permanece como `js/storage.js` + funcoes de save do app.
- `EraEngine`: `js/eg17-era-engine.js`.
- `SceneManager`: alias exposto por `js/eg18-scene-navigation.js`.
- `TransitionManager`: alias exposto por `js/eg18-scene-navigation.js`.
- `RoomManager`: alias exposto por `js/eg18-scene-navigation.js`.

## Validacao recomendada

- Verificar splash em desktop e mobile.
- Iniciar nova carreira e continuar carreira.
- Entrar na sala e abrir objetos: jornal, radio, mercado, tatica, elenco e calendario.
- Conferir se cenas usam scroll local e retornam para sala.
- Conferir se o logo EG nao fica coberto por radio, jornal, cards ou overlays.

## Proximos passos

- Migrar gradualmente o codigo EG15 e EG16 para componentes internos do RoomManager.
- Separar os renderizadores gigantes de `js/app.js` em cenas fisicas menores.
- Criar cenas dedicadas para jornal, radio, fichario de mercado, pasta de elenco, agenda e quadro tatico.
- Adicionar validacao visual automatizada com screenshots desktop/mobile.
