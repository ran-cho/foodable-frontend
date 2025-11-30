"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function TestAi() {
  const [data, setData] = useState(null);

  const runTest = async () => {
    const res = await fetch("https://foodablebackend.onrender.com/ai/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: "salmon dinner",
        dietary_restrictions: [],
        max_results: 3,
      }),
    });
    const json = await res.json();
    setData(json);
  };

  return (
    <div>
      <Button onClick={runTest}>Test AI Suggest</Button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}