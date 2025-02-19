import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/firebase/clientApp"; // Import Firebase App

const db = getFirestore(app);
const auth = getAuth(app);

async function createUserDocument(user: any) {
  if (!user) return;

  const userRef = doc(db, "user", user.uid); // Use UID as document ID
  
  
  const userData = {
    name: user.displayName || "User",
    email: user.email,
    createdAt: new Date(),
  };

  try {
    await setDoc(userRef, userData, { merge: true }); // Prevent overwriting existing fields
    console.log("User document created successfully!");
  } catch (error) {
    console.error("Error creating user document:", error);
  }
}

// Automatically create a user document when they log in
onAuthStateChanged(auth, (user) => {
  if (user) {
    createUserDocument(user);
  }
});
