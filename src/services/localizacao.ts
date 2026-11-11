import type { LocalEncontrado, PontoMapa } from "../types/localizacao";

interface GeocodingResultado {
  name: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}

interface GeocodingResposta {
  results?: GeocodingResultado[];
}

const URL_GEOCODING = "https://geocoding-api.open-meteo.com/v1/search";

/** Busca cidades pelo nome (Open-Meteo Geocoding, sem chave de API). */
export async function buscarLocais(texto: string): Promise<LocalEncontrado[]> {
  const params = new URLSearchParams({
    name: texto.trim(),
    count: "5",
    language: "pt",
    countryCode: "BR",
  });

  const resposta = await fetch(`${URL_GEOCODING}?${params.toString()}`);
  if (!resposta.ok) {
    throw new Error(`Falha na busca de localização (${resposta.status})`);
  }

  const dados: GeocodingResposta = await resposta.json();
  return (dados.results ?? []).map((r) => ({
    nome: [r.name, r.admin1].filter(Boolean).join(" - "),
    latitude: r.latitude,
    longitude: r.longitude,
  }));
}

/** Pede ao navegador a posição atual (GPS). Exige HTTPS e a permissão do usuário. */
export function obterPosicaoAtual(): Promise<PontoMapa> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Este navegador não oferece localização."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }),
      (erro) => reject(new Error(mensagemErroGps(erro.code))),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  });
}

function mensagemErroGps(codigo: number): string {
  switch (codigo) {
    case 1: // PERMISSION_DENIED
      return "A permissão de localização foi negada. Libere nas configurações do navegador ou busque pela cidade.";
    case 2: // POSITION_UNAVAILABLE
      return "Não foi possível descobrir a sua posição. Busque pela cidade ou marque no mapa.";
    case 3: // TIMEOUT
      return "A localização demorou demais. Tente de novo ou busque pela cidade.";
    default:
      return "Não foi possível obter a sua localização.";
  }
}
