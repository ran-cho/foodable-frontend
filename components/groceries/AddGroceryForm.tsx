"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAddGrocery } from "@/hooks/useAddGrocery";

export function AddGroceryForm() {
  const { mutate: addGrocery, isPending } = useAddGrocery();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    addGrocery({
      name: name.trim(),
      category: category.trim() || undefined,
      calories: calories ? Number(calories) : undefined,
      protein: protein ? Number(protein) : undefined,
    });

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
      <Input placeholder="Protein" inputMode="numeric" value={protein} onChange={(e) => setProtein(e.target.value.replace(/[^\d]/g, ""))} />
      <Button type="submit" disabled={isPending}>
        {isPending ? "Adding..." : "Add"}
      </Button>
    </form>
  );
}
