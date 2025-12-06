"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Key, CreditCard,
  UserCircle, MessageSquare, Share2, Database,
  LogOut,
  type LucideIcon
} from "lucide-react";

type NavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
};

const NAV_ITEMS: NavItem[] = [
  { name: "Dashboard", href: "/app", icon: LayoutDashboard },
  { name: "MCP", href: "/app/mcp", icon: Share2 },
  { name: "API Keys", href: "/app/api-keys", icon: Key },
  { name: "Top-Up", href: "/app/top-up", icon: CreditCard },
  { name: "Billing", href: "/app/billing", icon: CreditCard },
  { name: "Account", href: "/app/account", icon: UserCircle },
  { name: "Contact", href: "/contact", icon: MessageSquare },
];

export function DeveloperSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/10 bg-black">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6">
          <Database className="h-6 w-6 text-[#5800C3]" />
          <span className="font-bold text-white text-lg">GetContext</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;
              
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#5800C3] text-white"
                        : "text-zinc-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 p-4">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 px-4 py-2.5 text-sm font-medium text-white hover:from-purple-500 hover:to-cyan-500 transition-all shadow-lg shadow-purple-500/20"
          >
            <Database className="h-4 w-4" />
            NFT Dashboard
          </Link>
          <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-zinc-500 hover:bg-white/5 hover:text-zinc-300 transition-colors">
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}


