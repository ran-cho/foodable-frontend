"use client";

import { useState } from "react";
import Link from "next/link";
import RecipeList from "@/components/ui/RecipeList";
import { useRecipes, useCreateRecipe } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function RecipesPage() {
  const [search, setSearch] = useState("");
  const [newRecipeName, setNewRecipeName] = useState("");
  const [newRecipeIngredients, setNewRecipeIngredients] = useState("");
  const [newRecipeInstructions, setNewRecipeInstructions] = useState("");

  const { data: recipes = [], isLoading, error, refetch } = useRecipes();
  const createRecipeMutation = useCreateRecipe();

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(search.toLowerCase()) ||
    recipe.ingredients?.some((ing) =>
      ing.toLowerCase().includes(search.toLowerCase())
    )
  );

  const handleCreateRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipeName.trim()) return;

    try {
      await createRecipeMutation.mutateAsync({
        name: newRecipeName,
        ingredients: newRecipeIngredients.split(",").map((i) => i.trim()),
        instructions: newRecipeInstructions,
      });
      setNewRecipeName("");
      setNewRecipeIngredients("");
      setNewRecipeInstructions("");
      refetch(); // Refresh the recipes list
    } catch (err) {
      console.error("Failed to create recipe:", err);
    }
  };

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

  if (error) {
    return (
      <div className="text-center p-8">
        <Card className="bg-red-50 border border-red-200 p-6 max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-red-800 mb-2">
            Error Loading Recipes
          </h2>
          <p className="text-red-600 mb-4">{(error as Error).message}</p>
          <p className="text-sm text-gray-600 mb-4">
            Make sure the backend is running
          </p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Recipes header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Recipes</h1>
          <p className="text-gray-600 text-sm mt-1">
            {recipes.length} recipes available
          </p>
        </div>

        {/* Buttons: Saved Recipes + AI Assistant */}
        <div className="flex gap-3 flex-wrap">
          <Link href="/recipes/saved">
            <Button variant="outline" className="px-4 py-2">
              Saved Recipes
            </Button>
          </Link>

          <Link href="/recipes/ai-assistant">
            <Button
              className="text-lg px-6 py-4 bg-green-600 hover:bg-green-700 text-white shadow-lg rounded-xl transition-transform transform hover:scale-105"
            >
              Need Suggestions?
            </Button>
          </Link>
        </div>
      </div>

      {/* Create Recipe Form */}
      <Card className="p-6 space-y-4">
        <h2 className="text-2xl font-bold">Create New Recipe</h2>
        <form onSubmit={handleCreateRecipe} className="space-y-3">
          <Input
            type="text"
            placeholder="Recipe Name"
            value={newRecipeName}
            onChange={(e) => setNewRecipeName(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Ingredients (comma-separated)"
            value={newRecipeIngredients}
            onChange={(e) => setNewRecipeIngredients(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Instructions"
            value={newRecipeInstructions}
            onChange={(e) => setNewRecipeInstructions(e.target.value)}
          />
          <Button
            type="submit"
            disabled={createRecipeMutation.isPending}
            className="w-full"
          >
            {createRecipeMutation.isPending ? "Creating..." : "Create Recipe"}
          </Button>
        </form>
      </Card>

      {/* Search */}
      <Card className="p-4">
        <Input
          type="text"
          placeholder="Search recipes by name or ingredients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Card>

      {search && (
        <div className="text-sm text-gray-600">
          Showing {filteredRecipes.length} of {recipes.length} recipes
        </div>
      )}

      {filteredRecipes.length === 0 ? (
        <Card className="p-12 text-center">
          <h3 className="text-xl font-semibold mb-2">No recipes found</h3>
          <p className="text-gray-600 mb-4">
            {search ? "Try adjusting your search" : "No recipes available yet"}
          </p>
        </Card>
      ) : (
        <RecipeList recipes={filteredRecipes} />
      )}
    </div>
  );
}
