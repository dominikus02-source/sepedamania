# SEPEDAMANIA — Launch Checklist

## Production Commit
- **Hash**: `67e15b8d9228835a076b1ef892dc18c037352d26`
- **Message**: `feat: Prisma-based return workflow with shared client-safe library`
- **Date**: 2026-07-05
- **Branch**: `main`

## Environment Variables

| Variable | Source | Type |
|---|---|---|
| `DATABASE_URL` | Vercel | Secret |
| `DIRECT_URL` | Vercel | Secret |
| `AUTH_SECRET` | Vercel | Secret |
| `AUTH_GITHUB_ID` | Vercel | Secret |
| `AUTH_GITHUB_SECRET` | Vercel | Secret |
| `AUTH_GOOGLE_ID` | Vercel | Secret |
| `AUTH_GOOGLE_SECRET` | Vercel | Secret |
| `MIDTRANS_SERVER_KEY` | Vercel | Secret |
| `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` | Vercel | Plain |
| `MIDTRANS_IS_PRODUCTION` | Vercel | `true` |
| `VERCEL` | Vercel | Auto |
| `NEXT_PUBLIC_VERCEL_URL` | Vercel | Auto |
| `RESEND_API_KEY` | Vercel | Secret |
| `RESEND_FROM_EMAIL` | Vercel | Plain |
| `BLOB_READ_WRITE_TOKEN` | Vercel | Secret |
| `S3_ACCESS_KEY_ID` | Vercel | Secret |
| `S3_SECRET_ACCESS_KEY` | Vercel | Secret |
| `S3_BUCKET` | Vercel | Plain |
| `S3_REGION` | Vercel | Plain |
| `S3_ENDPOINT` | Vercel | Plain |

## Payment Mode
- **Midtrans**: **PRODUCTION** (`MIDTRANS_IS_PRODUCTION=true`)
- **Snap URLs**: `app.midtrans.com` (not `app.sandbox.midtrans.com`)
- **Sandbox QA not possible** — real payment requires real transaction

## Critical Routes

### Customer
| Route | Description | Status |
|---|---|---|
| `/` | Home — product listing, categories, flash sale | ✓ 200 |
| `/cari` | Search products | ✓ 200 |
| `/keranjang` | Cart | ✓ 200 |
| `/pesanan` | My orders (auth) | ✓ 200 |
| `/pesanan/[id]` | Order detail (auth) | ✓ 200 |
| `/pesanan/[orderId]/return` | Submit return (auth) | ✓ 200 |
| `/return` | My returns (auth) | ✓ 200 |
| `/return/[returnNumber]` | Return detail (auth) | ✓ 200 |
| `/checkout` | Checkout (auth or guest) | ✓ 200 |
| `/pengembalian` | Return policy | ✓ 200 |
| `/pengiriman` | Shipping policy | ✓ 200 |
| `/syarat-ketentuan` | Terms & conditions | ✓ 200 |
| `/kebijakan-privasi` | Privacy policy | ✓ 200 |
| `/kontak` | Contact | ✓ 200 |
| `/bike-finder` | Bike recommendation tool | ✓ 200 |
| `/flash-sale` | Flash sale products | ✓ 200 |
| `/produk-terlaris` | Best sellers | ✓ 200 |
| `/produk/[slug]` | Product detail (dynamic — test with real slug) | ✓ 200 |
| `/panduan` | Guides & articles | ✓ 200 |

### Admin (requires login with admin role)
| Route | Description | Status |
|---|---|---|
| `/admin/pesanan` | Order management | ✓ 200 |
| `/admin/pesanan/[id]` | Order detail | ✓ 200 |
| `/admin/pengembalian` | Return management | ✓ 200 |
| `/admin/pengembalian/[id]` | Return detail | ✓ 200 |
| `/admin/produk` | Product management | ✓ 200 |
| `/admin/kategori` | Category management | ✓ 200 |
| `/admin/dashboard` | Dashboard stats | ✓ 200 |
| `/admin/pengaturan` | Settings | ✓ 200 |

### API
| Endpoint | Method | Auth | Rate Limit |
|---|---|---|---|
| `/api/checkout/create-order` | POST | Optional | 5/60s |
| `/api/webhooks/midtrans` | POST | Signature | — |
| `/api/returns` | GET/POST | Required | 3/60s (POST) |
| `/api/returns/[id]` | GET/PATCH | Required | — |
| `/api/orders/[id]` | GET/PATCH | Required | — |
| `/api/admin/*` | All | Required | — |

## Security Checklist
- [x] CSRF origin check on all mutation routes
- [x] Rate limiting on checkout, return, auth routes
- [x] Midtrans webhook signature verification
- [x] Midtrans Server Key server-only (never in client bundle)
- [x] Price/total never trusted from client — always calculated from DB
- [x] Auth session check on all admin/authenticated routes
- [x] Return status transitions enforced server-side
- [x] Rejection reason required on admin reject
- [x] Terminal statuses locked (no mutations after COMPLETED/REJECTED/CANCELLED)
- [x] X-Frame-Options: DENY
- [x] X-Content-Type-Options: nosniff
- [x] Strict-Transport-Security: max-age=63072000
- [x] Referrer-Policy: strict-origin-when-cross-origin
- [x] Permissions-Policy: camera=(), microphone=(), geolocation=()

## SEO Checklist
- [x] Unique title + description per page
- [x] Canonical URL on product pages (`www.sepedamania.com`)
- [x] metadataBase set to `https://www.sepedamania.com`
- [x] Robots.txt with sitemap URL
- [x] Sitemap.xml with all dynamic + static pages
- [x] Organization JSON-LD in root layout
- [x] Product + BreadcrumbList JSON-LD on product pages
- [x] Open Graph / Twitter card images (absolute URLs)

## PWA Checklist
- [x] manifest.json with icons, shortcuts, theme colors
- [x] Service worker with offline fallback page
- [x] Offline page at `/offline`
- [x] Apple touch icons
- [x] Favicon for all sizes

## Monitoring
- [x] Vercel Analytics (page views)
- [x] Vercel Speed Insights (Core Web Vitals)
- [x] Vercel Error Monitoring (automatic with ErrorBoundary)

## Deployment

### Production
```bash
git push origin main   # Auto-deploys to Vercel
```

### Vercel Dashboard
- Project: `sepedamania`
- Framework: Next.js 16
- Node: 22.x
- Build: `next build`
- Output: standalone

## Rollback Steps
1. In Vercel dashboard → Deployments → find previous stable deployment → ⋮ → Promote to Production
2. Or revert to previous commit:
   ```bash
   git revert HEAD --no-edit
   git push origin main
   ```
3. Verify: `curl -sI https://www.sepedamania.com | head -5`
4. Quick smoke test: `/`, `/produk/[slug]`, `/checkout`, policy pages

## Post-Launch Monitoring (first 24h)
- [ ] Monitor Vercel Analytics for traffic spikes
- [ ] Check webhook logs for payment failures
- [ ] Verify email delivery (Resend dashboard)
- [ ] Check error rates in Vercel dashboard
- [ ] Monitor checkout completion rate

## Critical Notes
- **No Xendit**: project uses **Midtrans** only. Webhook endpoint uses signature verification with server key.
- **Return period**: 7 days from `completedAt || paidAt`.
- **Eligible order statuses**: `DELIVERED` or `COMPLETED` with `paymentStatus = PAID`.
- **Database**: Supabase PostgreSQL — no direct admin access in production.
- **Migrations**: add-only — never drop or reset production data.
