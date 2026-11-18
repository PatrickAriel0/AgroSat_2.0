import React, { useState } from 'react';
import { WeatherService } from '../services/weatherService';
import { Droplet, CloudRain, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface DecisionEngineProps {
  limitePadrao?: number;
}

export const DecisionEngine: React.FC<DecisionEngineProps> = ({ limitePadrao = 30 }) => {
  const [umidade, setUmidade] = useState<number>(22);
  const [chuva72h, setChuva72h] = useState<number>(0);

  const decisao = WeatherService.calcularDecisao(umidade, limitePadrao, chuva72h);

  return (
    <div className="bg-[#0b180d] border border-brand-border rounded-2xl p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
      <h2 className="text-2xl font-bold font-heading text-white mb-6">
        Simulação da decisão
      </h2>

      {/* Sliders */}
      <div className="space-y-6 mb-7">
        {/* Umidade */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="sim-umidade" className="text-sm font-medium text-brand-text-body flex items-center gap-2">
              <Droplet className="w-4 h-4 text-brand-primary" /> Umidade do solo: <span className="font-mono text-white font-bold">{umidade}%</span>
            </label>
          </div>
          <input
            id="sim-umidade"
            type="range"
            min="0"
            max="100"
            value={umidade}
            onChange={(e) => setUmidade(Number(e.target.value))}
            className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-brand-primary"
          />
        </div>

        {/* Chuva 72h */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="sim-chuva" className="text-sm font-medium text-brand-text-body flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-sky-400" /> Chuva prevista em 72h: <span className="font-mono text-white font-bold">{chuva72h} mm</span>
            </label>
          </div>
          <input
            id="sim-chuva"
            type="range"
            min="0"
            max="50"
            step="1"
            value={chuva72h}
            onChange={(e) => setChuva72h(Number(e.target.value))}
            className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-brand-primary"
          />
        </div>
      </div>

      {/* Decision Output Box */}
      <div 
        className={`p-5 rounded-xl border transition-all duration-300 ${
          decisao.cor === 'green'
            ? 'bg-[#0f2c1b]/80 border-emerald-500/50 text-emerald-200'
            : decisao.cor === 'amber'
            ? 'bg-[#292008]/80 border-amber-500/50 text-amber-200'
            : 'bg-[#0c1f2b]/80 border-sky-500/50 text-sky-200'
        }`}
      >
        <div className="flex items-start gap-3">
          {decisao.cor === 'green' && <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />}
          {decisao.cor === 'amber' && <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />}
          {decisao.cor === 'blue' && <ShieldCheck className="w-6 h-6 text-sky-400 shrink-0 mt-0.5" />}
          
          <div>
            <h3 className="font-heading text-xl font-bold text-white mb-1">
              {decisao.titulo}
            </h3>
            <p className="text-sm leading-relaxed text-brand-text-body opacity-95">
              {decisao.mensagem}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
