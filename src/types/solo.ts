/** Resposta da API Java para a consulta de solo de um ponto. */
export interface SoloInfo {
  /** Ordem do solo no SiBCS (ex.: "Latossolos"). Null quando o ponto não é solo (água, rocha...). */
  ordem: string | null;
  /** Nome como veio da fonte (ex.: "Latossolos Vermelhos" ou "Afloramento de rocha"). */
  descricao: string;
  /** Fonte dos dados, para exibir nos créditos. */
  fonte: string;
}
