import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#2D2A26] text-[#FAF8F5] flex flex-col items-center justify-center p-8">
      <h1 className="font-serif text-5xl font-bold text-[#C9A96E] mb-4">SCOUTS</h1>
      <p className="text-xl text-[#FAF8F5]/80 mb-2 text-center max-w-lg">
        An interactive narrative game based on the play by Ryann Murphy
      </p>
      <p className="text-sm text-[#FAF8F5]/50 mb-8">
        Read at Juilliard. Tracking toward Off-Broadway.
      </p>
      <Link href="/play" className="px-8 py-3 bg-[#C9A96E] text-[#2D2A26] font-bold rounded-md hover:bg-[#B8955A] transition-colors text-lg">
        Begin
      </Link>
    </main>
  );
}
