export interface SyncPayload {
  key: string;
  body: any;
}

const FIREBASE_ENDPOINT =
  process.env.EXPO_PUBLIC_FIREBASE_SYNC_ENDPOINT || '';

export async function syncToFirebase(payloads: SyncPayload[]) {
  if (!FIREBASE_ENDPOINT) {
    return { ok: false, reason: 'not_configured' as const };
  }

  const res = await fetch(FIREBASE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ items: payloads }),
  });

  if (!res.ok) {
    return { ok: false, reason: 'http_error' as const };
  }

  return { ok: true as const };
}
