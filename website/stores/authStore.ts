import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Developer {
  id: string;
  email: string;
  externalUserId: number;
  walletAddress: string | null;
  username: string;
  fullName: string;
  avatar: string;
  credits: number;
}

type AuthMethod = "email" | "wallet" | null;

interface AuthState {
  // State
  accessToken: string | null;
  developer: Developer | null;
  authMethod: AuthMethod;
  isAuthenticated: boolean;

  // Actions
  login: (accessToken: string, developer: Developer, method: AuthMethod) => void;
  logout: () => void;
  updateDeveloper: (developer: Partial<Developer>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      accessToken: null,
      developer: null,
      authMethod: null,
      isAuthenticated: false,

      // Login action
      login: (accessToken, developer, method) =>
        set({
          accessToken,
          developer,
          authMethod: method,
          isAuthenticated: true,
        }),

      // Logout action
      logout: () =>
        set({
          accessToken: null,
          developer: null,
          authMethod: null,
          isAuthenticated: false,
        }),

      // Update developer info
      updateDeveloper: (updates) =>
        set((state) => ({
          developer: state.developer
            ? { ...state.developer, ...updates }
            : null,
        })),
    }),
    {
      name: "auth-storage",
      // Only persist these fields
      partialize: (state) => ({
        accessToken: state.accessToken,
        developer: state.developer,
        authMethod: state.authMethod,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
