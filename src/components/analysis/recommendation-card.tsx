import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BrainCircuit } from 'lucide-react';

export function RecommendationCard({ recommendation, reasoning }: { recommendation: string; reasoning: string }) {
  return (
    <Card className="bg-primary/5 border-primary/20 shadow-md h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit /> AI Recommendation
        </CardTitle>
        <CardDescription>A suggestion tailored to your situation.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <blockquote className="border-l-4 border-primary pl-4">
            <p className="text-lg font-semibold text-primary">{recommendation}</p>
        </blockquote>
        <Separator />
        <div>
          <h4 className="font-semibold mb-2">Reasoning</h4>
          <p className="text-muted-foreground">{reasoning}</p>
        </div>
      </CardContent>
    </Card>
  );
}
