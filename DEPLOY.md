# 🚀 Guia de Deploy do GameHub

Este guia leva o site do seu computador até o ar, gratuito, em ~15 minutos.

---

## 📋 Pré-requisitos

- Conta GitHub (grátis) → https://github.com/signup
- Opcional: conta Netlify ou Vercel (pode logar com GitHub)

---

## PASSO 1 — Publicar o código no GitHub

1. Acesse https://github.com/new
2. Nome do repositório: `gamehub`
3. Marque como **Público** → **Create repository**
4. Na pasta do projeto, rode no terminal:

```bash
cd "C:\Users\Rafael Antonio\Desktop\plataforma-jogos"
git init
git add .
git commit -m "GameHub - plataforma de jogos online"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/gamehub.git
git push -u origin main
```

---

## PASSO 2 — Deploy no Netlify (grátis + HTTPS)

1. Acesse https://app.netlify.com e faça login com GitHub
2. Clique em **"Add new site" → "Import an existing project"**
3. Selecione o repositório `gamehub`
4. Configurações (já detectadas pelo `netlify.toml`):
   - Build command: (vazio)
   - Publish directory: `.`
5. Clique em **"Deploy site"**
6. Em ~1 minuto o site estará no ar: `https://seu-site.netlify.app`

**Alternativa (Vercel):** https://vercel.com/new → importe o repositório → Deploy (mesmo processo, zero configuração).

---

## PASSO 3 — Domínio próprio (~R$40/ano)

1. Compre um domínio em um registrador:
   - https://registro.br (domínios .com.br — mais confiável no Brasil)
   - https://www.namecheap.com (.com)
2. No Netlify: **Site settings → Domain management → Add custom domain**
3. Digite seu domínio (ex: `gamehub.com.br`) e siga as instruções de DNS
4. O **HTTPS (SSL)** é ativado automaticamente e de graça

---

## PASSO 4 — Atualizar as URLs do projeto

Com o domínio definido (ex: `https://gamehub.com.br`), substitua nos arquivos:

| Arquivo | O que trocar |
|---------|-------------|
| `index.html` (3x) | `https://gamehub.example.com/` → seu domínio |
| `sitemap.xml` (7x) | `https://gamehub.example.com/` → seu domínio |
| `robots.txt` (1x) | `https://gamehub.example.com/sitemap.xml` → seu domínio |

**Dica:** rode o `abrir-site.bat` depois das trocas e faça um commit + push para o site atualizar automaticamente.

---

## PASSO 5 — Google Search Console

1. Acesse https://search.google.com/search-console
2. Adicione a propriedade (domínio ou URL prefix)
3. Verifique a propriedade (opção mais fácil: DNS via registrador)
4. Envie o sitemap: **Sitemaps →** digite `sitemap.xml` → **Enviar**
5. Use **"Inspeção de URL"** para solicitar indexação da home

O Google pode levar de **3 dias a 2 semanas** para começar a indexar.

---

## PASSO 6 — Google AdSense (após ter tráfego)

**Antes de aplicar, garanta:**
- ✅ Domínio próprio ativo (não aceita netlify.app)
- ✅ Páginas legais publicadas (já temos: Política + Termos)
- ✅ 20-30 páginas/consistente conteúdo (páginas de jogo contam)
- ✅ Algum tráfego orgânico

**Aplicação:**
1. Acesse https://adsense.google.com
2. Adicione o site e aguarde a análise (1-14 dias)
3. Ao aprovar, o código de anúncio será fornecido — inserir no `<head>` do `index.html`
4. Criar unidades de anúncio: banner topo (728x90/ responsivo) e sidebar

---

## 🔄 Fluxo de atualização do site

```bash
# Após fazer alterações locais:
git add .
git commit -m "descrição da mudança"
git push
# Netlify detecta o push e publica automaticamente em ~1 minuto
```

**Lembre-se de subir a versão de cache** em `index.html` (`?v=2.x`) quando alterar CSS/JS!

---

## 📱 Testes pós-deploy

- [ ] Site abre com HTTPS (cadeado verde)
- [ ] Jogos abrem em nova aba e funcionam
- [ ] Teste no celular (responsividade)
- [ ] Google Search Console: sitemap processado
- [ ] PageSpeed Insights: https://pagespeed.web.dev (meta: >90 mobile)
