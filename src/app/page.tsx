"use client";

import Link from 'next/link';
import { services } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3, Bell, BookUser, Home as HomeIcon, Plus, Search, User as UserIcon } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';

export default function Home() {
  const { user } = useAuth();
  const [activeTokens, setActiveTokens] = useState<{ serviceId: string; token: number }[]>([]);

  useEffect(() => {
    const tokens = services
      .map(service => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem(`userToken_${service.id}`);
          return token ? { serviceId: service.id, serviceName: service.name, token: Number(token) } : null;
        }
        return null;
      })
      .filter(Boolean) as { serviceId: string; serviceName: string; token: number }[];
    // For this demo, we'll just show the first active token. A real app might show more.
    setActiveTokens(tokens.slice(0, 1));
  }, [services]);

  const queueServices = services.filter(s => s.type === 'queue');

  return (
    <div className="flex flex-col min-h-screen bg-primary">
      <Header />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="text-background">
          <p className="text-lg font-light flex items-center gap-2">
            <span className="text-yellow-400">☀️</span> GOOD MORNING
          </p>
          <h1 className="text-3xl font-bold">{user?.displayName || 'Guest'}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <Card className="bg-primary/80 backdrop-blur-sm border-white/20 text-white">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white/80">FEATURED</p>
                <p className="font-medium mt-1">Meet your staff, proctor or HOD</p>
                 <Button variant="link" className="p-0 h-auto text-white/90 mt-2">Book an appointment</Button>
              </div>
              <BookUser className="w-16 h-16 text-white/30" />
            </CardContent>
          </Card>
          {activeTokens.map(tokenInfo => {
            const service = services.find(s => s.id === tokenInfo.serviceId);
            return (
               <Card key={tokenInfo.serviceId} className="bg-accent/80 backdrop-blur-sm border-pink-300/20 text-accent-foreground">
                <CardContent className="p-4">
                  <p className="text-xs font-semibold uppercase opacity-80">Active Tokens</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <service.icon className="w-5 h-5 opacity-70" />
                      <span className="font-semibold">{service?.name}</span>
                    </div>
                    <div className="bg-white/20 text-white rounded-full h-12 w-12 flex items-center justify-center font-bold text-lg">
                      #{tokenInfo.token}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card className="bg-card text-card-foreground rounded-t-3xl">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Live Queues</h2>
              <Link href="#" className="text-sm font-semibold text-primary">See all queues</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {queueServices.map(service => (
                <Link href={`/queue/${service.id}`} key={service.id}>
                  <Card className="bg-secondary hover:bg-muted transition-colors">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <BarChart3 className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{service.name}</p>
                          <p className="text-xs text-muted-foreground">In queue - 68 people</p>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

       <footer className="sticky bottom-0 bg-background/95 backdrop-blur-sm p-2 m-4 rounded-full shadow-lg border w-[calc(100%-2rem)] mx-auto">
        <div className="flex justify-around items-center">
          <Button variant="ghost" size="icon" className="flex-col h-16 w-16 gap-1 text-primary">
            <HomeIcon className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </Button>
          <Button variant="ghost" size="icon" className="flex-col h-16 w-16 gap-1 text-muted-foreground">
            <Search className="w-6 h-6" />
            <span className="text-xs">Search</span>
          </Button>
          <Button size="icon" className="h-16 w-16 rounded-full bg-primary text-primary-foreground shadow-lg -translate-y-6">
            <Plus className="w-8 h-8" />
          </Button>
          <Button variant="ghost" size="icon" className="flex-col h-16 w-16 gap-1 text-muted-foreground">
            <BarChart3 className="w-6 h-6" />
            <span className="text-xs">Queues</span>
          </Button>
           <Button variant="ghost" size="icon" className="flex-col h-16 w-16 gap-1 text-muted-foreground">
            <UserIcon className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </Button>
        </div>
      </footer>
    </div>
  );
}
