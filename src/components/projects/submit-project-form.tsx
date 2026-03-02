'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormState } from 'react-dom';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

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
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Loader2 } from 'lucide-react';

const projectFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long.'),
  shortDescription: z.string().min(10, 'Short description must be at least 10 characters long.').max(150, 'Short description must be 150 characters or less.'),
  fullDescription: z.string().min(50, 'Full description must be at least 50 characters long.'),
  screenshotUrl: z.string().url('Please select a screenshot.'),
  liveUrl: z.string().url('Please provide a valid live URL.'),
  githubUrl: z.string().url('Please provide a valid GitHub URL.'),
  techStack: z.string().min(1, 'At least one tech stack item is required.'),
  batch: z.string().min(4, 'Batch is required.'),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

const initialState: SubmitProjectState = { message: null, errors: {} };

export function SubmitProjectForm({ onFormSubmit }: { onFormSubmit: () => void }) {
  const [state, formAction] = useFormState(submitProject, initialState);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: '',
      shortDescription: '',
      fullDescription: '',
      screenshotUrl: '',
      liveUrl: '',
      githubUrl: '',
      techStack: '',
      batch: '2024',
    },
  });

  useEffect(() => {
    if (state.message) {
      if (state.errors) {
        toast({
          title: 'Error Submitting Project',
          description: state.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success!',
          description: state.message,
        });
        onFormSubmit();
        form.reset();
      }
    }
  }, [state, toast, onFormSubmit, form]);

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="studentId" value={user?.id} />
        <input type="hidden" name="studentNickname" value={user?.nickname} />
        
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
          name="screenshotUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Screenshot</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a placeholder screenshot" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PlaceHolderImages.map(img => (
                    <SelectItem key={img.id} value={img.imageUrl}>
                      {img.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" name="screenshotHint" value={PlaceHolderImages.find(img => img.imageUrl === field.value)?.imageHint || ''} />
              <FormMessage />
            </FormItem>
          )}
        />

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

        <FormField
          control={form.control}
          name="batch"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Batch</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your batch" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end pt-4">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit for Review
            </Button>
        </div>
      </form>
    </Form>
  );
}
