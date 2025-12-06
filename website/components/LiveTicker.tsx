"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

const MESSAGES = [
  "User @alex_dev just claimed 500 pts for fulfilling a request!",
  "New bounty: 2,000 pts for @SpaceX Twitter data",
  "Developer joined from San Francisco",
  "Dataset 'Viral TikToks 2024' was just vectorized",
  "User @sarah_ai minted a new Data Stream NFT",
  "Bounty increased for YouTube Channel @MKBHD",
];

export function LiveTicker() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 hidden md:block">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex items-center gap-3 rounded-full border border-white/10 bg-black/80 px-4 py-2 backdrop-blur-md shadow-2xl"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <p className="text-xs font-medium text-zinc-300">
            {MESSAGES[index]}
          </p>
          <Zap className="h-3 w-3 text-[#C2C4F9]" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

