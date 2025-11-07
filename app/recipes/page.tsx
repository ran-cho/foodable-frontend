"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRecipes } from "@/hooks/useRecipes";

export default function RecipesPage() {
  const { data, isLoading, error } = useRecipes();

  if (isLoading) return <p className="text-gray-600 p-6">Loading recipes...</p>;
  if (error) return <p className="text-red-500 p-6">Failed to load recipes.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold text-green-700">Recipe List</h1>
      <div className="space-y-3">
        {data.map((item: any) => (
          <Card key={item.id} className="p-4 flex justify-between">
            <div>
              <p className="font-semibold">{item.title}</p>
              <p className="text-gray-600">{item.calories}</p>
            </div>
            <Button>View/Add</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
