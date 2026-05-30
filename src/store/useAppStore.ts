// ═══════════════════════════════════════════════════════════════
// Terra Nova — Zustand Store
// Gerenciamento global de estado com persistência AsyncStorage
// VERSÃO DE INTEGRAÇÃO (Chave de alternância para o Back-end)
// ═══════════════════════════════════════════════════════════════

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/api';
import {
  User, Lote, Estufa, Insumo, Colheita,
  LogAtividade, Tarefa, EventoCritico,
  StatusLote, TipoCultura, TipoLog,
  RegistroIrrigacao, TipoEvento
} from '../types';

// ── CONFIGURAÇÃO DE AMBIENTE (O ENZO MUDA AQUI PARA TRUE) ──────
const USE_BACKEND = false; 

const uuid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
const now = () => new Date().toISOString();

const ESTUFAS_INICIAIS: Estufa[] = [
  { id: 'e1', nome: 'Estufa Alfa', tipo: 'Hidropônica', status: 'Operacional', capacidade: 50, lotesAtivos: 3, temperatura: 24.5, umidade: 72, nivelAgua: 85, luminosidade: 12, co2: 410 },
  { id: 'e2', nome: 'Estufa Beta', tipo: 'Aeropônica', status: 'Operacional', capacidade: 40, lotesAtivos: 2, temperatura: 23.8, umidade: 68, nivelAgua: 78, luminosidade: 15, co2: 395 },
  { id: 'e3', nome: 'Estufa Gama', tipo: 'Aquapônica', status: 'Manutenção', capacidade: 35, lotesAtivos: 1, temperatura: 22.1, umidade: 80, nivelAgua: 60, luminosidade: 10, co2: 420 },
  { id: 'e4', nome: 'Estufa Delta', tipo: 'Tradicional', status: 'Operacional', capacidade: 60, lotesAtivos: 0, temperatura: 25.2, umidade: 65, nivelAgua: 90, luminosidade: 18, co2: 380 },
];

const LOTES_INICIAIS: Lote[] = [
  { id: 'l1', tipoCultura: 'Tomate', estufaId: 'e1', estufaNome: 'Estufa Alfa', dataPlantio: '2026-05-01', fase: 'Crescendo', status: 'Saudável', quantidade: 120, observacoes: 'Crescimento dentro do esperado', criadoPor: 'Enzo', atualizadoEm: now() },
  { id: 'l2', tipoCultura: 'Alface', estufaId: 'e1', estufaNome: 'Estufa Alfa', dataPlantio: '2026-04-20', fase: 'Maduro', status: 'Saudável', quantidade: 80, observacoes: 'Pronto para colheita em breve', criadoPor: 'Enzo', atualizadoEm: now() },
  { id: 'l3', tipoCultura: 'Batata', estufaId: 'e2', estufaNome: 'Estufa Beta', dataPlantio: '2026-05-10', fase: 'Germinando', status: 'Atenção', quantidade: 200, observacoes: 'Nível de nutrientes baixo', criadoPor: 'Enzo', atualizadoEm: now() },
  { id: 'l4', tipoCultura: 'Morango', estufaId: 'e1', estufaNome: 'Estufa Alfa', dataPlantio: '2026-03-15', fase: 'Pronto para Colheita', status: 'Saudável', quantidade: 50, observacoes: 'Colheita pode ser realizada', criadoPor: 'Enzo', atualizadoEm: now() },
  { id: 'l5', tipoCultura: 'Espinafre', estufaId: 'e2', estufaNome: 'Estufa Beta', dataPlantio: '2026-05-05', fase: 'Crescendo', status: 'Crítico', quantidade: 90, observacoes: 'Luminosidade acima do limite', criadoPor: 'Enzo', atualizadoEm: now() },
  { id: 'l6', tipoCultura: 'Cenoura', estufaId: 'e3', estufaNome: 'Estufa Gama', dataPlantio: '2026-04-28', fase: 'Germinando', status: 'Saudável', quantidade: 150, observacoes: 'Tudo normal', criadoPor: 'Enzo', atualizadoEm: now() },
];

const INSUMOS_INICIAIS: Insumo[] = [
  { id: 'i1', nome: 'Semente de Tomate', categoria: 'Semente', tipo: 'Semente', quantidade: 500, unidade: 'unidades', minimo: 100, quantidadeMinima: 100, atualizadoEm: now() },
  { id: 'i2', nome: 'Adubo NPK 10-10-10', categoria: 'Adubo', tipo: 'Fertilizante', quantidade: 25, unidade: 'kg', minimo: 10, quantidadeMinima: 10, atualizadoEm: now() },
  { id: 'i3', nome: 'Nutriente Hidropônico A', categoria: 'Nutriente', tipo: 'Nutriente', quantidade: 15, unidade: 'L', minimo: 5, quantidadeMinima: 5, atualizadoEm: now() },
  { id: 'i4', nome: 'Semente de Alface', categoria: 'Semente', tipo: 'Semente', quantidade: 300, unidade: 'unidades', minimo: 50, quantidadeMinima: 50, atualizadoEm: now() },
  { id: 'i5', nome: 'Fertilizante Orgânico', categoria: 'Fertilizante', tipo: 'Fertilizante', quantidade: 8, unidade: 'kg', minimo: 10, quantidadeMinima: 10, atualizadoEm: now() },
  { id: 'i6', nome: 'Substrato de Coco', categoria: 'Substrato', tipo: 'Defensivo', quantidade: 40, unidade: 'kg', minimo: 15, quantidadeMinima: 15, atualizadoEm: now() },
];

const COLHEITAS_INICIAIS: Colheita[] = [
  { id: 'c1', loteId: 'l0', tipoCultura: 'Tomate', estufaNome: 'Estufa Alfa', dataColheita: '2026-04-15', quantidadeKg: 35.5, qualidade: 'Excelente' },
  { id: 'c2', loteId: 'l0', tipoCultura: 'Alface', estufaNome: 'Estufa Beta', dataColheita: '2026-04-10', quantidadeKg: 12.8, qualidade: 'Boa' },
  { id: 'c3', loteId: 'l0', tipoCultura: 'Morango', estufaNome: 'Estufa Alfa', dataColheita: '2026-03-28', quantidadeKg: 8.2, qualidade: 'Excelente' },
  { id: 'c4', loteId: 'l0', tipoCultura: 'Batata', estufaNome: 'Estufa Gama', dataColheita: '2026-03-20', quantidadeKg: 45.0, qualidade: 'Regular' },
  { id: 'c5', loteId: 'l0', tipoCultura: 'Espinafre', estufaNome: 'Estufa Beta', dataColheita: '2026-05-01', quantidadeKg: 6.5, qualidade: 'Boa' },
];

const LOGS_INICIAIS: LogAtividade[] = [
  { id: 'log1', tipo: 'criacao', mensagem: 'Produtor Enzo cadastrou o Lote 01 (Tomate) na Estufa Alfa', usuario: 'Enzo', timestamp: '2026-05-27T14:30:00Z' },
  { id: 'log2', tipo: 'edicao', mensagem: 'Produtor Enzo alterou o status do Lote 03 para "Atenção"', usuario: 'Enzo', timestamp: '2026-05-27T15:00:00Z' },
  { id: 'log3', tipo: 'colheita', mensagem: 'Colheita registrada: 35.5kg de Tomate na Estufa Alfa', usuario: 'Sistema', timestamp: '2026-05-27T16:00:00Z' },
  { id: 'log4', tipo: 'alerta', mensagem: 'Luminosidade acima do limite na Estufa Beta — Lote 05 em risco', usuario: 'Sistema', timestamp: '2026-05-27T16:30:00Z' },
  { id: 'log5', tipo: 'sistema', mensagem: 'Sistema de irrigação da Estufa Gama reiniciado com sucesso', usuario: 'Sistema', timestamp: '2026-05-27T17:00:00Z' },
];

const TAREFAS_INICIAIS: Tarefa[] = [
  { id: 't1', titulo: 'Irrigação Estufa Alfa', descricao: 'Verificar sistema de irrigação hidropônica', estufaId: 'e1', estufaNome: 'Estufa Alfa', dataAgendada: '2026-05-28T08:00:00Z', prioridade: 'Alta', concluida: false, criadaEm: now() },
  { id: 't2', titulo: 'Checagem de Luminosidade', descricao: 'Medir níveis de luminosidade na Estufa Beta', estufaId: 'e2', estufaNome: 'Estufa Beta', dataAgendada: '2026-05-28T10:00:00Z', prioridade: 'Urgente', concluida: false, criadaEm: now() },
  { id: 't3', titulo: 'Repor Fertilizante', descricao: 'Estoque de fertilizante orgânico abaixo do mínimo', estufaId: undefined, estufaNome: undefined, dataAgendada: '2026-05-29T09:00:00Z', prioridade: 'Média', concluida: false, criadaEm: now() },
  { id: 't4', titulo: 'Colheita Lote 04', descricao: 'Morangos prontos para colheita', estufaId: 'e1', estufaNome: 'Estufa Alfa', dataAgendada: '2026-05-28T14:00:00Z', prioridade: 'Alta', concluida: true, criadaEm: now() },
];

export interface AppStore {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  currentUser: User | null;
  isLoggedIn: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  register: (nome: string, email: string, senha: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (nome: any) => Promise<void>;
  registeredUsers: User[];
  lotes: Lote[];
  addLote: (lote: Omit<Lote, 'id' | 'atualizadoEm' | 'criadoPor'>) => Promise<void>;
  updateLote: (id: string, updates: Partial<Lote>) => Promise<void>;
  deleteLote: (id: string) => Promise<void>;
  historicoIrrigacao: RegistroIrrigacao[];
  registrarIrrigacao: (loteId: string, ml: number, tipo: string) => Promise<void>;
  deleteIrrigacao: (id: string) => Promise<void>;
  filtroStatus: StatusLote | 'Todos';
  filtroCultura: TipoCultura | 'Todas';
  setFiltroStatus: (f: StatusLote | 'Todos') => void;
  setFiltroCultura: (f: TipoCultura | 'Todas') => void;
  estufas: Estufa[];
  sincronizarSensoresSatelite: (estufaId: string, lat: number, lon: number) => Promise<void>;
  insumos: Insumo[];
  addInsumo: (insumo: any) => Promise<void>;
  updateInsumo: (id: string, updates: any) => Promise<void>;
  deleteInsumo: (id: string) => Promise<void>;
  colheitas: Colheita[];
  addColheita: (colheita: Omit<Colheita, 'id'>) => Promise<void>;
  logs: LogAtividade[];
  addLog: (tipo: TipoLog, mensagem: string) => void;
  tarefas: Tarefa[];
  addTarefa: (tarefa: Omit<Tarefa, 'id' | 'criadaEm' | 'concluida'>) => Promise<void>;
  toggleTarefa: (id: string) => Promise<void>;
  deleteTarefa: (id: string) => Promise<void>;
  eventoCritico: EventoCritico | null;
  simularEvento: () => void;
  resolverEvento: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),

      currentUser: null,
      isLoggedIn: false,
      registeredUsers: [
        { id: 'u1', nome: 'Enzo', email: 'enzo@terranova.com', senha: '123456', criadoEm: now() },
      ],

      login: async (email, senha) => {
        set({ isLoading: true });
        try {
          const user = get().registeredUsers.find(u => u.email === email && u.senha === senha);
          if (user) {
            set({ currentUser: user, isLoggedIn: true });
            get().addLog('sistema', `Produtor ${user.nome} fez login no sistema`);
            return true;
          }
          return false;
        } catch (error) {
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (nome, email, senha) => {
        set({ isLoading: true });
        try {
          const exists = get().registeredUsers.find(u => u.email === email);
          if (exists) return false;
          const newUser: User = { id: uuid(), nome, email, senha, criadoEm: now(), base: 'Marte Alpha' };
          set(s => ({
            registeredUsers: [...s.registeredUsers, newUser],
            currentUser: newUser,
            isLoggedIn: true,
          }));
          get().addLog('sistema', `Novo produtor ${nome} registrado no sistema`);
          return true;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        const user = get().currentUser;
        if (user) get().addLog('sistema', `Produtor ${user.nome} saiu do sistema`);
        set({ currentUser: null, isLoggedIn: false });
      },

      updateProfile: async (updates) => {
        set({ isLoading: true });
        try {
          const user = get().currentUser;
          if (!user) return;
          set(s => {
            if (!s.currentUser) return s;
            const updated = { ...s.currentUser, ...updates };
            return {
              currentUser: updated as User,
              registeredUsers: s.registeredUsers.map(u => u.id === updated.id ? updated : u) as User[],
            };
          });
          get().addLog('edicao', `Produtor atualizou seu perfil`);
        } finally {
          set({ isLoading: false });
        }
      },

      lotes: LOTES_INICIAIS,

      addLote: async (lote) => {
        set({ isLoading: true });
        try {
          if (USE_BACKEND) {
            const loteSalvoServidor = await apiService.salvarLote(lote);
            set(s => ({ lotes: [...s.lotes, loteSalvoServidor] }));
          } else {
            const user = get().currentUser;
            const newLote: Lote = { ...lote, id: uuid(), atualizadoEm: now(), criadoPor: user?.nome || 'Sistema' };
            set(s => ({ lotes: [...s.lotes, newLote] }));
          }
          get().addLog('criacao', `Lote cadastrado com sucesso`);
        } catch (e) {
          console.error(e);
        } finally {
          set({ isLoading: false });
        }
      },

      updateLote: async (id, updates) => {
        set({ isLoading: true });
        try {
          set(s => ({
            lotes: s.lotes.map(l => l.id === id ? { ...l, ...updates, atualizadoEm: now() } : l),
          }));
        } finally {
          set({ isLoading: false });
        }
      },

      deleteLote: async (id) => {
        set({ isLoading: true });
        try {
          set(s => ({ lotes: s.lotes.filter(l => l.id !== id) }));
        } finally {
          set({ isLoading: false });
        }
      },

      historicoIrrigacao: [
        { id: 'ir1', lote_id: 'l1', quantidade_agua_ml: 500, data_hora: new Date().toISOString(), tipo_acionamento: 'Automático' }
      ],

      registrarIrrigacao: async (loteId, ml, tipo) => {
        set({ isLoading: true });
        try {
          if (USE_BACKEND) {
            await apiService.registrarIrrigacao(loteId, ml, tipo);
          }
          
          set(s => {
            const loteRegado = s.lotes.find(l => l.id === loteId);
            let novasEstufas = s.estufas;
            if (loteRegado && loteRegado.estufaId) {
              novasEstufas = s.estufas.map(e => {
                if (e.id === loteRegado.estufaId) {
                  const aumento = (ml / 100) * 2; 
                  return { ...e, nivelAgua: Math.min(100, (e.nivelAgua || 0) + aumento) };
                }
                return e;
              });
            }
            const novoRegistro: RegistroIrrigacao = { id: uuid(), lote_id: loteId, quantidade_agua_ml: ml, data_hora: now(), tipo_acionamento: tipo };
            return { historicoIrrigacao: [novoRegistro, ...s.historicoIrrigacao], estufas: novasEstufas };
          });
        } finally {
          set({ isLoading: false });
        }
      },

      deleteIrrigacao: async (id) => {
        set({ isLoading: true });
        try {
          set(s => ({ historicoIrrigacao: s.historicoIrrigacao.filter(h => h.id !== id) }));
        } finally {
          set({ isLoading: false });
        }
      },

      filtroStatus: 'Todos',
      filtroCultura: 'Todas',
      setFiltroStatus: (f) => set({ filtroStatus: f }),
      setFiltroCultura: (f) => set({ filtroCultura: f }),

      estufas: ESTUFAS_INICIAIS,

      // ── CONEXÃO COM A NASA/EMBRAPA + IA (Pronto para o Enzo) ──
      sincronizarSensoresSatelite: async (estufaId, lat, lon) => {
        set({ isLoading: true });
        try {
          if (USE_BACKEND) {
            // Puxa a resposta processada pelo Java do Enzo (NASA + SATveg + LLM)
            const dadosProcessados = await apiService.analisarTerreno(estufaId, { latitude: lat, longitude: lon });
            
            set(s => ({
              estufas: s.estufas.map(e => e.id === estufaId ? { 
                ...e, 
                temperatura: dadosProcessados.temperatura,
                nivelAgua: dadosProcessados.umidadeSolo,
                luminosidade: dadosProcessados.indiceUV,
                co2: dadosProcessados.co2Atm
              } : e)
            }));
          }
        } catch (error) {
          console.error("Erro na sincronização de satélites do backend:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      insumos: INSUMOS_INICIAIS,

      addInsumo: async (insumo) => {
        set({ isLoading: true });
        try {
          const newInsumo: Insumo = { ...insumo, id: uuid(), categoria: insumo.tipo || 'Semente', tipo: insumo.tipo || 'Semente', minimo: insumo.quantidadeMinima || 10, quantidadeMinima: insumo.quantidadeMinima || 10, atualizadoEm: now() };
          set(s => ({ insumos: [newInsumo, ...s.insumos] }));
        } finally {
          set({ isLoading: false });
        }
      },

      updateInsumo: async (id, updates) => {
        set({ isLoading: true });
        try {
          set(s => ({
            insumos: s.insumos.map(i => i.id === id ? { ...i, ...updates, atualizadoEm: now() } : i),
          }));
        } finally {
          set({ isLoading: false });
        }
      },

      deleteInsumo: async (id) => {
        set({ isLoading: true });
        try {
          set(s => ({ insumos: s.insumos.filter(i => i.id !== id) }));
        } finally {
          set({ isLoading: false });
        }
      },

      colheitas: COLHEITAS_INICIAIS,

      addColheita: async (colheita) => {
        set({ isLoading: true });
        try {
          const newColheita: Colheita = { ...colheita, id: uuid() };
          set(s => ({ colheitas: [...s.colheitas, newColheita] }));
        } finally {
          set({ isLoading: false });
        }
      },

      logs: LOGS_INICIAIS,

      addLog: (tipo, mensagem) => {
        const user = get().currentUser;
        const newLog: LogAtividade = { id: uuid(), tipo, mensagem, usuario: user?.nome || 'Sistema', timestamp: now() };
        set(s => ({ logs: [newLog, ...s.logs] }));
      },

      tarefas: TAREFAS_INICIAIS,

      addTarefa: async (tarefa) => {
        set({ isLoading: true });
        try {
          const newTarefa: Tarefa = { ...tarefa, id: uuid(), criadaEm: now(), concluida: false };
          set(s => ({ tarefas: [...s.tarefas, newTarefa] }));
        } finally {
          set({ isLoading: false });
        }
      },

      toggleTarefa: async (id) => {
        set({ isLoading: true });
        try {
          set(s => ({
            tarefas: s.tarefas.map(t => t.id === id ? { ...t, concluida: !t.concluida } : t),
          }));
        } finally {
          set({ isLoading: false });
        }
      },

      deleteTarefa: async (id) => {
        set({ isLoading: true });
        try {
          set(s => ({ tarefas: s.tarefas.filter(t => t.id !== id) }));
        } finally {
          set({ isLoading: false });
        }
      },

      eventoCritico: null,

      simularEvento: () => {
        const eventos = [
          { tipo: 'falta_energia', titulo: '🛰️ Alerta de Satélite: Chuva Extrema', descricao: 'Imagens de satélite indicam tempestade severa se aproximando da Estufa Beta. Risco de alagamento.' },
          { tipo: 'praga_detectada', titulo: '🛰️ Satélite: Anomalia Foliar', descricao: 'Análise espectral detectou perda de vigor vegetativo nas culturas. Possível ataque de pragas.' },
          { tipo: 'falha_irrigacao', titulo: '💧 Falha no Sistema de Irrigação', descricao: 'Bomba principal da Estufa Alfa apresentou falha. Irrigação de emergência ativada.' },
        ];
        const evento = eventos[Math.floor(Math.random() * eventos.length)];
        const ec: EventoCritico = { id: uuid(), ...evento, severidade: 'Crítica', estufasAfetadas: ['Estufa Alfa', 'Estufa Beta'], timestamp: now(), resolvido: false };
        set({ eventoCritico: ec });
      },

      resolverEvento: () => set({ eventoCritico: null }),
    }),
    {
      name: 'terranova-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => {
        const { isLoading, ...rest } = state;
        return rest;
      }
    }
  )
);