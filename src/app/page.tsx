import ProjectGrid from '@/components/projects/project-grid';
import { getProjects } from '@/lib/data';

export default async function Home() {
  const allProjects = await getProjects();
  const approvedProjects = allProjects.filter(
    (project) => project.status === 'approved'
  );

  return <ProjectGrid projects={approvedProjects} />;
}
