import { AISearchAutocomplete } from "@/components/ai/AISearchAutocomplete";

export default function AISearchPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">AI Meal Search</h1>

      <div className="w-full max-w-3xl">
        <AISearchAutocomplete />
      </div>
    </div>
  );
}
