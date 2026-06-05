// ═══════════════════════════════════════════════════════════════
// Terra Nova — Definições de Tipos (API Java Spring Boot)
// ═══════════════════════════════════════════════════════════════

export interface HateoasLink { href: string; }
export interface HateoasLinks { [key: string]: HateoasLink; }

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface Produtor {
  id: number;
  nome: string;
  email: string;
  senha?: string;
  _links?: HateoasLinks;
}

export interface Telefone {
  id: number;
  ddd: string;
  numero: string;
  idProdutor: number;
  _links?: HateoasLinks;
}

export interface Localizacao {
  id: number;
  locLatitude: number;
  locLongitude: number;
  _links?: HateoasLinks;
}

export interface Propriedade {
  id: number;
  nome: string;
  tamanhoTotal: number;
  idProdutor: number;
  idLocalizacao: number;
  _links?: HateoasLinks;
}

export interface TipoPlantacao {
  id: number;
  tipoPlant: string;
  _links?: HateoasLinks;
}

export interface Talhao {
  id: number;
  nomeTalhao: string;
  volumArea: number;
  idTipoPlantacao: number;
  idPropriedade: number;
  idLocalizacao: number;
  status?: 'NORMAL' | 'CRITICO' | 'ATENCAO';
  _links?: HateoasLinks;
}

export interface DadoTemporal {
  idDado: number;
  dataLeitura: string;
  valor: number;
  idTalhao: number;
  idReqApi: number;
  tipoApiNome: string;
  tipoParam: string;
}

export interface ReqApiPayload {
  tipoParam: string;
  tipoApiNome: string;
  idTalhao: number;
}

export interface ReqApi {
  id: number;
  tipoParam: string;
  dataAnalise: string;
  tipoApiNome: string;
  idTipoApi: number;
}

export interface AlertaAgricola {
  id: number;
  titulo: string;
  descricao: string;
  nivelAlerta: 'ALTO' | 'MEDIO' | 'BAIXO' | 'CRITICO';
  resolvido: 'S' | 'N';
  dataAlerta?: string;
  idTalhao: number;
  _links?: HateoasLinks;
}

export type TipoLog = 'criacao' | 'edicao' | 'exclusao' | 'alerta' | 'sistema';

export interface LogAtividade {
  id: string;
  tipo: TipoLog;
  mensagem: string;
  usuario: string;
  timestamp: string;
}


export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Tabs: undefined;
  Propriedades: undefined;
  GerenciarPropriedades: undefined;
  Logs: undefined;
  EditarPerfil: undefined;
  Faq: undefined;
  Sobre: undefined;
  Alertas: undefined;
  CriarAlerta: { editAlertaId?: number } | undefined;
  GerenciarTalhoes: { editId?: number } | undefined;
  AnaliseDetalhes: {
    type: 'nasa' | 'satveg';
    id: number;
    title: string;
    subtitle: string;
  };
};