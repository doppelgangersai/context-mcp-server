// API Types based on endpoint documentation

// ============ Authentication ============

// POST /auth/request-key - Request a new API key
export interface RequestApiKeyRequest {
  email: string;
  name: string;
}

export interface ApiKey {
  id: string;
  key?: string;
  keyPrefix: string;
  name: string | null;
  description?: string;
  createdAt: string;
  lastUsedAt: string | null;
  isActive: boolean;
}

export interface RequestApiKeyResponse {
  message: string;
  apiKey: string;
  keyPrefix: string;
  credits: number;
  emailSent: boolean;
}

// GET /auth/api-keys - List all API keys
export interface ApiKeysResponse {
  keys: ApiKey[];
}

// DELETE /auth/api-keys/{id} - Revoke an API key
export interface RevokeApiKeyResponse {
  success: boolean;
  message: string;
}

// GET /auth/me - Get current developer profile
export interface Developer {
  id: string;
  email: string;
  externalUserId: number;
  walletAddress: string | null;
  username: string;
  fullName: string;
  avatar: string;
  credits: number;
  createdAt: string;
  updatedAt: string;
}

export interface MeResponse {
  developer: Developer;
}

// ============ Credits ============

// GET /credits - Get current credit balance
export interface CreditsResponse {
  balance: number;
  totalUsed: number;
  totalPurchased: number;
}

// GET /credits/transactions - Get credit transaction history
export interface CreditTransaction {
  id: string;
  type: "purchase" | "usage" | "refund" | "bonus";
  amount: number;
  balance: number;
  description: string;
  createdAt: string;
  metadata?: {
    videoId?: string;
    source?: string;
    responseTime?: number;
  };
}

export interface CreditTransactionsResponse {
  transactions: CreditTransaction[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ============ Demand ============

// GET /v1/demand - Get demand leaderboard
export interface DemandEntry {
  rank: number;
  username: string;
  platform: string;
  totalRequests: number;
  uniqueRequesters: number;
  daysWithRequests: number;
  lastRequested: string;
  firstRequested: string;
  estimatedMonthlyRevenue: string;
  mintUrl: string;
}

export interface DemandLeaderboardResponse {
  leaderboard: DemandEntry[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// GET /v1/demand/{username} - Get detailed demand for a specific username
export interface DemandDetailResponse {
  username: string;
  platform: string;
  totalRequests: number;
  uniqueRequesters: number;
  daysWithRequests: number;
  lastRequested: string;
  firstRequested: string;
  estimatedMonthlyRevenue: string;
  mintUrl: string;
  history?: {
    date: string;
    requests: number;
  }[];
}

// ============ Health ============

// GET /health - Health check endpoint
export interface HealthResponse {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  version: string;
  services: {
    database: "up" | "down";
    cache: "up" | "down";
    queue: "up" | "down";
  };
}

// ============ Usage Analytics (from dashboard screenshot) ============

export interface UsageAnalytics {
  daily: UsageDataPoint[];
  hourly: UsageDataPoint[];
  responseTime: ResponseTimeDataPoint[];
}

export interface UsageDataPoint {
  date: string;
  requests: number;
  errors: number;
  notFound: number;
}

export interface ResponseTimeDataPoint {
  date: string;
  median: number;
  p95: number;
  p99: number;
}

// ============ Activity Log (from dashboard screenshot) ============

export interface ActivityEntry {
  id: string;
  status: "success" | "error" | "not_found";
  source: string;
  videoId: string;
  responseTime: number;
  creditConsumed: number;
  timestamp: string;
}

export interface ActivityResponse {
  activities: ActivityEntry[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ============ Dashboard Stats ============

export interface DashboardStats {
  credits: {
    remaining: number;
    total: number;
  };
  processed: {
    successful: number;
    notFound: number;
    errors: number;
  };
  responseTime: {
    median: number;
    p95: number;
    p99: number;
  };
}
