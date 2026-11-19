import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  Map as MapLibreMap,
  Marker,
  NavigationControl,
  setWorkerUrl,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
// O maplibre-gl v6 procura o worker ao lado do seu próprio arquivo, o que o
// Vite quebra ao empacotar. Este import faz o Vite gerar o worker e informa a URL.
import urlDoWorker from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import type { LocalEncontrado, PontoMapa } from "../types/localizacao";
import { buscarLocais, obterPosicaoAtual } from "../services/localizacao";

setWorkerUrl(urlDoWorker);

/**
 * Estilo de mapa cartográfico de alta fidelidade e disponibilidade imediata.
 * Utiliza tiles raster CartoDB Voyager / OpenStreetMap, garantindo carregamento instantâneo
 * sem travamentos de WebGL ou bloqueios por extensões de navegador/redes institucionais.
 */
const ESTILO_PADRAO: any = {
  version: 8,
  sources: {
    "carto-voyager": {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
        "https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
        "https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
        "https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a>',
    },
  },
  layers: [
    {
      id: "carto-voyager-tiles",
      type: "raster",
      source: "carto-voyager",
      minzoom: 0,
      maxzoom: 20,
    },
  ],
};
const CENTRO_BRASIL: [number, number] = [-52, -14];
const ZOOM_BRASIL = 3.6;
/** 5 casas decimais ≈ 1 metro: suficiente para a fazenda e não expõe mais do que o necessário. */
const CASAS_DECIMAIS = 5;
const TEMPO_LIMITE_MAPA_MS = 12000;

interface Props {
  /** Ponto escolhido (ou null se ainda não marcou). O pai guarda o valor. */
  value: PontoMapa | null;
  onChange: (ponto: PontoMapa | null) => void;
  /** Estilo do mapa. Só é lido na primeira renderização. */
  styleUrl?: any;
}

interface Aviso {
  tipo: "info" | "erro";
  texto: string;
}

const arredondar = (n: number) => Number(n.toFixed(CASAS_DECIMAIS));

const reduzMovimento = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const classeBotaoPrimario =
  "inline-flex min-h-11 items-center justify-center rounded-lg bg-agro-primary px-4 text-base font-semibold text-agro-secondary transition-colors hover:bg-agro-primary-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-agro-accent disabled:cursor-not-allowed disabled:opacity-60";
const classeBotaoSecundario =
  "inline-flex min-h-11 items-center justify-center rounded-lg border border-agro-primary/50 px-4 text-base font-semibold text-agro-primary transition-colors hover:bg-agro-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-agro-accent disabled:cursor-not-allowed disabled:opacity-60";

export default function SeletorFazenda({
  value,
  onChange,
  styleUrl = ESTILO_PADRAO,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapaRef = useRef<MapLibreMap | null>(null);
  const marcadorRef = useRef<Marker | null>(null);
  const onChangeRef = useRef(onChange);
  const valorInicialRef = useRef(value);
  const estiloInicialRef = useRef(styleUrl);
  const buscaIdRef = useRef(0);

  const [busca, setBusca] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [localizando, setLocalizando] = useState(false);
  const [locais, setLocais] = useState<LocalEncontrado[]>([]);
  const [aviso, setAviso] = useState<Aviso | null>(null);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const selecionar = useCallback((ponto: PontoMapa) => {
    onChangeRef.current({
      latitude: arredondar(ponto.latitude),
      longitude: arredondar(ponto.longitude),
    });
  }, []);

  const irPara = useCallback((ponto: PontoMapa, zoom: number) => {
    const mapa = mapaRef.current;
    if (!mapa) return;
    const center: [number, number] = [ponto.longitude, ponto.latitude];
    if (reduzMovimento()) mapa.jumpTo({ center, zoom });
    else mapa.flyTo({ center, zoom });
  }, []);

  // Cria o mapa uma única vez.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const inicial = valorInicialRef.current;
    const mapa = new MapLibreMap({
      container,
      style: estiloInicialRef.current,
      center: inicial ? [inicial.longitude, inicial.latitude] : CENTRO_BRASIL,
      zoom: inicial ? 13 : ZOOM_BRASIL,
      attributionControl: { compact: true },
      // No celular, um dedo rola a página e dois dedos movem o mapa.
      cooperativeGestures: true,
      locale: {
        "CooperativeGesturesHandler.WindowsHelpText":
          "Use Ctrl + rolagem para aproximar o mapa",
        "CooperativeGesturesHandler.MacHelpText":
          "Use ⌘ + rolagem para aproximar o mapa",
        "CooperativeGesturesHandler.MobileHelpText":
          "Use dois dedos para mover o mapa",
      },
    });

    mapa.addControl(new NavigationControl({ showCompass: false }), "top-right");
    mapa.on("click", (e) => {
      const { lat, lng } = e.lngLat.wrap();
      selecionar({ latitude: lat, longitude: lng });
      setLocais([]);
    });

    const atraso = window.setTimeout(() => {
      setAviso({
        tipo: "erro",
        texto:
          "O mapa está demorando para carregar. Você ainda pode buscar pela cidade ou usar a sua localização.",
      });
    }, TEMPO_LIMITE_MAPA_MS);
    mapa.once("load", () => window.clearTimeout(atraso));

    mapaRef.current = mapa;
    return () => {
      window.clearTimeout(atraso);
      marcadorRef.current?.remove();
      marcadorRef.current = null;
      mapa.remove();
      mapaRef.current = null;
    };
  }, [selecionar]);

  // Mantém o marcador igual ao valor recebido do pai.
  useEffect(() => {
    const mapa = mapaRef.current;
    if (!mapa) return;

    if (!value) {
      marcadorRef.current?.remove();
      marcadorRef.current = null;
      return;
    }

    const posicao: [number, number] = [value.longitude, value.latitude];
    if (marcadorRef.current) {
      marcadorRef.current.setLngLat(posicao);
      return;
    }

    const marcador = new Marker({ draggable: true, color: "#f59e0b" })
      .setLngLat(posicao)
      .addTo(mapa);
    marcador.on("dragend", () => {
      const { lat, lng } = marcador.getLngLat().wrap();
      selecionar({ latitude: lat, longitude: lng });
    });
    marcadorRef.current = marcador;
  }, [value, selecionar]);

  async function aoBuscar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const texto = busca.trim();
    if (texto.length < 3) {
      setAviso({
        tipo: "erro",
        texto: "Digite pelo menos 3 letras do nome da cidade.",
      });
      return;
    }

    const id = ++buscaIdRef.current;
    setBuscando(true);
    setAviso(null);
    setLocais([]);
    try {
      const achados = await buscarLocais(texto);
      if (id !== buscaIdRef.current) return;
      if (achados.length === 0) {
        setAviso({
          tipo: "info",
          texto: `Nenhuma cidade encontrada para "${texto}". Confira o nome ou marque direto no mapa.`,
        });
      } else {
        setLocais(achados);
      }
    } catch {
      if (id === buscaIdRef.current) {
        setAviso({
          tipo: "erro",
          texto:
            "Não foi possível buscar agora. Verifique a conexão ou marque direto no mapa.",
        });
      }
    } finally {
      if (id === buscaIdRef.current) setBuscando(false);
    }
  }

  function escolherLocal(local: LocalEncontrado) {
    setLocais([]);
    selecionar(local);
    irPara(local, 12);
    setAviso({
      tipo: "info",
      texto: `Marcamos o centro de ${local.nome}. Arraste o marcador até a sua fazenda.`,
    });
  }

  async function usarMinhaLocalizacao() {
    setLocalizando(true);
    setAviso(null);
    setLocais([]);
    try {
      const ponto = await obterPosicaoAtual();
      selecionar(ponto);
      irPara(ponto, 14);
      setAviso({
        tipo: "info",
        texto: "Encontramos a sua localização. Arraste o marcador se precisar ajustar.",
      });
    } catch (erro) {
      setAviso({
        tipo: "erro",
        texto:
          erro instanceof Error
            ? erro.message
            : "Não foi possível obter a sua localização.",
      });
    } finally {
      setLocalizando(false);
    }
  }

  function limpar() {
    onChange(null);
    setAviso(null);
  }

  return (
    <section
      aria-labelledby="titulo-seletor-fazenda"
      className="w-full min-w-0 rounded-2xl border border-agro-border bg-agro-card p-4 sm:p-6"
    >
      <h2
        id="titulo-seletor-fazenda"
        className="font-heading text-2xl font-bold text-agro-white sm:text-3xl"
      >
        Onde fica a sua fazenda?
      </h2>
      <p className="mt-1 max-w-prose text-base text-agro-text">
        Clique ou toque no mapa para marcar o local. Se preferir, busque pela
        cidade ou use a localização do seu aparelho.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <form onSubmit={aoBuscar} className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1">
            <label htmlFor="busca-cidade" className="mb-1 block text-sm font-medium text-agro-white">
              Cidade ou município
            </label>
            <input
              id="busca-cidade"
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Ex.: Ribeirão Preto"
              autoComplete="off"
              className="min-h-11 w-full min-w-0 rounded-lg border border-agro-border bg-agro-bg px-3 text-base text-agro-white placeholder:text-agro-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-agro-accent"
            />
          </div>
          <button type="submit" disabled={buscando} className={classeBotaoPrimario}>
            {buscando ? "Buscando..." : "Buscar"}
          </button>
        </form>

        <button
          type="button"
          onClick={usarMinhaLocalizacao}
          disabled={localizando}
          className={classeBotaoSecundario}
        >
          {localizando ? "Localizando..." : "Usar minha localização"}
        </button>
      </div>

      {locais.length > 0 && (
        <ul
          aria-label="Resultados da busca"
          className="mt-3 max-h-48 divide-y divide-agro-border overflow-y-auto rounded-lg border border-agro-border bg-agro-bg"
        >
          {locais.map((local) => (
            <li key={`${local.nome}-${local.latitude}-${local.longitude}`}>
              <button
                type="button"
                onClick={() => escolherLocal(local)}
                className="min-h-11 w-full px-3 py-2 text-left text-base text-agro-white hover:bg-agro-primary/10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-agro-accent"
              >
                {local.nome}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div role="status" aria-live="polite" className="empty:hidden">
        {aviso && (
          <p
            className={`mt-3 rounded-lg border px-3 py-2 text-sm ${
              aviso.tipo === "erro"
                ? "border-red-400/40 bg-red-950/40 text-red-200"
                : "border-agro-border bg-agro-bg text-agro-white"
            }`}
          >
            {aviso.texto}
          </p>
        )}
      </div>

      <div className="relative mt-4 overflow-hidden rounded-xl border border-agro-border">
        <div
          ref={containerRef}
          role="region"
          aria-label="Mapa para marcar a localização da fazenda"
          className="h-72 w-full sm:h-96 lg:h-[30rem]"
        />
        {!value && (
          <p className="pointer-events-none absolute left-3 top-3 max-w-[calc(100%-6rem)] rounded-md bg-agro-bg/90 px-3 py-1.5 text-sm text-agro-white">
            Clique ou toque no mapa para marcar a fazenda.
          </p>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-stretch">
        <dl className="contents">
          <div className="min-w-0 rounded-lg bg-agro-bg px-3 py-2">
            <dt className="text-sm text-agro-muted">Latitude</dt>
            <dd className="font-mono text-base text-agro-white" data-testid="latitude">
              {value ? value.latitude : "ainda não marcada"}
            </dd>
          </div>
          <div className="min-w-0 rounded-lg bg-agro-bg px-3 py-2">
            <dt className="text-sm text-agro-muted">Longitude</dt>
            <dd className="font-mono text-base text-agro-white" data-testid="longitude">
              {value ? value.longitude : "ainda não marcada"}
            </dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={limpar}
          disabled={!value}
          className={classeBotaoSecundario}
        >
          Limpar marcação
        </button>
      </div>
    </section>
  );
}
