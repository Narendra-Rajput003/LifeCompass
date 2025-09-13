'use server';

/**
 * @fileOverview Simulates potential outcomes for each decision, providing a probability score based on available data.
 *
 * - simulateScenarios - A function that simulates potential outcomes and provides probability scores.
 * - SimulateScenariosInput - The input type for the simulateScenarios function.
 * - SimulateScenariosOutput - The return type for the simulateScenarios function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimulateScenariosInputSchema = z.object({
  decision: z.string().describe('The decision to simulate scenarios for.'),
  availableData: z.string().optional().describe('Available data to use for simulation.'),
});

export type SimulateScenariosInput = z.infer<typeof SimulateScenariosInputSchema>;

const SimulateScenariosOutputSchema = z.object({
  scenarioSimulations: z.array(
    z.object({
      outcome: z.string().describe('The potential outcome of the scenario.'),
      probabilityScore: z.number().describe('The probability score of the outcome (0-1).'),
      rationale: z.string().describe('The rationale behind the probability score.'),
    })
  ).describe('An array of scenario simulations with potential outcomes and probability scores.'),
});

export type SimulateScenariosOutput = z.infer<typeof SimulateScenariosOutputSchema>;

export async function simulateScenarios(input: SimulateScenariosInput): Promise<SimulateScenariosOutput> {
  return simulateScenariosFlow(input);
}

const simulateScenariosPrompt = ai.definePrompt({
  name: 'simulateScenariosPrompt',
  input: {schema: SimulateScenariosInputSchema},
  output: {schema: SimulateScenariosOutputSchema},
  prompt: `You are an AI assistant that simulates potential outcomes for decisions.

  Decision: {{{decision}}}
  Available Data: {{{availableData}}}

  Simulate potential outcomes for the decision, providing a probability score (0-1) for each outcome based on the available data. Include a rationale for each probability score.
  Return the results in JSON format.
  `,
});

const simulateScenariosFlow = ai.defineFlow(
  {
    name: 'simulateScenariosFlow',
    inputSchema: SimulateScenariosInputSchema,
    outputSchema: SimulateScenariosOutputSchema,
  },
  async input => {
    const {output} = await simulateScenariosPrompt(input);
    return output!;
  }
);
