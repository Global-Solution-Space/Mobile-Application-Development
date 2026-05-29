// ═══════════════════════════════════════════════════════════════
// Terra Nova — Definições de Tipos (Dicionário do Sistema)
// ═══════════════════════════════════════════════════════════════

export interface User {
  id: string;
  nome: string;
  email: string;
  senha?: string;
  base?: string; // Adicionado para o seu Perfil!
  criadoEm: string;
}

export type StatusLote = 'Saudável' | 'Atenção' | 'Crítico';
export type TipoCultura = 'Tomate' | 'Alface' | 'Batata' | 'Morango' | 'Espinafre' | 'Cenoura' | string;

export interface Lote {
  id: string;
  tipoCultura: TipoCultura;
  estufaId?: string;
  estufaNome?: string;
  dataPlantio: string;
  fase: string;
  status: StatusLote;
  quantidade: number;
  observacoes?: string;
  criadoPor: string;
  atualizadoEm: string;
}

export interface RegistroIrrigacao {
  id: string;
  lote_id: string;
  quantidade_agua_ml: number;
  data_hora: string;
  tipo_acionamento: string;
}

export interface Estufa {
  id: string;
  nome: string;
  tipo: string;
  status: string;
  capacidade?: number;
  lotesAtivos?: number;
  temperatura?: number;
  umidade?: number;
  nivelAgua?: number;
  luminosidade?: number;
  co2?: number;
}

export interface Insumo {
  id: string;
  nome: string;
  categoria?: string;
  tipo?: string;
  quantidade: number;
  unidade: string;
  minimo?: number;
  quantidadeMinima?: number;
  atualizadoEm?: string;
}

export interface Colheita {
  id: string;
  loteId: string;
  tipoCultura: string;
  estufaNome?: string;
  dataColheita: string;
  quantidadeKg: number;
  qualidade: string;
}

export type TipoLog = 'criacao' | 'edicao' | 'exclusao' | 'colheita' | 'alerta' | 'sistema';

export interface LogAtividade {
  id: string;
  tipo: TipoLog;
  mensagem: string;
  usuario: string;
  timestamp: string;
}

export interface Tarefa {
  id: string;
  titulo: string;
  descricao: string;
  estufaId?: string;
  estufaNome?: string;
  dataAgendada: string;
  prioridade: 'Baixa' | 'Média' | 'Alta' | 'Urgente' | string;
  concluida: boolean;
  criadaEm: string;
}

export type TipoEvento = 'falta_energia' | 'praga_detectada' | 'falha_irrigacao' | 'surto_temperatura' | 'contaminacao' | string;

export interface EventoCritico {
  id: string;
  tipo: TipoEvento;
  titulo: string;
  descricao: string;
  severidade: 'Alta' | 'Crítica' | string;
  estufasAfetadas: string[];
  timestamp: string;
  resolvido: boolean;
}