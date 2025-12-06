import type {
  ApiKeysResponse,
  RequestApiKeyRequest,
  RequestApiKeyResponse,
  RevokeApiKeyResponse,
  MeResponse,
  CreditsResponse,
  CreditTransactionsResponse,
  DemandLeaderboardResponse,
  DemandDetailResponse,
  HealthResponse,
  DashboardStats,
  ActivityResponse,
  UsageAnalytics,
} from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      errorData.message || `Request failed with status ${response.status}`,
      errorData
    );
  }

  return response.json();
}

// ============ Authentication API ============

export const authApi = {
  // GET /auth/me - Get current developer profile
  getMe: (token: string): Promise<MeResponse> =>
    fetchWithAuth("/auth/me", { method: "GET" }, token),

  // POST /auth/request-key - Request a new API key
  requestApiKey: (
    token: string,
    data: RequestApiKeyRequest
  ): Promise<RequestApiKeyResponse> =>
    fetchWithAuth(
      "/auth/request-key",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      token
    ),

  // GET /auth/api-keys - List all API keys
  getApiKeys: (token: string): Promise<ApiKeysResponse> =>
    fetchWithAuth("/auth/api-keys", { method: "GET" }, token),

  // DELETE /auth/api-keys/{id} - Revoke an API key
  revokeApiKey: (token: string, id: string): Promise<RevokeApiKeyResponse> =>
    fetchWithAuth(`/auth/api-keys/${id}`, { method: "DELETE" }, token),
};

// ============ Credits API ============

export const creditsApi = {
  // GET /credits - Get current credit balance
  getBalance: (token: string): Promise<CreditsResponse> =>
    fetchWithAuth("/credits", { method: "GET" }, token),

  // GET /credits/transactions - Get credit transaction history
  getTransactions: (
    token: string,
    params?: { page?: number; limit?: number }
  ): Promise<CreditTransactionsResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());

    const query = searchParams.toString();
    return fetchWithAuth(
      `/credits/transactions${query ? `?${query}` : ""}`,
      { method: "GET" },
      token
    );
  },
};

// ============ Demand API ============

export const demandApi = {
  // GET /v1/demand - Get demand leaderboard
  getLeaderboard: (params?: {
    limit?: number;
    offset?: number;
  }): Promise<DemandLeaderboardResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.offset) searchParams.set("offset", params.offset.toString());

    const query = searchParams.toString();
    return fetchWithAuth(`/v1/demand${query ? `?${query}` : ""}`, {
      method: "GET",
    });
  },

  // GET /v1/demand/{username} - Get detailed demand for a specific username
  getUserDemand: (username: string): Promise<DemandDetailResponse> =>
    fetchWithAuth(`/v1/demand/${encodeURIComponent(username)}`, {
      method: "GET",
    }),
};

// ============ Health API ============

export const healthApi = {
  // GET /health - Health check endpoint
  check: (): Promise<HealthResponse> =>
    fetchWithAuth("/health", { method: "GET" }),
};

// ============ Dashboard API ============

export const dashboardApi = {
  // Get dashboard stats (aggregated endpoint)
  getStats: (token: string): Promise<DashboardStats> =>
    fetchWithAuth("/dashboard/stats", { method: "GET" }, token),

  // Get activity log
  getActivity: (
    token: string,
    params?: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
    }
  ): Promise<ActivityResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.search) searchParams.set("search", params.search);
    if (params?.status) searchParams.set("status", params.status);

    const query = searchParams.toString();
    return fetchWithAuth(
      `/dashboard/activity${query ? `?${query}` : ""}`,
      { method: "GET" },
      token
    );
  },

  // Get usage analytics
  getAnalytics: (
    token: string,
    params?: {
      startDate?: string;
      endDate?: string;
      interval?: "daily" | "hourly";
    }
  ): Promise<UsageAnalytics> => {
    const searchParams = new URLSearchParams();
    if (params?.startDate) searchParams.set("startDate", params.startDate);
    if (params?.endDate) searchParams.set("endDate", params.endDate);
    if (params?.interval) searchParams.set("interval", params.interval);

    const query = searchParams.toString();
    return fetchWithAuth(
      `/dashboard/analytics${query ? `?${query}` : ""}`,
      { method: "GET" },
      token
    );
  },
};

export { ApiError };
