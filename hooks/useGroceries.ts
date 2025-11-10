import { useQuery } from "@tanstack/react-query";

export function useGroceries() {
  return useQuery({
    queryKey: ["groceries"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groceries`);
      if (!res.ok) throw new Error("Failed to fetch groceries");
      return res.json();
    },
  });
}
