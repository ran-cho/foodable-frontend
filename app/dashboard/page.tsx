"use client";

import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  // Example recipes
  const recipes = [
    { title: "Example 1", description: "Easy breakfast recipe." },
    { title: "Example 2", description: "Classic dish." },
    { title: "Example 3", description: "Healthy option." },
    { title: "Example 4", description: "Indulgent dessert." },
  ];

  // Make cards clickable to navigate to recipe detail pages
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black p-8">
      <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-8 text-center">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {recipes.map((recipe, index) => (
          <Card
            key={index}
            className="p-6 bg-white dark:bg-zinc-800 shadow-md rounded-lg cursor-pointer hover:shadow-lg transition"
            onClick={() =>
              router.push(`/recipes/${recipe.title.replace(/\s+/g, "-").toLowerCase()}`)
            }
          >
            <h2 className="text-xl font-semibold mb-2 text-black dark:text-zinc-50">
              {recipe.title}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">{recipe.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
