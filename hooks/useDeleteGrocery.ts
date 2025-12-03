import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteGrocery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | string) => {
      const token = localStorage.getItem("foodable_token");
      if (!token) throw new Error("Not logged in");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groceries/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Failed to delete grocery: ${text}`);
      }

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groceries"] });
    },
  });
}
