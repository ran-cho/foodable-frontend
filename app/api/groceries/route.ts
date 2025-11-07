export async function GET() {
  return Response.json([
    { id: 1, name: "Apples", price: "$3.99/lb", category: "Produce" },
    { id: 2, name: "Whole Wheat Bread", price: "$2.49", category: "Bakery" }
  ]);
}
