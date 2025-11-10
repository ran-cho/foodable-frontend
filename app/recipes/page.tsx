"use client";

import { useState } from "react";
import Link from "next/link";
import RecipeList from "@components/ui/RecipeList";
import { Recipe } from "@types";

export default function RecipesPage() {
  const sampleRecipes: Recipe[] = [
    {
      id: 1,
      name: "Spaghetti Bolognese",
      description: "Classic Italian pasta",
      prepTime: "15 mins",
      cookTime: "1 hr",
      ingredients: ["spaghetti", "ground beef", "tomato sauce"],
      category: "Dinner",
    },
    {
      id: 2,
      name: "Banana Pancakes",
      description: "Fluffy pancakes",
      prepTime: "10 mins",
      cookTime: "15 mins",
      ingredients: ["banana", "flour", "milk"],
      category: "Breakfast",
    },
  ];

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  const filteredRecipes = sampleRecipes.filter((recipe) => {
    const matchesSearch =
      recipe.name.toLowerCase().includes(search.toLowerCase()) ||
      recipe.ingredients?.some((ing) =>
        ing.toLowerCase().includes(search.toLowerCase())
      );

    const matchesCategory =
      categoryFilter === "All" || recipe.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Recipes</h1>
        <Link
          href="/recipes/saved"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Saved Recipes
        </Link>
      </div>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded flex-1"
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="All">All</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
        </select>
      </div>

      <RecipeList recipes={filteredRecipes} />
    </div>
  );
}
