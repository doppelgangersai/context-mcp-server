"use client";

import { HelpCircle } from "lucide-react";
import type { ReactNode } from "react";

interface StatsCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  details?: ReactNode;
  variant?: "default" | "success" | "warning" | "error";
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function StatsCard({
  icon,
  title,
  value,
  subtitle,
  details,
  variant = "default",
  action,
}: StatsCardProps) {
  const iconColors = {
    default: "text-blue-400",
    success: "text-green-400",
    warning: "text-yellow-400",
    error: "text-red-400",
  };

  return (
    <div className="rounded-xl border border-white/10 bg-[#111111] p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 text-gray-400">
          <span className={iconColors[variant]}>{icon}</span>
          <span className="text-sm font-medium">{title}</span>
        </div>
        <button
          className="text-gray-500 hover:text-gray-400 transition-colors"
          aria-label="Help information"
        >
          <HelpCircle className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3">
        <div className="text-3xl font-bold text-white">{value}</div>
        {subtitle && (
          <div className="mt-1 text-sm text-gray-400">{subtitle}</div>
        )}
      </div>

      {details && <div className="mt-3 text-sm text-gray-500">{details}</div>}

      {action && (
        <div className="mt-4">
          {action.href ? (
            <a
              href={action.href}
              className="text-sm font-medium text-[#8B5CF6] hover:text-[#A78BFA] transition-colors"
            >
              {action.label} →
            </a>
          ) : (
            <button
              onClick={action.onClick}
              className="text-sm font-medium text-[#8B5CF6] hover:text-[#A78BFA] transition-colors"
            >
              {action.label} →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
