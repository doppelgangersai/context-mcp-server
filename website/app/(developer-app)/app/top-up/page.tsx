"use client";

import { Check } from "lucide-react";

const PLANS = [
  {
    name: "Starter",
    price: 5,
    points: 5000,
    features: ["5,000 points / month", "Access to all platforms", "Standard support"],
  },
  {
    name: "Pro",
    price: 20,
    points: 20000,
    features: ["20,000 points / month", "Rollover unused points", "Priority support"],
    popular: true,
  },
  {
    name: "Enterprise",
    price: null,
    points: "Custom",
    features: ["Custom points volume", "Custom datasources", "Dedicated support channel"],
  },
];

export default function TopUpPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 p-8">
      <div className="max-w-5xl">
        <h1 className="text-3xl font-bold text-white mb-2">Top-up Credits</h1>
        <p className="text-zinc-400 mb-8">
          Purchase additional points or upgrade your plan
        </p>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-xl border p-6 ${
                plan.popular
                  ? "bg-white/5 border-[#5800C3]/50 ring-1 ring-[#5800C3]/50"
                  : "bg-white/5 border-white/10"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-primary px-3 py-1 text-xs font-medium text-white">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-lg font-semibold text-white mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold text-white mb-1">
                {plan.price !== null ? `$${plan.price}` : "Contact Us"}
              </div>
              <p className="text-sm text-[#C2C4F9] mb-6">
                {typeof plan.points === 'number' ? plan.points.toLocaleString() : plan.points} points
              </p>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm text-zinc-300">
                    <Check className="mr-2 h-4 w-4 text-[#5800C3]" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full rounded-lg px-4 py-3 text-sm font-semibold transition-opacity ${
                  plan.popular
                    ? "bg-gradient-primary text-white hover:opacity-90"
                    : "bg-white text-black hover:bg-zinc-200"
                }`}
              >
                {plan.price !== null ? "Purchase" : "Contact Sales"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


