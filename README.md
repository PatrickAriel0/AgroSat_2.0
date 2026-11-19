# AgroSat — Irrigação Inteligente com Dados Satelitais & Meteorologia

> **FIAP Graduação 2026/2 · Global Solution — CitizenTech**  
> **Disciplina:** Front-End Design Engineering  
> **Turma:** 1TDSPK  
> **Tema:** CitizenTech — Tecnologia com o cidadão no centro da inovação  

---

## 📌 Links do Projeto

* 🌐 **Aplicação no ar (Vercel):** `https://agro-sat-2-0.vercel.app/` *(substituir pela URL após deploy)*
* 🔗 **Repositório no GitHub:** [https://github.com/PatrickAriel0/AgroSat_2_0](https://github.com/PatrickAriel0/AgroSat_2_0)
* ⚙️ **API RESTful Java (Render):** `https://agrosat-api-eay6.onrender.com`
* 🎥 **Vídeo Demonstrativo (YouTube):** `https://youtu.be/SEU_VIDEO_AQUI` *(máximo 3 minutos)*

---

## 🚀 Objetivo do Projeto

O **AgroSat** é uma *CitizenTech* focada em resolver o problema do desperdício de água e energia na **agricultura familiar brasileira**. 

Historicamente, pequenos produtores rurais decidem irrigar baseando-se apenas na intuição, muitas vezes acionando bombas de irrigação poucas horas antes de temporais. O AgroSat cruza dados de **sensoriamento remoto** (umidade do solo) com a **previsão meteorológica regional de 72 horas (Open-Meteo)** para entregar uma orientação diária simples: **quando irrigar e quando poupar água**.

### Alinhamento com os ODS da ONU
* **ODS 2 — Fome Zero e Agricultura Sustentável:** Apoio à segurança alimentar e resiliência de pequenas lavouras familiares.
* **ODS 9 — Indústria, Inovação e Infraestrutura:** Acesso democrático a dados satelitais abertos e infraestrutura em nuvem.
* **ODS 13 — Ação Contra a Mudança Global do Clima:** Gestão hídrica eficiente para enfrentar períodos de seca e escassez.

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Finalidade no Projeto |
| :--- | :--- |
| **React 18** | Biblioteca para construção da interface SPA reativa e componentizada |
| **Vite** | Bundler e ambiente de desenvolvimento ultrarrápido |
| **TypeScript** | Tipagem estática estrita para props, estados e modelos da API |
| **Tailwind CSS** | Estilização utilitária de alto desempenho, mobile-first e temas escuros |
| **Fetch API** | Comunicação HTTP nativa com o backend (conforme restrição do edital, sem Axios) |
| **MapLibre GL** | Motor cartográfico vetorial e interativo para localização georreferenciada de fazendas |
| **Open-Meteo & IBGE** | Consulta pública de previsão 72h e classificação pedológica SiBCS do solo |
| **Lucide React** | Conjunto de ícones leves e consistentes com a identidade visual |

---

## 🗺️ Mapa de Rotas e Telas da Aplicação

### 1. Fluxo de Autenticação e Onboarding
* `/login` — Login com perfis duplos: Produtor Rural (`/painel-usuario`) ou Administrador da Cooperativa (`/admin-cooperativa`).
* `/cadastro` — Cadastro guiado com **Seletor de Fazenda Interativo** (MapLibre), geocodificação de cidades, GPS e **Cartão de Solo IBGE (SiBCS)** com JSON payload em tempo real.
* `/planos` — Passo 2 de Onboarding com escolha de planos (Teste Grátis R$ 0 / 7 dias, Mensal R$ 49,90, Anual R$ 590).

### 2. Painéis do Usuário & CitizenTech
* `/painel-usuario` — Dashboard principal do produtor com 4 módulos integrados:
  * `01 Nova plantação` (formulário com coordenadas).
  * `02 Recomendação` (orientação imediata REGAR / NÃO REGAR com métricas).
  * `03 Histórico de recomendações` (tabela de auditoria temporal).
  * `04 Economia da fazenda` (cálculo de água poupada em litros e gráfico semanal).
* `/recomendacao-hoje` — **Recomendação de hoje** com balanço hídrico agronômico detalhado (Método FAO-56: umidade, chuva prevista, evaporação e saldo líquido), confiança estatística e indicação de funcionamento offline.
* `/mapa-plantacoes` — **Mapa de Plantações** com motor cartográfico MapLibre GL interativo, marcadores das propriedades rurais e ferramenta para marcação de novos talhões com coordenadas georreferenciadas.
* `/admin-cooperativa` — Visão gerencial para cooperativas com indicadores agregados (litros poupados, alertas de seca) e metas de impacto nos **ODS 2 e ODS 13**.

### 3. Páginas Institucionais Obrigatórias
* `/` — Página inicial com proposta de valor, métricas e CTA.
* `/sobre` — Missão, visão, valores e alinhamento CitizenTech.
* `/solucao` — Arquitetura de dados, sensoriamento remoto e simulador de decisões.
* `/painel` & `/painel/fazenda/:id` — Gerenciador de fazendas e histórico de simulações.
* `/faq` — Dúvidas frequentes de pequenos produtores.
* `/contato` — Formulário com validação e canais de atendimento.
* `/integrantes` & `/integrantes/:id` — Perfil individual dos 5 integrantes da equipe FIAP com fotos e RMs.

---

## 👥 Equipe de Desenvolvimento

| Foto | Nome | RM | Função no Projeto | Links |
| :---: | :--- | :---: | :--- | :---: |
| <img src="public/assets/img/Patrick.jpeg" width="70" style="border-radius:50%" /> | **Patrick Ariel** | 573589 | Integração satelital, serviços e arquitetura | [GitHub](https://github.com/PatrickAriel0) · [LinkedIn](https://www.linkedin.com/in/patrick-ariel-369a55384) |
| <img src="public/assets/img/Gustavo%20Correia.jpeg" width="70" style="border-radius:50%" /> | **Gustavo Correia** | 568745 | Front-end, CSS responsivo e estilização Tailwind | [GitHub](https://github.com/romoaldo67) · [LinkedIn](https://www.linkedin.com/in/gustavo-correia-456027410/) |
| <img src="public/assets/img/Gustavo%20Gon%C3%A7alvez.jpeg" width="70" style="border-radius:50%" /> | **Gustavo Gonçalves** | 572418 | FAQ interativo, busca dinâmica e filtros | [GitHub](https://github.com/TheK1ngBr) · [LinkedIn](https://www.linkedin.com/in/gustavo-gonçalves-903596403) |
| <img src="public/assets/img/Pedro%20Henrique.jpeg" width="70" style="border-radius:50%" /> | **Pedro Henrique** | 573547 | Formulários, validação em tempo real e UX | [GitHub](https://github.com/PedrinhoSatz) · [LinkedIn](https://www.linkedin.com/in/pedro-henrique-0b1827355) |
| <img src="public/assets/img/Bruno%20Pires.jpeg" width="70" style="border-radius:50%" /> | **Bruno Pires** *(Rep.)* | 571202 | Painel interativo, motor de decisão e rotas | [GitHub](https://github.com/brunogmanhaes-cell) · [LinkedIn](https://www.linkedin.com/in/bruno-pires-manh%C3%A3es-ba7ab9401/) |

---

## 📂 Estrutura de Pastas do Projeto

A organização segue rigorosamente os padrões de componentização e separação de responsabilidades exigidos no edital:

```
AgroSat/
├── public/                     # Recursos estáticos e imagens dos integrantes
│   └── assets/img/
├── src/
│   ├── components/             # Componentes reutilizáveis
│   │   ├── Header.tsx          # Navbar com menu mobile responsivo
│   │   ├── Footer.tsx          # Rodapé com metadados acadêmicos e ODS
│   │   └── DecisionEngine.tsx  # Motor analítico interativo de decisão
│   ├── data/
│   │   └── integrantesData.ts  # Dados completos da equipe
│   ├── pages/                  # Páginas da aplicação SPA
│   │   ├── Home.tsx            # Apresentação do projeto e simulador
│   │   ├── Sobre.tsx           # Contexto do problema, ODS e stack
│   │   ├── Solucao.tsx         # Comparativo antes x depois e métricas
│   │   ├── FAQ.tsx             # Accordion com busca e filtros
│   │   ├── Contato.tsx         # Formulário com validação e feedback
│   │   ├── Integrantes.tsx     # Ficha de todos os integrantes
│   │   ├── IntegranteDetalhe.tsx # Rota dinâmica com parâmetro (:id)
│   │   ├── Painel.tsx          # Painel interativo com listagem e CRUD
│   │   ├── CadastrarFazenda.tsx# Cadastro completo com múltiplos talhões
│   │   └── FazendaDetalhe.tsx  # Detalhes climáticos e leituras de solo (:id)
│   ├── services/               # Camada de serviços e integração de APIs
│   │   ├── api.ts              # Integração com API Java REST via Fetch API
│   │   └── weatherService.ts   # Integração com a API Open-Meteo
│   ├── types/                  # Interfaces TypeScript dos modelos e DTOs
│   │   └── index.ts
│   ├── App.tsx                 # Configuração de rotas estáticas e dinâmicas
│   ├── main.tsx                # Ponto de entrada React
│   └── index.css               # Diretivas do Tailwind CSS e fontes
├── index.html                  # HTML base com importação de fontes Google
├── package.json                # Dependências e scripts de execução
├── tailwind.config.js          # Configuração da paleta de cores e tipografia
├── tsconfig.json               # Configurações do TypeScript
├── vercel.json                 # Regras de rewrite SPA para deploy na Vercel
└── vite.config.ts              # Configuração do Vite com React plugin
```

---

## 💻 Como Executar Localmente

### Pré-requisitos
* **Node.js** (versão 18+ recomendada)
* **npm** ou gerenciador de pacotes equivalente

### Passo a passo
1. Clone o repositório:
   ```bash
   git clone https://github.com/PatrickAriel0/AgroSat_2_0.git
   cd AgroSat_2_0
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Acesse no navegador o endereço exibido (geralmente `http://localhost:5173`).

5. Para gerar a versão de produção (build):
   ```bash
   npm run build
   ```

---

## 📱 Responsividade e Resoluções Avaliadas

O layout foi planejado e homologado rigorosamente nos três breakpoints exigidos pelo edital:
* **Mobile:** `390 × 844 px` (com navegação por menu hambúrguer)
* **Tablet:** `768 × 1024 px` (layout adaptativo em 2 colunas)
* **Desktop:** `1440 × 900 px` (grid completo sem rolagem horizontal indevida)

---

## 🛡️ Integração com API REST Java (DDD)

A comunicação com o backend em Spring Boot segue as boas práticas RESTful utilizando exclusivamente a **Fetch API** nativa:
* **GET `/fazendas`**: Consulta real e listagem de propriedades cadastradas.
* **GET `/fazendas/{id}`**: Detalhes da fazenda, talhões e histórico de leituras.
* **POST `/fazendas`**: Cadastro de nova fazenda e seus respectivos talhões.
* **DELETE `/fazendas/{id}`**: Exclusão de propriedade rural.
* **POST `/fazendas/{id}/talhoes/{talhaoId}/leituras`**: Registro de nova leitura de umidade do solo.
* **Resiliência e Fallback:** Caso a API remota no Render esteja iniciando ou offline durante a avaliação, o sistema conta com persistência local espelhada, garantindo que o avaliador nunca presencie tela quebrada ou perda de dados.

---

## 📄 Licença e Uso Acadêmico

Trabalho desenvolvido exclusivamente para fins acadêmicos na disciplina de **Front-End Design Engineering** da **FIAP**.  
Global Solution 2026/2 · CitizenTech.
