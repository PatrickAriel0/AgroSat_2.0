import React from 'react';
import { Satellite, CloudSun, Database, Layers, Code, Globe2, Sparkles, CheckCircle2 } from 'lucide-react';

export const Sobre: React.FC = () => {
  const tecnologias = [
    {
      categoria: 'Sensoriamento Remoto',
      nome: 'Sentinel-2 & Landsat',
      descricao: 'Satélites de observação da Terra com imagens multiespectrais gratuitas (ESA/Copernicus e NASA), permitindo estimar índices de vegetação (NDVI) e umidade da camada superficial do solo.',
      icon: Satellite,
    },
    {
      categoria: 'Meteorologia de Precisão',
      nome: 'Open-Meteo API',
      descricao: 'Serviço meteorológico de alta resolução com previsões horárias e diárias de precipitação acumulada em 72h e temperaturas para as coordenadas geográficas da propriedade.',
      icon: CloudSun,
    },
    {
      categoria: 'Back-end & Arquitetura',
      nome: 'Spring Boot (Java DDD)',
      descricao: 'API RESTful desenvolvida com Domain Driven Design, DAO JDBC puro, DTOs com Bean Validation e deploy automatizado via Docker no Render.',
      icon: Layers,
    },
    {
      categoria: 'Banco de Dados Relacional',
      nome: 'Oracle SQL Database',
      descricao: 'Modelagem relacional completa no Oracle Data Modeler da FIAP, garantindo integridade referencial, constraints, sequences e persistência dos dados de fazendas e leituras.',
      icon: Database,
    },
    {
      categoria: 'Front-End Design Engineering',
      nome: 'React + Vite + TypeScript + Tailwind',
      descricao: 'Single Page Application (SPA) modular, estritamente tipada com TypeScript, estilizada com Tailwind CSS utilitário e consumo nativo via Fetch API.',
      icon: Code,
    },
    {
      categoria: 'Inteligência e Dados',
      nome: 'Python & Machine Learning',
      descricao: 'Modelos preditivos desenvolvidos em notebooks para previsão de tendências de umidade e classificação de risco hídrico.',
      icon: Sparkles,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* Hero */}
      <div className="max-w-3xl">
        <span className="text-xs font-mono uppercase tracking-wider text-brand-primary bg-emerald-950/60 px-3.5 py-1 rounded-full border border-brand-primary/20">
          Contexto & Propósito
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading text-white mt-3 mb-5">
          Sobre o <span className="text-brand-primary">AgroSat</span>
        </h1>
        <p className="text-lg text-brand-text-body leading-relaxed">
          Transformando dados espaciais e previsões meteorológicas em decisões diárias práticas para o pequeno produtor que não pode desperdiçar água nem recursos.
        </p>
      </div>

      {/* O Problema */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-5">
          <span className="text-xs font-mono text-brand-primary uppercase tracking-widest">// O Desafio Real</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white">
            A agricultura familiar ainda irriga na intuição
          </h2>
          <p className="text-brand-text-body leading-relaxed">
            O Brasil conta com mais de <strong>10 milhões de produtores da agricultura familiar</strong>, responsáveis pela maioria dos alimentos que chegam à mesa. Historicamente, a decisão de ligar a bomba de irrigação é tomada no olho: olha-se para o céu, toca-se a terra seca na superfície e a bomba é acionada.
          </p>
          <p className="text-brand-text-body leading-relaxed">
            Se uma chuva de 20 mm cai algumas horas depois, a irrigação anterior foi puro desperdício de água, desgaste de bombas elétricas e consumo indevido na conta de luz.
          </p>
          <p className="text-brand-text-body leading-relaxed">
            O <strong>AgroSat</strong> nasce como uma verdadeira <em>CitizenTech</em>: democratiza o acesso a dados de satélites e meteorologia que antes só estavam ao alcance do grande agronegócio.
          </p>
        </div>

        <div className="bg-[#0b180d] border border-brand-border rounded-2xl p-7 sm:p-8 space-y-4 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
          <h3 className="text-xl font-bold font-heading text-white mb-2">
            Impactos Mitigados pelo AgroSat
          </h3>
          <ul className="space-y-3.5 text-sm text-brand-text-body">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
              <span>Redução de até 40% no consumo desnecessário de água potável na irrigação.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
              <span>Economia financeira direta na fatura de energia elétrica de bombas d'água.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
              <span>Acesso gratuito e descomplicado a índices de satélite sem necessidade de hardware caro.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
              <span>Alinhamento direto com os Objetivos de Desenvolvimento Sustentável (ODS 2, 9 e 13 da ONU).</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Stack de Tecnologias */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-brand-primary">Arquitetura Integrada</span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white mt-2">
            Tecnologias Utilizadas na Solução
          </h2>
          <p className="text-sm text-brand-text-muted mt-2">
            Integração uniforme de todas as disciplinas da Global Solution FIAP 2026/2.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tecnologias.map((tech, index) => {
            const Icon = tech.icon;
            return (
              <div
                key={index}
                className="bg-[#0b180d] border border-brand-border rounded-2xl p-6 hover:border-brand-primary/40 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-950 flex items-center justify-center text-brand-primary mb-4 border border-brand-border/60">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono text-brand-primary uppercase tracking-wider block mb-1">
                  // {tech.categoria}
                </span>
                <h3 className="text-xl font-bold font-heading text-white mb-2">
                  {tech.nome}
                </h3>
                <p className="text-xs text-brand-text-muted leading-relaxed">
                  {tech.descricao}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ODS da ONU */}
      <div className="bg-[#071308] border border-brand-border rounded-3xl p-8 sm:p-12">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-20 h-20 rounded-2xl bg-emerald-950 flex items-center justify-center text-brand-primary shrink-0 border border-brand-border">
            <Globe2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-bold font-heading text-white">
              Conexão com a Agenda 2030 da ONU
            </h3>
            <p className="text-sm text-brand-text-body leading-relaxed">
              O AgroSat atende diretamente ao <strong>ODS 2</strong> (Fome zero e agricultura sustentável), promovendo a resiliência produtiva de pequenos agricultores; ao <strong>ODS 9</strong> (Indústria, inovação e infraestrutura), aplicando tecnologia espacial aberta; e ao <strong>ODS 13</strong> (Ação contra a mudança global do clima), combatendo o estresse hídrico com gestão hídrica consciente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
