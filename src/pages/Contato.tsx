import React, { useState } from 'react';
import { Mail, Github, MessageSquare, CheckCircle, Loader2 } from 'lucide-react';

export const Contato: React.FC = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [assunto, setAssunto] = useState('');
  const [mensagem, setMensagem] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const formatTelefone = (v: string) => {
    const limpo = v.replace(/\D/g, '').slice(0, 11);
    if (limpo.length <= 2) return limpo;
    if (limpo.length <= 7) return `(${limpo.slice(0, 2)}) ${limpo.slice(2)}`;
    return `(${limpo.slice(0, 2)}) ${limpo.slice(2, 7)}-${limpo.slice(7)}`;
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTelefone(formatTelefone(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!nome.trim() || nome.trim().length < 3) {
      newErrors.nome = 'Informe seu nome completo (mínimo 3 caracteres).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      newErrors.email = 'Informe um endereço de e-mail válido.';
    }

    if (!assunto) {
      newErrors.assunto = 'Selecione um assunto.';
    }

    if (!mensagem.trim() || mensagem.trim().length < 10) {
      newErrors.mensagem = 'A mensagem deve conter no mínimo 10 caracteres.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setEnviado(true);
      setNome('');
      setEmail('');
      setTelefone('');
      setAssunto('');
      setMensagem('');
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-wider text-brand-primary bg-emerald-950/60 px-3.5 py-1 rounded-full border border-brand-primary/20">
          Atendimento & Parcerias
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold font-heading text-white mt-3 mb-4">
          Fale com a <span className="text-brand-primary">Equipe</span>
        </h1>
        <p className="text-brand-text-body text-base">
          Dúvidas sobre o funcionamento do AgroSat, sugestões ou suporte para pequenos produtores.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Canais */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0b180d] border border-brand-border rounded-2xl p-7 space-y-6">
            <h2 className="text-2xl font-bold font-heading text-white">Canais de Contato</h2>
            <p className="text-sm text-brand-text-muted">
              Você pode enviar uma mensagem direta pelo formulário ou através de nossos canais institucionais.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-[#050c05] border border-brand-border/60 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-emerald-950 flex items-center justify-center text-brand-primary shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-heading">E-mail do Projeto</h4>
                  <p className="text-xs text-brand-text-muted">agrosat.fiap@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-[#050c05] border border-brand-border/60 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-emerald-950 flex items-center justify-center text-brand-primary shrink-0">
                  <Github className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-heading">Repositório GitHub</h4>
                  <a
                    href="https://github.com/PatrickAriel0/AgroSat"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-brand-primary hover:underline"
                  >
                    github.com/PatrickAriel0/AgroSat
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-[#050c05] border border-brand-border/60 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-emerald-950 flex items-center justify-center text-brand-primary shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-heading">Suporte Acadêmico</h4>
                  <p className="text-xs text-brand-text-muted">FIAP · Turma 1TDSPK · 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <div className="lg:col-span-7">
          <div className="bg-[#0b180d] border border-brand-border rounded-2xl p-7 sm:p-9 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
            <h2 className="text-2xl font-bold font-heading text-white mb-6">
              Enviar Mensagem
            </h2>

            {enviado && (
              <div className="mb-6 p-4 bg-emerald-950/90 border border-emerald-500 rounded-xl text-emerald-200 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">Mensagem enviada com sucesso!</h4>
                  <p className="text-xs text-emerald-300">Nossa equipe retornará o contato o mais breve possível.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contato-nome" className="block text-sm font-medium text-brand-text-body mb-1.5">
                    Nome completo *
                  </label>
                  <input
                    id="contato-nome"
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Seu nome"
                    className={`w-full bg-[#050c05] border ${
                      errors.nome ? 'border-red-500' : 'border-brand-border'
                    } rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-brand-primary`}
                  />
                  {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome}</p>}
                </div>

                <div>
                  <label htmlFor="contato-email" className="block text-sm font-medium text-brand-text-body mb-1.5">
                    E-mail *
                  </label>
                  <input
                    id="contato-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="voce@email.com"
                    className={`w-full bg-[#050c05] border ${
                      errors.email ? 'border-red-500' : 'border-brand-border'
                    } rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-brand-primary`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contato-telefone" className="block text-sm font-medium text-brand-text-body mb-1.5">
                    Telefone
                  </label>
                  <input
                    id="contato-telefone"
                    type="tel"
                    value={telefone}
                    onChange={handleTelefoneChange}
                    placeholder="(11) 99999-9999"
                    className="w-full bg-[#050c05] border border-brand-border rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-brand-primary font-mono"
                  />
                </div>

                <div>
                  <label htmlFor="contato-assunto" className="block text-sm font-medium text-brand-text-body mb-1.5">
                    Assunto *
                  </label>
                  <select
                    id="contato-assunto"
                    value={assunto}
                    onChange={(e) => setAssunto(e.target.value)}
                    className={`w-full bg-[#050c05] border ${
                      errors.assunto ? 'border-red-500' : 'border-brand-border'
                    } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-primary`}
                  >
                    <option value="">Selecione o assunto...</option>
                    <option value="duvida">Dúvida sobre o sistema</option>
                    <option value="parceria">Parceria ou Cooperativa</option>
                    <option value="suporte">Suporte com dados climáticos</option>
                    <option value="outro">Outro assunto</option>
                  </select>
                  {errors.assunto && <p className="text-red-500 text-xs mt-1">{errors.assunto}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="contato-mensagem" className="block text-sm font-medium text-brand-text-body mb-1.5">
                  Mensagem *
                </label>
                <textarea
                  id="contato-mensagem"
                  rows={4}
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  placeholder="Escreva sua dúvida, sugestão ou detalhe da sua lavoura..."
                  className={`w-full bg-[#050c05] border ${
                    errors.mensagem ? 'border-red-500' : 'border-brand-border'
                  } rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-brand-primary`}
                />
                {errors.mensagem && <p className="text-red-500 text-xs mt-1">{errors.mensagem}</p>}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-brand-primary hover:bg-brand-primary-hover text-black font-semibold text-base py-3.5 px-6 rounded-full transition-all duration-200 shadow-[0_2px_12px_rgba(74,222,128,0.25)] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Enviando mensagem...
                    </>
                  ) : (
                    'Enviar Mensagem'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
