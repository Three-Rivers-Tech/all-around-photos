import { Metadata } from 'next';
import { Suspense } from 'react';
import { CheckoutSuccessClient } from './CheckoutSuccessClient';

export const metadata: Metadata = {
  title: 'Order Confirmed | All Around Photos LLC',
  description: 'Your order has been successfully placed.',
};

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black px-4 py-12 text-center text-gray-300 sm:px-6 md:py-20 lg:px-8">
          Verifying your payment with Stripe...
        </div>
      }
    >
      <CheckoutSuccessClient />
    </Suspense>
  );
}
