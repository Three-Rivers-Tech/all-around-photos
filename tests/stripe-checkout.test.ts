import assert from 'node:assert/strict';
import test from 'node:test';
import type Stripe from 'stripe';
import {
  buildCheckoutSessionParams,
  getConfiguredSiteUrl,
  summarizeCheckoutSession,
} from '../src/lib/stripe-checkout';

test('getConfiguredSiteUrl uses trusted environment config and ignores request origin', () => {
  const siteUrl = getConfiguredSiteUrl({
    SITE_URL: 'https://allaroundphotosllc.net/',
    NEXT_PUBLIC_SITE_URL: 'https://fallback.example',
  });

  assert.equal(siteUrl, 'https://allaroundphotosllc.net');
});

test('getConfiguredSiteUrl falls back to localhost when no trusted site URL is configured', () => {
  const siteUrl = getConfiguredSiteUrl({});

  assert.equal(siteUrl, 'http://localhost:3000');
});

test('buildCheckoutSessionParams pins Stripe redirects and images to the trusted site URL', () => {
  const params = buildCheckoutSessionParams({
    siteUrl: 'https://allaroundphotosllc.net',
    items: [
      {
        product: {
          id: 'classic-hoodie',
          name: 'Classic Logo Hoodie',
          description: 'Premium hoodie',
          price: 4500,
          category: 'hoodies',
          image: '/products/hoodie.jpg',
          version: 1,
        },
        quantity: 2,
        size: 'L',
        color: 'Black',
      },
    ],
  });

  assert.equal(
    params.success_url,
    'https://allaroundphotosllc.net/checkout/success?session_id={CHECKOUT_SESSION_ID}'
  );
  assert.equal(
    params.cancel_url,
    'https://allaroundphotosllc.net/checkout/cancel'
  );
  assert.equal(
    params.line_items?.[0]?.price_data?.product_data?.images?.[0],
    'https://allaroundphotosllc.net/products/hoodie.jpg'
  );
});

test('summarizeCheckoutSession only marks complete paid sessions as paid', () => {
  const paidSession = {
    id: 'cs_test_paid',
    status: 'complete',
    payment_status: 'paid',
    amount_total: 4500,
    currency: 'usd',
    customer_details: { email: 'buyer@example.com' },
  } as Stripe.Checkout.Session;

  const openSession = {
    ...paidSession,
    id: 'cs_test_open',
    status: 'open',
    payment_status: 'unpaid',
  } as Stripe.Checkout.Session;

  assert.deepEqual(summarizeCheckoutSession(paidSession), {
    paid: true,
    status: 'complete',
    paymentStatus: 'paid',
    amountTotal: 4500,
    currency: 'usd',
    customerEmail: 'buyer@example.com',
  });
  assert.equal(summarizeCheckoutSession(openSession).paid, false);
});
