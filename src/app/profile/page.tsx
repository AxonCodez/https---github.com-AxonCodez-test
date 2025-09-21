
"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, ChevronRight, Home as HomeIcon, LogOut, Plus, Search, User as UserIcon } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const getInitials = (email: string | null | undefined) => {
    if (!email) return '';
    const name = user?.displayName || email;
    const parts = name.split(' ');
    if (parts.length > 1) {
      return parts[0][0] + parts[1][0];
    }
    return name.substring(0, 2).toUpperCase();
  }

  if (loading || !user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="h-20 w-20 border-4 border-primary/50">
            <AvatarImage src={user.photoURL ?? ''} alt={user.email ?? ''} />
            <AvatarFallback className="text-2xl">{getInitials(user.email)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold font-headline">{user.displayName}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your profile and settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
               <Button variant="outline" className="justify-between">
                <span>Edit Profile</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Button>
               <Button variant="outline" className="justify-between">
                <span>Notifications</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Button>
               <Button variant="outline" className="justify-between">
                <span>Privacy</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Button onClick={logout} variant="destructive" className="w-full mt-8">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
        </Button>

      </main>
       <footer className="sticky bottom-0 bg-background/95 backdrop-blur-sm p-2 m-4 rounded-full shadow-lg border w-[calc(100%-2rem)] mx-auto">
        <div className="flex justify-around items-center">
          <Link href="/">
            <Button variant="ghost" size="icon" className="flex-col h-16 w-16 gap-1 text-muted-foreground">
              <HomeIcon className="w-6 h-6" />
              <span className="text-xs">Home</span>
            </Button>
          </Link>
          <Link href="/search">
            <Button variant="ghost" size="icon" className="flex-col h-16 w-16 gap-1 text-muted-foreground">
              <Search className="w-6 h-6" />
              <span className="text-xs">Search</span>
            </Button>
          </Link>
          <Button size="icon" className="h-16 w-16 rounded-full bg-primary text-primary-foreground shadow-lg -translate-y-6">
            <Plus className="w-8 h-8" />
          </Button>
          <Link href="/queues">
            <Button variant="ghost" size="icon" className="flex-col h-16 w-16 gap-1 text-muted-foreground">
              <BarChart3 className="w-6 h-6" />
              <span className="text-xs">Queues</span>
            </Button>
          </Link>
          <Link href="/profile">
           <Button variant="ghost" size="icon" className="flex-col h-16 w-16 gap-1 text-primary">
            <UserIcon className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </Button>
          </Link>
        </div>
      </footer>
    </div>
  );
}
