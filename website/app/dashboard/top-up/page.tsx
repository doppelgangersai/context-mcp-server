"use client";

import { useState } from "react";
import { CreditCard, Check, Zap, Star, Crown, LucideIcon } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import clsx from "clsx";

interface PricingPlan {
  id: string;
  name: string;
  credits: number;
  price: number;
  pricePerCredit: number;
  popular?: boolean;
  icon: LucideIcon;
}

const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    credits: 100,
    price: 0.01,
    pricePerCredit: 0.1,
    icon: Zap,
  },
  {
    id: "pro",
    name: "Pro",
    credits: 500,
    price: 0.1,
    pricePerCredit: 0.08,
    popular: true,
    icon: Star,
  },
  {
    id: "business",
    name: "Business",
    credits: 2000,
    price: 0.2,
    pricePerCredit: 0.06,
    icon: Crown,
  },
];

export default function TopUpPage() {
  const { developer } = useAuthStore();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  async function handlePurchase() {
    if (!selectedPlan) return;

    setIsProcessing(true);
    try {
      // Here you would integrate with your payment provider (Stripe, etc.)
      // For now, just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert("Payment integration coming soon!");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0a0a0a] px-8 py-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Top-up Credits</h1>
          <p className="mt-1 text-sm text-gray-400">
            Purchase credits to use the API
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="p-8">
        {/* Current Balance */}
        <div className="mb-8 rounded-xl border border-white/10 bg-[#111111] p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#5800C3]/10">
              <CreditCard className="h-6 w-6 text-[#8B5CF6]" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Current Balance</div>
              <div className="text-2xl font-bold text-white">
                {developer?.credits ?? 0} credits
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
          {pricingPlans.map((plan) => {
            const Icon = plan.icon;
            const isSelected = selectedPlan === plan.id;

            return (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={clsx(
                  "relative rounded-xl border p-6 text-left transition-all",
                  isSelected
                    ? "border-[#5800C3] bg-[#5800C3]/10"
                    : "border-white/10 bg-[#111111] hover:border-white/20"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#5800C3] px-3 py-1 text-xs font-medium text-white">
                    Most Popular
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div
                    className={clsx(
                      "flex h-10 w-10 items-center justify-center rounded-lg",
                      isSelected ? "bg-[#5800C3]/20" : "bg-white/5"
                    )}
                  >
                    <Icon
                      className={clsx(
                        "h-5 w-5",
                        isSelected ? "text-[#8B5CF6]" : "text-gray-400"
                      )}
                    />
                  </div>
                  {isSelected && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#5800C3]">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-white">
                    {plan.name}
                  </h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white">
                      BNB{plan.price}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-400">
                    {plan.credits.toLocaleString()} credits
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="text-sm text-gray-400">
                    BNB{plan.pricePerCredit.toFixed(2)} per credit
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom Amount */}
        <div className="rounded-xl border border-white/10 bg-[#111111] p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">
            Need more credits?
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Contact us for enterprise pricing and custom credit packages.
          </p>
          <a
            href="/dashboard/contact"
            className="inline-flex items-center text-sm font-medium text-[#8B5CF6] hover:text-[#A78BFA] transition-colors"
          >
            Contact Sales →
          </a>
        </div>

        {/* Purchase Button */}
        <div className="flex justify-end">
          <button
            onClick={handlePurchase}
            disabled={!selectedPlan || isProcessing}
            className="rounded-lg bg-[#5800C3] px-8 py-3 text-sm font-medium text-white hover:bg-[#6B00E8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing
              ? "Processing..."
              : selectedPlan
                ? `Purchase ${pricingPlans.find((p) => p.id === selectedPlan)?.credits.toLocaleString()} Credits`
                : "Select a Plan"}
          </button>
        </div>
      </div>
    </div>
  );
}
