"use client"

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 font-sans dark:bg-black gap-6">
      <h1 className="text-4xl font-bold text-black dark:text-zinc-50">
        Welcome to Foodable
      </h1>
      <p className="text-lg text-gray-700 dark:text-zinc-400 text-center max-w-md">
        Your personal food assistant app — track recipes, grocery lists, and more!
      </p>
      <Button onClick={() => router.push("/login")}>Get Started</Button>
    </div>
  );
}

