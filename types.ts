export interface Recipe {
  id: number;
  name: string;
  description: string;
  prepTime: string;
  cookTime: string;
  ingredients?: string[];
  category?: "Breakfast" | "Lunch" | "Dinner"; 
}
