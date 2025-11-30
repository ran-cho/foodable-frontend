import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-gray-100">
      <h1 className="text-xl font-bold">Foodable</h1>
      <div className="space-x-4">
        <Link href="/">Home</Link>
        <Link href="/login">Login</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/recipes">Recipes</Link>
        <Link href="/community">Community</Link>
      </div>
    </nav>
  );
}