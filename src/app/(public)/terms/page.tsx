import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | All Around Photos LLC',
  description: 'Terms of service for All Around Photos LLC.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-black py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-5xl md:text-6xl font-black uppercase tracking-[0.15em] text-center text-white mb-12">
          Terms of Service
        </h1>

        <div className="space-y-8 text-gray-300">
          <p className="text-sm text-gray-400">
            <strong>Last updated:</strong> March 10, 2026
          </p>

          <section className="border-l-4 border-red-600 pl-8">
            <h2 className="text-2xl font-bold text-white mb-4">Acceptance of Terms</h2>
            <p>
              By using All Around Photos LLC services and products, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="border-l-4 border-red-600 pl-8">
            <h2 className="text-2xl font-bold text-white mb-4">Products and Services</h2>
            <p>
              All Around Photos LLC provides custom apparel, custom goods, and drone photography services. All products are made to order and services are subject to availability. We reserve the right to modify or discontinue products or services at any time with notice.
            </p>
          </section>

          <section className="border-l-4 border-red-600 pl-8">
            <h2 className="text-2xl font-bold text-white mb-4">Payment and Pricing</h2>
            <p>
              Payment is due at the time of purchase for ready-to-wear items. Custom orders require 50% deposit with balance due upon completion. All prices are in USD and do not include applicable taxes. Custom orders are non-refundable after a 7-day review period from quote acceptance.
            </p>
          </section>

          <section className="border-l-4 border-red-600 pl-8">
            <h2 className="text-2xl font-bold text-white mb-4">Shipping and Delivery</h2>
            <p>
              We ship to addresses within the United States. Shipping costs are calculated at checkout based on weight and destination. Delivery times are estimates and not guaranteed. We are not responsible for delays caused by shipping carriers.
            </p>
          </section>

          <section className="border-l-4 border-red-600 pl-8">
            <h2 className="text-2xl font-bold text-white mb-4">Custom Orders</h2>
            <p>
              Custom orders require clear communication about design specifications, sizes, colors, and quantities. Once an order is placed and payment is made, modifications are subject to additional fees or may not be possible. Custom products are made to your specifications and are not returnable.
            </p>
          </section>

          <section className="border-l-4 border-red-600 pl-8">
            <h2 className="text-2xl font-bold text-white mb-4">Drone Photography Services</h2>
            <p>
              Our drone photography services are subject to all FAA regulations and local flight restrictions. We are not responsible for flight restrictions that prevent us from completing services. Services will be rescheduled at no additional charge if weather or regulations prevent completion.
            </p>
          </section>

          <section className="border-l-4 border-red-600 pl-8">
            <h2 className="text-2xl font-bold text-white mb-4">Intellectual Property</h2>
            <p>
              All photographs, designs, and content provided by All Around Photos LLC remain our property unless otherwise agreed. Custom designs created by customers remain the property of the customers. You may not reproduce, distribute, or sell our content without express written permission.
            </p>
          </section>

          <section className="border-l-4 border-red-600 pl-8">
            <h2 className="text-2xl font-bold text-white mb-4">Limitation of Liability</h2>
            <p>
              All Around Photos LLC is not liable for indirect, incidental, special, or consequential damages arising from your use of our products or services. Our total liability is limited to the amount you paid for the product or service.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
