"use client";
import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
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
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);

        const userRef = doc(db, "user", user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          console.log("User Data:", docSnap.data());
          setUserData(docSnap.data());
        } else {
          console.error("No user document found!");
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Function to update the user's name
  const handleUpdateName = async () => {
    if (!newName.trim() || !user) return;

    try {
      const userRef = doc(db, "user", user.uid);
      await updateDoc(userRef, { fullName: newName });
      setUserData((prev: any) => ({ ...prev, fullName: newName }));
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
        <h2 className="text-2xl font-semibold mt-4">{userData?.fullName || "User"}</h2>
        <p className="text-muted-foreground">{user?.email || "No email found"}</p>

        <div className="mt-4 p-4 border rounded-lg bg-accent">
          <h3 className="text-lg font-semibold">Total XP</h3>
          <p className="text-xl font-bold text-primary">{userData?.totalXP || 0}</p>
        </div>

        {/* Edit Profile Button */}
        {!isEditing ? (
          <Button
            className="mt-4 flex items-center gap-2 bg-primary hover:bg-primary/90"
            onClick={() => {
              setIsEditing(true);
              setNewName(userData?.fullName || "");
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
