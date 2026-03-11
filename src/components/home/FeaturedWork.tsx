'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function FeaturedWork() {
  const featuredProjects = [
    {
      id: 1,
      title: 'Corporate Event Documentation',
      category: 'Events',
      image: '/images/featured-1.jpg',
      description: 'Professional photography capturing 500+ attendees at annual corporate gala',
    },
    {
      id: 2,
      title: 'Real Estate Portfolio',
      category: 'Real Estate',
      image: '/images/featured-2.jpg',
      description: 'Stunning property photography showcasing luxury residential portfolio',
    },
    {
      id: 3,
      title: 'Wedding Celebration',
      category: 'Weddings',
      image: '/images/featured-3.jpg',
      description: 'Emotional moments and beautiful details from unforgettable day',
    },
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Featured Work</h2>
          <p className="text-xl text-slate-600">
            Explore our recent projects and see what we can create for you
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {featuredProjects.map((project) => (
            <div
              key={project.id}
              className="group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="relative h-64 overflow-hidden bg-slate-200">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-6 bg-white">
                <p className="text-sm text-red-600 font-semibold mb-2">
                  {project.category}
                </p>
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-slate-600 mb-4">{project.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg">
            <Link href="/gallery">View Full Gallery</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
