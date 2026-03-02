'use server';

import type { Project, User, ProjectStatus } from './types';
import { PlaceHolderImages } from './placeholder-images';

let mockUsers: User[] = [
  { id: '1', email: 'user@example.com', nickname: 'AIBuilder', role: 'user' },
  { id: '2', email: 'admin@example.com', nickname: 'Admin', role: 'admin' },
];

let mockProjects: Project[] = [
  {
    id: '1',
    title: 'AI-Powered Resume Analyzer',
    student: { id: '1', nickname: 'AIBuilder' },
    screenshotUrl: PlaceHolderImages[0].imageUrl,
    screenshotHint: PlaceHolderImages[0].imageHint,
    shortDescription: 'An intelligent tool to screen resumes and score them based on job descriptions using NLP.',
    fullDescription: 'This project leverages natural language processing to parse resumes, extract key information like skills and experience, and compare it against a given job description. It provides a compatibility score, helping recruiters to quickly identify the most promising candidates. The backend is built with Python and Flask, while the frontend uses React.',
    liveUrl: '#',
    githubUrl: '#',
    aiTool: 'OpenAI API',
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
    shortDescription: 'A YOLOv8-based system for real-time object detection in retail stores to monitor stock levels.',
    fullDescription: 'This system uses cameras placed in a retail environment to perform real-time object detection with YOLOv8. It identifies products on shelves and can automatically alert staff when stock is low or misplaced. The solution aims to reduce manual inventory checks and prevent stockouts.',
    liveUrl: '#',
    githubUrl: '#',
    aiTool: 'YOLOv8',
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
    aiTool: 'LangChain',
    techStack: ['Next.js', 'Firebase', 'Node.js', 'GraphQL'],
    batch: '2024',
    status: 'approved',
    createdAt: new Date('2024-05-15T14:00:00Z'),
  },
  {
    id: '4',
    title: 'Customer Support Chatbot',
    student: { id: '1', nickname: 'ChattyDev' },
    screenshotUrl: PlaceHolderImages[3].imageUrl,
    screenshotHint: PlaceHolderImages[3].imageHint,
    shortDescription: 'A conversational AI to handle customer support queries on an e-commerce website.',
    fullDescription: 'This is a pending project. This chatbot is designed to integrate with e-commerce platforms to provide instant answers to frequently asked questions, track orders, and handle returns. It uses a retrieval-augmented generation (RAG) model to provide accurate information from the company\'s knowledge base.',
    liveUrl: '#',
    githubUrl: '#',
    aiTool: 'Google AI',
    techStack: ['Next.js', 'Firebase', 'Genkit'],
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
