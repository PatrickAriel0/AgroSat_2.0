import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

import { Home } from './pages/Home';
import { Sobre } from './pages/Sobre';
import { Solucao } from './pages/Solucao';
import { FAQ } from './pages/FAQ';
import { Contato } from './pages/Contato';
import { Integrantes } from './pages/Integrantes';
import { IntegranteDetalhe } from './pages/IntegranteDetalhe';
import { NotFound } from './pages/NotFound';

// Páginas de Autenticação, Onboarding e Dashboard do Usuário
import { Login } from './pages/Login';
import { Cadastro } from './pages/Cadastro';
import { Planos } from './pages/Planos';
import { PainelUsuario } from './pages/PainelUsuario';
import { RecomendacaoHoje } from './pages/RecomendacaoHoje';
import { MapaPlantacoes } from './pages/MapaPlantacoes';
import { AdminCooperativa } from './pages/AdminCooperativa';
import { UsuarioService } from './services/api';

// Helper component to scroll to top on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Proteção de rota: exige sessão ativa para acessar os módulos do painel
const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const usuarioAtivo = UsuarioService.getUsuarioAtivo();
  if (!usuarioAtivo) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Rotas que possuem layout dedicado (sem Header/Footer padrão duplicado)
const AppContent: React.FC = () => {
  const location = useLocation();
  const paginasDedicadas = [
    '/login',
    '/cadastro',
    '/planos',
    '/painel-usuario',
    '/recomendacao-hoje',
    '/mapa-plantacoes',
    '/admin-cooperativa',
  ];

  const temLayoutProprio = paginasDedicadas.some((p) => location.pathname.startsWith(p));

  return (
    <div className="flex flex-col min-h-screen">
      {!temLayoutProprio && <Header />}
      <main className="flex-grow">
        <Routes>
          {/* Páginas Institucionais Obrigatórias */}
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/solucao" element={<Solucao />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/integrantes" element={<Integrantes />} />
          <Route path="/integrantes/:id" element={<IntegranteDetalhe />} />

          {/* Autenticação & Onboarding */}
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/planos" element={<PrivateRoute><Planos /></PrivateRoute>} />

          {/* Dashboards & Soluções CitizenTech (Protegidas por Sessão) */}
          <Route path="/painel-usuario" element={<PrivateRoute><PainelUsuario /></PrivateRoute>} />
          <Route path="/recomendacao-hoje" element={<PrivateRoute><RecomendacaoHoje /></PrivateRoute>} />
          <Route path="/mapa-plantacoes" element={<PrivateRoute><MapaPlantacoes /></PrivateRoute>} />
          <Route path="/admin-cooperativa" element={<PrivateRoute><AdminCooperativa /></PrivateRoute>} />

          {/* Redirecionamento de Rotas Legadas para o Painel Atual */}
          <Route path="/painel" element={<Navigate to="/painel-usuario" replace />} />
          <Route path="/painel/nova-fazenda" element={<Navigate to="/painel-usuario" replace />} />
          <Route path="/painel/fazenda/:id" element={<Navigate to="/painel-usuario" replace />} />

          {/* Página 404 Personalizada */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!temLayoutProprio && <Footer />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
