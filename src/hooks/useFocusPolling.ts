import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

/**
 * Hook de infraestrutura para executar uma ação em loop (Polling)
 * SOMENTE quando a tela estiver em foco. Omitindo processamento invisível.
 */
export function useFocusPolling(action: () => Promise<void> | void, intervalMs: number = 10000) {
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      let timerId: NodeJS.Timeout;

      const loop = async () => {
        if (!isMounted) return;
        
        try {
          // Aguarda a requisição inteira terminar antes de seguir
          await action();
        } finally {
          // Somente após o término, inicia o cronômetro para a próxima chamada
          if (isMounted) {
            timerId = setTimeout(loop, intervalMs);
          }
        }
      };

      // Dá o primeiro disparo
      loop();

      // Limpeza segura ao desmontar ou trocar de aba
      return () => {
        isMounted = false;
        clearTimeout(timerId);
      };
    }, [action, intervalMs])
  );
}
