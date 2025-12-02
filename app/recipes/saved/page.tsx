"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import RecipeList from "@components/ui/RecipeList";
import { Recipe, UserPublic } from "@types";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

async function fetchMe(): Promise<UserPublic | null> {
  const token = localStorage.getItem("foodable_token");
  if (!token) return null;

  const res = await fetch("https://foodablebackend.onrender.com/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return null;
  return res.json();
}

export default function SavedRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [search, setSearch] = useState("");

  const { data: currentUser } = useQuery<UserPublic | null>({
    queryKey: ["me"],
    queryFn: fetchMe,
  });

  useEffect(() => {
    if (!currentUser) return;

    const userKey = `savedRecipes_${currentUser.id}`;
    const savedRecipes: Recipe[] = JSON.parse(localStorage.getItem(userKey) || "[]");
    setRecipes(savedRecipes);
  }, [currentUser]);

  if (!currentUser) {
    return <p className="p-6">Please log in to see your saved recipes.</p>;
  }

  // Filter saved recipes by search
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(search.toLowerCase()) ||
    recipe.ingredients?.some((ing) =>
      ing.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Saved Recipes</h1>

      {/* Search input */}
      <Card className="p-4 mb-4">
        <Input
          type="text"
          placeholder="Search saved recipes by name or ingredients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Card>

      {/* Empty state */}
      {filteredRecipes.length === 0 ? (
        <p className="p-6 text-gray-600">
          {search
            ? "No saved recipes match your search."
            : "You haven’t saved any recipes yet."}
        </p>
      ) : (
        <RecipeList recipes={filteredRecipes} />
      )}
    </div>
  );
}
