import * as z from 'zod';
import { DBEnums, ProductSubmit } from '@/lib/types';
import { ZodTypeAny } from 'zod';
import { productSaleState } from '@/config/product';

export const productSchema = z.object({
  name: z
    .string({ required_error: '상품명을 입력해주세요.' })
    .min(1, { message: '상품명은 1자 이상입니다.' })
    .max(100, { message: '상품명은 100자 이하입니다.' }),
  description: z.string({
    required_error: '상품 설명을 입력해주세요.',
  }),
  price: z.coerce
    .number({
      required_error: '가격을 입력해주세요.',
    })
    .positive('가격은 양수입니다.')
    .int('가격은 정수입니다.'),
  categories: z.string().array().min(1, { message: '카테고리를 한개 이상 선택해주세요' }),
  tags: z
    .object({
      value: z
        .string({
          required_error: '태그를 입력해주세요.',
        })
        .min(1, { message: '태그를 입력해주세요.' }),
    })
    .array(),
  available_sizes: z
    .custom<DBEnums['product_size']>()
    .array()
    .min(1, { message: '사이즈를 한개 이상 선택해주세요' }),
  available_colors: z
    .object({
      value: z
        .string({
          invalid_type_error: '색상을 입력해주세요.',
        })
        .min(1, { message: '색상을 입력해주세요.' }),
    })
    .array(),
  imageFiles: z.custom<FileList>(),
  sale_state: z.enum(productSaleState),
} satisfies Record<keyof Omit<ProductSubmit, 'image_url'> | 'imageFiles', ZodTypeAny>);

export const getProductsSchema = z.object({
  limit: z.number().default(10),
  offset: z.number().default(0),
  categories: z.string().optional().nullable(),
  subcategories: z.string().optional().nullable(),
  sort: z.string().optional().nullable(),
  price_range: z.string().optional().nullable(),
  store_ids: z.string().optional().nullable(),
  active: z.string().optional().nullable(),
})

// export const productSchema = z.object({
//   name: z.string().min(1, {
//     message: "Must be at least 1 character",
//   }),
//   description: z.string().optional(),
//   category: z
//     .enum(products.category.enumValues, {
//       required_error: "Must be a valid category",
//     })
//     .default(products.category.enumValues[0]),
//   subcategory: z.string().optional().nullable(),
//   price: z.string().regex(/^\d+(\.\d{1,2})?$/, {
//     message: "Must be a valid price",
//   }),
//   inventory: z.number(),
//   images: z
//     .unknown()
//     .refine((val) => {
//       if (!Array.isArray(val)) return false
//       if (val.some((file) => !(file instanceof File))) return false
//       return true
//     }, "Must be an array of File")
//     .optional()
//     .nullable()
//     .default(null),
// })

// export const filterProductsSchema = z.object({
//   query: z.string(),
// })
//
// export const getProductSchema = z.object({
//   id: z.number(),
//   storeId: z.number(),
// })
//
// export const getProductInventorySchema = z.object({
//   id: z.number(),
// })
//
// export const getProductsSchema = z.object({
//   limit: z.number().default(10),
//   offset: z.number().default(0),
//   categories: z.string().optional().nullable(),
//   subcategories: z.string().optional().nullable(),
//   sort: z.string().optional().nullable(),
//   price_range: z.string().optional().nullable(),
//   store_ids: z.string().optional().nullable(),
//   active: z.string().optional().nullable(),
// })
//
// export const updateProductRatingSchema = z.object({
//   id: z.number(),
//   rating: z.number(),
// })
