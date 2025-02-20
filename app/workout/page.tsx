"use client";

import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, doc, setDoc, updateDoc, increment } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/firebase/clientApp";
import Navbar from "../Navbar/page";

const db = getFirestore(app);
const auth = getAuth(app);

type Workout = {
  id: string;
  name: string;
  category: string;
  reps: number;
  sets: number;
  xpReward: number;
};

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [user, setUser] = useState<any>(null);
  const [timer, setTimer] = useState(5);
  const [isTiming, setIsTiming] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user ? user : null);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const querySnapshot = await getDocs(collection(db, "workouts"));
      const workoutsData: Workout[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Workout[];
      setWorkouts(workoutsData);
    };

    fetchWorkouts();
  }, []);

  const startTimer = () => {
    setIsTiming(true);
    let countdown = 5;
    const interval = setInterval(() => {
      countdown--;
      setTimer(countdown);

      if (countdown === 0) {
        clearInterval(interval);
        completeExercise();
        setIsTiming(false);
        setTimer(5);
      }
    }, 1000);
  };

  const completeExercise = async () => {
    if (!user || !selectedWorkout) return;

    const userWorkoutRef = doc(db, "user_workouts", user.uid);

    try {
      await setDoc(
        userWorkoutRef,
        {
          exercises: {
            [selectedWorkout.id]: {
              name: selectedWorkout.name,
              category: selectedWorkout.category,
              reps: selectedWorkout.reps,
              sets: selectedWorkout.sets,
              completedAt: new Date(),
            },
          },
          xp: increment(selectedWorkout.xpReward),
        },
        { merge: true }
      );

      alert(`🎉 You earned ${selectedWorkout.xpReward} XP!`);
      setSelectedWorkout(null);
    } catch (error) {
      console.error("Error updating user workout:", error);
    }
  };

  return (
    <>
    <div className="min-h-screen bg-green-50 text-green-900 p-6">
      <Navbar />
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-center mb-6">💪 Choose a Workout</h1>

        {!user ? (
          <p className="text-center text-green-700">Please log in to track your workouts.</p>
        ) : selectedWorkout ? (
          <div className="bg-white p-6 rounded-lg shadow-lg border border-green-300">
            <h2 className="text-2xl font-bold text-green-700">{selectedWorkout.name}</h2>
            <p className="text-green-700 mt-2">Category: <span className="font-semibold">{selectedWorkout.category}</span></p>
            <p className="text-green-700">Reps: <span className="font-semibold">{selectedWorkout.reps}</span></p>
            <p className="text-green-700">Sets: <span className="font-semibold">{selectedWorkout.sets}</span></p>
            <p className="text-green-600 font-semibold mt-4">XP Reward: {selectedWorkout.xpReward} XP</p>

            {isTiming ? (
              <p className="mt-4 text-xl font-bold text-red-500">⏳ {timer}s remaining...</p>
            ) : (
              <button
                onClick={startTimer}
                className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold transition-all"
              >
                ✅ Start Exercise
              </button>
            )}

            <button
              onClick={() => setSelectedWorkout(null)}
              className="mt-4 w-full bg-gray-300 hover:bg-gray-400 text-green-900 py-2 rounded-lg font-semibold transition-all"
            >
              🔙 Back to List
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {workouts.map((workout) => (
              <div
                key={workout.id}
                className="bg-white p-4 rounded-lg shadow-lg border border-green-300 cursor-pointer transition transform hover:scale-105 hover:shadow-xl"
                onClick={() => setSelectedWorkout(workout)}
              >
                <h2 className="text-xl font-bold text-green-800">{workout.name}</h2>
                <p className="text-green-600">Category: {workout.category}</p>
                <p className="text-green-500 font-semibold">XP: {workout.xpReward}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
