import { z } from 'zod';
import { type ProductCategory, PRODUCT_CATEGORIES } from '@/lib/constants';

// Zod schema for build-time validation of product data
const productSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().int().positive(), // cents
  category: z.enum(['hoodies', 'tshirts', 'coasters', 'other']),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  image: z.string().startsWith('/products/'),
  featured: z.boolean().optional(),
  version: z.number().int().positive(), // increment when price/details change
});

export type Product = z.infer<typeof productSchema>;

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

// Placeholder products — using actual images from public/products
const rawProducts = [
  {
    id: 'classic-hoodie',
    name: 'Classic Logo Hoodie',
    description: 'Premium heavyweight hoodie with custom Cricut-cut design.',
    price: 4500,
    category: PRODUCT_CATEGORIES.HOODIES,
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colors: ['Black', 'White', 'Gray'],
    image: '/products/Hoodie_Design_Grouped_ONE_PAGE_Preview-1.jpg',
    featured: true,
    version: 1,
  },
  {
    id: 'graphic-tee',
    name: 'Graphic Tee',
    description: 'Soft cotton tee with precision Cricut vinyl graphics.',
    price: 2500,
    category: PRODUCT_CATEGORIES.TSHIRTS,
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colors: ['Black', 'White'],
    image: '/products/IMG_20260219_151247049.jpg',
    featured: true,
    version: 1,
  },
  {
    id: 'custom-coasters-set',
    name: 'Custom Coasters (Set of 4)',
    description: 'Handcrafted coasters with custom designs.',
    price: 1500,
    category: PRODUCT_CATEGORIES.COASTERS,
    image: '/products/IMG_20260219_151652388.jpg',
    featured: true,
    version: 1,
  },
  {
    id: 'premium-hoodie',
    name: 'Premium Cut Hoodie',
    description: 'Heavyweight hoodie with multi-layer Cricut design.',
    price: 5500,
    category: PRODUCT_CATEGORIES.HOODIES,
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colors: ['Black', 'Navy'],
    image: '/products/IMG_20260219_152415910.jpg',
    version: 1,
  },
  {
    id: 'vintage-tee',
    name: 'Vintage Logo Tee',
    description: 'Retro-style tee with distressed Cricut print.',
    price: 2800,
    category: PRODUCT_CATEGORIES.TSHIRTS,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Charcoal'],
    image: '/products/IMG_20260219_152603907.jpg',
    version: 1,
  },
  {
    id: 'photo-coasters',
    name: 'Photo Coasters (Set of 4)',
    description: 'Custom photo-printed coasters — great for gifts.',
    price: 2000,
    category: PRODUCT_CATEGORIES.COASTERS,
    image: '/products/IMG_20260219_152742485.jpg',
    version: 1,
  },
] satisfies Product[];

// Validate product data at module load (catches errors at dev/build time)
export const products: Product[] = rawProducts.map((p) => productSchema.parse(p));

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.id === slug);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((p) => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}
