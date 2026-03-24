import { useEffect } from 'react';
import { useSyncStore } from '../store/useSyncStore';

async function hasInternet() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    await fetch('https://clients3.google.com/generate_204', {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return true;
  } catch {
    return false;
  }
}

export function useAutoSync() {
  const pendingCount = useSyncStore((s) => s.pending.length);
  const runSync = useSyncStore((s) => s.runSync);

  useEffect(() => {
    const tick = async () => {
      if (pendingCount === 0) return;
      const online = await hasInternet();
      if (online) {
        await runSync();
      }
    };

    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, [pendingCount, runSync]);
}
