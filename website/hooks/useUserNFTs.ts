"use client";

import { useState, useEffect, useCallback } from "react";
import { Contract, JsonRpcProvider } from "ethers";
import {
  DATA_OWNERSHIP_NFT_ADDRESS,
  DATA_OWNERSHIP_NFT_ABI,
  BSC_TESTNET,
} from "@/lib/contracts/DataOwnershipNFT";
import { useWallet } from "@/components/providers/Web3Provider";

// Platform types supported by the system
export type Platform = "twitter" | "youtube" | "linkedin" | "instagram" | "tiktok" | "unknown";

// Platform URL patterns for detection
const PLATFORM_PATTERNS: { platform: Platform; patterns: RegExp[] }[] = [
  {
    platform: "twitter",
    patterns: [
      /^https?:\/\/(www\.)?(twitter\.com|x\.com)\//i,
      /^https?:\/\/(mobile\.)?twitter\.com\//i,
    ],
  },
  {
    platform: "youtube",
    patterns: [
      /^https?:\/\/(www\.)?youtube\.com\//i,
      /^https?:\/\/youtu\.be\//i,
      /^https?:\/\/(www\.)?youtube\.com\/@/i,
    ],
  },
  {
    platform: "linkedin",
    patterns: [
      /^https?:\/\/(www\.)?linkedin\.com\//i,
    ],
  },
  {
    platform: "instagram",
    patterns: [
      /^https?:\/\/(www\.)?instagram\.com\//i,
    ],
  },
  {
    platform: "tiktok",
    patterns: [
      /^https?:\/\/(www\.)?tiktok\.com\//i,
      /^https?:\/\/vm\.tiktok\.com\//i,
    ],
  },
];

// Platform display names
export const PLATFORM_NAMES: Record<Platform, string> = {
  twitter: "Twitter",
  youtube: "Youtube",
  linkedin: "Linkedin",
  instagram: "Instagram",
  tiktok: "TikTok",
  unknown: "Unknown",
};

// Extract platform from URL
export function getPlatformFromUrl(url: string): Platform {
  for (const { platform, patterns } of PLATFORM_PATTERNS) {
    for (const pattern of patterns) {
      if (pattern.test(url)) {
        return platform;
      }
    }
  }
  return "unknown";
}

// Extract username from URL
export function getUsernameFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    // Remove leading slash and split by remaining slashes
    const parts = pathname.replace(/^\//, "").split("/");

    // Handle different platform URL formats
    const platform = getPlatformFromUrl(url);

    switch (platform) {
      case "twitter":
        // twitter.com/username or x.com/username
        return parts[0]?.replace("@", "") || "";
      case "youtube":
        // youtube.com/@username or youtube.com/channel/... or youtube.com/c/...
        if (parts[0]?.startsWith("@")) {
          return parts[0].replace("@", "");
        }
        if (parts[0] === "channel" || parts[0] === "c" || parts[0] === "user") {
          return parts[1] || "";
        }
        return parts[0] || "";
      case "linkedin":
        // linkedin.com/in/username
        if (parts[0] === "in" || parts[0] === "company") {
          return parts[1] || "";
        }
        return parts[0] || "";
      case "instagram":
        // instagram.com/username
        return parts[0] || "";
      case "tiktok":
        // tiktok.com/@username
        return parts[0]?.replace("@", "") || "";
      default:
        return parts[0] || url;
    }
  } catch {
    return url;
  }
}

// NFT data structure
export interface UserNFT {
  tokenId: string;
  url: string;
  platform: Platform;
  username: string;
}

interface UseUserNFTsState {
  nfts: UserNFT[];
  isLoading: boolean;
  error: string | null;
  nftCount: number;
}

export function useUserNFTs() {
  const { isConnected, address } = useWallet();
  const [state, setState] = useState<UseUserNFTsState>({
    nfts: [],
    isLoading: false,
    error: null,
    nftCount: 0,
  });
  const [hasFetched, setHasFetched] = useState(false);

  const fetchNFTs = useCallback(async () => {
    if (!isConnected || !address || !DATA_OWNERSHIP_NFT_ADDRESS) {
      setState({ nfts: [], isLoading: false, error: null, nftCount: 0 });
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Use public RPC for read-only operations
      const provider = new JsonRpcProvider(BSC_TESTNET.rpcUrl);
      const contract = new Contract(
        DATA_OWNERSHIP_NFT_ADDRESS,
        DATA_OWNERSHIP_NFT_ABI,
        provider
      );

      // Get user's NFT balance
      const balance = await contract.balanceOf(address);
      const nftCount = Number(balance);

      if (nftCount === 0) {
        setState({ nfts: [], isLoading: false, error: null, nftCount: 0 });
        return;
      }

      // Since we don't have ERC721Enumerable and event history is pruned,
      // we iterate through token IDs (0, 1, 2, ...) and check ownership
      // This works because contract uses sequential token IDs starting from 0
      const nfts: UserNFT[] = [];
      let tokenId = 0;
      const maxTokensToCheck = 100; // Safety limit

      while (nfts.length < nftCount && tokenId < maxTokensToCheck) {
        try {
          const owner = await contract.ownerOf(tokenId);

          if (owner.toLowerCase() === address.toLowerCase()) {
            // Found an NFT owned by user, get its URI
            const url = await contract.tokenURI(tokenId);

            const platform = getPlatformFromUrl(url);
            const username = getUsernameFromUrl(url);

            nfts.push({
              tokenId: tokenId.toString(),
              url,
              platform,
              username,
            });
          }
        } catch {
          // Token doesn't exist or other error - skip
        }
        tokenId++;
      }

      setState({
        nfts,
        isLoading: false,
        error: null,
        nftCount: nfts.length,
      });
    } catch (err) {
      console.error("Error fetching user NFTs:", err);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to fetch NFTs",
      }));
    }
  }, [isConnected, address]);

  // Fetch NFTs when wallet connects or address changes
  useEffect(() => {
    // Only fetch if connected and haven't fetched for this address yet
    if (isConnected && address && !hasFetched) {
      setHasFetched(true);
      fetchNFTs();
    }
    // Reset hasFetched when address changes
    if (!isConnected || !address) {
      setHasFetched(false);
    }
  }, [isConnected, address, hasFetched, fetchNFTs]);

  // Manual refetch resets the flag
  const refetch = useCallback(() => {
    setHasFetched(false);
    return fetchNFTs();
  }, [fetchNFTs]);

  return {
    ...state,
    refetch,
  };
}
