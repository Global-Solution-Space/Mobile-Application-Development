import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAppStore } from '../store/useAppStore';

/**
 * Hook global responsável por monitorar o estado do aplicativo (Foreground / Background).
 * Sempre que o aplicativo voltar a ficar ativo na tela, ele disparará a 
 * re-sincronização silenciosa dos dados com o backend.
 */
export function useAppStateSync() {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        const store = useAppStore.getState();
        if (store.isLoggedIn) {
          // Dispara a re-sincronização silenciosa ao reabrir/reativar o aplicativo
          store.fetchInitialData(true).catch(() => {
            // Abafa falhas de conexão silenciosamente para não interromper a navegação do usuário
          });
        }
      }
    });
    return () => subscription.remove();
  }, []);
}
