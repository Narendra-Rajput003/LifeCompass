'use server';

/**
 * @fileOverview A Genkit flow for generating pros and cons for a given decision.
 *
 * - generateProsCons - A function that generates pros and cons for a given decision.
 * - GenerateProsConsInput - The input type for the generateProsCons function.
 * - GenerateProsConsOutput - The return type for the generateProsCons function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProsConsInputSchema = z.object({
  decision: z.string().describe('The decision for which to generate pros and cons.'),
});
export type GenerateProsConsInput = z.infer<typeof GenerateProsConsInputSchema>;

const GenerateProsConsOutputSchema = z.object({
  pros: z.array(z.string()).describe('A list of pros for the decision.'),
  cons: z.array(z.string()).describe('A list of cons for the decision.'),
});
export type GenerateProsConsOutput = z.infer<typeof GenerateProsConsOutputSchema>;

export async function generateProsCons(input: GenerateProsConsInput): Promise<GenerateProsConsOutput> {
  return generateProsConsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProsConsPrompt',
  input: {schema: GenerateProsConsInputSchema},
  output: {schema: GenerateProsConsOutputSchema},
  prompt: `You are an AI assistant helping users make decisions. Generate a list of pros and cons for the following decision:\n\nDecision: {{{decision}}}\n\nFormat the output as a JSON object with \"pros\" and \"cons\" fields, each containing an array of strings.\n`,
});

const generateProsConsFlow = ai.defineFlow(
  {
    name: 'generateProsConsFlow',
    inputSchema: GenerateProsConsInputSchema,
    outputSchema: GenerateProsConsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
