// DataOwnershipNFT Contract Configuration
// Contract: DataOwnershipKey (DOK) - ERC721

export const DATA_OWNERSHIP_NFT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || "";

// ABI for DataOwnershipNFT contract (ERC721URIStorage)
export const DATA_OWNERSHIP_NFT_ABI = [
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "targetUrl", type: "string" },
    ],
    name: "mintOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "", type: "bytes32" }],
    name: "urlRegistry",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "tokenId", type: "uint256" },
      { indexed: true, name: "owner", type: "address" },
      { indexed: false, name: "url", type: "string" },
    ],
    name: "UrlRegistered",
    type: "event",
  },
] as const;

// BSC Testnet configuration
// Using public RPC that supports CORS
export const BSC_TESTNET = {
  chainId: 97,
  name: "BSC Testnet",
  rpcUrl: "https://bsc-testnet-rpc.publicnode.com",
  // Alternative RPC URLs that support CORS:
  // "https://bsc-testnet.public.blastapi.io"
  // "https://endpoints.omniatech.io/v1/bsc/testnet/public"
  blockExplorer: "https://testnet.bscscan.com",
  nativeCurrency: {
    name: "BNB",
    symbol: "tBNB",
    decimals: 18,
  },
};

// BSC Mainnet configuration
export const BSC_MAINNET = {
  chainId: 56,
  name: "BSC Mainnet",
  rpcUrl: "https://bsc-dataseed.binance.org",
  blockExplorer: "https://bscscan.com",
  nativeCurrency: {
    name: "BNB",
    symbol: "BNB",
    decimals: 18,
  },
};
