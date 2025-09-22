
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// NOTE: This is a mock authentication system for prototyping.
// It uses localStorage and is NOT secure for production use.

export type UserData = {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  gender?: string;
  registrationNumber?: string;
};

// Define the shape of our user object in storage
interface DemoUser extends UserData {
  password?: string; // Only for storage, not for client state
}

interface AuthContextType {
  user: UserData | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string, regNo: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<UserData>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isSuperAdmin: false,
  loading: true,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  updateUser: async () => false,
});

const SUPER_ADMIN_EMAIL = 'admin@example.com';
const APPOINTMENT_ADMIN_EMAILS = ['admin1@example.com'];
const ADMIN_EMAILS = [SUPER_ADMIN_EMAIL, ...APPOINTMENT_ADMIN_EMAILS];
const STUDENT_EMAIL_DOMAIN = '@vitstudent.ac.in';
const LOCAL_STORAGE_USERS_KEY = 'demo_users';
const LOCAL_STORAGE_SESSION_KEY = 'demo_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // On initial load, check for a user session in localStorage
  useEffect(() => {
    try {
      const sessionUserJson = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
      if (sessionUserJson) {
        setUser(JSON.parse(sessionUserJson));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Helper to get all users from localStorage
  const getUsers = (): DemoUser[] => {
    const usersJson = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    const existingUsers: DemoUser[] = usersJson ? JSON.parse(usersJson) : [];
    
    // Define the default admins
    const defaultAdmins: DemoUser[] = [
      { uid: 'admin-super', email: SUPER_ADMIN_EMAIL, displayName: 'Administrator', password: 'password' },
      { uid: 'admin-appoint-1', email: 'admin1@example.com', displayName: 'Appointment Admin 1', password: '1234' }
    ];

    // Create a map of existing users by email for quick lookup
    const existingUserMap = new Map(existingUsers.map(u => [u.email, u]));

    // Add default admins if they don't already exist
    defaultAdmins.forEach(admin => {
        if (!existingUserMap.has(admin.email)) {
            existingUsers.push(admin);
        }
    });

    // Save back to localStorage if we added any new admins
    if (usersJson !== JSON.stringify(existingUsers)) {
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(existingUsers));
    }
    
    return existingUsers;
  };

  // Helper to save users to localStorage
  const saveUsers = (users: DemoUser[]) => {
    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    const users = getUsers();
    const foundUser = users.find(u => u.email === email && u.password === pass);

    if (foundUser) {
      // Admins can log in, students must have the correct email domain
      if (!ADMIN_EMAILS.includes(email) && !email.endsWith(STUDENT_EMAIL_DOMAIN)) {
        return false;
      }
      const { password, ...userToSave } = foundUser;
      setUser(userToSave);
      localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(userToSave));
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, pass: string, regNo: string): Promise<boolean> => {
    // Enforce student email domain and prevent registering admin emails
    if (!email.endsWith(STUDENT_EMAIL_DOMAIN) || ADMIN_EMAILS.includes(email)) {
      return false;
    }
    
    const users = getUsers();
    if (users.some(u => u.email === email)) {
      return false; // User already exists
    }
    
    const newUser: DemoUser = {
      uid: `user-${Date.now()}`,
      email,
      displayName: name,
      password: pass,
      gender: '', // Initialize gender as empty
      registrationNumber: regNo,
    };

    saveUsers([...users, newUser]);
    
    // Automatically log in the new user
    const { password, ...userToSave } = newUser;
    setUser(userToSave);
    localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(userToSave));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
    router.push('/');
  };

  const updateUser = async (updates: Partial<UserData>): Promise<boolean> => {
    if (!user) return false;

    // Update state
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(updatedUser));

    // Update the user in the "database"
    const users = getUsers();
    const userIndex = users.findIndex(u => u.uid === user.uid);
    if (userIndex > -1) {
      const dbUser = users[userIndex];
      // Create a new object for the updated user, ensuring password is not overwritten if it exists
      const updatedDbUser = { ...dbUser, ...updates };
      users[userIndex] = updatedDbUser;
      saveUsers(users);
      return true;
    }
    return false;
  };

  const isAdmin = user ? ADMIN_EMAILS.includes(user.email || '') : false;
  const isSuperAdmin = user ? user.email === SUPER_ADMIN_EMAIL : false;

  const value = {
    user,
    isAdmin,
    isSuperAdmin,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
