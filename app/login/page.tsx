export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-4">
        Login
      </h1>
      <p className="text-lg text-gray-700 dark:text-zinc-400 text-center max-w-md">
        This is where users will log in to access their dashboard and recipes.
      </p>
    </div>
  );
}
