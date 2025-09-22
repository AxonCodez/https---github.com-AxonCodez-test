
"use client";

import { useState, useEffect } from 'react';
import { getServices, serviceIcons, Service } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import Link from 'next/link';
import { ArrowRight, UserCheck, CalendarDays, Clock, Home as HomeIcon, Search, Calendar, BarChart3, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

type UserAppointment = {
  serviceId: string;
  serviceName: string;
  time: string;
};

export default function AppointmentsPage() {
  const { user } = useAuth();
  const [myAppointments, setMyAppointments] = useState<UserAppointment[]>([]);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    if (!user) return;

    const getAllAppointments = () => {
      const userAppointments: UserAppointment[] = [];
      const allServices = getServices();
      
      // Iterate over all possible localStorage keys
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('appointments_')) {
          const serviceId = key.replace('appointments_', '');
          const service = allServices.find(s => s.id === serviceId);
          if (service) {
            const bookings: {time: string, studentId: string}[] = JSON.parse(localStorage.getItem(key) || '[]');
            const userBookings = bookings.filter(b => b.studentId === (user.registrationNumber || user.displayName || user.uid));
            
            userBookings.forEach(booking => {
              userAppointments.push({
                serviceId: service.id,
                serviceName: service.name,
                time: booking.time,
              });
            });
          }
        }
      });

      // Sort appointments by time
      userAppointments.sort((a, b) => {
        const aTime = new Date(`1/1/2000 ${a.time}`);
        const bTime = new Date(`1/1/2000 ${b.time}`);
        return aTime.getTime() - bTime.getTime();
      });

      setMyAppointments(userAppointments);
    };

    getAllAppointments();

    // Listen for changes in case a new appointment is booked in another tab
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key?.startsWith('appointments_')) {
        getAllAppointments();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 font-headline">My Appointments</h1>
        <p className="text-muted-foreground mb-8">All your scheduled appointments for today.</p>

        {isClient && myAppointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myAppointments.map((apt, index) => {
              return (
              <Card key={index} className="flex flex-col">
                <CardHeader>
                   <CardTitle>{apt.serviceName}</CardTitle>
                   <CardDescription>Your appointment is scheduled.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-center items-center gap-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Clock className="h-6 w-6" />
                    <p className="text-3xl font-bold">{apt.time}</p>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5"><CalendarDays className="h-4 w-4"/> Today</p>
                </CardContent>
              </Card>
            )})}
          </div>
        ) : (
          <div className="text-center py-20 px-4 border-2 border-dashed rounded-lg">
            <UserCheck className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">You Have No Appointments</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Book an appointment from the search page to see it here.
            </p>
            <Link href="/search" passHref>
                <Button className="mt-6">
                    <ArrowRight className="mr-2 h-4 w-4" /> Go to Search
                </Button>
            </Link>
          </div>
        )}
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
          <Link href="/appointments">
            <Button variant="ghost" size="icon" className="flex-col h-16 w-16 gap-1 text-primary">
              <Calendar className="w-6 h-6" />
               <span className="text-xs">Appointments</span>
            </Button>
          </Link>
          <Link href="/queues">
            <Button variant="ghost" size="icon" className="flex-col h-16 w-16 gap-1 text-muted-foreground">
              <BarChart3 className="w-6 h-6" />
              <span className="text-xs">Queues</span>
            </Button>
          </Link>
          <Link href="/profile">
           <Button variant="ghost" size="icon" className="flex-col h-16 w-16 gap-1 text-muted-foreground">
            <UserIcon className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </Button>
          </Link>
        </div>
      </footer>
    </div>
  );
}
