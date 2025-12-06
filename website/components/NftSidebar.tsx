"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, ShoppingCart,
  UserCircle, MessageSquare, Zap,
  LogOut, Database,
  type LucideIcon
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useState } from "react";
import { WalletPanel } from "./dashboard";

type NavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
};

const NAV_ITEMS: NavItem[] = [
  { name: "Dashboard", href: "/nft-app/dashboard", icon: LayoutDashboard },
  { name: "Claim", href: "/nft-app/claim", icon: Zap },
  { name: "Marketplace", href: "/nft-app/marketplace", icon: ShoppingCart },
  { name: "Contact", href: "/nft-app/contact", icon: MessageSquare },
];

export function NftSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const { logout, developer } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/10 bg-black">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6">
          <Zap className="h-6 w-6 text-[#5800C3]" />
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
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive
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
        <div className="border-t border-white/10 p-4 gap-3 flex flex-col">
          {/* Wallet Panel */}
          <WalletPanel isCollapsed={isCollapsed} />

          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 px-4 py-2.5 text-sm font-medium text-white hover:from-purple-500 hover:to-cyan-500 transition-all shadow-lg shadow-purple-500/20"
          >
            <Database className="h-4 w-4" />
            Developer Portal
          </Link>
          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-all"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
          {!isCollapsed && developer && (
            <a
              href="https://getcontext.now"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-xs text-gray-500 hover:text-gray-400 px-3"
            >
              https://getcontext.now
            </a>
          )}
        </div>
      </div>
    </aside>
  );
}


