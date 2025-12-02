"use client";

import { createContext, useContext, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useLogout, type UserPublic } from "@/lib/api";

type AuthContextType = {
  user: UserPublic | null | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: user, isLoading } = useAuth();
  const logout = useLogout();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const value: AuthContextType = {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}