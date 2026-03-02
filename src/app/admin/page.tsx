import ProjectsList from '@/components/admin/projects-list';

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Admin Moderation</h1>
      <p className="text-muted-foreground">
        Review and approve or reject student project submissions.
      </p>
      <ProjectsList />
    </div>
  );
}
