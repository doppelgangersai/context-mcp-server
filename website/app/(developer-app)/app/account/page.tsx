"use client";

import { useState } from "react";
import { 
  User, Key, Shield, Bell, Trash2, 
  Save, Camera, Globe, Moon, Sun, Settings
} from "lucide-react";
import { motion } from "framer-motion";

export default function DeveloperAccountPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [apiAlerts, setApiAlerts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);

  return (
    <main className="min-h-screen bg-black text-zinc-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
          <p className="text-zinc-400">Manage your profile, security, and preferences</p>
        </div>

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <User className="h-5 w-5 text-[#C2C4F9]" />
            <h2 className="text-xl font-semibold text-white">Profile Information</h2>
          </div>

          <div className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="h-20 w-20 rounded-full bg-gradient-primary flex items-center justify-center text-2xl font-bold">
                  D
                </div>
                <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-[#5800C3] flex items-center justify-center border-2 border-black hover:bg-[#6800E3] transition-colors">
                  <Camera className="h-4 w-4 text-white" />
                </button>
              </div>
              <div>
                <h3 className="text-white font-semibold">Profile Picture</h3>
                <p className="text-sm text-zinc-400">PNG, JPG up to 2MB</p>
              </div>
            </div>

            {/* Name */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  defaultValue="John"
                  className="w-full px-4 py-2 rounded-lg bg-black/50 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#5800C3]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  defaultValue="Developer"
                  className="w-full px-4 py-2 rounded-lg bg-black/50 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#5800C3]"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                defaultValue="developer@example.com"
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#5800C3]"
              />
            </div>

            {/* Organization */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Organization (Optional)
              </label>
              <input
                type="text"
                placeholder="Company name"
                className="w-full px-4 py-2 rounded-lg bg-black/50 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#5800C3]"
              />
            </div>
          </div>
        </motion.div>

        {/* Security Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-5 w-5 text-[#C2C4F9]" />
            <h2 className="text-xl font-semibold text-white">Security</h2>
          </div>

          <div className="space-y-4">
            {/* Change Password */}
            <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-white/5">
              <div className="flex items-center gap-3">
                <Key className="h-5 w-5 text-zinc-400" />
                <div>
                  <h3 className="text-white font-medium">Password</h3>
                  <p className="text-sm text-zinc-400">Last changed 3 months ago</p>
                </div>
              </div>
              <button className="px-4 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors">
                Change
              </button>
            </div>

            {/* Two-Factor Auth */}
            <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-white/5">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-zinc-400" />
                <div>
                  <h3 className="text-white font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-zinc-400">Add an extra layer of security</p>
                </div>
              </div>
              <button className="px-4 py-2 rounded-lg bg-gradient-primary text-white hover:opacity-90 transition-opacity">
                Enable
              </button>
            </div>

            {/* Active Sessions */}
            <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-white/5">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-zinc-400" />
                <div>
                  <h3 className="text-white font-medium">Active Sessions</h3>
                  <p className="text-sm text-zinc-400">2 active sessions</p>
                </div>
              </div>
              <button className="px-4 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors">
                Manage
              </button>
            </div>
          </div>
        </motion.div>

        {/* Notifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Bell className="h-5 w-5 text-[#C2C4F9]" />
            <h2 className="text-xl font-semibold text-white">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-white/5">
              <div>
                <h3 className="text-white font-medium">Email Notifications</h3>
                <p className="text-sm text-zinc-400">Receive updates via email</p>
              </div>
              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  emailNotifications ? "bg-[#5800C3]" : "bg-zinc-700"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                    emailNotifications ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-white/5">
              <div>
                <h3 className="text-white font-medium">API Usage Alerts</h3>
                <p className="text-sm text-zinc-400">Get notified of unusual activity</p>
              </div>
              <button
                onClick={() => setApiAlerts(!apiAlerts)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  apiAlerts ? "bg-[#5800C3]" : "bg-zinc-700"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                    apiAlerts ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-white/5">
              <div>
                <h3 className="text-white font-medium">Weekly Reports</h3>
                <p className="text-sm text-zinc-400">Receive weekly usage summaries</p>
              </div>
              <button
                onClick={() => setWeeklyReports(!weeklyReports)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  weeklyReports ? "bg-[#5800C3]" : "bg-zinc-700"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                    weeklyReports ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Preferences Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Settings className="h-5 w-5 text-[#C2C4F9]" />
            <h2 className="text-xl font-semibold text-white">Preferences</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Theme
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setTheme("dark")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    theme === "dark"
                      ? "bg-[#5800C3] text-white"
                      : "bg-white/5 text-zinc-400 hover:bg-white/10"
                  }`}
                >
                  <Moon className="h-4 w-4" />
                  Dark
                </button>
                <button
                  onClick={() => setTheme("light")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    theme === "light"
                      ? "bg-[#5800C3] text-white"
                      : "bg-white/5 text-zinc-400 hover:bg-white/10"
                  }`}
                >
                  <Sun className="h-4 w-4" />
                  Light
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Timezone
              </label>
              <select className="w-full px-4 py-2 rounded-lg bg-black/50 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#5800C3]">
                <option>UTC (GMT+0:00)</option>
                <option>EST (GMT-5:00)</option>
                <option>PST (GMT-8:00)</option>
                <option>CET (GMT+1:00)</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 mb-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Trash2 className="h-5 w-5 text-red-400" />
            <h2 className="text-xl font-semibold text-white">Danger Zone</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Delete Account</h3>
                <p className="text-sm text-zinc-400">Permanently delete your account and all data</p>
              </div>
              <button className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <button className="px-6 py-3 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors">
            Cancel
          </button>
          <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-primary text-white hover:opacity-90 transition-opacity">
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </div>
    </main>
  );
}
