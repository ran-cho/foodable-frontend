import { Recipe } from "../../../types";

interface RecipePageProps {
  params: { id: string };
}

export default function RecipeDetailPage({ params }: RecipePageProps) {
  // Normally fetch from API using params.id
  const recipe: Recipe = {
    id: Number(params.id),
    name: "Spaghetti Bolognese",
    description: "Classic Italian pasta",
    prepTime: "15 mins",
    cookTime: "1 hr",
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{recipe.name}</h1>
      <p>{recipe.description}</p>
      <p>Prep: {recipe.prepTime}</p>
      <p>Cook: {recipe.cookTime}</p>
    </div>
  );
}
