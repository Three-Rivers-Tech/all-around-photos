# All Around Photos LLC - Site Redesign Spec

## Overview

Redesign the site from a drone photography/inspection services business to a Cricut-made apparel and custom goods shop with drone photography as a secondary service offering for realtors.

**Primary focus:** Custom apparel and goods (hoodies, t-shirts, coasters, etc.)
**Secondary focus:** Drone photography services for real estate agents

## Pages

| Route | Page | Purpose |
|-------|------|---------|
| `/` | Home | Brand hero + "Ready to Wear" / "Custom Orders" category cards + featured products + drone services link |
| `/shop` | Shop | Product catalog — filterable grid of ready-made items with add-to-cart |
| `/custom` | Custom Orders | Gallery of past custom work + custom order request form |
| `/cart` | Cart | Simple cart review — items, quantities, total, checkout button |
| Stripe hosted | Checkout | Redirect to Stripe Checkout — no checkout page on our site |
| `/checkout/success` | Success | Order confirmation / thank you page |
| `/checkout/cancel` | Cancel | Checkout cancelled — return to cart |
| `/drone` | Drone Services | Aerial photography gallery + service info + quote request form |
| `/about` | About | Brand story, the maker, the process |
| `/contact` | Contact | General contact form |

**Removed pages:** `/services`, `/book`, `/quote`, `/gallery` (functionality absorbed into new pages)

## Visual Design

**Aesthetic:** Dark & bold, streetwear-inspired (Noir Red)

- **Background:** `#0a0a0a` (near-black), `#111` / `#141414` for card surfaces
- **Accent:** `#ff3c3c` (bold red) for CTAs, prices, highlights
- **Text:** `#ffffff` primary, `#888` / `#666` secondary
- **Borders:** `#1a1a1a` / `#222` subtle separators
- **Typography:** Heavy weight (700-900), uppercase with letter-spacing for headings, clean sans-serif body (Inter)
- **Corners:** Small radius (2-4px) — sharp, not soft
- **Font changes:** Remove Playfair Display, use Inter throughout with heavier weights

## Homepage Layout (Category Cards Pattern)

1. **Brand hero** — tagline ("Made Different."), subtitle about custom apparel, "Shop Now" CTA
2. **Two category cards** side by side — "Ready to Wear" (links to /shop) and "Custom Orders" (links to /custom) with preview images
3. **Featured products** — 3-4 product cards from the shop
4. **Drone services banner** — subtle link card at bottom pointing to /drone

## Shop (`/shop`)

**Product data:** Defined in code as a static array (no CMS/database). Each product has: id (slug), name, description, price (number in cents), category, available sizes/colors (arrays), image path (relative to `/public/products/`).

**Stripe mapping:** Products use ad-hoc line items (name + unit_amount) when creating Checkout Sessions — no pre-created Stripe Price IDs needed. This keeps product management entirely in code.

**Product images:** Stored locally in `/public/products/` — owner provides actual photos.

**Layout:**
- Category filter bar: All | Hoodies | T-Shirts | Coasters | Other
- Product grid: 2 cols mobile, 3 cols tablet, 4 cols desktop
- Product card: image on dark background, name, price in red, "Add to Cart" button
- Quick-view modal on card click: size/color selection (if applicable), add-to-cart. Products without variants (e.g., coasters) skip variant selection and show just quantity + add-to-cart.
- No dedicated product detail page — the modal is the only detail view.

## Cart (`/cart`)

- Client-side only — React context + localStorage for persistence
- `CartProvider` wrapping the app at the layout level
- Cart page shows: item list with images, size/color, quantity controls, remove button, subtotal per item, total
- "Checkout" button redirects to Stripe Checkout

**Server-side validation:** The `/api/checkout` endpoint MUST validate all cart items against the authoritative product data in code before creating a Stripe session. Never trust client-submitted prices — look up each product by ID and use the server-side price. Reject unknown product IDs, invalid sizes/colors, and quantities outside allowed ranges (1-50).

**Stale cart handling:** Each product in the data array includes a `version` number (incremented when price/details change). The cart stores the version at add-time. At checkout, if a product's version has changed, the API returns an error with the updated product data so the cart page can prompt the user to review changes before retrying.

**Discontinued products:** If a product ID in the cart no longer exists in the product array, the checkout API rejects it with a clear error. The cart page should handle this by showing "This item is no longer available" and offering to remove it.

## Custom Orders (`/custom`)

**Two sections:**

1. **Gallery** — grid of past custom work photos (logos on hoodies, custom coasters, etc.)
2. **Order request form:**
   - Item type (dropdown: Hoodie, T-Shirt, Coaster, Other)
   - Quantity
   - Description (textarea)
   - Link to design reference (optional — URL to image, Google Drive, etc. — avoids needing file upload infrastructure)
   - Contact info (name, email, phone)
   - Submits via API route (`/api/custom-order`) which sends an email notification to the owner. Uses the same email approach as the existing contact/quote system (configured via environment variables).
   - On success, shows a confirmation page with a generated reference ID (e.g., `CO-1710091234567`) so the customer can reference their request in follow-up communication.
   - Owner follows up with Stripe Payment Link after discussing details

## Stripe Integration

**Shop items (ready-to-wear):**

- Cart "Checkout" button calls API route `/api/checkout`
- API route validates all items server-side against the product data (prices, IDs, sizes/colors) — never trusts client-submitted prices
- Creates a Stripe Checkout Session with validated line items using `price_data` (ad-hoc, no pre-created Price IDs)
- Uses Stripe idempotency keys (based on cart hash + timestamp) to prevent duplicate charges on retries
- Redirects customer to Stripe's hosted checkout page
- Success/cancel URLs redirect back to `/checkout/success` and `/checkout/cancel`
- No Stripe SDK on the frontend — server-side only via API route
- Pricing is all-inclusive (shipping costs baked into product prices)

**Error handling:**

- Stripe API failures: Return 502 with user-friendly message, log the Stripe error server-side
- Network errors: Cart page shows retry prompt
- Declined payments: Handled by Stripe's hosted checkout page (not our concern)

**Custom orders:**

- No automated Stripe integration — owner manually sends Stripe Payment Links after discussing order details

**Environment requirements:**

- `STRIPE_SECRET_KEY` env variable on Cloudflare Workers
- Stripe account with test/live keys configured
- No publishable key needed (we don't use Stripe Elements on the frontend — only server-side redirect to hosted checkout)

**Future (launch requirement gap):** Stripe webhook endpoint (`/api/webhook`) for automated order confirmation emails to customers. Until this is implemented, customers rely on Stripe's built-in receipt emails. This should be prioritized before production launch.

## Form Security (applies to all forms: custom order, drone quote, contact)

- **Honeypot field:** All forms include a hidden field (e.g., `website`) that bots will fill in. Server rejects submissions where this field is populated.
- **Rate limiting:** API routes enforce per-IP rate limits (e.g., 5 submissions per 15 minutes per endpoint). Use a simple in-memory map with TTL on Cloudflare Workers, or Cloudflare's built-in rate limiting rules.
- **Input sanitization:** All text inputs are trimmed and stripped of HTML tags server-side before processing. The design reference URL field is validated as a proper URL via Zod and sanitized (no `javascript:` or `data:` scheme URLs).
- **Email reliability:** All form submissions are logged to `console.log` as a fallback in case email delivery fails. The email stub can be replaced with a real service (Resend, SendGrid, etc.) when ready. The log provides a safety net for lost submissions.
- **Confirmation UX:** Custom order and drone quote forms show a confirmation screen with a generated reference ID (timestamp-based, e.g., `CO-1710091234567` or `DQ-1710091234567`) so customers can reference their request.

## Drone Services (`/drone`)

- Hero section with aerial photo
- Brief service description (offerings for realtors)
- Photo gallery grid of drone work samples
- Quote request form: name, email, property address, description of needs
- Submits via API route (`/api/drone-quote`) — sends email notification to owner, same form security measures as custom orders
- On success, shows confirmation with reference ID

## Navigation

**Sticky dark header:**
- Left: "ALL AROUND" bold logo text (letter-spaced, uppercase)
- Center links: Shop | Custom | Drone | About | Contact
- Right: Cart icon with red item-count badge
- Mobile: hamburger menu, same dark theme

**Footer:** Dark (#0a0a0a), links to all pages, contact info, legal pages (privacy, terms)

## Route Structure

All new pages live under the `(public)` route group, matching the existing pattern. The `(protected)/admin` section is removed — there's no admin panel in the new design (product data is in code, form submissions go to email).

## Checkout Success/Cancel Pages

- `/checkout/success` — static thank-you page. Shows a generic "Your order has been placed!" message with a note that they'll receive a receipt from Stripe via email. No session details retrieved (keeps it simple; Stripe sends the receipt automatically).
- `/checkout/cancel` — simple page with "Your checkout was cancelled" message and a link back to `/cart`.

## Database / Prisma

The existing Prisma schema is oriented around the old photography business (Photo, ClientGallery, Order, InspectionReport, etc.). Since the new design uses:
- Static product data in code (no database)
- Client-side cart (localStorage)
- Stripe for payments (hosted checkout)
- Email for form submissions

**Prisma and the database can be removed entirely.** This simplifies deployment and removes the Postgres dependency. The existing email utility (`src/lib/email.ts`) is kept for form submissions. Old Prisma models, seed scripts, and database utilities are deleted.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- Cloudflare Workers (via OpenNext)
- Zod (validation)

**New dependency:** `stripe` npm package (server-side only, for creating Checkout Sessions)

**Removed:** Prisma, `@prisma/client`, all database-related code

**Testing:** The existing codebase has one test file (`metadata-utils.test.ts`) which is being deleted along with its tested code. No test framework (Vitest, Playwright) is currently configured. Testing can be added as a future improvement.

## Image Optimization & SEO

**Image optimization:** All product, custom work, and drone gallery images use Next.js `Image` component with `sizes` prop for responsive loading. Images in `/public/products/` should be optimized before upload (recommend WebP format, max 1200x1200px for products). Since `images.unoptimized: true` is set for Cloudflare Workers compatibility, owner should provide pre-optimized images.

**Stripe product images:** When creating Checkout Sessions, pass product image URLs (absolute URLs using the site domain) in `product_data.images` so customers see product photos in the Stripe checkout UI.

**SEO trade-off (modal-only products):** The spec intentionally uses modal-only product views with no dedicated `/shop/[slug]` pages. This means individual products cannot be indexed by search engines or shared via direct URL. This is an acceptable trade-off for the MVP — the shop page itself is indexable, and social sharing will link to the shop page. If SEO for individual products becomes important, adding `/shop/[slug]` detail pages is a straightforward future addition.

**Product data validation:** Use a Zod schema to validate the product data array at module load (development) to catch missing fields, invalid prices, or malformed image paths early.

## Operational Workflow (No Admin Panel)

Since there is no admin panel, all operations happen through code deployments or external tools:

**Product management:**

- Adding/updating/removing products requires editing `src/lib/products.ts` and deploying
- Owner or developer updates the product array, adds images to `/public/products/`, and deploys via `npm run deploy`
- Document a simple checklist for the owner: 1) Send new product photos, 2) Developer updates code, 3) Deploy

**Order management:**

- All order tracking, refunds, and customer support happen through the **Stripe Dashboard** (dashboard.stripe.com)
- Stripe provides order history, payment details, and refund capabilities out of the box

**Custom order tracking:**

- Custom orders exist as emails — recommend the owner maintain a simple tracking spreadsheet (Google Sheets or Notion) with: reference ID, customer name, item type, status (Received / In Progress / Payment Sent / Completed)
- Reference IDs generated by the form submission make it easy to match emails to tracking entries

**Contact/drone quote management:**

- Same email-based workflow as custom orders

## Database Removal: Trade-offs & Future Path

Removing the database entirely is a valid MVP simplification. Explicit trade-offs:

- **No order history in the app:** All order data lives in Stripe. Owner uses Stripe Dashboard for historical records.
- **No custom order tracking in the app:** Custom orders are email-only with no status updates visible to customers.
- **No analytics in the app:** Product popularity, revenue trends, and customer behavior require manual Stripe exports or adding a third-party analytics tool (e.g., Plausible, Google Analytics).
- **No customer accounts:** No login, order history, or saved preferences for repeat customers.
- **Email as single point of failure:** If email delivery fails, form submissions are only captured in server logs.

**Future migration path (if business scales):**

1. Add a lightweight database (Cloudflare D1, Turso, or PlanetScale) for order tracking and custom order status
2. Add customer accounts with order history
3. Add product inventory tracking
4. Add a simple admin dashboard for the owner
5. Add Stripe webhooks for automated order lifecycle management

These can be added incrementally without restructuring the site.

## What Gets Removed/Replaced

- All inspection/commercial photography service content
- Event photography content
- Booking calendar component
- Quote request system (replaced by simpler forms on /custom and /drone)
- Service packages and pricing tiers
- Unsplash placeholder images (replaced with owner's actual product/drone photos)
- Playfair Display font
- Light/blue color theme (replaced with dark/red)
