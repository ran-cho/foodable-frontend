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

  // use your existing mutation hook
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

        const list = Array.isArray(res.suggestions) ? res.suggestions : [];

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
    }, 400); // debounce typing

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [query]);

  function handleUseIdea(s: AISuggestion) {
    // Take the first 3–5 ingredients from the AI recipe
    const ingredients = (s.ingredients ?? []).slice(0, 5);

    // If backend ever forgets ingredients, fall back to recipe name
    const itemsToAdd = ingredients.length > 0 ? ingredients : [s.name];

    itemsToAdd.forEach((ingredient) => {
      // useAddGrocery only *needs* name; others are optional
      addGrocery({
        name: ingredient,
      });
    });

    alert(`Added ${itemsToAdd.length} grocery items from "${s.name}" to your dashboard.`);
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
          placeholder="e.g. cheap high protein meal prep"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-describedby="ai-search-help"
        />
        <p id="ai-search-help" className="text-xs text-gray-500">
          Start typing (3+ characters) to get AI-powered meal ideas. Click “Use this idea” to add ingredients to your groceries.
        </p>
      </div>

      {loading && (
        <p className="text-sm text-gray-600 dark:text-gray-300">Thinking of suggestions…</p>
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
                Use this idea
              </Button>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
