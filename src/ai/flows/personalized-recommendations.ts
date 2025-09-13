'use server';

/**
 * @fileOverview Personalized decision-making assistance flow.
 *
 * - getPersonalizedRecommendation - A function that provides personalized recommendations based on user profile and historical choices.
 * - PersonalizedRecommendationInput - The input type for the getPersonalizedRecommendation function.
 * - PersonalizedRecommendationOutput - The return type for the getPersonalizedRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationInputSchema = z.object({
  userProfile: z
    .string()
    .describe('A description of the user profile including preferences and historical choices.'),
  currentDilemma: z.string().describe('The current dilemma the user is facing.'),
});
export type PersonalizedRecommendationInput = z.infer<
  typeof PersonalizedRecommendationInputSchema
>;

const PersonalizedRecommendationOutputSchema = z.object({
  recommendation: z
    .string()
    .describe('A personalized recommendation based on the user profile and current dilemma.'),
  reasoning: z.string().describe('The reasoning behind the recommendation.'),
});
export type PersonalizedRecommendationOutput = z.infer<
  typeof PersonalizedRecommendationOutputSchema
>;

export async function getPersonalizedRecommendation(
  input: PersonalizedRecommendationInput
): Promise<PersonalizedRecommendationOutput> {
  return personalizedRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRecommendationPrompt',
  input: {schema: PersonalizedRecommendationInputSchema},
  output: {schema: PersonalizedRecommendationOutputSchema},
  prompt: `You are a personal decision-making assistant. Based on the user's profile and their current dilemma, provide a personalized recommendation.

User Profile: {{{userProfile}}}
Current Dilemma: {{{currentDilemma}}}

Provide a recommendation and explain your reasoning. Adhere to the output schema and make sure it can be parsed by Typescript's JSON.parse method, escaping quotes when necessary.`,
});

const personalizedRecommendationFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationFlow',
    inputSchema: PersonalizedRecommendationInputSchema,
    outputSchema: PersonalizedRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
