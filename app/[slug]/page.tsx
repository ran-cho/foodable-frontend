"use client";

import { useParams } from "next/navigation";

 // Recipe detail page component
export default function RecipeDetailPage() {
  const params = useParams();
  const { slug } = params;

  return (
    <div className="min-h-screen p-8 bg-zinc-50 dark:bg-black text-black dark:text-zinc-50">
      <h1 className="text-4xl font-bold mb-4">Recipe: {slug}</h1>
      <p className="text-lg">
        Here’s where detailed information about the "{slug}" recipe would go.
      </p>
    </div>
  );
}
