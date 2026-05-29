// ═══════════════════════════════════════════════════════════════
// Terra Nova — Store Global (Singleton Imutável)
// Com função para atualizar o Perfil do Usuário
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';

let globalState = {
  isLoggedIn: true,
  // ── UTILIZADOR ATUALIZADO ──
  currentUser: { 
    id: 'u1', 
    nome: 'Luna de Carvalho', 
    email: 'luna@terranova.com', 
    base: 'Marte Alpha',
    criadoEm: new Date().toLocaleDateString('pt-BR') 
  },
  
  estufas: [
    { id: 'e1', nome: 'Estufa Alfa', status: 'Operacional', tipo: 'Hidropônica' },
    { id: 'e2', nome: 'Estufa Beta', status: 'Operacional', tipo: 'Tradicional' }
  ],
  lotes: [
    { id: 'l1', tipoCultura: 'Tomate', quantidade: 120, fase: 'Crescendo', status: 'Saudável', estufaNome: 'Estufa Alfa', dataPlantio: '2026-05-20' },
    { id: 'l2', tipoCultura: 'Alface', quantidade: 80, fase: 'Maduro', status: 'Atenção', estufaNome: 'Estufa Beta', dataPlantio: '2026-05-15' }
  ],
  historicoIrrigacao: [
    { id: 'ir1', lote_id: 'l1', quantidade_agua_ml: 500, data_hora: new Date().toISOString(), tipo_acionamento: 'Automático' }
  ],
  insumos: [
    { id: 'ins1', nome: 'Fertilizante NPK', tipo: 'Fertilizante', quantidade: 50, unidade: 'kg', quantidadeMinima: 10 },
    { id: 'ins2', nome: 'Sementes de Tomate', tipo: 'Semente', quantidade: 2, unidade: 'pct', quantidadeMinima: 5 }
  ],
  
  colheitas: [], logs: [], tarefas: [], registeredUsers: [], eventoCritico: null,
  filtroStatus: 'Todos', filtroCultura: 'Todas',
};

const listeners = new Set<() => void>();
const notify = () => listeners.forEach(listener => listener());

const actions = {
  setFiltroStatus: (s: string) => { globalState = { ...globalState, filtroStatus: s }; notify(); },
  setFiltroCultura: (c: string) => { globalState = { ...globalState, filtroCultura: c }; notify(); },
  
  addLote: (lote: any) => { globalState = { ...globalState, lotes: [...globalState.lotes, { ...lote, id: Date.now().toString(), dataPlantio: new Date().toISOString().split('T')[0] }] }; notify(); },
  updateLote: (id: string, updates: any) => { globalState = { ...globalState, lotes: globalState.lotes.map(l => l.id === id ? { ...l, ...updates } : l) }; notify(); },
  deleteLote: (id: string) => { globalState = { ...globalState, lotes: globalState.lotes.filter(l => l.id !== id) }; notify(); },

  registrarIrrigacao: (loteId: string, ml: number, tipo: string) => { globalState = { ...globalState, historicoIrrigacao: [{ id: Date.now().toString(), lote_id: loteId, quantidade_agua_ml: ml, data_hora: new Date().toISOString(), tipo_acionamento: tipo }, ...globalState.historicoIrrigacao] }; notify(); },
  deleteIrrigacao: (id: string) => { if (window.confirm("Eliminar este registo de rega?")) { globalState = { ...globalState, historicoIrrigacao: globalState.historicoIrrigacao.filter((h: any) => h.id !== id) }; notify(); } },

  addInsumo: (insumo: any) => { globalState = { ...globalState, insumos: [{ ...insumo, id: Date.now().toString() }, ...globalState.insumos] }; notify(); },
  updateInsumo: (id: string, updates: any) => { globalState = { ...globalState, insumos: globalState.insumos.map((i: any) => i.id === id ? { ...i, ...updates } : i) }; notify(); },
  deleteInsumo: (id: string) => { if (window.confirm("Excluir este insumo?")) { globalState = { ...globalState, insumos: globalState.insumos.filter((i: any) => i.id !== id) }; notify(); } },

  // ── NOVA FUNÇÃO: ATUALIZAR PERFIL ──
  updateProfile: (updates: any) => {
    globalState = { 
      ...globalState, 
      currentUser: { ...globalState.currentUser, ...updates } 
    };
    notify();
  },

  logout: () => console.log('Logout executado'),
};

export const useAppStore = (selector?: (state: any) => any) => {
  const [state, setState] = useState(globalState);
  useEffect(() => { const listener = () => setState(globalState); listeners.add(listener); return () => { listeners.delete(listener); }; }, []);
  const store = { ...state, ...actions };
  return selector ? selector(store) : store;
};