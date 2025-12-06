import Link from "next/link";
import { Zap } from "lucide-react";

export function NftNavbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link className="flex items-center gap-2 font-bold text-white" href="/claim">
          <Zap className="h-6 w-6 text-[#5800C3]" />
          <span>GetContext</span>
        </Link>
        <nav className="hidden gap-6 md:flex">
          <Link className="text-sm font-medium text-zinc-400 hover:text-white transition-colors" href="/claim">
            Claim
          </Link>
          <Link className="text-sm font-medium text-zinc-400 hover:text-white transition-colors" href="/marketplace">
            Marketplace
          </Link>
          <Link className="text-sm font-medium text-zinc-400 hover:text-white transition-colors" href="/">
            API
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            className="inline-flex h-9 items-center justify-center rounded-md border border-white/20 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-black"
            href="/dashboard"
          >
            Sign Up
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex h-9 items-center justify-center rounded-md bg-gradient-primary px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#5800C3] focus:ring-offset-2 focus:ring-offset-black"
          >
            Connect Wallet
          </Link>
        </div>
      </div>
    </nav>
  );
}

