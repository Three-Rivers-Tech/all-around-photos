import { CustomOrderForm } from '@/components/forms/CustomOrderForm';

export const metadata = {
  title: 'Custom Orders | All Around Photos',
  description: 'Browse our custom photography work and request your own custom project.',
};

export default function CustomPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gray-900 py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Custom Photography Orders</h1>
          <p className="mt-4 text-xl text-gray-300">
            Bring your vision to life with our custom photography services
          </p>
        </div>
      </section>

      {/* Custom Order Form */}
      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Request a Custom Project</h2>
          <p className="text-gray-600">
            Tell us about your custom photography needs, and we'll provide a personalized quote and timeline.
          </p>
        </div>
        <CustomOrderForm />
      </section>
    </main>
  );
}
