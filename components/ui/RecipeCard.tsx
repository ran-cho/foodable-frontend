"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Recipe } from "@types";

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const [saved, setSaved] = useState(false);

  // Check if the recipe is already saved
  useEffect(() => {
    const savedRecipes: Recipe[] = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
    setSaved(savedRecipes.some((r) => r.id === recipe.id));
  }, [recipe.id]);

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault(); 
    const savedRecipes: Recipe[] = JSON.parse(localStorage.getItem("savedRecipes") || "[]");

    if (saved) {
      const updated = savedRecipes.filter((r) => r.id !== recipe.id);
      localStorage.setItem("savedRecipes", JSON.stringify(updated));
      setSaved(false);
    } else {
      localStorage.setItem("savedRecipes", JSON.stringify([...savedRecipes, recipe]));
      setSaved(true);
    }
  };

  return (
    <Link href={`/recipes/${recipe.id}`} className="relative block">
      <div className="border rounded-lg p-4 hover:shadow-lg cursor-pointer transition">
        <h2 className="text-xl font-bold">{recipe.name}</h2>
        <p className="text-gray-600">{recipe.description}</p>
        <p className="text-sm mt-1">
          Prep: {recipe.prepTime} | Cook: {recipe.cookTime}
        </p>

        {/* Save button */}
        <button
          onClick={toggleSave}
          className={`absolute top-2 right-2 px-2 py-1 rounded text-sm ${
            saved ? "bg-green-500 text-white" : "bg-gray-200"
          }`}
        >
          {saved ? "Saved" : "Save"}
        </button>
      </div>
    </Link>
  );
}
