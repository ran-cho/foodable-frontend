"use client";

import { AISearchAutocomplete } from "@/components/ai/AISearchAutocomplete";
export default function AISearchPage() {
  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">AI Meal Finder</h1>
      <AISearchAutocomplete />
    </main>
  );
}
