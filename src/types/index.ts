// ═══════════════════════════════════════════════════════════════
// Terra Nova — TypeScript Types
// ═══════════════════════════════════════════════════════════════

// ── Usuário ────────────────────────────────────────
export interface User {
  id: string;
  nome: string;
  email: string;
  senha: string;
  avatar?: string;
  criadoEm: string;
}

// ── Lote de Cultivo ────────────────────────────────
export type FaseCrescimento = 'Germinando' | 'Crescendo' | 'Maduro' | 'Pronto para Colheita' | 'Colhido' | 'Perdido';
export type StatusLote = 'Saudável' | 'Atenção' | 'Crítico';
export type TipoCultura = 'Batata' | 'Tomate' | 'Alface' | 'Cenoura' | 'Morango' | 'Soja' | 'Trigo' | 'Espinafre';

export interface Lote {
  id: string;
  tipoCultura: TipoCultura;
  estufaId: string;
  estufaNome: string;
  dataPlantio: string;
  fase: FaseCrescimento;
  status: StatusLote;
  quantidade: number;
  observacoes: string;
  criadoPor: string;
  atualizadoEm: string;
}

// ── Estufa ──────────────────────────────────────────
export type TipoEstufa = 'Hidropônica' | 'Aeropônica' | 'Aquapônica' | 'Tradicional';
export type StatusEstufa = 'Operacional' | 'Manutenção' | 'Offline' | 'Emergência';

export interface Estufa {
  id: string;
  nome: string;
  tipo: TipoEstufa;
  status: StatusEstufa;
  capacidade: number;
  lotesAtivos: number;
  temperatura: number;
  umidade: number;
  nivelAgua: number;
  luminosidade: number;
  co2: number;
}

// ── Estoque / Insumo ────────────────────────────────
export type CategoriaInsumo = 'Semente' | 'Adubo' | 'Nutriente' | 'Fertilizante' | 'Pesticida' | 'Substrato';

export interface Insumo {
  id: string;
  nome: string;
  categoria: CategoriaInsumo;
  quantidade: number;
  unidade: string;
  minimo: number;
  atualizadoEm: string;
}

// ── Colheita ────────────────────────────────────────
export interface Colheita {
  id: string;
  loteId: string;
  tipoCultura: TipoCultura;
  estufaNome: string;
  dataColheita: string;
  quantidadeKg: number;
  qualidade: 'Excelente' | 'Boa' | 'Regular' | 'Ruim';
}

// ── Log de Atividade ────────────────────────────────
export type TipoLog = 'criacao' | 'edicao' | 'exclusao' | 'colheita' | 'alerta' | 'sistema';

export interface LogAtividade {
  id: string;
  tipo: TipoLog;
  mensagem: string;
  usuario: string;
  timestamp: string;
}

// ── Tarefa / Agendamento ────────────────────────────
export type PrioridadeTarefa = 'Baixa' | 'Média' | 'Alta' | 'Urgente';

export interface Tarefa {
  id: string;
  titulo: string;
  descricao: string;
  estufaId?: string;
  estufaNome?: string;
  dataAgendada: string;
  prioridade: PrioridadeTarefa;
  concluida: boolean;
  criadaEm: string;
}

// ── Alerta de Evento Crítico ────────────────────────
export type TipoEvento = 'falta_energia' | 'praga_detectada' | 'falha_irrigacao' | 'surto_temperatura' | 'contaminacao';

export interface EventoCritico {
  id: string;
  tipo: TipoEvento;
  titulo: string;
  descricao: string;
  severidade: 'Alta' | 'Crítica';
  estufasAfetadas: string[];
  timestamp: string;
  resolvido: boolean;
}

// ── Navegação ───────────────────────────────────────
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Tabs: undefined;
  Estufas: undefined;
  Colheitas: undefined;
  Logs: undefined;
  Tarefas: undefined;
};
