# SEPEDAMANIA — Comprehensive Code Audit Report

> **Date:** 2026-06-20
> **Project:** sepedamania (Next.js 16, TypeScript, Tailwind CSS, Prisma, Zustand)
> **Repository:** https://github.com/dominikus02-source/sepedamania

---

## Executive Summary

The project is functionally complete (Phase 1–5) and compiles successfully with 46 routes. However, there are **critical security gaps** in API routes (no auth on order mutation, no webhook signature verification, no CSRF protection), **zero error/loading boundaries** across all pages, and **74 ESLint errors** (primarily `any` types). The project relies entirely on in-memory mock data — this is acceptable for demo but needs real database integration before production launch.

**Build Status:** ✅ Passes (zero errors, 2 deprecation warnings)
**TypeScript:** ✅ Passes
**ESLint:** ❌ 74 errors, 47 warnings
**npm audit:** ❌ 5 moderate vulnerabilities

---

## 🔴 Critical Issues (Fix Immediately)

### C1. No Authentication on Order Mutation API

**File:** `src/app/api/orders/[id]/route.ts`
**Severity:** Critical — **Anyone can mutate any order's payment status to PAID without paying.**

The `PATCH` handler at `orders/[id]` has zero authentication or authorization checks. An attacker who knows an order ID can:
- Change `paymentStatus` to `PAID` and `status` to `PROCESSING` — effectively marking it as paid
- Mutate any order field without owning the order

**Fix:** Add session check: only the order owner (via `session.user.id === order.userId`) or an ADMIN role should be allowed to mutate orders. Use Zod to validate the request body.

---

### C2. No Xendit Webhook Signature Verification

**File:** `src/app/api/webhooks/xendit/route.ts`
**Severity:** Critical — **Anyone can forge payment callbacks.**

The webhook endpoint accepts any POST request with `{ external_id, status: "PAID" }` without verifying the Xendit callback token (`x-callback-token` header). Xendit sends a callback token that should be compared against `process.env.XENDIT_WEBHOOK_TOKEN`.

**Fix:**
```typescript
const callbackToken = req.headers.get('x-callback-token')
if (callbackToken !== process.env.XENDIT_WEBHOOK_TOKEN) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

---

### C3. No CSRF Protection on Any Mutating Route

**Files:** All POST/PUT/PATCH/DELETE API routes (15+ routes)
**Severity:** Critical — **Authenticated admin sessions can be exploited via CSRF.**

Zero routes check `Origin` or `Referer` headers. An authenticated admin visiting a malicious site could trigger:
- PUT `/api/admin/settings` — change store configuration
- POST `/api/upload` — upload malicious files (when Cloudinary is wired)
- PATCH `/api/orders/[id]` — manipulate orders

**Fix:** Add middleware-level origin check for all mutating requests:
```typescript
const origin = req.headers.get('origin')
const allowedOrigins = [process.env.NEXT_PUBLIC_URL]
if (origin && !allowedOrigins.includes(origin)) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
```

---

### C4. Checkout Trusts Client-Provided Prices

**File:** `src/app/api/checkout/create-payment/route.ts`
**Severity:** Critical — **Price manipulation attack vector.**

The `subtotal` is calculated from client-provided `item.price` and `item.salePrice`. A malicious client can send artificially low prices. In production, prices **must** be fetched server-side from the database.

**Fix:** Look up product prices from DB/server cache:
```typescript
const product = await prisma.product.findUnique({ where: { id: item.productId } })
const price = product?.salePrice ?? product?.price
```

---

### C5. No Input Validation on Any API Route (Zod Not Used)

**Files:** All API routes (19 files)
**Severity:** High — **Zod v4.4.3 is installed with schemas in `validations.ts`, but zero routes use them.**

Every route relies on ad-hoc manual checks or none at all:

| Route | Current Validation | Zod Schema Available? |
|-------|-------------------|----------------------|
| `auth/register` | `if (!name \|\| !email \|\| !password)` | ✅ `registerSchema` exists |
| `admin/settings` | None | ❌ Needs new schema |
| `checkout/create-payment` | `if (!data.items \|\| !data.items.length)` | ❌ Needs new schema |
| `orders/[id]/PATCH` | None | ❌ Needs new schema |
| `vouchers/validate` | None | ❌ Needs new schema |
| `shipping/cost` | `if (!courier)` | ❌ Needs new schema |
| `products/GET` | None (query params) | ❌ Needs new schema |

**Fix:** Import and use Zod schemas in every route. Create new schemas for routes that lack them.

---

### C6. No Rate Limiting Anywhere

**Files:** All API routes
**Severity:** High — **Abuse scenarios are wide open.**

| Attack Vector | Route | Impact |
|--------------|-------|--------|
| Mass registration | `POST /api/auth/register` | Account spam |
| Voucher brute-force | `POST /api/vouchers/validate` | Leak valid codes |
| Order creation spam | `POST /api/checkout/create-payment` | Resource exhaustion |
| Order mutation | `PATCH /api/orders/[id]` | Status manipulation |
| Webhook replay | `POST /api/webhooks/xendit` | Payment fraud |

**Fix:** Add rate limiting middleware using `@upstash/rate-limit` or a simple in-memory Map with IP-based limits per route.

---

## 🟡 High Priority Issues

### H1. Zero loading.tsx Files — All Pages Show Blank During Navigation

**Severity:** High
**Files:** All 26 page directories — **zero** `loading.tsx` files exist.

Next.js uses `loading.tsx` as an automatic Suspense fallback during navigation. Without it, users see a blank page while server components render.

**Fix:** Create `loading.tsx` at minimum for:
- `/src/app/loading.tsx` (global)
- `/src/app/(customer)/loading.tsx`
- `/src/app/(admin)/loading.tsx`
- `/src/app/(admin)/admin/loading.tsx`

Example minimal loading:
```tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F2F2F7]">
      <div className="animate-spin w-8 h-8 border-4 border-[#F5A623] border-t-transparent rounded-full" />
    </div>
  )
}
```

---

### H2. Zero error.tsx Files — Errors Cause White Screen

**Severity:** High
**Files:** All 26 page directories — **zero** `error.tsx` files exist.

If any client component throws an error, the entire page shows a blank white screen with no recovery mechanism.

**Fix:** Create `error.tsx` at route group level:
```tsx
'use client'
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
      <h2 className="text-xl font-bold text-[#1C1C1E]">Terjadi Kesalahan</h2>
      <p className="text-sm text-[#8E8E93]">Silakan coba lagi</p>
      <button onClick={reset} className="bg-[#F5A623] text-white px-6 py-2 rounded-lg">Coba Lagi</button>
    </div>
  )
}
```

---

### H3. Missing Suspense Boundary for useSearchParams

**File:** `src/app/(customer)/pesanan/[orderId]/order-detail-client.tsx`
**Severity:** High — **Breaks static rendering in Next.js 16.**

`OrderDetailClient` uses `useSearchParams()` without a Suspense boundary. In Next.js 16, this causes the entire page to be dynamically rendered and shows a build warning.

The `cari/page.tsx` already handles this correctly — `SearchContent` is wrapped in `<Suspense>`.

**Fix:** Wrap `OrderDetailClient` in `<Suspense>`:
```tsx
// pesanan/[orderId]/page.tsx
<Suspense fallback={<Loading />}>
  <OrderDetailClient orderId={orderId} />
</Suspense>
```

---

### H4. ESLint: 74 Errors (Primarily `any` Types)

**Severity:** High — **Type safety is compromised across the codebase.**

Key patterns of errors:
- **`@typescript-eslint/no-explicit-any`** — 30+ occurrences in API routes, auth, email, mock data, middleware
- **`@typescript-eslint/no-empty-object-type`** — 2 occurrences in `Input.tsx` and `Textarea.tsx` (empty interface extending HTMLInputElement)
- **`@typescript-eslint/no-unused-vars`** — 18+ occurrences: `error` in catch blocks, unused imports (`cn`, `Button`, `Image`, `Separator`, `User`, `router`)
- **`@typescript-eslint/no-unused-vars`** — `_req`, `params` in stub API handlers

**Fix:** Replace `any` with proper types (e.g., `AdminOrder`, `User`, generic types). Enable `noUnusedLocals` in tsconfig. Prefix intentional unused params with `_` (already done in some files).

---

### H5. Missing SEO Metadata — 24/26 Pages Share Identical Meta

**Severity:** High — **Every page has the same `<title>` and `<meta description>`.**

Only `produk/[slug]` and `kategori/[slug]` have `generateMetadata`. All other pages rely on the default metadata from `layout.tsx`, meaning Google sees the same title/description for every page — effectively zero SEO.

**Fix:** Add `generateMetadata` (dynamic) or `metadata` (static) for at minimum:
- `/(customer)/page.tsx` — Landing page (most important)
- `/(customer)/masuk/page.tsx` — Login page
- `/(customer)/daftar/page.tsx` — Register page
- `/(customer)/cari/page.tsx` — Search page
- `/(admin)/admin/page.tsx` — Admin dashboard

---

### H6. Prisma Schema: Missing Indexes on Frequently Queried Fields

**Severity:** High — **Will cause slow queries with real database.**

| Model | Field | Query Pattern | Has Index? |
|-------|-------|--------------|------------|
| Product | `slug` | Lookup by slug (every product page) | ✅ (unique) |
| Product | `categoryId` | Filter by category | ❌ |
| Product | `isActive` | Filter active products | ❌ |
| Order | `userId` | Get user's orders | ❌ |
| Order | `status` | Filter by status (admin) | ❌ |
| Order | `paymentStatus` | Filter by payment status | ❌ |
| Order | `createdAt` | Sort by date | ❌ |
| Review | `productId` | Get product reviews | ❌ |
| OrderItem | `orderId` | Get order items | ❌ (composite? already FK) |

**Fix:** Add indexes:
```prisma
model Order {
  @@index([userId])
  @@index([status])
  @@index([paymentStatus])
  @@index([createdAt])
}

model Product {
  @@index([categoryId])
  @@index([isActive])
}

model Review {
  @@index([productId])
}
```

---

### H7. Middleware Uses Deprecated Convention

**File:** `src/middleware.ts`
**Severity:** Medium — **Next.js 16 deprecation warning at every build.**

The `middleware` file convention is deprecated in Next.js 16 in favor of `proxy`. The build shows:
```
⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.
```

**Fix:** Rename `src/middleware.ts` → `src/proxy.ts` (or use `src/middleware.ts` if it still works).

---

## 🟠 Medium Priority Issues

### M1. npm Audit: 5 Moderate Vulnerabilities

| Package | Issue | Fix |
|---------|-------|-----|
| `postcss` (via Next.js) | XSS via unescaped `</style>` | Update Next.js (breaking) |
| `@hono/node-server` (via Prisma dev) | Middleware bypass via repeated slashes | Update Prisma (breaking) |

**Note:** Both require breaking changes to fix. The Next.js issue is server-side and low-risk in practice. Accept as-is for now.

---

### M2. Missing `notFound()` in 3 Client-Side Dynamic Pages

| File | Current Handling | Issue |
|------|-----------------|-------|
| `admin/produk/[slug]/page.tsx` | Manual `notFound` state → custom UI | No HTTP 404 status |
| `admin/pesanan/[id]/page.tsx` | `if (!order)` → custom UI | No HTTP 404 status |
| `pesanan/[orderId]/page.tsx` | `if (!order)` → custom UI | No HTTP 404 status |

These pages handle "not found" client-side but never trigger Next.js's `notFound()` function, so they return HTTP 200 with a user-facing message instead of HTTP 404.

**Fix:** Call `notFound()` from `next/navigation` to trigger proper 404 behavior.

---

### M3. Unused Imports Across 10+ Files

**Severity:** Medium — **Dead code increases bundle size and reduces maintainability.**

| File | Unused Import |
|------|--------------|
| `src/app/api/products/route.ts` | `mockCategories` |
| `src/components/customer/header.tsx` | `cn` |
| `src/components/customer/product-card.tsx` | `cn`, `Button` |
| `src/components/ui/dialog.tsx` | `asChild` |
| `src/components/ui/sheet.tsx` | `asChild` |
| `src/components/ui/radio-group.tsx` | `value` |
| `src/app/(customer)/profil/profile-client.tsx` | `Image`, `Separator`, `User`, `router` |
| `src/app/api/admin/settings/route.ts` | `error` in catch |
| `src/app/api/auth/register/route.ts` | `error` in catch |
| `src/app/api/shipping/cost/route.ts` | `error` in catch |
| `src/app/api/upload/route.ts` | `buffer`, `error` |
| `src/app/api/vouchers/validate/route.ts` | `error` in catch |
| `src/app/api/webhooks/xendit/route.ts` | `error` in catch |
| `src/app/api/products/[id]/route.ts` | `_req`, `params` |

---

### M4. In-Memory Mock Data — All Orders Lost on Server Restart

**Files:** `src/lib/mock-orders.ts`, `src/lib/mock-data.ts`
**Severity:** Medium — **No data persistence.**

The entire application runs on in-memory mock data. Every server restart resets:
- All orders created during checkout (lost from `Map`)
- All product catalog data (hardcoded, but not modifiable)
- Admin UI changes (restocks, status updates) are client-side only

**Fix:** This is acceptable for demo. For production, wire up Supabase/PostgreSQL with Prisma.

---

### M5. Duplicate Lockfiles Causing Turbopack Warning

**Files:** `package-lock.json` and `/Users/user/pnpm-lock.yaml`
**Severity:** Low — **Build warning only.**

```
⚠ Warning: Next.js inferred your workspace root...
Detected additional lockfiles:
  * /Users/user/sepedamania/package-lock.json
```

**Fix:** Remove one of the lockfiles or set `turbopack.root` in Next.js config.

---

### M6. StoreSettings Model Stores API Keys in Plain Text

**File:** `prisma/schema.prisma` (StoreSettings model)
**Severity:** Medium — **Xendit/RajaOngkir secrets stored in database.**

The `StoreSettings` model stores `xenditSecretKey`, `xenditWebhookToken`, and `rajaongkirKey` as plain text strings. If the database is ever compromised, these secrets are exposed.

**Fix:** Use environment variables instead of database storage. Add encryption at rest if DB storage is needed.

---

## 🔵 Low Priority Issues

### L1. @react-email Deprecated Packages

**Files:** `emails/*.tsx`
**Severity:** Low — **Warning noise during install.**

All `@react-email/*` packages show deprecation warnings. These packages are unmaintained but functional.

**Fix:** Consider migrating to `react-email` v4 or `jsx-email` when budget allows.

---

### L2. Type Assertion Smell — `as any` on Session User

**Files:** `admin/dashboard/route.ts`, `admin/settings/route.ts`, `upload/route.ts`
**Severity:** Low — **Type safety gap.**

Several admin routes cast `session.user as any` to check `role`. This bypasses TypeScript's type checking.

**Fix:** Extend the session type properly in `next-auth.d.ts` instead of casting.

---

### L3. static Generation Opportunity — 7 Pages Could Be Static

**Severity:** Low — **Build performance.**

Currently 7 pages are `○ (Static)`. The remaining 39 are `ƒ (Dynamic)`. Many admin list pages (pelanggan, kategori, pembayaran, pengiriman) could be static since they use hardcoded mock data.

**Fix:** Remove `export const dynamic = 'force-dynamic'` from pages that don't need it.

---

### L4. No Environment Variable Validation at Startup

**Severity:** Low

Critical env vars like `NEXTAUTH_SECRET`, `NEXT_PUBLIC_URL`, `CRON_SECRET` have no validation at build/start time. Missing values cause cryptic runtime errors.

**Fix:** Add a `lib/env.ts` with Zod schema validation:
```typescript
import { z } from 'zod'

const envSchema = z.object({
  NEXTAUTH_SECRET: z.string().min(1),
  NEXT_PUBLIC_URL: z.string().url(),
  CRON_SECRET: z.string().optional(),
})

export const env = envSchema.parse(process.env)
```

---

## 📊 Summary

| Priority | Count | Key Items |
|----------|-------|-----------|
| 🔴 **Critical** | 6 | No auth on order mutation, no webhook sig verification, no CSRF, client price trust, no Zod validation, no rate limiting |
| 🟡 **High** | 7 | Zero loading/error boundaries, missing Suspense, 74 ESLint errors, 24/26 pages missing SEO, missing DB indexes, deprecated middleware |
| 🟠 **Medium** | 6 | npm audit vulnerabilities, missing notFound(), unused imports, in-memory data loss, duplicate lockfiles, API keys in DB |
| 🔵 **Low** | 4 | Deprecated email packages, `as any` casts, static generation opportunity, missing env validation |

## 🏁 Recommendations

1. **Fix security issues first** (C1–C6) — especially auth on order PATCH and webhook signature
2. **Add loading/error boundaries** (H1–H2) — trivial to add, huge UX impact
3. **Fix ESLint errors** (H4) — enable CI lint check to prevent regression
4. **Add SEO metadata** (H5) — critical for organic discovery
5. **Add Prisma indexes** (H6) — before connecting production database
6. **Set up Supabase** — migrate from mock data to real PostgreSQL
7. **Configure Vercel env vars** — for production deployment
