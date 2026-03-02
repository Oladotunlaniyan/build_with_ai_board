'use server';

import type { Project, ProjectStatus } from './types';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  getDocs,
} from 'firebase/firestore/lite';
import { initializeFirebase } from '@/firebase/index.server';

// This is a server-side file, so we need to initialize Firebase here.
const { firestore } = initializeFirebase();

export async function getApprovedProjects(): Promise<Project[]> {
    const projectsCol = collection(firestore, 'projects');
    const q = query(projectsCol, where('status', '==', 'approved'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const projects = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            ...data,
            id: doc.id,
            // The 'createdAt' field is a Firestore Timestamp. It needs to be converted to a serializable format for the client component.
            // The toDate() method converts it to a JS Date object, which is serializable.
            createdAt: data.createdAt.toDate(),
        } as Project;
    });
    return projects;
}

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
