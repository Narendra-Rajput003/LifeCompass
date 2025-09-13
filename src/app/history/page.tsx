'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Compass, History, Home } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { type AnalysisResult } from '@/app/actions';

type HistoryItem = {
  id: string;
  dilemma: string;
  result: AnalysisResult;
};

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('decisionHistory') || '[]');
    setHistory(storedHistory);
    setIsLoading(false);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
       <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <Compass className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">LifeCompass</h1>
            </Link>
            <Link href="/">
              <Button variant="ghost">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex items-center gap-4 mb-8">
          <History className="h-10 w-10 text-primary" />
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Decision History</h2>
            <p className="text-lg text-muted-foreground">A log of your past dilemmas and analyses.</p>
          </div>
        </div>

        {isLoading && <p>Loading history...</p>}

        {!isLoading && history.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <History className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No decisions yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Once you analyze a dilemma, it will show up here.
            </p>
            <div className="mt-6">
              <Link href="/">
                <Button>Analyze Your First Dilemma</Button>
              </Link>
            </div>
          </div>
        )}

        {!isLoading && history.length > 0 && (
          <div className="space-y-4">
            {history.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{item.dilemma}</CardTitle>
                  <CardDescription>
                    Analyzed on {new Date(item.id).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                   <p className="text-sm text-muted-foreground italic">
                    {item.result.recommendation.recommendation}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      
      <footer className="py-6 border-t mt-auto bg-background/80">
        <div className="container mx-auto text-center text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} LifeCompass. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
