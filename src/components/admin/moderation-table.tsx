'use client';

import type { Project } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { approveProject, rejectProject } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Check, X, Loader2 } from 'lucide-react';
import { useState } from 'react';

type ModerationTableProps = {
  projects: Project[];
};

function StatusBadge({ status }: { status: Project['status'] }) {
  const variant = {
    pending: 'secondary',
    approved: 'default',
    rejected: 'destructive',
  }[status] as 'secondary' | 'default' | 'destructive';

  return <Badge variant={variant}>{status}</Badge>;
}

function ActionButtons({ project }: { project: Project }) {
  const { toast } = useToast();
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const handleApprove = async () => {
    setIsApproving(true);
    const result = await approveProject(project.id);
    toast({ title: 'Moderation', description: result.message });
    setIsApproving(false);
  };

  const handleReject = async () => {
    setIsRejecting(true);
    const result = await rejectProject(project.id);
    toast({ title: 'Moderation', description: result.message });
    setIsRejecting(false);
  };
  
  if (project.status !== 'pending') {
    return <StatusBadge status={project.status} />;
  }

  return (
    <div className="flex gap-2">
      <Button size="sm" variant="outline" onClick={handleApprove} disabled={isApproving || isRejecting}>
        {isApproving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        <span className="ml-2">Approve</span>
      </Button>
      <Button size="sm" variant="destructive" onClick={handleReject} disabled={isApproving || isRejecting}>
        {isRejecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
        <span className="ml-2">Reject</span>
      </Button>
    </div>
  );
}

export default function ModerationTable({ projects }: ModerationTableProps) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project Title</TableHead>
            <TableHead>Student</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">{project.title}</TableCell>
              <TableCell>{project.student.nickname}</TableCell>
              <TableCell>{project.createdAt.toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <ActionButtons project={project} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
