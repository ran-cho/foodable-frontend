"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

type Message = { role: "user" | "assistant"; content: string };

export default function RecipeChat() {
  // Sample chat messages
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "👋 Welcome! Type something to start the chat." },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Handle sending a message
  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = { role: "user", content: input.trim() };
    setMessages([...messages, newMessage]);
    setInput("");

    // Placeholder reply (for now)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "This is a placeholder reply." },
      ]);
    }, 500);
  };

  // Scroll when messages update
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Recipe Chat</h2>
        <p className="text-muted-foreground text-sm">
          Chat interface placeholder — no AI connected yet.
        </p>
      </CardHeader>

      <CardContent className="flex flex-col h-[60vh]">
        {/* Chat messages */}
        <ScrollArea className="flex-1 pr-2 space-y-3 overflow-y-auto">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`rounded-2xl px-4 py-2 max-w-[80%] whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </ScrollArea>

        {/* Input + Send button */}
        <div className="mt-3 flex gap-2">
          <Input
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </CardContent>
    </Card>
  );
}
