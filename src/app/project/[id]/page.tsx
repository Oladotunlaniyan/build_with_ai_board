import { getProjectById } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github } from 'lucide-react';
import Link from 'next/link';

type ProjectDetailsPageProps = {
  params: {
    id: string;
  };
};

export default async function ProjectDetailsPage({ params }: ProjectDetailsPageProps) {
  const project = await getProjectById(params.id);

  if (!project || project.status !== 'approved') {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden border mb-8 shadow-sm">
        <Image
          src={project.screenshotUrl}
          alt={`Screenshot of ${project.title}`}
          fill
          className="object-cover"
          sizes="100vw"
          priority
          data-ai-hint={project.screenshotHint}
        />
      </div>

      <h1 className="text-3xl md:text-4xl font-semibold mb-4">{project.title}</h1>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground mb-8 text-sm">
        <span>by {project.student.nickname}</span>
        <span className="hidden sm:inline">|</span>
        <Badge variant="secondary">{project.aiTool}</Badge>
        <span className="hidden sm:inline">|</span>
        <span>Batch {project.batch}</span>
      </div>

      <div className="prose prose-stone dark:prose-invert max-w-none text-foreground/90">
        <p className="lead text-lg mb-6">{project.shortDescription}</p>
        <p>{project.fullDescription}</p>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg">
          <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2" />
            View Live Project
          </Link>
        </Button>
        <Button asChild variant="secondary" size="lg">
          <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
            <Github className="mr-2" />
            View GitHub Repository
          </Link>
        </Button>
      </div>
    </div>
  );
}
