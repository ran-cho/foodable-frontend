"use client";

import { useState } from "react";
import { SearchBar } from "@/components/ui/SearchBar";

export default function SearchDemoPage() {
  const [term, setTerm] = useState("");

  return (
    <div className="min-h-screen p-10">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Search Demo
      </h1>

      <SearchBar
        placeholder="Type something..."
        onChange={(value) => setTerm(value)}
      />

      <div className="mt-10 text-center">
        <p className="text-gray-600">You typed:</p>
        <p className="text-xl font-semibold mt-2">{term || "(nothing yet)"}</p>
      </div>
    </div>
  );
}
