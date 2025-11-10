"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddGroceryForm } from "@/components/groceries/AddGroceryForm";
import { GroceriesAPI, type Grocery, type GroceryCreate } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();

  const [items, setItems] = useState<Grocery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  async function loadGroceries() {
    try {
      const data = await GroceriesAPI.list();
      setItems(data);
    } catch (err: any) {
      setError(err.message ?? "Failed to load groceries");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGroceries();
  }, []);

  async function handleAdd(item: GroceryCreate) {
    await GroceriesAPI.create(item);
    await loadGroceries();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this grocery item?")) return;

    setDeleteId(id);
    await GroceriesAPI.delete(id);
    setItems(items.filter((i) => i.id !== id));
    setDeleteId(null);
  }

  if (loading) return <div className="p-8 text-center">Loading groceries...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Dashboard</h1>

      <AddGroceryForm onAdd={handleAdd} />

      {items.length === 0 ? (
        <div className="text-center text-gray-600">No groceries yet — add one above!</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((g) => (
            <Card key={g.id} className="p-6 shadow-md rounded-lg">
              <div onClick={() => router.push(`/groceries/${g.id}`)} className="cursor-pointer mb-3">
                <h2 className="text-xl font-bold">{g.name}</h2>
                <p>{g.category ?? "—"} · {g.calories ?? "?"} kcal · {g.protein ?? "?"} g protein</p>
              </div>

              <Button
                variant="destructive"
                disabled={deleteId === g.id}
                onClick={() => handleDelete(g.id)}
              >
                {deleteId === g.id ? "Deleting..." : "Delete"}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
