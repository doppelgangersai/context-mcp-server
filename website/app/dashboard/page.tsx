"use client";

import { useState, useEffect } from "react";
import { CreditCard, CheckCircle } from "lucide-react";
import {
  DateRangePicker,
  StatsCard,
  UsageChart,
  ActivityTable,
} from "@/components/dashboard";
import { useAuthStore } from "@/stores/authStore";
import { dashboardApi, creditsApi } from "@/lib/api";
import type {
  ActivityEntry,
  UsageAnalytics,
  CreditsResponse,
} from "@/types/api";

export default function DashboardPage() {
  const { accessToken, developer } = useAuthStore();
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  });

  const [credits, setCredits] = useState<CreditsResponse | null>(null);
  const [analytics, setAnalytics] = useState<UsageAnalytics | null>(null);
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!accessToken) return;

      setIsLoading(true);
      try {
        // Fetch credits from user profile or credits endpoint
        const creditsData = await creditsApi.getBalance(accessToken);
        setCredits(creditsData);

        // Fetch analytics
        try {
          const analyticsData = await dashboardApi.getAnalytics(accessToken, {
            startDate: dateRange.startDate.toISOString().split("T")[0],
            endDate: dateRange.endDate.toISOString().split("T")[0],
          });
          setAnalytics(analyticsData);
        } catch {
          console.log("Analytics not available");
        }

        // Fetch activity
        try {
          const activityData = await dashboardApi.getActivity(accessToken, {
            page: pagination.page,
            limit: pagination.limit,
          });
          setActivities(activityData.activities);
          setPagination(activityData.pagination);
        } catch {
          console.log("Activity not available");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [accessToken, dateRange, pagination.page, pagination.limit]);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0a0a0a] px-8 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>
      </header>

      {/* Content */}
      <div className="p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Credits Card */}
          <StatsCard
            icon={<CreditCard className="h-5 w-5" />}
            title="Credits"
            value={developer?.credits ?? credits?.balance ?? 100}
            subtitle={`of ${credits?.totalPurchased ?? 100} remaining`}
            variant="default"
            action={{
              label: "Buy plan",
              href: "/dashboard/top-up",
            }}
          />

          {/* Processed Card */}
          <StatsCard
            icon={<CheckCircle className="h-5 w-5" />}
            title="Processed"
            value={credits?.totalUsed ?? '-'}
            subtitle="successful requests"
            variant="success"
          />
        </div>

        {/* Usage Analytics Chart */}
        <div className="mb-8">
          <UsageChart
            data={
              analytics
                ? {
                  daily: analytics.daily,
                  hourly: analytics.hourly,
                  responseTime: analytics.responseTime,
                }
                : undefined
            }
          />
        </div>

        {/* Activity Table */}
        <ActivityTable
          data={activities}
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={(page) =>
            setPagination((prev) => ({ ...prev, page }))
          }
          onLimitChange={(limit) =>
            setPagination((prev) => ({ ...prev, limit, page: 1 }))
          }
        />
      </div>
    </div>
  );
}
