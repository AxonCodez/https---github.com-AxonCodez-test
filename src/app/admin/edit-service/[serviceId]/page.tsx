
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams, notFound } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getServices, updateService, serviceIcons, Service } from '@/lib/data';
import type { Icon as LucideIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.serviceId as string;
  const { user, isAdmin, isSuperAdmin, loading: authLoading } = useAuth();

  const [service, setService] = useState<Service | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'queue' | 'appointment' | ''>('');
  const [iconName, setIconName] = useState<keyof typeof serviceIcons | ''>('');
  const [gender, setGender] = useState<'male' | 'female' | 'all'>('all');
  const [assignedAdmin, setAssignedAdmin] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    if (authLoading) return;

    const existingService = getServices().find(s => s.id === serviceId);
    if (existingService) {
        // Authorization check
        if (!isSuperAdmin && existingService.assignedAdmin !== user?.email) {
            router.push('/admin/login');
            return;
        }

      setService(existingService);
      setName(existingService.name);
      setDescription(existingService.description);
      setType(existingService.type);
      setIconName(existingService.iconName);
      setGender(existingService.gender || 'all');
      setAssignedAdmin(existingService.assignedAdmin || '');
    } else {
      notFound();
    }
  }, [serviceId, authLoading, isSuperAdmin, user, router]);

  if (!service) {
    return <div>Loading...</div>; // Or a proper loading state
  }
  
  const iconEntries = Object.entries(serviceIcons);

  const handleUpdateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !type || !iconName) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill out all fields.",
      });
      return;
    }
    
    setLoading(true);

    const updatedServiceData: Service = {
      ...service,
      id: service.id, // ID cannot be changed
      name,
      description,
      type,
      iconName,
      gender: type === 'queue' ? gender : 'all',
      assignedAdmin: type === 'appointment' ? assignedAdmin : undefined,
      status: service.status, 
    };
    
    updateService(updatedServiceData);
    
    toast({
      title: "Service Updated",
      description: `Successfully updated the "${name}" service.`,
    });

    // Trigger a storage event to notify other tabs
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'demo_services',
        newValue: 'updated',
    }));

    router.push('/admin');
  };

  const readOnlyForAppointmentAdmin = !isSuperAdmin;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Edit Service</CardTitle>
            <CardDescription>Update the details for "{service.name}".</CardDescription>
          </CardHeader>
          <CardContent>
            {readOnlyForAppointmentAdmin && (
                 <Alert className="mb-4">
                    <Info className="h-4 w-4" />
                    <AlertDescription>As an appointment admin, you can only edit the service description.</AlertDescription>
                </Alert>
            )}
            <form onSubmit={handleUpdateService} className="flex flex-col gap-4">
              
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="name">Service Name</Label>
                <Input 
                  id="name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                  disabled={readOnlyForAppointmentAdmin}
                />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="type">Service Type</Label>
                  <Select value={type} onValueChange={(v) => setType(v as any)} required disabled={readOnlyForAppointmentAdmin}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="queue">Queue</SelectItem>
                      <SelectItem value="appointment">Appointment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="icon">Icon</Label>
                    <Select value={iconName} onValueChange={(v) => setIconName(v as any)} required disabled={readOnlyForAppointmentAdmin}>
                    <SelectTrigger id="icon">
                        <SelectValue placeholder="Select an icon" />
                    </SelectTrigger>
                    <SelectContent>
                        {iconEntries.map(([name, IconComponent]) => (
                        <SelectItem key={name} value={name}>
                            <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4" />
                            <span>{name}</span>
                            </div>
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </div>
              </div>
              
              {type === 'queue' && (
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="gender">Gender Specific (for Queues)</Label>
                  <Select value={gender} onValueChange={(v) => setGender(v as any)} required disabled={readOnlyForAppointmentAdmin}>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Genders</SelectItem>
                      <SelectItem value="male">Male Only</SelectItem>
                      <SelectItem value="female">Female Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {type === 'appointment' && (
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="assignedAdmin">Assigned Admin Email</Label>
                    <Input 
                    id="assignedAdmin" 
                    value={assignedAdmin}
                    onChange={(e) => setAssignedAdmin(e.target.value)}
                    required 
                    disabled={readOnlyForAppointmentAdmin}
                    />
                </div>
              )}

              <Button className="w-full mt-4" type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>

            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
