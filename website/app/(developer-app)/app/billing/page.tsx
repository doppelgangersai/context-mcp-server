"use client";

export default function BillingPage() {
  const invoices = [
    { id: "INV-001", date: "Dec 1, 2025", amount: 20, status: "Paid", points: 20000 },
    { id: "INV-002", date: "Nov 1, 2025", amount: 20, status: "Paid", points: 20000 },
    { id: "INV-003", date: "Oct 1, 2025", amount: 5, status: "Paid", points: 5000 },
  ];

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-8">
      <div className="max-w-5xl">
        <h1 className="text-3xl font-bold text-white mb-2">Billing</h1>
        <p className="text-zinc-400 mb-8">
          View your invoices and payment history
        </p>

        {/* Current Plan */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Current Plan</h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-white">Pro Plan</div>
              <div className="text-zinc-400">20,000 points / month</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">$20</div>
              <div className="text-zinc-400">per month</div>
            </div>
          </div>
          <button className="mt-4 text-sm font-medium text-[#C2C4F9] hover:text-white transition-colors">
            Change Plan →
          </button>
        </div>

        {/* Invoice History */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-semibold text-white">Invoice History</h2>
          </div>
          <div className="divide-y divide-white/5">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-6 hover:bg-white/5 transition-colors">
                <div>
                  <div className="font-semibold text-white">{invoice.id}</div>
                  <div className="text-sm text-zinc-500">{invoice.date}</div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-sm text-zinc-400">{invoice.points.toLocaleString()} pts</div>
                  <div className="text-lg font-semibold text-white">${invoice.amount}</div>
                  <div className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/50 text-xs text-green-300">
                    {invoice.status}
                  </div>
                  <button className="text-sm text-[#C2C4F9] hover:text-white transition-colors">
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


