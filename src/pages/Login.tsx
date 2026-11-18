import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Satellite, ArrowRight, ShieldCheck, User } from 'lucide-react';

export const Login: React.FC = () => {
  const [tipoConta, setTipoConta] = useState<'usuario' | 'admin'>('usuario');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !senha.trim()) {
      setErro('Preencha seu e-mail e senha.');
      return;
    }

    if (tipoConta === 'usuario') {
      navigate('/painel-usuario');
    } else {
      navigate('/admin-cooperativa');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-stretch bg-[#0e1712]">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 border-x border-brand-border/40">
        {/* Left Side: Branding & Pitch */}
        <div className="bg-[#0a120d] border-b lg:border-b-0 lg:border-r border-[#243a2d] p-8 sm:p-14 lg:p-16 flex flex-col justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-950 border border-brand-primary/40 flex items-center justify-center text-brand-primary">
              <Satellite className="w-5 h-5" />
            </div>
            <span className="font-heading text-3xl font-bold tracking-wider text-white">
              Agro<span className="text-brand-primary">Sat</span>
            </span>
          </Link>

          <div className="my-12 lg:my-0 space-y-5">
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Regar, aguardar ou deixar a chuva trabalhar.
            </h1>
            <p className="text-lg sm:text-xl text-[#9fb5a6] font-body leading-relaxed max-w-md">
              A decisão diária com base na leitura de umidade do solo e na previsão climática.
            </p>
          </div>

          <div className="text-xs font-mono text-[#9fb5a6] border-t border-[#243a2d] pt-6 flex items-center justify-between">
            <span>Global Solution 2026/2 · FIAP</span>
            <span>CitizenTech</span>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 sm:p-14 lg:p-16 flex items-center justify-center">
          <div className="w-full max-w-md space-y-6">
            <div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-2">
                Entrar
              </h2>
              <p className="text-sm text-[#9fb5a6]">
                Acesse o painel do produtor ou a visão da cooperativa.
              </p>
            </div>

            {/* Toggle Usuário / Administrador */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#050c05] rounded-xl border border-[#2f4838]">
              <button
                type="button"
                onClick={() => setTipoConta('usuario')}
                className={`py-3 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  tipoConta === 'usuario'
                    ? 'bg-[#eef3ee] text-[#0e1712] shadow-sm'
                    : 'text-[#9fb5a6] hover:text-white'
                }`}
              >
                <User className="w-4 h-4" /> Usuário
              </button>
              <button
                type="button"
                onClick={() => setTipoConta('admin')}
                className={`py-3 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  tipoConta === 'admin'
                    ? 'bg-[#eef3ee] text-[#0e1712] shadow-sm'
                    : 'text-[#9fb5a6] hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4" /> Administrador
              </button>
            </div>

            {erro && (
              <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-lg text-xs text-red-200">
                {erro}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#9fb5a6] mb-1.5" htmlFor="login-email">
                  E-mail
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@gmail.com"
                  className="w-full h-12 bg-[#0e1712] border border-[#2f4838] rounded-xl px-4 text-white placeholder-neutral-600 focus:outline-none focus:border-brand-primary text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9fb5a6] mb-1.5" htmlFor="login-senha">
                  Senha
                </label>
                <input
                  id="login-senha"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Sua senha"
                  className="w-full h-12 bg-[#0e1712] border border-[#2f4838] rounded-xl px-4 text-white placeholder-neutral-600 focus:outline-none focus:border-brand-primary text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-[#eef3ee] hover:bg-white text-[#0e1712] font-semibold text-base rounded-xl transition-all shadow-[0_2px_12px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2 mt-2"
              >
                Entrar no AgroSat <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-between text-xs pt-2">
              <a href="#" className="text-[#7cc795] hover:underline">
                Esqueci minha senha
              </a>
              <Link to="/cadastro" className="text-[#7cc795] hover:underline font-semibold">
                Criar conta de produtor
              </Link>
            </div>

            <p className="text-xs text-[#9fb5a6] leading-relaxed pt-4 border-t border-[#243a2d]/60">
              {tipoConta === 'admin'
                ? 'Perfil Administrador: gerencia cooperativas, múltiplos usuários, planos e plantações.'
                : 'Perfil Produtor Rural: acesse recomendações diárias de irrigação e métricas de economia.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
