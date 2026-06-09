import axios, { type AxiosRequestConfig } from 'axios';
import { Alert } from 'react-native';
import { 
  Produtor, Telefone, Localizacao, Propriedade, TipoPlantacao, 
  Talhao, ReqApiPayload, ReqApi, DadoTemporal, AlertaAgricola, PaginatedResponse 
} from '../types';
import { z } from 'zod';
import { 
  ProdutorResponseSchema, TelefoneResponseSchema, LocalizacaoResponseSchema,
  PropriedadeResponseSchema, TipoPlantacaoResponseSchema, TalhaoResponseSchema,
  AlertaAgricolaResponseSchema, DadoTemporalResponseSchema, ReqApiResponseSchema
} from '../schemas';

declare module 'axios' {
  export interface AxiosRequestConfig {
    suppressErrorAlert?: boolean;
  }
}
type ApiRequestOptions = {
  suppressErrorAlert?: boolean;
};

const toRequestConfig = (options?: ApiRequestOptions): AxiosRequestConfig => ({
  suppressErrorAlert: options?.suppressErrorAlert,
});

const api = axios.create({
  baseURL: 'https://java-advanced-production.up.railway.app/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface ValidationErrorItem {
  campo: string;
  mensagem: string;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.config?.suppressErrorAlert) {
      return Promise.reject(error);
    }

    let msg = 'Ocorreu um erro de conexão com o servidor.';
    if (error.response) {
      if (error.response.status === 400) msg = 'Dados inválidos. Verifique as informações.';
      else if (error.response.status === 404) msg = 'Recurso não encontrado no servidor.';
      else if (error.response.status >= 500) msg = 'Erro interno no servidor.';
      
      // Mapeia erros de validação da API Java: {"erros": [{"campo": "x", "mensagem": "y"}]}
      if (error.response.data && Array.isArray(error.response.data.erros)) {
        msg = error.response.data.erros.map((e: ValidationErrorItem) => `${e.campo}: ${e.mensagem}`).join('\n');
      } else if (error.response.data && error.response.data.message) {
        msg = error.response.data.message;
      }
    }
    
    Alert.alert('Erro na API', msg);
    return Promise.reject(error);
  }
);

// Helper to extract content from HATEOAS paginated response and validate it via Zod
const extractAndValidate = <T>(data: any, schema: z.ZodType<T>): T[] => {
  let arr: any[] = [];
  if (data && data.content && Array.isArray(data.content)) {
    // Se o backend enviar EntityModel não flattado, cada item terá uma propriedade 'content'
    arr = data.content.map((item: any) => (item && item.content) ? item.content : item);
  } else if (data && data._embedded) {
    const key = Object.keys(data._embedded)[0];
    arr = data._embedded[key].map((item: any) => (item && item.content) ? item.content : item);
  } else if (Array.isArray(data)) {
    arr = data;
  }
  
  // Camada Anti-Corrupção (ACL): Valida o array inteiro.
  const result = z.array(schema).safeParse(arr);
  if (!result.success) {
    console.warn("⚠️ API Data Corruption Detected. Filtrando itens corrompidos...", result.error);
    // Em vez de crashar a lista toda (fail-fast), tenta salvar os itens saudáveis (fail-safe)
    return arr.filter((item): item is T => schema.safeParse(item).success);
  }
  
  return result.data;
};

const extractOneAndValidate = <T>(data: any, schema: z.ZodType<T>): T => {
  const item = data && data.content ? data.content : data;
  return schema.parse(item);
};

export const apiService = {
  // ── Produtores ──
  getProdutores: async (options?: ApiRequestOptions) => {
    const res = await api.get('/produtores', toRequestConfig(options));
    return extractAndValidate<Produtor>(res.data, ProdutorResponseSchema);
  },
  getProdutor: async (id: number, options?: ApiRequestOptions) => {
    const res = await api.get(`/produtores/${id}`, toRequestConfig(options));
    return extractOneAndValidate<Produtor>(res.data, ProdutorResponseSchema);
  },
  createProdutor: async (data: Omit<Produtor, 'id' | '_links'> & { telefone?: { ddd: string; numero: string } }) => {
    const res = await api.post<Produtor>('/produtores', data);
    return res.data;
  },
  updateProdutor: async (id: number, data: Partial<Produtor>) => {
    const res = await api.put<Produtor>(`/produtores/${id}`, data);
    return res.data;
  },

  // ── Telefones ──
  getTelefones: async (options?: ApiRequestOptions) => {
    const res = await api.get('/telefones', toRequestConfig(options));
    return extractAndValidate<Telefone>(res.data, TelefoneResponseSchema);
  },
  getTelefone: async (id: number, options?: ApiRequestOptions) => {
    const res = await api.get(`/telefones/${id}`, toRequestConfig(options));
    return extractOneAndValidate<Telefone>(res.data, TelefoneResponseSchema);
  },
  createTelefone: async (data: Omit<Telefone, 'id' | '_links'>) => {
    const res = await api.post<Telefone>('/telefones', data);
    return res.data;
  },
  updateTelefone: async (id: number, data: Omit<Telefone, '_links'>) => {
    const res = await api.put<Telefone>(`/telefones/${id}`, data);
    return res.data;
  },

  // ── Localizacoes ──
  getLocalizacoes: async (options?: ApiRequestOptions) => {
    const res = await api.get('/localizacoes', toRequestConfig(options));
    return extractAndValidate<Localizacao>(res.data, LocalizacaoResponseSchema);
  },
  createLocalizacao: async (data: Omit<Localizacao, 'id' | '_links'>) => {
    const res = await api.post<Localizacao>('/localizacoes', data);
    return res.data;
  },

  // ── Propriedades ──
  getPropriedades: async (options?: ApiRequestOptions) => {
    const res = await api.get('/propriedades', toRequestConfig(options));
    return extractAndValidate<Propriedade>(res.data, PropriedadeResponseSchema);
  },
  getPropriedadesDoProdutor: async (idProdutor: number, options?: ApiRequestOptions) => {
    const res = await api.get(`/propriedades/produtor/${idProdutor}`, toRequestConfig(options));
    return extractAndValidate<Propriedade>(res.data, PropriedadeResponseSchema);
  },
  createPropriedade: async (data: Omit<Propriedade, 'id' | '_links'>) => {
    const res = await api.post<Propriedade>('/propriedades', data);
    return res.data;
  },
  updatePropriedade: async (id: number, data: Partial<Propriedade>) => {
    const res = await api.put<Propriedade>(`/propriedades/${id}`, data);
    return res.data;
  },
  deletePropriedade: async (id: number) => {
    await api.delete(`/propriedades/${id}`);
  },

  // ── Tipos de Plantacao ──
  getTiposPlantacao: async (options?: ApiRequestOptions) => {
    const res = await api.get('/tipos-plantacao', toRequestConfig(options));
    return extractAndValidate<TipoPlantacao>(res.data, TipoPlantacaoResponseSchema);
  },
  createTipoPlantacao: async (data: Omit<TipoPlantacao, 'id' | '_links'>) => {
    const res = await api.post<TipoPlantacao>('/tipos-plantacao', data);
    return res.data;
  },

  // ── Talhoes ──
  getTalhoes: async (options?: ApiRequestOptions) => {
    const res = await api.get('/talhoes', toRequestConfig(options));
    return extractAndValidate<Talhao>(res.data, TalhaoResponseSchema);
  },
  getTalhoesDoProdutor: async (idProdutor: number, options?: ApiRequestOptions) => {
    const res = await api.get(`/talhoes/produtor/${idProdutor}`, toRequestConfig(options));
    return extractAndValidate<Talhao>(res.data, TalhaoResponseSchema);
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

  // ── ReqApi (SatVeg & NasaPower unificados) ──
  createReqApi: async (data: ReqApiPayload) => {
    const res = await api.post<ReqApi>('/req-api', data);
    return res.data;
  },
  getReqApisByTalhao: async (idTalhao: number, options?: ApiRequestOptions) => {
    const res = await api.get(`/req-api/talhao/${idTalhao}?size=100`, toRequestConfig(options));
    return extractAndValidate<ReqApi>(res.data, ReqApiResponseSchema);
  },
  deleteReqApi: async (id: number) => {
    await api.delete(`/req-api/${id}`);
  },

  // ── Dados Temporais (Resultados das APIs unificados) ──
  getDadosTemporaisByReqApi: async (idReqApi: number, size: number = 3000, options?: ApiRequestOptions) => {
    const res = await api.get(`/dados-temporais/req-api/${idReqApi}?size=${size}`, toRequestConfig(options));
    return extractAndValidate<DadoTemporal>(res.data, DadoTemporalResponseSchema);
  },

  // ── Alertas Agricolas ──
  getAlertas: async (options?: ApiRequestOptions) => {
    const res = await api.get('/alertas', toRequestConfig(options));
    return extractAndValidate<AlertaAgricola>(res.data, AlertaAgricolaResponseSchema);
  },
  getAlertasDoProdutor: async (idProdutor: number, options?: ApiRequestOptions) => {
    const res = await api.get(`/alertas/produtor/${idProdutor}`, toRequestConfig(options));
    return extractAndValidate<AlertaAgricola>(res.data, AlertaAgricolaResponseSchema);
  },
  createAlerta: async (data: Omit<AlertaAgricola, 'id' | '_links' | 'dataAlerta'>) => {
    const res = await api.post<AlertaAgricola>('/alertas', data);
    return res.data;
  },
  updateAlerta: async (id: number, data: Partial<AlertaAgricola>) => {
    const res = await api.put<AlertaAgricola>(`/alertas/${id}`, data);
    return res.data;
  },
  resolveAlerta: async (id: number) => {
    const res = await api.patch<AlertaAgricola>(`/alertas/${id}/resolver`);
    return res.data;
  },
  reabrirAlerta: async (id: number) => {
    const res = await api.patch<AlertaAgricola>(`/alertas/${id}/reabrir`);
    return res.data;
  },
  deleteAlerta: async (id: number) => {
    await api.delete(`/alertas/${id}`);
  },
};

export default api;