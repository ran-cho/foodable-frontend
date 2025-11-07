"use client";

import { useGroceries } from "@/hooks/useGroceries";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function GroceriesPage() {
  const { data, isLoading, error } = useGroceries();

  if (isLoading) return <p className="text-gray-600 p-6">Loading groceries...</p>;
  if (error) return <p className="text-red-500 p-6">Failed to load groceries.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold text-green-700">Grocery List</h1>
      <div className="space-y-3">
        {data.map((item: any) => (
          <Card key={item.id} className="p-4 flex justify-between">
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-gray-600">{item.price}</p>
            </div>
            <Button>Add</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
