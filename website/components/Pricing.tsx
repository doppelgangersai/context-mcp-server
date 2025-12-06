"use client";

import { Check, HelpCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Point costs for different actions
const POINT_COSTS = [
  { action: "Twitter/X Post", cost: 10, unit: "per post" },
  { action: "Instagram Post", cost: 10, unit: "per post" },
  { action: "LinkedIn Post", cost: 10, unit: "per post" },
  { action: "TikTok Video", cost: 50, unit: "per video (includes transcript)" },
  { action: "YouTube Video", cost: 50, unit: "per video (includes transcript)" },
  { action: "Vector Embeddings", cost: 2, unit: "per item" },
  { action: "AI Contextualization", cost: 2, unit: "per item" },
];

const PLANS = [
  {
    name: "Starter",
    price: 5,
    period: "/mo",
    points: 5000,
    features: [
      "5,000 points / month",
      "Access to all platforms",
      "Standard support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: 20,
    period: "/mo",
    points: 20000,
    features: [
      "20,000 points / month",
      "Rollover unused points",
      "Priority support",
    ],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: null,
    period: "",
    points: "Custom",
    features: [
      "Custom points volume",
      "Custom datasources",
      "Dedicated support channel",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export function Pricing() {
  const [isAnnual] = useState(false);

  return (
    <section id="pricing" className="py-24 bg-zinc-900/50 border-t border-white/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Simple, Points-Based Pricing
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Pay only for the data you process. No hidden fees.
          </p>
        </div>

        {/* Points System Table */}
        <div className="mx-auto max-w-3xl mb-24 rounded-xl border border-white/10 bg-black/40 overflow-hidden">
          <div className="p-6 border-b border-white/10 bg-white/5">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              How Points Work
              <HelpCircle className="h-4 w-4 text-zinc-500" />
            </h3>
            <p className="text-sm text-zinc-400 mt-1">
              Every action consumes a specific number of points.
            </p>
          </div>
          <div className="divide-y divide-white/5">
            {POINT_COSTS.map((item) => (
              <div key={item.action} className="flex justify-between items-center p-4 hover:bg-white/5 transition-colors">
                <span className="text-zinc-300 font-medium">{item.action}</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold bg-[#5800C3]/20 border border-[#5800C3]/30 px-2 py-0.5 rounded text-sm">
                    {item.cost} pts
                  </span>
                  <span className="text-xs text-zinc-500">{item.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-3 lg:gap-12">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative rounded-2xl border p-8 shadow-xl flex flex-col",
                plan.popular
                  ? "bg-white/5 border-[#5800C3]/50 ring-1 ring-[#5800C3]/50"
                  : "bg-black/40 border-white/10"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-primary px-4 py-1 text-sm font-medium text-white shadow-lg">
                  Most Popular
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                <div className="mt-4 flex items-baseline text-white">
                  {plan.price !== null ? (
                    <>
                      <span className="text-4xl font-bold tracking-tight">
                        ${isAnnual ? Math.floor(plan.price * 0.8) : plan.price}
                      </span>
                      <span className="ml-1 text-xl text-zinc-500">{plan.period}</span>
                    </>
                  ) : (
                    <span className="text-4xl font-bold tracking-tight">
                      Contact Us
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-[#C2C4F9] font-medium">
                  {typeof plan.points === 'number' ? plan.points.toLocaleString() : plan.points} points included
                </p>
              </div>

              <ul className="mb-8 space-y-4 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-zinc-300">
                    <Check className="mr-3 h-5 w-5 text-[#5800C3] shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={cn(
                  "w-full rounded-md px-4 py-3 text-sm font-semibold transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black",
                  plan.popular
                    ? "bg-gradient-primary text-white hover:opacity-90 focus:ring-[#5800C3]"
                    : "bg-white text-black hover:bg-zinc-200 focus:ring-white"
                )}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
