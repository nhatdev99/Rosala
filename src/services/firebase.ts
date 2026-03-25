import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBHWjaNI-o-b20JJPxe-JPDLS_4QM27EQc',
  authDomain: 'roncodes.firebaseapp.com',
  projectId: 'roncodes',
  storageBucket: 'roncodes.firebasestorage.app',
  messagingSenderId: '574271640244',
  appId: '1:574271640244:web:5a5f444c4b02746eb7fde1',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
