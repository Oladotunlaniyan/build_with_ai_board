'use client';

import { useCollection, useFirestore, useMemoFirebase, useUser, useDoc } from '@/firebase';
import ModerationTable from '@/components/admin/moderation-table';
import { Skeleton } from '@/components/ui/skeleton';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import type { Project, UserProfile } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

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

function AdminProjects() {
    const firestore = useFirestore();

    const projectsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'projects'), orderBy('createdAt', 'desc'));
    }, [firestore]);

    const { data: projects, isLoading, error } = useCollection<Project>(projectsQuery);

    if (isLoading) {
        return <AdminTableSkeleton />;
    }

    if (error) {
        return (
             <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error loading projects</AlertTitle>
                <AlertDescription>
                   {error.message}
                </AlertDescription>
            </Alert>
        )
    }

    if (!projects || projects.length === 0) {
        return <p>No projects to display yet.</p>
    }

    const projectsWithDates = projects.map(p => ({
        ...p,
        // @ts-ignore Firestore Timestamps need to be converted to JS Dates
        createdAt: p.createdAt?.toDate ? p.createdAt.toDate() : new Date(),
    }));

    return <ModerationTable projects={projectsWithDates} />;
}

export default function ProjectsList() {
    const firestore = useFirestore();
    const { user, isUserLoading } = useUser();

    const userDocRef = useMemoFirebase(
      () => (user ? doc(firestore, 'users', user.uid) : null),
      [user, firestore]
    );
    const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userDocRef);

    if (isUserLoading || isProfileLoading) {
        return <AdminTableSkeleton />;
    }
    
    if (userProfile?.role === 'admin') {
        return <AdminProjects />;
    }

    return (
        <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
                You do not have permission to view this page.
            </AlertDescription>
        </Alert>
    );
}
