"use client";

import { useState, useEffect } from "react";
import {
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Gift,
  RefreshCw,
  Calendar,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { creditsApi } from "@/lib/api";
import type { CreditTransaction } from "@/types/api";
import { clsx } from "clsx";

export default function BillingPage() {
  const { accessToken } = useAuthStore();
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });

  useEffect(() => {
    fetchTransactions();
  }, [accessToken, pagination.page]);

  async function fetchTransactions() {
    if (!accessToken) return;

    setIsLoading(true);
    try {
      const response = await creditsApi.getTransactions(accessToken, {
        page: pagination.page,
        limit: pagination.limit,
      });
      setTransactions(response.transactions);
      setPagination(response.pagination);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setIsLoading(false);
    }
  }

  function getTransactionIcon(type: CreditTransaction["type"]) {
    switch (type) {
      case "purchase":
        return <ArrowUpRight className="h-4 w-4 text-green-400" />;
      case "usage":
        return <ArrowDownRight className="h-4 w-4 text-red-400" />;
      case "refund":
        return <RefreshCw className="h-4 w-4 text-blue-400" />;
      case "bonus":
        return <Gift className="h-4 w-4 text-purple-400" />;
      default:
        return <Receipt className="h-4 w-4 text-gray-400" />;
    }
  }

  function getTransactionColor(type: CreditTransaction["type"]) {
    switch (type) {
      case "purchase":
        return "text-green-400";
      case "usage":
        return "text-red-400";
      case "refund":
        return "text-blue-400";
      case "bonus":
        return "text-purple-400";
      default:
        return "text-gray-400";
    }
  }

  function formatAmount(type: CreditTransaction["type"], amount: number) {
    const prefix = type === "usage" ? "-" : "+";
    return `${prefix}${amount}`;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0a0a0a] px-8 py-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Billing</h1>
          <p className="mt-1 text-sm text-gray-400">
            View your credit transaction history
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="p-8">
        {/* Transaction List */}
        <div className="rounded-xl border border-white/10 bg-[#111111]">
          <div className="border-b border-white/10 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">
              Transaction History
            </h2>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
              <Receipt className="h-12 w-12 mb-4 opacity-50" />
              <p className="font-medium">No transactions yet</p>
              <p className="text-sm mt-1">
                Your transaction history will appear here
              </p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-white/10">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={clsx(
                          "flex h-10 w-10 items-center justify-center rounded-lg",
                          transaction.type === "purchase" && "bg-green-500/10",
                          transaction.type === "usage" && "bg-red-500/10",
                          transaction.type === "refund" && "bg-blue-500/10",
                          transaction.type === "bonus" && "bg-purple-500/10"
                        )}
                      >
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <div className="font-medium text-white capitalize">
                          {transaction.type}
                        </div>
                        <div className="text-sm text-gray-400">
                          {transaction.description}
                        </div>
                        {transaction.metadata?.videoId && (
                          <div className="text-xs text-gray-500 font-mono mt-0.5">
                            Video: {transaction.metadata.videoId}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <div
                          className={clsx(
                            "font-semibold",
                            getTransactionColor(transaction.type)
                          )}
                        >
                          {formatAmount(transaction.type, transaction.amount)}{" "}
                          credits
                        </div>
                        <div className="text-sm text-gray-500">
                          Balance: {transaction.balance}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-400 min-w-[140px]">
                        <Calendar className="h-4 w-4" />
                        {new Date(transaction.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-white/10 px-6 py-3">
                  <div className="text-sm text-gray-400">
                    Page {pagination.page} of {pagination.totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setPagination((p) => ({ ...p, page: p.page - 1 }))
                      }
                      disabled={pagination.page <= 1}
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        setPagination((p) => ({ ...p, page: p.page + 1 }))
                      }
                      disabled={pagination.page >= pagination.totalPages}
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
