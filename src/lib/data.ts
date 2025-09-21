import { Utensils, Dumbbell, BookUser, Users, Building, Ticket } from 'lucide-react';
import type { Icon as LucideIcon } from 'lucide-react';

export type Service = {
  id: string;
  name: string;
  type: 'queue' | 'appointment';
  status: 'Open' | 'Closed';
  icon: LucideIcon;
  description: string;
};

export const services: Service[] = [
  { id: 'mens-mess-1', name: 'Men\'s Mess 1', type: 'queue', status: 'Open', icon: Utensils, description: 'Join the queue for the main men\'s mess.' },
  { id: 'womens-mess-1', name: 'Women\'s Mess 1', type: 'queue', status: 'Open', icon: Utensils, description: 'Queue up for the main women\'s mess.' },
  { id: 'main-gym', name: 'Main Gym', type: 'queue', status: 'Closed', icon: Dumbbell, description: 'Check gym occupancy and join the waitlist.' },
  { id: 'hod-cse', name: 'HOD - CSE Dept.', type: 'appointment', status: 'Open', icon: BookUser, description: 'Book an appointment with the Head of Department.' },
  { id: 'proctor-jane', name: 'Proctor - Jane Doe', type: 'appointment', status: 'Open', icon: Users, description: 'Schedule a meeting with your proctor.' },
  { id: 'admin-office', name: 'Admin Office', type: 'appointment', status: 'Closed', icon: Building, description: 'Book a slot for administrative services.' },
  { id: 'out-pass-gate-1', name: 'Out-Pass Gate 1', type: 'queue', status: 'Open', icon: Ticket, description: 'Join the queue for out-pass verification.'}
];

export const staff = [
  { id: 'hod-cse', name: 'Dr. John Smith', title: 'HOD - CSE Dept.' },
  { id: 'proctor-jane', name: 'Jane Doe', title: 'Proctor' },
  { id: 'admin-office', name: 'Admin Office', title: 'Administrative Services' },
];

export const timeSlots = [
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM"
];

// Mock data for pre-booked appointments
export const appointments: Record<string, {time: string, student: string}[]> = {
  'hod-cse': [
    { time: '10:30 AM', student: 'Student ID 12345' },
    { time: '02:00 PM', student: 'Student ID 67890' },
  ],
  'proctor-jane': [
    { time: '11:00 AM', student: 'Student ID 54321' },
  ],
  'admin-office': []
};
