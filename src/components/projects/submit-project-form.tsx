'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormState } from 'react-dom';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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
import { suggestProjectTags } from '@/ai/flows/suggest-project-tags-flow';
import { Loader2, Sparkles } from 'lucide-react';

const projectFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long.'),
  shortDescription: z.string().min(10, 'Short description must be at least 10 characters long.').max(150, 'Short description must be 150 characters or less.'),
  fullDescription: z.string().min(50, 'Full description must be at least 50 characters long.'),
  screenshotUrl: z.string().url('Please select a screenshot.'),
  liveUrl: z.string().url('Please provide a valid live URL.'),
  githubUrl: z.string().url('Please provide a valid GitHub URL.'),
  aiTool: z.string().min(1, 'AI Tool is required.'),
  techStack: z.string().min(1, 'At least one tech stack item is required.'),
  batch: z.string().min(4, 'Batch is required.'),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

const initialState: SubmitProjectState = { message: null, errors: {} };

export function SubmitProjectForm({ onFormSubmit }: { onFormSubmit: () => void }) {
  const [state, formAction] = useFormState(submitProject, initialState);
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSuggesting, setIsSuggesting] = useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: '',
      shortDescription: '',
      fullDescription: '',
      screenshotUrl: '',
      liveUrl: '',
      githubUrl: '',
      aiTool: '',
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
  
  const handleSuggestTags = async () => {
    const description = form.getValues('fullDescription');
    if (!description || description.length < 50) {
      toast({
        title: 'Description too short',
        description: 'Please provide a more detailed description before suggesting tags.',
        variant: 'destructive',
      });
      return;
    }
    setIsSuggesting(true);
    try {
      const result = await suggestProjectTags({ projectDescription: description });
      if (result.aiTools.length > 0) {
        form.setValue('aiTool', result.aiTools[0]);
      }
      if (result.techStack.length > 0) {
        form.setValue('techStack', result.techStack.join(', '));
      }
      toast({
        title: 'Suggestions Applied!',
        description: 'AI-powered suggestions have been added to your form.'
      })
    } catch (error) {
      console.error('Failed to suggest tags:', error);
      toast({
        title: 'Error',
        description: 'Could not generate AI suggestions at this time.',
        variant: 'destructive',
      });
    } finally {
      setIsSuggesting(false);
    }
  };

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
                <Input placeholder="e.g., AI-Powered Chatbot" {...field} />
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
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <FormLabel>AI Tools & Tech Stack</FormLabel>
                <Button type="button" variant="outline" size="sm" onClick={handleSuggestTags} disabled={isSuggesting}>
                    {isSuggesting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Suggest with AI
                </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="aiTool"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <Input placeholder="Primary AI Tool (e.g., TensorFlow)" {...field} />
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
                    <FormControl>
                        <Input placeholder="Tech Stack (comma-separated)" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
        </div>

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
