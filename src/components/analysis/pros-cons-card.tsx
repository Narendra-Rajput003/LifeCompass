import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Scale, CheckCircle, XCircle } from 'lucide-react';

export function ProsConsCard({ pros, cons }: { pros: string[]; cons: string[] }) {
  return (
    <Card className="shadow-md h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale /> Weighing the Options
        </CardTitle>
        <CardDescription>A balanced view of the potential upsides and downsides.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-green-600 dark:text-green-500">
            <CheckCircle className="h-5 w-5" />
            Pros
          </h3>
          <ul className="space-y-2 list-inside">
            {pros.map((pro, i) => (
              <li key={`pro-${i}`} className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-500 mt-1">&bull;</span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-red-600 dark:text-red-500">
            <XCircle className="h-5 w-5" />
            Cons
          </h3>
          <ul className="space-y-2 list-inside">
            {cons.map((con, i) => (
              <li key={`con-${i}`} className="flex items-start gap-2">
                <span className="text-red-600 dark:text-red-500 mt-1">&bull;</span>
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
