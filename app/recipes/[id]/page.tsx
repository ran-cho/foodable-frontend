"use client";

import { use, useState, useEffect } from "react";
import { useRecipe } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const recipeId = parseInt(id);
  
  const [isSaved, setIsSaved] = useState(false);

  const { data: recipe, isLoading, error } = useRecipe(recipeId);

  // Check if recipe is saved on mount
  useEffect(() => {
    const savedRecipes = JSON.parse(localStorage.getItem("savedRecipeIds") || "[]");
    setIsSaved(savedRecipes.includes(recipeId));
  }, [recipeId]);

  const handleSave = () => {
    const savedRecipeIds = JSON.parse(localStorage.getItem("savedRecipeIds") || "[]");
    const savedRecipes = JSON.parse(localStorage.getItem("savedRecipes") || "[]");
    
    if (isSaved) {
      // Remove from saved
      const updatedIds = savedRecipeIds.filter((id: number) => id !== recipeId);
      const updatedRecipes = savedRecipes.filter((r: any) => r.id !== recipeId);
      
      localStorage.setItem("savedRecipeIds", JSON.stringify(updatedIds));
      localStorage.setItem("savedRecipes", JSON.stringify(updatedRecipes));
      setIsSaved(false);
    } else {
      // Add to saved
      if (recipe) {
        savedRecipeIds.push(recipeId);
        savedRecipes.push(recipe);
        
        localStorage.setItem("savedRecipeIds", JSON.stringify(savedRecipeIds));
        localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
        setIsSaved(true);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="text-center p-8">
        <Card className="bg-red-50 border border-red-200 p-6 max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Recipe Not Found</h2>
          <p className="text-red-600 mb-4">
            {error ? (error as Error).message : "This recipe doesn't exist"}
          </p>
          <Button onClick={() => router.push("/recipes")}>
            Back to Recipes
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Back Button */}
      <Button variant="outline" onClick={() => router.back()}>
        ← Back
      </Button>

      {/* Recipe Header */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          {recipe.category && (
            <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
              {recipe.category}
            </span>
          )}
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{recipe.name}</h1>
      </div>

      {/* Save Button */}
      <Card className="p-6">
        <Button 
          className="w-full" 
          size="lg"
          onClick={handleSave}
          variant={isSaved ? "outline" : "default"}
        >
          {isSaved ? "Saved" : "Save Recipe"}
        </Button>
      </Card>

      {/* Ingredients */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
        {recipe.ingredients && recipe.ingredients.length > 0 ? (
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-green-600 mt-1">✓</span>
                <span className="text-gray-700">{ingredient}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No ingredients listed</p>
        )}
        <div className="mt-6">
          <Button variant="outline" className="w-full">
            Add to Grocery List
          </Button>
        </div>
      </Card>

      {/* Instructions */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Instructions</h2>
        {recipe.instructions ? (
          <p className="text-gray-700 whitespace-pre-line">{recipe.instructions}</p>
        ) : (
          <p className="text-gray-600">No instructions provided yet.</p>
        )}
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button variant="outline" className="flex-1">
          Share Recipe
        </Button>
        <Button variant="outline" className="flex-1">
          Edit Recipe
        </Button>
      </div>
    </div>
  );
}