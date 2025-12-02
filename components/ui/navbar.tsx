"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useLogout } from "@/hooks/useLogout";

async function fetchMe() {
  const token = localStorage.getItem("foodable_token");
  if (!token) return null;

  const res = await fetch("https://foodablebackend.onrender.com/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return null;
  return res.json();
}

export default function Navbar() {
  const logout = useLogout();

  const { data: currentUser } = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
  });

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-100">
      <h1 className="text-xl font-bold">Foodable</h1>
      <div className="space-x-4 flex items-center">
        <Link href="/">Home</Link>
        {currentUser && <Link href="/dashboard">Dashboard</Link>}
        <Link href="/recipes">Recipes</Link>
        <Link href="/community">Community</Link>

        {currentUser ? (
          <>
            <span>Hi, {currentUser.name}</span>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
