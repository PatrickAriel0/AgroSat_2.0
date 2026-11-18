/**
 * Explicação resumida das 13 ordens do SiBCS (Sistema Brasileiro de Classificação de Solos).
 * Texto de apoio, em linguagem simples. É uma caracterização geral da ordem, não do seu
 * talhão: dentro da mesma ordem os solos variam bastante.
 */
export interface ExplicacaoSolo {
  resumo: string;
  atencao: string;
}

export const SOLOS_SIBCS: Record<string, ExplicacaoSolo> = {
  Latossolos: {
    resumo:
      "Solos profundos, bem drenados e porosos, muito comuns nas áreas de lavoura do Brasil.",
    atencao:
      "Costumam ser ácidos e de baixa fertilidade natural, então dependem de correção e adubação.",
  },
  Argissolos: {
    resumo:
      "Solos com mais argila no subsolo do que na superfície, o que muda como a água entra e escorre.",
    atencao:
      "Em terrenos inclinados podem sofrer erosão com facilidade. Vale cuidar da cobertura do solo.",
  },
  Neossolos: {
    resumo:
      "Solos jovens, pouco desenvolvidos. Há tipos rasos e pedregosos e tipos muito arenosos.",
    atencao:
      "Os arenosos retêm pouca água e nutrientes, e os rasos limitam o crescimento das raízes.",
  },
  Cambissolos: {
    resumo:
      "Solos em formação, com profundidade e fertilidade bem variáveis de um lugar para outro.",
    atencao:
      "Muitas vezes são rasos ou com pedras, e em encostas pedem atenção contra a erosão.",
  },
  Nitossolos: {
    resumo:
      "Solos argilosos e bem estruturados, em geral profundos. A antiga 'terra roxa' é um Nitossolo.",
    atencao:
      "Em declive, a chuva forte pode causar erosão. A fertilidade varia conforme a região.",
  },
  Chernossolos: {
    resumo:
      "Solos escuros, ricos em matéria orgânica e em nutrientes, de boa fertilidade natural.",
    atencao:
      "São pouco comuns e podem ser rasos ou ter drenagem limitada em alguns locais.",
  },
  Luvissolos: {
    resumo:
      "Solos típicos de clima mais seco, em geral com boa quantidade de nutrientes.",
    atencao:
      "Costumam ser rasos e sofrer erosão. A falta de chuva é o maior limite.",
  },
  Planossolos: {
    resumo:
      "Solos com uma camada densa no subsolo que atrapalha a passagem de água e de raízes.",
    atencao:
      "Podem encharcar na chuva e ressecar na seca, o que exige manejo da água.",
  },
  Plintossolos: {
    resumo:
      "Solos com drenagem restrita, onde a água do subsolo pode ficar parada por períodos.",
    atencao:
      "Podem encharcar na época chuvosa e endurecer quando secam. A drenagem é o ponto principal.",
  },
  Gleissolos: {
    resumo:
      "Solos de várzea e baixadas, saturados de água durante boa parte do ano.",
    atencao:
      "A falta de drenagem limita muitas culturas, e a área pode alagar na chuva.",
  },
  Vertissolos: {
    resumo:
      "Solos muito argilosos que incham quando molhados e racham quando secam.",
    atencao:
      "Ficam pesados de trabalhar molhados e muito duros secos. A janela de preparo é curta.",
  },
  Espodossolos: {
    resumo:
      "Solos arenosos e ácidos, comuns em áreas de restinga e litoral.",
    atencao:
      "Têm baixa fertilidade e retêm pouca água e nutrientes.",
  },
  Organossolos: {
    resumo:
      "Solos formados por restos de plantas, muito ricos em matéria orgânica, em áreas encharcadas.",
    atencao:
      "Costumam ter drenagem ruim e podem afundar quando drenados. Merecem manejo cuidadoso.",
  },
};

/** Normaliza texto para comparar sem acento e sem diferença de maiúscula. */
export const semAcento = (texto: string) =>
  texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

/** Acha a ordem do SiBCS dentro de um texto como "Latossolos Vermelhos". */
export function acharOrdem(texto: string): string | null {
  const alvo = semAcento(texto);
  const achada = Object.keys(SOLOS_SIBCS).find((ordem) =>
    alvo.includes(semAcento(ordem).slice(0, -1)),
  );
  return achada ?? null;
}
