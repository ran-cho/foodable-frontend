"use client";

import { useState, useEffect } from "react";
import RecipeList from "@components/ui/RecipeList";
import { Recipe } from "@types";

export default function SavedRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const savedRecipes: Recipe[] = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
    setRecipes(savedRecipes);
  }, []);

  if (recipes.length === 0) {
    return <p className="p-6">You haven’t saved any recipes yet.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Saved Recipes</h1>
      <RecipeList recipes={recipes} />
    </div>
  );
}
