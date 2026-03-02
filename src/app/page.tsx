import { Suspense } from 'react';
import ProjectGrid from '@/components/projects/project-grid';
import { getApprovedProjects } from '@/lib/data';
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

async function ProjectsList() {
  const projects = await getApprovedProjects();
  return <ProjectGrid projects={projects} />;
}

export default function Home() {
  return (
      <Suspense fallback={<ProjectGridSkeleton />}>
        <ProjectsList />
      </Suspense>
  );
}
