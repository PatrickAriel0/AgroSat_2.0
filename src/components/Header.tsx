import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Satellite } from 'lucide-react';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Sobre', path: '/sobre' },
    { name: 'Solução', path: '/solucao' },
    { name: 'Painel', path: '/painel' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contato', path: '/contato' },
    { name: 'Equipe', path: '/integrantes' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#050c05]/90 backdrop-blur-md border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <Link 
          to="/" 
          className="flex items-center gap-3 group transition-transform duration-200 hover:scale-[1.02]"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-950/80 border border-brand-primary/40 flex items-center justify-center text-brand-primary shadow-[0_0_15px_rgba(74,222,128,0.25)]">
            <Satellite className="w-5 h-5 animate-pulse" />
          </div>
          <span className="font-heading text-2xl sm:text-3xl font-bold tracking-wider text-white">
            Agro<span className="text-brand-primary">Sat</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-150 ${
                  active 
                    ? 'text-brand-primary border-b-2 border-brand-primary pb-1' 
                    : 'text-brand-text-body hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          
          <div className="flex items-center gap-3 pl-2 border-l border-brand-border">
            <Link
              to="/login"
              className="text-sm font-medium text-brand-text-body hover:text-white transition-colors"
            >
              Entrar
            </Link>
            <Link
              to="/cadastro"
              className="bg-brand-primary hover:bg-brand-primary-hover text-black font-semibold text-sm px-5 py-2 rounded-full transition-all duration-200 shadow-[0_2px_12px_rgba(74,222,128,0.3)] hover:shadow-[0_4px_20px_rgba(74,222,128,0.45)]"
            >
              Cadastrar
            </Link>
          </div>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          className="md:hidden p-2.5 rounded-lg border border-brand-border text-brand-text-body hover:text-white hover:border-brand-primary/40 focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-brand-border bg-[#071308] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-md text-base font-medium ${
                  active 
                    ? 'bg-emerald-950/70 text-brand-primary border-l-4 border-brand-primary' 
                    : 'text-brand-text-body hover:bg-emerald-950/40 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-2 grid grid-cols-2 gap-2">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center border border-brand-border text-white font-semibold text-sm py-2.5 rounded-full hover:bg-emerald-950/40 transition-all"
            >
              Entrar
            </Link>
            <Link
              to="/cadastro"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center bg-brand-primary hover:bg-brand-primary-hover text-black font-semibold text-sm py-2.5 rounded-full transition-all"
            >
              Cadastrar
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
