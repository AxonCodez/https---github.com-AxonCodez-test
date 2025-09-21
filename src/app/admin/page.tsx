import { services } from '@/lib/data';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { ArrowRight } from 'lucide-react';

export default function AdminPage() {
  const queueServices = services.filter(s => s.type === 'queue');
  const appointmentServices = services.filter(s => s.type === 'appointment');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 font-headline">Admin Portal</h1>
        <p className="text-muted-foreground mb-8">Manage campus services efficiently.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Manage Queues</CardTitle>
              <CardDescription>Advance the serving token for queued services.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col gap-3">
              {queueServices.map(service => (
                <Link key={service.id} href={`/admin/queue/${service.id}`} className="block p-4 rounded-lg border bg-background hover:bg-muted hover:border-primary/50 transition-all">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{service.name}</h3>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>View Appointments</CardTitle>
              <CardDescription>See the schedule of appointments for the day.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col gap-3">
              {appointmentServices.map(service => (
                <Link key={service.id} href={`/admin/appointments/${service.id}`} className="block p-4 rounded-lg border bg-background hover:bg-muted hover:border-primary/50 transition-all">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{service.name}</h3>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
