import React from 'react';
import { Link } from 'react-router-dom';
import { Satellite, ArrowLeft, Compass } from 'lucide-react';
import { UsuarioService } from '../services/api';

export const NotFound: React.FC = () => {
  const usuarioAtivo = UsuarioService.getUsuarioAtivo();
  const destinoPainel = usuarioAtivo
    ? usuarioAtivo.tipo === 'ADMIN'
      ? '/admin-cooperativa'
      : '/painel-usuario'
    : '/login';

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full bg-[#0b180d] border border-brand-border rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
        <div className="w-16 h-16 rounded-2xl bg-emerald-950 border border-brand-primary/40 flex items-center justify-center text-brand-primary mx-auto shadow-[0_0_20px_rgba(74,222,128,0.2)]">
          <Compass className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-brand-primary bg-emerald-950/80 px-3 py-1 rounded-full border border-brand-primary/30">
            <Satellite className="w-3.5 h-3.5" /> Erro 404 · Coordenada fora de órbita
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold font-heading text-white pt-2">
            Página não encontrada
          </h1>
          <p className="text-sm sm:text-base text-brand-text-body leading-relaxed">
            O endereço que você tentou acessar não existe ou foi movido dentro da plataforma AgroSat.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="w-full sm:w-auto bg-brand-primary hover:bg-brand-primary-hover text-black font-semibold text-sm px-6 py-3 rounded-full transition-all flex items-center justify-center gap-2 shadow-[0_2px_15px_rgba(74,222,128,0.3)]"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar para o Início
          </Link>
          <Link
            to={destinoPainel}
            className="w-full sm:w-auto border border-brand-border hover:border-brand-primary/50 text-white font-medium text-sm px-6 py-3 rounded-full transition-all bg-[#050c05] hover:bg-emerald-950/40"
          >
            {usuarioAtivo ? 'Ir para Meu Painel' : 'Fazer Login'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
