"use client";

import { useState } from "react";
import {
  CreditCard, CheckCircle, Clock, HelpCircle,
  BarChart3, Calendar
} from "lucide-react";

export default function DeveloperDashboard() {
  const [selectedView, setSelectedView] = useState<"daily" | "hourly" | "response">("daily");

  // Mock data
  const stats = {
    credits: 98,
    totalCredits: 100,
    processed: 0,
    errors: 0,
    notFound: 0,
    responseTime: 0,
    p95: 0,
    p99: 0,
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-sm">
          <Calendar className="h-4 w-4 text-zinc-400" />
          <span className="text-zinc-300">Nov 26, 2025 - Dec 2, 2025</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-zinc-500 uppercase tracking-wider flex items-center gap-2">
              Credits
              <HelpCircle className="h-3 w-3" />
            </h3>
            <CreditCard className="h-5 w-5 text-[#C2C4F9]" />
          </div>
          <div className="text-4xl font-bold text-white mb-2">{stats.credits}</div>
          <div className="text-sm text-zinc-400 mb-4">of {stats.totalCredits} remaining</div>
          <button className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors">
            Buy plan →
          </button>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-zinc-500 uppercase tracking-wider flex items-center gap-2">
              Processed
              <HelpCircle className="h-3 w-3" />
            </h3>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-4xl font-bold text-white mb-2">{stats.processed}</div>
          <div className="text-sm text-zinc-400 mb-2">successful requests</div>
          <div className="flex gap-4 text-xs">
            <span className="text-orange-400">⚠ {stats.notFound} not found</span>
            <span className="text-red-400">✕ {stats.errors} errors</span>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-zinc-500 uppercase tracking-wider flex items-center gap-2">
              Response Time
              <HelpCircle className="h-3 w-3" />
            </h3>
            <Clock className="h-5 w-5 text-[#C2C4F9]" />
          </div>
          <div className="text-4xl font-bold text-white mb-2">{stats.responseTime}ms</div>
          <div className="text-sm text-zinc-400">median response time</div>
          <div className="flex gap-4 text-xs mt-2 text-zinc-500">
            <span>95th: {stats.p95}ms</span>
            <span>99th: {stats.p99}ms</span>
          </div>
        </div>
      </div>

      {/* Usage Analytics */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Usage Analytics</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedView("daily")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedView === "daily"
                  ? "bg-[#5800C3] text-white"
                  : "bg-white/5 text-zinc-400 hover:bg-white/10"
              }`}
            >
              Daily (0)
            </button>
            <button
              onClick={() => setSelectedView("hourly")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedView === "hourly"
                  ? "bg-[#5800C3] text-white"
                  : "bg-white/5 text-zinc-400 hover:bg-white/10"
              }`}
            >
              Hourly (0)
            </button>
            <button
              onClick={() => setSelectedView("response")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedView === "response"
                  ? "bg-[#5800C3] text-white"
                  : "bg-white/5 text-zinc-400 hover:bg-white/10"
              }`}
            >
              Response Time
            </button>
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="h-96 flex items-center justify-center border border-white/5 rounded-lg bg-black/40">
          <div className="text-center">
            <BarChart3 className="h-16 w-16 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500 text-lg font-medium">No data available</p>
            <p className="text-zinc-600 text-sm mt-2">Try selecting a different date range</p>
          </div>
        </div>
      </div>
    </div>
  );
}


