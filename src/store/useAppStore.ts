// ═══════════════════════════════════════════════════════════════
// Terra Nova — Store Global (Singleton Imutável)
// Com CRUD completo de Estoque de Insumos!
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';

let globalState = {
  isLoggedIn: true,
  currentUser: { id: 'u1', nome: 'Luna', email: 'luna@terranova.com', criadoEm: new Date().toISOString() },
  
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

  // ── ESTOQUE DE INSUMOS ──
  insumos: [
    { id: 'ins1', nome: 'Fertilizante NPK', tipo: 'Fertilizante', quantidade: 50, unidade: 'kg', quantidadeMinima: 10 },
    { id: 'ins2', nome: 'Sementes de Tomate', tipo: 'Semente', quantidade: 2, unidade: 'pct', quantidadeMinima: 5 } // Este vai dar alerta!
  ],
  
  colheitas: [], logs: [], tarefas: [], registeredUsers: [], eventoCritico: null,
  filtroStatus: 'Todos',
  filtroCultura: 'Todas',
};

const listeners = new Set<() => void>();
const notify = () => listeners.forEach(listener => listener());

const actions = {
  setFiltroStatus: (s: string) => { globalState = { ...globalState, filtroStatus: s }; notify(); },
  setFiltroCultura: (c: string) => { globalState = { ...globalState, filtroCultura: c }; notify(); },
  
  // ── Lotes ──
  addLote: (lote: any) => {
    const newLote = { ...lote, id: Date.now().toString(), dataPlantio: new Date().toISOString().split('T')[0] };
    globalState = { ...globalState, lotes: [...globalState.lotes, newLote] };
    notify();
  },
  updateLote: (id: string, updates: any) => {
    globalState = { ...globalState, lotes: globalState.lotes.map(l => l.id === id ? { ...l, ...updates } : l) };
    notify();
  },
  deleteLote: (id: string) => {
    globalState = { ...globalState, lotes: globalState.lotes.filter(l => l.id !== id) };
    notify();
  },

  // ── Irrigação ──
  registrarIrrigacao: (loteId: string, ml: number, tipo: string) => {
    const novoRegistro = { id: Date.now().toString(), lote_id: loteId, quantidade_agua_ml: ml, data_hora: new Date().toISOString(), tipo_acionamento: tipo };
    globalState = { ...globalState, historicoIrrigacao: [novoRegistro, ...globalState.historicoIrrigacao] };
    notify();
  },
  deleteIrrigacao: (id: string) => {
    if (window.confirm("Tens a certeza que queres eliminar este registo de rega?")) {
      globalState = { ...globalState, historicoIrrigacao: globalState.historicoIrrigacao.filter((h: any) => h.id !== id) };
      notify();
    }
  },

  // ── INSUMOS (CRUD NOVO) ──
  addInsumo: (insumo: any) => {
    const novo = { ...insumo, id: Date.now().toString() };
    globalState = { ...globalState, insumos: [novo, ...globalState.insumos] };
    notify();
  },
  updateInsumo: (id: string, updates: any) => {
    globalState = { ...globalState, insumos: globalState.insumos.map((i: any) => i.id === id ? { ...i, ...updates } : i) };
    notify();
  },
  deleteInsumo: (id: string) => {
    if (window.confirm("Deseja realmente excluir este insumo do estoque?")) {
      globalState = { ...globalState, insumos: globalState.insumos.filter((i: any) => i.id !== id) };
      notify();
    }
  },

  logout: () => console.log('Logout executado'),
  addLog: () => {},
  addColheita: () => {},
  addTarefa: () => {},
};

export const useAppStore = (selector?: (state: any) => any) => {
  const [state, setState] = useState(globalState);

  useEffect(() => {
    const listener = () => setState(globalState);
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);

  const store = { ...state, ...actions };
  return selector ? selector(store) : store;
};