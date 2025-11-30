import { AISearchAutocomplete } from "@/components/ai/AISearchAutocomplete";

export default function AISearchPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">AI Meal Search</h1>
      <AISearchAutocomplete />
    </div>
  );
}
