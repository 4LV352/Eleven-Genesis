# EG22 — UX/UI Pro Rebuild

## Auditoria

- Estrutura do projeto listada antes das alterações.
- Projeto mantido em HTML, CSS e JavaScript puro.
- HTML principal: `index.html`.
- Core do jogo: `js/app.js`, preservando `GameState`, fluxo de carreira e saves.
- Persistencia: `js/storage.js` e funcoes de save do core.
- Navegacao/cenas: `js/eg18-scene-navigation.js`, `js/eg21-ux-zero-scroll.js`.
- EraEngine: `js/eg17-era-engine.js`.
- Camadas herdadas de sala/objetos: `js/eg15-physical-room.js`, `js/eg16-time-office.js`.

## Problemas encontrados

- Camadas antigas ainda podem inserir jornal, mural, insight e sala duplicada em cenas internas.
- O dock e o radio ainda competem com objetos quando a cena precisa de foco.
- Mercado, liga, clube, taticas, calendario e elenco ainda sao renderizados pelo core como telas longas; a solucao segura é enquadrar visualmente como cenas sem reescrever esses renderizadores agora.
- Mobile precisava de outro enquadramento, com cenas e controles menores.

## Solucao aplicada

- Adicionado `css/eg22-ui-pro-rebuild.css`.
- Adicionado `js/eg22-ui-pro-rebuild.js`.
- `index.html` atualizado para carregar EG22 apos EG21.
- EG22 remove poluicao visual herdada em runtime:
  - jornal fora de `newsCenter`/`newsDetail`;
  - mural fora de `calendar`;
  - tiras/office duplicado EG15/EG16 dentro das cenas.
- EG22 normaliza a marca da sala para `Eleven Genesis` + `Sala do treinador`.
- EG22 transforma o shell interno em uma cena de viewport com scroll apenas em paineis internos.
- Mercado recebe tratamento visual de fichario/sala de negociacao.
- Liga recebe tratamento de central compacta com tabela em area controlada.
- Clube recebe tratamento de dossie.
- Dock, radio e botao de voltar ficam mais discretos.
- Mobile recebe composicao propria, reduzindo o efeito de desktop espremido.

## Arquivos alterados

- `index.html`
- `css/eg22-ui-pro-rebuild.css`
- `js/eg22-ui-pro-rebuild.js`
- `RELATORIO_EG22_UX_PRO_REBUILD.md`

## Decisao de arquitetura

A EG22 permanece como camada corretiva incremental. Ela nao altera `GameState`, saves, dados, calendario, mercado, liga ou regras de partida. Isso reduz risco e preserva funcionalidades enquanto melhora a UX/UI atual.

## Proximos passos

- Refatorar `renderMarket`, `renderLeague`, `renderClub`, `renderTactics`, `renderSquad` e `renderCalendar` para gerar HTML nativo de cena.
- Criar drawers reais para detalhe de jogador no mobile.
- Criar abas internas reais na Liga: classificacao, rodada, artilheiros e noticias.
- Transformar calendario em agenda paginada.
- Transformar taticas em quadro com pinos e controles por abas.
