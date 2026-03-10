# Site Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the All Around Photos site from drone photography services to a Cricut apparel shop (primary) with drone photography for realtors (secondary), including Stripe checkout.

**Architecture:** Reshape the existing Next.js 16 App Router site in place. Remove old photography/inspection content, Prisma, and database dependencies. Add product data layer, client-side cart (React context + localStorage), and Stripe Checkout integration via server-side API route. Retheme from light/blue to dark/red streetwear aesthetic.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, Cloudflare Workers, Zod, Stripe (new)

**Spec:** `docs/superpowers/specs/2026-03-10-site-redesign-design.md`

---

## File Structure

### Files to Create

| File | Responsibility |
| --- | --- |
| `src/lib/products.ts` | Product data array + types + helper functions (getProductBySlug, getProductsByCategory) |
| `src/lib/cart.tsx` | CartProvider context, useCart hook, localStorage persistence |
| `src/lib/validations/custom-order.ts` | Zod schema for custom order form |
| `src/lib/validations/drone-quote.ts` | Zod schema for drone quote form |
| `src/lib/validations/contact.ts` | Zod schema for contact form |
| `src/lib/email-templates.ts` | Email body generators for custom order, drone quote, and contact forms |
| `src/app/(public)/shop/page.tsx` | Shop page with product grid + category filter |
| `src/app/(public)/custom/page.tsx` | Custom orders page with gallery + order form |
| `src/app/(public)/cart/page.tsx` | Cart review page |
| `src/app/(public)/checkout/success/page.tsx` | Static checkout success page |
| `src/app/(public)/checkout/cancel/page.tsx` | Checkout cancel page |
| `src/app/(public)/drone/page.tsx` | Drone services page with gallery + quote form |
| `src/app/api/checkout/route.ts` | Stripe Checkout Session creation API route |
| `src/app/api/custom-order/route.ts` | Custom order form submission API route |
| `src/app/api/drone-quote/route.ts` | Drone quote form submission API route |
| `src/app/api/contact/route.ts` | Contact form submission API route |
| `src/components/shop/ProductCard.tsx` | Product card component for grid display |
| `src/components/shop/ProductModal.tsx` | Quick-view modal with variant selection + add-to-cart |
| `src/components/shop/CategoryFilter.tsx` | Category filter bar for shop page |
| `src/components/cart/CartItem.tsx` | Single cart item row with quantity controls |
| `src/components/cart/CartIcon.tsx` | Header cart icon with item count badge |
| `src/components/home/HeroSection.tsx` | Rewrite: dark theme brand hero |
| `src/components/home/CategoryCards.tsx` | "Ready to Wear" / "Custom Orders" side-by-side cards |
| `src/components/home/FeaturedProducts.tsx` | Featured products row from product data |
| `src/components/home/DroneServicesBanner.tsx` | Link banner to /drone page |
| `src/components/forms/CustomOrderForm.tsx` | Custom order request form |
| `src/components/forms/DroneQuoteForm.tsx` | Drone photography quote request form |
| `src/components/forms/ContactForm.tsx` | General contact form |
| `public/products/` | Directory for product images (owner provides) |
| `public/custom-work/` | Directory for custom work gallery images (owner provides) |
| `public/drone/` | Directory for drone photography gallery images (owner provides) |

### Files to Modify

| File | Changes |
| --- | --- |
| `tailwind.config.ts` | Replace color palette (dark/red theme), remove serif font |
| `src/app/globals.css` | Replace theme: dark background, remove Playfair Display import, update component classes |
| `src/app/layout.tsx` | Remove Playfair Display font, update metadata/structured data, wrap with CartProvider, dark body bg |
| `src/app/page.tsx` | Replace with new homepage components |
| `src/components/layout/Header.tsx` | Dark theme, new nav links, add CartIcon |
| `src/components/layout/Footer.tsx` | Dark theme, updated links |
| `src/app/(public)/about/page.tsx` | Retheme + rewrite content for new business focus |
| `src/app/(public)/contact/page.tsx` | Retheme + update form fields for general inquiries |
| `src/app/(public)/privacy/page.tsx` | Retheme (content stays) |
| `src/app/(public)/terms/page.tsx` | Retheme (content stays) |
| `src/app/not-found.tsx` | Retheme |
| `src/lib/constants.ts` | Update site config, contact info, remove old categories/pricing |
| `src/lib/utils.ts` | Keep cn/formatCurrency, remove generateAccessCode |
| `src/lib/email.ts` | Rewrite: generic sendEmailNotification function for all forms |
| `next.config.ts` | Remove Prisma externals, remove old rewrites, remove unsplash remote patterns |
| `package.json` | Add stripe, remove prisma/@prisma/client |

### Files to Delete

| File/Directory | Reason |
| --- | --- |
| `src/app/(public)/services/page.tsx` | Replaced by /shop and /drone |
| `src/app/(public)/book/page.tsx` | No booking system in new design |
| `src/app/(public)/quote/page.tsx` | Replaced by forms on /custom and /drone |
| `src/app/(public)/gallery/page.tsx` | Replaced by shop and drone galleries |
| `src/app/(protected)/` | No admin panel |
| `src/app/api/gallery/` | Old API |
| `src/app/api/hero/` | Old API |
| `src/app/api/quote-requests/` | Old API |
| `src/app/api/services/` | Old API |
| `src/app/api/testimonials/` | Old API |
| `src/components/forms/BookingCalendar.tsx` | No booking |
| `src/components/forms/QuoteRequestForm.tsx` | Replaced by new forms |
| `src/components/gallery/` | Old gallery components |
| `src/components/home/FeaturedWork.tsx` | Replaced by FeaturedProducts |
| `src/components/home/ServiceOverview.tsx` | Replaced by CategoryCards |
| `src/components/home/Testimonials.tsx` | Not in new design |
| `src/components/services/` | Old services components |
| `src/components/ui/PlaceholderImage.tsx` | Using real images |
| `src/components/ui/StarRating.tsx` | No reviews/testimonials |
| `src/components/ui/DatePicker.tsx` | No booking dates |
| `src/hooks/useTestimonialRotation.ts` | No testimonials |
| `src/hooks/useIntersectionObserver.ts` | Used by deleted gallery components |
| `src/components/layout/Navigation.tsx` | Replaced by inline nav in Header |
| `src/components/layout/index.ts` | Barrel export no longer needed |
| `src/lib/database.ts` | Removing Prisma |
| `src/lib/database-stub.ts` | Removing Prisma |
| `src/lib/db-test.ts` | Removing Prisma |
| `src/lib/db-utils.ts` | Removing Prisma |
| `src/lib/prisma.ts` | Removing Prisma |
| `src/lib/mock-data.ts` | Old mock data |
| `src/lib/placeholder-images.ts` | Using real images |
| `src/lib/image-utils.ts` | Old image utilities |
| `src/lib/metadata-utils.ts` | Old metadata tied to photos |
| `src/lib/metadata-utils-stub.ts` | Old stub |
| `src/lib/config/development.ts` | Old dev config |
| `src/lib/constants/testimonials.ts` | No testimonials |
| `src/lib/factories/` | Old repository factory |
| `src/lib/repositories/` | Old Prisma repositories |
| `src/lib/validations.ts` | Old Prisma-dependent validations (replaced by new per-form schemas) |
| `src/lib/validations/photo.ts` | Old photo validation |
| `src/lib/__tests__/metadata-utils.test.ts` | Testing deleted code |
| `src/types/api.ts` | Old API types |
| `src/types/database.ts` | Old database types |
| `src/types/index.ts` | Old Prisma-dependent types (replaced inline) |
| `prisma/` | Entire Prisma directory |
| `scripts/` | Old database scripts |
| `public/sw.js` | Old service worker |
| `public/manifest.json` | Will recreate if needed |

---

## Chunk 1: Foundation (cleanup + theme + dependencies)

### Task 1: Remove old dependencies and install Stripe

**Files:**

- Modify: `package.json`

- [ ] **Step 1: Uninstall old packages**

```bash
npm uninstall prisma @prisma/client lucide-react
```

- [ ] **Step 2: Install Stripe**

```bash
npm install stripe
```

- [ ] **Step 3: Remove broken db scripts from package.json**

Remove the `"prisma"` seed config and all `"db:*"` scripts from package.json (they reference the now-uninstalled prisma).

- [ ] **Step 4: Verify package.json changes**

Run: `cat package.json | grep -E "stripe|prisma|lucide"`
Expected: `stripe` present, `prisma` and `lucide-react` absent

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: replace prisma with stripe dependency, remove lucide-react"
```

### Task 2: Delete old files

**Files:**

- Delete: All files listed in "Files to Delete" section above

- [ ] **Step 1: Delete old pages**

```bash
rm -rf src/app/(public)/services src/app/(public)/book src/app/(public)/quote src/app/(public)/gallery
rm -rf src/app/(protected)
```

- [ ] **Step 2: Delete old API routes**

```bash
rm -rf src/app/api/gallery src/app/api/hero src/app/api/quote-requests src/app/api/services src/app/api/testimonials
```

- [ ] **Step 3: Delete old components**

```bash
rm -f src/components/forms/BookingCalendar.tsx src/components/forms/QuoteRequestForm.tsx
rm -rf src/components/gallery src/components/services
rm -f src/components/home/FeaturedWork.tsx src/components/home/ServiceOverview.tsx src/components/home/Testimonials.tsx
rm -f src/components/ui/PlaceholderImage.tsx src/components/ui/StarRating.tsx src/components/ui/DatePicker.tsx
rm -f src/components/layout/Navigation.tsx src/components/layout/index.ts
```

- [ ] **Step 4: Delete old lib files**

```bash
rm -f src/lib/database.ts src/lib/database-stub.ts src/lib/db-test.ts src/lib/db-utils.ts src/lib/prisma.ts
rm -f src/lib/mock-data.ts src/lib/placeholder-images.ts src/lib/image-utils.ts
rm -f src/lib/metadata-utils.ts src/lib/metadata-utils-stub.ts
rm -f src/lib/validations.ts src/lib/validations/photo.ts
rm -rf src/lib/config src/lib/constants/testimonials.ts src/lib/factories src/lib/repositories
rm -f src/lib/__tests__/metadata-utils.test.ts
```

- [ ] **Step 5: Delete old types, hooks, and misc**

```bash
rm -f src/types/api.ts src/types/database.ts src/types/index.ts src/types/globals.d.ts src/types/utils.ts
rm -f src/hooks/useTestimonialRotation.ts src/hooks/useIntersectionObserver.ts
rm -rf prisma scripts
rm -f public/sw.js public/manifest.json
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: remove old photography/inspection code, prisma, and database layer"
```

### Task 3: Update Tailwind config with dark/red theme

**Files:**

- Modify: `tailwind.config.ts`

- [ ] **Step 1: Replace the color palette and font config**

Replace the entire `theme.extend` section in `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0a0a0a',
          card: '#111111',
          surface: '#141414',
          hover: '#1a1a1a',
        },
        accent: {
          DEFAULT: '#ff3c3c',
          hover: '#e63535',
          muted: 'rgba(255, 60, 60, 0.15)',
        },
        border: {
          DEFAULT: '#1a1a1a',
          light: '#222222',
        },
        text: {
          primary: '#ffffff',
          secondary: '#888888',
          muted: '#666666',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '2px',
        DEFAULT: '4px',
        md: '4px',
        lg: '6px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 2: Verify no build errors**

Run: `npx tsc --noEmit 2>&1 | head -20` (expect errors from deleted imports — that's fine for now, we'll fix in subsequent tasks)

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts
git commit -m "feat: replace color palette with dark/red streetwear theme"
```

### Task 4: Update globals.css

**Files:**

- Modify: `src/app/globals.css`

- [ ] **Step 1: Replace globals.css with dark theme**

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

@import 'tailwindcss';
@config '../../tailwind.config.ts';

@layer base {
  html {
    font-family: 'Inter', system-ui, sans-serif;
  }

  body {
    background-color: #0a0a0a;
    color: #ffffff;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: 'Inter', system-ui, sans-serif;
    font-weight: 700;
  }
}

@layer components {
  .btn-primary {
    @apply bg-accent hover:bg-accent-hover rounded px-4 py-2 font-semibold text-white transition-colors duration-200;
  }

  .btn-outline {
    @apply rounded border border-border-light bg-transparent px-4 py-2 font-semibold text-white transition-colors duration-200 hover:bg-bg-hover;
  }

  .card {
    @apply rounded border border-border bg-bg-card;
  }

  .input-field {
    @apply w-full rounded border border-border-light bg-bg-surface px-3 py-2 text-white placeholder-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: update globals.css with dark theme styles"
```

### Task 5: Update constants and utilities

**Files:**

- Modify: `src/lib/constants.ts`
- Modify: `src/lib/utils.ts`

- [ ] **Step 1: Replace constants.ts**

```typescript
export const SITE_CONFIG = {
  name: 'All Around Photos LLC',
  description: 'Custom apparel, Cricut designs, and drone photography services',
  url: 'https://allaroundphotos.com',
  ogImage: '/og-image.svg',
} as const;

export const CONTACT_INFO = {
  phone: '(555) 123-4567',
  email: 'info@allaroundphotos.com',
  address: '123 Main St, City, State 12345',
} as const;

export const PRODUCT_CATEGORIES = {
  HOODIES: 'hoodies',
  TSHIRTS: 'tshirts',
  COASTERS: 'coasters',
  OTHER: 'other',
} as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[keyof typeof PRODUCT_CATEGORIES];
```

- [ ] **Step 2: Clean up utils.ts**

Keep `cn`, `formatCurrency`, `formatDate`, `isValidEmail`, `debounce`. Remove `generateAccessCode`. Note: `formatCurrency` already takes dollar amounts (not cents). Throughout the plan, product prices are in cents and we call `formatCurrency(product.price / 100)` — no change needed to the function itself.

- [ ] **Step 3: Commit**

```bash
git add src/lib/constants.ts src/lib/utils.ts
git commit -m "feat: update constants for new business focus, clean up utils"
```

### Task 6: Update next.config.ts

**Files:**

- Modify: `next.config.ts`

- [ ] **Step 1: Simplify next.config.ts**

Remove Prisma externals, old rewrites, and unsplash remote patterns:

```typescript
import type { NextConfig } from 'next';

if (process.env.NODE_ENV === 'development') {
  const { initOpenNextCloudflareForDev } = require('@opennextjs/cloudflare');
  initOpenNextCloudflareForDev();
}

const nextConfig: NextConfig = {
  typescript: {
    // Keep during migration — remove once all types are clean
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

- [ ] **Step 2: Commit**

```bash
git add next.config.ts
git commit -m "chore: simplify next.config, remove prisma and old rewrites"
```

### Task 7: Update layout.tsx (foundation pass)

**Files:**

- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Rewrite layout.tsx**

Remove Playfair Display, update metadata, update body classes. CartProvider will be added in a later task once the cart context is built.

```typescript
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SITE_CONFIG } from '@/lib/constants';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    'custom apparel',
    'cricut designs',
    'custom hoodies',
    'custom t-shirts',
    'custom coasters',
    'drone photography',
    'real estate photography',
    'aerial photography',
  ],
  authors: [{ name: SITE_CONFIG.name }],
  creator: SITE_CONFIG.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_CONFIG.url,
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: '/favicon.ico', sizes: 'any' }],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#0a0a0a',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-bg font-sans text-text-primary antialiased">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: update layout with dark theme, new metadata, remove Playfair Display"
```

### Task 8: Update Header component

**Files:**

- Modify: `src/components/layout/Header.tsx`

- [ ] **Step 1: Rewrite Header with dark theme and new nav**

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Shop', href: '/shop' },
  { name: 'Custom', href: '/custom' },
  { name: 'Drone', href: '/drone' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/95 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-lg font-black uppercase tracking-[0.15em] text-white transition-colors hover:text-accent"
          >
            All Around
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-8 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-semibold uppercase tracking-wide text-text-secondary transition-colors hover:text-white"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Cart icon placeholder — will be replaced with CartIcon component */}
          <div className="hidden md:flex items-center">
            <Link
              href="/cart"
              className="relative text-text-secondary transition-colors hover:text-white"
              aria-label="Shopping cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded p-2 text-text-secondary transition-colors hover:text-white md:hidden"
            aria-label="Toggle menu"
          >
            <div className="flex h-6 w-6 flex-col items-center justify-center">
              <span
                className={cn(
                  'block h-0.5 w-5 bg-current transition-all duration-300',
                  isMenuOpen ? 'translate-y-1 rotate-45' : '-translate-y-1'
                )}
              />
              <span
                className={cn(
                  'block h-0.5 w-5 bg-current transition-all duration-300',
                  isMenuOpen ? 'opacity-0' : 'opacity-100'
                )}
              />
              <span
                className={cn(
                  'block h-0.5 w-5 bg-current transition-all duration-300',
                  isMenuOpen ? '-translate-y-1 -rotate-45' : 'translate-y-1'
                )}
              />
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            'overflow-hidden transition-all duration-300 ease-in-out md:hidden',
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <nav className="space-y-1 border-t border-border py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2 text-sm font-semibold uppercase tracking-wide text-text-secondary transition-colors hover:text-white"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/cart"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-2 text-sm font-semibold uppercase tracking-wide text-text-secondary transition-colors hover:text-white"
            >
              Cart
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/Header.tsx
git commit -m "feat: rewrite header with dark theme, new nav, cart link"
```

### Task 9: Update Footer component

**Files:**

- Modify: `src/components/layout/Footer.tsx`

- [ ] **Step 1: Rewrite Footer with dark theme and new links**

```tsx
import Link from 'next/link';
import { SITE_CONFIG, CONTACT_INFO } from '@/lib/constants';

const footerNavigation = {
  shop: [
    { name: 'All Products', href: '/shop' },
    { name: 'Custom Orders', href: '/custom' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Drone Services', href: '/drone' },
    { name: 'Contact', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <span className="text-lg font-black uppercase tracking-[0.15em] text-white">
              All Around
            </span>
            <p className="mt-4 text-sm leading-relaxed text-text-muted">
              Custom apparel, Cricut designs, and professional drone photography services.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white">Shop</h3>
            <ul className="mt-4 space-y-2">
              {footerNavigation.shop.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-text-muted transition-colors hover:text-white">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white">Company</h3>
            <ul className="mt-4 space-y-2">
              {footerNavigation.company.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-text-muted transition-colors hover:text-white">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white">Contact</h3>
            <div className="mt-4 space-y-2 text-sm text-text-muted">
              <p>
                <a href={`tel:${CONTACT_INFO.phone}`} className="transition-colors hover:text-white">
                  {CONTACT_INFO.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${CONTACT_INFO.email}`} className="transition-colors hover:text-white">
                  {CONTACT_INFO.email}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 flex flex-col items-center justify-between border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-text-muted">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <div className="mt-4 flex space-x-6 md:mt-0">
            {footerNavigation.legal.map((item) => (
              <Link key={item.name} href={item.href} className="text-sm text-text-muted transition-colors hover:text-white">
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/Footer.tsx
git commit -m "feat: rewrite footer with dark theme and updated nav"
```

### Task 10: Update remaining pages (about, contact, privacy, terms, not-found)

**Files:**

- Modify: `src/app/(public)/about/page.tsx`
- Modify: `src/app/(public)/contact/page.tsx`
- Modify: `src/app/(public)/privacy/page.tsx`
- Modify: `src/app/(public)/terms/page.tsx`
- Modify: `src/app/not-found.tsx`

- [ ] **Step 1: Retheme about page**

Rewrite with dark theme classes (`bg-bg`, `text-white`, `text-text-secondary`, `bg-bg-card`, `border-border`). Update content to reflect the new business (custom apparel + drone photography). Remove references to FAA certifications and inspection services from the main narrative; keep drone photography as a service mention.

- [ ] **Step 2: Retheme contact page**

Replace all light theme classes with dark theme equivalents. Update the service dropdown options: "Custom Apparel", "Drone Photography", "General Inquiry", "Other". Remove old photography service references.

- [ ] **Step 3: Retheme privacy and terms pages**

Quick pass: replace `bg-neutral-50` with `bg-bg`, `text-neutral-900` with `text-white`, `text-neutral-600` with `text-text-secondary`. Keep content.

- [ ] **Step 4: Retheme not-found page**

Dark theme styling. Replace any links to old pages (e.g., `/gallery`, `/services`) with links to `/shop` and `/drone`. CTA: "Browse Shop" linking to `/shop`.

- [ ] **Step 5: Commit**

```bash
git add src/app/(public)/about src/app/(public)/contact src/app/(public)/privacy src/app/(public)/terms src/app/not-found.tsx
git commit -m "feat: retheme about, contact, privacy, terms, and 404 pages"
```

### Task 11: Create placeholder homepage

**Files:**

- Modify: `src/app/page.tsx`

- [ ] **Step 1: Replace homepage with temporary placeholder**

This will be replaced with proper components in Chunk 2, but the site needs to build:

```tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center">
      <h1 className="mb-4 text-5xl font-black uppercase tracking-tight md:text-7xl">
        Made <span className="text-accent">Different.</span>
      </h1>
      <p className="mb-8 max-w-xl text-lg text-text-secondary">
        Custom apparel, Cricut designs, and drone photography services.
      </p>
      <div className="flex gap-4">
        <Link href="/shop" className="btn-primary px-8 py-3 text-lg">
          Shop Now
        </Link>
        <Link href="/custom" className="btn-outline px-8 py-3 text-lg">
          Custom Orders
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify the site builds**

Run: `npm run build 2>&1 | tail -20`
Expected: Build succeeds (may have type-check warnings since we set `ignoreBuildErrors: true`)

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: replace homepage with temporary dark-themed placeholder"
```

---

## Chunk 2: Product Data + Shop Page + Cart

### Task 12: Create product data layer

**Files:**

- Create: `src/lib/products.ts`

- [ ] **Step 1: Create product types and data**

```typescript
import { z } from 'zod';
import { type ProductCategory, PRODUCT_CATEGORIES } from '@/lib/constants';

// Zod schema for build-time validation of product data
const productSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().int().positive(), // cents
  category: z.enum(['hoodies', 'tshirts', 'coasters', 'other']),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  image: z.string().startsWith('/products/'),
  featured: z.boolean().optional(),
  version: z.number().int().positive(), // increment when price/details change
});

export type Product = z.infer<typeof productSchema>;

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

// Placeholder products — owner will replace images
const rawProducts = [
  {
    id: 'classic-hoodie',
    name: 'Classic Logo Hoodie',
    description: 'Premium heavyweight hoodie with custom Cricut-cut design.',
    price: 4500,
    category: PRODUCT_CATEGORIES.HOODIES,
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colors: ['Black', 'White', 'Gray'],
    image: '/products/placeholder-hoodie.jpg',
    featured: true,
    version: 1,
  },
  {
    id: 'graphic-tee',
    name: 'Graphic Tee',
    description: 'Soft cotton tee with precision Cricut vinyl graphics.',
    price: 2500,
    category: PRODUCT_CATEGORIES.TSHIRTS,
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colors: ['Black', 'White'],
    image: '/products/placeholder-tee.jpg',
    featured: true,
    version: 1,
  },
  {
    id: 'custom-coasters-set',
    name: 'Custom Coasters (Set of 4)',
    description: 'Handcrafted coasters with custom designs.',
    price: 1500,
    category: PRODUCT_CATEGORIES.COASTERS,
    image: '/products/placeholder-coasters.jpg',
    featured: true,
    version: 1,
  },
  {
    id: 'premium-hoodie',
    name: 'Premium Cut Hoodie',
    description: 'Heavyweight hoodie with multi-layer Cricut design.',
    price: 5500,
    category: PRODUCT_CATEGORIES.HOODIES,
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colors: ['Black', 'Navy'],
    image: '/products/placeholder-hoodie-2.jpg',
    version: 1,
  },
  {
    id: 'vintage-tee',
    name: 'Vintage Logo Tee',
    description: 'Retro-style tee with distressed Cricut print.',
    price: 2800,
    category: PRODUCT_CATEGORIES.TSHIRTS,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Charcoal'],
    image: '/products/placeholder-tee-2.jpg',
    version: 1,
  },
  {
    id: 'photo-coasters',
    name: 'Photo Coasters (Set of 4)',
    description: 'Custom photo-printed coasters — great for gifts.',
    price: 2000,
    category: PRODUCT_CATEGORIES.COASTERS,
    image: '/products/placeholder-coasters-2.jpg',
    version: 1,
  },
] satisfies Product[];

// Validate product data at module load (catches errors at dev/build time)
export const products: Product[] = rawProducts.map((p) => productSchema.parse(p));

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.id === slug);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((p) => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}
```

- [ ] **Step 2: Create placeholder product images directory**

```bash
mkdir -p public/products
```

Create a simple placeholder SVG for products so the site can render:

Create `public/products/placeholder.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <rect width="400" height="400" fill="#141414"/>
  <text x="200" y="200" font-family="sans-serif" font-size="16" fill="#666" text-anchor="middle" dominant-baseline="middle">Product Image</text>
</svg>
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/products.ts public/products/
git commit -m "feat: add product data layer with types and helper functions"
```

### Task 13: Create cart context

**Files:**

- Create: `src/lib/cart.tsx`

- [ ] **Step 1: Create CartProvider with localStorage persistence**

```tsx
'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Product, CartItem } from '@/lib/products';

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_STORAGE_KEY = 'all-around-cart';

function getCartItemKey(productId: string, size?: string, color?: string): string {
  return `${productId}-${size ?? 'none'}-${color ?? 'none'}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      // Ignore parse errors
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addItem = useCallback((product: Product, quantity = 1, size?: string, color?: string) => {
    setItems((prev) => {
      const key = getCartItemKey(product.id, size, color);
      const existing = prev.find(
        (item) => getCartItemKey(item.product.id, item.size, item.color) === key
      );
      if (existing) {
        return prev.map((item) =>
          getCartItemKey(item.product.id, item.size, item.color) === key
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, size, color }];
    });
  }, []);

  const removeItem = useCallback((productId: string, size?: string, color?: string) => {
    const key = getCartItemKey(productId, size, color);
    setItems((prev) =>
      prev.filter((item) => getCartItemKey(item.product.id, item.size, item.color) !== key)
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number, size?: string, color?: string) => {
      if (quantity <= 0) {
        removeItem(productId, size, color);
        return;
      }
      const key = getCartItemKey(productId, size, color);
      setItems((prev) =>
        prev.map((item) =>
          getCartItemKey(item.product.id, item.size, item.color) === key
            ? { ...item, quantity }
            : item
        )
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
```

- [ ] **Step 2: Wrap layout.tsx with CartProvider**

In `src/app/layout.tsx`, import `CartProvider` from `@/lib/cart` and wrap the body content:

```tsx
import { CartProvider } from '@/lib/cart';

// ... in the return:
<body className="bg-bg font-sans text-text-primary antialiased">
  <CartProvider>
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  </CartProvider>
</body>
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/cart.tsx src/app/layout.tsx
git commit -m "feat: add cart context with localStorage persistence"
```

### Task 14: Create CartIcon component for header

**Files:**

- Create: `src/components/cart/CartIcon.tsx`
- Modify: `src/components/layout/Header.tsx`

- [ ] **Step 1: Create CartIcon component**

```tsx
'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart';

export function CartIcon() {
  const { totalItems } = useCart();

  return (
    <Link
      href="/cart"
      className="relative text-text-secondary transition-colors hover:text-white"
      aria-label={`Shopping cart with ${totalItems} items`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
        />
      </svg>
      {totalItems > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </Link>
  );
}
```

- [ ] **Step 2: Replace the cart link placeholder in Header.tsx with CartIcon**

Replace the static cart link in the desktop nav with `<CartIcon />` (import from `@/components/cart/CartIcon`).

- [ ] **Step 3: Commit**

```bash
git add src/components/cart/CartIcon.tsx src/components/layout/Header.tsx
git commit -m "feat: add CartIcon component with item count badge"
```

### Task 15: Create shop page components

**Files:**

- Create: `src/components/shop/CategoryFilter.tsx`
- Create: `src/components/shop/ProductCard.tsx`
- Create: `src/components/shop/ProductModal.tsx`

- [ ] **Step 1: Create CategoryFilter**

```tsx
'use client';

import { cn } from '@/lib/utils';
import { PRODUCT_CATEGORIES, type ProductCategory } from '@/lib/constants';

interface CategoryFilterProps {
  selected: ProductCategory | 'all';
  onChange: (category: ProductCategory | 'all') => void;
}

const categories = [
  { label: 'All', value: 'all' as const },
  { label: 'Hoodies', value: PRODUCT_CATEGORIES.HOODIES },
  { label: 'T-Shirts', value: PRODUCT_CATEGORIES.TSHIRTS },
  { label: 'Coasters', value: PRODUCT_CATEGORIES.COASTERS },
  { label: 'Other', value: PRODUCT_CATEGORIES.OTHER },
];

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onChange(cat.value)}
          className={cn(
            'rounded px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-colors',
            selected === cat.value
              ? 'bg-accent text-white'
              : 'border border-border-light bg-bg-surface text-text-secondary hover:text-white'
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create ProductCard**

```tsx
'use client';

import Image from 'next/image';
import type { Product } from '@/lib/products';
import { formatCurrency } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <button
      onClick={() => onClick(product)}
      className="group w-full text-left rounded border border-border bg-bg-card transition-all hover:border-border-light hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden rounded-t">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold uppercase tracking-wide text-white">
          {product.name}
        </h3>
        <p className="mt-1 text-lg font-black text-accent">
          {formatCurrency(product.price / 100)}
        </p>
      </div>
    </button>
  );
}
```

- [ ] **Step 3: Create ProductModal**

```tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Product } from '@/lib/products';
import { useCart } from '@/lib/cart';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const needsSize = product.sizes && product.sizes.length > 0;
  const needsColor = product.colors && product.colors.length > 0;
  const canAdd = (!needsSize || selectedSize) && (!needsColor || selectedColor);

  const handleAdd = () => {
    if (!canAdd) return;
    addItem(product, quantity, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80" />
      <div
        className="relative w-full max-w-lg rounded border border-border-light bg-bg-card p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-text-muted transition-colors hover:text-white"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image */}
        <div className="relative mb-4 aspect-square overflow-hidden rounded">
          <Image src={product.image} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 90vw, 500px" />
        </div>

        {/* Info */}
        <h2 className="text-xl font-black uppercase tracking-wide text-white">{product.name}</h2>
        <p className="mt-1 text-2xl font-black text-accent">{formatCurrency(product.price / 100)}</p>
        <p className="mt-2 text-sm text-text-secondary">{product.description}</p>

        {/* Size selector */}
        {needsSize && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-text-secondary">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes!.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    'rounded border px-3 py-1 text-sm font-semibold transition-colors',
                    selectedSize === size
                      ? 'border-accent bg-accent-muted text-white'
                      : 'border-border-light text-text-secondary hover:text-white'
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color selector */}
        {needsColor && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-text-secondary">Color</p>
            <div className="flex flex-wrap gap-2">
              {product.colors!.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    'rounded border px-3 py-1 text-sm font-semibold transition-colors',
                    selectedColor === color
                      ? 'border-accent bg-accent-muted text-white'
                      : 'border-border-light text-text-secondary hover:text-white'
                  )}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="mt-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-text-secondary">Quantity</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="rounded border border-border-light px-3 py-1 text-white transition-colors hover:bg-bg-hover"
            >
              -
            </button>
            <span className="w-8 text-center font-bold text-white">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="rounded border border-border-light px-3 py-1 text-white transition-colors hover:bg-bg-hover"
            >
              +
            </button>
          </div>
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAdd}
          disabled={!canAdd}
          className={cn(
            'mt-6 w-full rounded py-3 text-sm font-bold uppercase tracking-wide transition-colors',
            canAdd
              ? added
                ? 'bg-green-600 text-white'
                : 'bg-accent text-white hover:bg-accent-hover'
              : 'cursor-not-allowed bg-bg-surface text-text-muted'
          )}
        >
          {added ? 'Added!' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/shop/
git commit -m "feat: add shop components — CategoryFilter, ProductCard, ProductModal"
```

### Task 16: Create shop page

**Files:**

- Create: `src/app/(public)/shop/page.tsx`

- [ ] **Step 1: Create shop page with filter and product grid**

```tsx
'use client';

import { useState } from 'react';
import { products } from '@/lib/products';
import type { Product } from '@/lib/products';
import type { ProductCategory } from '@/lib/constants';
import { CategoryFilter } from '@/components/shop/CategoryFilter';
import { ProductCard } from '@/components/shop/ProductCard';
import { ProductModal } from '@/components/shop/ProductModal';

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-bg py-12">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-black uppercase tracking-tight text-white md:text-5xl">
            Shop
          </h1>
          <p className="mt-4 text-text-secondary">
            Cricut-crafted hoodies, tees, coasters, and more.
          </p>
        </div>

        <div className="mb-8 flex justify-center">
          <CategoryFilter selected={selectedCategory} onChange={setSelectedCategory} />
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={setSelectedProduct}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <p className="mt-12 text-center text-text-muted">
            No products in this category yet. Check back soon!
          </p>
        )}
      </div>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}
```

Note: Metadata cannot be exported from a client component. Either extract it to a separate `metadata.ts` file or use `generateMetadata`. For simplicity, add metadata in a `layout.tsx` for the shop route or accept it's client-only.

- [ ] **Step 2: Commit**

```bash
git add src/app/(public)/shop/
git commit -m "feat: add shop page with product grid, filtering, and quick-view modal"
```

### Task 17: Create cart page

**Files:**

- Create: `src/components/cart/CartItem.tsx`
- Create: `src/app/(public)/cart/page.tsx`

- [ ] **Step 1: Create CartItem component**

```tsx
'use client';

import Image from 'next/image';
import type { CartItem as CartItemType } from '@/lib/products';
import { useCart } from '@/lib/cart';
import { formatCurrency } from '@/lib/utils';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const { product, quantity, size, color } = item;

  return (
    <div className="flex items-center gap-4 border-b border-border py-4">
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded">
        <Image src={product.image} alt={product.name} fill className="object-cover" sizes="80px" />
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-bold uppercase tracking-wide text-white">{product.name}</h3>
        {(size || color) && (
          <p className="mt-0.5 text-xs text-text-muted">
            {[size, color].filter(Boolean).join(' / ')}
          </p>
        )}
        <p className="mt-1 font-bold text-accent">{formatCurrency(product.price / 100)}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(product.id, quantity - 1, size, color)}
          className="rounded border border-border-light px-2 py-0.5 text-sm text-white hover:bg-bg-hover"
        >
          -
        </button>
        <span className="w-6 text-center text-sm font-bold text-white">{quantity}</span>
        <button
          onClick={() => updateQuantity(product.id, quantity + 1, size, color)}
          className="rounded border border-border-light px-2 py-0.5 text-sm text-white hover:bg-bg-hover"
        >
          +
        </button>
      </div>
      <button
        onClick={() => removeItem(product.id, size, color)}
        className="text-text-muted transition-colors hover:text-accent"
        aria-label="Remove item"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Create cart page**

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { CartItem } from '@/components/cart/CartItem';
import { formatCurrency } from '@/lib/utils';

export default function CartPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="mb-4 text-3xl font-black uppercase tracking-tight text-white">
          Your Cart is Empty
        </h1>
        <p className="mb-8 text-text-secondary">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Link href="/shop" className="btn-primary px-8 py-3">
          Browse Shop
        </Link>
      </div>
    );
  }

  const handleCheckout = async () => {
    setCheckoutError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            version: item.product.version,
          })),
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setCheckoutError(data.error || 'Checkout failed. Please try again.');
      }
    } catch {
      setCheckoutError('Unable to connect. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-bg py-12">
      <div className="container mx-auto max-w-2xl px-4">
        <h1 className="mb-8 text-3xl font-black uppercase tracking-tight text-white">
          Your Cart
        </h1>

        <div className="rounded border border-border bg-bg-card p-4">
          {items.map((item) => (
            <CartItem
              key={`${item.product.id}-${item.size}-${item.color}`}
              item={item}
            />
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={clearCart}
            className="text-sm text-text-muted transition-colors hover:text-accent"
          >
            Clear Cart
          </button>
          <div className="text-right">
            <p className="text-sm text-text-secondary">Total</p>
            <p className="text-2xl font-black text-white">
              {formatCurrency(totalPrice / 100)}
            </p>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          className="mt-6 w-full rounded bg-accent py-4 text-lg font-bold uppercase tracking-wide text-white transition-colors hover:bg-accent-hover"
        >
          Checkout
        </button>

        {checkoutError && (
          <p className="mt-4 text-center text-sm text-accent">{checkoutError}</p>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/cart/ src/app/(public)/cart/
git commit -m "feat: add cart page with item management and checkout button"
```

---

## Chunk 3: Stripe Checkout + Form Pages

### Task 18: Create Stripe checkout API route

**Files:**

- Create: `src/app/api/checkout/route.ts`

- [ ] **Step 1: Create the checkout API route**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';
import { getProductBySlug } from '@/lib/products';
import { SITE_CONFIG } from '@/lib/constants';

const checkoutItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(50),
  size: z.string().optional(),
  color: z.string().optional(),
  version: z.number().int(), // for stale cart detection
});

const checkoutRequestSchema = z.object({
  items: z.array(checkoutItemSchema).min(1).max(50),
});

export async function POST(request: NextRequest) {
  try {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Please set STRIPE_SECRET_KEY.' },
        { status: 503 }
      );
    }

    const stripe = new Stripe(key);
    const body = await request.json();
    const { items } = checkoutRequestSchema.parse(body);

    // Server-side validation: look up each product and use authoritative data
    const validatedItems = [];
    for (const item of items) {
      const product = getProductBySlug(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product "${item.productId}" is no longer available.`, stale: true },
          { status: 400 }
        );
      }
      if (item.version !== product.version) {
        return NextResponse.json(
          { error: `Product "${product.name}" has been updated. Please review your cart.`, stale: true },
          { status: 409 }
        );
      }
      if (item.size && product.sizes && !product.sizes.includes(item.size)) {
        return NextResponse.json(
          { error: `Size "${item.size}" is not available for ${product.name}.` },
          { status: 400 }
        );
      }
      if (item.color && product.colors && !product.colors.includes(item.color)) {
        return NextResponse.json(
          { error: `Color "${item.color}" is not available for ${product.name}.` },
          { status: 400 }
        );
      }
      validatedItems.push({ product, quantity: item.quantity, size: item.size, color: item.color });
    }

    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || '';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: validatedItems.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.name,
            description: [item.size, item.color].filter(Boolean).join(' / ') || undefined,
            images: [`${SITE_CONFIG.url}${item.product.image}`],
          },
          unit_amount: item.product.price, // authoritative price from server
        },
        quantity: item.quantity,
      })),
      success_url: `${origin}/checkout/success`,
      cancel_url: `${origin}/checkout/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid cart data.' }, { status: 400 });
    }
    console.error('Stripe checkout error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 502 });
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/checkout/
git commit -m "feat: add Stripe Checkout Session API route"
```

### Task 19: Create checkout success and cancel pages

**Files:**

- Create: `src/app/(public)/checkout/success/page.tsx`
- Create: `src/app/(public)/checkout/cancel/page.tsx`

- [ ] **Step 1: Create success page**

```tsx
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Confirmed',
};

export default function CheckoutSuccessPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-600/20">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="mb-4 text-3xl font-black uppercase tracking-tight text-white">
        Order Placed!
      </h1>
      <p className="mb-8 max-w-md text-text-secondary">
        Thanks for your purchase. You&apos;ll receive a receipt from Stripe via email shortly.
      </p>
      <Link href="/shop" className="btn-primary px-8 py-3">
        Continue Shopping
      </Link>
    </div>
  );
}
```

- [ ] **Step 2: Create cancel page**

```tsx
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout Cancelled',
};

export default function CheckoutCancelPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <h1 className="mb-4 text-3xl font-black uppercase tracking-tight text-white">
        Checkout Cancelled
      </h1>
      <p className="mb-8 text-text-secondary">
        Your checkout was cancelled. Your cart items are still saved.
      </p>
      <Link href="/cart" className="btn-primary px-8 py-3">
        Return to Cart
      </Link>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/(public)/checkout/
git commit -m "feat: add checkout success and cancel pages"
```

### Task 20: Rewrite email utility

**Files:**

- Modify: `src/lib/email.ts`

- [ ] **Step 1: Replace email.ts with a generic notification function**

```typescript
interface EmailNotification {
  subject: string;
  body: string;
}

interface CustomOrderData {
  name: string;
  email: string;
  phone?: string;
  itemType: string;
  quantity: number;
  description: string;
  designLink?: string;
}

interface DroneQuoteData {
  name: string;
  email: string;
  propertyAddress: string;
  description: string;
}

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendEmailNotification(notification: EmailNotification): Promise<void> {
  // Stub: logs to console. Replace with actual email service (SendGrid, Resend, etc.)
  console.log('=== EMAIL NOTIFICATION ===');
  console.log('To:', process.env.NOTIFICATION_EMAIL || 'info@allaroundphotos.com');
  console.log('Subject:', notification.subject);
  console.log('Body:', notification.body);
  console.log('==========================');
}

export function buildCustomOrderEmail(data: CustomOrderData): EmailNotification {
  return {
    subject: `New Custom Order Request: ${data.itemType} from ${data.name}`,
    body: `
New Custom Order Request

Contact: ${data.name}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}

Item Type: ${data.itemType}
Quantity: ${data.quantity}
Description: ${data.description}
Design Reference: ${data.designLink || 'None provided'}
    `.trim(),
  };
}

export function buildDroneQuoteEmail(data: DroneQuoteData): EmailNotification {
  return {
    subject: `Drone Photography Quote Request from ${data.name}`,
    body: `
Drone Photography Quote Request

Contact: ${data.name}
Email: ${data.email}

Property Address: ${data.propertyAddress}
Description: ${data.description}
    `.trim(),
  };
}

export function buildContactEmail(data: ContactFormData): EmailNotification {
  return {
    subject: `Contact Form: ${data.subject} from ${data.name}`,
    body: `
Contact Form Submission

Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}

Message:
${data.message}
    `.trim(),
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/email.ts
git commit -m "feat: rewrite email utility with generic notification system"
```

### Task 21: Create form validation schemas

**Files:**

- Create: `src/lib/validations/custom-order.ts`
- Create: `src/lib/validations/drone-quote.ts`
- Create: `src/lib/validations/contact.ts`

- [ ] **Step 1: Create shared form utilities**

Create `src/lib/validations/form-utils.ts`:

```typescript
import { z } from 'zod';

// Honeypot field — included in all form schemas, rejected if filled
export const honeypotField = { website: z.string().max(0, 'Bot detected').optional() };

// Safe URL validation — rejects javascript: and data: schemes
export const safeUrlSchema = z.string().url('Must be a valid URL')
  .refine((url) => {
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch { return false; }
  }, 'Only http/https URLs are allowed')
  .optional()
  .or(z.literal(''));

// Strip HTML tags from text input
export function sanitizeText(text: string): string {
  return text.replace(/<[^>]*>/g, '').trim();
}

// Generate a reference ID for form confirmations
export function generateReferenceId(prefix: string): string {
  return `${prefix}-${Date.now()}`;
}

// Simple in-memory rate limiter (per Cloudflare Workers request)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(ip: string, limit = 5, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}
```

- [ ] **Step 2: Create custom order validation**

```typescript
import { z } from 'zod';
import { honeypotField, safeUrlSchema } from './form-utils';

export const customOrderSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  itemType: z.enum(['Hoodie', 'T-Shirt', 'Coaster', 'Other']),
  quantity: z.number().int().min(1, 'Minimum quantity is 1').max(100),
  description: z.string().min(10, 'Please provide more details').max(2000),
  designLink: safeUrlSchema,
  ...honeypotField,
});

export type CustomOrderInput = z.infer<typeof customOrderSchema>;
```

- [ ] **Step 3: Create drone quote validation**

```typescript
import { z } from 'zod';
import { honeypotField } from './form-utils';

export const droneQuoteSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  propertyAddress: z.string().min(5, 'Please enter the property address').max(255),
  description: z.string().min(10, 'Please describe what you need').max(2000),
  ...honeypotField,
});

export type DroneQuoteInput = z.infer<typeof droneQuoteSchema>;
```

- [ ] **Step 4: Create contact validation**

```typescript
import { z } from 'zod';
import { honeypotField } from './form-utils';

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  subject: z.enum(['Custom Apparel', 'Drone Photography', 'General Inquiry', 'Other']),
  message: z.string().min(10, 'Please provide more details').max(2000),
  ...honeypotField,
});

export type ContactInput = z.infer<typeof contactSchema>;
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/validations/
git commit -m "feat: add Zod validation schemas for custom order, drone quote, and contact forms"
```

### Task 22: Create form API routes

**Files:**

- Create: `src/app/api/custom-order/route.ts`
- Create: `src/app/api/drone-quote/route.ts`
- Create: `src/app/api/contact/route.ts`

- [ ] **Step 1: Create custom order API route**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { customOrderSchema } from '@/lib/validations/custom-order';
import { sendEmailNotification, buildCustomOrderEmail } from '@/lib/email';
import { checkRateLimit, sanitizeText, generateReferenceId } from '@/lib/validations/form-utils';

export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const body = await request.json();
    const data = customOrderSchema.parse(body);

    // Honeypot check — if website field is filled, silently succeed (fool the bot)
    if (data.website) {
      return NextResponse.json({ success: true, referenceId: 'CO-0000000000000' });
    }

    // Sanitize text inputs
    const sanitized = {
      ...data,
      name: sanitizeText(data.name),
      description: sanitizeText(data.description),
      phone: data.phone ? sanitizeText(data.phone) : undefined,
    };

    const referenceId = generateReferenceId('CO');
    const email = buildCustomOrderEmail(sanitized);
    email.subject = `[${referenceId}] ${email.subject}`;
    await sendEmailNotification(email);

    return NextResponse.json({ success: true, referenceId });
  } catch (err) {
    if (err instanceof Error && 'issues' in err) {
      return NextResponse.json({ error: 'Validation failed', details: err }, { status: 400 });
    }
    console.error('Custom order submission error:', err);
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
}
```

- [ ] **Step 2: Create drone quote API route**

Same pattern as custom order, using `droneQuoteSchema` and `buildDroneQuoteEmail`. Use `generateReferenceId('DQ')` for drone quote reference IDs. Include rate limiting, honeypot check, and text sanitization.

- [ ] **Step 3: Create contact API route**

Same pattern, using `contactSchema` and `buildContactEmail`. Use `generateReferenceId('CT')` for contact reference IDs. Include rate limiting, honeypot check, and text sanitization.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/custom-order/ src/app/api/drone-quote/ src/app/api/contact/
git commit -m "feat: add API routes for custom order, drone quote, and contact forms"
```

### Task 23: Create form components

**Files:**

- Create: `src/components/forms/CustomOrderForm.tsx`
- Create: `src/components/forms/DroneQuoteForm.tsx`
- Create: `src/components/forms/ContactForm.tsx`

- [ ] **Step 1: Create CustomOrderForm**

Client component with controlled inputs, client-side Zod validation, POST to `/api/custom-order`, success/error states. Fields: name, email, phone, item type (dropdown), quantity, description, design link. Dark theme input styling using `input-field` class.

**Honeypot field:** Include a visually hidden `website` input (`className="absolute -left-[9999px] opacity-0 h-0 w-0"`, `tabIndex={-1}`, `autoComplete="off"`). This gets submitted with the form data but real users never see it.

**Confirmation UX:** On success, the API returns `{ success: true, referenceId: "CO-1710091234567" }`. Replace the form with a confirmation screen showing: "Your request has been submitted!", the reference ID styled prominently, and a note: "Save this reference ID for your records. We'll be in touch soon."

- [ ] **Step 2: Create DroneQuoteForm**

Same pattern. Fields: name, email, property address, description. Include honeypot field. Confirmation shows reference ID with `DQ-` prefix.

- [ ] **Step 3: Create ContactForm**

Same pattern. Fields: name, email, subject (dropdown), message. Include honeypot field. Confirmation shows reference ID with `CT-` prefix.

- [ ] **Step 4: Commit**

```bash
git add src/components/forms/
git commit -m "feat: add custom order, drone quote, and contact form components"
```

### Task 24: Create custom orders page

**Files:**

- Create: `src/app/(public)/custom/page.tsx`

- [ ] **Step 1: Create custom orders page**

Two sections: gallery grid of custom work photos (placeholder images for now in `/public/custom-work/`), then the `CustomOrderForm` component below. The form handles its own confirmation UX internally (shows reference ID on success).

```bash
mkdir -p public/custom-work
```

- [ ] **Step 2: Commit**

```bash
git add src/app/(public)/custom/ public/custom-work/
git commit -m "feat: add custom orders page with gallery and order form"
```

### Task 25: Create drone services page

**Files:**

- Create: `src/app/(public)/drone/page.tsx`

- [ ] **Step 1: Create drone services page**

Hero section, service description, drone photo gallery grid (placeholder images in `/public/drone/`), then `DroneQuoteForm` component. The form handles its own confirmation UX internally (shows reference ID on success).

```bash
mkdir -p public/drone
```

- [ ] **Step 2: Commit**

```bash
git add src/app/(public)/drone/ public/drone/
git commit -m "feat: add drone services page with gallery and quote form"
```

### Task 26: Update contact page with new form

**Files:**

- Modify: `src/app/(public)/contact/page.tsx`

- [ ] **Step 1: Replace contact page content**

Use `ContactForm` component. Update contact info. Dark theme.

- [ ] **Step 2: Commit**

```bash
git add src/app/(public)/contact/
git commit -m "feat: update contact page with new form and dark theme"
```

---

## Chunk 4: Homepage + Final Polish

### Task 27: Create homepage components

**Files:**

- Create: `src/components/home/HeroSection.tsx`
- Create: `src/components/home/CategoryCards.tsx`
- Create: `src/components/home/FeaturedProducts.tsx`
- Create: `src/components/home/DroneServicesBanner.tsx`

- [ ] **Step 1: Create HeroSection**

Dark hero with "Made Different." tagline, subtitle about custom apparel, "Shop Now" CTA button (links to /shop). Full-width, min-height ~70vh.

- [ ] **Step 2: Create CategoryCards**

Two side-by-side cards: "Ready to Wear" (links to /shop) and "Custom Orders" (links to /custom). Dark card styling with hover effects. Each card has an icon/image area and text.

- [ ] **Step 3: Create FeaturedProducts**

Import `getFeaturedProducts()` from product data. Show 3-4 `ProductCard` components in a row. Include a `ProductModal` for quick-view.

- [ ] **Step 4: Create DroneServicesBanner**

Simple banner/card linking to /drone. "DRONE SERVICES — Aerial photography for realtors" with an arrow link.

- [ ] **Step 5: Commit**

```bash
git add src/components/home/
git commit -m "feat: add homepage components — hero, category cards, featured products, drone banner"
```

### Task 28: Assemble homepage

**Files:**

- Modify: `src/app/page.tsx`

- [ ] **Step 1: Replace placeholder homepage**

```tsx
import { HeroSection } from '@/components/home/HeroSection';
import { CategoryCards } from '@/components/home/CategoryCards';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { DroneServicesBanner } from '@/components/home/DroneServicesBanner';

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategoryCards />
      <FeaturedProducts />
      <DroneServicesBanner />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: assemble homepage with all sections"
```

### Task 29: Clean up remaining files

**Files:**

- Delete: Any remaining old files (`.gitkeep` files in emptied dirs, old layout index files)
- Modify: `src/components/layout/index.ts` (update exports if needed)
- Delete: `src/types/globals.d.ts` and `src/types/utils.ts` if they reference Prisma

- [ ] **Step 1: Clean up stale files**

Check for remaining references to old code:

```bash
grep -r "prisma\|@prisma" src/ --include="*.ts" --include="*.tsx" -l
```

Delete or fix any files found.

- [ ] **Step 2: Verify build**

```bash
npm run build 2>&1 | tail -30
```

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: clean up remaining old references and verify build"
```

### Task 30: Final verification

- [ ] **Step 1: Run dev server and verify all pages load**

```bash
npm run dev
```

Visit each page: `/`, `/shop`, `/custom`, `/cart`, `/drone`, `/about`, `/contact`, `/checkout/success`, `/checkout/cancel`

- [ ] **Step 2: Test cart flow**

Add items to cart, verify localStorage persistence, verify cart page displays correctly, verify checkout button calls API (will fail without Stripe key — that's expected).

- [ ] **Step 3: Test form submissions**

Submit custom order, drone quote, and contact forms. Verify API routes respond with success and console logs show email content.

- [ ] **Step 4: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: address issues found during final verification"
```
