'use client';

import { useState, useTransition, useEffect } from 'react';
import { Compass, Lightbulb, Moon, Sun, Share2, History } from 'lucide-react';
import Link from 'next/link';

import { getDecisionAnalysis, type ActionResponse } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

import { ProsConsCard } from './analysis/pros-cons-card';
import { ScenarioCard } from './analysis/scenario-card';
import { RecommendationCard } from './analysis/recommendation-card';
import { EthicalCheckCard } from './analysis/ethical-check-card';
import { ResultsSkeleton } from './analysis/results-skeleton';

export function LifeCompassPage() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionResponse | null>(null);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: 'Copied to Clipboard',
      description: 'You can now share the link with others.',
    });
  };

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const response = await getDecisionAnalysis(formData);
      setResult(response);
      if (response.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.error,
        });
      } else if (response.data) {
        // Save to history
        const newHistoryItem = {
          id: new Date().toISOString(),
          dilemma: response.data.dilemma,
          result: response.data,
        };
        const history = JSON.parse(localStorage.getItem('decisionHistory') || '[]');
        history.unshift(newHistoryItem);
        localStorage.setItem('decisionHistory', JSON.stringify(history));
      }
    });
  };

  const showResults = result?.data && !isPending;
  const showSkeleton = isPending;
  
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Compass className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">LifeCompass</h1>
            </div>
            <div className="flex items-center gap-2">
               <Link href="/history">
                <Button variant="ghost" size="icon" aria-label="History">
                  <History />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <section className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Navigate Life's Toughest Decisions</h2>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
            Input your dilemma, and let our AI-powered assistant provide you with structured analysis, simulate outcomes, and offer personalized guidance.
          </p>
        </section>

        <Card className="max-w-4xl mx-auto mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Lightbulb className="text-accent" />
              Describe Your Dilemma
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form action={handleSubmit} className="space-y-4">
              <Textarea
                name="dilemma"
                placeholder="e.g., 'Should I accept the new job offer in another city, or stay in my current role?'"
                className="min-h-[100px] text-base"
                required
                disabled={isPending}
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={isPending} className="w-full md:w-auto">
                  {isPending ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                    </>
                  ) : (
                    'Chart Your Course'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        {showSkeleton && <ResultsSkeleton />}

        {showResults && result.data && (
          <div className="max-w-6xl mx-auto space-y-8">
            <Card className="bg-card/50">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl font-bold">Your Dilemma</CardTitle>
                      <CardDescription className="text-lg text-foreground pt-2">{result.data.dilemma}</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </CardHeader>
              </Card>

            <div className="grid lg:grid-cols-2 gap-8 items-start">
              {result.data.prosCons && <ProsConsCard pros={result.data.prosCons.pros} cons={result.data.prosCons.cons} />}
              {result.data.recommendation && <RecommendationCard recommendation={result.data.recommendation.recommendation} reasoning={result.data.recommendation.reasoning} />}
            </div>

            {result.data.scenarios && <ScenarioCard scenarios={result.data.scenarios.scenarioSimulations} />}
            {result.data.ethicalCheck && <EthicalCheckCard biasDetected={result.data.ethicalCheck.biasDetected} explanation={result.data.ethicalCheck.explanation} />}
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
