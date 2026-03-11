// Application constants

export const SITE_CONFIG = {
  name: 'All Around Photos LLC',
  description: 'Custom apparel, Cricut designs, and drone photography services',
  url: 'https://allaroundphotos.com',
  ogImage: '/og-image.svg',
} as const;

export const CONTACT_INFO = {
  phone: '(555) 123-4567',
  email: 'info@allaroundphotos.com',
  address: '123 Main St, City, State 12345',
} as const;

export const PRODUCT_CATEGORIES = {
  HOODIES: 'hoodies',
  TSHIRTS: 'tshirts',
  COASTERS: 'coasters',
  OTHER: 'other',
} as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[keyof typeof PRODUCT_CATEGORIES];
