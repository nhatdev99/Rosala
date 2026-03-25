import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore';
import { db } from './firebase';

const SYNC_KEYS = ['profile-storage', 'salary-storage', 'theme-storage', 'flash-guide-seen-v1'];

const lastSyncHashByUser = new Map<string, string>();

function checksum(input: string): string {
  let hash = 5381;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return (hash >>> 0).toString(16);
}

function keyToDocId(key: string): string {
  return key.replace(/[^a-zA-Z0-9_-]/g, '_');
}

export async function syncAsyncStorageToFirebase(uid: string, options?: { force?: boolean }) {
  const entries = await AsyncStorage.multiGet(SYNC_KEYS);
  const payload = entries
    .filter(([, value]) => typeof value === 'string')
    .map(([key, value]) => ({ key, value: value ?? '' }));

  const serialized = JSON.stringify(payload);
  const currentHash = checksum(serialized);
  const previousHash = lastSyncHashByUser.get(uid);

  if (!options?.force && previousHash === currentHash) {
    return { ok: true, skipped: true as const };
  }

  const batch = writeBatch(db);

  payload.forEach(({ key, value }) => {
    const itemRef = doc(db, 'users', uid, 'asyncStorage', keyToDocId(key));
    batch.set(
      itemRef,
      {
        key,
        value,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  });

  const metaRef = doc(db, 'users', uid, 'sync_meta', 'latest');
  batch.set(
    metaRef,
    {
      hash: currentHash,
      keyCount: payload.length,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  await batch.commit();
  lastSyncHashByUser.set(uid, currentHash);

  await setDoc(
    doc(db, 'users', uid),
    {
      lastLocalSyncAt: serverTimestamp(),
    },
    { merge: true }
  );

  return { ok: true, skipped: false as const };
}
