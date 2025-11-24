"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, X } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "👋 Hi! Type something to start the chat." },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Send a message
  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = { role: "user", content: input.trim() };
    setMessages([...messages, newMessage]);
    setInput("");

    // Placeholder assistant reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "This is a placeholder reply." },
      ]);
    }, 500);
  };

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat toggle button */}
      {!open && (
        <button
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
          onClick={() => setOpen(true)}
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* Chat window */}
      {open && (
        <Card className="w-80 h-96 flex flex-col shadow-xl">
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Recipe Chat</h2>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </CardHeader>

          <CardContent className="flex flex-col flex-1">
            {/* Messages */}
            <ScrollArea className="flex-1 pr-2 space-y-2 overflow-y-auto">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`rounded-2xl px-3 py-2 max-w-[75%] whitespace-pre-wrap ${
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

            {/* Input + Send */}
            <div className="mt-2 flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <Button onClick={handleSend}>Send</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
