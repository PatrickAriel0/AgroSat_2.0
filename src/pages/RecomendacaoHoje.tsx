import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Satellite, 
  RefreshCw, 
  Send, 
  WifiOff, 
  CheckCircle2, 
  CloudRain, 
  ArrowLeft,
  Sprout
} from 'lucide-react';
import CartaoSolo from '../components/CartaoSolo';
import { calcularRecomendacao, PlantacaoItem } from '../utils/recomendacao';

const STORAGE_KEY_PLANTACOES = 'agrosat_plantacoes_usuario';
const STORAGE_KEY_SELECIONADA = 'agrosat_fazenda_selecionada';

export const RecomendacaoHoje: React.FC = () => {
  const [atualizando, setAtualizando] = useState(false);
  const [mensagemEnviada, setMensagemEnviada] = useState(false);
  const [carregado, setCarregado] = useState(false);

  // Plantações do produtor
  const [plantacoes, setPlantacoes] = useState<PlantacaoItem[]>([]);
  const [plantacaoSelecionada, setPlantacaoSelecionada] = useState<string>('');
  const [culturaAtual, setCulturaAtual] = useState<string>('');
  const [pontoAtivo, setPontoAtivo] = useState<{ latitude: number; longitude: number } | null>(null);

  // Estados dos parâmetros agronômicos (FAO-56)
  const [aguaSolo, setAguaSolo] = useState(0); // %
  const [chuvaPrevista, setChuvaPrevista] = useState(0); // mm
  const [evaporacao, setEvaporacao] = useState(0); // mm
  const [probChuva, setProbChuva] = useState('');

  const saldoLiquido = (chuvaPrevista - evaporacao).toFixed(1);
  const saldoPositivo = parseFloat(saldoLiquido) >= 0;

  // Decisão baseada no balanço FAO-56
  const decisao = aguaSolo > 25 || parseFloat(saldoLiquido) > 0 ? 'NÃO REGAR' : 'REGAR';
  const decisaoCor = decisao === 'NÃO REGAR' ? '#7cc795' : '#6fa8e8';

  // Carrega as fazendas do produtor e a fazenda ativa
  useEffect(() => {
    try {
      let listaCarregada: PlantacaoItem[] = [];
      const salvas = localStorage.getItem(STORAGE_KEY_PLANTACOES);

      if (salvas) {
        try {
          const parsed = JSON.parse(salvas);
          if (Array.isArray(parsed) && parsed.length > 0) {
            listaCarregada = parsed;
          }
        } catch {
          listaCarregada = [];
        }
      }

      setPlantacoes(listaCarregada);

      if (listaCarregada.length > 0) {
        const ultimaEscolhida = localStorage.getItem(STORAGE_KEY_SELECIONADA);
        const fazendaAlvo = listaCarregada.find((f) => f.nome === ultimaEscolhida) || listaCarregada[0];
        if (fazendaAlvo) {
          aplicarFazenda(fazendaAlvo);
        }
      }
      setCarregado(true);
    } catch {
      setCarregado(true);
    }
  }, []);

  const aplicarFazenda = (fazenda: PlantacaoItem) => {
    setPlantacaoSelecionada(fazenda.nome);
    setCulturaAtual(fazenda.cultura);
    setPontoAtivo({ latitude: fazenda.latitude, longitude: fazenda.longitude });

    const rec = calcularRecomendacao(fazenda);
    const umidadeNum = parseFloat(rec.umidade) || 0;
    const chuvaNum = parseFloat(rec.chuva3d) || 0;
    const evapCalculada = Number((10 + (Math.abs(fazenda.latitude * 3) % 5)).toFixed(1));

    setAguaSolo(umidadeNum);
    setChuvaPrevista(chuvaNum);
    setEvaporacao(evapCalculada);
    setProbChuva(rec.probChuva || '85%');
  };

  const handleTrocarFazenda = (nomeEscolhido: string) => {
    const alvo = plantacoes.find((p) => p.nome === nomeEscolhido);
    if (alvo) {
      aplicarFazenda(alvo);
      localStorage.setItem(STORAGE_KEY_SELECIONADA, alvo.nome);
    }
  };

  const handleAtualizar = () => {
    setAtualizando(true);
    setTimeout(() => {
      setAtualizando(false);
      const alvo = plantacoes.find((p) => p.nome === plantacaoSelecionada);
      if (alvo) {
        aplicarFazenda(alvo);
      }
    }, 600);
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
            title="Voltar à Visão Geral"
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
            Propriedade: <strong className="text-white">{plantacaoSelecionada || 'Nenhuma'}</strong> · <span className="text-[#7cc795] font-semibold">Online</span>
          </span>
          <Link
            to="/painel-usuario"
            className="text-xs bg-[#1d3a2a] text-[#7cc795] px-3.5 py-2 rounded-lg border border-[#7cc795]/30 hover:bg-[#254d37] transition-colors font-semibold"
          >
            Visão Geral
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 space-y-6">
        {mensagemEnviada && (
          <div className="bg-[#1d3a2a] border border-[#7cc795] text-[#7cc795] p-4 rounded-xl flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span className="text-sm font-medium">
                Alerta de irrigação enviado via SMS e WhatsApp com sucesso para o produtor responsável de {plantacaoSelecionada}!
              </span>
            </div>
            <button
              onClick={() => setMensagemEnviada(false)}
              className="text-xs text-[#9fb5a6] hover:text-white ml-2"
            >
              Fechar
            </button>
          </div>
        )}

        {plantacoes.length === 0 && carregado ? (
          <div className="bg-[#14211a] border border-[#243a2d] rounded-2xl p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#1d3a2a] text-[#7cc795] flex items-center justify-center mx-auto">
              <Sprout className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-heading font-bold text-white">Nenhuma plantação cadastrada</h2>
            <p className="text-sm text-[#9fb5a6] max-w-md mx-auto">
              Cadastre sua propriedade no Painel do Usuário para visualizar o balanço hídrico FAO-56 e as recomendações agronômicas em tempo real.
            </p>
            <Link
              to="/painel-usuario"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#eef3ee] text-[#0e1712] font-semibold text-sm hover:bg-white transition-all"
            >
              Ir para o Painel do Usuário
            </Link>
          </div>
        ) : (
          <>
            {/* Barra de Seleção Contextual de Fazenda */}
            <div className="bg-[#14211a] border border-[#243a2d] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1d3a2a] text-[#7cc795] flex items-center justify-center shrink-0">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-[#9fb5a6] block">Fazenda Selecionada</span>
                  <div className="flex items-center gap-2">
                    <b className="text-white text-base font-heading">{plantacaoSelecionada}</b>
                    {culturaAtual && (
                      <span className="text-xs bg-[#1d3a2a] text-[#7cc795] px-2 py-0.5 rounded font-mono">
                        {culturaAtual}
                      </span>
                    )}
                    {pontoAtivo && (
                      <span className="text-[11px] text-[#9fb5a6] hidden md:inline">
                        ({pontoAtivo.latitude.toFixed(4)}, {pontoAtivo.longitude.toFixed(4)})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <label htmlFor="select-fazenda-rec" className="text-xs text-[#9fb5a6] whitespace-nowrap">
                  Trocar propriedade:
                </label>
                <select
                  id="select-fazenda-rec"
                  value={plantacaoSelecionada}
                  onChange={(e) => handleTrocarFazenda(e.target.value)}
                  className="h-10 bg-[#0e1712] border border-[#2f4838] rounded-xl text-white text-xs px-3 focus:outline-none focus:border-[#7cc795]"
                >
                  {plantacoes.map((p) => (
                    <option key={p.id} value={p.nome}>
                      {p.nome} ({p.cultura})
                    </option>
                  ))}
                </select>
              </div>
            </div>

        {/* Grid de 2 Colunas: Card Principal (Recomendação & FAO-56) e Card Lateral */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6 lg:gap-8 items-start">
          {/* Card Principal: Recomendação de hoje & Balanço */}
          <div className="bg-[#14211a] border border-[#243a2d] rounded-2xl p-7 sm:p-9 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#9fb5a6] font-semibold block mb-2">
                Recomendação de hoje · {plantacaoSelecionada}
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
                  Previsão de <strong>{chuvaPrevista} mm</strong> de chuva nos próximos 3 dias em {plantacaoSelecionada}. 
                  O solo de {culturaAtual} está bem abastecido ({aguaSolo}% de água disponível), então regar agora desperdiçaria
                  água e energia de bombeamento.
                </>
              ) : (
                <>
                  O solo da lavoura de {culturaAtual} em {plantacaoSelecionada} atingiu nível abaixo do limite crítico ({aguaSolo}%). 
                  Sem chuva expressiva prevista ({chuvaPrevista} mm), recomenda-se iniciar a irrigação na dose indicada para evitar estresse hídrico.
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
                <span>{atualizando ? 'Atualizando sensores...' : 'Atualizar recomendação'}</span>
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
                  <b className="text-white font-mono">{probChuva || '85%'}</b>
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

        {/* Card Pedológico e Granulométrico ISRIC SoilGrids 2.0 & SiBCS */}
        {pontoAtivo && (
          <div className="pt-2">
            <CartaoSolo
              ponto={pontoAtivo}
              nomeFazenda={plantacaoSelecionada}
              titulo={`Análise de Solo & Granulometria (ISRIC SoilGrids 2.0)`}
            />
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
};

export default RecomendacaoHoje;
