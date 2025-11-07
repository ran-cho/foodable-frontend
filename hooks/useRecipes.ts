import { useQuery } from "@tanstack/react-query";

async function fetchRecipes() {
  const res = await fetch("/api/recipes"); // temporary mock route
  if (!res.ok) throw new Error("Failed to fetch recipes");
  return res.json();
}

export function useRecipes() {
  return useQuery({
    queryKey: ["recipes"],
    queryFn: fetchRecipes,
  });
}
