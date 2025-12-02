"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Suggestion = {
  name: string;
  description: string;
  ingredients: string[];
  estimated_cost?: number;
  calories?: number;
  protein?: number;
  prepTime?: string;
  cookTime?: string;
};

type Message = {
  role: "user" | "assistant";
  content: string;
  suggestions?: Suggestion[];
};

export default function AiAssistantPage() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your AI recipe assistant. Ask me anything about recipes, cooking tips, or meal planning!",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendQuery = async () => {
    if (!query.trim() || loading) return;

    const userMessage = query;
    setQuery("");
    
    // Add user message
    setMessages((m) => [...m, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      // Send to backend with conversational context
      const res = await fetch(
        "https://foodablebackend.onrender.com/ai/suggest",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: userMessage,
            dietary_restrictions: [],
            max_results: 3,
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        setMessages((m) => [
          ...m,
          { 
            role: "assistant", 
            content: `I encountered an error: ${err.detail || "Something went wrong"}. Could you try rephrasing your question?` 
          },
        ]);
        return;
      }

      const data = await res.json();
      const suggestions: Suggestion[] = data.suggestions || [];

      if (suggestions.length > 0) {
        // Add assistant response with suggestions
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: "Here are some recipes I found for you:",
            suggestions: suggestions,
          },
        ]);
      } else {
        // No suggestions found
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: "I couldn't find any specific recipes for that. Could you provide more details? For example, what ingredients do you have, or what type of cuisine are you interested in?",
          },
        ]);
      }
    } catch (err) {
      setMessages((m) => [
        ...m,
        { 
          role: "assistant", 
          content: "I'm having trouble connecting right now. Please try again in a moment." 
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-6 bg-zinc-50 dark:bg-black">
      <div className="mb-6">
        <h1 className="text-3xl font-bold dark:text-white">AI Recipe Assistant</h1>
        <p className="text-gray-600 dark:text-zinc-400 mt-1">
          Ask me for a recipe idea
        </p>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[80%] ${msg.role === "user" ? "order-2" : ""}`}>
              {msg.role === "user" ? (
                <div className="bg-orange-500 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
                  <p className="text-sm">{msg.content}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {msg.content && (
                    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                      <p className="text-sm text-gray-800 dark:text-zinc-200">{msg.content}</p>
                    </div>
                  )}
                  
                  {/* Recipe suggestions */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="space-y-3 ml-2">
                      {msg.suggestions.map((suggestion, i) => (
                        <Card key={i} className="p-4 hover:shadow-md transition dark:bg-zinc-900 dark:border-zinc-800">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                            {suggestion.name}
                          </h3>
                          
                          <p className="text-sm text-gray-600 dark:text-zinc-400 mb-3">
                            {suggestion.description}
                          </p>

                          {/* Metadata */}
                          <div className="flex flex-wrap gap-3 mb-3 text-xs text-gray-500 dark:text-zinc-500">
                            {suggestion.calories && (
                              <span className="flex items-center gap-1">
                                <span className="font-semibold">🔥</span> {suggestion.calories} kcal
                              </span>
                            )}
                            {suggestion.protein && (
                              <span className="flex items-center gap-1">
                                <span className="font-semibold">💪</span> {suggestion.protein}g protein
                              </span>
                            )}
                            {suggestion.estimated_cost !== undefined && (
                              <span className="flex items-center gap-1">
                                <span className="font-semibold">💰</span> ${suggestion.estimated_cost.toFixed(2)}
                              </span>
                            )}
                            {suggestion.prepTime && (
                              <span className="flex items-center gap-1">
                                <span className="font-semibold">⏱️</span> {suggestion.prepTime}
                              </span>
                            )}
                          </div>

                          {/* Ingredients */}
                          <div>
                            <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">
                              Ingredients:
                            </h4>
                            <ul className="list-disc list-inside space-y-1">
                              {suggestion.ingredients.map((ing, i2) => (
                                <li key={i2} className="text-sm text-gray-700 dark:text-zinc-300">
                                  {ing}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Action button */}
                          <Button 
                            size="sm" 
                            className="mt-3 w-full"
                            onClick={() => {
                              setQuery(`Tell me more about ${suggestion.name}`);
                            }}
                          >
                            Get cooking instructions
                          </Button>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={bottomRef}></div>
      </div>

      {/* Input box */}
      <div className="border-t border-gray-200 dark:border-zinc-800 pt-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask me anything about recipes..."
            className="flex-1 border border-gray-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendQuery()}
            disabled={loading}
          />
          <Button 
            onClick={sendQuery} 
            disabled={loading || !query.trim()}
            size="lg"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Thinking...
              </span>
            ) : (
              "Send"
            )}
          </Button>
        </div>
        
        {/* Suggested prompts */}
        {messages.length === 1 && (
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => setQuery("What can I make with chicken and rice?")}
              className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-full text-gray-700 dark:text-zinc-300 transition"
            >
              🍗 Chicken & rice ideas
            </button>
            <button
              onClick={() => setQuery("I need a quick healthy dinner under 30 minutes")}
              className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-full text-gray-700 dark:text-zinc-300 transition"
            >
              ⚡ Quick healthy dinner
            </button>
            <button
              onClick={() => setQuery("Show me vegetarian pasta recipes")}
              className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-full text-gray-700 dark:text-zinc-300 transition"
            >
              🌱 Vegetarian pasta
            </button>
          </div>
        )}
      </div>
    </div>
  );
}