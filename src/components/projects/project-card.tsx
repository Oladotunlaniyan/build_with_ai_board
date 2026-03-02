import type { Project } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/project/${project.id}`} className="group">
      <Card className="h-full flex flex-col transition-transform duration-300 ease-in-out hover:scale-[1.02] hover:shadow-md">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={project.screenshotUrl}
              alt={`Screenshot of ${project.title}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover rounded-t-lg"
              data-ai-hint={project.screenshotHint}
            />
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-4">
          <CardTitle className="text-lg font-semibold mb-2">{project.title}</CardTitle>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.shortDescription}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-end items-center text-xs">
          <span className="text-muted-foreground">by {project.student.nickname}</span>
        </CardFooter>
      </Card>
    </Link>
  );
}
