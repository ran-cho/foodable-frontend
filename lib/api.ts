const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status} ${res.statusText}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export type Grocery = {
  id: number;
  name: string;
  category?: string | null;
  calories?: number | null;
  protein?: number | null;
};

export type GroceryCreate = Omit<Grocery, "id">;

export const GroceriesAPI = {
  list: () => api<Grocery[]>("/groceries/"),
  get: (id: number) => api<Grocery>(`/groceries/${id}`),
  create: (data: GroceryCreate) =>
    api<Grocery>("/groceries/", { method: "POST", body: JSON.stringify(data) }),
};

export { BASE_URL };
