import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { syncToFirebase } from '../services/firebaseSync';
import { useNotificationStore } from './useNotificationStore';

interface SyncAction {
  id: string;
  key: string;
  body: any;
  createdAt: string;
}

interface SyncState {
  pending: SyncAction[];
  syncing: boolean;
  lastSyncAt?: string;
  queueAction: (key: string, body: any) => void;
  runSync: () => Promise<void>;
}

export const useSyncStore = create<SyncState>()(
  persist(
    (set, get) => ({
      pending: [],
      syncing: false,
      lastSyncAt: undefined,
      queueAction: (key, body) =>
        set((state) => ({
          pending: [
            ...state.pending,
            {
              id: `sync_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
              key,
              body,
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      runSync: async () => {
        const state = get();
        if (state.syncing || state.pending.length === 0) return;

        set({ syncing: true });
        try {
          const result = await syncToFirebase(
            state.pending.map((p) => ({ key: p.key, body: p.body }))
          );

          if (result.ok) {
            set({ pending: [], syncing: false, lastSyncAt: new Date().toISOString() });
            useNotificationStore.getState().addNotification({
              type: 'sync_success',
              title: 'Đồng bộ thành công',
              message: 'Dữ liệu đã được đồng bộ khi có mạng.',
            });
          } else {
            set({ syncing: false });
            useNotificationStore.getState().addNotification({
              type: 'sync_failed',
              title: 'Chưa thể đồng bộ',
              message:
                result.reason === 'not_configured'
                  ? 'Firebase chưa được cấu hình endpoint, dữ liệu vẫn lưu offline.'
                  : 'Không thể gửi dữ liệu lên máy chủ, sẽ thử lại khi có mạng.',
            });
          }
        } catch (error) {
          set({ syncing: false });
          useNotificationStore.getState().addNotification({
            type: 'sync_failed',
            title: 'Đồng bộ lỗi',
            message: 'Mạng không ổn định, dữ liệu sẽ tự đồng bộ lại sau.',
          });
        }
      },
    }),
    {
      name: 'sync-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
