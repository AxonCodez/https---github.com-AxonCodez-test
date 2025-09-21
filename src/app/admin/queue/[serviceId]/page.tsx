
"use client";

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import { services } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Ticket } from 'lucide-react';
import { Header } from '@/components/layout/Header';

export default function AdminQueuePage() {
  const params = useParams();
  const serviceId = params.serviceId as string;
  const service = services.find(s => s.id === serviceId);

  const [currentToken, setCurrentToken] = useState<number>(0);
  const [totalTokens, setTotalTokens] = useState<number>(0);

  useEffect(() => {
    const fetchInitialData = () => {
      const storedCurrent = localStorage.getItem(`currentToken_${serviceId}`);
      const storedTotal = localStorage.getItem(`totalTokens_${serviceId}`);
      setCurrentToken(storedCurrent ? Number(storedCurrent) : 0);
      setTotalTokens(storedTotal ? Number(storedTotal) : (storedCurrent ? Number(storedCurrent) : 0));
    };
    fetchInitialData();
    
    // Listen for storage changes from other tabs (the user page)
    const handleStorageChange = () => fetchInitialData();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [serviceId]);

  const handleServeNext = () => {
    if (currentToken < totalTokens) {
      const nextToken = currentToken + 1;
      setCurrentToken(nextToken);
      localStorage.setItem(`currentToken_${serviceId}`, String(nextToken));
    }
  };

  if (!service) {
    notFound();
  }

  const upcomingTokens = Array.from({ length: Math.min(5, totalTokens - currentToken) }, (_, i) => currentToken + i + 1);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8 flex items-center justify-center">
        <Card className="w-full max-w-lg shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">Manage Queue</CardTitle>
            <CardDescription>{service.name}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <div className="text-center p-6 border rounded-lg w-full bg-muted">
              <p className="text-lg font-medium text-muted-foreground">Currently Serving</p>
              <p className="text-8xl font-extrabold text-primary my-2">#{currentToken}</p>
            </div>
            
            <Button onClick={handleServeNext} size="lg" className="w-full h-16 text-xl" disabled={currentToken >= totalTokens}>
              Serve Next Token <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
            
            <div className="w-full pt-4 border-t">
              <h3 className="text-center font-semibold mb-3">Upcoming Tokens</h3>
              {upcomingTokens.length > 0 ? (
                <div className="flex justify-center gap-2 flex-wrap">
                  {upcomingTokens.map(token => (
                    <div key={token} className="flex items-center gap-2 p-2 px-3 border rounded-full bg-background">
                      <Ticket className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono font-semibold">#{token}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">Queue is empty.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
