"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Suggestion = {
  name: string;
  description: string;
  ingredients: string[];
  estimated_cost: number;
  calories: number;
  protein: number;
};

type Message = {
  role: "user" | "assistant";
  content: string | Suggestion[];
};

export default function AiAssistantPage() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendQuery = async () => {
    if (!query.trim() || loading) return;

    // Add user message and "Thinking..." placeholder
    setMessages((m) => [
      ...m,
      { role: "user", content: query },
      { role: "assistant", content: "Thinking..." },
    ]);
    setQuery("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://foodablebackend.onrender.com/ai/suggest",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query,
            dietary_restrictions: [],
            max_results: 3,
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        setMessages((m) => [
          ...m.slice(0, m.length - 1),
          { role: "assistant", content: `Error: ${JSON.stringify(err)}` },
        ]);
        return;
      }

      const data = await res.json();
      const suggestions: Suggestion[] = data.suggestions || [];

      // Replace "Thinking..." with real suggestions or fallback message
      setMessages((m) => [
        ...m.slice(0, m.length - 1),
        {
          role: "assistant",
          content:
            suggestions.length > 0
              ? suggestions
              : "Sorry, I couldn't find any recipes for that query. Try a different prompt.",
        },
      ]);
    } catch (err) {
      setMessages((m) => [
        ...m.slice(0, m.length - 1),
        { role: "assistant", content: "Error: Could not fetch suggestions" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">AI Recipe Assistant</h1>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={msg.role === "user" ? "text-right" : "text-left"}
          >
            {msg.role === "user" ? (
              <Card className="inline-block bg-blue-500 text-white p-4">
                {typeof msg.content === 'string' ? msg.content : null}
              </Card>
            ) : Array.isArray(msg.content) ? (
              <div className="space-y-2">
                {msg.content.map((s, i) => (
                  <Card key={i} className="p-4">
                    <h2 className="text-xl font-bold">{s.name}</h2>
                    <p className="text-gray-600 mb-2">{s.description}</p>
                    <p className="text-sm text-gray-500 mb-1">
                      Calories: {s.calories} kcal | Protein: {s.protein} g | Estimated Cost: $
                      {s.estimated_cost.toFixed(2)}
                    </p>
                    <h3 className="font-semibold mb-1">Ingredients:</h3>
                    <ul className="list-disc list-inside">
                      {s.ingredients.map((ing, i2) => (
                        <li key={i2}>{ing}</li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="inline-block bg-gray-200 p-4">
                {msg.content}
              </Card>
            )}
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      {/* Input box */}
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask for a recipe..."
          className="flex-1 border rounded p-2"
          onKeyDown={(e) => e.key === "Enter" && sendQuery()}
          disabled={loading}
        />
        <Button onClick={sendQuery} disabled={loading}>
          {loading ? "Loading..." : "Send"}
        </Button>
      </div>
    </div>
  );
}