import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SeletorFazenda from '../components/SeletorFazenda';
import CartaoSolo from '../components/CartaoSolo';
import { PontoMapa } from '../types/localizacao';
import { ArrowRight, Satellite } from 'lucide-react';

export const Cadastro: React.FC = () => {
  const navigate = useNavigate();

  // Dados do produtor
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nomeFazenda, setNomeFazenda] = useState('');
  const [plantio, setPlantio] = useState('Soja');

  // Ponto no mapa (default centro São Paulo / Campinas)
  const [ponto, setPonto] = useState<PontoMapa | null>({
    latitude: -23.53492,
    longitude: -46.6212,
  });

  const [erro, setErro] = useState<string | null>(null);

  const handleContinuar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !email.trim() || !senha.trim() || !nomeFazenda.trim()) {
      setErro('Por favor, preencha todos os campos obrigatórios.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (senha.length < 8) {
      setErro('A senha deve ter pelo menos 8 caracteres.');
      return;
    }

    // Salva temporariamente para o próximo passo
    localStorage.setItem(
      'agrosat_novo_produtor',
      JSON.stringify({
        nome,
        email,
        nomeFazenda,
        plantio,
        latitude: ponto?.latitude ?? -23.53492,
        longitude: ponto?.longitude ?? -46.6212,
      })
    );

    navigate('/planos');
  };

  return (
    <div className="min-h-screen bg-[#0e1712] text-[#e6efe8] pb-16">
      {/* Header do Wizard */}
      <div className="h-18 px-6 sm:px-12 lg:px-16 border-b border-[#243a2d] bg-[#0a120d] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-950 border border-brand-primary/40 flex items-center justify-center text-brand-primary">
            <Satellite className="w-4 h-4" />
          </div>
          <span className="font-heading text-2xl font-bold tracking-wider text-white">
            Agro<span className="text-brand-primary">Sat</span>
          </span>
        </Link>
        <div className="flex items-center gap-2 text-xs font-mono text-[#9fb5a6]">
          <span className="bg-[#1d3a2a] text-[#7cc795] px-2.5 py-1 rounded-md font-bold">
            Passo 1 de 3
          </span>
          <span>Cadastro de Produtor</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {erro && (
          <div className="mb-6 p-4 bg-red-950/70 border border-red-500/50 rounded-xl text-red-200 text-sm">
            {erro}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Coluna Esquerda: Formulário de Cadastro */}
          <div className="lg:col-span-5 bg-[#14211a] border border-[#243a2d] rounded-2xl p-6 sm:p-8 space-y-5">
            <h1 className="font-heading text-3xl font-bold text-white">
              Criar conta de produtor
            </h1>
            <p className="text-xs text-[#9fb5a6] leading-relaxed">
              Cadastre suas informações básicas e vincule sua propriedade ao sistema de irrigação inteligente.
            </p>

            <form onSubmit={handleContinuar} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#9fb5a6] mb-1.5" htmlFor="cad-nome">
                  Nome
                </label>
                <input
                  id="cad-nome"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome completo"
                  className="w-full h-12 bg-[#0e1712] border border-[#2f4838] rounded-xl px-4 text-white placeholder-neutral-600 focus:outline-none focus:border-brand-primary text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9fb5a6] mb-1.5" htmlFor="cad-email">
                  E-mail (Gmail)
                </label>
                <input
                  id="cad-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@gmail.com"
                  className="w-full h-12 bg-[#0e1712] border border-[#2f4838] rounded-xl px-4 text-white placeholder-neutral-600 focus:outline-none focus:border-brand-primary text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9fb5a6] mb-1.5" htmlFor="cad-senha">
                  Senha
                </label>
                <input
                  id="cad-senha"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full h-12 bg-[#0e1712] border border-[#2f4838] rounded-xl px-4 text-white placeholder-neutral-600 focus:outline-none focus:border-brand-primary text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9fb5a6] mb-1.5" htmlFor="cad-fazenda">
                  Nome da fazenda
                </label>
                <input
                  id="cad-fazenda"
                  type="text"
                  value={nomeFazenda}
                  onChange={(e) => setNomeFazenda(e.target.value)}
                  placeholder="Ex.: Sítio Boa Vista"
                  className="w-full h-12 bg-[#0e1712] border border-[#2f4838] rounded-xl px-4 text-white placeholder-neutral-600 focus:outline-none focus:border-brand-primary text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9fb5a6] mb-1.5" htmlFor="cad-plantio">
                  Qual plantio?
                </label>
                <select
                  id="cad-plantio"
                  value={plantio}
                  onChange={(e) => setPlantio(e.target.value)}
                  className="w-full h-12 bg-[#0e1712] border border-[#2f4838] rounded-xl px-4 text-white focus:outline-none focus:border-brand-primary text-sm"
                >
                  <option value="Soja">Soja</option>
                  <option value="Milho">Milho</option>
                  <option value="Café">Café</option>
                  <option value="Cana-de-açúcar">Cana-de-açúcar</option>
                  <option value="Hortaliças">Hortaliças</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-12 bg-[#eef3ee] hover:bg-white text-[#0e1712] font-semibold text-base rounded-xl transition-all shadow-[0_2px_12px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2"
                >
                  Continuar para os planos <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center pt-2">
                <span className="text-xs text-[#9fb5a6]">Já tem uma conta? </span>
                <Link to="/login" className="text-xs text-[#7cc795] hover:underline font-semibold">
                  Fazer login
                </Link>
              </div>
            </form>
          </div>

          {/* Coluna Direita: Onde fica a sua fazenda? (MAPA + SOLO) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#14211a] border border-[#243a2d] rounded-2xl p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-1">
                  Onde fica a sua fazenda?
                </h2>
                <p className="text-xs sm:text-sm text-[#9fb5a6] leading-relaxed">
                  Clique ou toque no mapa para marcar o local. Se preferir, busque pela cidade ou use a localização do seu aparelho.
                </p>
              </div>

              {/* Componente SeletorFazenda (MapLibre + OpenFreeMap + Geocoding Open-Meteo) */}
              <div className="rounded-xl overflow-hidden border border-[#2f4838]">
                <SeletorFazenda value={ponto} onChange={setPonto} />
              </div>

              {/* Botão limpar marcação & Coordenadas */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                <div>
                  <label className="block text-xs font-mono text-[#9fb5a6] mb-1">Latitude</label>
                  <input
                    type="text"
                    readOnly
                    value={ponto ? ponto.latitude.toFixed(5) : ''}
                    className="w-full h-11 bg-[#0e1712] border border-[#2f4838] rounded-lg px-3 font-mono text-sm text-[#7cc795]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#9fb5a6] mb-1">Longitude</label>
                  <input
                    type="text"
                    readOnly
                    value={ponto ? ponto.longitude.toFixed(5) : ''}
                    className="w-full h-11 bg-[#0e1712] border border-[#2f4838] rounded-lg px-3 font-mono text-sm text-[#7cc795]"
                  />
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => setPonto(null)}
                    className="w-full h-11 border border-brand-border text-[#9fb5a6] hover:text-white hover:bg-neutral-800/40 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Limpar marcação
                  </button>
                </div>
              </div>

              {/* Cartão do Solo (IBGE SiBCS) */}
              <CartaoSolo ponto={ponto} />

              {/* Dados que seguem para a API (Conforme screenshot enviado) */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-mono text-[#9fb5a6] uppercase tracking-wider block">
                  Dados que seguem para a API
                </span>
                <pre className="p-4 bg-[#0e1712] border border-[#2f4838] rounded-xl text-xs font-mono text-[#7cc795] overflow-x-auto">
{JSON.stringify(
  {
    latitude: ponto?.latitude ?? null,
    longitude: ponto?.longitude ?? null,
  },
  null,
  2
)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
