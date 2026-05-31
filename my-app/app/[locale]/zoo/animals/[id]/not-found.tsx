import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#050B18] text-white p-4">
      <h2 className="text-4xl font-black mb-4">GAME NOT FOUND</h2>
      <p className="text-white/60 mb-8 text-center">
        The game you are looking for might have been moved or doesn't exist.
      </p>
      <Link
        href="/"
        className="px-8 py-3 border border-white/20 rounded-full font-bold hover:bg-white/5 transition-colors"
      >
        Return to Park
      </Link>
    </div>
  );
}
