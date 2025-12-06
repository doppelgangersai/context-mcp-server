"use client";

import { useState, useEffect } from "react";
import { Wallet, ChevronUp, ChevronDown, ExternalLink, Copy, Check } from "lucide-react";
import { formatEther, Contract } from "ethers";
import { clsx } from "clsx";
import {
  DATA_OWNERSHIP_NFT_ADDRESS,
  DATA_OWNERSHIP_NFT_ABI,
  BSC_TESTNET,
} from "@/lib/contracts/DataOwnershipNFT";
import { useWallet } from "@/components/providers/Web3Provider";

interface WalletPanelProps {
  isCollapsed: boolean;
}

export function WalletPanel({ isCollapsed }: WalletPanelProps) {
  const { isReady, openModal, address, isConnected, getProvider } = useWallet();
  const [isExpanded, setIsExpanded] = useState(false);
  const [balance, setBalance] = useState<string | null>(null);
  const [nftCount, setNftCount] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  // Fetch balance and NFT count
  useEffect(() => {
    if (!isConnected || !address) {
      setBalance(null);
      setNftCount(0);
      return;
    }

    const fetchData = async () => {
      try {
        const provider = await getProvider();
        if (!provider) return;

        // Get BNB balance
        const bal = await provider.getBalance(address);
        setBalance(formatEther(bal));

        // Get NFT count if contract is configured
        if (DATA_OWNERSHIP_NFT_ADDRESS) {
          const contract = new Contract(
            DATA_OWNERSHIP_NFT_ADDRESS,
            DATA_OWNERSHIP_NFT_ABI,
            provider
          );
          const count = await contract.balanceOf(address);
          setNftCount(Number(count));
        }
      } catch (err) {
        console.error("Error fetching wallet data:", err);
        setBalance(null);
        setNftCount(0);
      }
    };

    fetchData();
  }, [isConnected, address, getProvider]);

  const copyAddress = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const truncateAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  // Not ready yet
  if (!isReady) {
    return (
      <div className={clsx(
        "flex items-center justify-center rounded-lg bg-white/5 text-gray-500",
        isCollapsed ? "p-2" : "px-3 py-2.5"
      )}>
        <Wallet className="h-5 w-5 animate-pulse" />
        {!isCollapsed && <span className="ml-3 text-sm">Loading...</span>}
      </div>
    );
  }

  // Collapsed view - just icon
  if (isCollapsed) {
    return (
      <button
        type="button"
        onClick={() => isConnected ? setIsExpanded(!isExpanded) : openModal()}
        aria-label={isConnected ? "Wallet connected" : "Connect wallet"}
        className={clsx(
          "flex items-center justify-center w-full p-2 rounded-lg transition-colors",
          isConnected
            ? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
            : "bg-white/5 text-gray-400 hover:bg-white/10"
        )}
      >
        <Wallet className="h-5 w-5" />
      </button>
    );
  }

  // Not connected
  if (!isConnected) {
    return (
      <button
        type="button"
        onClick={openModal}
        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg bg-gradient-to-r from-[#5800C3] to-[#8B5CF6] text-white text-sm font-medium hover:from-[#6b00e6] hover:to-[#9d6eff] transition-colors"
      >
        <Wallet className="h-5 w-5 shrink-0" />
        Connect Wallet
      </button>
    );
  }

  // Connected - expandable panel
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 overflow-hidden">
      {/* Header - always visible */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full px-3 py-2.5 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-2 w-2 rounded-full bg-green-400 shrink-0" />
          <span className="text-sm text-white truncate">
            {truncateAddress(address!)}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-gray-400 shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
        )}
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-3 pb-3 space-y-3 border-t border-white/10">
          {/* Balance */}
          <div className="pt-3">
            <div className="text-xs text-gray-500 mb-1">Balance</div>
            <div className="text-lg font-semibold text-white">
              {balance ? `${parseFloat(balance).toFixed(4)} BNB` : "..."}
            </div>
          </div>

          {/* NFT Count */}
          <div>
            <div className="text-xs text-gray-500 mb-1">Data NFTs</div>
            <div className="text-lg font-semibold text-white">
              {nftCount} DOK
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={copyAddress}
              className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg border border-white/10 text-xs text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  Copy
                </>
              )}
            </button>
            <a
              href={`${BSC_TESTNET.blockExplorer}/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg border border-white/10 text-xs text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              Explorer
            </a>
          </div>

          {/* Manage Wallet */}
          <button
            type="button"
            onClick={openModal}
            className="w-full px-3 py-2 rounded-lg border border-white/10 text-xs text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            Manage Wallet
          </button>
        </div>
      )}
    </div>
  );
}
