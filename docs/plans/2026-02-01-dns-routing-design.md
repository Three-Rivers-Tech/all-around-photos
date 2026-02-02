# DNS Setup Design for allaroundphotosllc.net

**Date:** 2026-02-01
**Status:** Implemented

## Overview

Configure custom domain `allaroundphotosllc.net` to point to the Cloudflare Workers deployment with proper www redirect handling.

## Current State

- App deployed at: `all-around-photos.christianpenrod.workers.dev`
- Domain: `allaroundphotosllc.net` (managed in Cloudflare)
- Target: Root domain as primary, www redirects to root

## Architecture

### Approach

Using **Cloudflare Workers Custom Domains** for seamless integration:
- Automatic DNS record creation
- SSL certificate provisioning
- Edge-based redirect handling

### Domain Configuration

- **Primary Domain:** `allaroundphotosllc.net`
- **Redirect:** `www.allaroundphotosllc.net` → `allaroundphotosllc.net`
- **Redirect Type:** 301 (Permanent)
- **Redirect Handler:** Cloudflare Redirect Rules (edge-based)

## Implementation

### Step 1: Add Custom Domains to Worker

In Cloudflare Dashboard → Workers & Pages → all-around-photos → Settings → Domains & Routes:

1. Add Custom Domain: `allaroundphotosllc.net`
2. Add Custom Domain: `www.allaroundphotosllc.net`

Cloudflare automatically handles DNS records and SSL provisioning.

### Step 2: Configure WWW Redirect Rule

In Cloudflare Dashboard → allaroundphotosllc.net → Rules → Redirect Rules:

**Rule Configuration:**
- **Rule name:** "WWW to Root Redirect"
- **When incoming requests match:**
  - Field: `Hostname`
  - Operator: `equals`
  - Value: `www.allaroundphotosllc.net`
- **Then:**
  - Type: `Dynamic`
  - Expression: `concat("https://allaroundphotosllc.net", http.request.uri)`
  - Status code: `301` (Permanent Redirect)
  - Preserve query string: Yes

### Expression

```
concat("https://allaroundphotosllc.net", http.request.uri)
```

**Note:** Using `http.request.uri` instead of `http.request.uri.path` ensures query strings are preserved during redirect.

## Verification

1. Visit `https://allaroundphotosllc.net` - should load application
2. Visit `https://www.allaroundphotosllc.net` - should redirect to root domain
3. Test with path: `https://www.allaroundphotosllc.net/gallery` → `https://allaroundphotosllc.net/gallery`
4. Test with query: `https://www.allaroundphotosllc.net/?test=1` → `https://allaroundphotosllc.net/?test=1`
5. Verify SSL certificate is active (padlock in browser)

## Alternative Considered

Manual DNS CNAME records pointing to workers.dev subdomain - rejected in favor of Custom Domains for simpler configuration and better integration.
