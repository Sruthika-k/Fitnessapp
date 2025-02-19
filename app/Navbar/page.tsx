'use client';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "@/firebase/clientApp";
import { LayoutDashboard, User } from "lucide-react"; // Using the User icon for profile link

export default function Navbar() {
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

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign the user out
    } catch (error) {
      if (error instanceof Error) {
        console.error("Logout Error:", error.message);
      } else {
        console.error("Logout Error:", error);
      }
    }
  };

  return (
    <nav className="w-full min-w-full bg-background shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-2xl font-bold text-primary">
          FitQuest
        </Link>

        <div className="flex space-x-6 items-center">
          {user ? (
            // If the user is logged in, show "Profile" and "Log Out" buttons
            <>
              <Link href="/dashboard" className="flex items-center space-x-1 text-primary hover:text-primary/90 border 
              border-primary p-1 px-2 cursor-pointer rounded-md">
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link href="/profile" className="flex items-center space-x-1 text-primary hover:text-primary/90 border 
              border-primary p-1 px-2 cursor-pointer rounded-md">
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>
              <Button asChild onClick={handleLogout} className="bg-primary hover:bg-primary/90 text-white cursor-pointer">
                <span>Log Out</span>
              </Button>
            </>
          ) : (
            // If the user is not logged in, show "Sign In" and "Get Started" buttons
            <>
              <Button asChild variant="outline" className="text-primary border-primary hover:bg-primary/10">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild className="bg-primary hover:bg-primary/90 text-white">
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
