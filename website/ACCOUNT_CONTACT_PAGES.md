# Account & Contact Pages Documentation

## 📄 Pages Created

### 1. Developer Account Page
**Path:** `app/(developer-app)/app/account/page.tsx`  
**Route:** `/app/account`  
**Access:** Authenticated Developer Users Only

#### Features:
- **Profile Information**
  - Avatar upload with camera button
  - First name & Last name inputs
  - Email address
  - Organization (optional)

- **Security Settings**
  - Password change option
  - Two-factor authentication setup
  - Active sessions management

- **Notification Preferences**
  - Email notifications toggle
  - API usage alerts toggle
  - Weekly reports toggle

- **Appearance & Preferences**
  - Dark/Light theme switcher
  - Timezone selection
  - Custom settings

- **Danger Zone**
  - Account deletion option

#### UI Elements:
- Animated section loading (Framer Motion)
- Toggle switches for notifications
- Gradient buttons for primary actions
- Card-based layout with borders
- Save/Cancel action buttons

---

### 2. NFT Account Page
**Path:** `app/(nft-app)/account/page.tsx`  
**Route:** `/account`  
**Access:** Authenticated NFT Users Only

#### Features:
- **Wallet & Profile**
  - Avatar with upload button
  - Display name customization
  - Connected wallet address display
  - Wallet disconnect option
  - Email (optional)
  - Bio textarea (optional)

- **Social Links**
  - Twitter/X handle
  - Website URL

- **Security**
  - Backup wallet address
  - Password protection for transactions
  - Transaction history viewer

- **Notifications**
  - NFT sales & offers toggle
  - Claim activity alerts toggle
  - Marketing emails toggle

- **Preferences**
  - Theme selector (Dark/Light)
  - Default currency display (Points/ETH/USD)

- **Danger Zone**
  - Account deletion (NFTs remain on blockchain)

#### UI Elements:
- Wallet-focused design
- Connected wallet status indicator
- Toggle switches with animations
- Dropdown selectors
- Gradient primary buttons

---

### 3. Contact Page (Shared)
**Path:** `app/contact/page.tsx`  
**Route:** `/contact`  
**Access:** Both Developer & NFT Users (Shared Route)

#### Features:
- **Quick Access Cards**
  - Help Center link → `/docs`
  - Email support link → `support@dataapi.com`
  - Live chat button (placeholder)

- **Contact Form**
  - Name input (required)
  - Email input (required)
  - Category dropdown (required):
    - General Inquiry
    - Technical Support
    - Billing & Payments
    - API Questions
    - NFT & Claims
    - Partnership
  - Subject line (required)
  - Message textarea (required)

- **Success State**
  - Animated success message
  - Auto-clears form after 3 seconds
  - Checkmark icon animation

- **Response Time Info**
  - Shows average response time: 2-4 hours
  - 24-hour response guarantee

#### UI Elements:
- Three-column quick links grid
- Full-width contact form
- AnimatePresence for form/success toggle
- Gradient submit button
- Icon-based visual hierarchy

---

## 🎨 Design System

### Colors:
- **Primary Purple:** `#5800C3`
- **Light Purple:** `#C2C4F9`
- **Gradient:** `from-[#5800C3] to-[#C2C4F9]`
- **Success Green:** `green-400/500`
- **Danger Red:** `red-400/500`

### Components Used:
- Lucide React Icons
- Framer Motion animations
- Toggle switches (custom built)
- Form inputs with focus states
- Card layouts with borders

### Layout:
- Max width: `4xl` (1024px)
- Centered content with `mx-auto`
- Consistent padding: `p-6` to `p-8`
- Section spacing: `mb-6` between cards
- Dark backgrounds: `bg-black` and `bg-white/5`

---

## 🔗 Navigation Integration

### Developer Sidebar:
```typescript
{ name: "Account", href: "/app/account", icon: UserCircle }
{ name: "Contact", href: "/contact", icon: MessageSquare }
```

### NFT Sidebar:
```typescript
{ name: "Account", href: "/account", icon: UserCircle }
{ name: "Contact", href: "/contact", icon: MessageSquare }
```

---

## ✅ Accessibility Features

- Proper label associations
- Required field indicators (*)
- Focus states on all interactive elements
- Keyboard navigation support
- Screen reader friendly structure
- Semantic HTML elements

---

## 🚀 User Experience

### Account Pages:
- Progressive disclosure (sections expand as needed)
- Instant visual feedback on toggles
- Clear save/cancel actions
- Warning for destructive actions
- Mobile-responsive grid layouts

### Contact Page:
- Multiple contact options
- Clear category selection
- Immediate success confirmation
- Helpful placeholder text
- Response time transparency

---

## 📱 Responsive Design

All pages are fully responsive with:
- Grid layouts: `md:grid-cols-2`, `md:grid-cols-3`
- Flex direction changes: `flex-col md:flex-row`
- Mobile-first approach
- Touch-friendly interactive elements
- Optimized spacing for small screens

---

## 🔒 Security Considerations

### Developer Account:
- Password change workflow
- 2FA integration ready
- Session management
- Secure form handling

### NFT Account:
- Wallet connection security
- Backup wallet option
- Transaction password protection
- Blockchain transaction history

---

## 💡 Future Enhancements

- [ ] Avatar image upload backend integration
- [ ] Email verification workflow
- [ ] Real-time form validation
- [ ] Contact form submission API
- [ ] Live chat widget integration
- [ ] Session timeout handling
- [ ] Account export functionality
- [ ] GDPR compliance tools

