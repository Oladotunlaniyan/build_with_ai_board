'use server';

import type { Project, ProjectStatus } from './types';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore/lite';
import { initializeFirebase } from '@/firebase/index.server';

// This is a server-side file, so we need to initialize Firebase here.
const { firestore } = initializeFirebase();

export async function addProject(projectData: Omit<Project, 'id' | 'createdAt' | 'status'>): Promise<void> {
    const projectsCol = collection(firestore, 'projects');
    await addDoc(projectsCol, {
        ...projectData,
        status: 'pending',
        createdAt: serverTimestamp(),
    });
}

export async function updateProjectStatus(id: string, status: ProjectStatus): Promise<void> {
  const projectDocRef = doc(firestore, 'projects', id);
  await updateDoc(projectDocRef, { status });
}
