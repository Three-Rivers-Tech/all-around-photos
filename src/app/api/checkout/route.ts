import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';
import { products } from '@/lib/products';
import {
  buildCheckoutSessionParams,
  getConfiguredSiteUrl,
  type CheckoutItemForStripe,
} from '@/lib/stripe-checkout';

const STRIPE_API_VERSION: Stripe.LatestApiVersion = '2026-02-25.clover';

const checkoutRateLimitMap = new Map<
  string,
  { count: number; resetAt: number }
>();

function checkCheckoutRateLimit(
  ip: string | null,
  limit = 3,
  windowMs = 5 * 60 * 1000
): boolean {
  const key = ip || 'unknown';
  const now = Date.now();
  const entry = checkoutRateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    checkoutRateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count++;
  return true;
}

function getRequestIp(request: NextRequest): string | null {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() ?? null;
  }

  return request.headers.get('x-real-ip');
}

const checkoutItemSchema = z.object({
  id: z.string(),
  quantity: z.number().int().positive(),
  size: z.string(),
  color: z.string(),
  version: z.number().int(),
});

const checkoutRequestSchema = z.object({
  items: z.array(checkoutItemSchema).min(1).max(50),
});

export async function POST(request: NextRequest) {
  try {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      console.error('STRIPE_SECRET_KEY not configured');
      return NextResponse.json(
        { error: 'Payment service not configured' },
        { status: 500 }
      );
    }

    const stripe = new Stripe(key, {
      apiVersion: STRIPE_API_VERSION,
    });

    const ip = getRequestIp(request);
    if (!checkCheckoutRateLimit(ip)) {
      return NextResponse.json(
        {
          error: 'Too many checkout attempts. Please wait before trying again.',
        },
        { status: 429 }
      );
    }

    const csrfToken = request.headers.get('x-csrf-token');
    const cookieStore = request.cookies.get('csrf-token')?.value;
    if (!csrfToken || !cookieStore || csrfToken !== cookieStore) {
      return NextResponse.json(
        { error: 'Invalid request. Please refresh and try again.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedRequest = checkoutRequestSchema.parse(body);

    const validatedItems: CheckoutItemForStripe[] = [];

    for (const item of validatedRequest.items) {
      const product = products.find(p => p.id === item.id);

      if (!product) {
        return NextResponse.json(
          { error: `Product "${item.id}" not found.` },
          { status: 404 }
        );
      }

      if (item.version !== product.version) {
        return NextResponse.json(
          {
            error: `Product "${product.name}" has been updated. Please review your cart.`,
            stale: true,
          },
          { status: 409 }
        );
      }

      if (item.size && product.sizes && !product.sizes.includes(item.size)) {
        return NextResponse.json(
          {
            error: `Size "${item.size}" is not available for ${product.name}.`,
          },
          { status: 400 }
        );
      }

      if (
        item.color &&
        product.colors &&
        !product.colors.includes(item.color)
      ) {
        return NextResponse.json(
          {
            error: `Color "${item.color}" is not available for ${product.name}.`,
          },
          { status: 400 }
        );
      }

      validatedItems.push({
        product,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      });
    }

    const siteUrl = getConfiguredSiteUrl();

    const session = await stripe.checkout.sessions.create(
      buildCheckoutSessionParams({
        siteUrl,
        items: validatedItems,
      })
    );

    return NextResponse.json({ url: session.url });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid cart data.' },
        { status: 400 }
      );
    }

    const message = err instanceof Error ? err.message : 'Unknown error';
    const hasSensitiveData =
      message.includes('api_key') ||
      message.includes('token') ||
      message.includes('secret');
    const sanitizedMessage = hasSensitiveData
      ? 'Payment processing error'
      : message;

    console.error('Stripe checkout error:', sanitizedMessage);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 502 }
    );
  }
}
