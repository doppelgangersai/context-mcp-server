import { Brain, Database, Layers, Share2, FileText, Search } from "lucide-react";

export function Features() {
  const features = [
    {
      name: "Universal Normalization",
      description: "Raw data from Twitter, TikTok, etc., is transformed into a consistent, easy-to-query schema.",
      icon: Layers,
    },
    {
      name: "Vector Embeddings",
      description: "Every piece of content is automatically embedded, enabling semantic search and RAG applications out of the box.",
      icon: Database,
    },
    {
      name: "AI Contextualization",
      description: "We don't just store text. We generate context, sentiment, and summary for every post using LLMs.",
      icon: Brain,
    },
    {
      name: "Semantic Search",
      description: "Query your data with natural language. Find relevant posts by meaning, not just keywords.",
      icon: Search,
    },
    {
      name: "MCP Service",
      description: "Ready-to-use Model Context Protocol service for your AI agents to query social knowledge.",
      icon: Share2,
    },
    {
      name: "Text, Image & Video",
      description: "We process all media formats. Extract insights from captions, images, and video transcripts seamlessly.",
      icon: FileText,
    },
  ];

  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything you need for Social AI
          </h2>
          <p className="mt-6 text-lg leading-8 text-zinc-400">
            Stop scraping and cleaning data. Focus on building your AI application with clean, enriched data streams.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                  <feature.icon className="h-5 w-5 flex-none text-[#C2C4F9]" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-zinc-400">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
