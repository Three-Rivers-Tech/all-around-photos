'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';

export function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Anderson',
      role: 'Wedding Bride',
      image: '/images/testimonial-1.jpg',
      comment:
        'The photography team captured every moment beautifully. Our wedding album is a treasure!',
      rating: 5,
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Corporate Events Manager',
      image: '/images/testimonial-2.jpg',
      comment:
        'Professional, punctual, and delivered stunning photos of our company retreat. Highly recommended!',
      rating: 5,
    },
    {
      id: 3,
      name: 'Emma Williams',
      role: 'Real Estate Agent',
      image: '/images/testimonial-3.jpg',
      comment:
        'Property photos increased buyer interest significantly. The quality speaks for itself.',
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Client Testimonials</h2>
          <p className="text-xl text-slate-600">
            Hear from our satisfied clients
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center mb-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 bg-slate-200">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold">{testimonial.name}</h3>
                  <p className="text-sm text-slate-600">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-red-600 text-red-600"
                  />
                ))}
              </div>

              <p className="text-slate-700 italic">"{testimonial.comment}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
