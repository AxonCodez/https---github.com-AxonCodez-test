
"use client";

import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      hd: 'vitstudent.ac.in'
    });
    
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user.email && user.email.endsWith('@vitstudent.ac.in')) {
        toast({
          title: "Login Successful",
          description: `Welcome, ${user.displayName}!`,
        });
        router.push('/');
      } else {
        // This case should ideally not happen due to 'hd' parameter, but as a fallback.
        await auth.signOut();
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Please use a 'vitstudent.ac.in' email address to log in.",
        });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      let description = "An unexpected error occurred. Please try again.";
      if (error.code === 'auth/popup-closed-by-user') {
        description = "Login was cancelled. Please try again.";
      } else if (error.code === 'auth/cancelled-popup-request') {
        description = "Multiple login requests. Please complete one and try again.";
      }
      
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: description,
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">Student Login</CardTitle>
            <CardDescription>Login with your VIT student email</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button className="w-full" onClick={handleGoogleLogin}>
              <FcGoogle className="mr-2 h-5 w-5" />
              Sign in with Google
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Not a student?{' '}
              <Link href="/admin/login" className="underline hover:text-primary">
                Login as an Admin
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
