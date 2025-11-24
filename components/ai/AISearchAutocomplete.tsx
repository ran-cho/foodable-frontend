"use client";

import { useEffect, useState } from "react";
import { AiAPI, type AISuggestion } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = {
  label?: string;
};

export function AISearchAutocomplete({ label = "Search meals" }: Props) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dietaryRestrictions: string[] = [];

  console.log("useEffect fired with query:", query);

  useEffect(() => {
  if (query.trim().length < 3) {
    setSuggestions([]);
    setError(null);
    return;
  }

  const controller = new AbortController();

  const timeout = setTimeout(async () => {
    console.log(">>> FETCHING:", `${process.env.NEXT_PUBLIC_API_URL}/ai/suggest`);

    try {
      setLoading(true);
      setError(null);

      const data = await AiAPI.suggest({
        query: query.trim(),
        dietary_restrictions: dietaryRestrictions,
        max_results: 3,
      });

      console.log(">>> RECEIVED AI DATA:", data);
      setSuggestions(data.suggestions ?? []);
    } catch (err: any) {
      if (err.name === "AbortError") return;
      console.error("AI suggest error", err);
      setError("Could not fetch AI suggestions right now.");
    } finally {
      setLoading(false);
    }
  }, 400);

  return () => {
    clearTimeout(timeout);
    controller.abort();
  };
}, [query]);

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
          Start typing to get AI meal suggestions
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
                onClick={() => {
                  console.log("Selected AI suggestion", s);
                  alert(`Selected: ${s.name}`);
                }}
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
