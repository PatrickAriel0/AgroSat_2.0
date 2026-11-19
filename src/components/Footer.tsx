import React from 'react';
import { Link } from 'react-router-dom';
import { Satellite, Globe, ShieldCheck, HeartHandshake } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-brand-border bg-[#030803] pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1 */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-950 border border-brand-primary/40 flex items-center justify-center text-brand-primary">
                <Satellite className="w-4 h-4" />
              </div>
              <span className="font-heading text-2xl font-bold tracking-wider text-white">
                Agro<span className="text-brand-primary">Sat</span>
              </span>
            </Link>
            <p className="text-sm text-brand-text-muted leading-relaxed max-w-md">
              Democratizando a tecnologia espacial para a agricultura familiar brasileira. Cruzamos sensoriamento remoto de umidade do solo com previsões meteorológicas locais para orientar o pequeno produtor sobre o momento exato de irrigar.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-950/80 border border-emerald-700/30 text-emerald-300">
                <Globe className="w-3.5 h-3.5" /> ODS 2 · Fome Zero
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-950/80 border border-emerald-700/30 text-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5" /> ODS 9 · Inovação
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-950/80 border border-emerald-700/30 text-emerald-300">
                <HeartHandshake className="w-3.5 h-3.5" /> ODS 13 · Clima
              </span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-white text-base font-bold mb-4 font-heading tracking-wider">Navegação</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="text-brand-text-muted hover:text-brand-primary transition-colors">Home</Link></li>
              <li><Link to="/sobre" className="text-brand-text-muted hover:text-brand-primary transition-colors">Sobre o Projeto</Link></li>
              <li><Link to="/solucao" className="text-brand-text-muted hover:text-brand-primary transition-colors">A Solução</Link></li>
              <li><Link to="/painel-usuario" className="text-brand-text-muted hover:text-brand-primary transition-colors">Painel Interativo</Link></li>
              <li><Link to="/faq" className="text-brand-text-muted hover:text-brand-primary transition-colors">FAQ</Link></li>
              <li><Link to="/integrantes" className="text-brand-text-muted hover:text-brand-primary transition-colors">Equipe de Desenvolvimento</Link></li>
              <li><Link to="/contato" className="text-brand-text-muted hover:text-brand-primary transition-colors">Contato & Suporte</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-white text-base font-bold mb-4 font-heading tracking-wider">Acadêmico</h4>
            <p className="text-sm text-brand-text-muted mb-2">FIAP Graduação 2026/2</p>
            <p className="text-xs text-brand-text-muted leading-relaxed mb-4">
              Projeto Integrado Global Solution — CitizenTech: Tecnologia com o cidadão no centro da inovação.
            </p>
            <span className="inline-block px-3 py-1 bg-black/60 border border-brand-border rounded text-xs font-mono text-brand-text-body">
              Turma: 1TDSPK
            </span>
          </div>
        </div>

        <div className="border-t border-brand-border/60 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-text-muted gap-4">
          <p>© 2026 AgroSat · Global Solution 2026/2 · FIAP · 1TDSPK</p>
          <p>Projeto acadêmico CitizenTech. ODS 2, 9 e 13.</p>
        </div>
      </div>
    </footer>
  );
};
