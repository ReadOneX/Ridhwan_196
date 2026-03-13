"use client";

import { useEffect } from "react";
import Link from "next/link";

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
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="bg-white p-12 rounded-3xl shadow-2xl border border-pink-100 max-w-lg">
        <span className="text-8xl mb-6 block drop-shadow-lg animate-bounce">😭</span>
        <h2 className="text-3xl font-bold text-pink-600 mb-4">Gomen ne!</h2>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          It looks like the track is blocked. We couldn't fetch Haru Urara's information right now.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-8 py-3 bg-pink-500 text-white font-bold rounded-full shadow-lg hover:bg-pink-600 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-8 py-3 bg-white text-pink-500 border-2 border-pink-500 font-bold rounded-full shadow-md hover:bg-pink-50 transition-all hover:scale-105 active:scale-95"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
