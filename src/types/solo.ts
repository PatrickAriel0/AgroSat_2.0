/** Composição física e química do solo (granulometria, pH, textura e retenção hídrica) */
export interface ComposicaoSolo {
  /** Percentual de argila (0 a 100%) */
  argila: number;
  /** Percentual de areia (0 a 100%) */
  areia: number;
  /** Percentual de silte (0 a 100%) */
  silte: number;
  /** Potencial hidrogeniônico (pH em H2O) */
  ph: number;
  /** Classificação textural SiBCS/USDA (ex.: "Argilosa", "Franco-Arenosa", "Média") */
  textura: string;
  /** Capacidade de retenção hídrica para cálculo de balanço */
  retencaoHidrica: 'Alta' | 'Média' | 'Baixa';
  /** Nível de matéria orgânica percentual (%) */
  materiaOrganica: number;
  /** Origem dos dados detalhados */
  fonteDados: 'SoilGrids (ISRIC)' | 'SiBCS / Embrapa Solos';
}

/** Resposta para a consulta de solo de um ponto. */
export interface SoloInfo {
  /** Ordem do solo no SiBCS (ex.: "Latossolos"). Null quando o ponto não é solo (água, rocha...). */
  ordem: string | null;
  /** Nome como veio da fonte (ex.: "Latossolos Vermelhos" ou "Afloramento de rocha"). */
  descricao: string;
  /** Fonte dos dados, para exibir nos créditos. */
  fonte: string;
  /** Composição granulométrica e físico-química do solo */
  composicao?: ComposicaoSolo;
}
