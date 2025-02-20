"use client"; // Mark the file as a Client Component

import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import { app } from "@/firebase/clientApp";

const db = getFirestore(app);

const addDietPlansToFirestore = async () => {
  try {
    const dietPlans = [
      {
        id: "keto",
        name: "Keto Diet",
        description: "Low-carb, high-fat diet for weight loss.",
        calories: 1800,
        image: "https://example.com/keto.jpg",
        meals: [
          { meal: "Breakfast", items: ["Eggs", "Avocado", "Cheese"] },
          { meal: "Lunch", items: ["Grilled Chicken", "Spinach", "Olive Oil"] },
          { meal: "Dinner", items: ["Salmon", "Broccoli", "Butter"] },
        ],
      },
      {
        id: "vegan",
        name: "Vegan Diet",
        description: "Plant-based diet with no animal products.",
        calories: 2000,
        image: "https://example.com/vegan.jpg",
        meals: [
          { meal: "Breakfast", items: ["Oatmeal", "Banana", "Almond Milk"] },
          { meal: "Lunch", items: ["Quinoa", "Tofu", "Vegetables"] },
          { meal: "Dinner", items: ["Lentils", "Sweet Potato", "Kale"] },
        ],
      },
      {
        id: "paleo",
        name: "Paleo Diet",
        description: "Focuses on whole foods like lean meats, fish, fruits, and nuts.",
        calories: 2200,
        image: "https://example.com/paleo.jpg",
        meals: [
          { meal: "Breakfast", items: ["Scrambled Eggs", "Avocado", "Berries"] },
          { meal: "Lunch", items: ["Grilled Steak", "Sweet Potato", "Broccoli"] },
          { meal: "Dinner", items: ["Baked Salmon", "Asparagus", "Olive Oil"] },
        ],
      },
      {
        id: "mediterranean",
        name: "Mediterranean Diet",
        description: "Rich in vegetables, fruits, olive oil, and lean proteins.",
        calories: 2100,
        image: "https://example.com/mediterranean.jpg",
        meals: [
          { meal: "Breakfast", items: ["Greek Yogurt", "Honey", "Nuts"] },
          { meal: "Lunch", items: ["Grilled Fish", "Quinoa", "Spinach"] },
          { meal: "Dinner", items: ["Chicken", "Hummus", "Vegetable Salad"] },
        ],
      },
      {
        id: "high_protein",
        name: "High-Protein Diet",
        description: "Ideal for muscle building and recovery.",
        calories: 2500,
        image: "https://example.com/high_protein.jpg",
        meals: [
          { meal: "Breakfast", items: ["Omelette", "Greek Yogurt", "Berries"] },
          { meal: "Lunch", items: ["Chicken Breast", "Brown Rice", "Broccoli"] },
          { meal: "Dinner", items: ["Grilled Salmon", "Quinoa", "Steamed Vegetables"] },
        ],
      },
    ];

    for (const plan of dietPlans) {
      await setDoc(doc(collection(db, "diets"), plan.id), plan);
    }
    alert("Diet plans added successfully!");
  } catch (error) {
    console.error("Error adding diet plans:", error);
    alert("Failed to add diet plans.");
  }
};

export default function AddDietsPage() {
  return (
    <div className="p-6">
      <button
        onClick={addDietPlansToFirestore}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Add Diet Plans
      </button>
    </div>
  );
}
