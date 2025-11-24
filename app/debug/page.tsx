export default function DebugPage() {
  return (
    <pre>
      NEXT_PUBLIC_API_URL = {process.env.NEXT_PUBLIC_API_URL || "undefined"}
    </pre>
  );
}
