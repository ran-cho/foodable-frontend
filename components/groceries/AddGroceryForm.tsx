"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { GroceryCreate } from "@/lib/api";

export function AddGroceryForm({ onAdd }: { onAdd: (g: GroceryCreate) => Promise<void> }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    await onAdd({
      name: name.trim(),
      category: category.trim() || null,
      calories: calories ? Number(calories) : null,
      protein: protein ? Number(protein) : null,
    });
    setLoading(false);

    setName("");
    setCategory("");
    setCalories("");
    setProtein("");
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-5 gap-3 max-w-3xl mx-auto mb-8">
      <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
      <Input placeholder="Calories" inputMode="numeric" value={calories} onChange={(e) => setCalories(e.target.value.replace(/[^\d]/g, ""))} />
      <Input placeholder="Protein (g)" inputMode="numeric" value={protein} onChange={(e) => setProtein(e.target.value.replace(/[^\d]/g, ""))} />
      <Button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add"}
      </Button>
    </form>
  );
}
