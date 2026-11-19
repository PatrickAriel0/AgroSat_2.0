# 📋 Guia Oficial de Commits e Divisão Equitativa — AgroSat 2.0
> **FIAP 2026/2 · Global Solution — CitizenTech**  
> **Disciplina:** Front-End Design Engineering  
> **Turma:** 1TDSPK · **Prazo Final Impreterível:** 19/11/2026 às 23h55  

---

## ⚖️ Ordem Oficial dos Integrantes (7 Commits cada = 35 Commits no Total)

1. **1º Patrick Ariel** (Commits 01 ao 07) — Setup, Arquitetura, Estilização e Motor MapLibre GL
2. **2º Gustavo Gonçalves** (Commits 08 ao 14) — Modelagem TypeScript, Dados SiBCS IBGE, FAQ e Rota Dinâmica *(Executar hoje)*
3. **3º Bruno Pires** (Commits 15 ao 21) — Lógica Agronômica, Previsão Open-Meteo, Balanço FAO-56 e Dashboard do Usuário
4. **4º Pedro Henrique** (Commits 22 ao 28) — Onboarding (Login/Cadastro), Planos (1, 3 e 10 fazendas), Home, Contato e Roteamento SPA
5. **5º Gustavo Correia** (Commits 29 ao 35) — **Por Último**: Integração com a **API Java Spring Boot (DDD)**, Gestão de Fazendas, README e Push Final

---

## 🚀 Como Iniciar o Repositório no GitHub

```bash
# Na pasta d:\Projeto agroSAT\AgroSat:
git init
git remote add origin https://github.com/SEU_USUARIO/AgroSat-2.0.git
git branch -M main
```

---

## 📅 Roteiro dos 35 Commits (Passo a Passo)

### 👤 1º BLOCO: Patrick Ariel (Commits 1 ao 7)
*Configure o Git antes de rodar os commits:*
```bash
git config user.name "Patrick Ariel"
git config user.email "seu-email-patrick@exemplo.com"

# Commit 01
git add package.json tsconfig.json tsconfig.node.json vite.config.ts .gitignore
git commit -m "chore: setup inicial do projeto com Vite, React 18 e TypeScript"

# Commit 02
git add tailwind.config.js postcss.config.js src/index.css
git commit -m "style: configuracao do Tailwind CSS com a paleta dark-green institucional"

# Commit 03
git add index.html src/main.tsx src/vite-env.d.ts
git commit -m "feat: configuracao do ponto de entrada da SPA e declaracoes de tipos de ambiente"

# Commit 04
git add src/components/Header.tsx
git commit -m "feat(ui): desenvolvimento da barra de navegacao com menu drawer responsivo"

# Commit 05
git add src/components/Footer.tsx
git commit -m "feat(ui): criacao do footer institucional com selos ODS 2, 9 e 13"

# Commit 06
git add src/components/SeletorFazenda.tsx src/services/localizacao.ts
git commit -m "feat(map): componente SeletorFazenda com MapLibre GL, busca por cidade e GPS"

# Commit 07
git add src/pages/MapaPlantacoes.tsx
git commit -m "feat(map): mapa interativo de plantacoes com marcadores e popups do MapLibre"
```

---

### 👤 2º BLOCO: Gustavo Gonçalves (Commits 8 ao 14)
*Execute hoje logo após o Patrick:*
```bash
git config user.name "Gustavo Gonçalves"
git config user.email "seu-email-gustavo-goncalves@exemplo.com"

# Commit 08
git add src/types/localizacao.ts src/types/solo.ts
git commit -m "feat(types): interfaces TypeScript para coordenadas geograficas e classificacao pedologica"

# Commit 09
git add src/types/index.ts
git commit -m "feat(types): modelos de dados para fazendas, talhoes e leituras historicas de umidade"

# Commit 10
git add src/data/solosSibcs.ts
git commit -m "feat(data): mapeamento pedologico das ordens do solo brasileiro com base no SiBCS IBGE"

# Commit 11
git add src/components/CartaoSolo.tsx
git commit -m "feat(components): cartao de solo interativo com feedback visual e tratamento de erro"

# Commit 12
git add src/pages/FAQ.tsx
git commit -m "feat(pages): pagina de perguntas frequentes com busca contextual e filtros de categoria"

# Commit 13
git add src/data/integrantesData.ts src/pages/Integrantes.tsx
git commit -m "feat(pages): pagina da equipe com dados, RMs, cargos e fotos dos 5 integrantes"

# Commit 14
git add src/pages/IntegranteDetalhe.tsx
git commit -m "feat(pages): implementacao de rota dinamica com useParams para o perfil individual"
```

---

### 👤 3º BLOCO: Bruno Pires (Commits 15 ao 21)
*Lógica Agronômica, Previsão e Dashboard:*
```bash
git config user.name "Bruno Pires"
git config user.email "seu-email-bruno@exemplo.com"

# Commit 15
git add src/services/weatherService.ts
git commit -m "feat(services): integracao com Open-Meteo para previsao horaria de 72h e probabilidade de chuva"

# Commit 16
git add src/components/DecisionEngine.tsx
git commit -m "feat(components): motor de simulacao analitico cruzando umidade do solo e limiares de chuva"

# Commit 17
git add src/pages/RecomendacaoHoje.tsx
git commit -m "feat(pages): tela Recomendacao de Hoje detalhando o balanco hidrico (metodo FAO-56)"

# Commit 18
git add src/pages/Solucao.tsx
git commit -m "feat(pages): pagina explicativa da arquitetura da solucao CitizenTech e matriz analitica"

# Commit 19
git add src/pages/Sobre.tsx
git commit -m "feat(pages): pagina institucional Sobre o AgroSat com missao, visao e pilares de impacto"

# Commit 20
git add src/pages/PainelUsuario.tsx
git commit -m "feat(pages): dashboard operacional do usuario com modulos de plantacao e recomendacao"

# Commit 21
git add src/pages/PainelUsuario.tsx
git commit -m "feat(pages): implementacao do painel de economia hidrica com grafico semanal de barras"
```

---

### 👤 4º BLOCO: Pedro Henrique (Commits 22 ao 28)
*Onboarding, Planos, UI e Roteamento:*
```bash
git config user.name "Pedro Henrique"
git config user.email "seu-email-pedro@exemplo.com"

# Commit 22
git add src/pages/Login.tsx
git commit -m "feat(auth): tela de login com selecao de perfis de Produtor e Administrador"

# Commit 23
git add src/pages/Cadastro.tsx
git commit -m "feat(onboarding): formulario de cadastro do produtor com seletor MapLibre e preview JSON"

# Commit 24
git add src/pages/Planos.tsx
git commit -m "feat(pricing): tela de planos com limites de 1 fazenda (gratis), 3 (mensal) e 10 (anual)"

# Commit 25
git add src/pages/Painel.tsx
git commit -m "feat(pages): painel demonstrativo explicativo com preview dos 4 modulos e CTA de cadastro"

# Commit 26
git add src/pages/Home.tsx
git commit -m "feat(pages): landing page principal com demonstracao interativa e apresentacao do AgroSat"

# Commit 27
git add src/pages/Contato.tsx
git commit -m "feat(pages): formulario de contato com validacao de campos e feedback de envio"

# Commit 28
git add src/App.tsx vercel.json
git commit -m "feat(router): finalizacao do roteamento SPA com React Router e configuracao de deploy Vercel"
```

---

### 👤 5º BLOCO: Gustavo Correia (Commits 29 ao 35 — POR ÚLTIMO)
*Integração com a API Java Spring Boot, Assets e Finalização:*
```bash
git config user.name "Gustavo Correia"
git config user.email "seu-email-gustavo-correia@exemplo.com"

# Commit 29
git add src/services/api.ts
git commit -m "feat(api): camada de servico FazendaService via Fetch nativo com timeout e AbortController"

# Commit 30
git add src/services/solo.ts
git commit -m "feat(api): integracao com o endpoint /api/solos do backend Java Spring Boot"

# Commit 31
git add src/pages/CadastrarFazenda.tsx
git commit -m "feat(pages): formulario de cadastro de propriedades rurais integrado a API Java"

# Commit 32
git add src/pages/FazendaDetalhe.tsx
git commit -m "feat(pages): tela de detalhes da propriedade, listagem de talhoes e historico de medicoes"

# Commit 33
git add src/pages/AdminCooperativa.tsx
git commit -m "feat(pages): painel administrativo da cooperativa com indicadores de agua poupada"

# Commit 34
git add public/assets/img/ .env.example
git commit -m "chore(config): inclusao de fotografias da equipe e variaveis de ambiente da API Java"

# Commit 35
git add README.md identificacao_grupo.txt GUIA_COMMITS_AGROSAT.md
git commit -m "docs: documentacao completa no README com instrucoes de execucao, links e dados da equipe"

# Envio para o repositório remoto
git push -u origin main
```

---

## 📦 Como Gerar o Arquivo .ZIP para o Portal da FIAP
```powershell
Get-ChildItem -Path . -Exclude "node_modules", "dist", ".git" | Compress-Archive -DestinationPath "..\AgroSat_FrontEnd_GS.zip" -Force
```
O `.zip` resultante terá menos de 3 MB e conterá o arquivo [`identificacao_grupo.txt`](file:///d:/Projeto%20agroSAT/AgroSat/identificacao_grupo.txt) com os dados de todos os integrantes.
