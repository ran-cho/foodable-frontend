"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { GroceriesAPI, type Grocery } from "@/lib/api";

export default function TestPage() {
  const [groceries, setGroceries] = useState<Grocery[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await GroceriesAPI.list();
      setGroceries(data);
    } catch (e: any) {
      setError(e.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createDemo = async () => {
    setLoading(true);
    setError(null);
    try {
      await GroceriesAPI.create({
        name: "Banana",
        category: "Fruit",
        calories: 105,
        protein: 1.3,
      });
      await load();
    } catch (e: any) {
      setError(e.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <h1 className="text-3xl font-bold">API E2E Test</h1>
      <div className="flex gap-2">
        <Button onClick={load} disabled={loading}>Refresh</Button>
        <Button onClick={createDemo} disabled={loading}>Create “Banana”</Button>
      </div>
      {loading && <p>Loading…</p>}
      {error && <p className="text-red-600">Error: {error}</p>}
      <pre className="bg-zinc-100 p-4 rounded w-full max-w-2xl overflow-auto">
        {groceries ? JSON.stringify(groceries, null, 2) : "No data yet."}
      </pre>
    </div>
  );
}
