'use client';

import ProjectGrid from '@/components/projects/project-grid';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import type { Project } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

function ProjectGridSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-72 w-full rounded-lg" />
            <Skeleton className="h-72 w-full rounded-lg" />
            <Skeleton className="h-72 w-full rounded-lg" />
            <Skeleton className="h-72 w-full rounded-lg" />
            <Skeleton className="h-72 w-full rounded-lg" />
            <Skeleton className="h-72 w-full rounded-lg" />
        </div>
    )
}

export default function Home() {
  const firestore = useFirestore();

  const projectsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'projects'), 
      where('status', '==', 'approved'), 
      orderBy('createdAt', 'desc')
    );
  }, [firestore]);

  const { data: projects, isLoading } = useCollection<Project>(projectsQuery);

  if (isLoading) {
    return <ProjectGridSkeleton />;
  }

  const projectsWithDates = (projects || []).map(p => ({
    ...p,
    // @ts-ignore Firestore Timestamps need to be converted to JS Dates
    createdAt: p.createdAt?.toDate ? p.createdAt.toDate() : new Date(),
  }));

  return <ProjectGrid projects={projectsWithDates} />;
}
