# GameHub - Plataforma de Jogos

Uma plataforma completa para hospedagem e jogabilidade de jogos online.

## ⚠️ IMPORTANTE - Como Abrir

**Para melhor experiência, use um servidor local:**

1. **Com Python instalado:**
   - Clique duas vezes em `abrir-site.bat`
   - Ou execute: `python -m http.server 8080`

2. **Com Node.js instalado:**
   - Clique duas vezes em `abrir-site.bat`
   - Ou execute: `npx http-server -p 8080`

3. **Sem servidor (pode ter limitações):**
   - Abra `index.html` diretamente no navegador

**Por que usar servidor local?**
- Jogos funcionam corretamente
- Sem erros de segurança do navegador
- Experiência completa

## Funcionalidades

### 🎮 Catálogo de Jogos
- 18+ jogos em diversas categorias
- Sistema de filtros por categoria
- Busca por nome ou categoria
- Badges para jogos novos, populares e top

### 🎯 Categorias
- Ação
- Aventura
- Puzzle
- Corrida
- Esportes
- RPG

### 📊 Recursos
- Estatísticas animadas
- Sistema de avaliações
- Contador de jogadas
- Carousel de jogos populares
- Jogo em destaque

### 🎨 Design
- Interface moderna e responsiva
- Animações suaves
- Efeitos hover interativos
- Design escuro com gradientes
- Totalmente mobile-friendly

### 🔧 Funcionalidades Técnicas
- Busca em tempo real
- Filtros dinâmicos
- Modal para jogos
- Scroll suave
- Efeitos de parallax
- Animações de entrada

## Como Usar

1. **Recomendado:** Clique duas vezes em `abrir-site.bat`
2. **Ou manualmente:** Execute `python -m http.server 8080` na pasta
3. Acesse `http://localhost:8080` no navegador
4. Navegue pelas categorias ou use a busca
5. Clique em um jogo para jogar
6. Explore todas as funcionalidades

## Estrutura do Projeto

```
plataforma-jogos/
├── index.html              # Página principal
├── css/
│   └── style.css           # Estilos
├── js/
│   └── main.js             # Lógica principal
├── games/                  # Jogos criados
│   ├── pong.html           # 🏓 Pong
│   ├── memory.html         # 🃏 Memória
│   ├── quiz.html           # 🧠 Quiz Game
│   └── space-invaders.html # 🚀 Space Invaders
├── abrir-site.bat          # Inicia servidor automaticamente
├── iniciar-servidor.bat    # Inicia servidor (alternativo)
└── README.md               # Esta documentação
```

## Tecnologias

- HTML5
- CSS3 (com variáveis CSS e animações)
- JavaScript vanilla
- Google Fonts
- Ícones via emojis

## Personalização

### Adicionar Novos Jogos
Edite o array `gamesDatabase` em `js/main.js`:

```javascript
{
    id: 19,
    title: "Novo Jogo",
    category: "acao",
    icon: "🎮",
    rating: 4.5,
    plays: 0,
    badge: "new",
    description: "Descrição do jogo",
    color: "#ff6b6b"
}
```

### Adicionar Categorias
Edite o array `categories` em `js/main.js`.

## Recursos Visuais

- Design dark theme
- Gradientes vibrantes
- Sombras neon
- Animações de hover
- Transições suaves
- Scroll personalizado

---

Criado com ❤️ pelo OpenCode
