# Auditoria de crescimento — GameHub

Data: 7 de setembro de 2026

Escopo: código local e páginas públicas de `https://gamehubjogos.com.br/`.

## Resumo executivo

O GameHub já tem uma base boa para aquisição: 22 jogos leves, domínio próprio, HTTPS, sitemap, robots.txt, título e descrição fortes na home, layout responsivo na vitrine e páginas sem dependências pesadas. O site, porém, ainda funciona como uma coleção de jogos, não como um produto com loops de crescimento.

Os três maiores bloqueios são:

1. Nenhuma página de jogo tem Open Graph, Twitter Card, canonical ou dados estruturados. Um placar compartilhado não gera uma prévia própria do jogo.
2. Não existe um loop viral: resultado compartilhável, desafio a um amigo, link com placar-meta, ranking, sequência diária ou recompensa por retorno.
3. Não há instrumentação de aquisição e retenção. Sem eventos de início, fim, replay e compartilhamento, não é possível descobrir quais jogos realmente crescem.

Avaliação atual para crescimento orgânico/viral: **4,5/10**.

## Status da primeira correção

Implementado no código após a auditoria:

- remoção das contagens, avaliações e prova social fictícias da interface e do banco local;
- substituição por benefícios verificáveis: grátis e sem cadastro;
- cards de jogos convertidos em links HTML rastreáveis;
- jogos passam a abrir na mesma aba;
- suporte ao parâmetro real `?busca=` anunciado pelo schema;
- título, descrição, canonical, Open Graph, Twitter Card e JSON-LD nas 22 páginas;
- compartilhamento via Web Share, copiar link ou WhatsApp;
- links de desafio com pontuação e banner de meta ao destinatário;
- ajustes básicos de semântica e foco nos novos controles.

Ainda requer uma próxima etapa: escolher/conectar analytics, criar imagens sociais individuais, instrumentar eventos internos de cada jogo e fazer a adaptação completa dos controles móveis.

### Segunda etapa implementada

- camada de eventos para página, abertura, início, fim, replay, busca, filtro e compartilhamento, armazenada localmente e pronta para encaminhamento via `dataLayer`;
- botão “Desafiar um amigo” integrado às telas de resultado compatíveis;
- recomendações de próximos jogos após a partida;
- desafio diário e “Continue jogando” na página inicial;
- controles por toque para Cobrinha, Flappy Bird, Invasores Espaciais, Corrida Maluca e Corrida Turbo;
- imagens Open Graph individuais, otimizadas em 1200×630, para os 22 jogos;
- conteúdo indexável de instruções e jogos relacionados em todas as páginas;
- manifesto instalável, ícones reais e service worker com suporte offline;
- política de privacidade corrigida para refletir a coleta local atual.

Pendente de credenciais externas: conectar a camada de eventos a uma propriedade de analytics e operar o Google Search Console.

## Evidências verificadas

- 22 páginas de jogos estão no repositório e no sitemap.
- 10 de 22 páginas não têm `meta description`.
- 22 de 22 não têm canonical.
- 22 de 22 não têm Open Graph, Twitter Card ou JSON-LD próprio.
- 22 de 22 não têm marcação ARIA relevante nos controles do jogo.
- 18 de 22 não registram eventos `touchstart`, `pointerdown` ou equivalente, apesar da promessa da home de funcionar no celular.
- Apenas cinco jogos possuem links HTML estáticos na home; os cartões restantes são criados por JavaScript como `div onclick`, reduzindo rastreabilidade e acessibilidade.
- A busca anunciada no schema usa `?busca=`, mas a aplicação não lê esse parâmetro.
- Os números de jogadores, jogadas e avaliações são constantes no JavaScript; não há coleta que os sustente.
- Não foi encontrada ferramenta de analytics, evento de conversão, botão de compartilhamento ou service worker.
- HTTP redireciona corretamente para HTTPS com 301. `robots.txt` e `sitemap.xml` respondem 200.

## Prioridade 0 — medir antes de escalar

Adicionar uma solução de analytics com consentimento compatível com a política de privacidade e registrar:

- `view_home`
- `search_game`
- `filter_category`
- `game_open`
- `game_start`
- `game_end` com jogo, pontuação, duração e dificuldade
- `game_replay`
- `share_open`
- `share_complete`
- `challenge_open`
- `next_game_click`
- `install_pwa`

Funil principal: visita → jogo aberto → partida iniciada → partida concluída → replay/compartilhamento → retorno em D1/D7.

North-star inicial: **partidas concluídas por visitante semanal**. Métricas auxiliares: taxa de início, conclusão, replay, compartilhamento, abertura de desafio e retenção D1/D7.

Remover ou rotular como demonstração os números estáticos de “1,25 mi jogadores”, avaliações e jogadas. Prova social não verificável pode reduzir confiança e impede leitura real do crescimento.

## Prioridade 1 — criar o loop viral

Implementar primeiro em Cobrinha, Flappy Bird, Quiz e Invasores Espaciais:

1. Ao terminar a partida, gerar um cartão visual 1200×630 com nome do jogo, pontuação, recorde e CTA.
2. Exibir `Compartilhar resultado` usando Web Share API e fallback para WhatsApp/copiar link.
3. Criar links como `/games/snake.html?desafio=rafa&score=42`.
4. Ao abrir o link, mostrar “Bata 42 pontos” antes da partida.
5. Depois da partida, oferecer revanche e outro jogo relacionado, sem mandar o usuário de volta à home.

Texto-base: “Fiz 42 pontos na Cobrinha do GameHub. Consegue bater meu recorde? Jogue grátis, sem instalar.”

Depois de validar o compartilhamento, adicionar:

- desafio diário com a mesma semente para todos;
- sequência de dias e recorde local;
- ranking semanal com apelido opcional;
- badges autênticos conquistados em jogo;
- página pública de resultados/desafios com preview social dinâmico.

## Prioridade 1 — SEO e distribuição social

Em todas as páginas de jogo:

- título específico orientado à busca, por exemplo `Jogar Cobrinha Online Grátis no Navegador | GameHub`;
- descrição única;
- canonical HTTPS;
- `og:type`, `og:title`, `og:description`, `og:url` e imagem própria 1200×630;
- Twitter Card;
- JSON-LD `VideoGame` com URL, descrição, gênero, plataforma e imagem;
- conteúdo textual abaixo do jogo: como jogar, controles, estratégias, FAQ e jogos relacionados;
- breadcrumbs e links HTML reais para categoria e jogos relacionados.

Na home:

- transformar cada cartão em `<a href="...">`, mantendo o clique jogável;
- incluir URLs em todos os itens do `ItemList` e listar os 22 jogos, ou remover a lista incompleta;
- fazer `?busca=` preencher e executar a busca, ou remover `SearchAction` até a função existir;
- criar landing pages indexáveis por categoria (`/jogos/puzzle/`, `/jogos-para-celular/`, `/jogos-de-2-jogadores/`);
- adicionar `og:image:width`, `og:image:height`, `og:image:alt` e `twitter:image`.

## Prioridade 1 — retenção e navegação

- Abrir jogos na mesma aba ou em uma experiência de jogo integrada; a nova aba fragmenta a sessão.
- Adicionar “próximo jogo”, “jogar novamente” e recomendações no fim de cada partida.
- Criar “continue jogando” e favoritos com `localStorage`.
- Mostrar histórico real de recordes locais.
- Substituir “Popular” por ranking calculado a partir dos eventos reais.
- Oferecer instalação PWA apenas após engajamento; criar ícones PNG reais e service worker para cache/offline.

## Prioridade 1 — celular e acessibilidade

A promessa “PC e celular” precisa ser validada jogo a jogo. A maioria não tem eventos explícitos de toque/ponteiro e vários jogos exibem controles de teclado.

- Adicionar controles de toque visíveis aos jogos de ação e corrida.
- Usar Pointer Events para unificar mouse, caneta e toque.
- Testar 360×800, 390×844 e tablet em orientação vertical/horizontal.
- Adicionar nomes acessíveis aos botões e estados de foco.
- Respeitar `prefers-reduced-motion`.
- Garantir alvo de toque de pelo menos 44×44 px e contraste adequado.

## Experimentos de 30 dias

### Semana 1 — fundação

- Analytics e eventos.
- Remoção/rotulagem das métricas estáticas.
- Metadados completos para quatro jogos-piloto.
- Cards da home convertidos em links reais.

### Semana 2 — compartilhamento

- Tela de resultado compartilhável.
- Web Share + WhatsApp + copiar link.
- Deep link de desafio com pontuação-meta.
- Recomendações após a partida.

### Semana 3 — retorno

- Desafio diário em Cobrinha e Quiz.
- Sequência diária local.
- “Continue jogando” e favoritos.
- Primeira landing page de categoria.

### Semana 4 — otimização

- Comparar taxa de compartilhamento por jogo.
- Destacar na home os jogos com maior conclusão × compartilhamento.
- Testar dois textos de CTA e dois modelos de cartão social.
- Expandir o loop vencedor para os demais jogos.

## Critérios de sucesso iniciais

- ≥ 55% dos visitantes que abrem um jogo iniciam uma partida.
- ≥ 35% concluem uma partida.
- ≥ 20% jogam novamente ou abrem outro jogo.
- ≥ 3% abrem o compartilhamento e ≥ 1% concluem.
- ≥ 10% dos destinatários de desafio iniciam uma partida.
- Retenção D1 ≥ 8% após desafio diário.

Esses valores são metas de experimento, não benchmarks universais. Devem ser recalibrados após duas semanas de dados reais.

## O que não priorizar agora

- Produzir dezenas de jogos novos antes de medir os atuais.
- Criar cadastro obrigatório.
- Comprar tráfego antes de existir retenção e atribuição.
- Investir em ranking global complexo antes de validar compartilhamento por desafio.
- Publicar avaliações ou contadores sem origem verificável.

## Ordem recomendada de implementação

1. Analytics e eventos.
2. Metadados e links rastreáveis.
3. Resultado compartilhável + desafio por URL em quatro jogos.
4. Controles móveis e QA dos jogos-piloto.
5. Recomendação pós-partida e desafio diário.
6. Landing pages de categorias baseadas nas consultas que começarem a gerar impressões.
