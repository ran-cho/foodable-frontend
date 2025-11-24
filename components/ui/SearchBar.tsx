"use client";

import { Input } from "@/components/ui/input";

type SearchBarProps = {
  placeholder?: string;
  onChange: (value: string) => void; // simple search handler
};

export function SearchBar({ placeholder = "Search...", onChange }: SearchBarProps) {
  return (
    <div className="max-w-xl mx-auto mb-6">
      <Input
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
      />
    </div>
  );
}
