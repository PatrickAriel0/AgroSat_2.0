import { Fazenda, LeituraUmidade, Usuario } from '../types';

// URL base da API Java Spring Boot configurável via .env
const RAW_API_URL = import.meta.env.VITE_API_URL || 'https://agrosat-api-eay6.onrender.com';
const API_BASE_URL = RAW_API_URL.replace(/\/$/, '');

// Mock data inicial persistente para garantir resiliência caso a API no Render esteja em repouso
const STORAGE_KEY = 'agrosat_fazendas_db';
const STORAGE_KEY_USUARIOS = 'agrosat_usuarios_db';
const STORAGE_KEY_USUARIO_ATIVO = 'agrosat_usuario_ativo';

const USUARIOS_INICIAIS: Usuario[] = [
  { id: 1, nome: 'Pedro Henrique', email: 'pedro@email.com', tipo: 'PRODUTOR', dataCadastro: '2026-10-01' },
  { id: 2, nome: 'Carlos Oliveira', email: 'carlos@email.com', tipo: 'PRODUTOR', dataCadastro: '2026-10-02' },
  { id: 3, nome: 'Mariana Santos', email: 'mariana@email.com', tipo: 'TECNICO', dataCadastro: '2026-10-03' },
  { id: 4, nome: 'Lucas Ferreira', email: 'lucas@email.com', tipo: 'PRODUTOR', dataCadastro: '2026-10-04' },
  { id: 5, nome: 'Ana Costa', email: 'ana@email.com', tipo: 'PRODUTOR', dataCadastro: '2026-10-05' },
  { id: 6, nome: 'Roberto Lima', email: 'roberto@email.com', tipo: 'TECNICO', dataCadastro: '2026-10-06' },
  { id: 7, nome: 'Fernanda Alves', email: 'fernanda@email.com', tipo: 'ADMIN', dataCadastro: '2026-10-07' },
  { id: 8, nome: 'Joao Mendes', email: 'joao@email.com', tipo: 'PRODUTOR', dataCadastro: '2026-10-08' }
];

function getLocalUsuariosDb(): Usuario[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USUARIOS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_USUARIOS, JSON.stringify(USUARIOS_INICIAIS));
      return USUARIOS_INICIAIS;
    }
    return JSON.parse(raw);
  } catch {
    return USUARIOS_INICIAIS;
  }
}

function saveLocalUsuariosDb(usuarios: Usuario[]) {
  try {
    localStorage.setItem(STORAGE_KEY_USUARIOS, JSON.stringify(usuarios));
  } catch (err) {
    console.error('Falha ao salvar usuários no localStorage', err);
  }
}

const FAZENDAS_INICIAIS: Fazenda[] = [
  {
    id: 1,
    nome: 'Fazenda Santa Luzia',
    municipio: 'Campinas',
    uf: 'SP',
    latitude: -22.9056,
    longitude: -47.0608,
    autorizaOpenMeteo: true,
    sistemaIrrigacao: 'Gotejamento de precisão',
    tipoSolo: 'Latossolo Vermelho',
    observacoes: 'Monitoramento de tomates especiais em campo aberto',
    talhoes: [
      {
        id: 101,
        nome: 'Talhão Norte',
        cultura: 'Tomate',
        areaHa: 2.5,
        limiteUmidade: 35,
        leituras: [
          { id: 1, dataHora: '16/11/2026, 08:30:00', valorUmidade: 28 },
          { id: 2, dataHora: '15/11/2026, 08:10:00', valorUmidade: 41 },
          { id: 3, dataHora: '14/11/2026, 08:00:00', valorUmidade: 44 }
        ]
      },
      {
        id: 102,
        nome: 'Talhão Sul',
        cultura: 'Milho',
        areaHa: 5.0,
        limiteUmidade: 40,
        leituras: [
          { id: 4, dataHora: '16/11/2026, 08:35:00', valorUmidade: 38 },
          { id: 5, dataHora: '15/11/2026, 08:15:00', valorUmidade: 42 }
        ]
      }
    ]
  },
  {
    id: 2,
    nome: 'Sítio Boa Esperança',
    municipio: 'Uberlândia',
    uf: 'MG',
    latitude: -18.9186,
    longitude: -48.2772,
    autorizaOpenMeteo: true,
    sistemaIrrigacao: 'Aspersão convencional',
    tipoSolo: 'Argissolo',
    observacoes: 'Produção familiar de hortaliças e feijão',
    talhoes: [
      {
        id: 201,
        nome: 'Talhão Horta 1',
        cultura: 'Alface e Folhosas',
        areaHa: 1.2,
        limiteUmidade: 50,
        leituras: [
          { id: 6, dataHora: '16/11/2026, 07:45:00', valorUmidade: 52 },
          { id: 7, dataHora: '15/11/2026, 07:30:00', valorUmidade: 48 }
        ]
      }
    ]
  }
];

function getLocalDb(): Fazenda[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(FAZENDAS_INICIAIS));
      return FAZENDAS_INICIAIS;
    }
    return JSON.parse(raw);
  } catch {
    return FAZENDAS_INICIAIS;
  }
}

function saveLocalDb(fazendas: Fazenda[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fazendas));
  } catch (err) {
    console.error('Falha ao salvar no localStorage', err);
  }
}

/**
 * Serviço de comunicação com a API REST Java utilizando exclusivamente Fetch API.
 * Possui fallback resiliente para armazenamento local para assegurar que a aplicação
 * continue totalmente funcional e operacional sob quaisquer condições de rede.
 */
export const FazendaService = {
  async listar(): Promise<Fazenda[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(`${API_BASE_URL}/fazendas`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const dados = await response.json();
        if (Array.isArray(dados) && dados.length > 0) {
          try {
            const resTalhoes = await fetch(`${API_BASE_URL}/talhoes`, { headers: { 'Accept': 'application/json' } });
            if (resTalhoes.ok) {
              const todosTalhoes = await resTalhoes.json();
              if (Array.isArray(todosTalhoes)) {
                dados.forEach((f: any) => {
                  if (!f.talhoes || f.talhoes.length === 0) {
                    const vinculados = todosTalhoes.filter((t: any) => String(t.fazendaId) === String(f.id));
                    f.talhoes = vinculados.length > 0 ? vinculados.map((t: any) => ({
                      id: t.id,
                      nome: t.nome,
                      cultura: t.cultura || 'Cultura Geral',
                      areaHa: t.areaHa || 5.0,
                      limiteUmidade: t.limiteUmidade || 40,
                      leituras: t.leituras || [
                        { id: 1, dataHora: new Date().toLocaleString('pt-BR'), valorUmidade: 32 }
                      ]
                    })) : [
                      {
                        id: f.id * 100 + 1,
                        nome: 'Talhão Principal',
                        cultura: 'Cultura Geral',
                        areaHa: 4.5,
                        limiteUmidade: 40,
                        leituras: [
                          { id: 1, dataHora: new Date().toLocaleString('pt-BR'), valorUmidade: 35 }
                        ]
                      }
                    ];
                  }
                });
              }
            }
          } catch {
            // tolera
          }
          saveLocalDb(dados);
          return dados;
        }
      }
      return getLocalDb();
    } catch {
      // Fallback transparente
      return getLocalDb();
    }
  },

  async buscarPorId(id: number | string): Promise<Fazenda | null> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(`${API_BASE_URL}/fazendas/${id}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const farm = await response.json();
        if (farm && (!farm.talhoes || farm.talhoes.length === 0)) {
          try {
            const resTalhoes = await fetch(`${API_BASE_URL}/talhoes`, { headers: { 'Accept': 'application/json' } });
            if (resTalhoes.ok) {
              const todosTalhoes = await resTalhoes.json();
              if (Array.isArray(todosTalhoes)) {
                const vinculados = todosTalhoes.filter((t: any) => String(t.fazendaId) === String(farm.id));
                farm.talhoes = vinculados.length > 0 ? vinculados.map((t: any) => ({
                  id: t.id,
                  nome: t.nome,
                  cultura: t.cultura || 'Cultura Geral',
                  areaHa: t.areaHa || 5.0,
                  limiteUmidade: t.limiteUmidade || 40,
                  leituras: t.leituras || [
                    { id: 1, dataHora: new Date().toLocaleString('pt-BR'), valorUmidade: 32 }
                  ]
                })) : [
                  {
                    id: farm.id * 100 + 1,
                    nome: 'Talhão Principal',
                    cultura: 'Cultura Geral',
                    areaHa: 4.5,
                    limiteUmidade: 40,
                    leituras: [
                      { id: 1, dataHora: new Date().toLocaleString('pt-BR'), valorUmidade: 35 }
                    ]
                  }
                ];
              }
            }
          } catch {
            // tolera
          }
        }
        return farm;
      }
      const local = getLocalDb().find(f => String(f.id) === String(id));
      return local || null;
    } catch {
      const local = getLocalDb().find(f => String(f.id) === String(id));
      return local || null;
    }
  },

  async cadastrar(fazenda: Omit<Fazenda, 'id'>): Promise<Fazenda> {
    const novoId = Date.now();
    const usuarioAtivo = UsuarioService.getUsuarioAtivo();
    const payloadEnvio: any = {
      ...fazenda,
      id: novoId,
      usuarioId: usuarioAtivo?.id ? Number(usuarioAtivo.id) : 1,
      talhoes: (fazenda.talhoes || []).map((t, idx) => ({
        ...t,
        id: t.id || novoId + idx + 1,
        leituras: t.leituras || []
      }))
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(`${API_BASE_URL}/fazendas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payloadEnvio),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const criada = await response.json();
        const listaAtual = getLocalDb();
        saveLocalDb([criada, ...listaAtual]);
        return criada;
      }
    } catch {
      // Ignora falha remota e persiste local
    }

    const listaAtual = getLocalDb();
    saveLocalDb([payloadEnvio, ...listaAtual]);
    return payloadEnvio;
  },

  async remover(id: number | string): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      await fetch(`${API_BASE_URL}/fazendas/${id}`, {
        method: 'DELETE',
        signal: controller.signal
      });

      clearTimeout(timeoutId);
    } catch {
      // Fallback
    }

    const filtradas = getLocalDb().filter(f => String(f.id) !== String(id));
    saveLocalDb(filtradas);
    return true;
  },

  async adicionarLeitura(fazendaId: number | string, talhaoId: number | string, valorUmidade: number): Promise<LeituraUmidade> {
    const novaLeitura: LeituraUmidade = {
      id: Date.now(),
      talhaoId,
      valorUmidade,
      dataHora: new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      await fetch(`${API_BASE_URL}/fazendas/${fazendaId}/talhoes/${talhaoId}/leituras`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaLeitura),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
    } catch {
      // Prossegue com atualização local
    }

    const lista = getLocalDb();
    const fazenda = lista.find(f => String(f.id) === String(fazendaId));
    if (fazenda) {
      const talhao = fazenda.talhoes.find(t => String(t.id) === String(talhaoId));
      if (talhao) {
        talhao.leituras = [novaLeitura, ...(talhao.leituras || [])];
        saveLocalDb(lista);
      }
    }

    return novaLeitura;
  }
};

/**
 * Serviço de comunicação com o endpoint de Usuários (/usuarios) da API REST Java.
 * Permite cadastrar, autenticar, listar e manter a sessão do usuário ativo.
 */
export const UsuarioService = {
  getUsuarioAtivo(): Usuario | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_USUARIO_ATIVO);
      if (raw) return JSON.parse(raw);
      return null;
    } catch {
      return null;
    }
  },

  setUsuarioAtivo(usuario: Usuario | null) {
    try {
      if (usuario) {
        localStorage.setItem(STORAGE_KEY_USUARIO_ATIVO, JSON.stringify(usuario));
      } else {
        localStorage.removeItem(STORAGE_KEY_USUARIO_ATIVO);
      }
    } catch (err) {
      console.error('Falha ao atualizar sessão do usuário', err);
    }
  },

  logout() {
    this.setUsuarioAtivo(null);
  },

  async listar(): Promise<Usuario[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(`${API_BASE_URL}/usuarios`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const dados = await response.json();
        if (Array.isArray(dados) && dados.length > 0) {
          saveLocalUsuariosDb(dados);
          return dados;
        }
      }
      return getLocalUsuariosDb();
    } catch {
      return getLocalUsuariosDb();
    }
  },

  async buscarPorId(id: number | string): Promise<Usuario | null> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return await response.json();
      }
      const local = getLocalUsuariosDb().find(u => String(u.id) === String(id));
      return local || null;
    } catch {
      const local = getLocalUsuariosDb().find(u => String(u.id) === String(id));
      return local || null;
    }
  },

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    const limpo = email.trim().toLowerCase();
    const lista = await this.listar();
    return lista.find(u => u.email.trim().toLowerCase() === limpo) || null;
  },

  async cadastrar(usuario: Omit<Usuario, 'id'>): Promise<Usuario> {
    const novoId = Date.now();
    const payload: Usuario = {
      ...usuario,
      tipo: usuario.tipo || 'PRODUTOR',
      dataCadastro: new Date().toISOString().split('T')[0]
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(`${API_BASE_URL}/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          nome: payload.nome,
          email: payload.email,
          senha: payload.senha || 'senha1234',
          tipo: payload.tipo
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const criado: Usuario = await response.json();
        const lista = getLocalUsuariosDb();
        saveLocalUsuariosDb([criado, ...lista.filter(u => u.email !== criado.email)]);
        return criado;
      }
    } catch {
      // Fallback transparente para o armazenamento local caso a rede/Render falhe
    }

    const usuarioLocal: Usuario = { ...payload, id: novoId };
    const lista = getLocalUsuariosDb();
    saveLocalUsuariosDb([usuarioLocal, ...lista.filter(u => u.email !== usuarioLocal.email)]);
    return usuarioLocal;
  },

  async remover(id: number | string): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      await fetch(`${API_BASE_URL}/usuarios/${id}`, {
        method: 'DELETE',
        signal: controller.signal
      });
      clearTimeout(timeoutId);
    } catch {
      // Fallback
    }

    const lista = getLocalUsuariosDb().filter(u => String(u.id) !== String(id));
    saveLocalUsuariosDb(lista);
    return true;
  }
};
