'use client';

import { useProducts } from "@/hooks/useProducts";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DemoPage() {
  const { data, isLoading, error } = useProducts();
  const [inputValue, setInputValue] = useState("");

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white p-10">
      <div className="max-w-4xl mx-auto space-y-10">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            React Query Practice
          </h2>
          {isLoading && <p>Loading product data...</p>}
          {error && <p className="text-red-500">Error loading products.</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data?.slice(0, 4).map((product: any) => (
              <Card key={product.id} className="p-6 space-y-3">
                <h3 className="text-lg font-bold text-green-700">
                  {product.title}
                </h3>
                <p className="text-gray-700">{product.category}</p>
                <Button variant="outline">Add</Button>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
