import { useQuery } from "@tanstack/react-query";

async function fetchGroceries() {
  const res = await fetch("/api/groceries");
  if (!res.ok) throw new Error("Failed to fetch groceries");
  return res.json();
}

export function useGroceries() {
  return useQuery({
    queryKey: ["groceries"],
    queryFn: fetchGroceries,
  });
}
