import React from 'react';
import { Link } from 'react-router-dom';
import { INTEGRANTES } from '../data/integrantesData';
import { Linkedin, Github, ArrowRight, Award } from 'lucide-react';

export const Integrantes: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-wider text-brand-primary bg-emerald-950/60 px-3.5 py-1 rounded-full border border-brand-primary/20">
          Global Solution 2026/2 · FIAP
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading text-white mt-3 mb-4">
          Nossa <span className="text-brand-primary">Equipe</span>
        </h1>
        <p className="text-lg text-brand-text-body">
          Os cinco integrantes responsáveis pelo desenvolvimento multidisciplinar do AgroSat (Turma 1TDSPK).
        </p>
      </div>

      {/* Grid de Integrantes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {INTEGRANTES.map((membro) => (
          <div
            key={membro.id}
            className={`bg-[#0b180d] border ${
              membro.isRepresentante ? 'border-brand-primary/50 shadow-[0_0_20px_rgba(74,222,128,0.15)]' : 'border-brand-border'
            } rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-brand-primary/60 transition-all duration-300 group`}
          >
            <div>
              {/* Avatar + Badge */}
              <div className="relative w-28 h-28 mx-auto mb-5">
                <img
                  src={membro.foto}
                  alt={`Foto de ${membro.nome}`}
                  className="w-full h-full object-cover rounded-full border-2 border-brand-primary/40 group-hover:border-brand-primary transition-colors"
                />
                {membro.isRepresentante && (
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-brand-primary text-black text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1 whitespace-nowrap">
                    <Award className="w-3 h-3" /> Representante
                  </span>
                )}
              </div>

              {/* Informações */}
              <div className="text-center mb-5">
                <h3 className="text-2xl font-bold font-heading text-white mb-1">
                  {membro.nome}
                </h3>
                <div className="flex items-center justify-center gap-2 text-xs font-mono text-brand-primary mb-2">
                  <span>RM · {membro.rm}</span>
                  <span>•</span>
                  <span>{membro.turma}</span>
                </div>
                <p className="text-xs text-brand-text-body line-clamp-2 px-2">
                  {membro.cargo}
                </p>
              </div>

              {/* Habilidades rápidas */}
              <div className="flex flex-wrap gap-1.5 justify-center mb-6">
                {membro.habilidades.slice(0, 3).map((hab, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-mono bg-[#050c05] text-brand-text-muted px-2.5 py-1 rounded-md border border-brand-border/40"
                  >
                    {hab}
                  </span>
                ))}
              </div>
            </div>

            {/* Ações e links */}
            <div className="pt-4 border-t border-brand-border/40 space-y-3">
              <Link
                to={`/integrantes/${membro.id}`}
                className="w-full bg-[#122614] hover:bg-brand-primary hover:text-black text-brand-primary text-xs font-semibold py-2.5 px-4 rounded-full transition-all flex items-center justify-center gap-2 border border-brand-primary/30"
              >
                Ver perfil detalhado <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <div className="flex items-center justify-center gap-3">
                <a
                  href={membro.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-brand-text-muted hover:text-white flex items-center gap-1.5 transition-colors p-1"
                >
                  <Linkedin className="w-4 h-4 text-[#0077b5]" /> LinkedIn
                </a>
                <span className="text-neutral-700">|</span>
                <a
                  href={membro.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-brand-text-muted hover:text-white flex items-center gap-1.5 transition-colors p-1"
                >
                  <Github className="w-4 h-4 text-white" /> GitHub
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
