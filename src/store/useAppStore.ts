// ═══════════════════════════════════════════════════════════════
// Terra Nova — Store Global (Singleton Imutável)
// Contém TODAS as listas para não quebrar a HomeScreen
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react';

// 1. O Estado Global
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
  
  // Listas vazias essenciais para as outras telas não quebrarem
  colheitas: [], 
  logs: [], 
  tarefas: [], 
  insumos: [], 
  registeredUsers: [], 
  eventoCritico: null,
  
  filtroStatus: 'Todos',
  filtroCultura: 'Todas',
};

// 2. Os "Ouvintes" (Avisa o React para atualizar)
const listeners = new Set<() => void>();
const notify = () => listeners.forEach(listener => listener());

// 3. As Funções de Ação
const actions = {
  setFiltroStatus: (s: string) => { globalState = { ...globalState, filtroStatus: s }; notify(); },
  setFiltroCultura: (c: string) => { globalState = { ...globalState, filtroCultura: c }; notify(); },
  
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

  logout: () => console.log('Logout executado'),
  addLog: () => {},
  addInsumo: () => {},
  addColheita: () => {},
  addTarefa: () => {},
};

// 4. O Hook Exportado
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