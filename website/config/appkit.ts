import { bsc } from "@reown/appkit/networks";

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

if (!projectId) {
  console.warn("WalletConnect Project ID is not defined");
}

export const networks = [bsc];

export const metadata = {
  name: "DataAPI",
  description: "The Unified Social Media Data API",
  url: "https://dataapi.io",
  icons: ["https://dataapi.io/icon.png"],
};
