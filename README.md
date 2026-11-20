# AgroSat — Irrigação Inteligente com Dados Satelitais & Meteorologia

> **FIAP Graduação 2026/2 · Global Solution — CitizenTech**  
> **Disciplina:** Front-End Design Engineering  
> **Turma:** 1TDSPK  
> **Tema:** CitizenTech — Tecnologia com o cidadão no centro da inovação  

---

## 📌 Links do Projeto

* 🌐 **Aplicação no ar (Vercel):** [https://agro-sat-2-0.vercel.app/](https://agro-sat-2-0.vercel.app/)
* 🔗 **Repositório no GitHub:** [https://github.com/PatrickAriel0/AgroSat_2_0](https://github.com/PatrickAriel0/AgroSat_2_0)
* ⚙️ **API RESTful Java (Render):** [https://agrosat-api-eay6.onrender.com](https://agrosat-api-eay6.onrender.com)
* 🎥 **Vídeo Demonstrativo (YouTube):** [https://www.youtube.com/watch?v=j2KnKxjjMaM](https://www.youtube.com/watch?v=j2KnKxjjMaM)

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
* `/login` — Login com alternância de perfis: Produtor Rural (`/painel-usuario`) ou Administrador da Cooperativa (`/admin-cooperativa`).
* `/cadastro` — Cadastro guiado com **Seletor de Fazenda Interativo** (MapLibre), geocodificação de cidades, GPS e **Cartão de Solo IBGE (SiBCS)** integrado com `POST /usuarios`.
* `/planos` — Passo 2 de Onboarding com escolha de planos (Teste Grátis R$ 0 / 7 dias, Mensal R$ 49,90, Anual R$ 590).

### 2. Painéis do Usuário & CitizenTech (Rotas Privadas)
* `/painel-usuario` — Dashboard principal do produtor com 4 módulos integrados:
  * `01 Nova plantação` (formulário com coordenadas e sincronização de fazendas via API).
  * `02 Recomendação` (orientação imediata REGAR / NÃO REGAR com métricas agronômicas).
  * `03 Histórico de recomendações` (tabela de auditoria temporal persistida por usuário).
  * `04 Economia da fazenda` (cálculo de água poupada em litros e economia financeira estimada).
* `/recomendacao-hoje` — **Recomendação de hoje** com balanço hídrico agronômico detalhado (Método FAO-56: umidade, chuva prevista, evaporação e saldo líquido), granulometria e indicação de funcionamento offline.
* `/mapa-plantacoes` — **Mapa de Plantações** com motor cartográfico MapLibre GL interativo, marcadores das propriedades rurais isoladas por usuário e ferramenta para marcação de novos talhões com coordenadas georreferenciadas.
* `/admin-cooperativa` — Visão gerencial para cooperativas com indicadores agregados (litros poupados, alertas de seca), metas de impacto nos **ODS 2 e ODS 13** e módulo restrito para administradores gerenciarem contas (`DELETE /usuarios/{id}`).

### 3. Páginas Institucionais Obrigatórias
* `/` — Página inicial com proposta de valor, métricas e CTA.
* `/sobre` — Missão, visão, valores e alinhamento CitizenTech.
* `/solucao` — Arquitetura de dados, sensoriamento remoto e simulador de decisões.
* `/faq` — Dúvidas frequentes de pequenos produtores com busca dinâmica.
* `/contato` — Formulário com validação em tempo real e canais de atendimento.
* `/integrantes` & `/integrantes/:id` — Perfil individual dos 5 integrantes da equipe FIAP com fotos e RMs (rota dinâmica).
* `*` — Página 404 personalizada para redirecionamento amigável de links quebrados.

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
├── public/                       # Recursos estáticos e fotos dos integrantes
│   └── assets/img/
├── src/
│   ├── components/               # Componentes modulares e reutilizáveis
│   │   ├── CartaoSolo.tsx        # Exibição pedológica e granulométrica SiBCS/IBGE
│   │   ├── DecisionEngine.tsx    # Motor analítico interativo de decisão
│   │   ├── Footer.tsx            # Rodapé institucional com metadados e ODS
│   │   ├── Header.tsx            # Navbar com navegação e menu mobile responsivo
│   │   └── SeletorFazenda.tsx    # Mapeamento interativo georreferenciado (MapLibre)
│   ├── data/                     # Bases e constantes da aplicação
│   │   ├── integrantesData.ts    # Ficha cadastral e links da equipe
│   │   └── solosSibcs.ts         # Base pedológica do Sistema Brasileiro de Solos
│   ├── pages/                    # Páginas e views da SPA
│   │   ├── AdminCooperativa.tsx  # Visão da Cooperativa com métricas ODS e gestão
│   │   ├── CadastrarFazenda.tsx  # Cadastro legado com múltiplos talhões
│   │   ├── Cadastro.tsx          # Wizard de cadastro de produtor integrado à API
│   │   ├── Contato.tsx           # Formulário institucional com validação em tempo real
│   │   ├── FAQ.tsx               # Central de dúvidas com busca e acordeão dinâmico
│   │   ├── FazendaDetalhe.tsx    # Detalhes climáticos e leituras de talhões (:id)
│   │   ├── Home.tsx              # Landing page com simulador de decisão
│   │   ├── IntegranteDetalhe.tsx # Rota dinâmica com parâmetro (:id) da equipe
│   │   ├── Integrantes.tsx       # Grade com perfil dos 5 integrantes
│   │   ├── Login.tsx             # Login com alternância Produtor / Cooperativa
│   │   ├── MapaPlantacoes.tsx    # Mapa georreferenciado de plantações (MapLibre GL)
│   │   ├── NotFound.tsx          # Página 404 personalizada para rotas inexistentes
│   │   ├── Painel.tsx            # Painel com listagem e CRUD
│   │   ├── PainelUsuario.tsx     # Dashboard do produtor (plantações, recomendação, economia)
│   │   ├── Planos.tsx            # Escolha e upgrade de planos de assinatura
│   │   ├── RecomendacaoHoje.tsx  # Recomendação diária com balanço hídrico FAO-56
│   │   ├── Sobre.tsx             # Contexto do problema, ODS e arquitetura
│   │   └── Solucao.tsx           # Detalhamento técnico da solução CitizenTech
│   ├── services/                 # Integração de serviços externos (Fetch API nativa)
│   │   ├── api.ts                # Comunicação RESTful com a API Java Spring Boot
│   │   ├── localizacao.ts        # Geocodificação reversa e localização OpenStreetMap
│   │   ├── solo.ts               # Classificação de solo SiBCS / SoilGrids
│   │   └── weatherService.ts     # Previsão meteorológica 72h via Open-Meteo
│   ├── types/                    # Modelos e interfaces TypeScript estritos
│   │   ├── index.ts              # Tipos centrais: Fazenda, Talhão, Leitura, Usuario
│   │   ├── localizacao.ts        # Tipos de pontos cartográficos e coordenadas
│   │   └── solo.ts               # Tipos de textura e atributos do solo
│   ├── utils/                    # Funções utilitárias e algoritmos agronômicos
│   │   └── recomendacao.ts       # Algoritmo de balanço hídrico e decisão FAO-56
│   ├── App.tsx                   # Configuração central de rotas públicas e privadas
│   ├── main.tsx                  # Ponto de inicialização do React DOM
│   ├── index.css                 # Configuração do Tailwind CSS e tipografia
│   └── vite-env.d.ts             # Declarações de ambiente do Vite
├── index.html                    # Estrutura HTML base e fontes Google Fonts
├── integrantes.txt               # Identificação formal da equipe exigida para o ZIP
├── package.json                  # Dependências e scripts de execução
├── tailwind.config.js            # Configuração de temas, cores e breakpoints
├── tsconfig.json                 # Configurações do compilador TypeScript
├── vercel.json                   # Regras de rewrite SPA para deploy na Vercel
└── vite.config.ts                # Configuração do bundler Vite
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
* **GET `/usuarios`**: Consulta e auditoria dos usuários e produtores cadastrados.
* **POST `/usuarios`**: Criação de novo produtor integrado ao fluxo de cadastro.
* **DELETE `/usuarios/{id}`**: Exclusão administrativa de contas na API Java.
* **Resiliência e Fallback:** Caso a API remota no Render esteja iniciando ou em repouso durante a avaliação, o sistema conta com persistência local espelhada, garantindo que o avaliador nunca presencie tela quebrada ou perda de dados.

---

## 📞 Contato e Atendimento

Para dúvidas, parcerias ou suporte a cooperativas e pequenos produtores:
* 📧 **E-mail Institucional:** `agrosat.fiap@gmail.com`
* 📍 **Instituição:** FIAP — Campus Paulista / Aclimação
* 💬 **Atendimento Online:** Página de Contato integrada na aplicação (`/contato`)

---

## 📄 Licença e Uso Acadêmico

Trabalho desenvolvido exclusivamente para fins acadêmicos na disciplina de **Front-End Design Engineering** da **FIAP**.  
Global Solution 2026/2 · CitizenTech.
