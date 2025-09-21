import { QrCode } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" aria-label="VIT Q-Less Home">
          <QrCode className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold text-foreground font-headline">VIT Q-Less</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Button asChild variant="outline">
            <Link href="/admin">
              Admin Portal
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
