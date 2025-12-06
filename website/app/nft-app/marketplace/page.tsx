"use client";

import { useState } from "react";
import {
  Search,
  Twitter, Youtube, Linkedin, Instagram, ShoppingCart,
  Tag
} from "lucide-react";
import { motion } from "framer-motion";

// Mock NFT data
type NFT = {
  id: string;
  platform: "twitter" | "youtube" | "linkedin" | "instagram" | "tiktok";
  username: string;
  owner: string;
  ownerAddress: string;
  price: number | null; // null = not for sale
  lastPrice: number;
  totalQueries: number;
  totalEarnings: number;
  dailyQueries: number;
  verified: boolean;
};

const MOCK_NFTS: NFT[] = [
  {
    id: "1",
    platform: "twitter",
    username: "elonmusk",
    owner: "CryptoWhale",
    ownerAddress: "0x742d...9c8a",
    price: 5,
    lastPrice: 4.5,
    totalQueries: 125000,
    totalEarnings: 8.5,
    dailyQueries: 420,
    verified: true,
  },
  {
    id: "2",
    platform: "youtube",
    username: "MrBeast",
    owner: "DataCollector",
    ownerAddress: "0x123a...4b5c",
    price: null,
    lastPrice: 12,
    totalQueries: 98000,
    totalEarnings: 15.2,
    dailyQueries: 650,
    verified: true,
  },
  {
    id: "3",
    platform: "linkedin",
    username: "satyanadella",
    owner: "TechInvestor",
    ownerAddress: "0x456d...7e8f",
    price: 2.5,
    lastPrice: 2.3,
    totalQueries: 45000,
    totalEarnings: 3.2,
    dailyQueries: 180,
    verified: true,
  },
  {
    id: "4",
    platform: "twitter",
    username: "sama",
    owner: "AIFanatic",
    ownerAddress: "0x789g...1h2i",
    price: 3.5,
    lastPrice: 3.0,
    totalQueries: 67000,
    totalEarnings: 5.1,
    dailyQueries: 290,
    verified: true,
  },
  {
    id: "5",
    platform: "instagram",
    username: "kyliejenner",
    owner: "SocialWhale",
    ownerAddress: "0xabc3...4j5k",
    price: 8,
    lastPrice: 7.5,
    totalQueries: 145000,
    totalEarnings: 12.8,
    dailyQueries: 580,
    verified: true,
  },
  {
    id: "6",
    platform: "youtube",
    username: "veritasium",
    owner: "ScienceNerd",
    ownerAddress: "0xdef6...7l8m",
    price: null,
    lastPrice: 4.2,
    totalQueries: 52000,
    totalEarnings: 4.9,
    dailyQueries: 220,
    verified: false,
  },
];

const PlatformIcon = ({ platform }: { platform: string }) => {
  const iconClass = "h-6 w-6";
  switch (platform) {
    case "twitter": return <Twitter className={`${iconClass} text-blue-400`} />;
    case "youtube": return <Youtube className={`${iconClass} text-red-500`} />;
    case "linkedin": return <Linkedin className={`${iconClass} text-blue-600`} />;
    case "instagram": return <Instagram className={`${iconClass} text-pink-500`} />;
    default: return null;
  }
};

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "sale" | "not_sale">("all");
  const [sortBy, setSortBy] = useState<"price" | "queries" | "earnings">("queries");

  const filteredNFTs = MOCK_NFTS
    .filter(nft => {
      const matchesSearch = nft.username.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPlatform = platformFilter === "all" || nft.platform === platformFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "sale" && nft.price !== null) ||
        (statusFilter === "not_sale" && nft.price === null);
      return matchesSearch && matchesPlatform && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "price") return (b.price || 0) - (a.price || 0);
      if (sortBy === "earnings") return b.totalEarnings - a.totalEarnings;
      return b.totalQueries - a.totalQueries;
    });

  return (
    <main className="min-h-screen bg-black text-zinc-100 p-8 selection:bg-[#5800C3]/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4">
            DataStream Marketplace
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl">
            Buy and sell claimed data streams. Own a piece of the social media data economy.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
            <div className="text-xs text-zinc-500 uppercase tracking-wider">Total Volume</div>
            <div className="text-2xl font-bold text-white">45.0 BNB</div>
          </div>
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
            <div className="text-xs text-zinc-500 uppercase tracking-wider">Floor Price</div>
            <div className="text-2xl font-bold text-[#C2C4F9]">2.5 BNB</div>
          </div>
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
            <div className="text-xs text-zinc-500 uppercase tracking-wider">Listed</div>
            <div className="text-2xl font-bold text-white">4/{MOCK_NFTS.length}</div>
          </div>
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
            <div className="text-xs text-zinc-500 uppercase tracking-wider">Owners</div>
            <div className="text-2xl font-bold text-white">{new Set(MOCK_NFTS.map(n => n.owner)).size}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="sticky top-20 z-40 bg-black/80 backdrop-blur-xl border-y border-white/10 py-4 mb-8 -mx-4 px-4 md:mx-0 md:px-0 md:rounded-xl md:border-x">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              <button
                onClick={() => setPlatformFilter("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${platformFilter === "all"
                  ? "bg-[#5800C3] text-white"
                  : "bg-white/5 text-zinc-400 hover:bg-white/10"
                  }`}
              >
                All Platforms
              </button>
              {["twitter", "youtube", "linkedin", "instagram"].map((platform) => (
                <button
                  key={platform}
                  onClick={() => setPlatformFilter(platform)}
                  className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${platformFilter === platform
                    ? "bg-[#5800C3] text-white"
                    : "bg-white/5 text-zinc-400 hover:bg-white/10"
                    }`}
                >
                  {platform}
                </button>
              ))}
            </div>

            <div className="flex gap-2 w-full lg:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "all" | "sale" | "not_sale")}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5800C3]"
              >
                <option value="all">All Items</option>
                <option value="sale">For Sale</option>
                <option value="not_sale">Not Listed</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "price" | "queries" | "earnings")}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#5800C3]"
              >
                <option value="queries">Most Queries</option>
                <option value="earnings">Highest Earnings</option>
                <option value="price">Price</option>
              </select>
            </div>

            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search by username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#5800C3]"
              />
            </div>
          </div>
        </div>

        {/* NFT Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredNFTs.map((nft, index) => (
            <motion.div
              key={nft.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative rounded-xl border border-white/10 bg-[#0A0A0A] overflow-hidden hover:border-[#5800C3]/50 transition-all"
            >
              {/* NFT Image/Preview */}
              <div className="relative h-48 bg-gradient-to-br from-[#5800C3]/20 to-[#C2C4F9]/20 flex items-center justify-center border-b border-white/10">
                <PlatformIcon platform={nft.platform} />
                <div className="absolute top-2 right-2 flex gap-2">
                  {nft.verified && (
                    <div className="px-2 py-1 rounded-full bg-blue-500/20 border border-blue-500/50 text-xs text-blue-300">
                      ✓ Verified
                    </div>
                  )}
                  {nft.price && (
                    <div className="px-2 py-1 rounded-full bg-green-500/20 border border-green-500/50 text-xs text-green-300">
                      For Sale
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4">
                {/* Username */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">@{nft.username}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-zinc-400 capitalize">
                    {nft.platform}
                  </span>
                </div>

                {/* Owner */}
                <div className="flex items-center gap-2 mb-4 text-sm text-zinc-400">
                  <span>Owned by</span>
                  <span className="text-white font-medium">{nft.owner}</span>
                  <span className="text-zinc-600">{nft.ownerAddress}</span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div className="bg-white/5 rounded-lg p-2">
                    <div className="text-zinc-500 text-xs">Total Queries</div>
                    <div className="text-white font-semibold">{nft.totalQueries.toLocaleString()}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2">
                    <div className="text-zinc-500 text-xs">Earnings</div>
                    <div className="text-[#C2C4F9] font-semibold">{nft.totalEarnings} BNB</div>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div>
                    {nft.price ? (
                      <>
                        <div className="text-xs text-zinc-500">Price</div>
                        <div className="text-xl font-bold text-white">{nft.price.toLocaleString()} BNB</div>
                      </>
                    ) : (
                      <>
                        <div className="text-xs text-zinc-500">Last Sale</div>
                        <div className="text-lg font-semibold text-zinc-400">{nft.lastPrice.toLocaleString()} BNB</div>
                      </>
                    )}
                  </div>

                  {nft.price ? (
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-primary text-white font-semibold hover:opacity-90 transition-opacity">
                      <ShoppingCart className="h-4 w-4" />
                      Buy Now
                    </button>
                  ) : (
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 text-white font-semibold hover:bg-white/5 transition-colors">
                      <Tag className="h-4 w-4" />
                      Make Offer
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredNFTs.length === 0 && (
          <div className="text-center py-24 text-zinc-500">
            No data streams found matching your filters.
          </div>
        )}
      </div>
    </main>
  );
}

