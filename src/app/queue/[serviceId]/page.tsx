
"use client";

import { useState, useEffect, useRef } from 'react';
import { notFound, useParams } from 'next/navigation';
import { services } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ticket, Users, Timer, LogOut } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';

export default function QueuePage() {
  const params = useParams();
  const serviceId = params.serviceId as string;
  const { user, loading: authLoading } = useAuth();
  
  const [service, setService] = useState(services.find(s => s.id === serviceId));
  const [currentToken, setCurrentToken] = useState<number | null>(null);
  const [userToken, setUserToken] = useState<number | null>(null);
  const [totalTokens, setTotalTokens] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const notificationSentRef = useRef(false);

  useEffect(() => {
    if (!serviceId || authLoading) return;

    setService(services.find(s => s.id === serviceId));

    if (user) {
      const storedUserToken = localStorage.getItem(`userToken_${serviceId}_${user.uid}`);
      if (storedUserToken) {
        setUserToken(Number(storedUserToken));
        notificationSentRef.current = false; // Reset notification status on token change
      }
    } else {
      // If user logs out, clear their token
      setUserToken(null);
    }

    const getStatus = () => {
      const current = localStorage.getItem(`currentToken_${serviceId}`);
      const total = localStorage.getItem(`totalTokens_${serviceId}`);
      setCurrentToken(current ? Number(current) : 0);
      setTotalTokens(total ? Number(total) : (current ? Number(current) : 0));
      setIsLoading(false);
    };

    getStatus();
    const interval = setInterval(getStatus, 3000); // Poll for updates

    window.addEventListener('storage', getStatus); // Listen for changes from other tabs

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', getStatus);
    };
  }, [serviceId, user, authLoading]);

  const isMyTurn = userToken !== null && currentToken !== null && userToken <= currentToken;

  useEffect(() => {
    if (isMyTurn && !notificationSentRef.current) {
      const permission = localStorage.getItem('notification_permission');
      if (permission === 'granted' && service) {
        new Notification("It's your turn!", {
          body: `Your token #${userToken} for ${service.name} is now being served.`,
          icon: '/favicon.ico', // Optional: add an icon
        });
        notificationSentRef.current = true; // Mark notification as sent
      }
    }
  }, [isMyTurn, userToken, service]);


  const handleGetToken = () => {
    if (totalTokens === null || !user) return;
    const newUserToken = totalTokens + 1;
    setUserToken(newUserToken);
    setTotalTokens(newUserToken);
    localStorage.setItem(`userToken_${serviceId}_${user.uid}`, String(newUserToken));
    localStorage.setItem(`totalTokens_${serviceId}`, String(newUserToken));
    notificationSentRef.current = false; // Reset when getting a new token
  };
  
  const handleLeaveQueue = () => {
    if (userToken === null || !user) return;

    if (totalTokens !== null && userToken === totalTokens) {
      const newTotal = totalTokens - 1;
      setTotalTokens(newTotal);
      localStorage.setItem(`totalTokens_${serviceId}`, String(newTotal));
    }

    setUserToken(null);
    localStorage.removeItem(`userToken_${serviceId}_${user.uid}`);
  };

  if (!isLoading && !service) {
    notFound();
  }

  const peopleAhead = userToken && currentToken !== null ? userToken - currentToken - 1 : 0;
  const estimatedWaitTime = peopleAhead > 0 ? peopleAhead * 2 : 0; // Assuming 2 mins per person

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            {service ? (
              <>
                <CardTitle className="text-2xl font-headline">{service.name}</CardTitle>
                <CardDescription>Digital Queue System</CardDescription>
              </>
            ) : (
              <>
                <Skeleton className="h-8 w-48 mx-auto" />
                <Skeleton className="h-4 w-32 mx-auto mt-2" />
              </>
            )}
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <div className="grid grid-cols-2 gap-4 w-full text-center">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Now Serving</p>
                {isLoading ? <Skeleton className="h-10 w-20 mx-auto mt-1" /> : <p className="text-4xl font-bold text-primary">{`#${currentToken ?? 0}`}</p>}
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Total in Queue</p>
                 {isLoading ? <Skeleton className="h-10 w-20 mx-auto mt-1" /> : <p className="text-4xl font-bold">{totalTokens ?? (currentToken ?? 0)}</p>}
              </div>
            </div>

            {userToken ? (
              <div className="text-center p-6 border rounded-lg w-full bg-primary/5 flex flex-col items-center gap-4">
                <div>
                  <p className="text-lg font-medium text-primary">Your Token</p>
                  <p className="text-6xl font-extrabold text-primary my-2">#{userToken}</p>
                </div>
                {isMyTurn ? (
                  <p className="text-success font-semibold text-lg animate-pulse">It's your turn!</p>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{peopleAhead} {peopleAhead === 1 ? 'person' : 'people'} ahead of you</span>
                    </div>
                    {peopleAhead > 0 && (
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Timer className="h-4 w-4" />
                        <span>Estimated wait: ~{estimatedWaitTime} minutes</span>
                      </div>
                    )}
                  </div>
                )}
                <Button onClick={handleLeaveQueue} variant="outline" className="w-full mt-2">
                  <LogOut className="mr-2 h-4 w-4" />
                  Leave Queue
                </Button>
              </div>
            ) : (
              <Button onClick={handleGetToken} size="lg" className="w-full" disabled={isLoading || authLoading || !user || service?.status === 'Closed'}>
                <Ticket className="mr-2 h-5 w-5" /> {user ? 'Get a Token' : 'Login to Get Token'}
              </Button>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
