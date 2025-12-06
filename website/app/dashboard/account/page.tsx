"use client";

import { useState } from "react";
import { User, Mail, Wallet, Calendar, Edit2, Save, X } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

export default function AccountPage() {
  const { developer } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: developer?.fullName || "",
    email: developer?.email || "",
    username: developer?.username || "",
  });

  const handleSave = async () => {
    // Here you would call the API to update the profile
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      fullName: developer?.fullName || "",
      email: developer?.email || "",
      username: developer?.username || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0a0a0a] px-8 py-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Account</h1>
          <p className="mt-1 text-sm text-gray-400">
            Manage your account settings and profile
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="p-8 max-w-2xl">
        {/* Profile Section */}
        <div className="rounded-xl border border-white/10 bg-[#111111]">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">Profile</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-sm text-gray-300 hover:bg-white/10 transition-colors"
              >
                <Edit2 className="h-4 w-4" />
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-sm text-gray-300 hover:bg-white/10 transition-colors"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 rounded-lg bg-[#5800C3] px-3 py-1.5 text-sm text-white hover:bg-[#6B00E8] transition-colors"
                >
                  <Save className="h-4 w-4" />
                  Save
                </button>
              </div>
            )}
          </div>

          <div className="p-6 space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#5800C3] to-[#8B5CF6] flex items-center justify-center">
                {developer?.avatar ? (
                  <img
                    src={developer.avatar}
                    alt={developer.fullName}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-8 w-8 text-white" />
                )}
              </div>
              <div>
                <div className="font-medium text-white">
                  {developer?.fullName || "Unknown User"}
                </div>
                <div className="text-sm text-gray-400">
                  @{developer?.username || "unknown"}
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                  <User className="h-4 w-4" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder="Enter your full name"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-[#5800C3]/50 focus:outline-none focus:ring-1 focus:ring-[#5800C3]/50"
                  />
                ) : (
                  <div className="rounded-lg bg-white/5 px-4 py-2.5 text-white">
                    {developer?.fullName || "-"}
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                  <Mail className="h-4 w-4" />
                  Email
                </label>
                {isEditing ? (
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Enter your email address"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-[#5800C3]/50 focus:outline-none focus:ring-1 focus:ring-[#5800C3]/50"
                  />
                ) : (
                  <div className="rounded-lg bg-white/5 px-4 py-2.5 text-white">
                    {developer?.email || "-"}
                  </div>
                )}
              </div>

              {/* Username */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                  <User className="h-4 w-4" />
                  Username
                </label>
                <div className="rounded-lg bg-white/5 px-4 py-2.5 text-gray-400">
                  @{developer?.username || "-"}
                  <span className="text-xs text-gray-500 ml-2">
                    (cannot be changed)
                  </span>
                </div>
              </div>

              {/* Wallet Address */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                  <Wallet className="h-4 w-4" />
                  Wallet Address
                </label>
                <div className="rounded-lg bg-white/5 px-4 py-2.5 font-mono text-sm text-gray-400">
                  {developer?.walletAddress || "Not connected"}
                </div>
              </div>

              {/* Member Since */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                  <Calendar className="h-4 w-4" />
                  Member Since
                </label>
                <div className="rounded-lg bg-white/5 px-4 py-2.5 text-gray-400">
                  {developer?.id
                    ? new Date().toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                    : "-"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-8 rounded-xl border border-red-500/20 bg-red-500/5">
          <div className="border-b border-red-500/20 px-6 py-4">
            <h2 className="text-lg font-semibold text-red-400">Danger Zone</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-400 mb-4">
              Once you delete your account, there is no going back. Please be
              certain.
            </p>
            <button className="rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
