/** Ponto no mapa, em graus decimais (WGS84). */
export interface PontoMapa {
  latitude: number;
  longitude: number;
}

/** Resultado da busca por nome de cidade. */
export interface LocalEncontrado extends PontoMapa {
  nome: string;
}
