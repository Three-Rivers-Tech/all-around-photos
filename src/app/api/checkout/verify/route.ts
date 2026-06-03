import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { summarizeCheckoutSession } from '@/lib/stripe-checkout';

const STRIPE_API_VERSION: Stripe.LatestApiVersion = '2026-02-25.clover';

export async function GET(request: NextRequest) {
  try {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      console.error('STRIPE_SECRET_KEY not configured');
      return NextResponse.json(
        { error: 'Payment service not configured' },
        { status: 500 }
      );
    }

    const sessionId = request.nextUrl.searchParams.get('session_id');
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing checkout session ID' },
        { status: 400 }
      );
    }

    const stripe = new Stripe(key, {
      apiVersion: STRIPE_API_VERSION,
    });

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json(summarizeCheckoutSession(session));
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    const hasSensitiveData =
      message.includes('api_key') ||
      message.includes('token') ||
      message.includes('secret');
    const sanitizedMessage = hasSensitiveData
      ? 'Payment verification error'
      : message;

    console.error('Stripe checkout verification error:', sanitizedMessage);
    return NextResponse.json(
      { error: 'Unable to verify checkout session' },
      { status: 502 }
    );
  }
}
