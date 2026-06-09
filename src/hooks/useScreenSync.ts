import { useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useFocusPolling } from './useFocusPolling';

/**
 * Hook customizado para sincronizar os dados globais (Propriedades, Talhões e Alertas)
 * de forma silenciosa e em segundo plano toda vez que uma tela ganhar o foco.
 */
export function useScreenSync() {
  const syncData = useCallback(async () => {
    await useAppStore.getState().fetchInitialData(true).catch(() => {});
  }, []);

  useFocusPolling(syncData, 60_000);
}
