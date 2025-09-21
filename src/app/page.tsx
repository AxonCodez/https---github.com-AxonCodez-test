import Link from 'next/link';
import Image from 'next/image';
import { services } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import placeholderData from '@/lib/placeholder-images.json';

export default function Home() {
  const heroImage = placeholderData.placeholderImages.find(img => img.id === 'hero-image');
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <section className="w-full pt-12 md:pt-24 lg:pt-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary font-headline">
                    VIT Q-Less: Queue less to stress less
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Your one-stop solution for managing queues and appointments across campus services at VIT. Reclaim your time and focus on what matters.
                  </p>
                </div>
              </div>
              {heroImage && (
                <Image
                  alt="VIT Campus"
                  className="mx-auto aspect-square overflow-hidden rounded-xl object-cover"
                  height="550"
                  src={heroImage.imageUrl}
                  width="550"
                  data-ai-hint={heroImage.imageHint}
                  priority
                />
              )}
            </div>
          </div>
        </section>

        <section id="services" className="container mx-auto px-4 md:px-6 py-12 md:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground font-headline">
              Campus Services
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
              Select a service to join a queue or book an appointment.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="flex flex-col hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                <CardHeader className="flex-row items-start gap-4 space-y-0 pb-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg font-headline">{service.name}</CardTitle>
                    <Badge variant={service.status === 'Open' ? 'success' : 'destructive'} className="mt-2">
                      {service.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription>{service.description}</CardDescription>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full" disabled={service.status === 'Closed'}>
                    <Link href={service.type === 'queue' ? `/queue/${service.id}` : `/appointment/${service.id}`}>
                      Proceed <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <footer className="py-6 border-t">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
            © {currentYear} VIT Q-Less. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
