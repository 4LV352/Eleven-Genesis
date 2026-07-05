# RELATORIO EG23 - UX, LEGIBILIDADE E SOBREPOSICAO

## Objetivo

Corrigir problemas visuais identificados apos a auditoria do EG22:

- jornal com leitura ruim;
- cards cortando texto ou se sobrepondo;
- cenas internas ainda com cara de pagina administrativa;
- telas fora da cobertura visual do EG22;
- scroll global reduzido sem destruir conteudo interno.

## Estrategia

Foi criada uma camada incremental:

- `css/eg23-ux-readability.css`

Ela e carregada depois do EG22 no `index.html`, preservando a logica existente, `GameState`, saves e renderizadores do jogo.

## Correcoes aplicadas

### Passada 2 - estabilidade de cenas

- Entrada, selecao de clube e contrato foram estabilizados para reduzir cortes, scroll global e colisao com a marca.
- Objetos da sala ganharam protecao contra texto estourado e colisao com dock/radio.
- Drawers, filtros, modais, resumo semanal e toast receberam camadas e limites de altura mais previsiveis.
- Detalhes de jogador e mercado foram ajustados para caber melhor em cena, com grids fluidos.
- Staff, treino, academia e marketing receberam grids responsivos para reduzir sobreposicao de cards.
- Tabelas passaram a usar overflow interno controlado, sem empurrar a cena inteira.

### Jornal

- `newsCenter` e `newsDetail` agora usam contraste forte, fundo de papel claro e tinta escura.
- Titulos usam serif legivel e sem letter-spacing negativo.
- Lista de noticias vira grid responsivo no desktop e uma coluna no mobile.
- Cards de noticia deixam de parecer cards administrativos escuros.
- Texto principal ganhou tamanho e line-height melhores.
- Botoes do jornal passam a usar visual de objeto impresso/acao clara.

### Cards e sobreposicoes

- Removidos `max-height` destrutivos por override visual em cards de mercado e elenco.
- Conteudo passa a quebrar linha corretamente com `overflow-wrap:anywhere`.
- Botoes e grupos de acoes agora quebram em multiplas linhas quando necessario.
- `stat-grid` passa a usar `auto-fit` para evitar colunas comprimidas.
- Paineis internos recebem `overflow:auto` controlado em vez de cortar conteudo.

### Cenas cobertas

Foram adicionados ajustes para telas que ainda ficavam fora do acabamento EG22:

- `stadium`
- `structure`
- `finances`
- `notifications`
- `settings`
- `boardRoom`
- `dressingRoom`
- `fanMood`
- `playerDetail`
- `academy`
- `training`
- `staff`

### Responsividade

- Jornal em mobile passa para uma coluna.
- Botoes em mobile ocupam linhas completas quando necessario.
- Tatico passa para uma coluna em telas estreitas.
- Mercado, calendario e elenco reduzem risco de clipping.

## Arquivos alterados

- `index.html`
- `css/eg23-ux-readability.css`
- `RELATORIO_EG23_UX_READABILITY.md`

## Validacao executada

- `node --check js\storage.js`
- `node --check js\navigation.js`
- `node --check js\ui.js`
- `node --check js\app.js`
- `node --check js\eg18-scene-navigation.js`
- `node --check js\eg22-ui-pro-rebuild.js`
- Carga inicial via Microsoft Edge headless em 1366x768, com screenshot validando logo e texto Eleven Genesis visiveis na home.

## Validacao recomendada

- Conferir fluxo com carreira real:
  - office -> news -> detalhe -> voltar
  - office -> market -> filtros -> detalhe
  - office -> squad -> jogador
  - office -> league
  - office -> club -> structure/stadium
  - settings e notifications
- Conferir desktop e mobile.

## Observacao

A correcao nao remove camadas antigas. Ela estabiliza a apresentacao atual. O proximo passo tecnico ideal e consolidar `app.css`, `eg21` e `eg22` para reduzir a dependencia de muitos overrides.
