import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Satellite, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight,
  LogOut,
  Map as MapIcon,
  AlertTriangle
} from 'lucide-react';

interface PlantacaoItem {
  id: string;
  nome: string;
  cultura: string;
  latitude: number;
  longitude: number;
}

export const PainelUsuario: React.FC = () => {
  // Dados do usuário recuperados do cadastro ou default
  const [userName, setUserName] = useState<string>('Leandro');
  const [farmName, setFarmName] = useState<string>('Fazenda Feliz');
  const [culturaAtual, setCulturaAtual] = useState<string>('Soja');

  // Estado do formulário 01 Nova Plantação
  const [novoNome, setNovoNome] = useState('');
  const [novaCultura, setNovaCultura] = useState('Soja');
  const [novaLat, setNovaLat] = useState('-23.5505');
  const [novaLng, setNovaLng] = useState('-46.6333');
  const [salvandoFeedback, setSalvandoFeedback] = useState<string | null>(null);
  const [limiteAtingidoAviso, setLimiteAtingidoAviso] = useState<string | null>(null);
  const [planoAtual, setPlanoAtual] = useState<string>('Teste grátis');
  const [limiteFazendas, setLimiteFazendas] = useState<number>(1);

  // Lista de plantações
  const [plantacoes, setPlantacoes] = useState<PlantacaoItem[]>([
    { id: '1', nome: 'Fazenda Feliz', cultura: 'Soja', latitude: -23.5349, longitude: -46.6212 },
    { id: '2', nome: 'Fazenda Triste', cultura: 'Milho', latitude: -22.9068, longitude: -47.0616 },
    { id: '3', nome: 'Token Fortnite', cultura: 'Café', latitude: -21.1775, longitude: -47.8103 },
  ]);
  const [plantacaoSelecionada, setPlantacaoSelecionada] = useState<string>('Fazenda Feliz');

  // Estado da recomendação
  const [gerando, setGerando] = useState(false);
  const [recomendacao, setRecomendacao] = useState({
    decisao: 'NÃO REGAR',
    cor: '#7cc795',
    motivo: 'O solo está bem abastecido (100% da água disponível) e há chuva prevista de 14,5 mm em 3 dias. Regar agora desperdiçaria água.',
    umidade: '29,3%',
    chuva3d: '14,5 mm',
    probChuva: '97%',
  });

  useEffect(() => {
    try {
      const savedPlan = localStorage.getItem('agrosat_plano_escolhido');
      const savedLimit = localStorage.getItem('agrosat_limite_fazendas');
      if (savedPlan === 'mensal') {
        setPlanoAtual('Plano Mensal (até 3 fazendas)');
        setLimiteFazendas(3);
      } else if (savedPlan === 'anual') {
        setPlanoAtual('Plano Anual (até 10 fazendas)');
        setLimiteFazendas(10);
      } else {
        setPlanoAtual('Teste Grátis (1 fazenda)');
        setLimiteFazendas(Number(savedLimit) || 1);
      }

      const saved = localStorage.getItem('agrosat_novo_produtor');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.nome) setUserName(parsed.nome.split(' ')[0]);
        if (parsed.nomeFazenda) {
          setFarmName(parsed.nomeFazenda);
          // Atualiza o primeiro item com a fazenda do usuário
          setPlantacoes([
            {
              id: 'user-farm',
              nome: parsed.nomeFazenda,
              cultura: parsed.plantio || 'Soja',
              latitude: parsed.latitude || -23.5349,
              longitude: parsed.longitude || -46.6212,
            }
          ]);
          setPlantacaoSelecionada(parsed.nomeFazenda);
        }
        if (parsed.plantio) setCulturaAtual(parsed.plantio);
        if (parsed.latitude && parsed.longitude) {
          setNovaLat(parsed.latitude.toFixed(4));
          setNovaLng(parsed.longitude.toFixed(4));
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSalvarPlantacao = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoNome.trim()) return;

    if (plantacoes.length >= limiteFazendas) {
      setLimiteAtingidoAviso(
        `Limite do seu plano atingido (${plantacoes.length} de ${limiteFazendas} fazenda(s)). Faça o upgrade para adicionar até 3 ou 10 fazendas!`
      );
      setTimeout(() => setLimiteAtingidoAviso(null), 6000);
      return;
    }

    const nova: PlantacaoItem = {
      id: Date.now().toString(),
      nome: novoNome.trim(),
      cultura: novaCultura,
      latitude: parseFloat(novaLat) || -23.5505,
      longitude: parseFloat(novaLng) || -46.6333,
    };

    setPlantacoes((prev) => [nova, ...prev]);
    setSalvandoFeedback(`Plantação "${novoNome}" cadastrada com sucesso! (${plantacoes.length + 1}/${limiteFazendas} utilizadas)`);
    setNovoNome('');
    setTimeout(() => setSalvandoFeedback(null), 3500);
  };

  const handleGerarRecomendacao = () => {
    setGerando(true);
    setTimeout(() => {
      setGerando(false);
      if (plantacaoSelecionada === 'Fazenda Triste') {
        setRecomendacao({
          decisao: 'REGAR',
          cor: '#6fa8e8',
          motivo: 'Solo em nível crítico de esgotamento hídrico e sem volume significativo de chuva nos próximos 3 dias.',
          umidade: '14,2%',
          chuva3d: '1,0 mm',
          probChuva: '15%',
        });
      } else if (plantacaoSelecionada === 'Token Fortnite') {
        setRecomendacao({
          decisao: 'ATENÇÃO',
          cor: '#e0b04a',
          motivo: 'Risco de encharcamento. Volume acumulado alto de precipitações recentes.',
          umidade: '41,8%',
          chuva3d: '45,0 mm',
          probChuva: '89%',
        });
      } else {
        setRecomendacao({
          decisao: 'NÃO REGAR',
          cor: '#7cc795',
          motivo: 'O solo está bem abastecido (100% da água disponível) e há chuva prevista de 14,5 mm em 3 dias. Regar agora desperdiçaria água.',
          umidade: '29,3%',
          chuva3d: '14,5 mm',
          probChuva: '97%',
        });
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0e1712] text-[#e6efe8] flex flex-col md:flex-row">
      {/* Sidebar Lateral */}
      <aside className="w-full md:w-64 bg-[#0a120d] border-b md:border-b-0 md:border-r border-[#243a2d] p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-950 border border-brand-primary/40 flex items-center justify-center text-brand-primary">
              <Satellite className="w-5 h-5" />
            </div>
            <span className="font-heading text-2xl font-bold tracking-wider text-white">
              Agro<span className="text-brand-primary">Sat</span>
            </span>
          </Link>

          {/* Menu Principal */}
          <nav className="space-y-1.5 pt-2">
            <a
              href="#visao-geral"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#1d3a2a] text-[#7cc795] font-semibold text-sm"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Visão geral</span>
            </a>
            <a
              href="#nova-plantacao"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#9fb5a6] hover:bg-[#14211a] hover:text-[#e6efe8] text-sm transition-colors"
            >
              <span className="text-xs bg-[#1d3a2a] text-[#7cc795] px-1.5 py-0.5 rounded font-mono">01</span>
              <span>Nova plantação</span>
            </a>
            <Link
              to="/recomendacao-hoje"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#9fb5a6] hover:bg-[#14211a] hover:text-[#e6efe8] text-sm transition-colors"
            >
              <span className="text-xs bg-[#1d3a2a] text-[#7cc795] px-1.5 py-0.5 rounded font-mono">02</span>
              <span>Recomendação de hoje</span>
            </Link>
            <a
              href="#historico"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#9fb5a6] hover:bg-[#14211a] hover:text-[#e6efe8] text-sm transition-colors"
            >
              <span className="text-xs bg-[#1d3a2a] text-[#7cc795] px-1.5 py-0.5 rounded font-mono">03</span>
              <span>Histórico</span>
            </a>
            <a
              href="#economia"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#9fb5a6] hover:bg-[#14211a] hover:text-[#e6efe8] text-sm transition-colors"
            >
              <span className="text-xs bg-[#1d3a2a] text-[#7cc795] px-1.5 py-0.5 rounded font-mono">04</span>
              <span>Economia</span>
            </a>
          </nav>

          {/* Links de Destaque da Solução */}
          <div className="pt-4 border-t border-[#243a2d] space-y-1.5">
            <span className="text-[11px] uppercase tracking-wider text-[#9fb5a6] font-semibold px-3">
              Módulos CitizenTech
            </span>
            <Link
              to="/mapa-plantacoes"
              className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#9fb5a6] hover:text-[#7cc795] hover:bg-[#14211a] rounded-lg transition-colors"
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Mapa de Plantações</span>
            </Link>
            <Link
              to="/admin-cooperativa"
              className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#9fb5a6] hover:text-[#7cc795] hover:bg-[#14211a] rounded-lg transition-colors"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Visão da Cooperativa</span>
            </Link>
            <Link
              to="/planos"
              className="flex items-center gap-2.5 px-3 py-2 text-xs text-[#e0b04a] hover:bg-[#14211a] rounded-lg transition-colors"
            >
              <span>Gerenciar / Alterar Plano</span>
            </Link>
          </div>
        </div>

        {/* Rodapé do Menu */}
        <div className="pt-6 border-t border-[#243a2d] mt-6">
          <Link
            to="/login"
            className="flex items-center gap-2 text-xs text-[#9fb5a6] hover:text-rose-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Encerrar sessão</span>
          </Link>
        </div>
      </aside>

      {/* Área Principal de Conteúdo */}
      <main className="flex-1 p-6 sm:p-10 lg:p-12 space-y-8 overflow-y-auto">
        {/* Topo com Saudação e Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#243a2d]">
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white">
              Olá, {userName}
            </h1>
            <p className="text-[#9fb5a6] text-sm mt-0.5">
              {farmName} · {culturaAtual}
            </p>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="bg-[#1d3a2a] text-[#7cc795] text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#7cc795]/30">
              {planoAtual} · {plantacoes.length}/{limiteFazendas} fazenda(s)
            </span>
            <Link
              to="/planos"
              className="text-xs bg-[#14211a] border border-[#2f4838] hover:border-[#7cc795] text-[#e6efe8] px-3 py-1.5 rounded-lg transition-colors"
            >
              Upgrade
            </Link>
          </div>
        </div>

        {limiteAtingidoAviso && (
          <div className="bg-[#3a2f12] border border-[#e0b04a] text-[#f3d98b] text-xs p-4 rounded-xl flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 text-[#e0b04a]" />
              <span>{limiteAtingidoAviso}</span>
            </div>
            <Link
              to="/planos"
              className="font-bold underline text-white hover:text-[#7cc795] ml-4 shrink-0"
            >
              Ver Planos
            </Link>
          </div>
        )}

        {/* Grid de 2 Colunas com os 4 Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* Card 01 - Nova Plantação */}
          <div id="nova-plantacao" className="bg-[#14211a] border border-[#243a2d] rounded-2xl p-6 sm:p-7 space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-[#1d3a2a] text-[#7cc795] rounded-lg px-2.5 py-1 text-xs font-bold font-mono">
                01
              </span>
              <h2 className="font-heading text-xl font-bold text-white">Nova plantação</h2>
            </div>

            {salvandoFeedback && (
              <div className="bg-[#1d3a2a] border border-[#7cc795]/50 text-[#7cc795] text-xs p-3 rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{salvandoFeedback}</span>
              </div>
            )}

            <form onSubmit={handleSalvarPlantacao} className="space-y-4">
              <div>
                <label className="block text-xs text-[#9fb5a6] mb-1.5" htmlFor="plantacao-nome">
                  Nome da plantação
                </label>
                <input
                  id="plantacao-nome"
                  type="text"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  placeholder="Ex.: Talhão Norte"
                  className="w-full h-11 bg-[#0e1712] border border-[#2f4838] rounded-xl text-[#e6efe8] px-3.5 text-sm focus:outline-none focus:border-[#7cc795]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-[#9fb5a6] mb-1.5" htmlFor="plantacao-cultura">
                  Cultura
                </label>
                <select
                  id="plantacao-cultura"
                  value={novaCultura}
                  onChange={(e) => setNovaCultura(e.target.value)}
                  className="w-full h-11 bg-[#0e1712] border border-[#2f4838] rounded-xl text-[#e6efe8] px-3 text-sm focus:outline-none focus:border-[#7cc795]"
                >
                  <option value="Soja">Soja</option>
                  <option value="Milho">Milho</option>
                  <option value="Café">Café</option>
                  <option value="Trigo">Trigo</option>
                  <option value="Cana-de-açúcar">Cana-de-açúcar</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#9fb5a6] mb-1.5" htmlFor="plantacao-lat">
                    Latitude
                  </label>
                  <input
                    id="plantacao-lat"
                    type="text"
                    value={novaLat}
                    onChange={(e) => setNovaLat(e.target.value)}
                    className="w-full h-11 bg-[#0e1712] border border-[#2f4838] rounded-xl text-[#e6efe8] px-3.5 text-sm focus:outline-none focus:border-[#7cc795]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#9fb5a6] mb-1.5" htmlFor="plantacao-lng">
                    Longitude
                  </label>
                  <input
                    id="plantacao-lng"
                    type="text"
                    value={novaLng}
                    onChange={(e) => setNovaLng(e.target.value)}
                    className="w-full h-11 bg-[#0e1712] border border-[#2f4838] rounded-xl text-[#e6efe8] px-3.5 text-sm focus:outline-none focus:border-[#7cc795]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="h-11 px-6 rounded-xl bg-[#eef3ee] text-[#0e1712] font-semibold text-sm hover:bg-white transition-colors"
              >
                Salvar plantação
              </button>
            </form>
          </div>

          {/* Card 02 - Recomendação */}
          <div id="recomendacao" className="bg-[#14211a] border border-[#243a2d] rounded-2xl p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="bg-[#1d3a2a] text-[#7cc795] rounded-lg px-2.5 py-1 text-xs font-bold font-mono">
                  02
                </span>
                <h2 className="font-heading text-xl font-bold text-white">Recomendação</h2>
              </div>
              <Link
                to="/recomendacao-hoje"
                className="text-xs text-[#7cc795] hover:underline flex items-center gap-1"
              >
                <span>Ver balanço completo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <select
                value={plantacaoSelecionada}
                onChange={(e) => setPlantacaoSelecionada(e.target.value)}
                className="flex-1 h-11 bg-[#0e1712] border border-[#2f4838] rounded-xl text-[#e6efe8] px-3 text-sm focus:outline-none focus:border-[#7cc795]"
                aria-label="Plantação"
              >
                {plantacoes.map((p) => (
                  <option key={p.id} value={p.nome}>
                    {p.nome} ({p.cultura})
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleGerarRecomendacao}
                disabled={gerando}
                className="h-11 px-5 rounded-xl bg-[#eef3ee] text-[#0e1712] font-semibold text-sm hover:bg-white transition-colors whitespace-nowrap disabled:opacity-50"
              >
                {gerando ? 'Calculando...' : 'Gerar recomendação'}
              </button>
            </div>

            {/* Decisão em destaque */}
            <div className="pt-2">
              <span 
                className="font-heading text-4xl sm:text-5xl font-bold tracking-tight block"
                style={{ color: recomendacao.cor }}
              >
                {recomendacao.decisao}
              </span>
              <p className="text-sm text-[#e6efe8] mt-2 leading-relaxed">
                {recomendacao.motivo}
              </p>
            </div>

            {/* Três Métricas Resumidas */}
            <div className="grid grid-cols-3 gap-2.5 pt-2">
              <div className="bg-[#0e1712] border border-[#243a2d] rounded-xl p-3">
                <span className="font-heading text-lg sm:text-xl font-bold text-white block">
                  {recomendacao.umidade}
                </span>
                <span className="text-[11px] text-[#9fb5a6]">Umidade do solo</span>
              </div>
              <div className="bg-[#0e1712] border border-[#243a2d] rounded-xl p-3">
                <span className="font-heading text-lg sm:text-xl font-bold text-white block">
                  {recomendacao.chuva3d}
                </span>
                <span className="text-[11px] text-[#9fb5a6]">Chuva em 3 dias</span>
              </div>
              <div className="bg-[#0e1712] border border-[#243a2d] rounded-xl p-3">
                <span className="font-heading text-lg sm:text-xl font-bold text-white block">
                  {recomendacao.probChuva}
                </span>
                <span className="text-[11px] text-[#9fb5a6]">Prob. máxima</span>
              </div>
            </div>
          </div>

          {/* Card 03 - Histórico de Recomendações */}
          <div id="historico" className="bg-[#14211a] border border-[#243a2d] rounded-2xl p-6 sm:p-7 space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-[#1d3a2a] text-[#7cc795] rounded-lg px-2.5 py-1 text-xs font-bold font-mono">
                03
              </span>
              <h2 className="font-heading text-xl font-bold text-white">
                Histórico de recomendações
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-[#9fb5a6] border-b border-[#243a2d]">
                    <th className="py-2.5 font-medium">Quando</th>
                    <th className="py-2.5 px-3 font-medium">Decisão</th>
                    <th className="py-2.5 font-medium">Motivo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#243a2d]">
                  <tr className="hover:bg-[#1a2d23] transition-colors">
                    <td className="py-3 text-[#9fb5a6] whitespace-nowrap">09/11, 17:17</td>
                    <td className="py-3 px-3 font-bold text-[#7cc795] whitespace-nowrap">NÃO REGAR</td>
                    <td className="py-3 text-[#e6efe8]">Solo abastecido e chuva prevista de 23,5 mm</td>
                  </tr>
                  <tr className="hover:bg-[#1a2d23] transition-colors">
                    <td className="py-3 text-[#9fb5a6] whitespace-nowrap">08/11, 08:01</td>
                    <td className="py-3 px-3 font-bold text-[#7cc795] whitespace-nowrap">NÃO REGAR</td>
                    <td className="py-3 text-[#e6efe8]">Solo abastecido e chuva prevista de 63,9 mm</td>
                  </tr>
                  <tr className="hover:bg-[#1a2d23] transition-colors">
                    <td className="py-3 text-[#9fb5a6] whitespace-nowrap">07/11, 07:45</td>
                    <td className="py-3 px-3 font-bold text-[#6fa8e8] whitespace-nowrap">REGAR</td>
                    <td className="py-3 text-[#e6efe8]">Solo seco e sem chuva prevista</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Card 04 - Economia da Fazenda */}
          <div id="economia" className="bg-[#14211a] border border-[#243a2d] rounded-2xl p-6 sm:p-7 space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-[#1d3a2a] text-[#7cc795] rounded-lg px-2.5 py-1 text-xs font-bold font-mono">
                04
              </span>
              <h2 className="font-heading text-xl font-bold text-white">Economia da fazenda</h2>
            </div>

            {/* 3 Métricas de Poupança */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-[#0e1712] border border-[#243a2d] rounded-xl p-3">
                <span className="font-heading text-2xl font-bold text-white block">2</span>
                <span className="text-[11px] text-[#9fb5a6]">Irrigações evitadas</span>
              </div>
              <div className="bg-[#0e1712] border border-[#243a2d] rounded-xl p-3">
                <span className="font-heading text-2xl font-bold text-white block">3.400 L</span>
                <span className="text-[11px] text-[#9fb5a6]">Água poupada</span>
              </div>
              <div className="bg-[#0e1712] border border-[#243a2d] rounded-xl p-3">
                <span className="font-heading text-2xl font-bold text-[#7cc795] block">R$ 18,40</span>
                <span className="text-[11px] text-[#9fb5a6]">Economia estimada</span>
              </div>
            </div>

            {/* Gráfico de barras semanais */}
            <div className="pt-2">
              <div className="flex items-end gap-3.5 h-28 pt-2">
                <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div className="w-full bg-[#6fa8e8] rounded-t-md transition-all duration-300" style={{ height: '30%' }} title="Semana 1: 800L"></div>
                  <span className="text-[10px] text-[#9fb5a6]">Sem 1</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div className="w-full bg-[#6fa8e8] rounded-t-md transition-all duration-300" style={{ height: '55%' }} title="Semana 2: 1.400L"></div>
                  <span className="text-[10px] text-[#9fb5a6]">Sem 2</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div className="w-full bg-[#6fa8e8] rounded-t-md transition-all duration-300" style={{ height: '40%' }} title="Semana 3: 1.050L"></div>
                  <span className="text-[10px] text-[#9fb5a6]">Sem 3</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div className="w-full bg-[#7cc795] rounded-t-md transition-all duration-300" style={{ height: '90%' }} title="Semana 4: 2.350L"></div>
                  <span className="text-[10px] text-[#7cc795] font-semibold">Sem 4</span>
                </div>
              </div>
              <p className="text-[11px] text-[#9fb5a6] mt-3">
                Litros poupados por semana · dados reais medidos pelo sensor virtual e Open-Meteo
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PainelUsuario;
