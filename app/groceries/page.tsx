"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGroceries } from "@/hooks/useGroceries";
import { useAddGrocery } from "@/hooks/useAddGrocery";
import { useDeleteGrocery } from "@/hooks/useDeleteGrocery";
import { AddGroceryForm } from "@/components/groceries/AddGroceryForm";

export default function GroceriesPage() {
  const router = useRouter();
  const { data: items = [], isLoading, error } = useGroceries();
  const { mutate: deleteGrocery, isPending: deleting } = useDeleteGrocery();

  function onDelete(id: number | string) {
    if (confirm("Delete this grocery item?")) {
      deleteGrocery(id);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black p-8">
      <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-8 text-center">
        Groceries
      </h1>

      <AddGroceryForm />
      <div className="max-w-3xl mx-auto mb-10 text-center">
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
          Not sure what groceries to add?
        </p>

        <button
          onClick={() => router.push("/ai-search")}
          className="px-5 py-2 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition"
        >
          🤖 Ask AI to suggest meals & ingredients
        </button>
      </div>
      {/* Empty State */}
      {items.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-300">
          No groceries yet — add one above!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((g: any) => (
            <Card
              key={g.id}
              className="p-6 bg-white dark:bg-zinc-800 shadow-md rounded-lg transition"
            >
              <div
                className="cursor-pointer"
                onClick={() => router.push(`/groceries/${g.id}`)}
              >
                <h2 className="text-xl font-semibold mb-2 text-black dark:text-zinc-50">
                  {g.name}
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {g.category ?? "—"}

                  {g.calories != null && (
                    <> · {g.calories} kcal</>
                  )}

                  {g.protein != null && (
                    <> · {g.protein} g protein</>
                  )}
                </p>
              </div>

              <div className="mt-4 flex justify-end">
                <Button
                  variant="destructive"
                  disabled={deleting}
                  onClick={() => onDelete(g.id)}
                >
                  {deleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
