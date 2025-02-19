import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { app } from "@/firebase/clientApp";

const db = getFirestore(app);

export async function createUserDocument(user: any) {
  if (!user) return;

  const userRef = doc(db, "users", user.uid); // 🔥 Store user in "users" collection

  try {
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      // 🔥 Only create document if it doesn't exist
      const userData = {
        name: user.displayName || "User",
        email: user.email,
        createdAt: new Date(),
        level: 1, // Default level for new users
        xp: 0, // Default XP
      };

      await setDoc(userRef, userData);
      console.log("User document created successfully!");
    } else {
      console.log("User document already exists!");
    }
  } catch (error) {
    console.error("Error creating user document:", error);
  }
}
