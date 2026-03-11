import Link from 'next/link';
import { SITE_CONFIG, CONTACT_INFO } from '@/lib/constants';

const footerNavigation = {
  shop: [
    { name: 'All Products', href: '/shop' },
    { name: 'Custom Orders', href: '/custom' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Drone Services', href: '/drone' },
    { name: 'Contact', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <span className="text-lg font-black uppercase tracking-[0.15em] text-white">
              All Around
            </span>
            <p className="mt-4 text-sm leading-relaxed text-text-muted">
              Custom apparel, Cricut designs, and professional drone photography services.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white">Shop</h3>
            <ul className="mt-4 space-y-2">
              {footerNavigation.shop.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-text-muted transition-colors hover:text-white">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white">Company</h3>
            <ul className="mt-4 space-y-2">
              {footerNavigation.company.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-text-muted transition-colors hover:text-white">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white">Contact</h3>
            <div className="mt-4 space-y-2 text-sm text-text-muted">
              <p>
                <a href={`tel:${CONTACT_INFO.phone}`} className="transition-colors hover:text-white">
                  {CONTACT_INFO.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${CONTACT_INFO.email}`} className="transition-colors hover:text-white">
                  {CONTACT_INFO.email}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 flex flex-col items-center justify-between border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-text-muted">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <div className="mt-4 flex space-x-6 md:mt-0">
            {footerNavigation.legal.map((item) => (
              <Link key={item.name} href={item.href} className="text-sm text-text-muted transition-colors hover:text-white">
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}