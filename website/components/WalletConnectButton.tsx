"use client";

import { useAppKit, useAppKitAccount, useDisconnect, useAppKitProvider } from "@reown/appkit/react";
import { Wallet, Loader2, CheckCircle, LogOut, AlertCircle } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppKitReady } from "@/components/providers/Web3Provider";
import { useAuthStore } from "@/stores/authStore";
import { BrowserProvider } from "ethers";
import type { Eip1193Provider } from "ethers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface ChallengeResponse {
  message: string;
  expiresAt: string;
}

interface VerifyResponse {
  accessToken: string;
  developer: {
    id: string;
    email: string;
    externalUserId: number;
    walletAddress: string;
    username: string;
    fullName: string;
    avatar: string;
    credits: number;
  };
  isNewUser: boolean;
}

interface WalletConnectButtonProps {
  onSuccess?: (address: string) => void;
  redirectOnConnect?: boolean;
}

export function WalletConnectButton({
  onSuccess,
  redirectOnConnect = true
}: WalletConnectButtonProps) {
  const { isReady } = useAppKitReady();

  // Show loading state until AppKit is initialized
  if (!isReady) {
    return (
      <button
        type="button"
        disabled
        className="h-12 w-full rounded-lg bg-white/5 border border-white/10 font-semibold text-white opacity-50 flex items-center justify-center gap-3"
      >
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading Wallet...
      </button>
    );
  }

  return (
    <WalletConnectButtonInner
      onSuccess={onSuccess}
      redirectOnConnect={redirectOnConnect}
    />
  );
}

// Inner component that uses AppKit hooks - only rendered after AppKit is initialized
function WalletConnectButtonInner({
  onSuccess,
  redirectOnConnect = true
}: WalletConnectButtonProps) {
  const router = useRouter();
  const { open } = useAppKit();
  const { address, isConnected, status } = useAppKitAccount();
  const { disconnect } = useDisconnect();
  const { walletProvider } = useAppKitProvider<Eip1193Provider>("eip155");

  const { login, logout, isAuthenticated } = useAuthStore();

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [hasAttemptedAuth, setHasAttemptedAuth] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isConnecting = status === "connecting";

  // Clear WalletConnect/AppKit localStorage keys
  const clearWalletStorage = useCallback(() => {
    if (typeof window !== "undefined") {
      const keysToRemove = Object.keys(localStorage).filter(
        (key) =>
          key.startsWith("wc@") ||
          key.startsWith("W3M") ||
          key.startsWith("@w3m") ||
          key.includes("walletconnect") ||
          key.includes("wagmi")
      );
      keysToRemove.forEach((key) => localStorage.removeItem(key));
    }
  }, []);

  // Authenticate with backend after wallet connection
  const authenticateWithBackend = useCallback(async (walletAddress: string) => {
    if (!walletProvider) {
      setError("Wallet provider not available");
      return;
    }

    setIsAuthenticating(true);
    setError(null);

    try {
      // Step 1: Request challenge from backend
      const challengeResponse = await fetch(`${API_BASE_URL}/auth/login/wallet/challenge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: walletAddress }),
      });

      if (!challengeResponse.ok) {
        const errorData = await challengeResponse.json();
        throw new Error(errorData.message || "Failed to get challenge");
      }

      const challengeData: ChallengeResponse = await challengeResponse.json();

      // Step 2: Sign the message with wallet
      const provider = new BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(challengeData.message);

      // Step 3: Verify signature with backend
      const verifyResponse = await fetch(`${API_BASE_URL}/auth/login/wallet/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: walletAddress,
          message: challengeData.message,
          signature,
        }),
      });

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        throw new Error(errorData.message || "Failed to verify signature");
      }

      const verifyData: VerifyResponse = await verifyResponse.json();

      // Store in auth store
      login(verifyData.accessToken, verifyData.developer, "wallet");
      onSuccess?.(walletAddress);

      // Redirect to dashboard
      if (redirectOnConnect) {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Authentication error:", err);

      // Handle user rejection of signature
      if (err instanceof Error && err.message.includes("user rejected")) {
        setError("Signature rejected. Please sign the message to authenticate.");
      } else {
        setError(err instanceof Error ? err.message : "Authentication failed");
      }

      // Disconnect wallet and clear WalletConnect storage on auth failure
      try {
        await disconnect();
      } catch (disconnectErr) {
        console.error("Disconnect error:", disconnectErr);
      }
      clearWalletStorage();
    } finally {
      setIsAuthenticating(false);
    }
  }, [walletProvider, onSuccess, redirectOnConnect, router, disconnect, login, clearWalletStorage]);

  // Trigger authentication when wallet connects (only if user initiated connection)
  useEffect(() => {
    if (isConnected && address && walletProvider && !isAuthenticated && !isAuthenticating && hasAttemptedAuth) {
      authenticateWithBackend(address);
    }
  }, [isConnected, address, walletProvider, isAuthenticated, isAuthenticating, hasAttemptedAuth, authenticateWithBackend]);

  const handleClick = () => {
    setError(null);
    setHasAttemptedAuth(true);
    open();
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (err) {
      console.error("Disconnect error:", err);
    }
    clearWalletStorage();
    logout();
    setError(null);
    setHasAttemptedAuth(false);
  };

  // Show error state
  if (error) {
    return (
      <div className="space-y-2">
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
        <button
          type="button"
          onClick={handleClick}
          className="h-12 w-full rounded-lg bg-white/5 border border-white/10 font-semibold text-white transition-all hover:bg-white/10 hover:border-[#5800C3]/50 flex items-center justify-center gap-3"
        >
          <Wallet className="h-5 w-5" />
          Try Again
        </button>
      </div>
    );
  }

  // Show authenticating state (only if user initiated connection)
  if (isConnected && hasAttemptedAuth && (isAuthenticating || !isAuthenticated)) {
    return (
      <button
        type="button"
        disabled
        className="h-12 w-full rounded-lg bg-white/5 border border-white/10 font-semibold text-white opacity-50 flex items-center justify-center gap-3"
      >
        <Loader2 className="h-5 w-5 animate-spin" />
        {isAuthenticating ? "Sign message in wallet..." : "Authenticating..."}
      </button>
    );
  }

  // Show connected state
  if (isConnected && address && isAuthenticated) {
    return (
      <div className="flex gap-2">
        <button
          type="button"
          disabled
          className="h-12 flex-1 rounded-lg bg-green-500/10 border border-green-500/30 font-semibold text-green-400 flex items-center justify-center gap-2 text-sm"
        >
          <CheckCircle className="h-4 w-4" />
          {address.slice(0, 6)}...{address.slice(-4)}
        </button>
        <button
          type="button"
          onClick={handleDisconnect}
          className="h-12 px-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 transition-all hover:bg-red-500/20 flex items-center justify-center"
          title="Disconnect wallet"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    );
  }

  // Show connect button
  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isConnecting}
      className="h-12 w-full rounded-lg bg-white/5 border border-white/10 font-semibold text-white transition-all hover:bg-white/10 hover:border-[#5800C3]/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
    >
      {isConnecting ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="h-5 w-5" />
          Connect Wallet
        </>
      )}
    </button>
  );
}
