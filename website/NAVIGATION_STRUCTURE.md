# Navigation Structure - Dual Environment System

## 🏗️ Architecture Overview

Your application now has **2 main environments** (Developers & NFTs), each with **2 states** (Not Authorized & Authorized), resulting in **4 distinct navigation experiences**.

---

## 📁 Folder Structure

```
app/
├── (developer)/              # 🔓 Developers - Not Authorized
│   ├── layout.tsx            # Uses: DeveloperNavbar (top)
│   ├── page.tsx              # Landing page (root /)
│   └── docs/
│       └── page.tsx
│
├── (developer-app)/          # 🔐 Developers - Authorized
│   ├── layout.tsx            # Uses: DeveloperSidebar (left)
│   └── app/
│       ├── page.tsx          # Dashboard
│       ├── mcp/
│       ├── api-keys/
│       ├── top-up/
│       ├── billing/
│       └── account/
│
└── (nft-app)/                # 🔐 NFTs - Authorized ONLY
    ├── layout.tsx            # Uses: NftSidebar (left)
    ├── dashboard/
    │   └── page.tsx
    ├── claim/
    │   └── page.tsx
    ├── marketplace/
    │   └── page.tsx
    └── account/
        └── page.tsx
```

**Note:** There is no public NFT environment folder. All NFT features require authentication.

---

## 🧭 Navigation Components

**Active Components: 3** (DeveloperNavbar, DeveloperSidebar, NftSidebar)  
**Unused: 1** (NftNavbar - no public NFT routes exist)

### 1. **DeveloperNavbar** (Top Header - Not Authorized)
**Location:** `components/DeveloperNavbar.tsx`  
**Used in:** `(developer)` folder  
**Layout:** Horizontal top navigation

**Menu Items:**
- Context API → `/`
- Pricing → `/#pricing`
- Documentation → `/docs`
- DataStream NFTs → `/claim` (leads to NFT environment)

**Upper Right Corner:**
- **Get API Keys** button → `/app` (leads to authorized developer environment)

---

### 2. **DeveloperSidebar** (Left Sidebar - Authorized)
**Location:** `components/DeveloperSidebar.tsx`  
**Used in:** `(developer-app)` folder  
**Layout:** Fixed left sidebar (64px margin-left on content)

**Menu Items:**
- Dashboard → `/app`
- MCP → `/app/mcp`
- API Keys → `/app/api-keys`
- Top-Up → `/app/top-up`
- Billing → `/app/billing`
- Account → `/app/account`
- Contact → `/contact`

**Lower Left Corner:**
- **DataStreams Dashboard** button → `/dashboard` (switches to NFT authorized environment)
- **Sign Out** button

---

### 3. **NftNavbar** (Top Header - Not Authorized)
**Location:** `components/NftNavbar.tsx`  
**Status:** ⚠️ **Currently Unused** - No public NFT routes exist  
**Purpose:** Reserved for future public NFT landing pages if needed

---

### 4. **NftSidebar** (Left Sidebar - Authorized)
**Location:** `components/NftSidebar.tsx`  
**Used in:** `(nft-app)` folder  
**Layout:** Fixed left sidebar (64px margin-left on content)

**Menu Items:**
- Dashboard → `/dashboard`
- Claim → `/claim`
- Marketplace → `/marketplace`
- Account → `/account`
- Contact → `/contact`

**Lower Left Corner:**
- **Developer Portal** button → `/app` (switches to Developer authorized environment)
- **Sign Out** button

---

## 🔄 Environment Switching Flow

### For Non-Authorized Users:

```
Developer (Public)  ←→  NFT (Public)
     ↓                      ↓
  "Get API Keys"      "Sign Up" / "Connect Wallet"
     ↓                      ↓
Developer (Auth)         NFT (Auth)
```

### For Authorized Users:

```
Developer Dashboard  ←→  NFT Dashboard
(DeveloperSidebar)      (NftSidebar)
       ↓                      ↓
"DataStreams Dashboard" ← → "Developer Portal"
```

---

## 🎨 Visual Differences

### Not Authorized (Both Environments)
- **Top horizontal navbar** with transparent backdrop blur
- Full-width content area
- Footer at the bottom
- CTA buttons prominent in header

### Authorized (Both Environments)
- **Left fixed sidebar** (256px wide)
- Main content with left margin (ml-64)
- Environment switcher button in sidebar footer
- Dark theme with purple/cyan accents

---

## 🚀 Routes Summary

### Developer Environment Routes
| Route | Type | Page |
|-------|------|------|
| `/` | Public | Landing/Context API |
| `/docs` | Public | Documentation |
| `/app` | Auth | Developer Dashboard |
| `/app/mcp` | Auth | MCP Integration |
| `/app/api-keys` | Auth | API Keys Management |
| `/app/top-up` | Auth | Credits Top-up |
| `/app/billing` | Auth | Billing Info |
| `/app/account` | Auth | Account Settings |

### NFT Environment Routes
| Route | Type | Page |
|-------|------|------|
| `/dashboard` | Auth | NFT Dashboard |
| `/claim` | Auth | Claim New Stream |
| `/marketplace` | Auth | Marketplace |
| `/account` | Auth | Account Settings |

**Note:** All NFT features require authentication. Users must connect their wallet to access any NFT functionality. Public users can learn about NFTs from the Developer landing page.

---

## 🎯 Key Features

1. **Seamless Environment Switching**
   - Prominent buttons in sidebar footers for authorized users
   - Clear navigation links for public users

2. **Consistent Design Language**
   - Purple (#5800C3) and cyan (#C2C4F9) gradient theme
   - Dark backgrounds with subtle borders
   - Smooth transitions and hover effects

3. **Clear Authorization States**
   - Public pages: Top navbar with CTA buttons
   - Authorized pages: Left sidebar with environment switcher

4. **Responsive & Modern**
   - Tailwind CSS with custom gradients
   - Framer Motion animations
   - Lucide React icons

---

## 📝 Notes

- Route groups `(folder)` don't affect URLs in Next.js
- All layouts are server-side rendered by default
- Sidebars use `"use client"` for pathname detection
- Environment switchers have gradient styling for prominence

