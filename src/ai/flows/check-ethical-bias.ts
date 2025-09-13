'use server';

/**
 * @fileOverview An ethical bias checking AI agent.
 *
 * - checkEthicalBias - A function that handles the ethical bias checking process.
 * - CheckEthicalBiasInput - The input type for the checkEthicalBias function.
 * - CheckEthicalBiasOutput - The return type for the checkEthicalBias function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CheckEthicalBiasInputSchema = z.object({
  text: z.string().describe('The AI-generated text to be checked for ethical biases.'),
});
export type CheckEthicalBiasInput = z.infer<typeof CheckEthicalBiasInputSchema>;

const CheckEthicalBiasOutputSchema = z.object({
  biasDetected: z.boolean().describe('Whether any ethical biases were detected in the text.'),
  explanation: z
    .string()
    .describe('An explanation of any biases detected, or a statement that no biases were found.'),
});
export type CheckEthicalBiasOutput = z.infer<typeof CheckEthicalBiasOutputSchema>;

export async function checkEthicalBias(input: CheckEthicalBiasInput): Promise<CheckEthicalBiasOutput> {
  return checkEthicalBiasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'checkEthicalBiasPrompt',
  input: {schema: CheckEthicalBiasInputSchema},
  output: {schema: CheckEthicalBiasOutputSchema},
  prompt: `You are an AI ethics expert. Your task is to analyze the given text for any potential ethical biases related to gender, race, religion, or other protected characteristics.

Text to analyze: {{{text}}}

Determine whether the text exhibits any biases. If biases are present, explain what they are and how they manifest in the text. If no biases are found, state that clearly.

Your response should include:
1.  A boolean value indicating whether biases were detected (biasDetected).
2.  An explanation of the biases or a statement of their absence (explanation).`,
});

const checkEthicalBiasFlow = ai.defineFlow(
  {
    name: 'checkEthicalBiasFlow',
    inputSchema: CheckEthicalBiasInputSchema,
    outputSchema: CheckEthicalBiasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
