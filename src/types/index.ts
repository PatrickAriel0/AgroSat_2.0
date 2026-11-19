export interface LeituraUmidade {
  id?: number | string;
  talhaoId?: number | string;
  dataHora: string;
  valorUmidade: number;
}

export interface Talhao {
  id: number | string;
  nome: string;
  cultura: string;
  areaHa: number;
  limiteUmidade: number;
  leituras: LeituraUmidade[];
}

export interface Fazenda {
  id: number | string;
  nome: string;
  municipio: string;
  uf: string;
  latitude?: number;
  longitude?: number;
  autorizaOpenMeteo?: boolean;
  sistemaIrrigacao?: string;
  tipoSolo?: string;
  observacoes?: string;
  talhoes: Talhao[];
  criadoEm?: string;
}

export interface PrevisaoDia {
  diaSemana: string;
  chuvaMm: number;
  tempMin: number;
  tempMax: number;
}

export interface PrevisaoClimatica {
  tempAtual: number;
  chuva24h: number;
  chuva72h: number;
  dias: PrevisaoDia[];
}

export interface DecisaoIrrigacao {
  acao: 'irrigar' | 'aguardar' | 'monitorar';
  titulo: string;
  mensagem: string;
  cor: 'green' | 'amber' | 'blue';
}

export interface Usuario {
  id?: number | string;
  nome: string;
  email: string;
  senha?: string;
  tipo?: 'PRODUTOR' | 'ADMIN' | 'TECNICO' | string;
  dataCadastro?: string;
}

export interface Integrante {
  id: string;
  nome: string;
  rm: string;
  turma: string;
  cargo: string;
  foto: string;
  bio: string;
  habilidades: string[];
  linkedin: string;
  github: string;
  isRepresentante?: boolean;
}
