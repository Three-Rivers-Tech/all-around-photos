'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Shop', href: '/shop' },
  { name: 'Custom', href: '/custom' },
  { name: 'Drone', href: '/drone' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/95 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-lg font-black uppercase tracking-[0.15em] text-white transition-colors hover:text-accent"
          >
            All Around
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-8 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-semibold uppercase tracking-wide text-text-secondary transition-colors hover:text-white"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Cart icon placeholder — will be replaced with CartIcon component */}
          <div className="hidden md:flex items-center">
            <Link
              href="/cart"
              className="relative text-text-secondary transition-colors hover:text-white"
              aria-label="Shopping cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded p-2 text-text-secondary transition-colors hover:text-white md:hidden"
            aria-label="Toggle menu"
          >
            <div className="flex h-6 w-6 flex-col items-center justify-center">
              <span
                className={cn(
                  'block h-0.5 w-5 bg-current transition-all duration-300',
                  isMenuOpen ? 'translate-y-1 rotate-45' : '-translate-y-1'
                )}
              />
              <span
                className={cn(
                  'block h-0.5 w-5 bg-current transition-all duration-300',
                  isMenuOpen ? 'opacity-0' : 'opacity-100'
                )}
              />
              <span
                className={cn(
                  'block h-0.5 w-5 bg-current transition-all duration-300',
                  isMenuOpen ? '-translate-y-1 -rotate-45' : 'translate-y-1'
                )}
              />
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            'overflow-hidden transition-all duration-300 ease-in-out md:hidden',
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <nav className="space-y-1 border-t border-border py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2 text-sm font-semibold uppercase tracking-wide text-text-secondary transition-colors hover:text-white"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/cart"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-2 text-sm font-semibold uppercase tracking-wide text-text-secondary transition-colors hover:text-white"
            >
              Cart
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}