import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface FirebaseUserProfile {
  fullName: string;
  employeeCode: string;
  email: string;
  avatarUri: string | null;
}

export async function saveUserProfile(uid: string, profile: FirebaseUserProfile) {
  await setDoc(
    doc(db, 'users', uid),
    {
      ...profile,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function fetchUserProfile(uid: string): Promise<Partial<FirebaseUserProfile> | null> {
  const snapshot = await getDoc(doc(db, 'users', uid));
  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();
  return {
    fullName: typeof data.fullName === 'string' ? data.fullName : undefined,
    employeeCode: typeof data.employeeCode === 'string' ? data.employeeCode : undefined,
    email: typeof data.email === 'string' ? data.email : undefined,
    avatarUri: typeof data.avatarUri === 'string' ? data.avatarUri : null,
  };
}
