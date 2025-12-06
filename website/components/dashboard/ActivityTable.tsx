"use client";

import { useState } from "react";
import { clsx } from "clsx";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import type { ActivityEntry } from "@/types/api";

interface ActivityTableProps {
  data?: ActivityEntry[];
  isLoading?: boolean;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onSearch?: (query: string) => void;
}

export function ActivityTable({
  data = [],
  isLoading = false,
  pagination = { total: 0, page: 1, limit: 10, totalPages: 0 },
  onPageChange,
  onLimitChange,
  onSearch,
}: ActivityTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-400" />;
      case "not_found":
        return <AlertCircle className="h-4 w-4 text-yellow-400" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "success":
        return "Success";
      case "error":
        return "Error";
      case "not_found":
        return "Not Found";
      default:
        return status;
    }
  };

  const startIndex = (pagination.page - 1) * pagination.limit + 1;
  const endIndex = Math.min(
    pagination.page * pagination.limit,
    pagination.total
  );

  return (
    <div className="rounded-xl border border-white/10 bg-[#111111]">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-4">
        <h2 className="text-lg font-semibold text-white">Activity</h2>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-3">
        <div className="flex-1" />

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearch}
              className="h-9 w-64 rounded-lg border border-white/10 bg-white/5 pl-9 pr-4 text-sm text-white placeholder-gray-500 focus:border-[#5800C3]/50 focus:outline-none focus:ring-1 focus:ring-[#5800C3]/50"
            />
          </div>

          {/* Filters */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors"
            >
              Filters
              <ChevronDown className="h-4 w-4" />
            </button>

            {isFilterOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsFilterOpen(false)}
                />
                <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-white/10 bg-[#1a1a1a] p-2 shadow-xl">
                  <button className="w-full rounded-md px-3 py-2 text-left text-sm text-gray-300 hover:bg-white/10">
                    All Statuses
                  </button>
                  <button className="w-full rounded-md px-3 py-2 text-left text-sm text-gray-300 hover:bg-white/10">
                    Success Only
                  </button>
                  <button className="w-full rounded-md px-3 py-2 text-left text-sm text-gray-300 hover:bg-white/10">
                    Errors Only
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 text-left text-sm text-gray-400">
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Source</th>
              <th className="px-6 py-3 font-medium">Video Id</th>
              <th className="px-6 py-3 font-medium">Response Time</th>
              <th className="px-6 py-3 font-medium">Credit Consumed</th>
              <th className="px-6 py-3 font-medium">When</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
                    Loading...
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No results
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status)}
                      <span
                        className={clsx(
                          "text-sm",
                          item.status === "success" && "text-green-400",
                          item.status === "error" && "text-red-400",
                          item.status === "not_found" && "text-yellow-400"
                        )}
                      >
                        {getStatusLabel(item.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {item.source}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300 font-mono">
                    {item.videoId}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {item.responseTime}ms
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {item.creditConsumed}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(item.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-white/10 px-6 py-3">
        <div className="text-sm text-gray-400">
          Showing {startIndex}-{endIndex} of {pagination.total}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Rows per page</span>
            <select
              value={pagination.limit}
              onChange={(e) => onLimitChange?.(Number(e.target.value))}
              aria-label="Rows per page"
              className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-sm text-white focus:border-[#5800C3]/50 focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange?.(pagination.page - 1)}
              disabled={pagination.page <= 1}
              aria-label="Previous page"
              className="rounded-md p-1.5 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 text-sm text-gray-400">Previous</span>
            <button
              onClick={() => onPageChange?.(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              aria-label="Next page"
              className="rounded-md p-1.5 text-gray-400 hover:bg-white/10 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
