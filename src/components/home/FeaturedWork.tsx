'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

const featuredProjects = [
  {
    id: 1,
    title: 'Aerial Landscape Photography',
    category: 'Drone',
    image: '/drone/DJI_0153.JPG',
    description: 'Stunning high-altitude perspectives capturing natural beauty',
  },
  {
    id: 2,
    title: 'Urban Development Project',
    category: 'Drone',
    image: '/drone/DJI_0467.JPG',
    description: 'Professional documentation of construction and development progress',
  },
  {
    id: 3,
    title: 'Real Estate Showcase',
    category: 'Drone',
    image: '/drone/DJI_0710.JPG',
    description: 'Comprehensive aerial views of premium properties and estates',
  },
];

export function FeaturedWork() {
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
