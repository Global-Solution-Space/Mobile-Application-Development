import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/api';
import {
  Produtor, Telefone, Localizacao, Propriedade, TipoPlantacao,
  Talhao, AlertaAgricola, TipoLog, LogAtividade, DadoTemporal, ReqApiPayload, ReqApi
} from '../types';

const uuid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
const now = () => new Date().toISOString();

// Controle global de concorrência para evitar requisições duplicadas simultâneas
let activeFetchPromise: Promise<void> | null = null;
const activeTelemetryPromises: Record<number, Promise<void> | undefined> = {};
const INITIAL_SYNC_COOLDOWN_MS = 45_000;
const INITIAL_SYNC_ERROR_COOLDOWN_MS = 120_000;
const silentRequestOptions = { suppressErrorAlert: true };
let lastSuccessfulInitialSyncAt = 0;
let lastFailedInitialSyncAt = 0;

// Helper global para registrar erros de API no console sem duplicar os alertas exibidos pelo interceptor do Axios
const handleApiError = (error: any, defaultMsg: string) => {
  console.warn(`${defaultMsg}:`, error.message);
};

const upsertById = <T extends { id: number }>(items: T[], item: T) => {
  const exists = items.some((current) => current.id === item.id);
  return exists
    ? items.map((current) => current.id === item.id ? item : current)
    : [...items, item];
};

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
  dadosTemporais: DadoTemporal[];
  reqApis: ReqApi[];

  // Initialization
  fetchInitialData: (silent?: boolean) => Promise<void>;

  // Auth
  login: (email: string, senha?: string) => Promise<{ success: boolean; errorType?: 'auth' | 'network' }>;
  register: (nome: string, email: string, senha?: string, ddd?: string, numeroTelefone?: string) => Promise<{ success: boolean; errorType?: 'exists' | 'network' }>;
  logout: () => void;
  updateProfile: (updates: Partial<Produtor>, telefoneUpdates?: Partial<Telefone>) => Promise<boolean>;

  // Data Actions
  addLog: (tipo: TipoLog, mensagem: string) => void;
  addTalhao: (data: Omit<Talhao, 'id' | '_links'>) => Promise<boolean>;
  updateTalhao: (id: number, updates: Partial<Talhao>) => Promise<boolean>;
  deleteTalhao: (id: number) => Promise<void>;
  
  addPropriedade: (data: Omit<Propriedade, 'id' | '_links'>) => Promise<boolean>;
  updatePropriedade: (id: number, updates: Partial<Propriedade>) => Promise<boolean>;
  deletePropriedade: (id: number) => Promise<boolean>;
  addLocalizacao: (data: Omit<Localizacao, 'id' | '_links'>) => Promise<Localizacao | null>;
  addTipoPlantacao: (data: Omit<TipoPlantacao, 'id' | '_links'>) => Promise<TipoPlantacao | null>;

  requestApiAnalysis: (payload: ReqApiPayload) => Promise<boolean>;
  fetchDadosTemporaisEHistórico: (idTalhao: number, silent?: boolean) => Promise<void>;
  fetchDadosTemporaisFull: (idReqApi: number) => Promise<void>;
  deleteReqApi: (id: number) => Promise<boolean>;

  updateAlerta: (id: number, data: Partial<AlertaAgricola>) => Promise<boolean>;
  deleteAlerta: (id: number) => Promise<boolean>;
  resolverEvento: (id: number) => Promise<void>;
  reabrirEvento: (id: number) => Promise<void>;
  addAlerta: (data: Omit<AlertaAgricola, 'id' | '_links' | 'dataAlerta'>) => Promise<boolean>;
  
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
      dadosTemporais: [],
      reqApis: [],

      addLog: (tipo, mensagem) => {
        const user = get().currentUser;
        const newLog: LogAtividade = { id: uuid(), tipo, mensagem, usuario: user?.nome || 'Sistema', timestamp: now() };
        set(s => ({ logs: [newLog, ...s.logs].slice(0, 100) }));
      },

      fetchInitialData: async (silent = false) => {
        if (activeFetchPromise) {
          return activeFetchPromise;
        }

        const nowMs = Date.now();
        if (silent) {
          const syncedRecently = nowMs - lastSuccessfulInitialSyncAt < INITIAL_SYNC_COOLDOWN_MS;
          const failedRecently = nowMs - lastFailedInitialSyncAt < INITIAL_SYNC_ERROR_COOLDOWN_MS;
          if (syncedRecently || failedRecently) {
            return;
          }
        }

        activeFetchPromise = (async () => {
          if (!silent) set({ isLoading: true });
          try {
            const user = get().currentUser;
            if (!user) {
              if (!silent) set({ isLoading: false });
              return;
            }

            // Busca os recursos rápidos e essenciais do usuário
            const requestOptions = silent ? silentRequestOptions : undefined;
            const [propriedades, talhoes, alertas, produtorAtualizado] = await Promise.all([
              apiService.getPropriedadesDoProdutor(user.id, requestOptions),
              apiService.getTalhoesDoProdutor(user.id, requestOptions),
              apiService.getAlertasDoProdutor(user.id, requestOptions),
              apiService.getProdutor(user.id, requestOptions).catch(() => null)
            ]);

            set((state) => ({
              propriedades,
              talhoes,
              alertas,
              currentUser: produtorAtualizado ?? state.currentUser,
              produtores: produtorAtualizado ? upsertById(state.produtores, produtorAtualizado) : state.produtores,
            }));

            // Lazy Loading (Cache Inteligente): mantem tabelas estaveis em cache e atualiza dados volateis.
            const state = get();
            const cacheDependencies = [
              { key: 'tiposPlantacao' as const, fetcher: () => apiService.getTiposPlantacao(requestOptions), cacheable: true },
              { key: 'localizacoes' as const, fetcher: () => apiService.getLocalizacoes(requestOptions), cacheable: true },
              { key: 'telefones' as const, fetcher: () => apiService.getTelefones(requestOptions), cacheable: false }
            ];

            await Promise.all(
              cacheDependencies
                .filter(({ key, cacheable }) => !cacheable || state[key].length === 0)
                .map(({ key, fetcher }) => fetcher().then(data => set({ [key]: data } as Partial<AppStore>)))
            );
            lastSuccessfulInitialSyncAt = Date.now();
            lastFailedInitialSyncAt = 0;
          } catch (error) {
            if (silent) {
              lastFailedInitialSyncAt = Date.now();
              console.warn("Sincronizacao silenciosa dos dados iniciais falhou:", error instanceof Error ? error.message : error);
              return;
            }
            console.error("Erro ao buscar dados iniciais:", error);
            throw error;
          } finally {
            if (!silent) set({ isLoading: false });
          }
        })();

        try {
          await activeFetchPromise;
        } finally {
          activeFetchPromise = null;
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
          
          const novoProdutor = await apiService.createProdutor(payload);

          // Se houver DDD e telefone, cria separadamente via endpoint /telefones
          if (ddd && numeroTelefone) {
            try {
              const novoTelefone = await apiService.createTelefone({
                ddd,
                numero: numeroTelefone,
                idProdutor: novoProdutor.id,
              });
              set(s => ({ telefones: [...s.telefones, novoTelefone] }));
            } catch (telError) {
              console.warn("Erro ao criar telefone do novo produtor:", telError);
              // Não falha o registro por causa do telefone
            }
          }

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
          const fallbackUser = get().produtores.find((p) => p.id === user?.id || p.email === user?.email);
          const userId = fallbackUser?.id ?? user?.id;

          if (!userId) {
            set({ isLoading: false });
            return false;
          }

          const produtorServidor = await apiService.getProdutor(userId, silentRequestOptions).catch(() => null);
          const produtorBase = produtorServidor ?? user ?? fallbackUser;

          const payload: Partial<Produtor> = {
            nome: updates.nome ?? produtorBase?.nome ?? '',
            email: updates.email ?? produtorBase?.email ?? '',
            senha: updates.senha ?? user?.senha ?? fallbackUser?.senha ?? produtorBase?.senha,
          };

          const updatedProdutor = await apiService.updateProdutor(userId, payload);
          
          if (telefoneUpdates) {
             const telefonePayload = {
               ddd: telefoneUpdates.ddd ?? '',
               numero: telefoneUpdates.numero ?? '',
               idProdutor: userId,
             };

             if (telefonePayload.ddd && telefonePayload.numero) {
               const telefonesServidor = await apiService.getTelefones(silentRequestOptions).catch(() => get().telefones);
               const telefone = telefonesServidor.find(t => t.idProdutor === userId);

               if (telefone) {
                  const updatedTel = await apiService.updateTelefone(telefone.id, {
                    id: telefone.id,
                    ...telefonePayload,
                  });
                  set({ telefones: upsertById(telefonesServidor, updatedTel) });
               } else {
                  const newTel = await apiService.createTelefone(telefonePayload);
                  set({ telefones: [...telefonesServidor, newTel] });
               }
             }
          }

          const [produtorFinal, telefonesAtualizados] = await Promise.all([
            apiService.getProdutor(userId, silentRequestOptions).catch(() => updatedProdutor),
            apiService.getTelefones(silentRequestOptions).catch(() => get().telefones),
          ]);

          set(s => ({ 
            currentUser: produtorFinal,
            produtores: upsertById(s.produtores, produtorFinal),
            telefones: telefonesAtualizados,
          }));
          get().addLog('edicao', `Produtor atualizou seu perfil`);
          return true;
        } catch (error: any) {
          console.warn('Update profile error:', error.message);
          return false;
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
          return true;
        } catch (error: any) {
          handleApiError(error, "Erro ao cadastrar talhão");
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      updateTalhao: async (id, updates) => {
        set({ isLoading: true });

        const talhaoToUpdate = get().talhoes.find(t => t.id === id);
        if (!talhaoToUpdate) {
          set({ isLoading: false });
          return false;
        }

        try {
          const updated = await apiService.updateTalhao(id, updates);
          set(s => ({ talhoes: s.talhoes.map(t => t.id === id ? updated : t) }));
          return true;
        } catch (error: any) {
          handleApiError(error, "Erro ao atualizar talhão");
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      deleteTalhao: async (id) => {
        set({ isLoading: true });
        try {
          await apiService.deleteTalhao(id);
          get().addLog('exclusao', `Talhão removido`);
          set(s => ({ 
            talhoes: s.talhoes.filter(t => t.id !== id),
            alertas: s.alertas.filter(a => a.idTalhao !== id),
            dadosTemporais: s.dadosTemporais.filter(d => d.idTalhao !== id)
          }));
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
          return true;
        } catch(e: any) { 
          handleApiError(e, "Erro ao cadastrar propriedade");
          return false;
        } finally { set({ isLoading: false }); }
      },

      updatePropriedade: async (id, updates) => {
        set({ isLoading: true });
        try {
          const updated = await apiService.updatePropriedade(id, updates);
          get().addLog('edicao', `Propriedade atualizada`);
          set(s => ({ propriedades: s.propriedades.map(p => p.id === id ? updated : p) }));
          return true;
        } catch(e: any) { 
          handleApiError(e, "Erro ao atualizar propriedade");
          return false;
        } finally { set({ isLoading: false }); }
      },

      deletePropriedade: async (id) => {
        set({ isLoading: true });
        try {
          await apiService.deletePropriedade(id);
          get().addLog('exclusao', `Propriedade removida`);
          
          set(s => {
            // Mapeia os IDs dos talhões que pertencem a esta propriedade
            const talhoesExcluidos = s.talhoes.filter(t => t.idPropriedade === id).map(t => t.id);
            
            return {
              propriedades: s.propriedades.filter(p => p.id !== id),
              talhoes: s.talhoes.filter(t => t.idPropriedade !== id),
              // Arranca também os alertas e dados que pertenciam aos talhões excluídos
              alertas: s.alertas.filter(a => !talhoesExcluidos.includes(a.idTalhao)),
              dadosTemporais: s.dadosTemporais.filter(d => !talhoesExcluidos.includes(d.idTalhao))
            };
          });
          return true;
        } catch(e: any) { 
          console.warn(e.message);
          return false;
        } finally { set({ isLoading: false }); }
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

      reabrirEvento: async (id) => {
        set({ isLoading: true });
        try {
          const updated = await apiService.reabrirAlerta(id);
          set(s => ({ alertas: s.alertas.map(a => a.id === id ? updated : a) }));
        } catch (error: any) {
          console.warn("Reabrir evento error:", error.message);
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

      fetchDadosTemporaisEHistórico: async (idTalhao, silent = false) => {
        if (activeTelemetryPromises[idTalhao]) {
          return activeTelemetryPromises[idTalhao];
        }

        activeTelemetryPromises[idTalhao] = (async () => {
          if (!silent) set({ isLoading: true });
          try {
            const requestOptions = silent ? silentRequestOptions : undefined;
            const reqs = await apiService.getReqApisByTalhao(idTalhao, requestOptions);
            const reqsWithTalhao = reqs.map(r => ({ ...r, idTalhao }));
            
            // Lazy Loading Arquitetural: Pega o top 5 de cada ReqApi para o preview
            const previewsPromises = reqs.map(r => 
              apiService.getDadosTemporaisByReqApi(r.id, 5, requestOptions)
            );
            const previewsResult = await Promise.all(previewsPromises);
            const dadosPreview = previewsResult.flat();

            set(state => ({
              dadosTemporais: [...state.dadosTemporais.filter(d => d.idTalhao !== idTalhao), ...dadosPreview],
              reqApis: [...state.reqApis.filter(r => r.idTalhao !== idTalhao), ...reqsWithTalhao]
            }));
          } catch (error: any) {
            if (!silent) {
              console.warn("Fetch Dados Temporais error:", error.message);
            }
          } finally {
            if (!silent) set({ isLoading: false });
          }
        })();

        try {
          await activeTelemetryPromises[idTalhao];
        } finally {
          delete activeTelemetryPromises[idTalhao];
        }
      },

      fetchDadosTemporaisFull: async (idReqApi) => {
        set({ isLoading: true });
        try {
          const dados = await apiService.getDadosTemporaisByReqApi(idReqApi, 3000);
          set(state => ({
            dadosTemporais: [...state.dadosTemporais.filter(d => d.idReqApi !== idReqApi), ...dados],
          }));
        } catch (error: any) {
          console.warn("Fetch Dados Temporais Full error:", error.message);
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

    }),
    {
      name: 'terranova-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Fallback local persistence (Reidratação offline)
        currentUser: state.currentUser,
        isLoggedIn: state.isLoggedIn,
        logs: state.logs,
        dadosTemporais: state.dadosTemporais,
        reqApis: state.reqApis,
        propriedades: state.propriedades,
        talhoes: state.talhoes,
        alertas: state.alertas,
      }),
      onRehydrateStorage: () => (state) => {
        // Quando o AsyncStorage terminar de carregar os dados salvos:
        if (state && state.isLoggedIn) {
          // Se o usuário já estava logado, dispara o fetch da API silenciosamente
          state.fetchInitialData(true);
        }
      }
    }
  )
);