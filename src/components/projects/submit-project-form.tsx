'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useDoc, useMemoFirebase, useFirebaseApp } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firebaseConfig } from '@/firebase/config';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { submitProject, type SubmitProjectState } from '@/lib/actions';
import { Loader2 } from 'lucide-react';

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const projectFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long.'),
  shortDescription: z.string().min(10, 'Short description must be at least 10 characters long.').max(150, 'Short description must be 150 characters or less.'),
  fullDescription: z.string().min(50, 'Full description must be at least 50 characters long.'),
  screenshot: z
    .any()
    .refine((file) => file, 'Screenshot is required.')
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
  liveUrl: z.string().url('Please provide a valid live URL.'),
  githubUrl: z.string().url('Please provide a valid GitHub URL.'),
  techStack: z.string().min(1, 'At least one tech stack item is required.'),
  batch: z.string().min(4, 'Batch is required.'),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

export function SubmitProjectForm({ onFormSubmit }: { onFormSubmit: () => void }) {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const firebaseApp = useFirebaseApp();
  const storage = useMemoFirebase(() => getStorage(firebaseApp, firebaseConfig.storageBucket), [firebaseApp]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

  const userDocRef = useMemoFirebase(
    () => (user ? doc(firestore, 'users', user.uid) : null),
    [user, firestore]
  );
  const { data: userProfile } = useDoc<UserProfile>(userDocRef);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: '',
      shortDescription: '',
      fullDescription: '',
      screenshot: undefined,
      liveUrl: '',
      githubUrl: '',
      techStack: '',
      batch: '2024',
    },
  });

  const screenshotFile = form.watch('screenshot');

  useEffect(() => {
    let objectUrl: string;
    if (screenshotFile && screenshotFile.size > 0) {
      objectUrl = URL.createObjectURL(screenshotFile);
      setScreenshotPreview(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else {
        setScreenshotPreview(null);
    }
  }, [screenshotFile]);

  const onSubmit = async (values: ProjectFormValues) => {
    if (!user || !userProfile) {
        toast({ title: 'Error', description: 'You must be logged in to submit a project.', variant: 'destructive' });
        return;
    }

    setIsSubmitting(true);
    try {
        const file = values.screenshot as File;
        const storageRef = ref(storage, `screenshots/${user.uid}/${Date.now()}_${file.name}`);
        const uploadTask = await uploadBytes(storageRef, file);
        const screenshotUrl = await getDownloadURL(uploadTask.ref);

        const { screenshot, ...restOfValues } = values;

        const projectData = {
            ...restOfValues,
            screenshotUrl,
            userId: user.uid,
            userNickname: userProfile.nickname,
        };

        const result = await submitProject(projectData);

        if (result.message) {
            if (result.errors) {
                toast({
                    title: 'Error Submitting Project',
                    description: result.message,
                    variant: 'destructive',
                });
            } else {
                toast({
                    title: 'Success!',
                    description: result.message,
                });
                onFormSubmit();
                form.reset();
            }
        }
    } catch (error: any) {
        toast({
            title: 'Submission Failed',
            description: error.message || 'An unexpected error occurred.',
            variant: 'destructive',
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., My Awesome Project" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="shortDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Input maxLength={150} placeholder="A concise, one-sentence summary" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fullDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Description</FormLabel>
              <FormControl>
                <Textarea rows={5} placeholder="Describe your project in detail..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
            control={form.control}
            name="techStack"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Tech Stack</FormLabel>
                <FormControl>
                    <Input placeholder="Tech Stack (comma-separated, e.g. Next.js, Firebase)" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

        <FormField
          control={form.control}
          name="screenshot"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Screenshot</FormLabel>
              <FormControl>
                <Input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {screenshotPreview && (
          <div className="relative w-full aspect-video rounded-md border overflow-hidden">
            <Image src={screenshotPreview} alt="Screenshot preview" fill className="object-cover" />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="liveUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Live URL</FormLabel>
                <FormControl>
                  <Input type="url" placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="githubUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub URL</FormLabel>
                <FormControl>
                  <Input type="url" placeholder="https://github.com/..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Submitting...' : 'Submit for Review'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
