"use client";

import { useState } from "react";
import {
  Wallet, TrendingUp, DollarSign,
  Database, Settings, ArrowRight,
  Twitter, Youtube, Linkedin, Instagram,
  Eye, Edit, ExternalLink, Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useWallet } from "@/components/providers/Web3Provider";
import { useUserNFTs, Platform, PLATFORM_NAMES } from "@/hooks/useUserNFTs";
import { BSC_TESTNET } from "@/lib/contracts/DataOwnershipNFT";

const PlatformIcon = ({ platform }: { platform: Platform }) => {
  const iconClass = "h-5 w-5";
  switch (platform) {
    case "twitter": return <Twitter className={`${iconClass} text-blue-400`} />;
    case "youtube": return <Youtube className={`${iconClass} text-red-500`} />;
    case "linkedin": return <Linkedin className={`${iconClass} text-blue-600`} />;
    case "instagram": return <Instagram className={`${iconClass} text-pink-500`} />;
    default: return <Database className={`${iconClass} text-zinc-400`} />;
  }
};

// Truncate wallet address for display
const truncateAddress = (addr: string) =>
  `${addr.slice(0, 6)}...${addr.slice(-4)}`;

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"claims" | "earnings">("claims");
  const { isConnected, address, openModal, isReady } = useWallet();
  const { nfts, isLoading, error, nftCount, refetch } = useUserNFTs();

  // Not connected state
  if (!isConnected) {
    return (
      <main className="min-h-screen bg-black text-zinc-100 p-8 selection:bg-[#5800C3]/30">
        <div className="max-w-2xl mx-auto text-center py-24">
          <div className="h-20 w-20 rounded-full bg-[#5800C3]/20 flex items-center justify-center mx-auto mb-6">
            <Wallet className="h-10 w-10 text-[#C2C4F9]" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Connect Your Wallet</h1>
          <p className="text-zinc-400 mb-8">
            Connect your wallet to view your Data Stream NFTs and manage your claims.
          </p>
          <button
            type="button"
            onClick={openModal}
            disabled={!isReady}
            className="px-8 py-3 rounded-lg bg-gradient-primary text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isReady ? "Connect Wallet" : "Loading..."}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-zinc-100 p-8 selection:bg-[#5800C3]/30">
      {/* Header with Profile */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center text-2xl font-bold">
            {address?.[2]?.toUpperCase() || "?"}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">My Dashboard</h1>
            <div className="flex items-center gap-2 mt-1">
              <Wallet className="h-3 w-3 text-zinc-500" />
              <span className="text-sm text-zinc-400 font-mono">
                {address ? truncateAddress(address) : "Not connected"}
              </span>
              {address && (
                <a
                  href={`${BSC_TESTNET.blockExplorer}/address/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="View on BscScan"
                  className="text-zinc-500 hover:text-[#C2C4F9] transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors">
          <Settings className="h-4 w-4" />
          Settings
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-12">
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-zinc-500 uppercase tracking-wider">Total Earnings</span>
            BNB
          </div>
          <div className="text-3xl font-bold text-white">-- BNB</div>
          <div className="text-xs text-zinc-500 mt-1">Coming soon</div>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-zinc-500 uppercase tracking-wider">My Claims</span>
            <Database className="h-5 w-5 text-[#C2C4F9]" />
          </div>
          <div className="text-3xl font-bold text-white">
            {isLoading ? "..." : nftCount}
          </div>
          <div className="text-xs text-zinc-400 mt-1">Data Stream NFTs</div>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-zinc-500 uppercase tracking-wider">Total Queries</span>
            <Eye className="h-5 w-5 text-[#C2C4F9]" />
          </div>
          <div className="text-3xl font-bold text-white">--</div>
          <div className="text-xs text-zinc-500 mt-1">Coming soon</div>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-zinc-500 uppercase tracking-wider">Avg. Daily</span>
            <TrendingUp className="h-5 w-5 text-[#C2C4F9]" />
          </div>
          <div className="text-3xl font-bold text-white">--</div>
          <div className="text-xs text-zinc-500 mt-1">Coming soon</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-white/10">
        <button
          type="button"
          onClick={() => setActiveTab("claims")}
          className={`px-6 py-3 font-medium transition-colors relative ${activeTab === "claims" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
            }`}
        >
          My Claims
          {activeTab === "claims" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5800C3]"
            />
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("earnings")}
          className={`px-6 py-3 font-medium transition-colors relative ${activeTab === "earnings" ? "text-white" : "text-zinc-500 hover:text-zinc-300"
            }`}
        >
          Earnings Analytics
          {activeTab === "earnings" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5800C3]"
            />
          )}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "claims" && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Loading State */}
          {isLoading && (
            <div className="col-span-full flex items-center justify-center py-24">
              <Loader2 className="h-8 w-8 text-[#C2C4F9] animate-spin" />
              <span className="ml-3 text-zinc-400">Loading your NFTs...</span>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="col-span-full text-center py-12">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                type="button"
                onClick={refetch}
                className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* NFT Cards */}
          {!isLoading && !error && nfts.map((nft, index) => (
            <motion.div
              key={nft.tokenId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group rounded-xl border border-white/10 bg-[#0A0A0A] overflow-hidden hover:border-[#5800C3]/50 transition-all"
            >
              {/* Header */}
              <div className="relative h-32 bg-gradient-to-br from-[#5800C3]/20 to-[#C2C4F9]/20 flex items-center justify-center border-b border-white/10">
                <PlatformIcon platform={nft.platform} />
                <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-white/10 text-xs text-zinc-400 font-mono">
                  #{nft.tokenId}
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">
                    @{nft.username || "unknown"}
                  </h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-zinc-400 capitalize">
                    {PLATFORM_NAMES[nft.platform]}
                  </span>
                </div>

                {/* URL */}
                <div className="mb-4">
                  <a
                    href={nft.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-zinc-500 hover:text-[#C2C4F9] transition-colors flex items-center gap-1 truncate"
                  >
                    <ExternalLink className="h-3 w-3 shrink-0" />
                    <span className="truncate">{nft.url}</span>
                  </a>
                </div>

                {/* Stats - placeholder for future */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Total Queries:</span>
                    <span className="text-zinc-400">--</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Total Earnings:</span>
                    <span className="text-zinc-400">--</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-white/10">
                  <button type="button" className="flex-1 px-3 py-2 rounded-lg bg-gradient-primary text-white text-sm font-medium hover:opacity-90 transition-opacity">
                    List for Sale
                  </button>
                  <a
                    href={`${BSC_TESTNET.blockExplorer}/token/${process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS}?a=${nft.tokenId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View on BscScan"
                    className="px-3 py-2 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Empty State */}
          {!isLoading && !error && nfts.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Database className="h-8 w-8 text-zinc-600" />
              </div>
              <p className="text-zinc-400 mb-4">You don&apos;t have any Data Stream NFTs yet.</p>
              <Link
                href="/nft-app/claim"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-primary text-white font-semibold hover:opacity-90 transition-opacity"
              >
                Claim Your First Stream
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          {/* Add New Claim Card */}
          {!isLoading && !error && nfts.length > 0 && (
            <Link
              href="/nft-app/claim"
              className="group rounded-xl border border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center min-h-[300px] hover:border-[#5800C3]/50 hover:bg-white/10 transition-all"
            >
              <div className="h-12 w-12 rounded-full bg-[#5800C3]/20 flex items-center justify-center mb-4 group-hover:bg-[#5800C3]/30 transition-colors">
                <Database className="h-6 w-6 text-[#C2C4F9]" />
              </div>
              <span className="text-white font-semibold mb-2">Claim New Stream</span>
              <span className="text-sm text-zinc-500">Browse open requests</span>
              <ArrowRight className="h-4 w-4 text-zinc-500 mt-2 group-hover:text-[#C2C4F9] transition-colors" />
            </Link>
          )}
        </div>
      )}

      {activeTab === "earnings" && (
        <div className="space-y-6">
          {/* Earnings Chart Placeholder */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Earnings Overview</h3>
              <select
                aria-label="Select time period"
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5800C3]"
              >
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
              </select>
            </div>

            {/* Empty state for earnings */}
            <div className="h-64 flex items-center justify-center text-zinc-500">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Earnings analytics coming soon</p>
              </div>
            </div>
          </div>

          {/* Per-Stream Breakdown */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-white mb-6">Earnings by Stream</h3>
            {nfts.length > 0 ? (
              <div className="space-y-4">
                {nfts.map((nft) => (
                  <div key={nft.tokenId} className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                        <PlatformIcon platform={nft.platform} />
                      </div>
                      <div>
                        <div className="font-semibold text-white">@{nft.username || "unknown"}</div>
                        <div className="text-xs text-zinc-500">{PLATFORM_NAMES[nft.platform]}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-zinc-400">-- pts</div>
                      <div className="text-xs text-zinc-500">Coming soon</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-zinc-500">
                No streams to display. Claim your first Data Stream NFT!
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
