import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Map as MapLibreMap, 
  Marker, 
  Popup, 
  NavigationControl, 
  setWorkerUrl 
} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import urlDoWorker from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';

import { 
  Satellite, 
  ArrowLeft, 
  MapPin, 
  CheckCircle2 
} from 'lucide-react';

setWorkerUrl(urlDoWorker);

const ESTILO_PADRAO: any = {
  version: 8,
  sources: {
    'osm-tiles': {
      type: 'raster',
      tiles: [
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
      maxzoom: 19
    }
  },
  layers: [
    {
      id: 'osm-tiles-layer',
      type: 'raster',
      source: 'osm-tiles',
      minzoom: 0,
      maxzoom: 19
    }
  ]
};

interface FazendaPonto {
  id: string;
  nome: string;
  cultura: string;
  situacao: string;
  subtexto: string;
  cor: string;
  lat: number;
  lng: number;
  isUsuario?: boolean;
}

export const MapaPlantacoes: React.FC = () => {
  const containerMapaRef = useRef<HTMLDivElement>(null);
  const mapaRef = useRef<MapLibreMap | null>(null);
  const marcadoresRef = useRef<Marker[]>([]);

  // Fazendas iniciais
  const [fazendas, setFazendas] = useState<FazendaPonto[]>([
    {
      id: '1',
      nome: 'Fazenda Feliz',
      cultura: 'Soja',
      situacao: 'Não regar',
      subtexto: 'Solo abastecido · Chuva de 14,5 mm prevista',
      cor: '#7cc795',
      lat: -23.5349,
      lng: -46.6212,
    },
    {
      id: '2',
      nome: 'Fazenda Triste',
      cultura: 'Milho',
      situacao: 'Regar hoje',
      subtexto: 'Solo seco · Sem chuva prevista em 3 dias',
      cor: '#6fa8e8',
      lat: -22.9068,
      lng: -47.0616,
    },
    {
      id: '3',
      nome: 'Fazenda Token Fortnite',
      cultura: 'Café',
      situacao: 'Atenção',
      subtexto: 'Risco de encharcamento · Volume de 45 mm',
      cor: '#e0b04a',
      lat: -21.1775,
      lng: -47.8103,
    },
  ]);

  const [selecionadaId, setSelecionadaId] = useState<string>('1');
  const [novoPontoMarcado, setNovoPontoMarcado] = useState<{ lat: number; lng: number } | null>(null);
  const [nomeNovaPlantacao, setNomeNovaPlantacao] = useState('');
  const [culturaNovaPlantacao, setCulturaNovaPlantacao] = useState('Soja');
  const [avisoSucesso, setAvisoSucesso] = useState<string | null>(null);

  // Carrega a fazenda do usuário se cadastrada
  useEffect(() => {
    try {
      const saved = localStorage.getItem('agrosat_novo_produtor');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.nomeFazenda && parsed.latitude && parsed.longitude) {
          const fazendaUser: FazendaPonto = {
            id: 'user-farm',
            nome: `${parsed.nomeFazenda} (Sua Propriedade)`,
            cultura: parsed.plantio || 'Soja',
            situacao: 'Não regar',
            subtexto: 'Monitoramento georreferenciado via Open-Meteo',
            cor: '#4ade80',
            lat: parsed.latitude,
            lng: parsed.longitude,
            isUsuario: true,
          };

          setFazendas((prev) => {
            const semUser = prev.filter((f) => f.id !== 'user-farm');
            return [fazendaUser, ...semUser];
          });
          setSelecionadaId('user-farm');
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Cria marcador customizado HTML
  const criarElementoMarcador = useCallback((fazenda: FazendaPonto) => {
    const el = document.createElement('div');
    el.className = 'cursor-pointer group flex flex-col items-center';
    el.innerHTML = `
      <div style="background-color: ${fazenda.cor}; box-shadow: 0 0 15px ${fazenda.cor}88;" class="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-black font-bold text-xs transform transition-transform group-hover:scale-125">
        🌱
      </div>
      <div class="mt-1 bg-[#0e1712] border border-[#243a2d] px-2 py-0.5 rounded text-[11px] font-semibold text-white whitespace-nowrap shadow-lg">
        ${fazenda.nome}
      </div>
    `;
    return el;
  }, []);

  // Inicializa o Mapa MapLibre
  useEffect(() => {
    if (!containerMapaRef.current) return;

    const mapa = new MapLibreMap({
      container: containerMapaRef.current,
      style: ESTILO_PADRAO,
      center: [-47.0608, -22.9056], // Região de Campinas / SP
      zoom: 7,
      attributionControl: false,
    });

    mapa.addControl(new NavigationControl({ showCompass: true }), 'top-right');

    mapaRef.current = mapa;

    // Clique no mapa para marcar nova plantação
    mapa.on('click', (e) => {
      const lat = Number(e.lngLat.lat.toFixed(5));
      const lng = Number(e.lngLat.lng.toFixed(5));
      setNovoPontoMarcado({ lat, lng });
    });

    return () => {
      mapa.remove();
      mapaRef.current = null;
    };
  }, []);

  // Atualiza marcadores no mapa sempre que a lista de fazendas muda
  useEffect(() => {
    const mapa = mapaRef.current;
    if (!mapa) return;

    // Limpa marcadores anteriores
    marcadoresRef.current.forEach((m) => m.remove());
    marcadoresRef.current = [];

    fazendas.forEach((fazenda) => {
      const el = criarElementoMarcador(fazenda);

      const popup = new Popup({ offset: 25, closeButton: false }).setHTML(`
        <div style="background:#0e1712; color:#e6efe8; padding:10px; border-radius:10px; font-family:sans-serif;">
          <b style="font-size:14px; color:#ffffff;">${fazenda.nome}</b>
          <div style="font-size:12px; color:#9fb5a6; margin-top:2px;">Cultura: ${fazenda.cultura}</div>
          <div style="font-size:12px; font-weight:bold; color:${fazenda.cor}; margin-top:4px;">
            ${fazenda.situacao}
          </div>
          <div style="font-size:11px; color:#9fb5a6; margin-top:4px;">${fazenda.subtexto}</div>
        </div>
      `);

      const marker = new Marker({ element: el })
        .setLngLat([fazenda.lng, fazenda.lat])
        .setPopup(popup)
        .addTo(mapa);

      el.addEventListener('click', () => {
        setSelecionadaId(fazenda.id);
      });

      marcadoresRef.current.push(marker);
    });
  }, [fazendas, criarElementoMarcador]);

  // Voa para a fazenda selecionada
  const focarFazenda = (fazenda: FazendaPonto) => {
    setSelecionadaId(fazenda.id);
    if (mapaRef.current) {
      mapaRef.current.flyTo({
        center: [fazenda.lng, fazenda.lat],
        zoom: 12,
        speed: 1.4,
        essential: true,
      });
    }
  };

  const handleSalvarNovaPlantacaoNoMapa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoPontoMarcado || !nomeNovaPlantacao.trim()) return;

    const nova: FazendaPonto = {
      id: Date.now().toString(),
      nome: nomeNovaPlantacao.trim(),
      cultura: culturaNovaPlantacao,
      situacao: 'Não regar',
      subtexto: 'Monitoramento automático via satélite ativado',
      cor: '#4ade80',
      lat: novoPontoMarcado.lat,
      lng: novoPontoMarcado.lng,
      isUsuario: true,
    };

    setFazendas((prev) => [nova, ...prev]);
    setAvisoSucesso(`Plantação "${nomeNovaPlantacao}" adicionada com sucesso no mapa!`);
    setNomeNovaPlantacao('');
    setNovoPontoMarcado(null);
    setSelecionadaId(nova.id);

    if (mapaRef.current) {
      mapaRef.current.flyTo({
        center: [nova.lng, nova.lat],
        zoom: 13,
      });
    }

    setTimeout(() => setAvisoSucesso(null), 4000);
  };

  const fazendaAtiva = fazendas.find((f) => f.id === selecionadaId) || fazendas[0];

  return (
    <div className="min-h-screen bg-[#0e1712] text-[#e6efe8] pb-16">
      {/* Top Header */}
      <div className="h-20 px-6 sm:px-12 lg:px-16 border-b border-[#243a2d] bg-[#0a120d] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/painel"
            className="text-[#9fb5a6] hover:text-white p-2 rounded-lg hover:bg-[#14211a] transition-colors"
            title="Voltar ao Painel"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-950 border border-brand-primary/40 flex items-center justify-center text-brand-primary">
              <Satellite className="w-5 h-5" />
            </div>
            <span className="font-heading text-2xl font-bold tracking-wider text-white">
              Agro<span className="text-brand-primary">Sat</span>
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#9fb5a6] hidden sm:inline">Motor de Mapa:</span>
          <span className="text-xs bg-[#1d3a2a] text-[#7cc795] px-2.5 py-1 rounded font-mono border border-[#7cc795]/30">
            MapLibre GL API
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {avisoSucesso && (
          <div className="p-4 bg-[#1d3a2a] border border-[#7cc795] text-[#7cc795] rounded-xl flex items-center gap-2 text-sm animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{avisoSucesso}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 lg:gap-8 items-start">
          {/* Coluna Esquerda: Lista de Fazendas & Formulário de Marcação */}
          <div className="space-y-6">
            <div className="bg-[#14211a] border border-[#243a2d] rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-xl font-bold text-white">
                  Plantações no mapa
                </h2>
                <span className="text-xs text-[#9fb5a6] font-mono">
                  {fazendas.length} ponto(s)
                </span>
              </div>

              <p className="text-xs text-[#9fb5a6]">
                Clique em qualquer fazenda para aproximar o mapa ou clique em qualquer ponto do mapa para marcar uma nova plantação.
              </p>

              {/* Lista das Fazendas */}
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {fazendas.map((fazenda) => {
                  const isActive = fazenda.id === selecionadaId;
                  return (
                    <div
                      key={fazenda.id}
                      onClick={() => focarFazenda(fazenda)}
                      className={`rounded-xl p-3.5 cursor-pointer transition-all border ${
                        isActive
                          ? 'bg-[#1a2d23] border-[#7cc795] shadow-[0_0_15px_rgba(124,199,149,0.15)] ring-1 ring-[#7cc795]/40'
                          : 'bg-[#0e1712] border-[#243a2d] hover:border-[#2f4838]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <b className="font-heading text-base font-bold text-white flex items-center gap-1.5">
                          {fazenda.isUsuario && (
                            <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse"></span>
                          )}
                          {fazenda.nome}
                        </b>
                        <span className="text-[11px] text-[#9fb5a6] font-mono">{fazenda.cultura}</span>
                      </div>

                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-xs font-semibold"
                          style={{ color: fazenda.cor }}
                        >
                          {fazenda.situacao}
                        </span>
                        <span className="text-[10px] text-[#9fb5a6]">
                          ({fazenda.lat.toFixed(4)}, {fazenda.lng.toFixed(4)})
                        </span>
                      </div>

                      <p className="text-[11px] text-[#9fb5a6]">{fazenda.subtexto}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Formulário para Cadastrar Ponto Clicado no Mapa */}
            {novoPontoMarcado ? (
              <div className="bg-[#14211a] border border-[#7cc795]/60 rounded-2xl p-6 space-y-4 animate-in fade-in">
                <div className="flex items-center gap-2 text-[#7cc795]">
                  <MapPin className="w-4 h-4" />
                  <h3 className="font-heading text-base font-bold text-white">
                    Ponto marcado no mapa!
                  </h3>
                </div>

                <p className="text-xs text-[#9fb5a6]">
                  Coordenadas: <strong>{novoPontoMarcado.lat}</strong>, <strong>{novoPontoMarcado.lng}</strong>. Preencha os dados abaixo para salvar:
                </p>

                <form onSubmit={handleSalvarNovaPlantacaoNoMapa} className="space-y-3">
                  <div>
                    <label className="block text-xs text-[#9fb5a6] mb-1">
                      Nome da plantação / talhão
                    </label>
                    <input
                      type="text"
                      value={nomeNovaPlantacao}
                      onChange={(e) => setNomeNovaPlantacao(e.target.value)}
                      placeholder="Ex: Talhão Novo Sul"
                      className="w-full h-10 bg-[#0e1712] border border-[#2f4838] rounded-xl text-xs text-white px-3 focus:outline-none focus:border-[#7cc795]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#9fb5a6] mb-1">
                      Cultura agrícola
                    </label>
                    <select
                      value={culturaNovaPlantacao}
                      onChange={(e) => setCulturaNovaPlantacao(e.target.value)}
                      className="w-full h-10 bg-[#0e1712] border border-[#2f4838] rounded-xl text-xs text-white px-3 focus:outline-none focus:border-[#7cc795]"
                    >
                      <option value="Soja">Soja</option>
                      <option value="Milho">Milho</option>
                      <option value="Café">Café</option>
                      <option value="Cana-de-açúcar">Cana-de-açúcar</option>
                      <option value="Trigo">Trigo</option>
                    </select>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      className="flex-1 h-10 rounded-xl bg-[#7cc795] text-[#0e1712] font-semibold text-xs hover:bg-[#8fe5ab] transition-colors"
                    >
                      Salvar ponto no mapa
                    </button>
                    <button
                      type="button"
                      onClick={() => setNovoPontoMarcado(null)}
                      className="px-3 h-10 rounded-xl border border-[#2f4838] text-xs text-[#9fb5a6] hover:bg-[#0e1712]"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-[#14211a] border border-[#243a2d] rounded-2xl p-4 text-xs text-[#9fb5a6] flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#7cc795] shrink-0" />
                <span>
                  <strong>Dica:</strong> Toque ou clique em qualquer lugar do mapa à direita para marcar onde fica sua lavoura.
                </span>
              </div>
            )}
          </div>

          {/* Coluna Direita: Mapa Interativo MapLibre GL */}
          <div className="bg-[#14211a] border border-[#243a2d] rounded-2xl p-4 flex flex-col space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 px-2">
              <div className="flex items-center gap-2 text-sm text-white">
                <MapPin className="w-4 h-4 text-[#7cc795]" />
                <span>
                  Foco: <strong>{fazendaAtiva.nome}</strong> ({fazendaAtiva.cultura})
                </span>
              </div>
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-md"
                style={{ backgroundColor: `${fazendaAtiva.cor}22`, color: fazendaAtiva.cor }}
              >
                Status: {fazendaAtiva.situacao}
              </span>
            </div>

            {/* Container do Mapa Real */}
            <div
              ref={containerMapaRef}
              className="w-full h-[600px] rounded-xl overflow-hidden border border-[#243a2d] shadow-inner"
            />

            {/* Legenda Inferior */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-4 text-xs text-[#9fb5a6] px-2">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#7cc795]" /> Não regar (Solo OK)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#6fa8e8]" /> Regar hoje (Solo seco)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#e0b04a]" /> Atenção (Alerta)
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#7cc795]">
                OpenStreetMap & MapLibre GL
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapaPlantacoes;
