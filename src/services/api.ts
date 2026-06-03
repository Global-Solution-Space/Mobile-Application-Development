import axios from 'axios';
import { Alert, Platform } from 'react-native';
import { 
  Produtor, Telefone, Localizacao, Propriedade, TipoPlantacao, 
  Talhao, SatVeg, SatVegRequestPayload, NasaPower, NasaPowerRequestPayload, AlertaAgricola, PaginatedResponse 
} from '../types';

const api = axios.create({
  // Endereço de IP local da máquina para que dispositivos físicos e emuladores consigam conectar à API Java
  baseURL: 'http://192.168.1.171:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    let msg = 'Ocorreu um erro de conexão com o servidor.';
    if (error.response) {
      if (error.response.status === 400) msg = 'Dados inválidos. Verifique as informações.';
      else if (error.response.status === 404) msg = 'Recurso não encontrado no servidor.';
      else if (error.response.status >= 500) msg = 'Erro interno no servidor.';
      
      // Mapeia erros de validação da API Java: {"erros": [{"campo": "x", "mensagem": "y"}]}
      if (error.response.data && Array.isArray(error.response.data.erros)) {
        msg = error.response.data.erros.map((e: any) => `${e.campo}: ${e.mensagem}`).join('\n');
      } else if (error.response.data && error.response.data.message) {
        msg = error.response.data.message;
      }
    }
    
    if (Platform.OS === 'web') {
      window.alert('Erro na API: ' + msg);
    } else {
      Alert.alert('Erro na API', msg);
    }
    
    return Promise.reject(error);
  }
);

// Helper to extract content from HATEOAS paginated response
const extractContent = <T>(data: any): T[] => {
  if (data && data.content && Array.isArray(data.content)) {
    return data.content as T[];
  }
  if (data && data._embedded) {
    const key = Object.keys(data._embedded)[0];
    return data._embedded[key] as T[];
  }
  if (Array.isArray(data)) {
    return data as T[];
  }
  return [];
};

export const apiService = {
  // ── Produtores ──
  getProdutores: async () => {
    const res = await api.get('/produtores');
    return extractContent<Produtor>(res.data);
  },
  createProdutor: async (data: Omit<Produtor, 'id' | '_links'>) => {
    const res = await api.post<Produtor>('/produtores', data);
    return res.data;
  },
  updateProdutor: async (id: number, data: Partial<Produtor>) => {
    const res = await api.put<Produtor>(`/produtores/${id}`, data);
    return res.data;
  },

  // ── Telefones ──
  getTelefones: async () => {
    const res = await api.get('/telefones');
    return extractContent<Telefone>(res.data);
  },
  createTelefone: async (data: Omit<Telefone, 'id' | '_links'>) => {
    const res = await api.post<Telefone>('/telefones', data);
    return res.data;
  },
  updateTelefone: async (id: number, data: Partial<Telefone>) => {
    const res = await api.put<Telefone>(`/telefones/${id}`, data);
    return res.data;
  },

  // ── Localizacoes ──
  getLocalizacoes: async () => {
    const res = await api.get('/localizacoes');
    return extractContent<Localizacao>(res.data);
  },
  createLocalizacao: async (data: Omit<Localizacao, 'id' | '_links'>) => {
    const res = await api.post<Localizacao>('/localizacoes', data);
    return res.data;
  },

  // ── Propriedades ──
  getPropriedades: async () => {
    const res = await api.get('/propriedades');
    return extractContent<Propriedade>(res.data);
  },
  createPropriedade: async (data: Omit<Propriedade, 'id' | '_links'>) => {
    const res = await api.post<Propriedade>('/propriedades', data);
    return res.data;
  },

  // ── Tipos de Plantacao ──
  getTiposPlantacao: async () => {
    const res = await api.get('/tipos-plantacao');
    return extractContent<TipoPlantacao>(res.data);
  },
  createTipoPlantacao: async (data: Omit<TipoPlantacao, 'id' | '_links'>) => {
    const res = await api.post<TipoPlantacao>('/tipos-plantacao', data);
    return res.data;
  },

  // ── Talhoes ──
  getTalhoes: async () => {
    const res = await api.get('/talhoes');
    return extractContent<Talhao>(res.data);
  },
  createTalhao: async (data: Omit<Talhao, 'id' | '_links'>) => {
    const res = await api.post<Talhao>('/talhoes', data);
    return res.data;
  },
  updateTalhao: async (id: number, data: Partial<Talhao>) => {
    const res = await api.put<Talhao>(`/talhoes/${id}`, data);
    return res.data;
  },
  deleteTalhao: async (id: number) => {
    await api.delete(`/talhoes/${id}`);
  },

  // ── SatVeg & NasaPower (Satelite Integrations) ──
  getSatVegs: async () => {
    const res = await api.get('/satveg');
    return extractContent<SatVeg>(res.data);
  },
  createSatVeg: async (data: SatVegRequestPayload) => {
    const res = await api.post<SatVeg>('/satveg', data);
    return res.data;
  },
  deleteSatVeg: async (id: number) => {
    await api.delete(`/satveg/${id}`);
  },
  getNasaPowers: async () => {
    const res = await api.get('/nasapower');
    return extractContent<NasaPower>(res.data);
  },
  createNasaPower: async (data: NasaPowerRequestPayload) => {
    const res = await api.post<NasaPower>('/nasapower', data);
    return res.data;
  },
  deleteNasaPower: async (id: number) => {
    await api.delete(`/nasapower/${id}`);
  },

  // ── Alertas Agricolas ──
  getAlertas: async () => {
    const res = await api.get('/alertas');
    return extractContent<AlertaAgricola>(res.data);
  },
  createAlerta: async (data: Omit<AlertaAgricola, 'id' | '_links' | 'dataAlerta'>) => {
    const res = await api.post<AlertaAgricola>('/alertas', data);
    return res.data;
  },
  updateAlerta: async (id: number, data: Partial<AlertaAgricola>) => {
    const res = await api.put<AlertaAgricola>(`/alertas/${id}`, data);
    return res.data;
  },
};

export default api;