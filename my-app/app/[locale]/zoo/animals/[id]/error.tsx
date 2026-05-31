"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050B18] text-white p-4">
      <h2 className="text-3xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-white/60 mb-8 text-center max-w-md">
        We encountered an error while loading the game details. Please try again.
      </p>
      <button
        onClick={() => reset()}
        className="px-8 py-3 bg-red-600 rounded-full font-bold hover:bg-red-700 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
