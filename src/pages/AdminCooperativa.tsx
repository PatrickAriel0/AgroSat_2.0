import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Satellite, 
  ArrowLeft, 
  Download,
  RefreshCw,
  Sprout,
  CheckCircle2
} from 'lucide-react';
import { FazendaService } from '../services/api';
import { calcularRecomendacao } from '../utils/recomendacao';
import { Fazenda } from '../types';

interface FazendaCooperadaView {
  id: string | number;
  nome: string;
  municipio: string;
  uf: string;
  cultura: string;
  situacao: string;
  cor: string;
  umidade: string;
  chuva: string;
}

export const AdminCooperativa: React.FC = () => {
  const [fazendas, setFazendas] = useState<FazendaCooperadaView[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [feedbackExportacao, setFeedbackExportacao] = useState(false);

  const carregarDados = async () => {
    setCarregando(true);
    try {
      const listaApi: Fazenda[] = await FazendaService.listar();
      
      const formatadas: FazendaCooperadaView[] = listaApi.map((f) => {
        const cultura = (f.talhoes && f.talhoes.length > 0 && f.talhoes[0].cultura)
          ? f.talhoes[0].cultura
          : 'Soja';

        const lat = typeof f.latitude === 'number' ? f.latitude : -21.178;
        const lng = typeof f.longitude === 'number' ? f.longitude : -47.811;

        const rec = calcularRecomendacao({
          id: String(f.id),
          nome: f.nome,
          cultura,
          latitude: lat,
          longitude: lng,
        });

        let situacaoTexto = 'Não regar';
        if (rec.decisao === 'REGAR') situacaoTexto = 'Regar hoje';
        else if (rec.decisao === 'ATENÇÃO') situacaoTexto = 'Atenção';

        return {
          id: f.id,
          nome: f.nome,
          municipio: f.municipio || 'Interior',
          uf: f.uf || 'BR',
          cultura,
          situacao: situacaoTexto,
          cor: rec.cor,
          umidade: rec.umidade,
          chuva: rec.chuva3d,
        };
      });

      setFazendas(formatadas);
    } catch {
      // ignore
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // Cálculos dinâmicos somando as fazendas reais da API Java
  const totalFazendas = fazendas.length;
  const naoRegarCount = fazendas.filter((f) => f.situacao === 'Não regar').length;
  const regarCount = fazendas.filter((f) => f.situacao === 'Regar hoje').length;
  const atencaoCount = fazendas.filter((f) => f.situacao === 'Atenção').length;

  const irrigacoesEvitadas = naoRegarCount * 12;
  const aguaPoupadaLitros = naoRegarCount * 22750;
  const alertasSeca = regarCount + atencaoCount;

  const ods2Percent = Math.min(95, Math.max(40, Math.round((naoRegarCount / (totalFazendas || 1)) * 85 + 15)));
  const ods13Percent = Math.min(90, Math.max(35, Math.round((irrigacoesEvitadas / ((totalFazendas || 1) * 12)) * 70 + 20)));

  const metricas = [
    { valor: totalFazendas.toString(), rotulo: 'Fazendas ativas', destaque: false },
    { valor: `${aguaPoupadaLitros.toLocaleString('pt-BR')} L`, rotulo: 'Água poupada no mês', destaque: true },
    { valor: irrigacoesEvitadas.toString(), rotulo: 'Irrigações evitadas', destaque: false },
    { valor: alertasSeca.toString(), rotulo: 'Alertas de manejo', destaque: false },
  ];

  const handleExportarCsv = () => {
    if (fazendas.length === 0) return;

    const cabecalho = 'ID;Fazenda;Municipio;UF;Cultura;Situacao_Hoje;Umidade_Solo;Previsao_Chuva_3d\n';
    const linhas = fazendas.map((f) => 
      `${f.id};"${f.nome}";"${f.municipio}";"${f.uf}";"${f.cultura}";"${f.situacao}";"${f.umidade}";"${f.chuva}"`
    ).join('\n');

    const conteudoCompleto = '\uFEFF' + cabecalho + linhas;
    const blob = new Blob([conteudoCompleto], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_cooperativa_agrosat_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setFeedbackExportacao(true);
    setTimeout(() => setFeedbackExportacao(false), 3500);
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
          <span className="text-[#9fb5a6] text-sm hidden sm:inline-block">Administrador · Cooperativa Vale Verde</span>
          <span className="hidden sm:inline-block bg-[#1d3a2a] text-[#7cc795] text-xs font-semibold px-2.5 py-1 rounded">
            Admin
          </span>
          <Link
            to="/painel-usuario"
            className="text-xs bg-[#1d3a2a] text-[#7cc795] px-3.5 py-2 rounded-lg border border-[#7cc795]/30 hover:bg-[#254d37] transition-colors font-semibold"
          >
            Visão Geral
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 space-y-8">
        {feedbackExportacao && (
          <div className="bg-[#1d3a2a] border border-[#7cc795] text-[#7cc795] p-3.5 rounded-xl flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="text-xs font-medium">
              Relatório CSV gerado e exportado com sucesso contendo as {totalFazendas} fazendas da cooperativa!
            </span>
          </div>
        )}

        {/* Título e Ações */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white">
              Visão da cooperativa
            </h1>
            <p className="text-[#9fb5a6] text-sm mt-1">
              Monitoramento agronômico centralizado integrado com a API Java e metas ESG / ODS.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={carregarDados}
              disabled={carregando}
              className="h-10 px-3.5 rounded-xl border border-[#2f4838] bg-[#14211a] text-xs text-[#e6efe8] hover:bg-[#1d3a2a] flex items-center gap-2 transition-colors disabled:opacity-50"
              title="Atualizar dados da API"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#7cc795] ${carregando ? 'animate-spin' : ''}`} />
              <span>{carregando ? 'Atualizando...' : 'Sincronizar'}</span>
            </button>
            <button
              type="button"
              onClick={handleExportarCsv}
              className="h-10 px-4 rounded-xl border border-[#2f4838] bg-[#14211a] text-xs text-[#e6efe8] hover:bg-[#1d3a2a] flex items-center gap-2 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#7cc795]" />
              <span>Exportar Relatório CSV</span>
            </button>
          </div>
        </div>

        {/* 4 Cards de Métricas da Cooperativa */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {metricas.map((m, idx) => (
            <div
              key={idx}
              className="bg-[#14211a] border border-[#243a2d] rounded-2xl p-5 sm:p-6"
            >
              <b className={`font-heading text-3xl sm:text-4xl font-bold block mb-1 ${m.destaque ? 'text-[#7cc795]' : 'text-white'}`}>
                {m.valor}
              </b>
              <span className="text-xs sm:text-sm text-[#9fb5a6]">{m.rotulo}</span>
            </div>
          ))}
        </div>

        {/* Grid: Tabela de Fazendas & Impacto ODS */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6 lg:gap-8 items-start">
          {/* Tabela de Fazendas Cooperadas */}
          <div className="bg-[#14211a] border border-[#243a2d] rounded-2xl p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-[#7cc795]" />
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">Fazendas cooperadas</h2>
              </div>
              <span className="text-xs text-[#9fb5a6]">
                {totalFazendas} propriedades integradas na API REST
              </span>
            </div>

            {carregando ? (
              <div className="py-12 text-center text-xs text-[#9fb5a6] flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-[#7cc795]" />
                <span>Carregando fazendas da API Java...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="text-[#9fb5a6] border-b border-[#243a2d] text-xs">
                      <th className="py-2.5 font-medium">Fazenda / Localização</th>
                      <th className="py-2.5 px-3 font-medium">Cultura</th>
                      <th className="py-2.5 px-2 font-medium">Umidade</th>
                      <th className="py-2.5 font-medium">Situação hoje</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#243a2d]">
                    {fazendas.map((f) => (
                      <tr key={f.id} className="hover:bg-[#1a2d23] transition-colors text-xs">
                        <td className="py-3.5 font-medium text-white">
                          <div>{f.nome}</div>
                          <span className="text-[11px] text-[#9fb5a6] font-normal">
                            {f.municipio} - {f.uf}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-[#9fb5a6] font-mono">{f.cultura}</td>
                        <td className="py-3.5 px-2 text-[#9fb5a6]">{f.umidade}</td>
                        <td
                          className="py-3.5 font-semibold"
                          style={{ color: f.cor }}
                        >
                          {f.situacao}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="pt-2">
              <Link
                to="/mapa-plantacoes"
                className="text-xs text-[#7cc795] hover:underline"
              >
                → Visualizar todas as fazendas distribuídas no mapa geográfico
              </Link>
            </div>
          </div>

          {/* Impacto nos ODS */}
          <div className="bg-[#14211a] border border-[#243a2d] rounded-2xl p-6 sm:p-7 space-y-6">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">
              Impacto nos ODS
            </h2>

            <div className="space-y-5">
              {/* ODS 2 */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <b className="text-white">ODS 2 · Fome zero e agricultura sustentável</b>
                  <span className="text-[#7cc795] font-mono font-bold">{ods2Percent}%</span>
                </div>
                <div className="bg-[#0e1712] h-3 rounded-full overflow-hidden border border-[#243a2d]">
                  <div
                    className="bg-[#7cc795] h-full rounded-full transition-all duration-500"
                    style={{ width: `${ods2Percent}%` }}
                  />
                </div>
                <span className="text-[11px] text-[#9fb5a6] block">
                  Eficiência no uso de insumos e segurança da colheita com telemetria via satélite.
                </span>
              </div>

              {/* ODS 13 */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <b className="text-white">ODS 13 · Ação contra a mudança do clima</b>
                  <span className="text-[#6fa8e8] font-mono font-bold">{ods13Percent}%</span>
                </div>
                <div className="bg-[#0e1712] h-3 rounded-full overflow-hidden border border-[#243a2d]">
                  <div
                    className="bg-[#6fa8e8] h-full rounded-full transition-all duration-500"
                    style={{ width: `${ods13Percent}%` }}
                  />
                </div>
                <span className="text-[11px] text-[#9fb5a6] block">
                  Redução da pegada hídrica e emissões energéticas de bombeamento elétrico/diesel.
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#243a2d]">
              <span className="text-xs text-[#9fb5a6]">
                Progresso em relação à meta contratual calculada pelas {totalFazendas} fazendas da Cooperativa Vale Verde.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCooperativa;
