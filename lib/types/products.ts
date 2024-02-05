export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: (typeof ProductCategories)[number];
  image: string;
}

// sample data
export const Products: Product[] = [
  {
    id: '1',
    name: 'Shirt',
    description: 'A nice shirt.',
    price: 20,
    category: 'shirt',
    image: '/shirt.jpg',
  },
  {
    id: '2',
    name: 'Pants',
    description: 'A nice pants.',
    price: 40,
    category: 'pants',
    image: '/pants.jpg',
  },
  {
    id: '3',
    name: 'Shoes',
    description: 'A nice shoes.',
    price: 60,
    category: 'shoes',
    image: '/shoes.jpg',
  },
  {
    id: '4',
    name: 'Hat',
    description: 'A nice hat.',
    price: 20,
    category: 'hat',
    image: '/hat.jpg',
  },
  {
    id: '5',
    name: 'Socks',
    description: 'A nice socks.',
    price: 10,
    category: 'socks',
    image: '/socks.jpg',
  },
  {
    id: '6',
    name: 'Jacket',
    description: 'A nice jacket.',
    price: 100,
    category: 'jacket',
    image: '/jacket.jpg',
  },
  {
    id: '7',
    name: 'Gloves',
    description: 'A nice gloves.',
    price: 20,
    category: 'gloves',
    image: '/gloves.jpg',
  },
  {
    id: '8',
    name: 'Scarf',
    description: 'A nice scarf.',
    price: 20,
    category: 'scarf',
    image: '/scarf.jpg',
  },
];

export const ProductCategories = [
  'shirt',
  'pants',
  'shoes',
  'hat',
  'socks',
  'jacket',
  'gloves',
  'scarf',
] as const;
