import { PrevisaoClimatica, DecisaoIrrigacao } from '../types';

export const WeatherService = {
  /**
   * Obtém a previsão do tempo via API pública Open-Meteo
   */
  async obterPrevisao(lat: number, lon: number): Promise<PrevisaoClimatica> {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=precipitation_sum,temperature_2m_max,temperature_2m_min&current_weather=true&timezone=America%2FSao_Paulo`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Falha ao consultar Open-Meteo');
      }

      const data = await response.json();
      const diasNomes = ['dom.', 'seg.', 'ter.', 'qua.', 'qui.', 'sex.', 'sáb.'];

      const dias = data.daily.time.slice(0, 3).map((dataIso: string, i: number) => {
        const d = new Date(dataIso + 'T12:00:00');
        const diaSemana = diasNomes[d.getDay()] + `, ${d.getDate()}`;
        return {
          diaSemana,
          chuvaMm: Number((data.daily.precipitation_sum[i] || 0).toFixed(1)),
          tempMin: Math.round(data.daily.temperature_2m_min[i] || 18),
          tempMax: Math.round(data.daily.temperature_2m_max[i] || 29)
        };
      });

      const chuva24h = dias[0]?.chuvaMm || 0;
      const chuva72h = Number((dias.reduce((acc: number, cur: { chuvaMm: number }) => acc + cur.chuvaMm, 0)).toFixed(1));
      const tempAtual = Math.round(data.current_weather?.temperature || 27);

      return {
        tempAtual,
        chuva24h,
        chuva72h,
        dias
      };
    } catch {
      // Retorno padrão alinhado aos mockups enviados caso sem internet
      return {
        tempAtual: 27,
        chuva24h: 0.0,
        chuva72h: 9.6,
        dias: [
          { diaSemana: 'seg., 16', chuvaMm: 0.0, tempMin: 19, tempMax: 31 },
          { diaSemana: 'ter., 17', chuvaMm: 9.6, tempMin: 18, tempMax: 26 },
          { diaSemana: 'qua., 18', chuvaMm: 0.4, tempMin: 18, tempMax: 29 }
        ]
      };
    }
  },

  /**
   * Busca coordenadas aproximadas pelo nome do município usando Geocoding Open-Meteo
   */
  async buscarCoordenadas(municipio: string, uf: string): Promise<{ lat: number; lon: number } | null> {
    try {
      const q = encodeURIComponent(`${municipio.trim()} ${uf.trim()} Brazil`);
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${q}&count=1&language=pt&format=json`;
      const response = await fetch(url);
      if (response.ok) {
        const json = await response.json();
        if (json.results && json.results.length > 0) {
          return {
            lat: Number(json.results[0].latitude.toFixed(4)),
            lon: Number(json.results[0].longitude.toFixed(4))
          };
        }
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Motor de decisão do AgroSat: cruza umidade do solo com chuva prevista em 72h
   */
  calcularDecisao(umidadeSolo: number, limiteUmidade: number, chuva72h: number): DecisaoIrrigacao {
    const soloSeco = umidadeSolo < limiteUmidade;
    const vaiChover = chuva72h >= 5.0;

    if (soloSeco && !vaiChover) {
      return {
        acao: 'irrigar',
        titulo: 'Irrigar agora',
        mensagem: `Solo com ${umidadeSolo}% de umidade (abaixo do limite de ${limiteUmidade}%) e sem chuva prevista significativa (${chuva72h} mm em 72h). Acione a irrigação.`,
        cor: 'green'
      };
    }

    if (soloSeco && vaiChover) {
      return {
        acao: 'aguardar',
        titulo: 'Solo abaixo do limite · chuva prevista',
        mensagem: `A leitura está abaixo do limite (${umidadeSolo}%), porém há chuva prevista de ${chuva72h} mm nas próximas 72h. Reavalie após a chuva e confirme a condição no campo antes de irrigar.`,
        cor: 'amber'
      };
    }

    return {
      acao: 'monitorar',
      titulo: 'Não irrigar · solo com boa umidade',
      mensagem: `Solo com ${umidadeSolo}% de umidade (adequado ou acima do limite de ${limiteUmidade}%). Economize água e energia mantendo o sistema em espera.`,
      cor: 'blue'
    };
  }
};
