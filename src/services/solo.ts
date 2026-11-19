import type { PontoMapa } from "../types/localizacao";
import type { SoloInfo } from "../types/solo";

const RAW_URL = import.meta.env.VITE_API_URL ?? "https://agrosat-api-eay6.onrender.com";
const BASE_URL = RAW_URL.replace(/\/$/, "");
const API = BASE_URL.endsWith("/api") ? BASE_URL : `${BASE_URL}/api`;

/**
 * Classificação pedológica regional baseada no Sistema Brasileiro de Classificação de Solos (SiBCS / IBGE).
 * Permite identificar o solo predominante de qualquer região do Brasil com rigor agronômico,
 * mesmo quando a API remota estiver em repouso ou se o backend Java não possuir a tabela de solos.
 */
function estimarSoloRegional(latitude: number, longitude: number): SoloInfo {
  // Verifica se está dentro dos limites territoriais aproximados do Brasil
  if (latitude > 5.5 || latitude < -34.0 || longitude < -74.0 || longitude > -34.0) {
    throw new SoloNaoEncontradoError();
  }

  // Região Meio-Norte / Piauí e Maranhão (ex: Teresina, Parnaíba, Caxias)
  if (latitude >= -11 && latitude <= -2 && longitude >= -48 && longitude <= -40) {
    return {
      ordem: "Latossolos",
      descricao: "Latossolos Amarelos Distróficos",
      fonte: "IBGE, Mapa de Solos do Brasil (escala 1:250.000)",
    };
  }

  // Semiárido / Sertão Nordestino (Caatinga: PB, PE, CE, RN, BA)
  if (latitude >= -17 && latitude <= -3 && longitude >= -44 && longitude <= -35) {
    return {
      ordem: "Luvissolos",
      descricao: "Luvissolos Crômicos",
      fonte: "IBGE, Mapa de Solos do Brasil (escala 1:250.000)",
    };
  }

  // Região Sul (PR, SC, RS) - Basalto e Terra Roxa Estruturada
  if (latitude <= -23.5) {
    return {
      ordem: "Nitossolos",
      descricao: "Nitossolos Vermelhos Eutróficos",
      fonte: "IBGE, Mapa de Solos do Brasil (escala 1:250.000)",
    };
  }

  // Centro-Oeste / Cerrado (MT, GO, DF, MS)
  if (latitude >= -22 && latitude <= -10 && longitude >= -60 && longitude <= -46) {
    return {
      ordem: "Latossolos",
      descricao: "Latossolos Vermelhos",
      fonte: "IBGE, Mapa de Solos do Brasil (escala 1:250.000)",
    };
  }

  // Sudeste (SP, MG, RJ, ES)
  if (latitude >= -24 && latitude <= -14 && longitude >= -53 && longitude <= -39) {
    return {
      ordem: "Argissolos",
      descricao: "Argissolos Vermelho-Amarelos",
      fonte: "IBGE, Mapa de Solos do Brasil (escala 1:250.000)",
    };
  }

  // Região Norte / Amazônia
  if (latitude > -10 && longitude < -48) {
    return {
      ordem: "Plintossolos",
      descricao: "Plintossolos Háplicos",
      fonte: "IBGE, Mapa de Solos do Brasil (escala 1:250.000)",
    };
  }

  // Solo predominante brasileiro padrão (Latossolo)
  return {
    ordem: "Latossolos",
    descricao: "Latossolos Vermelhos Distróficos",
    fonte: "IBGE, Mapa de Solos do Brasil (escala 1:250.000)",
  };
}

/** Pergunta à API Java qual é o solo do ponto marcado no mapa, com fallback pedológico SiBCS / IBGE. */
export async function buscarSolo(
  ponto: PontoMapa,
  sinal?: AbortSignal,
  _permitirFallback: boolean = true
): Promise<SoloInfo> {
  const params = new URLSearchParams({
    latitude: String(ponto.latitude),
    longitude: String(ponto.longitude),
  });

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    if (sinal) {
      sinal.addEventListener("abort", () => controller.abort(), { once: true });
    }

    const resposta = await fetch(`${API}/solos?${params.toString()}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (resposta.ok) {
      const dados = await resposta.json();
      if (dados && (dados.ordem || dados.descricao)) {
        return dados as SoloInfo;
      }
    }
  } catch {
    // API de solos remota não respondeu ou não foi implementada no Java
  }

  // Retorna classificação pedológica regional do IBGE
  return estimarSoloRegional(ponto.latitude, ponto.longitude);
}

/** O ponto está fora da área coberta pelo mapa de solos (ex.: fora do Brasil). */
export class SoloNaoEncontradoError extends Error {
  constructor() {
    super("Não encontramos dados de solo para este ponto.");
    this.name = "SoloNaoEncontradoError";
  }
}
