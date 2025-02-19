'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "@/firebase/clientApp";
import { Progress } from "../../components/ui/progress";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; 
import Navbar from "../Navbar/page";

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

export default function Dashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.error("No user data found!");
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent via-background to-background">
      <Navbar />
      <div className="container py-8 space-y-8">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <Card className="w-full md:w-64 p-6 text-center space-y-4 border-accent/20 shadow-lg">
            <div className="relative w-32 h-32 mx-auto">
              {/* Add user fitness mascot image here */}
            </div>
            <div>
              <h2 className="font-semibold text-primary">
                {userData?.fullName || "Your Fitness Buddy"}
              </h2>
              <p className="text-sm text-muted-foreground">Level 1</p>
            </div>
          </Card>

          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-primary">
                <h3 className="font-semibold">Current XP</h3>
                <span>50/100 XP</span>
              </div>
              <Progress value={60} className="h-3 bg-accent" />
            </div>
                
            <div className="flex gap-4">
              <Card className="p-4 flex-1 border-accent/20 shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">3</div>
                  <div className="text-sm text-muted-foreground">Day Streak</div>
                </div>
              </Card>
              <Card className="p-4 flex-1 border-accent/20 shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">
                    {userData?.totalXP || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Total XP</div>
                </div>
              </Card>
            </div>

            {/* Buttons Section */}
            <div className="flex gap-4 mt-4">
              <Button 
                className="w-full bg-primary hover:bg-primary/90" 
                onClick={() => router.push("/workout")}
              >
                Start Workout
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-primary/20 hover:bg-accent" 
                onClick={() => router.push("/diet")}
              >
                View Diet Info
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
