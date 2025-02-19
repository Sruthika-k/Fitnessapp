"use client";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "@/firebase/clientApp";

const db = getFirestore(app);

const workouts = [
  { name: "Push-Ups", category: "Strength", reps: 15, sets: 3, difficulty: "Beginner", xpReward: 20 },
  { name: "Squats", category: "Legs", reps: 20, sets: 3, difficulty: "Intermediate", xpReward: 25 },
  { name: "Jumping Jacks", category: "Cardio", reps: 30, sets: 3, difficulty: "Easy", xpReward: 15 },
  { name: "Lunges", category: "Legs", reps: 12, sets: 3, difficulty: "Intermediate", xpReward: 25 },
  { name: "Burpees", category: "Full Body", reps: 10, sets: 3, difficulty: "Advanced", xpReward: 30 },
  { name: "Plank", category: "Core", reps: 1, sets: 3, difficulty: "Intermediate", xpReward: 25, duration: "30s" },
  { name: "Mountain Climbers", category: "Cardio", reps: 40, sets: 3, difficulty: "Intermediate", xpReward: 20 },
  { name: "Bicycle Crunches", category: "Core", reps: 20, sets: 3, difficulty: "Intermediate", xpReward: 20 },
  { name: "Jump Squats", category: "Legs", reps: 15, sets: 3, difficulty: "Intermediate", xpReward: 25 },
  { name: "High Knees", category: "Cardio", reps: 30, sets: 3, difficulty: "Easy", xpReward: 15 },
  { name: "Russian Twists", category: "Core", reps: 25, sets: 3, difficulty: "Intermediate", xpReward: 20 },
  { name: "Dips", category: "Upper Body", reps: 10, sets: 3, difficulty: "Intermediate", xpReward: 25 },
  { name: "Wall Sit", category: "Legs", reps: 1, sets: 3, difficulty: "Intermediate", xpReward: 20, duration: "40s" },
  { name: "Superman Hold", category: "Back", reps: 1, sets: 3, difficulty: "Intermediate", xpReward: 20, duration: "30s" },
  { name: "Side Lunges", category: "Legs", reps: 12, sets: 3, difficulty: "Intermediate", xpReward: 25 },
  { name: "Jump Rope", category: "Cardio", reps: 1, sets: 3, difficulty: "Easy", xpReward: 20, duration: "1 min" },
  { name: "Deadlifts (Bodyweight)", category: "Back", reps: 15, sets: 3, difficulty: "Intermediate", xpReward: 25 },
  { name: "Calf Raises", category: "Legs", reps: 20, sets: 3, difficulty: "Easy", xpReward: 15 },
  { name: "Toe Touches", category: "Core", reps: 20, sets: 3, difficulty: "Easy", xpReward: 15 },
  { name: "Glute Bridges", category: "Legs", reps: 15, sets: 3, difficulty: "Beginner", xpReward: 20 },
  { name: "Shoulder Taps", category: "Core", reps: 20, sets: 3, difficulty: "Beginner", xpReward: 20 },
  { name: "Reverse Crunches", category: "Core", reps: 15, sets: 3, difficulty: "Intermediate", xpReward: 20 },
  { name: "Box Jumps", category: "Legs", reps: 10, sets: 3, difficulty: "Advanced", xpReward: 30 },
  { name: "Hamstring Curls (Bodyweight)", category: "Legs", reps: 12, sets: 3, difficulty: "Intermediate", xpReward: 25 },
];

const addWorkouts = async () => {
  try {
    const workoutsRef = collection(db, "workouts");
    await Promise.all(workouts.map(workout => addDoc(workoutsRef, workout)));
    console.log("All workouts added successfully!");
  } catch (error) {
    console.error("Error adding workouts:", error);
  }
};


export default function AddWorkouts() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={addWorkouts}
      >
        Add Workouts to Firestore
      </button>
    </div>
  );
}
