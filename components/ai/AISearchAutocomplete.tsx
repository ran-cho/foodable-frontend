"use client";

import { useEffect, useState } from "react";
import { AiAPI, type AISuggestion } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AISearchAutocomplete() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);

        const result = await AiAPI.suggest(
          {
            query: query.trim(),
            dietary_restrictions: [],
            max_results: 3,
          },
          controller.signal
        );

        // backend returns { original_query, suggestions: [] }
        setSuggestions(result.suggestions ?? []);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error(err);
          setError("AI suggestions unavailable.");
        }
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <Input
        placeholder="Search for meals (e.g. high protein prep)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading && <p>Thinking of suggestions…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {suggestions.length > 0 && (
        <div className="grid md:grid-cols-3 gap-4">
          {suggestions.map((s, i) => (
            <Card key={i} className="p-4 space-y-2">
              <h3 className="font-bold">{s.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-3">{s.description}</p>
              <Button size="sm" variant="outline">
                Use this idea
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
