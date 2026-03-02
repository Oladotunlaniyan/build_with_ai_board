'use server';
/**
 * @fileOverview This file implements a Genkit flow to suggest relevant AI tools and tech stack components
 * based on a project's description.
 *
 * - suggestProjectTags - A function that suggests AI tools and tech stack.
 * - SuggestProjectTagsInput - The input type for the suggestProjectTags function.
 * - SuggestProjectTagsOutput - The return type for the suggestProjectTags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestProjectTagsInputSchema = z.object({
  projectDescription: z.string().describe('The detailed description of the project.'),
});
export type SuggestProjectTagsInput = z.infer<typeof SuggestProjectTagsInputSchema>;

const SuggestProjectTagsOutputSchema = z.object({
  aiTools: z
    .array(z.string())
    .describe(
      'A JSON array of strings, where each string is the name of an AI tool relevant to the project (e.g., "TensorFlow", "PyTorch", "OpenAI API", "LangChain").'
    ),
  techStack: z
    .array(z.string())
    .describe(
      'A JSON array of strings, where each string is the name of a general tech stack component relevant to the project (e.g., "Next.js", "Firebase", "Node.js", "Python", "React").'
    ),
});
export type SuggestProjectTagsOutput = z.infer<typeof SuggestProjectTagsOutputSchema>;

export async function suggestProjectTags(
  input: SuggestProjectTagsInput
): Promise<SuggestProjectTagsOutput> {
  return suggestProjectTagsFlow(input);
}

const suggestProjectTagsPrompt = ai.definePrompt({
  name: 'suggestProjectTagsPrompt',
  input: {schema: SuggestProjectTagsInputSchema},
  output: {schema: SuggestProjectTagsOutputSchema},
  prompt: `You are an expert in AI tools and software development tech stacks. Your task is to analyze a project description and suggest relevant AI tools and general tech stack components that could be used in or are related to the project.

Project Description:
{{{projectDescription}}}`,
});

const suggestProjectTagsFlow = ai.defineFlow(
  {
    name: 'suggestProjectTagsFlow',
    inputSchema: SuggestProjectTagsInputSchema,
    outputSchema: SuggestProjectTagsOutputSchema,
  },
  async input => {
    const {output} = await suggestProjectTagsPrompt(input);
    return output!;
  }
);
