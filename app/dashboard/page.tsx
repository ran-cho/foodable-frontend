export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-4">
        Dashboard
      </h1>
      <p className="text-lg text-gray-700 dark:text-zinc-400 text-center max-w-md">
        Your main dashboard content will appear here. Track your recipes, grocery
        lists, and more.
      </p>
    </div>
  );
}
