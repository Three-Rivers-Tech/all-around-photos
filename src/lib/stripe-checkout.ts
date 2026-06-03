import type Stripe from 'stripe';
import type { Product } from '@/lib/products';

export interface CheckoutItemForStripe {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

export interface CheckoutSessionSummary {
  paid: boolean;
  status: Stripe.Checkout.Session.Status | null;
  paymentStatus: Stripe.Checkout.Session.PaymentStatus;
  amountTotal: number | null;
  currency: string | null;
  customerEmail: string | null;
}

export function getConfiguredSiteUrl(
  env: NodeJS.ProcessEnv = process.env
): string {
  const configuredUrl =
    env.SITE_URL || env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return configuredUrl.replace(/\/+$/, '');
}

export function buildCheckoutSessionParams({
  siteUrl,
  items,
}: {
  siteUrl: string;
  items: CheckoutItemForStripe[];
}): Stripe.Checkout.SessionCreateParams {
  return {
    mode: 'payment',
    line_items: items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.name,
          description:
            [item.size, item.color].filter(Boolean).join(' / ') || undefined,
          images: [`${siteUrl}${item.product.image}`],
        },
        unit_amount: item.product.price,
      },
      quantity: item.quantity,
    })),
    success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/checkout/cancel`,
  };
}

export function summarizeCheckoutSession(
  session: Stripe.Checkout.Session
): CheckoutSessionSummary {
  return {
    paid: session.status === 'complete' && session.payment_status === 'paid',
    status: session.status,
    paymentStatus: session.payment_status,
    amountTotal: session.amount_total,
    currency: session.currency,
    customerEmail: session.customer_details?.email ?? null,
  };
}
