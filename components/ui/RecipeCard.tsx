"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Recipe } from "@types";

interface User {
  id: number;
  name: string | null;
  email: string;
}

async function fetchMe(): Promise<User | null> {
  const token = localStorage.getItem("foodable_token");
  if (!token) return null;

  const res = await fetch("https://foodablebackend.onrender.com/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return null;
  return res.json();
}

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const { data: currentUser } = useQuery<User | null>({
    queryKey: ["me"],
    queryFn: fetchMe,
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    const userKey = `savedRecipes_${currentUser.id}`;
    const savedRecipes: Recipe[] = JSON.parse(localStorage.getItem(userKey) || "[]");
    setSaved(savedRecipes.some((r) => r.id === recipe.id));
  }, [currentUser, recipe.id]);

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const userKey = `savedRecipes_${currentUser.id}`;
    const savedRecipes: Recipe[] = JSON.parse(localStorage.getItem(userKey) || "[]");

    if (saved) {
      const updated = savedRecipes.filter((r) => r.id !== recipe.id);
      localStorage.setItem(userKey, JSON.stringify(updated));
      setSaved(false);
    } else {
      localStorage.setItem(userKey, JSON.stringify([...savedRecipes, recipe]));
      setSaved(true);
    }
  };

  return (
    <Link href={`/recipes/${recipe.id}`} className="relative block">
      <div className="border rounded-lg p-4 hover:shadow-lg cursor-pointer transition">
        <h2 className="text-xl font-bold">{recipe.name}</h2>

        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <p className="text-gray-600 text-sm mt-1">
            Ingredients: {recipe.ingredients.join(", ")}
          </p>
        )}

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
