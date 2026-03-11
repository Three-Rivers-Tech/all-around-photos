import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | All Around Photos LLC',
  description: 'Learn about All Around Photos LLC and our passion for custom apparel and drone services.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-[0.15em] text-center text-white mb-12">
            About Us
          </h1>
          
          <div className="space-y-12">
            {/* Our Story */}
            <section className="border-l-4 border-red-600 pl-8">
              <h2 className="text-3xl font-bold text-white mb-4">Our Story</h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-4">
                All Around Photos LLC started with a vision to bring creativity and quality to everything we make. What began as a passion for custom design has evolved into a fully-fledged apparel and goods studio, combined with professional drone services for real estate.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                We believe that every piece we create should tell a story—whether it's a custom hoodie with a unique design, a personalized set of coasters, or stunning aerial photography that showcases properties from a whole new perspective.
              </p>
            </section>

            {/* Our Mission */}
            <section className="border-l-4 border-red-600 pl-8">
              <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                To create high-quality, custom apparel and goods that celebrate individuality, while providing professional drone photography services that exceed expectations. We're committed to precision, creativity, and customer satisfaction in everything we do.
              </p>
            </section>

            {/* What We Do */}
            <section className="border-l-4 border-red-600 pl-8">
              <h2 className="text-3xl font-bold text-white mb-6">What We Do</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="bg-slate-900 border border-gray-700 p-6 rounded-sm">
                  <h3 className="text-xl font-bold text-red-600 mb-3">Custom Apparel</h3>
                  <p className="text-gray-300">
                    Premium hoodies, t-shirts, and more with custom Cricut designs. We craft pieces that fit your style and vision.
                  </p>
                </div>
                <div className="bg-slate-900 border border-gray-700 p-6 rounded-sm">
                  <h3 className="text-xl font-bold text-red-600 mb-3">Custom Goods</h3>
                  <p className="text-gray-300">
                    Personalized coasters, merchandise, and custom items. Every piece is made with attention to detail.
                  </p>
                </div>
                <div className="bg-slate-900 border border-gray-700 p-6 rounded-sm">
                  <h3 className="text-xl font-bold text-red-600 mb-3">Drone Photography</h3>
                  <p className="text-gray-300">
                    Professional aerial photography for real estate agents and businesses. Stunning perspectives from the sky.
                  </p>
                </div>
                <div className="bg-slate-900 border border-gray-700 p-6 rounded-sm">
                  <h3 className="text-xl font-bold text-red-600 mb-3">Quality First</h3>
                  <p className="text-gray-300">
                    Every product and service is delivered with precision, care, and a commitment to excellence.
                  </p>
                </div>
              </div>
            </section>

            {/* Why Choose Us */}
            <section className="border-l-4 border-red-600 pl-8">
              <h2 className="text-3xl font-bold text-white mb-6">Why Choose Us</h2>
              <ul className="space-y-3">
                {[
                  'Custom designs crafted to your exact specifications',
                  'Premium materials and professional-grade equipment',
                  'Fast turnaround times without sacrificing quality',
                  'Competitive pricing with transparent communication',
                  'Professional aerial photography with certified operators',
                  'Dedicated to bringing your vision to life',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <span className="text-red-600 font-bold text-xl mt-1">✓</span>
                    <span className="text-lg text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
