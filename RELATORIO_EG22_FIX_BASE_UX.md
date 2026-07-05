# RELATORIO EG22 - BASE FUNCIONANDO E UX SOBREPOSTA

## Auditoria

- Projeto atual em HTML, CSS e JavaScript puro.
- Entrada principal: `index.html`.
- CSS principal: `css/app.css`, `css/responsive.css`, `css/eg18-scene-navigation.css`, `css/eg21-ux-zero-scroll.css`, `css/eg22-ui-pro-rebuild.css`.
- JS principal: `js/app.js`, `js/navigation.js`, `js/storage.js`, `js/eg18-scene-navigation.js`, `js/eg21-ux-zero-scroll.js`, `js/eg22-ui-pro-rebuild.js`.
- Fluxo atual: splash/menu -> nova carreira/continuar -> escolha/contrato -> sala do treinador -> cenas via `SceneManager`.

## Onde estava travando

O travamento vinha da disputa entre as camadas EG21 e EG22:

- `js/eg21-ux-zero-scroll.js` inseria `.eg21-scene-purpose` nas cenas.
- `js/eg22-ui-pro-rebuild.js` removia `.eg21-scene-purpose`.
- O observer do EG22 monitorava `subtree:true` e alterações de classe, capturando as mutações que ele mesmo causava.
- Isso criava uma sequência de recriação/remoção/aplicação que podia manter a interface em trabalho contínuo.

## Correcoes aplicadas

- EG22 deixou de remover `.eg21-scene-purpose`; o elemento agora e apenas ocultado por CSS.
- EG21 nao insere `.eg21-scene-purpose` quando a camada EG22 esta ativa.
- EG22 passou a usar scheduler com `requestAnimationFrame` e trava `pending`.
- Observer do EG22 foi limitado a:
  - filhos diretos de `#screen-root`;
  - atributo `data-eg20-scene`;
  - classe do `#app`.
- Mutacoes repetidas em classes e atributos agora so acontecem quando o valor realmente muda.

## UX/UI reconstruida por cima da base funcionando

- Menus legados (`desktop-sidebar` e `bottom-nav`) deixam de competir com a cena durante a carreira.
- O dock EG18 permanece como apoio discreto.
- Cenas internas usam altura controlada e rolagem interna.
- Mercado ganhou comportamento mais consistente de fichario com lista contida e filtro em overlay.
- Liga foi reorganizada como central de campeonato, com tabela em painel interno.
- Clube foi reforcado como dossie, com identidade e metricas organizadas.
- Calendario, elenco e tática foram ajustados para caber melhor na viewport.
- Foco visivel foi reforcado em botoes e controles das cenas.

## Arquivos alterados

- `js/eg22-ui-pro-rebuild.js`
- `js/eg21-ux-zero-scroll.js`
- `css/eg22-ui-pro-rebuild.css`
- `RELATORIO_EG22_FIX_BASE_UX.md`

## Validacao

- `node --check js\eg22-ui-pro-rebuild.js`
- `node --check js\eg21-ux-zero-scroll.js`
- `node --check js\eg18-scene-navigation.js`
- `node --check js\app.js`
- Edge headless carregando `index.html` com `--virtual-time-budget=3000`.
- Screenshot desktop da splash.
- Screenshot mobile da splash.
- Screenshot desktop apos a splash, confirmando home com logo EG, ELEVEN GENESIS, Nova Carreira e Continuar.

## Proximos passos

- Validar manualmente a navegacao completa com save real: office -> market -> club -> league -> news -> calendar -> office.
- Evoluir renderizadores internos aos poucos, trocando formularios/tabelas por objetos diegeticos sem quebrar `GameState`.
- Criar testes de smoke com navegador para automatizar console sem erros em fluxos de carreira.
