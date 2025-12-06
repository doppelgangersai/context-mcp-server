"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Database } from "lucide-react";

export function DataStreamsNavbar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const linkClass = (href: string) =>
    `text-sm font-medium transition-colors ${isActive(href) ? "text-white" : "text-zinc-400 hover:text-white"
    }`;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link className="flex items-center gap-2 font-bold text-white" href="/">
          <Database className="h-6 w-6 text-[#5800C3]" />
          <span>GetContext</span>
        </Link>
        <nav className="hidden gap-6 md:flex">
          <Link className={linkClass("/data-streams/claim")} href="/data-streams/claim">
            Claim
          </Link>
          <Link className={linkClass("/data-streams/marketplace")} href="/data-streams/marketplace">
            Marketplace
          </Link>
          <Link className={linkClass("/")} href="/">
            API
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link
            className="inline-flex h-9 items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-black"
            href="/register"
          >
            Connect Wallet
          </Link>
        </div>
      </div>
    </nav>
  );
}
