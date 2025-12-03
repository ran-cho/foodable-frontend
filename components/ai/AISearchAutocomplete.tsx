"use client";

import { useEffect, useState } from "react";
import { AiAPI, type AISuggestion } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAddGrocery } from "@/hooks/useAddGrocery";

type Props = {
  label?: string;
};

export function AISearchAutocomplete({ label = "Search meals" }: Props) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { mutate: addGrocery } = useAddGrocery();

  useEffect(() => {
    if (query.trim().length < 3) {
      setSuggestions([]);
      setError(null);
      return;
    }

    let cancelled = false;

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await AiAPI.suggest({
          query: query.trim(),
          dietary_restrictions: [],
          max_results: 3,
        });

        const list = res.suggestions ?? [];

        if (!cancelled) {
          setSuggestions(list);
        }
      } catch (err: any) {
        if (!cancelled) {
          console.error("AI suggest error", err);
          setError("Could not fetch AI suggestions right now.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }, 400); 

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [query]);

  // Function to clean ingredient names on dashboard by removing quantities and descriptors
  function cleanIngredientName(text: string) {
  return text
    .replace(/^\s*\d+([\/.]\d+)?\s*[a-zA-Z]*\s*/g, "")
    .replace(/\(.*?\)/g, "")
    .trim();
}


  function handleUseIdea(s: AISuggestion) {
  const firstFive = s.ingredients.slice(0, 5);

  firstFive.forEach((ing) => {
    const cleaned = cleanIngredientName(ing);

    addGrocery({
      name: cleaned,
      category: "AI Suggested",
      calories: undefined,
      protein: undefined,
    });
  });

  alert(`Added ${firstFive.length} ingredients from ${s.name}`);
}



  return (
    <section className="max-w-3xl mx-auto mb-10 space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="ai-search-input"
          className="block text-sm font-medium text-gray-800 dark:text-gray-100"
        >
          {label}
        </label>
        <Input
          id="ai-search-input"
          placeholder="e.g. high protein meal prep with salmon"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-describedby="ai-search-help"
        />
        <p id="ai-search-help" className="text-xs text-gray-500">
          Start typing to get AI-powered meal ideas!
        </p>
      </div>

      {loading && (
        <p className="text-sm text-gray-600 dark:text-gray-300">Loading meal suggestions…</p>
      )}

      {error && (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}

      {suggestions.length > 0 && (
        <div
          className="grid gap-4 md:grid-cols-3"
          aria-label="AI meal suggestions"
          role="list"
        >
          {suggestions.map((s, idx) => (
            <Card
              key={`${s.name}-${idx}`}
              className="p-4 flex flex-col justify-between space-y-2"
              role="listitem"
            >
              <div>
                <h3 className="text-sm font-semibold text-green-700">{s.name}</h3>
                <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-3">
                  {s.description}
                </p>
                {s.calories != null || s.protein != null ? (
                  <p className="mt-1 text-xs text-gray-500">
                    {s.calories != null && `${s.calories} kcal`}{" "}
                    {s.protein != null && `· ${s.protein} g protein`}
                  </p>
                ) : null}
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => handleUseIdea(s)}
              >
                Add Groceries
              </Button>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
