'use client';

import { useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2, Github, ExternalLink } from 'lucide-react';
import { doc } from 'firebase/firestore';
import type { Project, UserProfile } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
    notFound();
  }

  const isAdmin = userProfile?.role === 'admin';
  const isOwner = user?.uid === project.userId;

  if (project.status !== 'approved' && !isAdmin && !isOwner) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">{project.title}</h1>
        <p className="text-lg text-muted-foreground">{project.shortDescription}</p>
        <p className="text-sm text-muted-foreground mt-1">Submitted by {project.userNickname} from Batch {project.batch}</p>
      </div>

      <div className="relative w-full aspect-video rounded-lg overflow-hidden border shadow-sm">
        <Image
          src={project.screenshotUrl}
          alt={`Screenshot of ${project.title}`}
          fill
          className="object-contain"
          sizes="100vw"
          priority
        />
      </div>

      <div className="flex gap-4">
        <Button asChild>
            <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
            </Link>
        </Button>
        <Button variant="secondary" asChild>
            <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" /> View on GitHub
            </Link>
        </Button>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">About this project</h2>
        <div className="max-w-none">
            <p>{project.fullDescription}</p>
        </div>
      </div>
      
      <div>
          <h3 className="text-xl font-semibold mb-3">Tech Stack</h3>
          <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                  <Badge key={tech} variant="secondary">{tech}</Badge>
              ))}
          </div>
      </div>
    </div>
  );
}
