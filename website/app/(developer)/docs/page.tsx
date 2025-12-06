import Link from "next/link";
import { ArrowRight, Book, Code2, FileText, MessageSquare, Terminal } from "lucide-react";

export default function DocsPage() {
  const quickAccess = [
    {
      title: "API Reference",
      description: "Complete guide to making requests to the DataAPI REST API with all configuration options.",
      icon: Code2,
      href: "/register",
      cta: "View API Reference",
    },
    {
      title: "MCP Integration",
      description: "Use DataAPI with Model Context Protocol for seamless integration with AI tools.",
      icon: Terminal,
      href: "/register",
      cta: "View MCP Documentation",
    },
    {
      title: "Guides & Tutorials",
      description: "Step-by-step guides for integrating DataAPI into your applications and workflows.",
      icon: Book,
      href: "/register",
      sublinks: [
        { label: "ChatGPT Setup", href: "/register" },
        { label: "Claude Setup", href: "/register" },
        { label: "LangChain Integration", href: "/register" },
      ],
    },
    {
      title: "LLMS.txt",
      description: "AI-friendly documentation format for LLM context. Download the complete docs in a single text file.",
      icon: FileText,
      href: "/register",
      cta: "Download LLMS.txt",
    },
    {
      title: "Support & Billing",
      description: "Get help with billing, credits, and other account-related questions.",
      icon: MessageSquare,
      href: "#",
      sublinks: [
        { label: "Contact Us", href: "#" },
        { label: "Billing & Credits", href: "#" },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-black text-zinc-100 selection:bg-[#5800C3]/30">

      <div className="container mx-auto px-4 py-24 md:px-6 md:py-32">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center md:text-left">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-6">
              DataAPI Documentation
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl">
              Query normalized, contextualized, and vectorized social media data with a simple API call or through Model Context Protocol.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                href="/register"
                className="inline-flex h-12 items-center justify-center rounded-md bg-gradient-primary px-8 text-sm font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#5800C3] focus:ring-offset-2 focus:ring-offset-black"
              >
                Get Started
              </Link>
              <Link
                href="#"
                className="inline-flex h-12 items-center justify-center rounded-md border border-white/10 bg-white/5 px-8 text-sm font-medium text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-black"
              >
                View API Reference
              </Link>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-8">Quick Access</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {quickAccess.map((item) => (
                <div
                  key={item.title}
                  className="group relative rounded-xl border border-white/10 bg-[#0A0A0A] p-6 transition-colors hover:border-[#5800C3]/50 hover:bg-white/5"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#5800C3]/10 group-hover:bg-[#5800C3]/20 transition-colors">
                      <item.icon className="h-5 w-5 text-[#C2C4F9]" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                  </div>

                  <p className="text-zinc-400 mb-6 min-h-[3rem]">
                    {item.description}
                  </p>

                  {item.cta && (
                    <Link
                      href={item.href}
                      className="inline-flex items-center text-sm font-medium text-[#C2C4F9] hover:text-white transition-colors"
                    >
                      {item.cta} <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  )}

                  {item.sublinks && (
                    <ul className="space-y-2">
                      {item.sublinks.map((link) => (
                        <li key={link.label}>
                          <Link
                            href={link.href}
                            className="flex items-center text-sm text-zinc-400 hover:text-[#C2C4F9] transition-colors"
                          >
                            <span className="mr-2 h-1.5 w-1.5 rounded-full bg-[#5800C3]" />
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </main>
  );
}

