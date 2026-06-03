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
  status?: 'NORMAL' | 'CRITICO' | 'ATENCAO' | string;
  _links?: HateoasLinks;
}

export interface SatVeg {
  id: number;
  tipoPerfil: string;
  dataAnalise?: string;
  dados?: { [date: string]: number };
  idTalhao: number;
  _links?: HateoasLinks;
}

export interface SatVegRequestPayload {
  idTalhao: number;
}

export interface NasaPower {
  id: number;
  dataInicio: string;
  dataFim: string;
  parametro: string;
  dataAnalise?: string;
  dados?: { [date: string]: number };
  idTalhao: number;
  _links?: HateoasLinks;
}

export interface NasaPowerRequestPayload {
  dataInicio: string;
  dataFim: string;
  idTalhao: number;
}

export interface AlertaAgricola {
  id: number;
  titulo: string;
  descricao: string;
  nivelAlerta: 'ALTO' | 'MEDIO' | 'BAIXO' | string;
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