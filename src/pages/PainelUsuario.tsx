import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Satellite, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  LogOut, 
  Map as MapIcon, 
  AlertTriangle, 
  Trash2,
  Sprout
} from 'lucide-react';
import { 
  calcularRecomendacao, 
  PlantacaoItem, 
  RecomendacaoResultado 
} from '../utils/recomendacao';
import { UsuarioService, FazendaService } from '../services/api';

interface HistoricoItem {
  id: string;
  quando: string;
  fazenda: string;
  decisao: string;
  motivo: string;
  cor: string;
  umidade?: string;
  chuva3d?: string;
  probChuva?: string;
}

export const PainelUsuario: React.FC = () => {
  const navigate = useNavigate();

  // Dados do usuário recuperados do cadastro, sessão da API ou default
  const [userName, setUserName] = useState<string>('Produtor');
  const [farmName, setFarmName] = useState<string>('Fazenda');
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
  const [plantacoes, setPlantacoes] = useState<PlantacaoItem[]>([]);
  const [plantacaoSelecionada, setPlantacaoSelecionada] = useState<string>('');

  // Estado da recomendação (inicia vazio para novos usuários)
  const [gerando, setGerando] = useState(false);
  const [recomendacao, setRecomendacao] = useState<RecomendacaoResultado | null>(null);

  // Histórico de recomendações (inicia vazio para novos usuários)
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);

  // Chaves de armazenamento isoladas estritamente por usuário via UsuarioService
  const getChavePlantacoes = () => UsuarioService.getChavePlantacoes();
  const getChaveSelecionada = () => UsuarioService.getChaveSelecionada();
  const getHistoricoStorageKey = () => UsuarioService.getChaveHistorico();

  const registrarHistorico = (fazendaNome: string, rec: RecomendacaoResultado) => {
    const agora = new Date();
    const hora = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const novoH: HistoricoItem = {
      id: Date.now().toString(),
      quando: `Hoje, ${hora}`,
      fazenda: fazendaNome,
      decisao: rec.decisao,
      motivo: rec.motivo,
      cor: rec.cor,
      umidade: rec.umidade,
      chuva3d: rec.chuva3d,
      probChuva: rec.probChuva,
    };
    setHistorico((prev) => {
      const atualizado = [novoH, ...prev.slice(0, 9)];
      try {
        const storageKey = getHistoricoStorageKey();
        localStorage.setItem(storageKey, JSON.stringify(atualizado));
      } catch {}
      return atualizado;
    });
  };

  useEffect(() => {
    let cancelado = false;

    async function inicializarPainel() {
      try {
        // 1. Carrega dados do usuário ativo da sessão
        const usuarioAtivo = UsuarioService.getUsuarioAtivo();
        if (!usuarioAtivo) {
          navigate('/login');
          return;
        }

        const savedProdutor = localStorage.getItem('agrosat_novo_produtor');
        let produtorInfo: any = null;
        if (savedProdutor) {
          try {
            produtorInfo = JSON.parse(savedProdutor);
          } catch {
            produtorInfo = null;
          }
        }

        setUserName(usuarioAtivo.nome ? usuarioAtivo.nome.split(' ')[0] : 'Produtor');

        const isAdmin = usuarioAtivo.tipo === 'ADMIN';
        const chavePlantacoes = getChavePlantacoes();
        const chaveSelecionada = getChaveSelecionada();

        // 2. Tenta recuperar do storage isolado deste usuário específico
        let listaUsuario: PlantacaoItem[] = [];
        const salvas = localStorage.getItem(chavePlantacoes);
        if (salvas) {
          try {
            const parsed = JSON.parse(salvas);
            if (Array.isArray(parsed) && parsed.length > 0) {
              listaUsuario = parsed;
            }
          } catch {
            listaUsuario = [];
          }
        }

        // 3. Se o storage deste usuário ainda não tem fazendas, busca da API Java filtrado pelo usuarioId
        if (listaUsuario.length === 0) {
          try {
            const fazendasApi = await FazendaService.listarPorUsuario(usuarioAtivo.id, isAdmin);
            if (fazendasApi && fazendasApi.length > 0) {
              listaUsuario = fazendasApi.map((f) => ({
                id: String(f.id),
                nome: f.nome,
                cultura: (f.talhoes && f.talhoes.length > 0 && f.talhoes[0].cultura) ? f.talhoes[0].cultura : 'Soja',
                latitude: typeof f.latitude === 'number' ? f.latitude : -21.178,
                longitude: typeof f.longitude === 'number' ? f.longitude : -47.811,
              }));
            }
          } catch {
            // tolera
          }
        }

        // 4. Se o produtor acabou de se cadastrar com uma fazenda nova, insere no topo e limpa a chave temporária
        if (produtorInfo && produtorInfo.nomeFazenda && String(produtorInfo.id) === String(usuarioAtivo.id)) {
          const jaExiste = listaUsuario.some(
            (f) => f.nome.toLowerCase() === produtorInfo.nomeFazenda.toLowerCase()
          );
          if (!jaExiste) {
            const fazendaDoProdutor: PlantacaoItem = {
              id: 'user-farm-' + Date.now(),
              nome: produtorInfo.nomeFazenda,
              cultura: produtorInfo.plantio || 'Soja',
              latitude: produtorInfo.latitude || -23.5349,
              longitude: produtorInfo.longitude || -46.6212,
            };
            listaUsuario = [fazendaDoProdutor, ...listaUsuario];
            // Sincroniza em segundo plano com a API Java
            FazendaService.cadastrar({
              nome: fazendaDoProdutor.nome,
              municipio: 'Interior',
              uf: 'SP',
              latitude: fazendaDoProdutor.latitude,
              longitude: fazendaDoProdutor.longitude,
              talhoes: [{ id: Date.now(), nome: 'Talhão Principal', cultura: fazendaDoProdutor.cultura, areaHa: 10, limiteUmidade: 35, leituras: [] }]
            }).catch(() => {});
          }
          localStorage.removeItem('agrosat_novo_produtor');
        }

        if (cancelado) return;

        // 5. Define o plano e limite isolado por usuário
        const savedPlan = localStorage.getItem(UsuarioService.getChavePlano());
        const savedLimit = localStorage.getItem(UsuarioService.getChaveLimiteFazendas());
        if (isAdmin) {
          setPlanoAtual('Acesso Administrador (Cooperativa)');
          setLimiteFazendas(Math.max(10, listaUsuario.length));
        } else if (savedPlan === 'anual') {
          setPlanoAtual('Plano Anual (até 10 fazendas)');
          setLimiteFazendas(10);
        } else if (savedPlan === 'mensal' || (!savedPlan && listaUsuario.length > 1)) {
          setPlanoAtual('Plano Mensal (até 3 fazendas)');
          setLimiteFazendas(Math.max(3, listaUsuario.length));
        } else {
          setPlanoAtual('Teste Grátis (1 fazenda)');
          setLimiteFazendas(Math.max(Number(savedLimit) || 1, listaUsuario.length));
        }

        // Salva estritamente na chave do usuário ativo
        localStorage.setItem(chavePlantacoes, JSON.stringify(listaUsuario));
        setPlantacoes(listaUsuario);

        // Carrega histórico existente do usuário ativo
        const storageKey = getHistoricoStorageKey();
        const savedH = localStorage.getItem(storageKey);
        if (savedH) {
          try {
            const parsedH = JSON.parse(savedH);
            if (Array.isArray(parsedH) && parsedH.length > 0) {
              setHistorico(parsedH);
              const ultima = parsedH[0];
              setRecomendacao({
                decisao: ultima.decisao as any,
                cor: ultima.cor,
                motivo: ultima.motivo,
                umidade: ultima.umidade || '--',
                chuva3d: ultima.chuva3d || '--',
                probChuva: ultima.probChuva || '--',
              });
            }
          } catch {}
        }

        // Define a fazenda selecionada (prioriza a fazenda do produtor se recém-cadastrada)
        if (listaUsuario.length > 0) {
          const ultimaEscolhida = localStorage.getItem(chaveSelecionada);
          const fazendaAlvo = (produtorInfo && produtorInfo.nomeFazenda && !ultimaEscolhida)
            ? (listaUsuario.find((f) => f.nome.toLowerCase() === produtorInfo.nomeFazenda.toLowerCase()) || listaUsuario[0])
            : (listaUsuario.find((f) => f.nome === ultimaEscolhida) || listaUsuario[0]);

          if (fazendaAlvo) {
            setPlantacaoSelecionada(fazendaAlvo.nome);
            setFarmName(fazendaAlvo.nome);
            setCulturaAtual(fazendaAlvo.cultura);
            setNovaLat(fazendaAlvo.latitude.toFixed(4));
            setNovaLng(fazendaAlvo.longitude.toFixed(4));
            localStorage.setItem(chaveSelecionada, fazendaAlvo.nome);
          }
        } else {
          setPlantacaoSelecionada('');
          setFarmName('Nenhuma fazenda cadastrada');
          setCulturaAtual('-');
          setRecomendacao(null);
        }
      } catch {
        // ignore
      }
    }

    inicializarPainel();
    return () => { cancelado = true; };
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

    const chavePlantacoes = getChavePlantacoes();
    const chaveSelecionada = getChaveSelecionada();
    const novaLista = [nova, ...plantacoes];
    setPlantacoes(novaLista);
    localStorage.setItem(chavePlantacoes, JSON.stringify(novaLista));

    // Seleciona e gera recomendação imediatamente para a nova fazenda
    setPlantacaoSelecionada(nova.nome);
    setFarmName(nova.nome);
    setCulturaAtual(nova.cultura);
    localStorage.setItem(chaveSelecionada, nova.nome);

    const novaRec = calcularRecomendacao(nova);
    setRecomendacao(novaRec);
    registrarHistorico(nova.nome, novaRec);

    // Envia POST /fazendas para a API REST Java
    FazendaService.cadastrar({
      nome: nova.nome,
      municipio: 'Interior',
      uf: 'SP',
      latitude: nova.latitude,
      longitude: nova.longitude,
      talhoes: [
        {
          id: Date.now() + 1,
          nome: 'Talhão Principal',
          cultura: nova.cultura,
          areaHa: 10,
          limiteUmidade: 35,
          leituras: []
        }
      ]
    }).catch(() => {});

    setSalvandoFeedback(`Plantação "${novoNome}" cadastrada e salva com sucesso! (${novaLista.length}/${limiteFazendas} utilizadas)`);
    setNovoNome('');
    setTimeout(() => setSalvandoFeedback(null), 3500);
  };

  const handleExcluirPlantacao = (id: string, nome: string) => {
    if (!window.confirm(`Deseja realmente excluir a plantação "${nome}"? Esta ação liberará 1 vaga no seu plano.`)) {
      return;
    }

    const chavePlantacoes = getChavePlantacoes();
    const chaveSelecionada = getChaveSelecionada();
    const novaLista = plantacoes.filter((p) => p.id !== id);
    setPlantacoes(novaLista);
    localStorage.setItem(chavePlantacoes, JSON.stringify(novaLista));

    // Remove também da API Java se aplicável
    FazendaService.remover(id).catch(() => {});

    if (plantacaoSelecionada === nome) {
      if (novaLista.length > 0) {
        const primeira = novaLista[0];
        setPlantacaoSelecionada(primeira.nome);
        setFarmName(primeira.nome);
        setCulturaAtual(primeira.cultura);
        const anterior = historico.find((h) => h.fazenda === primeira.nome);
        if (anterior) {
          setRecomendacao({
            decisao: anterior.decisao as any,
            cor: anterior.cor,
            motivo: anterior.motivo,
            umidade: anterior.umidade || '--',
            chuva3d: anterior.chuva3d || '--',
            probChuva: anterior.probChuva || '--',
          });
        } else {
          setRecomendacao(null);
        }
        localStorage.setItem(chaveSelecionada, primeira.nome);
      } else {
        setPlantacaoSelecionada('');
        setFarmName('Nenhuma fazenda cadastrada');
        setCulturaAtual('-');
        setRecomendacao(null);
        localStorage.removeItem(chaveSelecionada);
      }
    }

    try {
      const saved = localStorage.getItem('agrosat_novo_produtor');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.nomeFazenda === nome) {
          localStorage.removeItem('agrosat_novo_produtor');
        }
      }
    } catch {
      // ignore
    }

    setSalvandoFeedback(`Plantação "${nome}" excluída com sucesso! Espaço liberado no seu plano.`);
    setTimeout(() => setSalvandoFeedback(null), 3500);
  };

  const handleTrocarFazenda = (nomeEscolhido: string) => {
    setPlantacaoSelecionada(nomeEscolhido);
    const alvo = plantacoes.find((p) => p.nome === nomeEscolhido);
    if (alvo) {
      setFarmName(alvo.nome);
      setCulturaAtual(alvo.cultura);
      const chaveSelecionada = getChaveSelecionada();
      localStorage.setItem(chaveSelecionada, alvo.nome);
      const anterior = historico.find((h) => h.fazenda === alvo.nome);
      if (anterior) {
        setRecomendacao({
          decisao: anterior.decisao as any,
          cor: anterior.cor,
          motivo: anterior.motivo,
          umidade: anterior.umidade || '--',
          chuva3d: anterior.chuva3d || '--',
          probChuva: anterior.probChuva || '--',
        });
      } else {
        setRecomendacao(null);
      }
    }
  };

  const handleGerarRecomendacao = () => {
    const alvo = plantacoes.find((p) => p.nome === plantacaoSelecionada) || plantacoes[0];
    if (!alvo) return;

    setGerando(true);
    setTimeout(() => {
      setGerando(false);
      const novaRec = calcularRecomendacao(alvo);
      setRecomendacao(novaRec);
      registrarHistorico(alvo.nome, novaRec);
    }, 400);
  };

  const handleLogout = () => {
    UsuarioService.logout();
    navigate('/login');
  };

  // Cálculo real da Economia da Fazenda com base nas recomendações 'NÃO REGAR'
  const irrigaçõesEvitadas = historico.filter((h) => h.decisao === 'NÃO REGAR').length;
  const aguaPoupadaLitros = irrigaçõesEvitadas * 1700;
  const economiaEstimadaReais = Number(((aguaPoupadaLitros / 1000) * 5.41).toFixed(2));

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
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs text-[#9fb5a6] hover:text-rose-400 transition-colors w-full text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Encerrar sessão</span>
          </button>
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
            <p className="text-[#9fb5a6] text-sm mt-0.5 flex items-center gap-1.5">
              <Sprout className="w-4 h-4 text-[#7cc795]" />
              <strong className="text-white">{farmName}</strong> · Cultura: <span className="text-[#7cc795]">{culturaAtual}</span>
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
              <div className="bg-[#1d3a2a] border border-[#7cc795]/50 text-[#7cc795] text-xs p-3 rounded-lg flex items-center gap-2 animate-in fade-in">
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

            {/* Lista e Gerenciamento de Plantações Ativas */}
            <div className="pt-4 border-t border-[#243a2d] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">
                  Plantações cadastradas ({plantacoes.length}/{limiteFazendas})
                </span>
                <span className="text-[11px] text-[#9fb5a6]">
                  {limiteFazendas - plantacoes.length > 0
                    ? `${limiteFazendas - plantacoes.length} vaga(s) disponível(is)`
                    : 'Limite do plano atingido'}
                </span>
              </div>

              {plantacoes.length === 0 ? (
                <p className="text-xs text-[#9fb5a6] bg-[#0e1712] p-3 rounded-xl border border-[#243a2d]">
                  Nenhuma plantação cadastrada no momento. Adicione sua primeira propriedade no formulário acima.
                </p>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {plantacoes.map((p) => {
                    const isSelected = p.nome === plantacaoSelecionada;
                    return (
                      <div
                        key={p.id}
                        onClick={() => handleTrocarFazenda(p.nome)}
                        className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-[#1a2d23] border-[#7cc795] ring-1 ring-[#7cc795]/30'
                            : 'bg-[#0e1712] border-[#243a2d] hover:border-[#2f4838]'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white truncate">{p.nome}</span>
                            <span className="text-[10px] bg-[#1d3a2a] text-[#7cc795] px-1.5 py-0.5 rounded font-mono">
                              {p.cultura}
                            </span>
                            {isSelected && (
                              <span className="text-[10px] text-[#7cc795] font-semibold">● Ativa</span>
                            )}
                          </div>
                          <span className="text-[11px] text-[#9fb5a6] block mt-0.5">
                            Coord: {p.latitude.toFixed(4)}, {p.longitude.toFixed(4)}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExcluirPlantacao(p.id, p.nome);
                          }}
                          className="p-1.5 text-[#9fb5a6] hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors shrink-0"
                          title={`Excluir ${p.nome}`}
                          aria-label={`Excluir ${p.nome}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
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

            {plantacoes.length === 0 ? (
              <div className="bg-[#0e1712] border border-[#243a2d] rounded-xl p-4 text-center">
                <p className="text-sm text-[#9fb5a6]">
                  Nenhuma plantação ativa. Cadastre uma no Card 01 para calcular a recomendação hídrica.
                </p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2.5">
                <select
                  value={plantacaoSelecionada}
                  onChange={(e) => handleTrocarFazenda(e.target.value)}
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
                  {gerando ? 'Calculando...' : 'Recalcular'}
                </button>
              </div>
            )}

            {/* Decisão em destaque com transição suave */}
            {!recomendacao ? (
              <div className="bg-[#0e1712] border border-[#243a2d] rounded-xl p-6 text-center space-y-2">
                <p className="text-sm font-medium text-[#9fb5a6]">
                  Nenhuma recomendação calculada para esta fazenda ainda.
                </p>
                <p className="text-xs text-[#9fb5a6]/70">
                  Clique no botão <strong className="text-white">"Recalcular"</strong> acima para consultar o balanço hídrico e satélite.
                </p>
              </div>
            ) : (
              <>
                <div className="pt-2">
                  <div className="flex items-center justify-between">
                    <span 
                      className="font-heading text-4xl sm:text-5xl font-bold tracking-tight block transition-colors duration-300"
                      style={{ color: recomendacao.cor }}
                    >
                      {recomendacao.decisao}
                    </span>
                    <span className="text-xs text-[#9fb5a6] bg-[#0e1712] px-2.5 py-1 rounded-md border border-[#243a2d]">
                      Fazenda: <strong className="text-white">{plantacaoSelecionada || 'Nenhuma'}</strong>
                    </span>
                  </div>
                  <p className="text-sm text-[#e6efe8] mt-2 leading-relaxed">
                    {recomendacao.motivo}
                  </p>
                </div>

                {/* Três Métricas Resumidas da Fazenda Ativa */}
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
              </>
            )}
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

            {historico.length === 0 ? (
              <div className="bg-[#0e1712] border border-[#243a2d] rounded-xl p-6 text-center space-y-2">
                <p className="text-sm text-[#9fb5a6]">Nenhuma recomendação registrada ainda.</p>
                <p className="text-xs text-[#9fb5a6]/70">
                  Ao cadastrar uma nova fazenda ou clicar em "Recalcular", as recomendações geradas aparecerão aqui.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="text-[#9fb5a6] border-b border-[#243a2d]">
                      <th className="py-2.5 font-medium">Quando</th>
                      <th className="py-2.5 px-2 font-medium">Fazenda</th>
                      <th className="py-2.5 px-2 font-medium">Decisão</th>
                      <th className="py-2.5 font-medium">Motivo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#243a2d]">
                    {historico.map((h) => (
                      <tr key={h.id} className="hover:bg-[#1a2d23] transition-colors">
                        <td className="py-3 text-[#9fb5a6] whitespace-nowrap">{h.quando}</td>
                        <td className="py-3 px-2 font-semibold text-white whitespace-nowrap">{h.fazenda}</td>
                        <td className="py-3 px-2 font-bold whitespace-nowrap" style={{ color: h.cor }}>
                          {h.decisao}
                        </td>
                        <td className="py-3 text-[#e6efe8]">{h.motivo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
                <span className="font-heading text-2xl font-bold text-white block">
                  {irrigaçõesEvitadas}
                </span>
                <span className="text-[11px] text-[#9fb5a6]">Irrigações evitadas</span>
              </div>
              <div className="bg-[#0e1712] border border-[#243a2d] rounded-xl p-3">
                <span className="font-heading text-2xl font-bold text-white block">
                  {aguaPoupadaLitros.toLocaleString('pt-BR')} L
                </span>
                <span className="text-[11px] text-[#9fb5a6]">Água poupada</span>
              </div>
              <div className="bg-[#0e1712] border border-[#243a2d] rounded-xl p-3">
                <span className="font-heading text-2xl font-bold text-[#7cc795] block">
                  R$ {economiaEstimadaReais.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-[11px] text-[#9fb5a6]">Economia estimada</span>
              </div>
            </div>

            {/* Gráfico de barras semanais */}
            <div className="pt-2">
              <div className="flex items-end gap-3.5 h-28 pt-2">
                <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div 
                    className="w-full bg-[#6fa8e8] rounded-t-md transition-all duration-300" 
                    style={{ height: `${Math.min(100, Math.max(10, Math.round((aguaPoupadaLitros * 0.15) / 50)))}%` }} 
                    title={`Semana 1: ${Math.round(aguaPoupadaLitros * 0.15)}L`}
                  ></div>
                  <span className="text-[10px] text-[#9fb5a6]">Sem 1</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div 
                    className="w-full bg-[#6fa8e8] rounded-t-md transition-all duration-300" 
                    style={{ height: `${Math.min(100, Math.max(10, Math.round((aguaPoupadaLitros * 0.25) / 50)))}%` }} 
                    title={`Semana 2: ${Math.round(aguaPoupadaLitros * 0.25)}L`}
                  ></div>
                  <span className="text-[10px] text-[#9fb5a6]">Sem 2</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div 
                    className="w-full bg-[#6fa8e8] rounded-t-md transition-all duration-300" 
                    style={{ height: `${Math.min(100, Math.max(10, Math.round((aguaPoupadaLitros * 0.20) / 50)))}%` }} 
                    title={`Semana 3: ${Math.round(aguaPoupadaLitros * 0.20)}L`}
                  ></div>
                  <span className="text-[10px] text-[#9fb5a6]">Sem 3</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div 
                    className="w-full bg-[#7cc795] rounded-t-md transition-all duration-300" 
                    style={{ height: `${Math.min(100, Math.max(15, Math.round((aguaPoupadaLitros * 0.40) / 50)))}%` }} 
                    title={`Semana 4: ${Math.round(aguaPoupadaLitros * 0.40)}L`}
                  ></div>
                  <span className="text-[10px] text-[#7cc795] font-semibold">Sem 4</span>
                </div>
              </div>
              <p className="text-[11px] text-[#9fb5a6] mt-3">
                Litros poupados calculados com base nas recomendações "NÃO REGAR" ativas no sistema.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PainelUsuario;
