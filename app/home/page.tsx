'use client';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Navbar from "../Navbar/page";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/firebase/clientApp"; // Import Firebase app

export default function Home() {
  const [user, setUser] = useState<any>(null); // Store user information

  // Initialize Firebase Auth
  const auth = getAuth(app);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Set the user if logged in, or null if logged out
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, [auth]);

  return (
    <div className="justify-center items-center mx-auto min-h-screen bg-gradient-to-t from-green-100 to-background">
      <Navbar />
      <main className="container flex flex-col items-center justify-center min-h-screen py-12 space-y-8">
        
        {/* Conditional Section (Moved to the top) */}
        {user ? (
          // If the user is logged in, show a welcome message
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-semibold text-primary">Welcome back, {user.displayName || user.email}!</h2>
            <p className="text-lg text-muted-foreground">You're all set to continue your fitness journey.</p>
          </div>
        ) : (
          // If the user is not logged in, show "Get Started" section
          <Card className="w-full max-w-md p-6 space-y-4 border-accent/20 shadow-lg">
            <div className="space-y-4 text-center">
              <h2 className="text-2xl font-semibold text-secondary">Get Started</h2>
              <p className="text-sm text-muted-foreground">Choose how you want to begin your fitness journey</p>
            </div>
            <div className="space-y-3">
              <Button asChild className="w-full bg-primary hover:bg-primary/90">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild variant="outline" className="w-full border-primary/20 hover:bg-accent">
                <Link href="/register">Create Account</Link>
              </Button>
            </div>
          </Card>
        )}

        {/* Features Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter text-primary sm:text-5xl md:text-6xl">
            Welcome to FitQuest
          </h1>
          <p className="text-muted-foreground max-w-[600px] mx-auto text-lg">
            Start your fitness journey with a gamified experience. Track workouts, earn XP, and achieve your goals with
            your personal fitness mascot.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl text-center">
          <div className="p-6 border border-accent/30 rounded-lg shadow-md">
            <CheckCircle className="mx-auto text-primary w-8 h-8" />
            <h3 className="text-lg font-semibold mt-3">Gamified Progress</h3>
            <p className="text-sm text-muted-foreground">Earn XP and level up as you complete workouts.</p>
          </div>
          <div className="p-6 border border-accent/30 rounded-lg shadow-md">
            <CheckCircle className="mx-auto text-primary w-8 h-8" />
            <h3 className="text-lg font-semibold mt-3">Personalized Workouts</h3>
            <p className="text-sm text-muted-foreground">Get custom workout plans based on your goals.</p>
          </div>
          <div className="p-6 border border-accent/30 rounded-lg shadow-md">
            <CheckCircle className="mx-auto text-primary w-8 h-8" />
            <h3 className="text-lg font-semibold mt-3">Fitness Mascot</h3>
            <p className="text-sm text-muted-foreground">Stay motivated with your own virtual fitness companion.</p>
          </div>
        </div>

      </main>
    </div>
  );
}
