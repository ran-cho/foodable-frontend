import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteGrocery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | string) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groceries/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete grocery");
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groceries"] });
    },
  });
}
