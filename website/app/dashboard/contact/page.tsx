"use client";

import { useState } from "react";
import { Mail, MessageSquare, Send, CheckCircle } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

export default function ContactPage() {
  const { developer } = useAuthStore();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would send the contact form to your API
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSubmitted(true);
      setSubject("");
      setMessage("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0a0a0a] px-8 py-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Contact</h1>
          <p className="mt-1 text-sm text-gray-400">
            Get in touch with our support team
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="p-8 max-w-2xl">
        {isSubmitted ? (
          <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Message Sent!
            </h2>
            <p className="text-gray-400 mb-6">
              We&apos;ll get back to you as soon as possible.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Info */}
            <div className="rounded-xl border border-white/10 bg-[#111111] p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#5800C3]/10">
                    <Mail className="h-5 w-5 text-[#8B5CF6]" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Email</div>
                    <a
                      href="mailto:support@getcontext.now"
                      className="text-white hover:text-[#8B5CF6] transition-colors"
                    >
                      support@getcontext.now
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#5800C3]/10">
                    <MessageSquare className="h-5 w-5 text-[#8B5CF6]" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Discord</div>
                    <a
                      href="https://discord.gg/getcontext"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-[#8B5CF6] transition-colors"
                    >
                      Join our Discord
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="rounded-xl border border-white/10 bg-[#111111] p-6">
              <h2 className="text-lg font-semibold text-white mb-4">
                Send a Message
              </h2>

              <div className="space-y-4">
                {/* From */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    From
                  </label>
                  <div className="rounded-lg bg-white/5 px-4 py-2.5 text-gray-400">
                    {developer?.email || "Not logged in"}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Subject <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    aria-label="Subject"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-[#5800C3]/50 focus:outline-none focus:ring-1 focus:ring-[#5800C3]/50"
                  >
                    <option value="">Select a topic</option>
                    <option value="technical">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="feature">Feature Request</option>
                    <option value="enterprise">Enterprise Inquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={6}
                    placeholder="How can we help you?"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-gray-500 focus:border-[#5800C3]/50 focus:outline-none focus:ring-1 focus:ring-[#5800C3]/50 resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting || !subject || !message}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#5800C3] px-4 py-3 text-sm font-medium text-white hover:bg-[#6B00E8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
