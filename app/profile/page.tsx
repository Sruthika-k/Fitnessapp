"use client";

import { useState, useEffect } from "react";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/firebase/clientApp";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, User, Edit } from "lucide-react";
import Navbar from "../Navbar/page";

const db = getFirestore(app);
const auth = getAuth(app);

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [userXP, setUserXP] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await fetchUserData(user.uid);
        await fetchUserXP(user.uid);
      } else {
        setUser(null);
        setUserData(null);
        setUserXP(0);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Fetch user profile data (name, email) from Firestore (`users` collection)
  const fetchUserData = async (userId: string) => {
    try {
      const userRef = doc(db, "users", userId);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        console.warn("No user document found!");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // ✅ Fetch only XP from `user_workouts` collection
  const fetchUserXP = async (userId: string) => {
    try {
      const userWorkoutsRef = doc(db, "user_workouts", userId);
      const docSnap = await getDoc(userWorkoutsRef);

      if (docSnap.exists()) {
        setUserXP(docSnap.data().xp || 0);
      } else {
        console.warn("No workout XP data found!");
        setUserXP(0);
      }
    } catch (error) {
      console.error("Error fetching XP:", error);
    }
  };

  // ✅ Update the user's name in Firestore
  const handleUpdateName = async () => {
    if (!newName.trim() || !user) return;

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { name: newName });

      setUserData((prev: any) => ({ ...prev, name: newName })); // Update UI
      setIsEditing(false);
      console.log("User name updated successfully!");
    } catch (error) {
      console.error("Error updating user name:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-primary" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex items-start justify-center min-h-screen mt-20 bg-gradient-to-t from-green-100 to-background">
        <Card className="max-w-md w-full p-6 text-center shadow-lg rounded-2xl">
          <User className="mx-auto text-primary w-16 h-16" />
          <h2 className="text-2xl font-semibold mt-4">{userData?.name || "User"}</h2>
          <p className="text-muted-foreground">{user?.email || "No email found"}</p>

          {/* XP Display (Fetched Separately) */}
          <div className="mt-4 p-4 border rounded-lg bg-accent">
            <h3 className="text-lg font-semibold">Total XP</h3>
            <p className="text-xl font-bold text-primary">{userXP}</p>
          </div>

          {/* Edit Profile Button */}
          {!isEditing ? (
            <Button
              className="mt-4 flex items-center gap-2 bg-primary hover:bg-primary/90"
              onClick={() => {
                setIsEditing(true);
                setNewName(userData?.name || "");
              }}
            >
              <Edit size={16} /> Edit Profile
            </Button>
          ) : (
            <div className="mt-4 space-y-2">
              <Input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full"
              />
              <div className="flex gap-2 justify-center">
                <Button className="bg-green-500 hover:bg-green-600" onClick={handleUpdateName}>
                  Save
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
