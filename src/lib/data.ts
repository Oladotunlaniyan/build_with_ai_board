'use server';

import type { Project, User, ProjectStatus } from './types';
import { PlaceHolderImages } from './placeholder-images';

let mockUsers: User[] = [
  { id: '1', email: 'user@example.com', nickname: 'DevStar', role: 'user' },
  { id: '2', email: 'admin@example.com', nickname: 'Admin', role: 'admin' },
];

let mockProjects: Project[] = [
  {
    id: '1',
    title: 'Resume Analyzer',
    student: { id: '1', nickname: 'DevStar' },
    screenshotUrl: PlaceHolderImages[0].imageUrl,
    screenshotHint: PlaceHolderImages[0].imageHint,
    shortDescription: 'A tool to screen resumes and score them based on job descriptions.',
    fullDescription: 'This project parses resumes, extracts key information like skills and experience, and compares it against a given job description. It provides a compatibility score, helping recruiters to quickly identify the most promising candidates. The backend is built with Python and Flask, while the frontend uses React.',
    liveUrl: '#',
    githubUrl: '#',
    techStack: ['Python', 'Flask', 'React', 'GCP'],
    batch: '2024',
    status: 'approved',
    createdAt: new Date('2024-05-10T10:00:00Z'),
  },
  {
    id: '2',
    title: 'Real-time Object Detection for Retail',
    student: { id: '1', nickname: 'VisionaryDev' },
    screenshotUrl: PlaceHolderImages[1].imageUrl,
    screenshotHint: PlaceHolderImages[1].imageHint,
    shortDescription: 'A system for real-time object detection in retail stores to monitor stock levels.',
    fullDescription: 'This system uses cameras placed in a retail environment to perform real-time object detection. It identifies products on shelves and can automatically alert staff when stock is low or misplaced. The solution aims to reduce manual inventory checks and prevent stockouts.',
    liveUrl: '#',
    githubUrl: '#',
    techStack: ['Python', 'OpenCV', 'PyTorch', 'Next.js'],
    batch: '2024',
    status: 'approved',
    createdAt: new Date('2024-05-12T11:30:00Z'),
  },
  {
    id: '3',
    title: 'Personalized Learning Path Generator',
    student: { id: '1', nickname: 'EduCreator' },
    screenshotUrl: PlaceHolderImages[2].imageUrl,
    screenshotHint: PlaceHolderImages[2].imageHint,
    shortDescription: 'An application that generates personalized learning paths for students based on their goals and skills.',
    fullDescription: 'Using a combination of knowledge graphs and a recommendation engine, this web app creates a tailored curriculum for learners. Users input their learning objectives and current skill level, and the system suggests a sequence of topics, resources, and projects.',
    liveUrl: '#',
    githubUrl: '#',
    techStack: ['Next.js', 'Firebase', 'Node.js', 'GraphQL'],
    batch: '2024',
    status: 'approved',
    createdAt: new Date('2024-05-15T14:00:00Z'),
  },
  {
    id: '4',
    title: 'Customer Support Platform',
    student: { id: '1', nickname: 'ChattyDev' },
    screenshotUrl: PlaceHolderImages[3].imageUrl,
    screenshotHint: PlaceHolderImages[3].imageHint,
    shortDescription: 'A platform to handle customer support queries on an e-commerce website.',
    fullDescription: 'This is a pending project. This platform is designed to integrate with e-commerce platforms to provide instant answers to frequently asked questions, track orders, and handle returns.',
    liveUrl: '#',
    githubUrl: '#',
    techStack: ['Next.js', 'Firebase'],
    batch: '2024',
    status: 'pending',
    createdAt: new Date('2024-05-18T09:00:00Z'),
  },
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getProjects(): Promise<Project[]> {
  await delay(100);
  return mockProjects.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  await delay(100);
  return mockProjects.find(p => p.id === id);
}

export async function addProject(projectData: Omit<Project, 'id' | 'createdAt' | 'status'>): Promise<Project> {
  await delay(500);
  const newProject: Project = {
    ...projectData,
    id: String(mockProjects.length + 1),
    createdAt: new Date(),
    status: 'pending',
  };
  mockProjects.unshift(newProject);
  return newProject;
}

export async function updateProjectStatus(id: string, status: ProjectStatus): Promise<Project | undefined> {
  await delay(200);
  const projectIndex = mockProjects.findIndex(p => p.id === id);
  if (projectIndex !== -1) {
    mockProjects[projectIndex].status = status;
    return mockProjects[projectIndex];
  }
  return undefined;
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
    await delay(100);
    return mockUsers.find(u => u.email === email);
}

export async function addUser(userData: Omit<User, 'id'>): Promise<User> {
    await delay(500);
    const newUser: User = {
        ...userData,
        id: String(mockUsers.length + 1),
    };
    mockUsers.push(newUser);
    return newUser;
}
