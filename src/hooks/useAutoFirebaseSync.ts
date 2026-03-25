import { useCallback, useEffect, useRef } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { AppState } from 'react-native';
import { syncAsyncStorageToFirebase } from '../services/asyncStorageFirebaseSync';

export function useAutoFirebaseSync(uid: string | null) {
  const syncingRef = useRef(false);

  const runSyncIfOnline = useCallback(
    async (force = false) => {
      if (!uid || syncingRef.current) {
        return;
      }

      const net = await NetInfo.fetch();
      const isOnline = !!net.isConnected && net.isInternetReachable !== false;

      if (!isOnline) {
        return;
      }

      syncingRef.current = true;
      try {
        await syncAsyncStorageToFirebase(uid, { force });
      } catch (error) {
        console.warn('Auto sync failed', error);
      } finally {
        syncingRef.current = false;
      }
    },
    [uid]
  );

  useEffect(() => {
    if (!uid) {
      return;
    }

    void runSyncIfOnline(true);

    const unsubscribeNetInfo = NetInfo.addEventListener((state) => {
      const isOnline = !!state.isConnected && state.isInternetReachable !== false;
      if (isOnline) {
        void runSyncIfOnline();
      }
    });

    const appStateSub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        void runSyncIfOnline();
      }
    });

    return () => {
      unsubscribeNetInfo();
      appStateSub.remove();
    };
  }, [uid, runSyncIfOnline]);
}
