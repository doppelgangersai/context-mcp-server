"use client";

import { ArrowRight, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-32 md:pt-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-zinc-400 backdrop-blur-sm"
          >
            <span className="mr-2 h-2 w-2 rounded-full bg-[#5800C3] animate-pulse" />
            MCP Server is now Live
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8 bg-gradient-to-b from-white to-white/60 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl md:text-7xl lg:max-w-4xl"
          >
            Unified API for Social Media Data
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 max-w-2xl text-lg text-zinc-400"
          >
            Query normalized, contextualized, and vectorized data from Twitter, Instagram, YouTube, LinkedIn, and TikTok via a single API or MCP service.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <Link
              href="/docs"
              className="inline-flex h-12 items-center justify-center rounded-md bg-gradient-primary px-8 text-sm font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#5800C3] focus:ring-offset-2 focus:ring-offset-black"
            >
              Start Building <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="#demo"
              className="inline-flex h-12 items-center justify-center rounded-md border border-white/10 bg-white/5 px-8 text-sm font-medium text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-black"
            >
              <Terminal className="ml-2 h-4 w-4 mr-2" /> View API Docs
            </Link>
          </motion.div>
        </div>
      </div>
      
      {/* Background Gradient */}
      <div className="absolute -top-24 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#5800C3]/20 blur-[100px]" />
    </section>
  );
}

