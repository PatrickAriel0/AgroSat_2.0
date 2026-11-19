import type { PontoMapa } from "../types/localizacao";
import type { SoloInfo } from "../types/solo";

const RAW_URL = import.meta.env.VITE_API_URL ?? "https://agrosat-api-eay6.onrender.com";
const BASE_URL = RAW_URL.replace(/\/$/, "");
const API = BASE_URL.endsWith("/api") ? BASE_URL : `${BASE_URL}/api`;

/** Pergunta à API Java qual é o solo do ponto marcado no mapa. */
export async function buscarSolo(
  ponto: PontoMapa,
  sinal?: AbortSignal,
  permitirFallback: boolean = false
): Promise<SoloInfo> {
  const params = new URLSearchParams({
    latitude: String(ponto.latitude),
    longitude: String(ponto.longitude),
  });

  try {
    const resposta = await fetch(`${API}/solos?${params.toString()}`, {
      signal: sinal,
    });

    if (resposta.status === 404) {
      throw new SoloNaoEncontradoError();
    }
    if (!resposta.ok) {
      throw new Error(`Falha ao consultar o solo (${resposta.status})`);
    }
    return (await resposta.json()) as SoloInfo;
  } catch (err) {
    if (sinal?.aborted) throw err;
    if (err instanceof SoloNaoEncontradoError) throw err;

    // Se permitir fallback (ex: após tentativa ou se offline)
    if (permitirFallback) {
      return {
        ordem: "Latossolos",
        descricao: "Latossolos Vermelhos",
        fonte: "IBGE, Mapa de Solos do Brasil (escala 1:250.000)",
      };
    }
    throw err;
  }
}

/** O ponto está fora da área coberta pelo mapa de solos (ex.: fora do Brasil). */
export class SoloNaoEncontradoError extends Error {
  constructor() {
    super("Não encontramos dados de solo para este ponto.");
    this.name = "SoloNaoEncontradoError";
  }
}
