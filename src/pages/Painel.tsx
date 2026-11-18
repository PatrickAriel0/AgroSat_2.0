import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  ArrowRight, 
  Map as MapIcon, 
  TrendingUp, 
  Droplet,
  ShieldCheck,
  UserPlus,
  LogIn,
  Sliders
} from 'lucide-react';
import { DecisionEngine } from '../components/DecisionEngine';

export const Painel: React.FC = () => {
  const [mostrarSimulador, setMostrarSimulador] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Banner Principal de Apresentação / Modo Demonstração */}
      <div className="bg-[#14211a] border border-[#243a2d] rounded-2xl p-6 sm:p-10 relative overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1d3a2a] text-[#7cc795] text-xs font-mono font-semibold border border-[#7cc795]/40">
            <Sprout className="w-4 h-4" />
            Modo Demonstração · Como Funciona o AgroSat
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold font-heading text-white tracking-tight">
            Painel do produtor rural
          </h1>

          <p className="text-sm sm:text-base text-[#9fb5a6] leading-relaxed">
            Esta página apresenta uma <strong>visão demonstrativa</strong> dos 4 módulos que o produtor
            rural utiliza no dia a dia. Ao criar sua conta, você terá acesso ao painel interativo
            para cadastrar suas propriedades, acompanhar o balanço hídrico FAO-56 em tempo real e
            mensurar a economia de água da sua lavoura.
          </p>

          {/* Chamadas de Ação para Cadastro e Login */}
          <div className="pt-2 flex flex-wrap items-center gap-3.5">
            <Link
              to="/cadastro"
              className="bg-brand-primary hover:bg-brand-primary-hover text-black font-semibold text-sm px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-[0_2px_15px_rgba(74,222,128,0.3)] hover:scale-[1.02]"
            >
              <UserPlus className="w-4 h-4" />
              <span>Criar minha conta e começar</span>
            </Link>

            <Link
              to="/login"
              className="border border-[#2f4838] bg-[#0e1712] hover:bg-[#1a2d23] text-white font-medium text-sm px-5 py-3 rounded-xl transition-colors flex items-center gap-2"
            >
              <LogIn className="w-4 h-4 text-[#7cc795]" />
              <span>Já tenho conta (Entrar)</span>
            </Link>

            <Link
              to="/planos"
              className="text-xs text-[#7cc795] hover:underline px-2 py-3"
            >
              Conhecer planos (1, 3 ou 10 fazendas) →
            </Link>
          </div>
        </div>

        {/* Links Rápidos dos Módulos */}
        <div className="mt-8 pt-6 border-t border-[#243a2d] flex flex-wrap items-center gap-3 text-xs">
          <span className="text-[#9fb5a6] font-medium">Recursos disponíveis:</span>
          <Link
            to="/recomendacao-hoje"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e1712] border border-[#243a2d] text-[#e6efe8] hover:text-[#7cc795] hover:border-[#7cc795] transition-colors"
          >
            <Droplet className="w-3.5 h-3.5 text-[#7cc795]" />
            <span>Recomendação de hoje (FAO-56)</span>
          </Link>
          <Link
            to="/mapa-plantacoes"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e1712] border border-[#243a2d] text-[#e6efe8] hover:text-[#7cc795] hover:border-[#7cc795] transition-colors"
          >
            <MapIcon className="w-3.5 h-3.5 text-[#6fa8e8]" />
            <span>Mapa de plantações (MapLibre GL)</span>
          </Link>
          <Link
            to="/admin-cooperativa"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e1712] border border-[#243a2d] text-[#e6efe8] hover:text-[#7cc795] hover:border-[#7cc795] transition-colors"
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Visão da cooperativa (ODS 2 & 13)</span>
          </Link>
        </div>
      </div>

      {/* Grid com a Demonstração dos 4 Módulos do Usuário */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#243a2d] pb-4">
          <div>
            <h2 className="text-2xl font-bold font-heading text-white">
              Demonstração dos 4 Módulos do Sistema
            </h2>
            <p className="text-xs sm:text-sm text-[#9fb5a6]">
              Abaixo está a visualização prévia da rotina diária que o agricultor gerencia.
            </p>
          </div>
          <span className="text-xs bg-[#1d3a2a] text-[#7cc795] px-3 py-1 rounded-md border border-[#7cc795]/30 self-start sm:self-auto">
            Visualização de Exemplo
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* Card 01 - Nova plantação (Demonstração) */}
          <div className="bg-[#14211a] border border-[#243a2d] rounded-2xl p-6 sm:p-7 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="bg-[#1d3a2a] text-[#7cc795] rounded-lg px-2.5 py-1 text-xs font-bold font-mono">
                  01
                </span>
                <h3 className="font-heading text-xl font-bold text-white">Nova plantação</h3>
              </div>
              <span className="text-[11px] text-[#9fb5a6] font-mono">Cadastro de Área</span>
            </div>

            <p className="text-xs text-[#9fb5a6]">
              O produtor cadastra sua área definindo a cultura e as coordenadas geográficas capturadas no mapa:
            </p>

            <div className="space-y-3.5 bg-[#0e1712] p-4 rounded-xl border border-[#243a2d] text-sm">
              <div>
                <span className="text-xs text-[#9fb5a6] block">Nome da plantação</span>
                <b className="text-white">Talhão Norte — Fazenda Feliz</b>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[#243a2d]/60">
                <div>
                  <span className="text-xs text-[#9fb5a6] block">Cultura</span>
                  <b className="text-[#7cc795]">Soja</b>
                </div>
                <div>
                  <span className="text-xs text-[#9fb5a6] block">Latitude</span>
                  <span className="text-white font-mono text-xs">-23.5349</span>
                </div>
                <div>
                  <span className="text-xs text-[#9fb5a6] block">Longitude</span>
                  <span className="text-white font-mono text-xs">-46.6212</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#1d3a2a]/40 border border-[#7cc795]/30 rounded-xl text-xs text-[#9fb5a6] flex items-center justify-between">
              <span>Faça seu cadastro para adicionar sua própria fazenda:</span>
              <Link to="/cadastro" className="text-[#7cc795] font-semibold hover:underline">
                Cadastrar agora →
              </Link>
            </div>
          </div>

          {/* Card 02 - Recomendação */}
          <div className="bg-[#14211a] border border-[#243a2d] rounded-2xl p-6 sm:p-7 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="bg-[#1d3a2a] text-[#7cc795] rounded-lg px-2.5 py-1 text-xs font-bold font-mono">
                  02
                </span>
                <h3 className="font-heading text-xl font-bold text-white">Recomendação</h3>
              </div>
              <Link
                to="/recomendacao-hoje"
                className="text-xs text-[#7cc795] hover:underline flex items-center gap-1"
              >
                <span>Ver balanço completo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="pt-1">
              <span className="font-heading text-4xl sm:text-5xl font-bold tracking-tight text-[#7cc795] block">
                NÃO REGAR
              </span>
              <p className="text-sm text-[#e6efe8] mt-2 leading-relaxed">
                O solo está bem abastecido (100% da água disponível) e há chuva prevista de 14,5 mm em 3 dias. Regar agora desperdiçaria água.
              </p>
            </div>

            {/* Três métricas de suporte */}
            <div className="grid grid-cols-3 gap-2.5 pt-2">
              <div className="bg-[#0e1712] border border-[#243a2d] rounded-xl p-3">
                <span className="font-heading text-lg sm:text-xl font-bold text-white block">
                  29,3%
                </span>
                <span className="text-[11px] text-[#9fb5a6]">Umidade do solo</span>
              </div>
              <div className="bg-[#0e1712] border border-[#243a2d] rounded-xl p-3">
                <span className="font-heading text-lg sm:text-xl font-bold text-white block">
                  14,5 mm
                </span>
                <span className="text-[11px] text-[#9fb5a6]">Chuva em 3 dias</span>
              </div>
              <div className="bg-[#0e1712] border border-[#243a2d] rounded-xl p-3">
                <span className="font-heading text-lg sm:text-xl font-bold text-white block">
                  97%
                </span>
                <span className="text-[11px] text-[#9fb5a6]">Prob. máxima</span>
              </div>
            </div>
          </div>

          {/* Card 03 - Histórico de recomendações */}
          <div className="bg-[#14211a] border border-[#243a2d] rounded-2xl p-6 sm:p-7 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="bg-[#1d3a2a] text-[#7cc795] rounded-lg px-2.5 py-1 text-xs font-bold font-mono">
                  03
                </span>
                <h3 className="font-heading text-xl font-bold text-white">
                  Histórico de recomendações
                </h3>
              </div>
              <span className="text-[11px] text-[#9fb5a6]">Auditoria contínua</span>
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

          {/* Card 04 - Economia da fazenda */}
          <div className="bg-[#14211a] border border-[#243a2d] rounded-2xl p-6 sm:p-7 space-y-4 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="bg-[#1d3a2a] text-[#7cc795] rounded-lg px-2.5 py-1 text-xs font-bold font-mono">
                  04
                </span>
                <h3 className="font-heading text-xl font-bold text-white">Economia da fazenda</h3>
              </div>
              <span className="text-[11px] text-[#7cc795]">Relatório Semanal</span>
            </div>

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

            <div className="pt-2">
              <div className="flex items-end gap-3.5 h-28 pt-2">
                <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div className="w-full bg-[#6fa8e8] rounded-t-md" style={{ height: '30%' }} title="Semana 1: 800L"></div>
                  <span className="text-[10px] text-[#9fb5a6]">Sem 1</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div className="w-full bg-[#6fa8e8] rounded-t-md" style={{ height: '55%' }} title="Semana 2: 1.400L"></div>
                  <span className="text-[10px] text-[#9fb5a6]">Sem 2</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div className="w-full bg-[#6fa8e8] rounded-t-md" style={{ height: '40%' }} title="Semana 3: 1.050L"></div>
                  <span className="text-[10px] text-[#9fb5a6]">Sem 3</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div className="w-full bg-[#7cc795] rounded-t-md" style={{ height: '90%' }} title="Semana 4: 2.350L"></div>
                  <span className="text-[10px] text-[#7cc795] font-semibold">Sem 4</span>
                </div>
              </div>
              <p className="text-[11px] text-[#9fb5a6] mt-3">
                Litros poupados por semana · dados reais medidos pelo sensor virtual e Open-Meteo
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Seção Explicativa dos Planos */}
      <div className="bg-[#0b180d] border border-brand-border rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-[#7cc795] text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Capacidade por Plano de Assinatura</span>
            </div>
            <h3 className="font-heading text-2xl font-bold text-white">
              Pronto para colocar sua lavoura no AgroSat?
            </h3>
            <p className="text-xs sm:text-sm text-[#9fb5a6] leading-relaxed">
              No <strong>Teste Grátis</strong> você adiciona 1 fazenda com todas as recomendações liberadas por 7 dias. No <strong>Plano Mensal (R$ 49,90)</strong> você cadastra até 3 fazendas simultâneas, e no <strong>Plano Anual (R$ 590)</strong> gerencia até 10 fazendas com desconto exclusivo.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/cadastro"
              className="bg-brand-primary hover:bg-brand-primary-hover text-black font-semibold text-sm px-6 py-3 rounded-full transition-all shadow-[0_2px_12px_rgba(74,222,128,0.25)]"
            >
              Começar Teste Grátis (1 Fazenda)
            </Link>
            <Link
              to="/planos"
              className="border border-[#2f4838] hover:border-[#7cc795] text-white text-sm px-5 py-3 rounded-full transition-colors"
            >
              Comparar Planos
            </Link>
          </div>
        </div>
      </div>

      {/* Seção Opcional: Simulador Decision Engine */}
      <div className="pt-2 text-center">
        <button
          onClick={() => setMostrarSimulador(!mostrarSimulador)}
          className="inline-flex items-center gap-2 text-xs text-[#9fb5a6] hover:text-[#7cc795] py-2 px-4 rounded-lg bg-[#14211a] border border-[#243a2d] transition-colors"
        >
          <Sliders className="w-3.5 h-3.5 text-[#7cc795]" />
          <span>{mostrarSimulador ? 'Ocultar simulador de sliders' : 'Abrir simulador interativo de sliders (Decision Engine)'}</span>
        </button>

        {mostrarSimulador && (
          <div className="mt-6 text-left max-w-2xl mx-auto bg-[#0b180d] border border-brand-border rounded-2xl p-6 sm:p-8 animate-in fade-in duration-300">
            <h3 className="font-heading text-xl font-bold text-white mb-2">
              Simulador do Motor de Decisão AgroSat
            </h3>
            <p className="text-xs text-[#9fb5a6] mb-6">
              Mova os controles deslizantes para simular como o algoritmo responde a diferentes cenários de umidade e precipitação.
            </p>
            <DecisionEngine />
          </div>
        )}
      </div>
    </div>
  );
};

export default Painel;
