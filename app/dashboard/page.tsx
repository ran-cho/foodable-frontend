"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GroceriesAPI, type Grocery } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [items, setItems] = useState<Grocery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    GroceriesAPI.list()
      .then(setItems)
      .catch((e) => setError(e.message ?? "Error fetching groceries"))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <div className="p-8 text-center">Loading groceries...</div>;
  if (error)
    return <div className="p-8 text-center text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black p-8">
      <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-8 text-center">
        Dashboard
      </h1>

      {items.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-300">
          No groceries found. Try adding one on the test page!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((g) => (
            <Card
              key={g.id}
              className="p-6 bg-white dark:bg-zinc-800 shadow-md rounded-lg cursor-pointer hover:shadow-lg transition"
              onClick={() =>
                router.push(`/groceries/${g.id}`)
              }
            >
              <h2 className="text-xl font-semibold mb-2 text-black dark:text-zinc-50">
                {g.name}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                {g.category ?? "—"} · {g.calories ?? "?"} kcal ·{" "}
                {g.protein ?? "?"} g protein
              </p>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-10">
        <Button onClick={() => router.push("/groceries/new")}>
          Add New Grocery
        </Button>
      </div>
    </div>
  );
}
