import { DBEnums } from '@/lib/types/database';

export type BreadCrumb = {
  label: string;
  href: string;
};

export type ProductCardData = {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categories: Categories;
  tags?: string[];
  availableColors?: string[];
};

export type BasketItemData = {
  imageUrl: string;
  productName: string;
  price: number;
  selectedColor: string;
  selectedSize: DBEnums['product_size'];
  quantity: number;
};

export type Categories = (
  | (typeof productCategories)[keyof typeof productCategories][number]
  | (typeof metaCategories)[number]
)[];

export const metaCategories = [
  'made',
  'new',
  'top',
  'shirt',
  'knit',
  'bottom',
  'outer',
  'ops/sk',
] as const;

export type MetaCategory = (typeof metaCategories)[number];
export type ProductCategory = {
  [K in MetaCategory]: string[];
};

export const productCategories = {
  made: ['outer', 'top', 'bottom', 'ops', 'lento', 'acc'],
  new: ['상의', '셔츠', '니트', '하의', '아우터', '원피스/스커트'],
  top: ['티셔츠', '맨투맨/후드', '슬리브리스'],
  shirt: ['셔츠', '블라우스', '폴로/카라티'],
  knit: ['니트', '가디건', '베스트'],
  bottom: ['데님', '팬츠', '슬랙스', '쇼츠', '조거팬츠', '스판혼방'],
  outer: ['코트', '자켓', '가디건', '점퍼', '핸드메이드'],
  'ops/sk': ['원피스', '스커트', '미디-롱 스커트'],
} as const satisfies ProductCategory;

export const uniqueCategories = Array.from(
  new Set(metaCategories.map((meta) => [meta, ...productCategories[meta]]).flat()),
);
