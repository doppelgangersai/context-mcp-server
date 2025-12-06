"use client";

import { useState, useCallback } from "react";
import { Contract, keccak256, toUtf8Bytes, JsonRpcProvider } from "ethers";
import {
  DATA_OWNERSHIP_NFT_ADDRESS,
  DATA_OWNERSHIP_NFT_ABI,
  BSC_TESTNET,
} from "@/lib/contracts/DataOwnershipNFT";
import { useWallet } from "@/components/providers/Web3Provider";

interface MintState {
  isLoading: boolean;
  error: string | null;
  txHash: string | null;
  success: boolean;
}

interface MintResult {
  txHash: string;
  tokenId?: string;
}

export function useNFTMint() {
  const { getProvider, isConnected, address: walletAddress, switchToBscTestnet } = useWallet();
  const [state, setState] = useState<MintState>({
    isLoading: false,
    error: null,
    txHash: null,
    success: false,
  });

  const checkUrlRegistered = useCallback(async (targetUrl: string): Promise<boolean> => {
    try {
      // Use public RPC for read-only check
      const provider = new JsonRpcProvider(BSC_TESTNET.rpcUrl);
      const contract = new Contract(
        DATA_OWNERSHIP_NFT_ADDRESS,
        DATA_OWNERSHIP_NFT_ABI,
        provider
      );

      const urlHash = keccak256(toUtf8Bytes(targetUrl));
      const isRegistered = await contract.urlRegistry(urlHash);
      return isRegistered;
    } catch {
      return false;
    }
  }, []);

  const mint = useCallback(async (targetUrl: string): Promise<MintResult | null> => {
    setState({ isLoading: true, error: null, txHash: null, success: false });

    try {
      // Check if wallet is connected
      if (!isConnected) {
        throw new Error("Please connect your wallet first");
      }

      // Check contract address
      if (!DATA_OWNERSHIP_NFT_ADDRESS) {
        throw new Error("NFT contract address not configured");
      }

      // Check if URL already registered
      const isRegistered = await checkUrlRegistered(targetUrl);
      if (isRegistered) {
        throw new Error("This profile has already been minted");
      }

      // Get provider from AppKit
      const provider = await getProvider();
      if (!provider) {
        throw new Error("Could not get wallet provider");
      }

      // Check network - must be BSC Testnet
      const network = await provider.getNetwork();
      if (network.chainId !== BigInt(BSC_TESTNET.chainId)) {
        // Try to switch network automatically
        const switched = await switchToBscTestnet();
        if (!switched) {
          throw new Error(`Wrong network. Please switch to BSC Testnet (Chain ID: ${BSC_TESTNET.chainId}) in your wallet and try again.`);
        }
        // Re-get provider after network switch
        const newProvider = await getProvider();
        if (!newProvider) {
          throw new Error("Could not get provider after network switch");
        }
        // Verify network switched
        const newNetwork = await newProvider.getNetwork();
        if (newNetwork.chainId !== BigInt(BSC_TESTNET.chainId)) {
          throw new Error(`Network switch failed. Please manually switch to BSC Testnet.`);
        }
      }

      // Use wallet address from context
      if (!walletAddress) {
        throw new Error("Wallet address not available");
      }

      // Get signer - don't pass address, let provider use connected account
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // Create contract instance
      const contract = new Contract(
        DATA_OWNERSHIP_NFT_ADDRESS,
        DATA_OWNERSHIP_NFT_ABI,
        signer
      );

      // Call mintOwnership
      const tx = await contract.mintOwnership(address, targetUrl);

      setState(prev => ({ ...prev, txHash: tx.hash }));

      // Wait for confirmation
      const receipt = await tx.wait();

      // Try to get tokenId from logs
      let tokenId: string | undefined;
      if (receipt.logs) {
        for (const log of receipt.logs) {
          try {
            const parsed = contract.interface.parseLog({
              topics: log.topics as string[],
              data: log.data,
            });
            if (parsed?.name === "UrlRegistered") {
              tokenId = parsed.args.tokenId.toString();
              break;
            }
          } catch {
            // Skip unparseable logs
          }
        }
      }

      setState({
        isLoading: false,
        error: null,
        txHash: tx.hash,
        success: true,
      });

      return { txHash: tx.hash, tokenId };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Minting failed";
      setState({
        isLoading: false,
        error: message,
        txHash: null,
        success: false,
      });
      return null;
    }
  }, [checkUrlRegistered, isConnected, getProvider, walletAddress, switchToBscTestnet]);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      txHash: null,
      success: false,
    });
  }, []);

  return {
    ...state,
    mint,
    reset,
    checkUrlRegistered,
  };
}
