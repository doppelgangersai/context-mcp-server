"use client";

import { useState, useEffect } from "react";
import {
  Wallet, Shield, Zap, Box, X,
  Search, Clock,
  TrendingUp, ArrowUpRight,
  Twitter, Youtube, Linkedin, Instagram,
  Loader2, CheckCircle2, AlertCircle, ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@/components/providers/Web3Provider";
import { useNFTMint } from "@/hooks/useNFTMint";
import { BSC_TESTNET } from "@/lib/contracts/DataOwnershipNFT";

// Mock data types
type RequestItem = {
  id: string;
  platform: "twitter" | "youtube" | "linkedin" | "instagram" | "tiktok";
  username: string;
  minPoints: number;
  maxPoints: number;
  timestamp: number;
};

const INITIAL_DATA: RequestItem[] = [
  { id: "1", platform: "twitter", username: "elonmusk", minPoints: 3000, maxPoints: 5000, timestamp: Date.now() },
  { id: "2", platform: "youtube", username: "MrBeast", minPoints: 10000, maxPoints: 15000, timestamp: Date.now() - 5000 },
  { id: "3", platform: "linkedin", username: "satyanadella", minPoints: 500, maxPoints: 1000, timestamp: Date.now() - 15000 },
  { id: "4", platform: "twitter", username: "tszzl", minPoints: 200, maxPoints: 500, timestamp: Date.now() - 45000 },
  { id: "5", platform: "youtube", username: "veritasium", minPoints: 5000, maxPoints: 8000, timestamp: Date.now() - 120000 },
];

const PlatformIcon = ({ platform }: { platform: string }) => {
  switch (platform) {
    case "twitter": return <Twitter className="h-5 w-5 text-blue-400" />;
    case "youtube": return <Youtube className="h-5 w-5 text-red-500" />;
    case "linkedin": return <Linkedin className="h-5 w-5 text-blue-600" />;
    case "instagram": return <Instagram className="h-5 w-5 text-pink-500" />;
    default: return <TrendingUp className="h-5 w-5 text-zinc-400" />;
  }
};

const formatPoints = (min: number, max: number) => {
  return `${min.toLocaleString()}-${max.toLocaleString()} points`;
};

type MintStep = "idle" | "checking" | "connecting" | "minting" | "success" | "error";

export default function ClaimPage() {
  const [sourceUrl, setSourceUrl] = useState("");
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [requests, setRequests] = useState<RequestItem[]>(INITIAL_DATA);
  const [filter, setFilter] = useState<"latest" | "largest">("latest");
  const [searchQuery, setSearchQuery] = useState("");
  const [isStreamActive] = useState(true);
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const [mintStep, setMintStep] = useState<MintStep>("idle");
  const [urlAvailable, setUrlAvailable] = useState<boolean | null>(null);

  const { isConnected, openModal, address, isReady } = useWallet();
  const { mint, checkUrlRegistered, isLoading, error, txHash, success, reset } = useNFTMint();

  // Update current time for relative timestamps
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate real-time feed
  useEffect(() => {
    if (!isStreamActive) return;

    const interval = setInterval(() => {
      const platforms = ["twitter", "youtube", "linkedin", "instagram", "tiktok"] as const;
      const basePoints = Math.floor(Math.random() * 2000) + 100;

      const newRequest: RequestItem = {
        id: Math.random().toString(36).substring(2, 11),
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        username: `user_${Math.floor(Math.random() * 1000)}`,
        minPoints: basePoints,
        maxPoints: basePoints + Math.floor(Math.random() * 1000) + 100,
        timestamp: Date.now(),
      };

      setRequests(prev => [newRequest, ...prev].slice(0, 50));
    }, 3000);

    return () => clearInterval(interval);
  }, [isStreamActive]);

  const filteredRequests = requests
    .filter(item => item.username.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (filter === "largest") return b.maxPoints - a.maxPoints;
      return b.timestamp - a.timestamp;
    });

  // Check URL availability
  const handleCheckUrl = async (url: string) => {
    if (!url) return;

    setMintStep("checking");
    setUrlAvailable(null);

    try {
      const isRegistered = await checkUrlRegistered(url);
      setUrlAvailable(!isRegistered);

      if (isRegistered) {
        setMintStep("error");
      } else {
        setMintStep("idle");
      }
    } catch {
      setMintStep("error");
      setUrlAvailable(null);
    }
  };

  // Main claim flow
  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceUrl) return;

    reset();
    setIsWalletOpen(true);

    // Step 1: Check URL availability
    setMintStep("checking");
    const isRegistered = await checkUrlRegistered(sourceUrl);

    if (isRegistered) {
      setUrlAvailable(false);
      setMintStep("error");
      return;
    }

    setUrlAvailable(true);

    // Step 2: Connect wallet if not connected
    if (!isConnected) {
      setMintStep("connecting");
      await openModal();
      return; // Modal handles connection, user will need to click again after connecting
    }

    // Step 3: Mint NFT
    await executeMint(sourceUrl);
  };

  // Execute minting after wallet is connected
  const executeMint = async (url: string) => {
    setMintStep("minting");
    const result = await mint(url);

    if (result) {
      setMintStep("success");
    } else {
      setMintStep("error");
    }
  };

  // Handle claim from feed
  const handleFeedClaim = (url: string) => {
    setSourceUrl(url);
    reset();
    setMintStep("idle");
    setUrlAvailable(null);
    setIsWalletOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Close modal and reset state
  const handleCloseModal = () => {
    setIsWalletOpen(false);
    if (success) {
      setSourceUrl("");
      setMintStep("idle");
      setUrlAvailable(null);
      reset();
    }
  };

  // Continue minting after wallet connection
  const handleContinueMint = async () => {
    if (!sourceUrl) return;

    if (!isConnected) {
      setMintStep("connecting");
      await openModal();
      return;
    }

    await executeMint(sourceUrl);
  };

  return (
    <main className="min-h-screen bg-black text-zinc-100 p-8 selection:bg-[#5800C3]/30">
      <div className="max-w-7xl mx-auto">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6">
              Claim Data Streams as NFTs
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-12">
              Own the rights to specific data sources. Mint an NFT that represents a Twitter profile, YouTube channel, or TikTok account and earn rewards when its data is queried.
            </p>
          </motion.div>
        </div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm mb-16 max-w-3xl mx-auto"
        >
            <form onSubmit={handleClaim} className="flex flex-col gap-4">
              <label htmlFor="source-url" className="sr-only">Data Source URL</label>
              <div className="relative">
                <input
                  id="source-url"
                  type="text"
                  placeholder="Enter URL (e.g., https://x.com/elonmusk)"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  className="w-full h-14 pl-6 pr-4 rounded-lg bg-black/50 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#5800C3] focus:border-transparent transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                className="h-14 w-full rounded-lg bg-gradient-primary font-semibold text-white shadow-lg shadow-[#5800C3]/20 transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Check Availability & Mint
              </button>
            </form>
            <p className="mt-4 text-sm text-zinc-500">
              Supported: Twitter/X, Instagram, YouTube, TikTok, LinkedIn
            </p>
          </motion.div>

          {/* Explainer Block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid gap-8 md:grid-cols-3 text-left mb-32"
          >
            <div className="p-6 rounded-xl border border-white/10 bg-white/5">
              <div className="h-10 w-10 rounded-lg bg-[#5800C3]/20 flex items-center justify-center mb-4">
                <Box className="h-5 w-5 text-[#C2C4F9]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Mint NFT</h3>
              <p className="text-zinc-400 text-sm">
                Create a unique digital asset on the blockchain that proves your ownership of the data stream configuration.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-white/10 bg-white/5">
              <div className="h-10 w-10 rounded-lg bg-[#5800C3]/20 flex items-center justify-center mb-4">
                <Shield className="h-5 w-5 text-[#C2C4F9]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Verify Ownership</h3>
              <p className="text-zinc-400 text-sm">
                Smart contracts ensure only one person can claim a specific source URL. First come, first served.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-white/10 bg-white/5">
              <div className="h-10 w-10 rounded-lg bg-[#5800C3]/20 flex items-center justify-center mb-4">
                <Zap className="h-5 w-5 text-[#C2C4F9]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Earn Rewards</h3>
              <p className="text-zinc-400 text-sm">
                Receive a percentage of API fees whenever developers query your claimed data stream.
              </p>
            </div>
          </motion.div>

        {/* Requests Feed Section */}
        <div className="border-t border-white/10 pt-16">
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-2 mb-2"
              >
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-green-400 text-sm font-mono">LIVE REQUEST STREAM</span>
              </motion.div>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Open Data Requests
              </h2>
              <p className="mt-4 text-zinc-400 max-w-lg">
                These data sources are in high demand. Claim them now to start earning rewards immediately.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full md:w-auto">
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                <div className="text-xs text-zinc-500 uppercase tracking-wider">Active Requests</div>
                <div className="text-2xl font-bold text-white">12,405</div>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                <div className="text-xs text-zinc-500 uppercase tracking-wider">Total Value</div>
                <div className="text-2xl font-bold text-[#C2C4F9]">15.2M pts</div>
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl hidden sm:block">
                <div className="text-xs text-zinc-500 uppercase tracking-wider">Fulfilled (24h)</div>
                <div className="text-2xl font-bold text-green-400">892</div>
              </div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="sticky top-20 z-40 bg-black/80 backdrop-blur-xl border-y border-white/10 py-4 mb-8 -mx-4 px-4 md:mx-0 md:px-0 md:rounded-xl md:border-x">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                <button
                  onClick={() => setFilter("latest")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === "latest"
                    ? "bg-[#5800C3] text-white shadow-lg shadow-[#5800C3]/25"
                    : "bg-white/5 text-zinc-400 hover:bg-white/10"
                    }`}
                >
                  <Clock className="h-4 w-4" /> Latest
                </button>
                <button
                  onClick={() => setFilter("largest")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === "largest"
                    ? "bg-[#5800C3] text-white shadow-lg shadow-[#5800C3]/25"
                    : "bg-white/5 text-zinc-400 hover:bg-white/10"
                    }`}
                >
                  <TrendingUp className="h-4 w-4" /> Highest Value
                </button>
              </div>

              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search by username or platform..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#5800C3] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Feed Grid */}
          <div className="grid gap-4">
            <AnimatePresence mode="popLayout">
              {filteredRequests.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative overflow-hidden rounded-xl border border-white/5 bg-[#0A0A0A] p-4 hover:border-[#5800C3]/30 hover:bg-white/5 transition-all"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-[#5800C3]/30 transition-colors">
                        <PlatformIcon platform={item.platform} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white text-lg">@{item.username}</h3>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-zinc-400 capitalize">
                            {item.platform}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-zinc-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {Math.floor((currentTime - item.timestamp) / 1000)}s ago
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-end md:items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs text-zinc-500 uppercase tracking-wider">Est. Value</div>
                        <div className="text-xl font-bold text-[#C2C4F9]">{formatPoints(item.minPoints, item.maxPoints)}</div>
                      </div>
                      <button
                        onClick={() => handleFeedClaim(`https://${item.platform}.com/${item.username}`)}
                        className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-black font-bold hover:bg-zinc-200 transition-colors"
                      >
                        Claim <ArrowUpRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredRequests.length === 0 && (
              <div className="text-center py-24 text-zinc-500">
                No active requests found matching your search.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Minting Modal */}
      <AnimatePresence>
        {isWalletOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0A0A0A] p-6 shadow-2xl"
            >
              <button
                onClick={handleCloseModal}
                className="absolute right-4 top-4 text-zinc-500 hover:text-white"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Checking URL */}
              {mintStep === "checking" && (
                <div className="text-center py-8">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#5800C3]/20">
                    <Loader2 className="h-8 w-8 text-[#C2C4F9] animate-spin" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Checking Availability</h2>
                  <p className="text-zinc-400 text-sm break-all">{sourceUrl}</p>
                </div>
              )}

              {/* URL Not Available */}
              {mintStep === "error" && urlAvailable === false && (
                <div className="text-center py-8">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
                    <AlertCircle className="h-8 w-8 text-red-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Already Claimed</h2>
                  <p className="text-zinc-400 text-sm mb-6">
                    This data source has already been minted by another user.
                  </p>
                  <button
                    onClick={handleCloseModal}
                    className="w-full h-12 rounded-lg bg-white/10 font-semibold text-white hover:bg-white/20 transition-colors"
                  >
                    Try Another URL
                  </button>
                </div>
              )}

              {/* Minting Error */}
              {mintStep === "error" && urlAvailable !== false && error && (
                <div className="text-center py-8">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
                    <AlertCircle className="h-8 w-8 text-red-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Minting Failed</h2>
                  <p className="text-zinc-400 text-sm mb-6">{error}</p>
                  <div className="space-y-3">
                    <button
                      onClick={handleContinueMint}
                      className="w-full h-12 rounded-lg bg-gradient-primary font-semibold text-white shadow-lg shadow-[#5800C3]/20 hover:opacity-90 transition-opacity"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={handleCloseModal}
                      className="w-full h-12 rounded-lg bg-white/10 font-semibold text-white hover:bg-white/20 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Connect Wallet */}
              {mintStep === "connecting" && (
                <div className="text-center py-8">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#5800C3]/20">
                    <Wallet className="h-8 w-8 text-[#C2C4F9]" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Connect Wallet</h2>
                  <p className="text-zinc-400 text-sm mb-2">
                    URL is available! Connect your wallet to mint.
                  </p>
                  <p className="text-white font-medium text-sm break-all mb-6">{sourceUrl}</p>

                  {isConnected ? (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                        <div className="flex items-center justify-center gap-2 text-green-400">
                          <CheckCircle2 className="h-5 w-5" />
                          <span className="font-medium">Wallet Connected</span>
                        </div>
                        <p className="text-zinc-400 text-xs mt-1 font-mono">
                          {address?.slice(0, 6)}...{address?.slice(-4)}
                        </p>
                      </div>
                      <button
                        onClick={handleContinueMint}
                        className="w-full h-12 rounded-lg bg-gradient-primary font-semibold text-white shadow-lg shadow-[#5800C3]/20 hover:opacity-90 transition-opacity"
                      >
                        Continue to Mint
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={openModal}
                      disabled={!isReady}
                      className="w-full h-12 rounded-lg bg-gradient-primary font-semibold text-white shadow-lg shadow-[#5800C3]/20 hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {isReady ? "Connect Wallet" : "Loading..."}
                    </button>
                  )}
                </div>
              )}

              {/* Idle state - ready to mint */}
              {mintStep === "idle" && urlAvailable === true && isConnected && (
                <div className="text-center py-8">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                    <CheckCircle2 className="h-8 w-8 text-green-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">URL Available!</h2>
                  <p className="text-zinc-400 text-sm mb-2">Ready to mint your Data Stream NFT</p>
                  <p className="text-white font-medium text-sm break-all mb-6">{sourceUrl}</p>

                  <button
                    onClick={handleContinueMint}
                    className="w-full h-12 rounded-lg bg-gradient-primary font-semibold text-white shadow-lg shadow-[#5800C3]/20 hover:opacity-90 transition-opacity"
                  >
                    Mint NFT
                  </button>
                </div>
              )}

              {/* Minting in progress */}
              {mintStep === "minting" && (
                <div className="text-center py-8">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#5800C3]/20">
                    <Loader2 className="h-8 w-8 text-[#C2C4F9] animate-spin" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Minting NFT</h2>
                  <p className="text-zinc-400 text-sm mb-4">
                    Please confirm the transaction in your wallet...
                  </p>
                  {txHash && (
                    <a
                      href={`${BSC_TESTNET.blockExplorer}/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#C2C4F9] hover:underline text-sm"
                    >
                      View on BscScan <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              )}

              {/* Success */}
              {mintStep === "success" && (
                <div className="text-center py-8">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                    <CheckCircle2 className="h-8 w-8 text-green-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Successfully Minted!</h2>
                  <p className="text-zinc-400 text-sm mb-6">
                    Your Data Stream NFT has been created. You can now earn rewards when this data is queried.
                  </p>

                  {txHash && (
                    <a
                      href={`${BSC_TESTNET.blockExplorer}/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#C2C4F9] hover:underline text-sm mb-6"
                    >
                      View Transaction <ExternalLink className="h-4 w-4" />
                    </a>
                  )}

                  <div className="space-y-3 mt-6">
                    <a
                      href="/nft-app/dashboard"
                      className="block w-full h-12 rounded-lg bg-gradient-primary font-semibold text-white shadow-lg shadow-[#5800C3]/20 hover:opacity-90 transition-opacity leading-[48px]"
                    >
                      View Dashboard
                    </a>
                    <button
                      onClick={handleCloseModal}
                      className="w-full h-12 rounded-lg bg-white/10 font-semibold text-white hover:bg-white/20 transition-colors"
                    >
                      Mint Another
                    </button>
                  </div>
                </div>
              )}

              <p className="mt-6 text-center text-xs text-zinc-500">
                NFTs are minted on BSC Testnet. Make sure you have BNB for gas fees.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

