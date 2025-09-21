
"use client";

import { Bell, ChevronLeft, LogOut, Settings } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePathname, useRouter } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const getInitials = (email: string | null | undefined) => {
    if (!email) return '';
    const name = user?.displayName || email;
    const parts = name.split(' ');
    if (parts.length > 1) {
      return parts[0][0] + parts[1][0];
    }
    return name.substring(0, 2).toUpperCase();
  }

  const isTransparentBg = pathname === '/';
  const textColorClass = isTransparentBg ? 'text-background' : 'text-foreground';

  return (
    <header className={isTransparentBg ? 'bg-transparent' : 'bg-background'}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div>
          {pathname !== '/' && (
            <Button onClick={() => router.back()} variant="ghost" size="icon" className={`h-10 w-10 rounded-full ${textColorClass}`}>
              <ChevronLeft />
              <span className="sr-only">Back</span>
            </Button>
          )}
        </div>
        <nav className="flex items-center gap-2">
          {user ? (
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-white/50">
                    <AvatarImage src={user.photoURL ?? ''} alt={user.email ?? ''} />
                    <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login" className={cn(buttonVariants({ variant: "outline" }), isTransparentBg ? 'bg-white/20 border-white/50 text-white hover:bg-white/30' : '')}>
                Login
            </Link>
          )}
           <Button variant="ghost" size="icon" className={`h-10 w-10 rounded-full ${textColorClass}`}>
            <Bell />
          </Button>
        </nav>
      </div>
    </header>
  );
}
