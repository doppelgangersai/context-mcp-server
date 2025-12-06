import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { CodePreview } from "@/components/CodePreview";
import { Pricing } from "@/components/Pricing";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-zinc-100 selection:bg-[#5800C3]/30">
      <Hero />
      <CodePreview />
      <Features />
      <Pricing />
    </main>
  );
}


