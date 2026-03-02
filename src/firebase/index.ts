'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  const isConfigAvailable = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  const isRunningInEmulators = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true'

  if (!getApps().length) {
    let firebaseApp;

    if (isConfigAvailable) {
      // Initialize with environment variables
      firebaseApp = initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      });
    } else {
      // Fallback to firebaseConfig for local development without .env.local
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          'Firebase environment variables not found. Falling back to firebase.config.ts. ' +
          'For a production build, you must set the NEXT_PUBLIC_FIREBASE_* environment variables.'
        );
      }
      firebaseApp = initializeApp(firebaseConfig);
    }
    
    if (isRunningInEmulators) {
      console.log('Connecting to Firebase Emulators');
      const firestore = getFirestore(firebaseApp);
      const auth = getAuth(firebaseApp);
      connectFirestoreEmulator(firestore, 'localhost', 8080);
      connectAuthEmulator(auth, 'http://localhost:9099');
    }

    return getSdks(firebaseApp);
  }

  // If already initialized, return the SDKs with the already initialized App
  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
  const firestore = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);

  if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true') {
    // Check if emulators are already connected to avoid errors
    // @ts-ignore
    if (!firestore._settings.host) {
      connectFirestoreEmulator(firestore, 'localhost', 8080);
    }
    // @ts-ignore
    if (!auth.emulatorConfig) {
      connectAuthEmulator(auth, 'http://localhost:9099');
    }
  }

  return {
    firebaseApp,
    auth,
    firestore,
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
