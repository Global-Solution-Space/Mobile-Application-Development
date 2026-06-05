import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/api';
import {
  Produtor, Telefone, Localizacao, Propriedade, TipoPlantacao,
  Talhao, AlertaAgricola, TipoLog, LogAtividade, DadoTemporal, ReqApiPayload, Tarefa, ReqApi
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
  tarefas: Tarefa[];
  alertas: AlertaAgricola[];
  logs: LogAtividade[];
  dadosTemporais: DadoTemporal[];
  reqApis: ReqApi[];

  // Initialization
  fetchInitialData: () => Promise<void>;

  // Auth
  login: (email: string, senha?: string) => Promise<{ success: boolean; errorType?: 'auth' | 'network' }>;
  register: (nome: string, email: string, senha?: string, ddd?: string, numeroTelefone?: string) => Promise<{ success: boolean; errorType?: 'exists' | 'network' }>;
  logout: () => void;
  updateProfile: (updates: Partial<Produtor>, telefoneUpdates?: Partial<Telefone>) => Promise<void>;

  // Data Actions
  addLog: (tipo: TipoLog, mensagem: string) => void;
  addTalhao: (data: Omit<Talhao, 'id' | '_links'>) => Promise<void>;
  updateTalhao: (id: number, updates: Partial<Talhao>) => Promise<void>;
  deleteTalhao: (id: number) => Promise<void>;
  
  addPropriedade: (data: Omit<Propriedade, 'id' | '_links'>) => Promise<void>;
  updatePropriedade: (id: number, updates: Partial<Propriedade>) => Promise<void>;
  deletePropriedade: (id: number) => Promise<void>;
  addLocalizacao: (data: Omit<Localizacao, 'id' | '_links'>) => Promise<Localizacao | null>;
  addTipoPlantacao: (data: Omit<TipoPlantacao, 'id' | '_links'>) => Promise<TipoPlantacao | null>;

  requestApiAnalysis: (payload: ReqApiPayload) => Promise<boolean>;
  fetchDadosTemporaisEHistórico: (idTalhao: number) => Promise<void>;
  deleteReqApi: (id: number) => Promise<boolean>;

  updateAlerta: (id: number, data: Partial<AlertaAgricola>) => Promise<boolean>;
  deleteAlerta: (id: number) => Promise<boolean>;
  resolverEvento: (id: number) => Promise<void>;
  addAlerta: (data: Omit<AlertaAgricola, 'id' | '_links' | 'dataAlerta'>) => Promise<boolean>;
  
  addTarefa: (data: Omit<Tarefa, 'id'>) => void;
  toggleTarefa: (id: string) => void;
  deleteTarefa: (id: string) => void;
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
      tarefas: [],
      alertas: [],
      logs: [],
      dadosTemporais: [],
      reqApis: [],

      addLog: (tipo, mensagem) => {
        const user = get().currentUser;
        const newLog: LogAtividade = { id: uuid(), tipo, mensagem, usuario: user?.nome || 'Sistema', timestamp: now() };
        set(s => ({ logs: [newLog, ...s.logs] }));
      },

      fetchInitialData: async () => {
        set({ isLoading: true });
        try {
          const user = get().currentUser;
          if (!user) {
            set({ isLoading: false });
            return;
          }

          // Busca os recursos rápidos e essenciais do usuário
          const [propriedades, talhoes, alertas] = await Promise.all([
            apiService.getPropriedadesDoProdutor(user.id),
            apiService.getTalhoesDoProdutor(user.id),
            apiService.getAlertasDoProdutor(user.id)
          ]);

          set({ propriedades, talhoes, alertas });

          // Lazy Loading (Cache Inteligente): Carrega tabelas ausentes em paralelo
          const state = get();
          const cacheDependencies = [
            { key: 'tiposPlantacao' as const, fetcher: apiService.getTiposPlantacao },
            { key: 'localizacoes' as const, fetcher: apiService.getLocalizacoes },
            { key: 'telefones' as const, fetcher: apiService.getTelefones }
          ];

          await Promise.all(
            cacheDependencies
              .filter(({ key }) => state[key].length === 0)
              .map(({ key, fetcher }) => fetcher().then(data => set({ [key]: data } as Partial<AppStore>)))
          );
        } catch (error) {
          console.error("Erro ao buscar dados iniciais:", error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      login: async (email, senha) => {
        set({ isLoading: true });
        try {
          // Otimização: Busca apenas os produtores para validar o login (Economiza ~1s de rede)
          const produtores = await apiService.getProdutores();
          const user = produtores.find(u => u.email === email && (!senha || u.senha === senha));
          
          if (user) {
            set({ currentUser: user, isLoggedIn: true, produtores });
            get().addLog('sistema', `Produtor ${user.nome} fez login no sistema`);
            // Busca os recursos pesados (Talhoes, Propriedades, Alertas) atrelados a este usuário
            await get().fetchInitialData(); 
            return { success: true };
          }
          return { success: false, errorType: 'auth' };
        } catch (error: any) {
          if (error.response && error.response.status === 400) {
            return { success: false, errorType: 'auth' };
          }
          console.warn("Login connection failed:", error.message);
          return { success: false, errorType: 'network' };
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (nome, email, senha, ddd, numeroTelefone) => {
        set({ isLoading: true });
        try {
          const payload: Parameters<typeof apiService.createProdutor>[0] = { nome, email, senha };
          if (ddd && numeroTelefone) {
            payload.telefone = { ddd, numero: numeroTelefone };
          }

          const novoProdutor = await apiService.createProdutor(payload);

          set(s => ({
            produtores: [...s.produtores, novoProdutor],
            currentUser: novoProdutor,
            isLoggedIn: true,
          }));
          
          get().addLog('sistema', `Novo produtor ${nome} registrado no sistema`);
          await get().fetchInitialData(); // Sincroniza todos os dados do servidor
          return { success: true };
        } catch (error: any) {
          if (error.response && error.response.status === 400) {
            return { success: false, errorType: 'exists' };
          }
          console.warn("Registration connection failed:", error.message);
          return { success: false, errorType: 'network' };
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
                const updatedTel = await apiService.updateTelefone(telefone.id, telefoneUpdates);
                set(s => ({ telefones: s.telefones.map(t => t.id === telefone.id ? updatedTel : t) }));
             } else if (telefoneUpdates.ddd && telefoneUpdates.numero) {
                const newTel = await apiService.createTelefone({
                   ddd: telefoneUpdates.ddd,
                   numero: telefoneUpdates.numero,
                   idProdutor: user.id
                });
                set(s => ({ telefones: [...s.telefones, newTel] }));
             }
          }

          set(s => ({ 
            currentUser: updatedProdutor,
            produtores: s.produtores.map(p => p.id === updatedProdutor.id ? updatedProdutor : p)
          }));
          get().addLog('edicao', `Produtor atualizou seu perfil`);
        } catch (error: any) {
          console.warn("Update profile error:", error.message);
        } finally {
          set({ isLoading: false });
        }
      },

      addTalhao: async (data) => {
        set({ isLoading: true });
        try {
          const newTalhao = await apiService.createTalhao(data);
          get().addLog('criacao', `Novo talhão cadastrado`);
          set(s => ({ talhoes: [...s.talhoes, newTalhao] }));
        } catch (error: any) {
          console.warn("Add talhao error:", error.message);
        } finally {
          set({ isLoading: false });
        }
      },

      updateTalhao: async (id, updates) => {
        set({ isLoading: true });
        try {
          const updated = await apiService.updateTalhao(id, updates);
          set(s => ({ talhoes: s.talhoes.map(t => t.id === id ? updated : t) }));
        } catch (error: any) {
          console.warn("Update talhao error:", error.message);
        } finally {
          set({ isLoading: false });
        }
      },

      deleteTalhao: async (id) => {
        set({ isLoading: true });
        try {
          await apiService.deleteTalhao(id);
          get().addLog('exclusao', `Talhão removido`);
          set(s => ({ talhoes: s.talhoes.filter(t => t.id !== id) }));
        } catch (error: any) {
          console.warn("Delete talhao error:", error.message);
        } finally {
          set({ isLoading: false });
        }
      },

      addPropriedade: async (data) => {
        set({ isLoading: true });
        try {
          const res = await apiService.createPropriedade(data);
          get().addLog('criacao', `Propriedade "${res.nome}" cadastrada`);
          set(s => ({ propriedades: [...s.propriedades, res] }));
        } catch(e: any) { console.warn(e.message); } finally { set({ isLoading: false }); }
      },

      updatePropriedade: async (id, updates) => {
        set({ isLoading: true });
        try {
          const updated = await apiService.updatePropriedade(id, updates);
          get().addLog('edicao', `Propriedade atualizada`);
          set(s => ({ propriedades: s.propriedades.map(p => p.id === id ? updated : p) }));
        } catch(e: any) { console.warn(e.message); } finally { set({ isLoading: false }); }
      },

      deletePropriedade: async (id) => {
        set({ isLoading: true });
        try {
          await apiService.deletePropriedade(id);
          get().addLog('exclusao', `Propriedade removida`);
          set(s => ({ propriedades: s.propriedades.filter(p => p.id !== id) }));
        } catch(e: any) { console.warn(e.message); } finally { set({ isLoading: false }); }
      },

      addLocalizacao: async (data) => {
        set({ isLoading: true });
        try {
          const res = await apiService.createLocalizacao(data);
          // Otimização: Adiciona ao cache local sem refazer download do banco inteiro
          set(s => ({ localizacoes: [...s.localizacoes, res] }));
          return res;
        } catch(e: any) { console.warn(e.message); return null; } finally { set({ isLoading: false }); }
      },

      addTipoPlantacao: async (data) => {
        set({ isLoading: true });
        try {
          const res = await apiService.createTipoPlantacao(data);
          // Otimização: Adiciona ao cache local
          set(s => ({ tiposPlantacao: [...s.tiposPlantacao, res] }));
          return res;
        } catch(e: any) { console.warn(e.message); return null; } finally { set({ isLoading: false }); }
      },

      addAlerta: async (data) => {
        set({ isLoading: true });
        try {
          const res = await apiService.createAlerta(data);
          set(s => ({ alertas: [res, ...s.alertas] }));
          return true;
        } catch (error: any) {
          console.warn("Criar alerta error:", error.message);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      updateAlerta: async (id, data) => {
        set({ isLoading: true });
        try {
          const updated = await apiService.updateAlerta(id, data);
          set(s => ({ alertas: s.alertas.map(a => a.id === id ? updated : a) }));
          return true;
        } catch (error: any) {
          console.warn("Update alerta error:", error.message);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      deleteAlerta: async (id) => {
        set({ isLoading: true });
        try {
          await apiService.deleteAlerta(id);
          set(s => ({ alertas: s.alertas.filter(a => a.id !== id) }));
          return true;
        } catch (error: any) {
          console.warn("Delete alerta error:", error.message);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      resolverEvento: async (id) => {
        set({ isLoading: true });
        try {
          const updated = await apiService.resolveAlerta(id);
          set(s => ({ alertas: s.alertas.map(a => a.id === id ? updated : a) }));
        } catch (error: any) {
          console.warn("Resolver evento error:", error.message);
        } finally {
          set({ isLoading: false });
        }
      },

      requestApiAnalysis: async (payload) => {
        set({ isLoading: true });
        try {
          await apiService.createReqApi(payload);
          await get().fetchDadosTemporaisEHistórico(payload.idTalhao);
          
          // Baixa os novos alertas do produtor, pois o Java pode ter gerado alertas automáticos
          const user = get().currentUser;
          if (user) {
            const novosAlertas = await apiService.getAlertasDoProdutor(user.id);
            set({ alertas: novosAlertas });
          }

          get().addLog('sistema', `Nova análise ${payload.tipoParam} iniciada para talhão #${payload.idTalhao}`);
          return true;
        } catch (error: any) {
          console.warn("ReqApi error:", error.message);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      fetchDadosTemporaisEHistórico: async (idTalhao) => {
        set({ isLoading: true });
        try {
          const [dados, reqs] = await Promise.all([
            apiService.getDadosTemporais(idTalhao),
            apiService.getReqApisByTalhao(idTalhao)
          ]);
          set({ dadosTemporais: dados, reqApis: reqs });
        } catch (error: any) {
          console.warn("Fetch Dados Temporais error:", error.message);
        } finally {
          set({ isLoading: false });
        }
      },

      deleteReqApi: async (id) => {
        set({ isLoading: true });
        try {
          await apiService.deleteReqApi(id);
          set(s => ({
            reqApis: s.reqApis.filter(r => r.id !== id),
            dadosTemporais: s.dadosTemporais.filter(d => d.idReqApi !== id)
          }));
          get().addLog('sistema', `Exclusão da análise #${id} efetuada com sucesso`);
          return true;
        } catch (error: any) {
          console.warn("Delete reqApi error:", error.message);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      addTarefa: (data) => {
        const newTarefa: Tarefa = {
          ...data,
          id: Date.now().toString(),
        };
        set(state => ({ tarefas: [...state.tarefas, newTarefa] }));
      },

      toggleTarefa: (id) => {
        set(state => ({
          tarefas: state.tarefas.map(t =>
            t.id === id ? { ...t, concluida: !t.concluida } : t
          )
        }));
      },

      deleteTarefa: (id) => {
        set(state => ({
          tarefas: state.tarefas.filter(t => t.id !== id)
        }));
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
        tarefas: state.tarefas,
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