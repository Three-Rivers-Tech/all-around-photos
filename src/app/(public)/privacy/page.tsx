import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | All Around Photos LLC',
  description: 'Privacy policy for All Around Photos LLC.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-5xl md:text-6xl font-black uppercase tracking-[0.15em] text-center text-white mb-12">
          Privacy Policy
        </h1>

        <div className="space-y-8 text-gray-300">
          <p className="text-sm text-gray-400">
            <strong>Last updated:</strong> March 10, 2026
          </p>

          <section className="border-l-4 border-red-600 pl-8">
            <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
            <p>
              We collect information you provide directly to us, including when you submit forms, request quotes, or make purchases. This may include your name, email address, phone number, and project details.
            </p>
          </section>

          <section className="border-l-4 border-red-600 pl-8">
            <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Information</h2>
            <p>
              We use the information we collect to provide our products and services, send order confirmations, respond to inquiries, and improve our services. We may also use your information for marketing purposes with your consent.
            </p>
          </section>

          <section className="border-l-4 border-red-600 pl-8">
            <h2 className="text-2xl font-bold text-white mb-4">Third-Party Services</h2>
            <p>
              We use Stripe to process payments and Google for analytics. These services have their own privacy policies governing their use of information.
            </p>
          </section>

          <section className="border-l-4 border-red-600 pl-8">
            <h2 className="text-2xl font-bold text-white mb-4">Data Security</h2>
            <p>
              We take reasonable measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is completely secure.
            </p>
          </section>

          <section className="border-l-4 border-red-600 pl-8">
            <h2 className="text-2xl font-bold text-white mb-4">Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal information. To exercise these rights, please contact us at info@allaroundphotos.com.
            </p>
          </section>

          <section className="border-l-4 border-red-600 pl-8">
            <h2 className="text-2xl font-bold text-white mb-4">Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any significant changes by updating the "Last updated" date at the top of this page.
            </p>
          </section>

          <section className="border-l-4 border-red-600 pl-8">
            <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
            <p>
              If you have questions about this privacy policy, please contact us at info@allaroundphotos.com or (555) 123-4567.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
