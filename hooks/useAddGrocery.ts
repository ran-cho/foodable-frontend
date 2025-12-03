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
      const token = localStorage.getItem("foodable_token");
      if (!token) throw new Error("Not logged in");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groceries/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newItem),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Failed to add grocery: ${text}`);
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groceries"] });
    },
  });
}
