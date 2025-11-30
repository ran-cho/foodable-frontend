"use client";

import { useState } from "react";
import Link from "next/link";
import RecipeList from "@/components/ui/RecipeList";
import { useRecipes } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import dynamic from "next/dynamic";

// Dynamically load client-only chat
const RecipeChat = dynamic(() => import("@/components/ui/RecipeChat"), { ssr: false });

export default function RecipesPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  // Fetch recipes from backend using React Query
  const { data: recipes = [], isLoading, error } = useRecipes();

  // Filter recipes based on search and category
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch =
      recipe.name.toLowerCase().includes(search.toLowerCase()) ||
      recipe.ingredients?.some((ing) =>
        ing.toLowerCase().includes(search.toLowerCase())
      );
    const matchesCategory =
      categoryFilter === "All" || recipe.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading recipes...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center p-8">
        <Card className="bg-red-50 border border-red-200 p-6 max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-red-800 mb-2">
            Error Loading Recipes
          </h2>
          <p className="text-red-600 mb-4">{(error as Error).message}</p>
          <p className="text-sm text-gray-600 mb-4">
            Make sure the backend is running at https://foodablebackend.onrender.com
          </p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Recipes header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Recipes</h1>
          <p className="text-gray-600 text-sm mt-1">
            {recipes.length} recipes available
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/recipes/saved">
            <Button variant="outline">Saved Recipes</Button>
          </Link>
          <Link href="/recipes/ai-assistant">
            <Button>🤖 AI Assistant</Button>
          </Link>
        </div>
      </div>

      {/* Search + Filter */}
      <Card className="p-4">
        <div className="flex gap-4">
          <Input
            type="text"
            placeholder="Search recipes by name, ingredients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border rounded-md px-4 py-2 bg-white min-w-[150px]"
          >
            <option value="All">All Categories</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
          </select>
        </div>
      </Card>

      {/* Results count */}
      {search || categoryFilter !== "All" ? (
        <div className="text-sm text-gray-600">
          Showing {filteredRecipes.length} of {recipes.length} recipes
        </div>
      ) : null}

      {/* Recipe List or Empty State */}
      {filteredRecipes.length === 0 ? (
        <Card className="p-12 text-center">
          <h3 className="text-xl font-semibold mb-2">No recipes found</h3>
          <p className="text-gray-600 mb-4">
            {search || categoryFilter !== "All"
              ? "Try adjusting your search or filters"
              : "No recipes available yet"}
          </p>
        </Card>
      ) : (
        <RecipeList recipes={filteredRecipes} />
      )}

      {/* Chat UI */}
      <RecipeChat />
    </div>
  );
}