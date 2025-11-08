import { useMutation, useQueryClient } from "@tanstack/react-query";

type NewGrocery = {
  name: string;
  category?: string;
  calories?: number;
  protein?: number;
};

export function useAddGrocery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newItem: NewGrocery) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groceries/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      if (!res.ok) throw new Error("Failed to add grocery");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groceries"] });
    },
  });
}
