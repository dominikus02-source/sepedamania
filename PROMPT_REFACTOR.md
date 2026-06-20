# PROMPT ENGINE: E-COMMERCE FRONTEND REFACTORING & MODERNIZATION

**Target Application:** Sepedamania (Online Bike Store)  
**Objective:** Transform into a high-end, minimalist e-commerce platform with premium UI/UX, integrated cart, and seamless checkout.

---

## 🤖 CRITICAL FIRST STEP: AGENT ACTIVATION

Invoke and orchestrate the following specialized agents:
1. **UX_Architect_Agent** — Define component hierarchy, spacing tokens (8pt grid), interactive transitions.
2. **UI_Design_System_Agent** — Premium color palette (Slate Grey, Matte Black, Deep Electric Blue/Emerald), modern iconography.
3. **State_Management_Agent** — Robust persistent cart state (Zustand) with optimistic UI updates.
4. **Refactoring_Expert_Agent** — Clean repo architecture, modularize components, ensure responsiveness.

---

## 🎨 1. VISUAL REVISION & DESIGN SYSTEM

### A. Color Palette & Typography
- **Backgrounds:** Off-white `#F8F9FA`, white cards `#FFFFFF`, deep slate `#111827` for premium contrast.
- **Accents:** Deep Cyber Teal `#0EA5E9` or Formula Orange `#EA580C` for micro-interactions and CTAs.
- **Typography:** Inter / Plus Jakarta Sans. `font-extrabold` headers, `font-light` body.

### B. UI Elements
- **Hero:** Sleek typography, asymmetric grid, soft dynamic drop-shadows.
- **Product Cards:** Borderless, subtle hover shift, skeleton loaders, floating Wishlist/Quick Add buttons.
- **Iconography:** Standardize on Lucide React. Replace all generic icons with `ShoppingBag`, `ArrowRight`, `SlidersHorizontal`, `Sparkles`, `ShieldCheck`.

---

## 🛒 2. E-COMMERCE FUNCTIONALITY

### A. Core Features
1. **Dynamic Cart Drawer** — Slides from right on add-to-cart or cart icon click.
2. **Add to Cart** — Soft toast notifications, animated badge counter on navbar.
3. **Interactive Cart** — Real-time quantity +/- controls, delete, dynamic subtotal.

### B. Step-by-Step Workflow

**Step 1: Browse & Product Discovery**
- Category filter sidebar with smooth expand/collapse.
- Price range slider with real-time product count.
- Sort dropdown: Terlaris, Termurah, Termahal, Terbaru.
- Infinite scroll or "Load More" button with skeleton transitions.

**Step 2: Product Quick View & Detail**
- Hover overlay "Quick Add" on product cards.
- Detail page: image gallery with zoom, variant selector (size/color), stock indicator, accordion specs.

**Step 3: Add to Cart**
- Cart drawer animates in from right edge.
- Item appears with image, name, variant, price, quantity controls, remove button.
- Subtotals + shipping estimate update in real time.
- "Checkout Sekarang" CTA at bottom.

**Step 4: Checkout Flow**
- Multi-step form (1. Shipping Address, 2. Courier Selection, 3. Payment Method, 4. Review).
- Progress indicator bar at top.
- Address autocomplete (RajaOngkir API integration).
- Courier cost comparison table.
- Payment: Virtual Account (BCA/BNI/BRI/Mandiri), QRIS, E-Wallet (OVO/GoPay/DANA), Kartu Kredit.
- Voucher code input with real-time validation.

**Step 5: Order Confirmation**
- Success screen with order ID, total amount, payment instructions, countdown timer for payment expiry.
- Email/SMS payment confirmation simulation.
- "Lihat Pesanan" link → Order Tracking page.

**Step 6: Order Tracking**
- Progress stepper: PENDING_PAYMENT → PAID → PROCESSING → SHIPPED → DELIVERED.
- Courier tracking number with live tracking link.
- Cancel order button (with confirmation modal).

---

## ⚙️ 3. STATE MANAGEMENT (ZUSTAND)

### Cart Store Structure
```typescript
interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  maxStock: number;
  weight: number;
}
```

### Actions
- `addItem(item)` — Add or increment quantity.
- `removeItem(productId, variantId?)` — Remove from cart.
- `updateQty(productId, variantId?, qty)` — Set exact quantity.
- `clearCart()` — Empty after checkout.
- `getCount()` — Total unique items (not sum of qty).
- `getSubtotal()` — Sum of price × qty.
- `getTotalItems()` — Sum of all qty.

### Persistence
- `localStorage` sync with Zustand `persist` middleware.
- Hydrate on app load.

---

## 📦 4. ARCHITECTURE & FILE STRUCTURE

```
src/
├── app/
│   └── (customer)/
│       ├── page.tsx              # Homepage
│       ├── produk/[slug]         # Product detail
│       ├── kategori/[slug]       # Category listing
│       ├── keranjang             # Cart page
│       ├── checkout              # Checkout flow
│       └── pesanan/[orderId]     # Order tracking
├── components/
│   ├── customer/
│   │   ├── header.tsx
│   │   ├── hero-banner.tsx
│   │   ├── product-card.tsx
│   │   ├── cart-drawer.tsx
│   │   ├── checkout-form.tsx
│   │   └── order-tracking.tsx
│   └── ui/                       # shadcn-style primitives
├── store/
│   └── cart.ts                   # Zustand store
├── hooks/                        # Custom React hooks
├── lib/                          # Utilities, API helpers
└── types/                        # TypeScript definitions
```

---

## 🧪 5. IMPLEMENTATION ORDER

1. **Zustand Cart Store** — Full implementation with persistence.
2. **Cart Drawer Component** — Slide-out panel with items, controls, totals.
3. **Header Update** — Cart badge, drawer trigger.
4. **Product Card Overhaul** — Quick-add, variant display, skeleton.
5. **Product Detail Page** — Gallery, zoom, specs accordion, add-to-cart.
6. **Checkout Flow** — Multi-step form with all payment methods.
7. **Order Tracking** — Progress stepper, courier tracking.
8. **Design Polish** — Typography, spacing, animations, responsive.
9. **Lighthouse Optimization** — LCP < 2.5s, CLS < 0.1, score > 90.

---

## 🚀 DELIVERABLES

- Fully functional modern e-commerce frontend.
- Persistent shopping cart with localStorage.
- Complete checkout flow with mock payment.
- Order tracking with status progression.
- Lighthouse score > 90.
- Zero TypeScript errors, zero lint warnings.
