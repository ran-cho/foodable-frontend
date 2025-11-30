"use client"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    // TODO: Add actual authentication logic later
    router.push("/community");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 font-sans dark:bg-black gap-6">
      <h1 className="text-4xl font-bold text-black dark:text-zinc-50">
        Login
      </h1>
      <p className="text-lg text-gray-700 dark:text-zinc-400 text-center max-w-md">
        Enter your credentials to access your dashboard.
      </p>

      <div className="flex flex-col gap-4 w-80">
        <Input placeholder="Email" type="email" />
        <Input placeholder="Password" type="password" />
        <Button onClick={handleLogin}>Login</Button>
      </div>
    </div>
  );
}