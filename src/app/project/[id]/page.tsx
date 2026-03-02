'use client';

import { useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { doc } from 'firebase/firestore';
import type { Project, UserProfile } from '@/lib/types';

export default function ProjectDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useUser();
  const firestore = useFirestore();

  const projectDocRef = useMemoFirebase(
    () => (id ? doc(firestore, 'projects', id) : null),
    [id, firestore]
  );
  const { data: project, isLoading, error } = useDoc<Project>(projectDocRef);
  
  const userDocRef = useMemoFirebase(
    () => (user ? doc(firestore, 'users', user.uid) : null),
    [user, firestore]
  );
  const { data: userProfile } = useDoc<UserProfile>(userDocRef);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (error || !project) {
    // This could be a permission error or the doc doesn't exist.
    // In either case, for a public page, it's best to show a 404.
    notFound();
  }

  const isAdmin = userProfile?.role === 'admin';
  const isOwner = user?.uid === project.userId;

  // A non-admin/non-owner should not be able to see a non-approved project.
  // The firestore rules already enforce this, but this is a good client-side check.
  if (project.status !== 'approved' && !isAdmin && !isOwner) {
    notFound();
  }

  // The 'createdAt' field will be a Firebase Timestamp, convert it to a Date.
  const projectData = {
    ...project,
    // @ts-ignore
    createdAt: project.createdAt?.toDate ? project.createdAt.toDate() : new Date(),
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden border mb-8 shadow-sm">
        <Image
          src={projectData.screenshotUrl}
          alt={`Screenshot of ${projectData.title}`}
          fill
          className="object-cover"
          sizes="100vw"
          priority
          data-ai-hint={projectData.screenshotHint}
        />
      </div>

      <h1 className="text-3xl md:text-4xl font-semibold mb-4">{projectData.title}</h1>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground mb-8 text-sm">
        <span>by {projectData.userNickname}</span>
        <span className="hidden sm:inline">|</span>
        <span>Batch {projectData.batch}</span>
      </div>

      <div className="prose prose-stone dark:prose-invert max-w-none text-foreground/90">
        <p className="lead text-lg mb-6">{projectData.shortDescription}</p>
        <p>{projectData.fullDescription}</p>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg">
          <Link href={projectData.liveUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2" />
            View Live Project
          </Link>
        </Button>
        <Button asChild variant="secondary" size="lg">
          <Link href={projectData.githubUrl} target="_blank" rel="noopener noreferrer">
            <Github className="mr-2" />
            View GitHub Repository
          </Link>
        </Button>
      </div>
    </div>
  );
}
