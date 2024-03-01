import { MetadataRoute, Route } from 'next';
import { absoluteUrl } from '@/lib/utils';
import { productCategories, subCategories } from '@/config/product';
import { createAdminClient } from '@/lib/supabase/admin';

export default async function sitemap():Promise<MetadataRoute.Sitemap> {
  const supabse = createAdminClient();

  const {data: allProducts} = await supabse.from('products').select('name')
    .eq('sale_state', '판매중');

  const productsRoutes = allProducts.map((product) => ({
    url: absoluteUrl(`/product/${product.name}`),
    lastModified: new Date().toISOString(),
  }))

  const manageProductsRoutes = allProducts.map((product) => ({
    url: absoluteUrl(`/admin/manage-products/${product.name}`),
    lastModified: new Date().toISOString(),
  }))

  const categoriesRoutes = productCategories.map((category) => ({
    url: absoluteUrl(`/category/${category}`),
    lastModified: new Date().toISOString(),
  }));

  const subcategoriesRoutes = productCategories.map((category) =>
      subCategories[category].map((subcategory) => ({
        url: absoluteUrl(`/category/${category}/${subcategory}`),
        lastModified: new Date().toISOString(),
      }))
    )
    .flat()

  const routes = ([
    "/",
    "/admin",
    "/admin/invoices",
    "/admin/search-products",
    "/admin/add-products",
    "/order/basket",
    "/order/list",
    "/order/checkout",
  ] satisfies Route[]).map((route) => ({
    url: absoluteUrl(route),
    lastModified: new Date().toISOString(),
  }));

  return [
    ...routes,
    ...categoriesRoutes,
    ...subcategoriesRoutes,
    ...productsRoutes,
    ...manageProductsRoutes,
  ]
}
