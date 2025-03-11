// config/emulator.ts
import { connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';
import { auth, db } from './firebase';

export const connectToEmulators = () => {
  if (process.env.NODE_ENV === 'development') {
    // Cek apakah sudah terhubung ke emulator
    const authEmulatorHost = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST;
    const firestoreEmulatorHost = process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_HOST;
    
    if (authEmulatorHost) {
      connectAuthEmulator(auth, `http://${authEmulatorHost}`);
      console.log(`Connected to Auth Emulator: ${authEmulatorHost}`);
    }
    
    if (firestoreEmulatorHost) {
      const [host, portStr] = firestoreEmulatorHost.split(':');
      const port = parseInt(portStr, 10);
      
      if (host && port) {
        connectFirestoreEmulator(db, host, port);
        console.log(`Connected to Firestore Emulator: ${host}:${port}`);
      }
    }
  }
};