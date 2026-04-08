import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#1a1714] text-[#f8f0e3] px-8">
      <div className="text-center max-w-xl">
        <h1 className="font-['Playfair_Display'] text-7xl font-bold text-[#c9a96e] mb-4 tracking-wide">
          SCOUTS
        </h1>
        <p className="font-['Lora'] text-lg text-[#c9a96e] opacity-70 mb-12">
          by Ryann Lynn Murphy
        </p>

        <div className="text-sm text-[#f8f0e3] opacity-50 mb-12 leading-relaxed text-left">
          <p className="font-['Lora'] italic mb-2">Content Warning:</p>
          <p className="font-['Lora']">
            Misogyny, homophobia, transphobia, f-slurs, depictions of animal
            violence, violence, murder, hazing, mentions of abuse, negative body
            image, gender dysphoria, depression, intrusive thoughts.
          </p>
        </div>

        <Link
          href="/play"
          className="inline-block font-['Playfair_Display'] text-xl text-[#c9a96e] border border-[#c9a96e] px-12 py-4 hover:bg-[#c9a96e] hover:text-[#1a1714] transition-all duration-300"
        >
          Begin
        </Link>
      </div>
    </main>
  );
}
