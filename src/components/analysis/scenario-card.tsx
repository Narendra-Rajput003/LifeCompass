import type { ActionResponse } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Rows } from 'lucide-react';

type Scenario = NonNullable<NonNullable<ActionResponse['data']>['scenarios']>['scenarioSimulations'][0];

export function ScenarioCard({ scenarios }: { scenarios: Scenario[] }) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rows /> Possible Futures
        </CardTitle>
        <CardDescription>Simulating potential outcomes based on available data.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {scenarios.map((scenario, i) => (
          <div key={`scenario-${i}`}>
            <div className="mb-2">
              <div className="flex justify-between items-center mb-1">
                <p className="font-medium">{scenario.outcome}</p>
                <p className="font-semibold text-primary">{Math.round(scenario.probabilityScore * 100)}%</p>
              </div>
              <Progress value={scenario.probabilityScore * 100} />
            </div>
            <p className="text-sm text-muted-foreground italic">
              <strong>Rationale:</strong> {scenario.rationale}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
