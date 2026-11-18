import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  id: number;
  categoria: 'sistema' | 'satelite' | 'agua' | 'acesso';
  pergunta: string;
  resposta: string;
}

const FAQS: FaqItem[] = [
  {
    id: 1,
    categoria: 'sistema',
    pergunta: 'Como o AgroSat decide se devo irrigar ou não?',
    resposta: 'O sistema cruza dois dados: a umidade do solo detectada por satélite e a previsão de chuva para as próximas 72 horas. Se o solo estiver seco e não houver previsão de chuva, o sistema recomenda irrigar. Se houver chuva prevista, recomenda aguardar — economizando água e energia.'
  },
  {
    id: 2,
    categoria: 'satelite',
    pergunta: 'Quais satélites são utilizados?',
    resposta: 'O AgroSat utiliza imagens dos satélites Sentinel-2 (ESA/Europa) e Landsat (NASA/EUA), ambos de acesso público e gratuito via plataformas como Copernicus e Earth Engine. Esses satélites revisitam a mesma área a cada 5-10 dias com resolução espacial de 10-30 metros.'
  },
  {
    id: 3,
    categoria: 'satelite',
    pergunta: 'O que é NDVI e para que serve?',
    resposta: 'NDVI (Índice de Vegetação por Diferença Normalizada) é uma métrica calculada a partir de imagens satelitais que indica a saúde e vigor da vegetação. Valores entre 0.6 e 0.9 indicam vegetação saudável; abaixo de 0.3 pode indicar estresse hídrico. O AgroSat usa esse índice em conjunto com a umidade do solo para avaliar o estado real da lavoura.'
  },
  {
    id: 4,
    categoria: 'agua',
    pergunta: 'Quanto de água posso economizar com o AgroSat?',
    resposta: 'Estudos com sistemas similares de irrigação de precisão indicam economia de 30% a 50% no consumo de água. O principal ganho vem de evitar irrigações antes de chuvas — situação muito comum entre pequenos produtores. Além da água, a economia de energia elétrica nas bombas pode chegar a 30%.'
  },
  {
    id: 5,
    categoria: 'sistema',
    pergunta: 'O sistema precisa de internet de alta velocidade?',
    resposta: 'Não. O processamento dos dados de satélite é feito em nuvem, e o produtor recebe apenas a recomendação final — uma mensagem simples por app ou SMS. Para áreas sem internet, o sistema pode funcionar via mensagem de texto (SMS), que consome pouquíssimos dados.'
  },
  {
    id: 6,
    categoria: 'acesso',
    pergunta: 'O AgroSat tem custo para o produtor?',
    resposta: 'A proposta do projeto é oferecer o serviço gratuitamente para a agricultura familiar. Os dados satelitais são públicos e as APIs meteorológicas possuem planos gratuitos. O custo de infraestrutura seria coberto por parcerias com órgãos governamentais, cooperativas ou programas de fomento à agricultura sustentável.'
  },
  {
    id: 7,
    categoria: 'sistema',
    pergunta: 'Com que frequência o sistema atualiza os dados?',
    resposta: 'A previsão meteorológica é atualizada a cada 6 horas via Open-Meteo API. As imagens de satélite são integradas a cada nova passagem do Sentinel-2 (aproximadamente a cada 5 dias), com interpolação de dados diários para garantir recomendações atualizadas a cada amanhecer.'
  }
];

export const FAQ: React.FC = () => {
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState<string>('todas');
  const [abertoId, setAbertoId] = useState<number | null>(1);

  const categorias = [
    { id: 'todas', label: 'Todas' },
    { id: 'sistema', label: 'Sistema' },
    { id: 'satelite', label: 'Satélite' },
    { id: 'agua', label: 'Água' },
    { id: 'acesso', label: 'Acesso' }
  ];

  const faqsFiltrados = useMemo(() => {
    return FAQS.filter(item => {
      const matchCat = categoria === 'todas' || item.categoria === categoria;
      const matchBusca =
        item.pergunta.toLowerCase().includes(busca.toLowerCase()) ||
        item.resposta.toLowerCase().includes(busca.toLowerCase());
      return matchCat && matchBusca;
    });
  }, [busca, categoria]);

  const toggleAccordion = (id: number) => {
    setAbertoId(abertoId === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-wider text-brand-primary bg-emerald-950/60 px-3.5 py-1 rounded-full border border-brand-primary/20">
          Suporte & Informações
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold font-heading text-white mt-3 mb-4">
          Perguntas <span className="text-brand-primary">Frequentes</span>
        </h1>
        <p className="text-brand-text-body text-base">
          Tire suas dúvidas sobre o funcionamento do motor de decisão, fontes de dados e economia hídrica.
        </p>
      </div>

      {/* Controles: Busca e Categorias */}
      <div className="space-y-4">
        {/* Input de busca */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar pergunta ou termo técnico..."
            className="w-full bg-[#0b180d] border border-brand-border rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-neutral-500 focus:outline-none focus:border-brand-primary"
          />
        </div>

        {/* Categorias Pills */}
        <div className="flex flex-wrap gap-2">
          {categorias.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoria(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                categoria === cat.id
                  ? 'bg-brand-primary text-black font-semibold shadow-[0_2px_8px_rgba(74,222,128,0.25)]'
                  : 'bg-[#0b180d] text-brand-text-body hover:text-white border border-brand-border'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Accordion */}
      <div className="space-y-3">
        {faqsFiltrados.length === 0 ? (
          <div className="p-8 text-center text-brand-text-muted border border-dashed border-brand-border rounded-xl bg-[#071308]">
            <HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            Nenhuma pergunta encontrada para sua busca.
          </div>
        ) : (
          faqsFiltrados.map((item) => {
            const isAberto = abertoId === item.id;
            return (
              <div
                key={item.id}
                className="bg-[#0b180d] border border-brand-border rounded-xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-heading text-lg sm:text-xl font-bold text-white">
                    {item.pergunta}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-brand-primary shrink-0 transition-transform duration-200 ${
                      isAberto ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isAberto && (
                  <div className="px-5 sm:px-6 pb-6 text-sm text-brand-text-body leading-relaxed border-t border-brand-border/30 pt-4">
                    {item.resposta}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
