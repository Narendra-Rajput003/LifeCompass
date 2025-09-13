'use server';

import { z } from 'zod';
import { generateProsCons } from '@/ai/flows/generate-pros-cons';
import { simulateScenarios } from '@/ai/flows/simulate-scenarios';
import { getPersonalizedRecommendation } from '@/ai/flows/personalized-recommendations';
import { checkEthicalBias } from '@/ai/flows/check-ethical-bias';

const schema = z.object({
  dilemma: z.string().min(10, { message: 'Please describe your dilemma in at least 10 characters.' }),
});

export type AnalysisResult = {
  dilemma: string;
  prosCons: Awaited<ReturnType<typeof generateProsCons>>;
  scenarios: Awaited<ReturnType<typeof simulateScenarios>>;
  recommendation: Awaited<ReturnType<typeof getPersonalizedRecommendation>>;
  ethicalCheck: Awaited<ReturnType<typeof checkEthicalBias>>;
}

export type ActionResponse = {
    data?: AnalysisResult;
    error?: string;
}

// Mock user profile for personalized recommendations
const userProfile = "A young professional in the tech industry, values work-life balance and career growth. Tends to be risk-averse but is open to new opportunities if they align with long-term goals. Past choices include prioritizing stable jobs over startups.";

export async function getDecisionAnalysis(
  formData: FormData,
): Promise<ActionResponse> {
  const validatedFields = schema.safeParse({
    dilemma: formData.get('dilemma'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.dilemma?.join(', '),
    };
  }

  const dilemma = validatedFields.data.dilemma;

  try {
    const [prosCons, scenarios, recommendation] = await Promise.all([
      generateProsCons({ decision: dilemma }),
      simulateScenarios({ decision: dilemma, availableData: 'General knowledge about life decisions.' }),
      getPersonalizedRecommendation({ userProfile, currentDilemma: dilemma }),
    ]);

    const combinedText = `
      Pros: ${prosCons.pros.join(', ')}. 
      Cons: ${prosCons.cons.join(', ')}. 
      Recommendation: ${recommendation.recommendation}. 
      Reasoning: ${recommendation.reasoning}.
    `;

    const ethicalCheck = await checkEthicalBias({ text: combinedText });
    
    return { data: { dilemma, prosCons, scenarios, recommendation, ethicalCheck } };

  } catch (error) {
    console.error(error);
    return {
      error: 'An unexpected error occurred while analyzing your dilemma. Please try again.',
    };
  }
}
