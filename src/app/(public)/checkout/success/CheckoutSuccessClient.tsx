'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/lib/cart';
import { formatCurrency } from '@/lib/utils';

interface CheckoutVerification {
  paid: boolean;
  status: string | null;
  paymentStatus: string;
  amountTotal: number | null;
  currency: string | null;
  customerEmail: string | null;
}

type VerificationState =
  | { status: 'loading' }
  | { status: 'missing-session' }
  | { status: 'verified'; data: CheckoutVerification }
  | { status: 'not-paid'; data: CheckoutVerification }
  | { status: 'error'; message: string };

export function CheckoutSuccessClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();
  const [verification, setVerification] = useState<VerificationState>(() =>
    sessionId ? { status: 'loading' } : { status: 'missing-session' }
  );

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    let isCancelled = false;

    async function verifyCheckoutSession() {
      try {
        const response = await fetch(
          `/api/checkout/verify?session_id=${encodeURIComponent(sessionId ?? '')}`,
          { cache: 'no-store' }
        );
        const data = await response.json();

        if (isCancelled) {
          return;
        }

        if (!response.ok) {
          setVerification({
            status: 'error',
            message: data.error || 'Unable to verify this checkout session.',
          });
          return;
        }

        if (data.paid) {
          clearCart();
          setVerification({ status: 'verified', data });
          return;
        }

        setVerification({ status: 'not-paid', data });
      } catch {
        if (!isCancelled) {
          setVerification({
            status: 'error',
            message: 'Unable to connect to the payment verification service.',
          });
        }
      }
    }

    verifyCheckoutSession();

    return () => {
      isCancelled = true;
    };
  }, [clearCart, sessionId]);

  const isVerified = verification.status === 'verified';
  const heading = isVerified ? 'Order Confirmed!' : 'Payment Verification';
  const iconClass = isVerified
    ? 'bg-red-900/30 border-red-600 text-red-600'
    : 'bg-zinc-900/60 border-zinc-700 text-zinc-300';

  return (
    <div className="min-h-screen bg-black px-4 py-12 sm:px-6 md:py-20 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-8">
          <div className="flex justify-center">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-full border ${iconClass}`}
            >
              {verification.status === 'loading' ? (
                <svg
                  className="h-8 w-8 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              ) : isVerified ? (
                <svg
                  className="h-8 w-8"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <span className="text-2xl font-black">?</span>
              )}
            </div>
          </div>
        </div>

        <h1 className="mb-4 text-4xl font-black tracking-[0.15em] text-white uppercase">
          {heading}
        </h1>

        {verification.status === 'loading' && (
          <p className="mb-8 text-gray-300">
            Verifying your payment with Stripe...
          </p>
        )}

        {verification.status === 'verified' && (
          <div className="mb-8 space-y-3 text-gray-300">
            <p className="text-xl">Thank you for your purchase.</p>
            <p className="text-gray-400">
              Your payment was verified. We&apos;ll follow up with order details
              as soon as fulfillment is ready.
            </p>
            {verification.data.amountTotal !== null &&
              verification.data.currency && (
                <p className="text-sm text-gray-500">
                  Paid {formatCurrency(verification.data.amountTotal / 100)}{' '}
                  {verification.data.currency.toUpperCase()}
                </p>
              )}
            {verification.data.customerEmail && (
              <p className="text-sm text-gray-500">
                Stripe receipt email: {verification.data.customerEmail}
              </p>
            )}
          </div>
        )}

        {verification.status === 'missing-session' && (
          <p className="mb-8 text-gray-300">
            This page is missing a Stripe checkout session ID. If you completed
            payment, please contact us with your Stripe receipt.
          </p>
        )}

        {verification.status === 'not-paid' && (
          <p className="mb-8 text-gray-300">
            Stripe has not marked this checkout session as paid yet. If you just
            completed payment, refresh this page in a moment.
          </p>
        )}

        {verification.status === 'error' && (
          <p className="mb-8 text-gray-300">{verification.message}</p>
        )}

        <div className="space-y-3">
          <Link href="/shop" className="block">
            <Button className="w-full bg-red-600 hover:bg-red-700">
              Continue Shopping
            </Button>
          </Link>

          <Link href="/" className="block">
            <Button
              variant="secondary"
              className="w-full border border-gray-600 text-gray-300 hover:text-white"
            >
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
