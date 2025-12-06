"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { BarChart3 } from "lucide-react";

type TabType = "daily" | "hourly" | "responseTime";

interface UsageChartProps {
  data?: {
    daily: { date: string; requests: number }[];
    hourly: { date: string; requests: number }[];
    responseTime: { date: string; median: number }[];
  };
}

export function UsageChart({ data }: UsageChartProps) {
  const [activeTab, setActiveTab] = useState<TabType>("daily");

  const tabs: { id: TabType; label: string; count?: number }[] = [
    { id: "daily", label: "Daily", count: data?.daily?.length || 0 },
    { id: "hourly", label: "Hourly", count: data?.hourly?.length || 0 },
    { id: "responseTime", label: "Response Time" },
  ];

  const hasData =
    (activeTab === "daily" && data?.daily && data.daily.length > 0) ||
    (activeTab === "hourly" && data?.hourly && data.hourly.length > 0) ||
    (activeTab === "responseTime" &&
      data?.responseTime &&
      data.responseTime.length > 0);

  return (
    <div className="rounded-xl border border-white/10 bg-[#111111]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <h2 className="text-lg font-semibold text-white">Usage Analytics</h2>

        {/* Tabs */}
        <div className="flex gap-1 rounded-lg bg-white/5 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:text-white"
              )}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-1.5 text-xs text-gray-500">
                  ({tab.count})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chart area */}
      <div className="p-6">
        {hasData ? (
          <div className="h-64">
            {/* Chart placeholder - integrate with recharts or chart.js */}
            <div className="flex h-full items-end gap-1">
              {activeTab === "daily" &&
                data?.daily?.map((item, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-gradient-to-t from-[#5800C3] to-[#8B5CF6] rounded-t opacity-80 hover:opacity-100 transition-opacity"
                    style={{
                      height: `${Math.min(
                        100,
                        (item.requests /
                          Math.max(...data.daily.map((d) => d.requests))) *
                          100
                      )}%`,
                    }}
                    title={`${item.date}: ${item.requests} requests`}
                  />
                ))}
            </div>
          </div>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center text-gray-500">
            <BarChart3 className="h-12 w-12 mb-3 opacity-50" />
            <p className="font-medium">No data available</p>
            <p className="text-sm">Try selecting a different date range</p>
          </div>
        )}
      </div>
    </div>
  );
}
