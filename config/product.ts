import { SubCategory } from '@/lib/types';

export const productCategories = [
  'made',
  'new',
  'top',
  'shirt',
  'knit',
  'bottom',
  'outer',
  'ops/sk',
] as const;
export const subCategories = {
  made: ['outer', 'top', 'bottom', 'ops', 'lento', 'acc'],
  new: ['상의', '셔츠', '니트', '하의', '아우터', '원피스/스커트'],
  top: ['티셔츠', '맨투맨/후드', '슬리브리스'],
  shirt: ['셔츠', '블라우스', '폴로/카라티'],
  knit: ['니트', '가디건', '베스트'],
  bottom: ['데님', '팬츠', '슬랙스', '쇼츠', '조거팬츠', '스판혼방'],
  outer: ['코트', '자켓', '가디건', '점퍼', '핸드메이드'],
  'ops/sk': ['원피스', '스커트', '미디-롱 스커트'],
} as const satisfies SubCategory;
export const uniqueCategories = Array.from(
  new Set(productCategories.map((meta) => [meta, ...subCategories[meta]]).flat()),
);
export const productSizeEnums = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
export const productSaleState = ['판매중', '대기중'] as const;
export const shipmentMethodEnums = ['택배배송', '퀵서비스', '직접수령'] as const;
export const categoryOptions = ['전체', ...uniqueCategories] as const;
export const sellStatusOptions = ['전체', ...productSaleState] as const;
