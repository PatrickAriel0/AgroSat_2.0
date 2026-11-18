import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, XCircle, CheckCircle, Droplets, Zap, ShieldCheck } from 'lucide-react';

export const Solucao: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-wider text-brand-primary bg-emerald-950/60 px-3.5 py-1 rounded-full border border-brand-primary/20">
          Motor Analítico
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading text-white mt-3 mb-5">
          A Solução <span className="text-brand-primary">AgroSat</span>
        </h1>
        <p className="text-lg text-brand-text-body">
          Como transformamos dados espaciais e previsão climática numa recomendação diária clara e acionável.
        </p>
      </div>

      {/* Antes vs Depois */}
      <div>
        <div className="text-center mb-10">
          <span className="text-xs font-mono text-brand-primary uppercase">// Comparativo</span>
          <h2 className="text-3xl font-bold font-heading text-white mt-1">Antes e Depois do AgroSat</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Antes */}
          <div className="bg-[#140a0a] border border-red-950/80 rounded-2xl p-7 sm:p-8 space-y-5">
            <span className="text-xs font-mono text-red-400 uppercase tracking-wider">// Sem o sistema</span>
            <h3 className="text-2xl font-bold font-heading text-white">Irrigação no Chute</h3>
            <ul className="space-y-3.5 text-sm text-neutral-300">
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <span>Produtor decide por intuição ou hábitos rígidos, sem medições confiáveis.</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <span>Irrigações desnecessárias poucas horas antes de temporais previstos.</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <span>Desperdício de até 40% de água e sobrecarga no lençol freático local.</span>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <span>Gasto financeiro excessivo com energia elétrica de motobombas.</span>
              </li>
            </ul>
          </div>

          {/* Depois */}
          <div className="bg-[#0b180d] border border-emerald-500/30 rounded-2xl p-7 sm:p-8 space-y-5 shadow-[0_4px_24px_rgba(74,222,128,0.1)]">
            <span className="text-xs font-mono text-brand-primary uppercase tracking-wider">// Com o AgroSat</span>
            <h3 className="text-2xl font-bold font-heading text-white">Decisão com Dados Reais</h3>
            <ul className="space-y-3.5 text-sm text-brand-text-body">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                <span>Satélite e leituras de solo informam a umidade efetiva da lavoura.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                <span>API Open-Meteo cruza a probabilidade e volume de chuva para os próximos 3 dias.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                <span>Orientação clara: Irrigar agora, Aguardar chuva ou Manter em monitoramento.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
                <span>Histórico auditável mantido no banco de dados na nuvem para análise de safras.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Métricas de Impacto */}
      <div>
        <div className="text-center mb-10">
          <span className="text-xs font-mono text-brand-primary uppercase">// Resultados Estimados</span>
          <h2 className="text-3xl font-bold font-heading text-white mt-1">Impacto Real para a Propriedade</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-[#0b180d] border border-brand-border rounded-2xl p-7 text-center space-y-2">
            <Droplets className="w-8 h-8 text-brand-primary mx-auto mb-2" />
            <div className="text-4xl font-bold font-heading text-brand-primary">-40%</div>
            <div className="text-sm font-semibold text-white">Consumo Hídrico</div>
            <p className="text-xs text-brand-text-muted">Redução de desperdício em irrigações desnecessárias pré-chuva.</p>
          </div>

          <div className="bg-[#0b180d] border border-brand-border rounded-2xl p-7 text-center space-y-2">
            <Zap className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <div className="text-4xl font-bold font-heading text-amber-400">-30%</div>
            <div className="text-sm font-semibold text-white">Gasto de Energia</div>
            <p className="text-xs text-brand-text-muted">Menos horas de acionamento das bombas e sistemas de aspersão.</p>
          </div>

          <div className="bg-[#0b180d] border border-brand-border rounded-2xl p-7 text-center space-y-2">
            <ShieldCheck className="w-8 h-8 text-sky-400 mx-auto mb-2" />
            <div className="text-4xl font-bold font-heading text-sky-400">+25%</div>
            <div className="text-sm font-semibold text-white">Produtividade Segura</div>
            <p className="text-xs text-brand-text-muted">Protege contra o encharcamento de raízes e proliferação de fungos.</p>
          </div>
        </div>
      </div>

      {/* Link para o Painel */}
      <div className="text-center pt-4">
        <Link
          to="/painel"
          className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-black font-semibold text-base px-8 py-3.5 rounded-full transition-all shadow-[0_4px_20px_rgba(74,222,128,0.3)]"
        >
          Experimentar o Painel Interativo <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
