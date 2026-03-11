'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Camera, Users, Award, Heart } from 'lucide-react';

export function ServiceOverview() {
  const services = [
    {
      icon: Camera,
      title: 'Event Photography',
      description:
        'Capture the energy and emotion of your special events with professional-grade photography',
    },
    {
      icon: Users,
      title: 'Corporate Events',
      description:
        'Professional documentation of conferences, meetings, and corporate gatherings',
    },
    {
      icon: Award,
      title: 'Portrait Sessions',
      description:
        'Timeless, elegant portraits that showcase your personality and professionalism',
    },
    {
      icon: Heart,
      title: 'Wedding Coverage',
      description:
        'Full-day wedding documentation capturing every precious moment of your celebration',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-xl text-slate-600">
            Professional photography for every occasion
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div key={index} className="text-center p-6">
                <div className="flex justify-center mb-4">
                  <Icon className="w-12 h-12 text-red-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-slate-600">{service.description}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Button asChild size="lg" variant="outline">
            <Link href="/services">Learn More About Services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
