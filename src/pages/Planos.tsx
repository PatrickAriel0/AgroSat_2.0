import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Satellite, Check, ArrowRight, ShieldCheck } from 'lucide-react';

export const Planos: React.FC = () => {
  const navigate = useNavigate();
  const [selecionado, setSelecionado] = useState<string>('gratis');

  const planos = [
    {
      id: 'gratis',
      nome: 'Teste grátis',
      preco: 'R$ 0',
      periodo: '/ 7 dias',
      destaque: '1 fazenda monitorada',
      limiteFazendas: 'Permite adicionar 1 fazenda',
      destacado: true,
      botaoTexto: 'Começar teste grátis (1 fazenda)',
      botaoEstilo: 'bg-[#eef3ee] text-[#0e1712] hover:bg-white',
      beneficios: [
        'Adicione até 1 fazenda no sistema',
        'Recomendação diária: regar ou aguardar',
        'Previsão de chuva e evaporação em 3 dias',
        'Histórico das últimas recomendações',
        'Painel de economia da fazenda',
      ],
    },
    {
      id: 'mensal',
      nome: 'Plano mensal',
      preco: 'R$ 49,90',
      periodo: '/ mês',
      destaque: 'Até 3 fazendas monitoradas',
      limiteFazendas: 'Permite adicionar até 3 fazendas',
      destacado: false,
      botaoTexto: 'Assinar mensal (3 fazendas)',
      botaoEstilo: 'border border-[#2f4838] bg-transparent text-[#e6efe8] hover:bg-[#1d3a2a]',
      beneficios: [
        'Adicione até 3 fazendas simultâneas',
        'Recomendações ilimitadas em tempo real',
        'Previsão de chuva detalhada em 72h',
        'Histórico completo e exportável',
        'Painel de economia hídrica e financeira',
      ],
    },
    {
      id: 'anual',
      nome: 'Plano anual',
      preco: 'R$ 590',
      periodo: '/ ano',
      destaque: 'Até 10 fazendas monitoradas',
      limiteFazendas: 'Permite adicionar até 10 fazendas',
      destacado: false,
      botaoTexto: 'Assinar anual (10 fazendas)',
      botaoEstilo: 'border border-[#2f4838] bg-transparent text-[#e6efe8] hover:bg-[#1d3a2a]',
      beneficios: [
        'Adicione até 10 fazendas simultâneas',
        'Equivale a apenas R$ 49,17 por mês',
        'Monitoramento satelital multi-propriedade',
        'Previsão de alta resolução meteorológica',
        'Relatórios consolidados para cooperativas',
        'Suporte técnico prioritário',
      ],
    },
  ];

  const handleEscolher = (planoId: string) => {
    setSelecionado(planoId);
    
    // Define a capacidade de fazendas com base no plano escolhido
    let limite = 1;
    if (planoId === 'mensal') limite = 3;
    if (planoId === 'anual') limite = 10;

    localStorage.setItem('agrosat_plano_escolhido', planoId);
    localStorage.setItem('agrosat_limite_fazendas', String(limite));

    navigate('/painel-usuario');
  };

  return (
    <div className="min-h-screen bg-[#0e1712] text-[#e6efe8] pb-16">
      {/* Top Header */}
      <div className="h-20 px-6 sm:px-12 lg:px-16 border-b border-[#243a2d] bg-[#0a120d] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-emerald-950 border border-brand-primary/40 flex items-center justify-center text-brand-primary">
            <Satellite className="w-5 h-5" />
          </div>
          <span className="font-heading text-2xl font-bold tracking-wider text-white">
            Agro<span className="text-brand-primary">Sat</span>
          </span>
        </Link>
        <span className="text-[#9fb5a6] text-sm">Passo 2 de 3 · Escolha do Plano</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        {/* Title */}
        <div className="text-center mb-10 sm:mb-14 max-w-2xl mx-auto">
          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-white mb-3">
            Escolha seu plano
          </h1>
          <p className="text-[#9fb5a6] text-base sm:text-lg">
            Comece com 7 dias grátis para 1 fazenda ou escolha planos com suporte a até 3 ou 10 propriedades rurais.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {planos.map((plano) => {
            const isSelected = plano.id === selecionado;
            return (
              <div
                key={plano.id}
                onClick={() => setSelecionado(plano.id)}
                className={`bg-[#14211a] rounded-2xl p-7 flex flex-col justify-between transition-all duration-200 cursor-pointer border ${
                  isSelected || plano.destacado
                    ? 'border-[#7cc795] shadow-[0_0_25px_rgba(124,199,149,0.15)] ring-1 ring-[#7cc795]/50'
                    : 'border-[#243a2d] hover:border-[#2f4838]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[#9fb5a6] text-sm font-medium">{plano.nome}</span>
                    {plano.destacado && (
                      <span className="bg-[#1d3a2a] text-[#7cc795] text-xs font-semibold px-2.5 py-1 rounded-md">
                        Recomendado
                      </span>
                    )}
                  </div>

                  <div className="mb-2">
                    <span className="font-heading text-4xl sm:text-5xl font-bold text-white">
                      {plano.preco}
                    </span>{' '}
                    <span className="text-[#9fb5a6] text-sm">{plano.periodo}</span>
                  </div>

                  {/* Badge de Limite de Fazendas */}
                  <div className="inline-block bg-[#1d3a2a] text-[#7cc795] text-xs font-semibold px-2.5 py-1 rounded-md border border-[#7cc795]/30 mb-4">
                    {plano.limiteFazendas}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plano.beneficios.map((beneficio, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-[#e6efe8]">
                        <Check className="w-4 h-4 text-[#7cc795] shrink-0 mt-0.5" />
                        <span>{beneficio}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEscolher(plano.id);
                  }}
                  className={`w-full h-12 rounded-xl font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2 ${
                    isSelected
                      ? 'bg-[#7cc795] text-[#0e1712] hover:bg-[#8ee0a9]'
                      : plano.botaoEstilo
                  }`}
                >
                  <span>{plano.botaoTexto}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Informação adicional de transparência */}
        <div className="mt-12 text-center text-xs text-[#9fb5a6] flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#7cc795]" />
          <span>
            Sem fidelidade ou multas de cancelamento. Altere ou cancele o plano a qualquer momento pelo painel.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Planos;
