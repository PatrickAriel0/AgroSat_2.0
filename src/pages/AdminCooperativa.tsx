import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Satellite, 
  ArrowLeft, 
  Download 
} from 'lucide-react';

export const AdminCooperativa: React.FC = () => {
  const metricas = [
    { valor: '24', rotulo: 'Fazendas ativas', destaque: false },
    { valor: '182.000 L', rotulo: 'Água poupada no mês', destaque: true },
    { valor: '96', rotulo: 'Irrigações evitadas', destaque: false },
    { valor: '3', rotulo: 'Alertas de seca', destaque: false },
  ];

  const fazendas = [
    { nome: 'Fazenda Feliz', cultura: 'Soja', situacao: 'Não regar', cor: '#7cc795' },
    { nome: 'Sítio Boa Vista', cultura: 'Milho', situacao: 'Regar hoje', cor: '#6fa8e8' },
    { nome: 'Fazenda Triste', cultura: 'Café', situacao: 'Regar hoje', cor: '#6fa8e8' },
    { nome: 'Token Fortnite', cultura: 'Soja', situacao: 'Atenção', cor: '#e0b04a' },
  ];

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
        {/* Título e Ações */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white">
              Visão da cooperativa
            </h1>
            <p className="text-[#9fb5a6] text-sm mt-1">
              Monitoramento agronômico centralizado, otimização de recursos hídricos e metas ESG / ODS.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              className="h-10 px-4 rounded-xl border border-[#2f4838] bg-[#14211a] text-xs text-[#e6efe8] hover:bg-[#1d3a2a] flex items-center gap-2"
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
              <b className="font-heading text-3xl sm:text-4xl font-bold text-white block mb-1">
                {m.valor}
              </b>
              <span className="text-xs sm:text-sm text-[#9fb5a6]">{m.rotulo}</span>
            </div>
          ))}
        </div>

        {/* Grid: Tabela de Fazendas & Impacto ODS */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 lg:gap-8 items-start">
          {/* Tabela de Fazendas Cooperadas */}
          <div className="bg-[#14211a] border border-[#243a2d] rounded-2xl p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">Fazendas</h2>
              <span className="text-xs text-[#9fb5a6]">Total: 4 listadas de 24</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="text-[#9fb5a6] border-b border-[#243a2d]">
                    <th className="py-2.5 font-medium">Fazenda</th>
                    <th className="py-2.5 px-3 font-medium">Cultura</th>
                    <th className="py-2.5 font-medium">Situação hoje</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#243a2d]">
                  {fazendas.map((f, i) => (
                    <tr key={i} className="hover:bg-[#1a2d23] transition-colors">
                      <td className="py-3.5 font-medium text-white">{f.nome}</td>
                      <td className="py-3.5 px-3 text-[#9fb5a6]">{f.cultura}</td>
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
                  <span className="text-[#7cc795] font-mono font-bold">62%</span>
                </div>
                <div className="bg-[#0e1712] h-3 rounded-full overflow-hidden border border-[#243a2d]">
                  <div
                    className="bg-[#7cc795] h-full rounded-full transition-all duration-500"
                    style={{ width: '62%' }}
                  />
                </div>
                <span className="text-[11px] text-[#9fb5a6] block">
                  Eficiência no uso de insumos e segurança da colheita familiar.
                </span>
              </div>

              {/* ODS 13 */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <b className="text-white">ODS 13 · Ação contra a mudança do clima</b>
                  <span className="text-[#6fa8e8] font-mono font-bold">45%</span>
                </div>
                <div className="bg-[#0e1712] h-3 rounded-full overflow-hidden border border-[#243a2d]">
                  <div
                    className="bg-[#6fa8e8] h-full rounded-full transition-all duration-500"
                    style={{ width: '45%' }}
                  />
                </div>
                <span className="text-[11px] text-[#9fb5a6] block">
                  Redução da pegada hídrica e emissões energéticas de bombeamento elétrico/diesel.
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#243a2d]">
              <span className="text-xs text-[#9fb5a6]">
                Progresso em relação à meta contratual do mês da Cooperativa Vale Verde.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCooperativa;
