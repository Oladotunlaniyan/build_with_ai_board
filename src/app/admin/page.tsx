import { getProjects } from '@/lib/data';
import ModerationTable from '@/components/admin/moderation-table';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Admin Moderation</h1>
      <p className="text-muted-foreground">
        Review and approve or reject student project submissions.
      </p>
      <Suspense fallback={<AdminTableSkeleton />}>
        <ProjectsList />
      </Suspense>
    </div>
  );
}

async function ProjectsList() {
    const projects = await getProjects();
    return <ModerationTable projects={projects} />;
}

function AdminTableSkeleton() {
    return (
        <div className="border rounded-lg p-4 space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
    )
}
