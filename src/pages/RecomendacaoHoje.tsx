import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Satellite, 
  RefreshCw, 
  Send, 
  WifiOff, 
  CheckCircle2, 
  CloudRain,
  ArrowLeft
} from 'lucide-react';

export const RecomendacaoHoje: React.FC = () => {
  const [atualizando, setAtualizando] = useState(false);
  const [mensagemEnviada, setMensagemEnviada] = useState(false);

  // Estados dos parâmetros agronômicos (FAO-56)
  const [aguaSolo, setAguaSolo] = useState(29.3); // %
  const [chuvaPrevista, setChuvaPrevista] = useState(14.5); // mm
  const [evaporacao, setEvaporacao] = useState(12.6); // mm

  const saldoLiquido = (chuvaPrevista - evaporacao).toFixed(1);
  const saldoPositivo = parseFloat(saldoLiquido) >= 0;

  // Decisão baseada no balanço FAO-56
  const decisao = aguaSolo > 25 || parseFloat(saldoLiquido) > 0 ? 'NÃO REGAR' : 'REGAR';
  const decisaoCor = decisao === 'NÃO REGAR' ? '#7cc795' : '#6fa8e8';

  const handleAtualizar = () => {
    setAtualizando(true);
    setTimeout(() => {
      setAtualizando(false);
    }, 700);
  };

  const handleEnviarMensagem = () => {
    setMensagemEnviada(true);
    setTimeout(() => {
      setMensagemEnviada(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#0e1712] text-[#e6efe8] pb-16">
      {/* Top Header */}
      <div className="h-20 px-6 sm:px-12 lg:px-16 border-b border-[#243a2d] bg-[#0a120d] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/painel-usuario"
            className="text-[#9fb5a6] hover:text-white p-2 rounded-lg hover:bg-[#14211a] transition-colors"
            title="Voltar ao Painel"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-950 border border-brand-primary/40 flex items-center justify-center text-brand-primary">
              <Satellite className="w-5 h-5" />
            </div>
            <span className="font-heading text-2xl font-bold tracking-wider text-white">
              Agro<span className="text-brand-primary">Sat</span>
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block text-[#9fb5a6] text-sm">
            Painel · Fazenda Feliz · <span className="text-[#7cc795] font-semibold">Online</span>
          </span>
          <Link
            to="/painel-usuario"
            className="text-xs bg-[#1d3a2a] text-[#7cc795] px-3 py-1.5 rounded-lg border border-[#7cc795]/30 hover:bg-[#254d37] transition-colors"
          >
            Meu Painel
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {mensagemEnviada && (
          <div className="mb-6 bg-[#1d3a2a] border border-[#7cc795] text-[#7cc795] p-4 rounded-xl flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium">
                Alerta enviado via SMS e WhatsApp com sucesso para o produtor responsável!
              </span>
            </div>
            <button
              onClick={() => setMensagemEnviada(false)}
              className="text-xs text-[#9fb5a6] hover:text-white"
            >
              Fechar
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6 lg:gap-8 items-start">
          {/* Card Principal: Recomendação de hoje & Balanço */}
          <div className="bg-[#14211a] border border-[#243a2d] rounded-2xl p-7 sm:p-9 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#9fb5a6] font-semibold block mb-2">
                Recomendação de hoje
              </span>
              <span
                className="font-heading text-5xl sm:text-7xl font-bold tracking-tight block"
                style={{ color: decisaoCor }}
              >
                {decisao}
              </span>
            </div>

            <p className="text-base sm:text-lg text-[#e6efe8] leading-relaxed">
              {decisao === 'NÃO REGAR' ? (
                <>
                  Vai chover <strong>{chuvaPrevista} mm</strong> nos próximos 3 dias. O solo já está
                  bem abastecido ({aguaSolo}% de água disponível), então regar agora desperdiçaria
                  água e energia de bombeamento.
                </>
              ) : (
                <>
                  O solo atingiu nível abaixo do limite crítico ({aguaSolo}%). Sem chuva prevista
                  expressiva ({chuvaPrevista} mm), recomenda-se iniciar irrigação para evitar
                  estresse hídrico.
                </>
              )}
            </p>

            {/* Ações */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleAtualizar}
                disabled={atualizando}
                className="h-12 px-6 rounded-xl bg-[#eef3ee] text-[#0e1712] font-semibold text-sm hover:bg-white transition-all flex items-center gap-2 shadow-[0_2px_10px_rgba(238,243,238,0.2)] disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${atualizando ? 'animate-spin' : ''}`} />
                <span>{atualizando ? 'Atualizando dados...' : 'Atualizar recomendação'}</span>
              </button>

              <button
                type="button"
                onClick={handleEnviarMensagem}
                className="h-12 px-6 rounded-xl border border-[#2f4838] bg-transparent text-[#e6efe8] font-semibold text-sm hover:bg-[#1d3a2a] transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Enviar por mensagem</span>
              </button>
            </div>

            {/* Seção Explicativa FAO-56 */}
            <div className="pt-6 border-t border-[#243a2d] space-y-4">
              <h2 className="font-heading text-xl font-bold text-white">
                Por que essa decisão?
              </h2>

              <div className="space-y-3.5 pt-1">
                {/* Água no solo */}
                <div className="grid grid-cols-[140px_1fr_70px] sm:grid-cols-[200px_1fr_90px] items-center gap-3 sm:gap-4 text-sm">
                  <span className="text-[#9fb5a6]">Água no solo hoje</span>
                  <div className="bg-[#0e1712] rounded-full h-3 overflow-hidden border border-[#243a2d]">
                    <div
                      className="bg-[#6fa8e8] h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(5, aguaSolo))}%` }}
                    />
                  </div>
                  <b className="text-right text-white font-mono">{aguaSolo}%</b>
                </div>

                {/* Chuva prevista */}
                <div className="grid grid-cols-[140px_1fr_70px] sm:grid-cols-[200px_1fr_90px] items-center gap-3 sm:gap-4 text-sm">
                  <span className="text-[#9fb5a6]">Chuva prevista (3 dias)</span>
                  <div className="bg-[#0e1712] rounded-full h-3 overflow-hidden border border-[#243a2d]">
                    <div
                      className="bg-[#6fa8e8] h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, chuvaPrevista * 4)}%` }}
                    />
                  </div>
                  <b className="text-right text-[#7cc795] font-mono">+{chuvaPrevista} mm</b>
                </div>

                {/* Perda por evaporação */}
                <div className="grid grid-cols-[140px_1fr_70px] sm:grid-cols-[200px_1fr_90px] items-center gap-3 sm:gap-4 text-sm">
                  <span className="text-[#9fb5a6]">Perda por evaporação</span>
                  <div className="bg-[#0e1712] rounded-full h-3 overflow-hidden border border-[#243a2d]">
                    <div
                      className="bg-[#e0b04a] h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, evaporacao * 4)}%` }}
                    />
                  </div>
                  <b className="text-right text-[#e0b04a] font-mono">−{evaporacao} mm</b>
                </div>
              </div>

              {/* Saldo Final */}
              <div className="pt-3 border-t border-[#243a2d] text-sm">
                <p className="text-[#e6efe8]">
                  Saldo em 3 dias:{' '}
                  <b className={saldoPositivo ? 'text-[#7cc795]' : 'text-[#e0b04a]'}>
                    {saldoPositivo ? `+${saldoLiquido}` : saldoLiquido} mm
                  </b>
                  .{' '}
                  {saldoPositivo
                    ? 'O solo continua adequado para a cultura.'
                    : 'Atenção ao déficit acumulado.'}
                </p>
                <span className="text-xs text-[#9fb5a6] block mt-1">
                  Balanço hídrico (método FAO-56) · dados em tempo real Open-Meteo
                </span>
              </div>
            </div>
          </div>

          {/* Card Lateral: Confiança e Modo Offline */}
          <div className="space-y-6">
            <div className="bg-[#14211a] border border-[#243a2d] rounded-2xl p-7 space-y-5">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#9fb5a6] font-semibold block mb-1">
                  Confiança da decisão
                </span>
                <span className="font-heading text-4xl font-bold text-white">Alta</span>
              </div>

              <div className="space-y-3 pt-2 text-sm border-t border-[#243a2d]">
                <div className="flex justify-between items-center py-1">
                  <span className="text-[#9fb5a6]">Probabilidade de chuva</span>
                  <b className="text-white font-mono">97%</b>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-[#9fb5a6]">Fonte da previsão</span>
                  <b className="text-white">Open-Meteo</b>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-[#9fb5a6]">Atualizado</span>
                  <b className="text-white">há 12 min</b>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-[#9fb5a6]">Resolução de dados</span>
                  <b className="text-[#7cc795]">1 km (satélite)</b>
                </div>
              </div>

              {/* Box de Funcionamento Offline */}
              <div className="bg-[#0e1712] border border-[#243a2d] rounded-xl p-4.5 space-y-1.5">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <WifiOff className="w-4 h-4 text-[#7cc795]" />
                  <span>Funciona sem internet.</span>
                </div>
                <p className="text-xs text-[#9fb5a6] leading-relaxed">
                  A última recomendação fica salva no aparelho e as ações pendentes são sincronizadas
                  automaticamente quando a conexão for restabelecida.
                </p>
              </div>
            </div>

            {/* Simulador Rápido FAO-56 */}
            <div className="bg-[#14211a] border border-[#243a2d] rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-[#7cc795]" />
                <h3 className="font-heading text-base font-bold text-white">
                  Simular outros cenários
                </h3>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-[#9fb5a6] mb-1">
                    <span>Umidade no solo</span>
                    <span className="text-white">{aguaSolo}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="1"
                    value={aguaSolo}
                    onChange={(e) => setAguaSolo(parseFloat(e.target.value))}
                    className="w-full accent-[#7cc795]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[#9fb5a6] mb-1">
                    <span>Chuva prevista (3 dias)</span>
                    <span className="text-white">{chuvaPrevista} mm</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="0.5"
                    value={chuvaPrevista}
                    onChange={(e) => setChuvaPrevista(parseFloat(e.target.value))}
                    className="w-full accent-[#7cc795]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[#9fb5a6] mb-1">
                    <span>Evaporação estimada (3 dias)</span>
                    <span className="text-white">{evaporacao} mm</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    step="0.2"
                    value={evaporacao}
                    onChange={(e) => setEvaporacao(parseFloat(e.target.value))}
                    className="w-full accent-[#e0b04a]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecomendacaoHoje;
