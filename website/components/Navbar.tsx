import Link from "next/link";
import { Database } from "lucide-react";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link className="flex items-center gap-2 font-bold text-white" href="/">
          <Database className="h-6 w-6 text-[#5800C3]" />
          <span>GetContext</span>
        </Link>
        <nav className="hidden gap-6 md:flex">
          <Link className="text-sm font-medium text-zinc-400 hover:text-white transition-colors" href="/claim">
            Data Streams
          </Link>
          <Link className="text-sm font-medium text-zinc-400 hover:text-white transition-colors" href="/#features">
            Features
          </Link>
          <Link className="text-sm font-medium text-zinc-400 hover:text-white transition-colors" href="/#pricing">
            Pricing
          </Link>
          <Link className="text-sm font-medium text-zinc-400 hover:text-white transition-colors" href="/docs">
            Documentation
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block" href="/claim">
            Start Claiming
          </Link>
          <Link
            className="inline-flex h-9 items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-black"
            href="/register"
          >
            Get API Keys
          </Link>
        </div>
      </div>
    </nav>
  );
}

