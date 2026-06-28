# Auditoria Fase 1

## Problemas encontrados

- Projeto concentrado em poucos arquivos grandes, dificultando manutenção.
- Persistência espalhada por várias funções com acessos diretos ao `localStorage`.
- Dependência externa de fonte via `@import`, incompatível com uso 100% offline.
- Feedback visual global misturado ao arquivo principal do jogo.
- Troca de telas sem proteção contra render vazio em caso de inconsistência.
- CSS sem camada dedicada para telas muito estreitas como 320px e 375px.

## Correções aplicadas

- Criada estrutura `css/`, `js/`, `assets/` e `data/`.
- Movidos estilos para `css/app.css` e criada camada `css/responsive.css`.
- Movido jogo principal para `js/app.js`.
- Criados módulos puros:
  - `js/storage.js` para leitura, escrita e remoção de dados locais.
  - `js/navigation.js` para animação e estado da navegação.
  - `js/ui.js` para feedback visual de toque/clique.
- Centralizado o salvamento automático e favoritos no módulo de armazenamento.
- Removidos logs de console em fluxos tratados.
- Removida importação externa de fonte.
- Adicionada recuperação automática para evitar tela vazia.
- Documentado o contrato de save em `data/save-schema.json`.

## Verificações

- Sintaxe JavaScript validada em `js/app.js`, `js/storage.js`, `js/navigation.js` e `js/ui.js`.
- Busca estática sem logs de depuração, breakpoints, marcadores pendentes, referências antigas de arquivos principais ou importações externas.
- Busca por nomes de funções duplicadas sem duplicatas encontradas.

## Evolução de simulador

- Dashboard ampliado com diretoria, notícias, ranking, reputação, transferências, calendário e atalhos.
- Clube enriquecido com fundação, história, cores, uniformes, patrocínio, popularidade e prestígio.
- Elenco passou a mostrar status, contrato, salário, valor, cartões, lesões, nacionalidade e estatísticas rápidas.
- Detalhe do jogador ampliado com atributos, evolução, contrato, histórico, temporadas e estatísticas.
- Finanças passaram a separar receitas e despesas com barras visuais em HTML/CSS.
- Configurações receberam modo escuro, volume, velocidade das animações, exportação e importação de save.

## Evolução Football Manager

- Criado sistema de Staff com treinador, auxiliar, preparadores, médico, olheiro, psicólogo e diretor de futebol.
- Staff agora afeta treinamento, recuperação, scout, negociação e custo financeiro semanal.
- Criado sistema de treinamento coletivo e individual com evolução real de atributos.
- Desenvolvimento dos jogadores passou a considerar idade, potencial, moral, energia, forma e staff.
- Mercado ampliado com venda, empréstimo, renovação, interessados, contratos e contrapropostas.
- Scout recebeu busca por idade, posição, overall, potencial, nacionalidade e valor.
- IA dos clubes passou a comprar, vender, renovar, trocar treinador, melhorar elenco e equilibrar finanças.
- Eventos aleatórios incluem lesões, suspensões, discussões, patrocinadores, imprensa, promessas e base.

## Camada de Emoção

- Adicionado `EventBus` global para eventos narrativos sem dependências externas.
- Adicionado ritual de matchday com overlay cinematográfico para momentos decisivos.
- Integrado disparo de drama ao `advanceRound()` sem alterar o motor de resultado, tabela, finanças, moral, mercado ou save.
- Overlay fecha por botão, Enter, Espaço ou Escape e emite `RITUAL_COMPLETE`.
- Implementação possui fallback: se EventBus ou overlay não carregar, o jogo continua normalmente.
