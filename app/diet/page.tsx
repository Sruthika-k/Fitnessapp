"use client";

import { useState, useEffect } from "react";
import { app } from "@/firebase/clientApp";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Navbar from "../Navbar/page";

interface Meal {
  type: string;
  items: string[];
}

const db = getFirestore(app);
const auth = getAuth(app);

interface DietPlan {
  id: string;
  name: string;
  description: string;
  calories: number;
  image: string;
  meals: Meal[];
}

export default function DietPlansPage() {
  const [diets, setDiets] = useState<DietPlan[]>([]);
  const [selectedDiet, setSelectedDiet] = useState<DietPlan | null>(null);

  useEffect(() => {
    const fetchDiets = async () => {
      const querySnapshot = await getDocs(collection(db, "diets"));
      const dietPlans = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as DietPlan[];
      setDiets(dietPlans);
    };

    fetchDiets();
  }, []);

  return (
    <>
    <Navbar />
    <div className="p-6">
      {selectedDiet ? (
        // Diet Details View
        <div className="bg-white p-6 rounded-lg shadow-md">
          <button
            onClick={() => setSelectedDiet(null)}
            className="mb-4 text-green-600 underline"
          >
            ← Back to Diets
          </button>
          {/* <img
            src={selectedDiet.image}
            alt={selectedDiet.name}
            className="w-full h-60 object-cover rounded-lg"
          /> */}
          <h2 className="text-2xl font-bold mt-4">{selectedDiet.name}</h2>
          <p className="text-gray-600">{selectedDiet.description}</p>
          <p className="mt-2 font-semibold">Calories: {selectedDiet.calories}</p>

          <h3 className="mt-4 text-xl font-semibold">Meals</h3>
          <ul className="mt-2">
            {selectedDiet.meals.map((meal, index) => (
              <li key={index} className="mt-2">
                <p className="font-semibold">{meal.type}</p>
                <p className="text-gray-600">{meal.items.join(", ")}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        // Diet List View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {diets.map((diet) => (
            <div
              key={diet.id}
              onClick={() => setSelectedDiet(diet)}
              className="cursor-pointer bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
            >
              {/* <img
                src={diet.image}
                alt={diet.name}
                className="w-full h-40 object-cover rounded-lg"
              /> */}
              <h2 className="text-lg font-bold mt-2">{diet.name}</h2>
              <p className="text-gray-600 text-sm">
                {diet.description.substring(0, 50)}...
              </p>
              <p className="mt-1 text-sm font-semibold">
                Calories: {diet.calories}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
}
