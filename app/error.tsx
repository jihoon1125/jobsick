"use client";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <h2 className="text-xl font-semibold">
        문제가 발생했습니다
      </h2>
      <p className="text-muted-foreground">
        {error.message}
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
      >
        다시 시도
      </button>
    </main>
  );
}
