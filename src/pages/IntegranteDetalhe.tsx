import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { INTEGRANTES } from '../data/integrantesData';
import { ArrowLeft, Linkedin, Github, Award, CheckCircle2 } from 'lucide-react';

export const IntegranteDetalhe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const membro = INTEGRANTES.find(m => m.id === id);

  if (!membro) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold font-heading text-white mb-4">Integrante não encontrado</h2>
        <Link to="/integrantes" className="text-brand-primary underline text-sm">
          Voltar para a lista de integrantes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <Link
        to="/integrantes"
        className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-primary-hover text-sm font-medium mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar para a equipe
      </Link>

      <div className="bg-[#0b180d] border border-brand-border rounded-3xl p-8 sm:p-12 shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-8 pb-8 border-b border-brand-border/40">
          <div className="relative w-36 h-36 shrink-0">
            <img
              src={membro.foto}
              alt={membro.nome}
              className="w-full h-full object-cover rounded-2xl border-2 border-brand-primary/50 shadow-[0_0_20px_rgba(74,222,128,0.2)]"
            />
            {membro.isRepresentante && (
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-brand-primary text-black text-[11px] font-bold font-mono px-3 py-0.5 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1 whitespace-nowrap">
                <Award className="w-3.5 h-3.5" /> Representante
              </span>
            )}
          </div>

          <div className="text-center sm:text-left space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold font-heading text-white">
              {membro.nome}
            </h1>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm font-mono text-brand-primary">
              <span className="bg-emerald-950/60 px-2.5 py-1 rounded border border-brand-primary/20">
                RM: {membro.rm}
              </span>
              <span className="bg-emerald-950/60 px-2.5 py-1 rounded border border-brand-primary/20">
                Turma: {membro.turma}
              </span>
            </div>
            <p className="text-base font-semibold text-white pt-1">
              {membro.cargo}
            </p>
          </div>
        </div>

        {/* Biografia e Atribuições */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold font-heading text-white mb-2">
              Sobre a Atuação no AgroSat
            </h3>
            <p className="text-sm text-brand-text-body leading-relaxed">
              {membro.bio}
            </p>
          </div>

          {/* Competências */}
          <div>
            <h3 className="text-xl font-bold font-heading text-white mb-3">
              Competências & Tecnologias
            </h3>
            <div className="flex flex-wrap gap-2">
              {membro.habilidades.map((hab, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-[#050c05] text-brand-primary border border-brand-border"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> {hab}
                </span>
              ))}
            </div>
          </div>

          {/* Redes e Contato */}
          <div className="pt-6 border-t border-brand-border/40 flex flex-wrap items-center gap-4">
            <a
              href={membro.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#0077b5] hover:bg-[#006097] text-white px-5 py-2.5 rounded-full text-xs font-semibold transition-colors"
            >
              <Linkedin className="w-4 h-4" /> Perfil no LinkedIn
            </a>
            <a
              href={membro.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-5 py-2.5 rounded-full text-xs font-semibold transition-colors border border-neutral-600"
            >
              <Github className="w-4 h-4" /> Repositórios no GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
