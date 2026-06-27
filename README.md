# Eleven Genesis

Manager de futebol mobile-first com identidade visual de clube grande.

## 📁 Estrutura do Projeto

```
├── index.html          # Página principal
├── css/
│   ├── tokens.css      # Design tokens (cores, tipografia, espaçamentos)
│   ├── components.css  # Estilos dos componentes
│   └── pages.css       # Estilos das páginas
└── js/
    └── main.js         # JavaScript principal
```

## ✅ Prioridades 1 Implementadas

### P1.1 — Estrutura de Arquivos ✓

**Organização simples e direta:**
- `index.html` - Estrutura HTML semântica
- `css/tokens.css` - Variáveis CSS (cores, tipografia, espaçamentos)
- `css/components.css` - Estilos dos componentes reutilizáveis
- `css/pages.css` - Estilos específicos das páginas
- `js/main.js` - JavaScript vanilla

### P1.2 — Tipografia Real ✓

**Fontes importadas via Google Fonts:**
- **Bebas Neue** - Headlines (estilo jersey/camisa)
- **Inter** - Interface (leitura rápida)

**Classes utilitárias:**
- `.font-display` - Para títulos de impacto
- `.font-body` - Para texto corrido

### P1.3 — Logotipo e Símbolo Visual ✓

**SVG inline no footer:**
- Escudo herádico com forma clássica
- "11" estilizado em dourado
- Bola de futebol no centro
- Estrela no topo
- Wordmark "ELEVEN GENESIS" com Bebas Neue

**Paleta de cores:**
- Genesis Turf (#00A65A) - Verde principal
- Legacy Gold (#D4A63A) - Dourado
- Midnight Stadium (#071A12) - Fundo escuro
- Floodlight Ivory (#F5F5EF) - Texto claro

### P1.4 — Página Real do Jogo ✓

**Club Dashboard com:**

1. **Cabeçalho do Clube**
   - Badge do clube
   - Nome e temporada
   - Reputação (estrelas)
   - Forma recente (V/E/D)

2. **Hero de Próxima Partida**
   - Indicador "ao vivo" pulsante
   - Placar em destaque (Bebas Neue)
   - Badge da competição
   - Data e horário
   - Botões de ação

3. **Grid de Estatísticas**
   - Posição na liga
   - Pontos
   - Saldo de gols
   - Moral do time
   - Indicadores de tendência

4. **Feed de Notícias**
   - Cards com níveis de impacto (urgente/importante/informativo)
   - Timestamp
   - Título e resumo

5. **Destaques do Elenco**
   - Cards de jogadores
   - Posição, nome, status
   - Rating e forma

6. **Bottom Navigation**
   - 5 destinos (Clube, Elenco, Partidas, Mercado, Finanças)
   - Suporte a safe areas (iOS)
   - Estado ativo com destaque

## 🎨 Design Tokens

**Cores centralizadas em CSS variables:**
```css
:root {
  --color-genesis-turf: #00A65A;
  --color-legacy-gold: #D4A63A;
  --color-midnight-stadium: #071A12;
  --color-floodlight-ivory: #F5F5EF;
  /* ... */
}
```

**Tipografia:**
```css
--font-display: 'Bebas Neue', sans-serif;
--font-body: 'Inter', system-ui, sans-serif;
```

**Espaçamentos:**
```css
--spacing-sm: 0.5rem;
--spacing-md: 0.75rem;
--spacing-lg: 1rem;
/* ... */
```

## 📱 Mobile-First

- Layout responsivo com media queries
- Touch targets mínimos de 44px
- Bottom navigation otimizada para polegar
- Safe area support para iOS
- Backdrop blur no bottom nav

## 🎮 Football Feel

Elementos que transmitem futebol:
- Gradiente de estádio no background
- Linhas de gramado no hero
- Indicador "ao vivo" pulsante
- Escudo herádico
- Paleta emocional (verde/dourado/vermelho)
- Tipografia de impacto (Bebas Neue)

## 🚀 Como Usar

**Desenvolvimento:**
```bash
# Abra o index.html no navegador
# Ou use um servidor local:
python -m http.server 8000
# Acesse: http://localhost:8000
```

**Produção:**
- O projeto é 100% estático
- Basta fazer upload dos arquivos para qualquer servidor web

## 📊 Dados Mockados

O dashboard usa dados estáticos no HTML:
- Clube: Genesis FC
- Temporada: 2025/26
- Liga: Primeira Liga
- Posição: 3º com 67 pontos
- Próxima partida: vs Aurora SC

## 🎯 Próximos Passos

Quando solicitado, implementar:

**Prioridade 2 — Football Feel:**
- P2.1: Hero de estádio com campo SVG animado
- P2.2: Cabeçalho com escudo SVG completo
- P2.3: Cards de jogadores com foto
- P2.4: Notícia editorial com banner
- P2.5: Tabela de classificação

**Prioridade 3 — Game Feel:**
- P3.1: Transições de navegação
- P3.2: Micro-interações
- P3.3: Tela de loading

**Prioridade 4 — Polimento:**
- P4.1: SVGs externos
- P4.2: Safe areas refinadas
- P4.3: Assets otimizados
