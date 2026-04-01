import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#f8f0e3] flex flex-col items-center justify-center p-8">
      <h1 className="font-serif text-6xl font-bold text-[#c9a96e] mb-6 tracking-wide">
        SCOUTS
      </h1>
      <p className="text-lg text-[#f8f0e3]/70 mb-2 text-center max-w-md font-serif">
        An interactive narrative game based on the play
      </p>
      <p className="text-sm text-[#f8f0e3]/40 mb-10 text-center font-serif">
        by Ryann Lynn Murphy
      </p>

      <div className="max-w-lg text-center mb-10 px-6 py-4 border border-[#333] rounded-lg bg-[#111]/50">
        <p className="text-xs text-[#f8f0e3]/50 uppercase tracking-widest mb-3">
          Content Warning
        </p>
        <p className="text-sm text-[#f8f0e3]/60 leading-relaxed font-serif">
          Misogyny, homophobia, transphobia, f-slurs, depictions of animal violence,
          depictions of violence, depictions of hazing, mentions of abuse, mentions of
          negative body image, mentions of gender dysphoria, mentions of depression.
        </p>
      </div>

      <Link
        href="/play"
        className="px-10 py-4 bg-[#c9a96e] text-[#1a1714] font-bold rounded-md hover:bg-[#b8955a] transition-colors text-lg font-serif tracking-wide"
      >
        Begin
      </Link>

      <p className="text-xs text-[#f8f0e3]/20 mt-16 font-serif">
        Best experienced with headphones.
      </p>
    </main>
  );
}
