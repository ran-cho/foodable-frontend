export async function GET() {
  return Response.json([
    { id: 1, title: "Chicken Salad", calories: 450 },
    { id: 2, title: "Veggie Stir Fry", calories: 300 }
  ]);
}
