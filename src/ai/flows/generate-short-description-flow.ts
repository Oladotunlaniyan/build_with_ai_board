'use server';
/**
 * @fileOverview A Genkit flow to generate a concise short description from a longer project description.
 *
 * - generateShortDescription - A function that handles the generation of the short description.
 * - GenerateShortDescriptionInput - The input type for the generateShortDescription function.
 * - GenerateShortDescriptionOutput - The return type for the generateShortDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateShortDescriptionInputSchema = z.object({
  fullDescription: z
    .string()
    .describe('The full, detailed description of the project.'),
});
export type GenerateShortDescriptionInput = z.infer<
  typeof GenerateShortDescriptionInputSchema
>;

const GenerateShortDescriptionOutputSchema = z.object({
  shortDescription: z
    .string()
    .describe('A concise, 2-3 sentence summary of the project.'),
});
export type GenerateShortDescriptionOutput = z.infer<
  typeof GenerateShortDescriptionOutputSchema
>;

export async function generateShortDescription(
  input: GenerateShortDescriptionInput
): Promise<GenerateShortDescriptionOutput> {
  return generateShortDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateShortDescriptionPrompt',
  input: {schema: GenerateShortDescriptionInputSchema},
  output: {schema: GenerateShortDescriptionOutputSchema},
  prompt: `Summarize the following project description into a concise short description suitable for a project board. Keep the summary to a maximum of 2-3 sentences.

Project Description: {{{fullDescription}}}`,
});

const generateShortDescriptionFlow = ai.defineFlow(
  {
    name: 'generateShortDescriptionFlow',
    inputSchema: GenerateShortDescriptionInputSchema,
    outputSchema: GenerateShortDescriptionOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
