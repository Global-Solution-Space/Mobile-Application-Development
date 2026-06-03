import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/api';
import {
  Produtor, Telefone, Localizacao, Propriedade, TipoPlantacao,
  Talhao, AlertaAgricola, TipoLog, LogAtividade, SatVeg, NasaPower
} from '../types';

const uuid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
const now = () => new Date().toISOString();

export interface AppStore {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  currentUser: Produtor | null;
  isLoggedIn: boolean;
  
  produtores: Produtor[];
  telefones: Telefone[];
  localizacoes: Localizacao[];
  propriedades: Propriedade[];
  tiposPlantacao: TipoPlantacao[];
  talhoes: Talhao[];
  alertas: AlertaAgricola[];
  logs: LogAtividade[];
  satvegs: SatVeg[];
  nasapowers: NasaPower[];

  // Initialization
  fetchInitialData: () => Promise<void>;

  // Auth
  login: (email: string, senha?: string) => Promise<boolean>;
  register: (nome: string, email: string, senha?: string, ddd?: string, numeroTelefone?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<Produtor>, telefoneUpdates?: Partial<Telefone>) => Promise<void>;

  // Data Actions
  addLog: (tipo: TipoLog, mensagem: string) => void;
  addTalhao: (data: Omit<Talhao, 'id' | '_links'>) => Promise<void>;
  updateTalhao: (id: number, updates: Partial<Talhao>) => Promise<void>;
  deleteTalhao: (id: number) => Promise<void>;
  
  addPropriedade: (data: Omit<Propriedade, 'id' | '_links'>) => Promise<void>;
  addLocalizacao: (data: Omit<Localizacao, 'id' | '_links'>) => Promise<Localizacao | null>;
  addTipoPlantacao: (data: Omit<TipoPlantacao, 'id' | '_links'>) => Promise<TipoPlantacao | null>;

  addSatVeg: (idTalhao: number) => Promise<SatVeg | null>;
  deleteSatVeg: (id: number) => Promise<void>;
  addNasaPower: (idTalhao: number, dataInicio: string, dataFim: string) => Promise<NasaPower | null>;
  deleteNasaPower: (id: number) => Promise<void>;

  resolverEvento: (id: number) => Promise<void>;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),

      currentUser: null,
      isLoggedIn: false,

      produtores: [],
      telefones: [],
      localizacoes: [],
      propriedades: [],
      tiposPlantacao: [],
      talhoes: [],
      alertas: [],
      logs: [],
      satvegs: [],
      nasapowers: [],

      addLog: (tipo, mensagem) => {
        const user = get().currentUser;
        const newLog: LogAtividade = { id: uuid(), tipo, mensagem, usuario: user?.nome || 'Sistema', timestamp: now() };
        set(s => ({ logs: [newLog, ...s.logs] }));
      },

      fetchInitialData: async () => {
        set({ isLoading: true });
        try {
          const produtores = await apiService.getProdutores();
          const telefones = await apiService.getTelefones();
          const localizacoes = await apiService.getLocalizacoes();
          const propriedades = await apiService.getPropriedades();
          const tiposPlantacao = await apiService.getTiposPlantacao();
          const talhoes = await apiService.getTalhoes();
          const alertas = await apiService.getAlertas();
          const satvegs = await apiService.getSatVegs();
          const nasapowers = await apiService.getNasaPowers();
          set({
            produtores, telefones, localizacoes, propriedades,
            tiposPlantacao, talhoes, alertas, satvegs, nasapowers
          });
        } catch (error) {
          console.error("Erro ao buscar dados iniciais:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      login: async (email, senha) => {
        set({ isLoading: true });
        try {
          await get().fetchInitialData(); // Ensure we have latest
          const produtores = get().produtores;
          const user = produtores.find(u => u.email === email && (!senha || u.senha === senha));
          
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

      register: async (nome, email, senha, ddd, numeroTelefone) => {
        set({ isLoading: true });
        try {
          await get().fetchInitialData();
          const exists = get().produtores.find(u => u.email === email);
          if (exists) return false;

          const novoProdutor = await apiService.createProdutor({ nome, email, senha });
          
          if (ddd && numeroTelefone) {
             await apiService.createTelefone({ ddd, numero: numeroTelefone, idProdutor: novoProdutor.id });
          }

          set(s => ({
            produtores: [...s.produtores, novoProdutor],
            currentUser: novoProdutor,
            isLoggedIn: true,
          }));
          
          get().addLog('sistema', `Novo produtor ${nome} registrado no sistema`);
          await get().fetchInitialData(); // Refresh to get the phone
          return true;
        } catch (error) {
          console.error("Registration error", error);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        const user = get().currentUser;
        if (user) get().addLog('sistema', `Produtor ${user.nome} saiu do sistema`);
        set({ currentUser: null, isLoggedIn: false });
      },

      updateProfile: async (updates, telefoneUpdates) => {
        set({ isLoading: true });
        try {
          const user = get().currentUser;
          if (!user) return;
          
          const updatedProdutor = await apiService.updateProdutor(user.id, updates);
          
          if (telefoneUpdates) {
             const telefone = get().telefones.find(t => t.idProdutor === user.id);
             if (telefone) {
                await apiService.updateTelefone(telefone.id, telefoneUpdates);
             } else if (telefoneUpdates.ddd && telefoneUpdates.numero) {
                await apiService.createTelefone({
                   ddd: telefoneUpdates.ddd,
                   numero: telefoneUpdates.numero,
                   idProdutor: user.id
                });
             }
          }

          set({ currentUser: updatedProdutor });
          await get().fetchInitialData(); // Refresh list
          get().addLog('edicao', `Produtor atualizou seu perfil`);
        } catch (error) {
          console.error("Update profile error", error);
        } finally {
          set({ isLoading: false });
        }
      },

      addTalhao: async (data) => {
        set({ isLoading: true });
        try {
          await apiService.createTalhao(data);
          get().addLog('criacao', `Novo talhão cadastrado`);
          await get().fetchInitialData();
        } catch (error) {
          console.error("Add talhao error", error);
        } finally {
          set({ isLoading: false });
        }
      },

      updateTalhao: async (id, updates) => {
        set({ isLoading: true });
        try {
          await apiService.updateTalhao(id, updates);
          await get().fetchInitialData();
        } catch (error) {
          console.error("Update talhao error", error);
        } finally {
          set({ isLoading: false });
        }
      },

      deleteTalhao: async (id) => {
        set({ isLoading: true });
        try {
          await apiService.deleteTalhao(id);
          get().addLog('exclusao', `Talhão removido`);
          await get().fetchInitialData();
        } catch (error) {
          console.error("Delete talhao error", error);
        } finally {
          set({ isLoading: false });
        }
      },

      addPropriedade: async (data) => {
        set({ isLoading: true });
        try {
          await apiService.createPropriedade(data);
          await get().fetchInitialData();
        } catch(e) { console.error(e); } finally { set({ isLoading: false }); }
      },

      addLocalizacao: async (data) => {
        set({ isLoading: true });
        try {
          const res = await apiService.createLocalizacao(data);
          await get().fetchInitialData();
          return res;
        } catch(e) { console.error(e); return null; } finally { set({ isLoading: false }); }
      },

      addTipoPlantacao: async (data) => {
        set({ isLoading: true });
        try {
          const res = await apiService.createTipoPlantacao(data);
          await get().fetchInitialData();
          return res;
        } catch(e) { console.error(e); return null; } finally { set({ isLoading: false }); }
      },

      resolverEvento: async (id) => {
        set({ isLoading: true });
        try {
          await apiService.updateAlerta(id, { resolvido: 'S' });
          await get().fetchInitialData();
        } catch (error) {
          console.error("Resolver evento error", error);
        } finally {
          set({ isLoading: false });
        }
      },

      addSatVeg: async (idTalhao) => {
        set({ isLoading: true });
        try {
          const res = await apiService.createSatVeg({ idTalhao });
          await get().fetchInitialData();
          get().addLog('sistema', `Nova análise SATveg iniciada para talhão #${idTalhao}`);
          return res;
        } catch (error) {
          console.error("Add SatVeg error", error);
          return null;
        } finally {
          set({ isLoading: false });
        }
      },

      deleteSatVeg: async (id) => {
        set({ isLoading: true });
        try {
          await apiService.deleteSatVeg(id);
          await get().fetchInitialData();
          get().addLog('exclusao', `Análise SATveg removida`);
        } catch (error) {
          console.error("Delete SatVeg error", error);
        } finally {
          set({ isLoading: false });
        }
      },

      addNasaPower: async (idTalhao, dataInicio, dataFim) => {
        set({ isLoading: true });
        try {
          const res = await apiService.createNasaPower({ idTalhao, dataInicio, dataFim });
          await get().fetchInitialData();
          get().addLog('sistema', `Nova análise NASA Power iniciada para talhão #${idTalhao}`);
          return res;
        } catch (error) {
          console.error("Add NasaPower error", error);
          return null;
        } finally {
          set({ isLoading: false });
        }
      },

      deleteNasaPower: async (id) => {
        set({ isLoading: true });
        try {
          await apiService.deleteNasaPower(id);
          await get().fetchInitialData();
          get().addLog('exclusao', `Análise NASA Power removida`);
        } catch (error) {
          console.error("Delete NasaPower error", error);
        } finally {
          set({ isLoading: false });
        }
      }

    }),
    {
      name: 'terranova-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Fallback local persistence
        currentUser: state.currentUser,
        isLoggedIn: state.isLoggedIn,
        logs: state.logs,
      }),
      onRehydrateStorage: () => (state) => {
        // Quando o AsyncStorage terminar de carregar os dados salvos:
        if (state && state.isLoggedIn) {
          // Se o usuário já estava logado, dispara o fetch da API silenciosamente
          state.fetchInitialData();
        }
      }
    }
  )
);