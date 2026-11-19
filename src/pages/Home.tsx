import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Satellite, CloudRain, Droplets } from 'lucide-react';
import { DecisionEngine } from '../components/DecisionEngine';

export const Home: React.FC = () => {
  return (
    <div className="space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 lg:pt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-brand-primary/30 text-brand-primary text-xs font-mono">
                <Satellite className="w-3.5 h-3.5 animate-pulse" />
                Global Solution 2026/2 · CitizenTech & Dados Satelitais
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-heading text-white tracking-tight leading-[1.05]">
                Irrigar ou <br />
                <span className="text-brand-primary underline decoration-emerald-500/30">Não Irrigar?</span>
              </h1>

              <p className="text-lg sm:text-xl text-brand-text-body max-w-2xl leading-relaxed">
                O AgroSat cruza índices satelitais com previsão do tempo em 72h para entregar ao pequeno produtor uma resposta diária simples: <strong>quando irrigar e quando poupar água e energia</strong>.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/painel-usuario"
                  className="bg-brand-primary hover:bg-brand-primary-hover text-black font-semibold px-8 py-3.5 rounded-full transition-all duration-200 flex items-center gap-2 shadow-[0_4px_20px_rgba(74,222,128,0.35)] hover:scale-[1.02]"
                >
                  Ver Painel Interativo <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/solucao"
                  className="border border-brand-border hover:border-brand-primary/50 text-white font-medium px-7 py-3.5 rounded-full transition-all bg-emerald-950/20 hover:bg-emerald-950/40"
                >
                  Como Funciona
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-brand-border/60">
                <div>
                  <div className="text-3xl sm:text-4xl font-bold font-heading text-brand-primary">40%</div>
                  <div className="text-xs sm:text-sm text-brand-text-muted">Menos desperdício</div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-bold font-heading text-brand-primary">10M+</div>
                  <div className="text-xs sm:text-sm text-brand-text-muted">Famílias rurais no BR</div>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-bold font-heading text-brand-primary">72h</div>
                  <div className="text-xs sm:text-sm text-brand-text-muted">Janela preditiva</div>
                </div>
              </div>
            </div>

            {/* Right Interactive Simulator Widget */}
            <div className="lg:col-span-5">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600/30 to-green-500/20 rounded-3xl blur-xl opacity-75"></div>
                <div className="relative">
                  <DecisionEngine limitePadrao={30} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-wider text-brand-primary bg-emerald-950/60 px-3 py-1 rounded-full border border-brand-primary/20">
            Diferenciais da Solução
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white mt-3 mb-4">
            Por que o AgroSat transforma a lavoura?
          </h2>
          <p className="text-brand-text-body text-base">
            Tecnologia de ponta sem a necessidade de comprar sensores de solo caros: tudo via sensoriamento remoto e APIs abertas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#0b180d] border border-brand-border rounded-2xl p-7 hover:border-brand-primary/40 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-emerald-950 flex items-center justify-center text-brand-primary mb-5 border border-brand-border">
              <Satellite className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-heading text-white mb-2">Dados Satelitais Globais</h3>
            <p className="text-sm text-brand-text-muted leading-relaxed">
              Leituras de índices de vegetação e umidade da camada superficial do solo sem exigir sensores físicos de alto custo ou manutenção complexa no campo.
            </p>
          </div>

          <div className="bg-[#0b180d] border border-brand-border rounded-2xl p-7 hover:border-brand-primary/40 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-emerald-950 flex items-center justify-center text-sky-400 mb-5 border border-brand-border">
              <CloudRain className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-heading text-white mb-2">Cruzamento Meteorológico</h3>
            <p className="text-sm text-brand-text-muted leading-relaxed">
              Integração com a Open-Meteo API para prever acumulado de chuva nas próximas 24h e 72h nas coordenadas exatas da propriedade rural cadastrada.
            </p>
          </div>

          <div className="bg-[#0b180d] border border-brand-border rounded-2xl p-7 hover:border-brand-primary/40 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-emerald-950 flex items-center justify-center text-emerald-400 mb-5 border border-brand-border">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-heading text-white mb-2">Economia Hídrica Concreta</h3>
            <p className="text-sm text-brand-text-muted leading-relaxed">
              Evita que bombas de irrigação sejam acionadas horas antes de uma tempestade, poupando água potável, combustível fóssil e energia elétrica.
            </p>
          </div>
        </div>
      </section>

      {/* Como Funciona em 4 Etapas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#071308] border border-brand-border rounded-3xl p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-brand-primary">Fluxo do Motor de Decisão</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white mt-2">
              Quatro etapas automatizadas
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 bg-[#0b180d] border border-brand-border/60 rounded-xl space-y-3">
              <div className="w-8 h-8 rounded-full bg-brand-primary text-black font-bold flex items-center justify-center font-mono text-sm">
                1
              </div>
              <h4 className="text-lg font-bold font-heading text-white">Leitura do Solo</h4>
              <p className="text-xs text-brand-text-muted leading-relaxed">
                O satélite ou a leitura manual do talhão informa o percentual de umidade atual.
              </p>
            </div>

            <div className="p-5 bg-[#0b180d] border border-brand-border/60 rounded-xl space-y-3">
              <div className="w-8 h-8 rounded-full bg-brand-primary text-black font-bold flex items-center justify-center font-mono text-sm">
                2
              </div>
              <h4 className="text-lg font-bold font-heading text-white">Verificação de Chuva</h4>
              <p className="text-xs text-brand-text-muted leading-relaxed">
                A API meteorológica processa a previsão de precipitação em milímetros para 72 horas.
              </p>
            </div>

            <div className="p-5 bg-[#0b180d] border border-brand-border/60 rounded-xl space-y-3">
              <div className="w-8 h-8 rounded-full bg-brand-primary text-black font-bold flex items-center justify-center font-mono text-sm">
                3
              </div>
              <h4 className="text-lg font-bold font-heading text-white">Cruzamento Analítico</h4>
              <p className="text-xs text-brand-text-muted leading-relaxed">
                O algoritmo aplica os limites agronômicos específicos da cultura (tomate, milho, feijão).
              </p>
            </div>

            <div className="p-5 bg-[#0b180d] border border-brand-border/60 rounded-xl space-y-3">
              <div className="w-8 h-8 rounded-full bg-brand-primary text-black font-bold flex items-center justify-center font-mono text-sm">
                4
              </div>
              <h4 className="text-lg font-bold font-heading text-white">Ação Imediata</h4>
              <p className="text-xs text-brand-text-muted leading-relaxed">
                O produtor recebe uma recomendação direta e fundamentada no painel web ou no celular.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="max-w-5xl mx-auto px-4 text-center">
        <div className="bg-gradient-to-b from-[#0f2c1b] to-[#071308] border border-brand-primary/40 rounded-3xl p-10 sm:p-14 shadow-[0_4px_30px_rgba(74,222,128,0.15)]">
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white mb-4">
            Pronto para gerenciar a irrigação com inteligência?
          </h2>
          <p className="text-brand-text-body text-base max-w-xl mx-auto mb-8">
            Acesse o painel interativo, cadastre seus talhões e experimente a tomada de decisão com dados climáticos reais.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/painel-usuario"
              className="bg-brand-primary hover:bg-brand-primary-hover text-black font-semibold px-8 py-3.5 rounded-full transition-all shadow-[0_2px_15px_rgba(74,222,128,0.3)]"
            >
              Acessar Painel AgroSat
            </Link>
            <Link
              to="/painel/nova-fazenda"
              className="border border-white/20 hover:border-white text-white px-7 py-3.5 rounded-full transition-all"
            >
              Cadastrar Nova Propriedade
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
