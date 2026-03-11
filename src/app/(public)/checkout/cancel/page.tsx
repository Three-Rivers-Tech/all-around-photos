import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Checkout Cancelled | All Around Photos LLC',
  description: 'Your checkout was cancelled. Your cart items are still saved.',
};

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-black py-12 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto text-center">
        {/* Warning icon */}
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-yellow-900/30 border border-yellow-600 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-yellow-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-black uppercase tracking-[0.15em] text-white mb-4">
          Checkout Cancelled
        </h1>

        <p className="text-xl text-gray-300 mb-2">
          Your checkout was cancelled.
        </p>

        <p className="text-gray-400 mb-8">
          No worries! Your cart items are still saved. You can review and update your cart anytime.
        </p>

        <div className="space-y-3">
          <Link href="/cart" className="block">
            <Button className="w-full bg-red-600 hover:bg-red-700">
              Return to Cart
            </Button>
          </Link>

          <Link href="/shop" className="block">
            <Button variant="secondary" className="w-full border border-gray-600 text-gray-300 hover:text-white">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
