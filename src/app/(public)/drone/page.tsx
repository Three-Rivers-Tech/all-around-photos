import { DroneQuoteForm } from '@/components/forms/DroneQuoteForm';

export const metadata = {
  title: 'Drone Services | All Around Photos',
  description: 'Aerial photography and videography for real estate, events, and commercial use.',
};

export default function DronePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gray-900 py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Drone Photography & Videography</h1>
          <p className="mt-4 text-xl text-gray-300">
            Professional aerial photography for real estate, events, and commercial projects
          </p>
        </div>
      </section>

      {/* Drone Quote Form */}
      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Request a Drone Quote</h2>
          <p className="text-gray-600">
            Get a customized quote for your aerial photography or videography project. Tell us about your needs and we'll reach out with pricing and availability.
          </p>
        </div>
        <DroneQuoteForm />
      </section>
    </main>
  );
}
