import type { Project } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/project/${project.id}`} className="group">
      <Card className="h-full flex flex-col transition-transform duration-300 ease-in-out hover:scale-[1.02] hover:shadow-md">
        <div className="relative h-48 w-full">
          <Image
            src={project.screenshotUrl}
            alt={`Snapshot of ${project.title}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover rounded-t-lg"
          />
        </div>
        <CardHeader>
          <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
          <CardDescription className="text-sm line-clamp-3">{project.shortDescription}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
