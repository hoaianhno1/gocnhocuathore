import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const missingFirebaseKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

export const firebaseConfigError =
  missingFirebaseKeys.length > 0
    ? `Thiếu biến môi trường Firebase: ${missingFirebaseKeys.join(', ')}. Kiểm tra file .env và khởi động lại dev server.`
    : null;

export const firebaseProjectId = firebaseConfig.projectId || 'unknown';

let app: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;
let firebaseAuth: Auth | null = null;

if (!firebaseConfigError) {
  app = initializeApp(firebaseConfig);
  firestoreDb = getFirestore(app);
  firebaseAuth = getAuth(app);
}

export const db = firestoreDb;
export const auth = firebaseAuth;
