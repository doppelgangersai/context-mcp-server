"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Twitter, Youtube, Linkedin } from "lucide-react";

const EXAMPLES = [
  {
    label: "Twitter Post",
    icon: Twitter,
    color: "text-blue-400",
    code: `{
  "id": "tweet_123456789",
  "source": "twitter",
  "content": "Just launched our new AI feature! 🚀 #tech #ai",
  "author": {
    "id": "user_987",
    "username": "tech_guru",
    "verified": true
  },
  "metrics": {
    "likes": 1420,
    "retweets": 350
  },
  "enrichment": {
    "sentiment": 0.85,
    "embedding": [0.123, -0.456, ...],
    "context": "Positive launch announcement"
  }
}`
  },
  {
    label: "YouTube Video",
    icon: Youtube,
    color: "text-red-500",
    code: `{
  "id": "vid_dQw4w9WgXcQ",
  "source": "youtube",
  "title": "Understanding Neural Networks",
  "author": {
    "id": "channel_555",
    "username": "AI_Explained",
    "verified": true
  },
  "metrics": {
    "views": 500200,
    "likes": 25000
  },
  "enrichment": {
    "sentiment": 0.92,
    "embedding": [0.051, 0.882, ...],
    "context": "Educational technical content"
  }
}`
  },
  {
    label: "LinkedIn Post",
    icon: Linkedin,
    color: "text-blue-600",
    code: `{
  "id": "li_share_998877",
  "source": "linkedin",
  "content": "Excited to share our Q4 results! 📈",
  "author": {
    "id": "profile_111",
    "username": "sarah_ceo",
    "verified": true
  },
  "metrics": {
    "likes": 850,
    "comments": 124
  },
  "enrichment": {
    "sentiment": 0.78,
    "embedding": [-0.331, 0.114, ...],
    "context": "Professional business update"
  }
}`
  }
];

// Syntax highlighting helper
const highlightCode = (line: string) => {
  return line
    .replace(/"key":/g, '<span class="text-[#C2C4F9]">"key":</span>')
    .replace(/: "(.*?)"/g, ': <span class="text-green-400">"$1"</span>')
    .replace(/: ([0-9.]+)/g, ': <span class="text-orange-400">$1</span>')
    .replace(/: (true|false)/g, ': <span class="text-orange-400">$1</span>')
    .replace(/"(.*?)":/g, '<span class="text-[#C2C4F9]">"$1"</span>:');
};

export function CodePreview() {
  const [index, setIndex] = useState(0);
  const [visibleLines, setVisibleLines] = useState<number>(0);

  // Reset line counter when example changes
  useEffect(() => {
    setVisibleLines(0);
    const lines = EXAMPLES[index].code.split('\n');
    
    // Animate typing effect
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < lines.length) {
        setVisibleLines(prev => prev + 1);
        currentLine++;
      } else {
        clearInterval(interval);
        // Wait for a bit after finishing typing, then switch example
        setTimeout(() => {
          setIndex((prev) => (prev + 1) % EXAMPLES.length);
        }, 2000);
      }
    }, 80); // Typing speed per line

    return () => {
      clearInterval(interval);
    };
  }, [index]);

  const activeExample = EXAMPLES[index];
  const Icon = activeExample.icon;
  const lines = activeExample.code.split('\n');

  return (
    <section className="py-12 border-y border-white/5 bg-black/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              One Schema for All Platforms
            </h2>
            <p className="mt-4 text-lg text-zinc-400">
              Forget handling different API responses. We normalize everything into a single, consistent schema.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "Standardized date formats",
                "Unified user objects",
                "Cross-platform metrics",
                "Automatic vector embeddings",
                "Contextual summaries"
              ].map((item) => (
                <li key={item} className="flex items-center text-zinc-300">
                  <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#5800C3]/10">
                    <div className="h-2 w-2 rounded-full bg-[#5800C3]" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative rounded-xl border border-white/10 bg-[#0A0A0A] p-4 shadow-2xl min-h-[500px]">
            <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-4">
              <div className="h-3 w-3 rounded-full bg-red-500/20 border border-red-500/50" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
              <div className="h-3 w-3 rounded-full bg-green-500/20 border border-green-500/50" />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeExample.label}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="ml-auto flex items-center gap-2 text-xs font-mono"
                >
                   <Icon className={`h-3 w-3 ${activeExample.color}`} />
                   <span className="text-zinc-500">{activeExample.label}</span>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="relative overflow-hidden">
              <pre className="overflow-x-auto text-sm text-zinc-300 font-mono p-2 h-[400px]">
                <code>
                  {lines.map((line, i) => (
                    <motion.div
                      key={`${index}-${i}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ 
                        opacity: i < visibleLines ? 1 : 0,
                        x: i < visibleLines ? 0 : -10
                      }}
                      transition={{ duration: 0.1 }}
                      dangerouslySetInnerHTML={{ __html: highlightCode(line) || ' ' }}
                      style={{ minHeight: '1.5em' }}
                    />
                  ))}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
