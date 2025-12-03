import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (commentId: number) => {
      const token = localStorage.getItem("foodable_token");
      const res = await fetch(
        `https://foodablebackend.onrender.com/comments/${commentId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to delete comment");
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}