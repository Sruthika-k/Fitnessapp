"use client";
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
  const [totalXP, setTotalXP] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await fetchUserData(user.uid);
        await fetchUserXP(user.uid);
      } else {
        setUserData(null);
        setTotalXP(0);
        setLevel(1);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Fetch user profile data
  const fetchUserData = async (userId: string) => {
    try {
      const userRef = doc(db, "users", userId);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        console.error("No user data found!");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // ✅ Fetch total XP from Firestore & calculate level
  const fetchUserXP = async (userId: string) => {
    try {
      console.log("Fetching XP for user:", userId);
      const userWorkoutsRef = doc(db, "user_workouts", userId);
      const docSnap = await getDoc(userWorkoutsRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("Workout data:", data);

        const xp = data.xp || 0; // Get XP directly from Firestore
        setTotalXP(xp);
        setLevel(Math.floor(xp / 120) + 1); // 1 level per 120 XP
      } else {
        console.warn("No workout data found for user!");
        setTotalXP(0);
        setLevel(1);
      }
    } catch (error) {
      console.error("Error fetching XP:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  const xpToNextLevel = 120;
  const xpProgress = (totalXP % xpToNextLevel) / xpToNextLevel * 100;

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
              <p className="text-sm text-muted-foreground">Level {level}</p>
            </div>
          </Card>

          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-primary">
                <h3 className="font-semibold">Current XP</h3>
                <span>{totalXP % xpToNextLevel}/{xpToNextLevel} XP</span>
              </div>
              <Progress value={xpProgress} className="h-3 bg-accent" />
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
                    {totalXP}
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
