import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FazendaService } from '../services/api';
import { WeatherService } from '../services/weatherService';
import { Talhao } from '../types';
import { ArrowLeft, Search, Plus, Trash2, CheckCircle, Loader2 } from 'lucide-react';

export const CadastrarFazenda: React.FC = () => {
  const navigate = useNavigate();

  // Propriedade
  const [nome, setNome] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [uf, setUf] = useState('');
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [autorizo, setAutorizo] = useState(true);
  const [buscandoCoord, setBuscandoCoord] = useState(false);

  // Manejo
  const [sistemaIrrigacao, setSistemaIrrigacao] = useState('');
  const [tipoSolo, setTipoSolo] = useState('');
  const [observacoes, setObservacoes] = useState('');

  // Talhões list
  const [talhoes, setTalhoes] = useState<Talhao[]>([]);

  // Current talhão input
  const [nomeTalhao, setNomeTalhao] = useState('');
  const [cultura, setCultura] = useState('');
  const [areaHa, setAreaHa] = useState('');
  const [limiteUmidade, setLimiteUmidade] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleBuscarCoordenadas = async () => {
    if (!municipio.trim()) {
      setErrors(prev => ({ ...prev, municipio: 'Informe o município para buscar coordenadas.' }));
      return;
    }
    setBuscandoCoord(true);
    setErrors(prev => ({ ...prev, municipio: '' }));
    try {
      const res = await WeatherService.buscarCoordenadas(municipio, uf);
      if (res) {
        setLatitude(res.lat.toString());
        setLongitude(res.lon.toString());
      } else {
        setLatitude('-22.9056');
        setLongitude('-47.0608');
      }
    } catch {
      setLatitude('-22.9056');
      setLongitude('-47.0608');
    } finally {
      setBuscandoCoord(false);
    }
  };

  const handleAdicionarTalhao = () => {
    const newErrors: { [key: string]: string } = {};

    if (!nomeTalhao.trim()) newErrors.nomeTalhao = 'Nome do talhão é obrigatório.';
    if (!cultura.trim()) newErrors.cultura = 'Cultura é obrigatória.';

    const areaNum = parseFloat(areaHa.replace(',', '.'));
    if (!areaHa || isNaN(areaNum) || areaNum <= 0) {
      newErrors.areaHa = 'Área maior que zero.';
    }

    const umidadeNum = parseFloat(limiteUmidade.replace(',', '.'));
    if (!limiteUmidade || isNaN(umidadeNum) || umidadeNum <= 0 || umidadeNum > 100) {
      newErrors.limiteUmidade = 'Limite deve ser entre 1% e 100%.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...newErrors }));
      return;
    }

    const novoTalhao: Talhao = {
      id: Date.now(),
      nome: nomeTalhao.trim(),
      cultura: cultura.trim(),
      areaHa: areaNum,
      limiteUmidade: umidadeNum,
      leituras: [
        {
          id: Date.now() + 1,
          dataHora: new Date().toLocaleString('pt-BR'),
          valorUmidade: Math.round(umidadeNum * 0.8) // valor inicial simulado
        }
      ]
    };

    setTalhoes(prev => [...prev, novoTalhao]);
    setNomeTalhao('');
    setCultura('');
    setAreaHa('');
    setLimiteUmidade('');
    setErrors(prev => {
      const cleaned = { ...prev };
      delete cleaned.nomeTalhao;
      delete cleaned.cultura;
      delete cleaned.areaHa;
      delete cleaned.limiteUmidade;
      delete cleaned.talhoesGeral;
      return cleaned;
    });
  };

  const handleRemoverTalhao = (id: number | string) => {
    setTalhoes(prev => prev.filter(t => t.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!nome.trim()) newErrors.nome = 'Nome da fazenda é obrigatório.';
    if (!municipio.trim()) newErrors.municipio = 'Município é obrigatório.';
    if (!uf.trim()) newErrors.uf = 'UF é obrigatória.';
    if (talhoes.length === 0) {
      newErrors.talhoesGeral = 'Adicione ao menos um talhão para cadastrar a fazenda.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      setSubmitting(true);
      await FazendaService.cadastrar({
        nome: nome.trim(),
        municipio: municipio.trim(),
        uf: uf.trim().toUpperCase(),
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        autorizaOpenMeteo: autorizo,
        sistemaIrrigacao: sistemaIrrigacao.trim(),
        tipoSolo: tipoSolo.trim(),
        observacoes: observacoes.trim(),
        talhoes
      });

      setSuccessMsg(true);
      setTimeout(() => {
        navigate('/painel');
      }, 1200);
    } catch {
      setErrors({ api: 'Erro ao enviar dados para a API Java.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <Link
        to="/painel"
        className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-primary-hover text-sm font-medium mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar ao painel
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold font-heading text-white mb-2">
          Cadastrar fazenda
        </h1>
        <p className="text-brand-text-body text-base">
          Registre a propriedade, a localização e os talhões. Os dados são enviados para a API.
        </p>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-950/80 border border-emerald-500 rounded-xl text-emerald-200 flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
          <span>Fazenda cadastrada com sucesso! Redirecionando para o painel...</span>
        </div>
      )}

      {errors.api && (
        <div className="mb-6 p-4 bg-red-950/80 border border-red-500 rounded-xl text-red-200">
          {errors.api}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Card 1: Propriedade */}
        <div className="bg-[#0b180d] border border-brand-border rounded-2xl p-6 sm:p-8 space-y-5">
          <h2 className="text-xl font-bold font-heading text-white tracking-wide">
            Propriedade
          </h2>

          <div>
            <label className="block text-sm font-medium text-brand-text-body mb-1.5">
              Nome da fazenda
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Fazenda Santa Luzia"
              className={`w-full bg-[#050c05] border ${
                errors.nome ? 'border-red-500' : 'border-brand-border'
              } rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-brand-primary`}
            />
            {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-brand-text-body mb-1.5">
                Município
              </label>
              <input
                type="text"
                value={municipio}
                onChange={(e) => setMunicipio(e.target.value)}
                placeholder="Ex: Campinas"
                className={`w-full bg-[#050c05] border ${
                  errors.municipio ? 'border-red-500' : 'border-brand-border'
                } rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-brand-primary`}
              />
              {errors.municipio && <p className="text-red-500 text-sm mt-1">{errors.municipio}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text-body mb-1.5">
                UF
              </label>
              <input
                type="text"
                maxLength={2}
                value={uf}
                onChange={(e) => setUf(e.target.value)}
                placeholder="SP"
                className={`w-full bg-[#050c05] border ${
                  errors.uf ? 'border-red-500' : 'border-brand-border'
                } rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-brand-primary uppercase`}
              />
              {errors.uf && <p className="text-red-500 text-sm mt-1">{errors.uf}</p>}
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleBuscarCoordenadas}
              disabled={buscandoCoord}
              className="inline-flex items-center gap-2 border border-brand-primary/40 hover:border-brand-primary text-brand-primary text-sm font-medium px-4 py-2 rounded-full transition-colors bg-emerald-950/20"
            >
              {buscandoCoord ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Buscando...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" /> Buscar coordenadas do município
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-text-body mb-1.5">
                Latitude
              </label>
              <input
                type="text"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="-22.9056"
                className="w-full bg-[#050c05] border border-brand-border rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text-body mb-1.5">
                Longitude
              </label>
              <input
                type="text"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="-47.0608"
                className="w-full bg-[#050c05] border border-brand-border rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          <div className="flex items-start gap-3 pt-2">
            <input
              id="openmeteo-check"
              type="checkbox"
              checked={autorizo}
              onChange={(e) => setAutorizo(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-brand-border bg-[#050c05] text-brand-primary focus:ring-brand-primary accent-brand-primary"
            />
            <label htmlFor="openmeteo-check" className="text-sm text-brand-text-body cursor-pointer">
              Autorizo enviar as coordenadas desta fazenda ao serviço Open-Meteo para consultar a previsão do tempo.
            </label>
          </div>
        </div>

        {/* Card 2: Manejo */}
        <div className="bg-[#0b180d] border border-brand-border rounded-2xl p-6 sm:p-8 space-y-5">
          <h2 className="text-xl font-bold font-heading text-white tracking-wide">
            Manejo
          </h2>

          <div>
            <label className="block text-sm font-medium text-brand-text-body mb-1.5">
              Sistema de irrigação
            </label>
            <input
              type="text"
              value={sistemaIrrigacao}
              onChange={(e) => setSistemaIrrigacao(e.target.value)}
              placeholder="Ex: Gotejamento, Microaspersão, Pivô Central"
              className="w-full bg-[#050c05] border border-brand-border rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text-body mb-1.5">
              Tipo de solo
            </label>
            <input
              type="text"
              value={tipoSolo}
              onChange={(e) => setTipoSolo(e.target.value)}
              placeholder="Ex: Arenoso, Argiloso, Latossolo"
              className="w-full bg-[#050c05] border border-brand-border rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text-body mb-1.5">
              Observações
            </label>
            <input
              type="text"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex: Cultivo orgânico certificado, histórico de estiagem"
              className="w-full bg-[#050c05] border border-brand-border rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-brand-primary"
            />
          </div>
        </div>

        {/* Card 3: Talhões */}
        <div className="bg-[#0b180d] border border-brand-border rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold font-heading text-white tracking-wide">
            Talhões
          </h2>

          {errors.talhoesGeral && (
            <p className="text-red-500 text-sm">{errors.talhoesGeral}</p>
          )}

          {/* Lista de talhões já adicionados */}
          {talhoes.length > 0 && (
            <div className="space-y-3 pb-4 border-b border-brand-border/40">
              <p className="text-xs uppercase tracking-wider text-brand-text-muted font-mono">
                Talhões a serem cadastrados:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {talhoes.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-3.5 bg-[#050c05] border border-brand-border rounded-xl"
                  >
                    <div>
                      <div className="font-semibold text-white text-sm">{t.nome}</div>
                      <div className="text-xs text-brand-text-muted">
                        {t.cultura} · {t.areaHa} ha · limite {t.limiteUmidade}%
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoverTalhao(t.id)}
                      className="text-red-400 hover:text-red-300 p-1.5"
                      title="Excluir talhão"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form para adicionar novo talhão */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-text-body mb-1.5">
                  Nome do talhão
                </label>
                <input
                  type="text"
                  value={nomeTalhao}
                  onChange={(e) => setNomeTalhao(e.target.value)}
                  placeholder="Ex: Talhão Norte"
                  className={`w-full bg-[#050c05] border ${
                    errors.nomeTalhao ? 'border-red-500' : 'border-brand-border'
                  } rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-brand-primary`}
                />
                {errors.nomeTalhao && <p className="text-red-500 text-sm mt-1">{errors.nomeTalhao}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-text-body mb-1.5">
                  Cultura
                </label>
                <input
                  type="text"
                  value={cultura}
                  onChange={(e) => setCultura(e.target.value)}
                  placeholder="Ex: Tomate"
                  className={`w-full bg-[#050c05] border ${
                    errors.cultura ? 'border-red-500' : 'border-brand-border'
                  } rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-brand-primary`}
                />
                {errors.cultura && <p className="text-red-500 text-sm mt-1">{errors.cultura}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-text-body mb-1.5">
                  Área (ha)
                </label>
                <input
                  type="text"
                  value={areaHa}
                  onChange={(e) => setAreaHa(e.target.value)}
                  placeholder="Ex: 2.5"
                  className={`w-full bg-[#050c05] border ${
                    errors.areaHa ? 'border-red-500' : 'border-brand-border'
                  } rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-brand-primary`}
                />
                {errors.areaHa && <p className="text-red-500 text-sm mt-1">{errors.areaHa}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-text-body mb-1.5">
                  Limite de umidade (%) definido com assistência técnica
                </label>
                <input
                  type="text"
                  value={limiteUmidade}
                  onChange={(e) => setLimiteUmidade(e.target.value)}
                  placeholder="Ex: 35"
                  className={`w-full bg-[#050c05] border ${
                    errors.limiteUmidade ? 'border-red-500' : 'border-brand-border'
                  } rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-brand-primary`}
                />
                {errors.limiteUmidade && <p className="text-red-500 text-sm mt-1">{errors.limiteUmidade}</p>}
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={handleAdicionarTalhao}
                className="inline-flex items-center gap-2 border border-brand-primary/40 hover:border-brand-primary text-brand-primary text-sm font-medium px-4 py-2.5 rounded-full transition-colors bg-emerald-950/20"
              >
                <Plus className="w-4 h-4" /> Adicionar talhão
              </button>
            </div>
          </div>
        </div>

        {/* Botão Cadastrar Fazenda e Talhões */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand-primary hover:bg-brand-primary-hover text-black font-semibold text-base py-4 px-8 rounded-full transition-all duration-200 shadow-[0_2px_15px_rgba(74,222,128,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Cadastrando na API...
              </>
            ) : (
              'Cadastrar fazenda e talhões'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
