import type { Project } from '@/lib/types';
import ProjectCard from './project-card';

type ProjectGridProps = {
  projects: Project[];
};

export default function ProjectGrid({ projects }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No projects to display yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
