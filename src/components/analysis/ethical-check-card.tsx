import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, CheckCircle, AlertTriangle } from 'lucide-react';

export function EthicalCheckCard({ biasDetected, explanation }: { biasDetected: boolean; explanation: string }) {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <ShieldCheck /> Ethical & Bias Check
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-start gap-4">
        {biasDetected ? (
          <AlertTriangle className="h-8 w-8 text-yellow-500 flex-shrink-0 mt-1" />
        ) : (
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-500 flex-shrink-0 mt-1" />
        )}
        <div>
          <p className={`font-semibold ${biasDetected ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-700 dark:text-green-500'}`}>
            {biasDetected ? "Potential Bias Detected" : "No Obvious Biases Detected"}
          </p>
          <p className="text-sm text-muted-foreground">{explanation}</p>
        </div>
      </CardContent>
    </Card>
  );
}
