import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FazendaService } from '../services/api';
import { WeatherService } from '../services/weatherService';
import { Fazenda, PrevisaoClimatica, Talhao, DecisaoIrrigacao } from '../types';
import { ArrowLeft, Loader2, AlertTriangle, CheckCircle2, ShieldCheck, Plus, Trash2 } from 'lucide-react';

export const FazendaDetalhe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [fazenda, setFazenda] = useState<Fazenda | null>(null);
  const [loading, setLoading] = useState(true);
  const [previsao, setPrevisao] = useState<PrevisaoClimatica | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  // Talhão selecionado
  const [talhaoAtivo, setTalhaoAtivo] = useState<Talhao | null>(null);

  // Nova leitura
  const [novaUmidade, setNovaUmidade] = useState('');
  const [registrando, setRegistrando] = useState(false);
  const [erroLeitura, setErroLeitura] = useState<string | null>(null);

  useEffect(() => {
    async function carregarDados() {
      if (!id) return;
      try {
        setLoading(true);
        const f = await FazendaService.buscarPorId(id);
        if (f) {
          setFazenda(f);
          if (f.talhoes && f.talhoes.length > 0) {
            setTalhaoAtivo(f.talhoes[0]);
          }

          // Busca previsão Open-Meteo com as coordenadas da fazenda
          const lat = f.latitude || -22.9056;
          const lon = f.longitude || -47.0608;
          const prev = await WeatherService.obterPrevisao(lat, lon);
          setPrevisao(prev);
        }
      } catch (err) {
        console.error('Erro ao buscar detalhes da fazenda', err);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, [id]);

  const handleExcluirFazenda = async () => {
    if (!fazenda) return;
    if (!window.confirm(`Tem certeza que deseja excluir a propriedade "${fazenda.nome}"? Esta ação executará uma requisição DELETE na API.`)) return;
    try {
      setExcluindo(true);
      await FazendaService.remover(fazenda.id);
      navigate('/painel');
    } catch {
      alert('Erro ao excluir propriedade.');
    } finally {
      setExcluindo(false);
    }
  };

  const handleRegistrarLeitura = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fazenda || !talhaoAtivo) return;

    const umidadeNum = parseFloat(novaUmidade.replace(',', '.'));
    if (isNaN(umidadeNum) || umidadeNum < 0 || umidadeNum > 100) {
      setErroLeitura('Informe uma umidade válida entre 0 e 100%.');
      return;
    }

    try {
      setRegistrando(true);
      setErroLeitura(null);
      const leitura = await FazendaService.adicionarLeitura(fazenda.id, talhaoAtivo.id, umidadeNum);

      // Atualiza estado local
      const talhoesAtualizados = fazenda.talhoes.map(t => {
        if (t.id === talhaoAtivo.id) {
          return {
            ...t,
            leituras: [leitura, ...(t.leituras || [])]
          };
        }
        return t;
      });

      setFazenda({ ...fazenda, talhoes: talhoesAtualizados });
      setTalhaoAtivo({
        ...talhaoAtivo,
        leituras: [leitura, ...(talhaoAtivo.leituras || [])]
      });
      setNovaUmidade('');
    } catch {
      setErroLeitura('Falha ao registrar leitura.');
    } finally {
      setRegistrando(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
        <p className="text-brand-text-body">Consultando dados da fazenda e satélite...</p>
      </div>
    );
  }

  if (!fazenda) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold font-heading text-white mb-4">Fazenda não encontrada</h2>
        <Link to="/painel" className="text-brand-primary underline text-sm">Voltar ao painel</Link>
      </div>
    );
  }

  // Calcula decisão atual com base no talhão ativo e previsão
  const ultimaLeitura = talhaoAtivo?.leituras?.[0]?.valorUmidade ?? 25;
  const limiteTalhao = talhaoAtivo?.limiteUmidade ?? 35;
  const chuva72h = previsao?.chuva72h ?? 9.6;
  const orientacao: DecisaoIrrigacao = WeatherService.calcularDecisao(ultimaLeitura, limiteTalhao, chuva72h);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Voltar link */}
      <Link
        to="/painel"
        className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-primary-hover text-sm font-medium mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar ao painel
      </Link>

      {/* Farm Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-brand-border/40">
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold font-heading text-white mb-1.5 tracking-wide">
            {fazenda.nome}
          </h1>
          <p className="text-lg text-brand-text-muted">
            {fazenda.municipio ? `${fazenda.municipio} - ${fazenda.uf}` : `Coordenadas: ${fazenda.latitude ?? -21.178}, ${fazenda.longitude ?? -47.811}`}
          </p>
        </div>
        <button
          onClick={handleExcluirFazenda}
          disabled={excluindo}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/40 bg-red-950/30 hover:bg-red-900/50 text-red-300 text-sm font-medium transition-colors disabled:opacity-50"
          title="Excluir propriedade da base de dados (DELETE)"
        >
          {excluindo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          <span>Excluir Propriedade</span>
        </button>
      </div>

      {/* Top Grid: Previsão de Chuva + Orientação */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Previsão de chuva */}
        <div className="bg-[#0b180d] border border-brand-border rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
          <div>
            <h2 className="text-2xl font-bold font-heading text-white mb-1">
              Previsão de chuva
            </h2>
            <p className="text-sm font-mono text-brand-text-body mb-6">
              Agora: {previsao?.tempAtual ?? 27} °C · 24h: {previsao?.chuva24h ?? 0.0} mm · 72h: {previsao?.chuva72h ?? 9.6} mm
            </p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {previsao?.dias.map((d, idx) => (
                <div
                  key={idx}
                  className="bg-[#122614] border border-brand-border/60 rounded-xl p-4 text-center"
                >
                  <span className="block text-xs font-semibold text-white mb-1">{d.diaSemana}</span>
                  <span className="block text-sm font-mono text-brand-primary font-bold mb-1">
                    {d.chuvaMm} mm
                  </span>
                  <span className="block text-xs text-brand-text-muted">
                    {d.tempMin}–{d.tempMax} °C
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-brand-text-muted leading-relaxed">
            Dados Open-Meteo. A previsão apoia a decisão, mas não substitui a medição do solo.
          </p>
        </div>

        {/* Orientação */}
        <div className="bg-[#0b180d] border border-brand-border rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
          <div>
            <h2 className="text-2xl font-bold font-heading text-white mb-6">
              Orientação
            </h2>

            <div 
              className={`p-6 rounded-xl border transition-all ${
                orientacao.cor === 'green'
                  ? 'bg-[#0f2c1b]/80 border-emerald-500/50'
                  : orientacao.cor === 'amber'
                  ? 'bg-[#1a2d1d] border-emerald-700/40'
                  : 'bg-[#0c1f2b]/80 border-sky-500/50'
              }`}
            >
              <div className="flex items-start gap-3">
                {orientacao.cor === 'green' && <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />}
                {orientacao.cor === 'amber' && <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />}
                {orientacao.cor === 'blue' && <ShieldCheck className="w-6 h-6 text-sky-400 shrink-0 mt-0.5" />}

                <div>
                  <h3 className="font-heading text-xl font-bold text-white mb-2">
                    {orientacao.titulo}
                  </h3>
                  <p className="text-sm leading-relaxed text-brand-text-body">
                    {orientacao.mensagem}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 text-xs text-brand-text-muted">
            Status baseado na última leitura do talhão ativo ({ultimaLeitura}% de umidade) e limite de {limiteTalhao}%.
          </div>
        </div>
      </div>

      {/* Talhões e leituras */}
      <div className="bg-[#0b180d] border border-brand-border rounded-2xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
        <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white mb-6">
          Talhões e leituras
        </h2>

        {/* Tabs de Talhões */}
        <div className="flex flex-wrap gap-3 mb-4">
          {fazenda.talhoes?.map((talhao) => {
            const isSelected = talhaoAtivo?.id === talhao.id;
            return (
              <button
                key={talhao.id}
                onClick={() => setTalhaoAtivo(talhao)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  isSelected
                    ? 'bg-brand-primary text-black shadow-[0_2px_10px_rgba(74,222,128,0.3)]'
                    : 'bg-[#061107] text-brand-text-body hover:text-white border border-brand-border'
                }`}
              >
                {talhao.nome} · {talhao.cultura}
              </button>
            );
          })}
        </div>

        {talhaoAtivo && (
          <div className="space-y-6">
            <p className="text-sm text-brand-text-muted">
              {talhaoAtivo.areaHa} ha · limite de umidade: {talhaoAtivo.limiteUmidade}%
            </p>

            {/* Form Nova Leitura */}
            <form onSubmit={handleRegistrarLeitura} className="space-y-2">
              <label className="block text-sm font-medium text-brand-text-body">
                Umidade do solo (%)
              </label>

              {erroLeitura && (
                <p className="text-red-500 text-xs">{erroLeitura}</p>
              )}

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-md">
                <input
                  type="text"
                  value={novaUmidade}
                  onChange={(e) => setNovaUmidade(e.target.value)}
                  placeholder="Ex: 32"
                  className="bg-[#050c05] border border-brand-border rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-brand-primary flex-1"
                />
                <button
                  type="submit"
                  disabled={registrando}
                  className="bg-brand-primary hover:bg-brand-primary-hover text-black font-semibold px-6 py-3 rounded-full transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-[0_2px_10px_rgba(74,222,128,0.25)] disabled:opacity-50"
                >
                  {registrando ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  Registrar leitura
                </button>
              </div>
            </form>

            {/* Histórico */}
            <div className="pt-6 border-t border-brand-border/40">
              <h3 className="text-lg font-bold font-heading text-white mb-4">
                Histórico
              </h3>

              {(!talhaoAtivo.leituras || talhaoAtivo.leituras.length === 0) ? (
                <p className="text-sm text-brand-text-muted">Nenhuma leitura registrada para este talhão.</p>
              ) : (
                <div className="space-y-2">
                  {talhaoAtivo.leituras.map((leitura, index) => (
                    <div
                      key={leitura.id || index}
                      className="flex items-center justify-between py-3 border-b border-brand-border/20 text-sm"
                    >
                      <span className="font-mono text-brand-text-body">
                        {leitura.dataHora}
                      </span>
                      <span className="font-mono text-white font-bold text-base">
                        {leitura.valorUmidade}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
