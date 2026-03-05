'use server';

import { z } from 'zod';
import { addProject, updateProjectStatus } from './data';
import { revalidatePath } from 'next/cache';

const ProjectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long.'),
  shortDescription: z.string().min(10, 'Short description must be at least 10 characters long.').max(150, 'Short description must be 150 characters or less.'),
  fullDescription: z.string().min(50, 'Full description must be at least 50 characters long.'),
  screenshotUrl: z.string().url('Please provide a valid screenshot URL.'),
  liveUrl: z.string().url('Please provide a valid live URL.'),
  githubUrl: z.string().url('Please provide a valid GitHub URL.'),
  techStack: z.string().min(1, 'At least one tech stack item is required.'),
  batch: z.string().min(4, 'Batch is required.'),
  userId: z.string().min(1, 'User ID is required.'),
  userNickname: z.string().min(1, 'User nickname is required.'),
});

export type SubmitProjectState = {
  errors?: {
    [key: string]: string[] | undefined;
  };
  message?: string | null;
};


export async function submitProject(
  data: z.infer<typeof ProjectSchema>
): Promise<SubmitProjectState> {
  const validatedFields = ProjectSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check your input.',
    };
  }
  
  const { techStack, ...rest } = validatedFields.data;

  try {
    await addProject({
      ...rest,
      techStack: techStack.split(',').map(item => item.trim()).filter(Boolean),
    });
  } catch (error) {
    return {
      message: 'Database Error: Failed to submit project.',
    };
  }

  revalidatePath('/');
  revalidatePath('/admin');
  return { message: 'Project submitted successfully for review.' };
}

export async function approveProject(projectId: string) {
  try {
    await updateProjectStatus(projectId, 'approved');
    revalidatePath('/');
    revalidatePath('/admin');
    return { message: 'Project approved.' };
  } catch (error) {
    return { message: 'Database Error: Failed to approve project.' };
  }
}

export async function rejectProject(projectId: string) {
  try {
    await updateProjectStatus(projectId, 'rejected');
    revalidatePath('/');
    revalidatePath('/admin');
    return { message: 'Project rejected.' };
  } catch (error) {
    return { message: 'Database Error: Failed to reject project.' };
  }
}
