import React from 'react';
import { fetchProductByName } from '@/lib/fetches';
import { notFound } from 'next/navigation';
import ProductOptionForm from '@/components/page/product/product-option-form';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import Image from 'next/image';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const ProductPage = async ({ params: { slug } }: { params: { slug: string } }) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: product } = await fetchProductByName(decodeURIComponent(slug), supabase);

  if (!product) {
    return notFound();
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('products').getPublicUrl(product.image_url);

  return (
    <div className="mx-auto grid max-w-6xl items-start gap-6 px-4 py-6 md:grid-cols-2 lg:gap-12">
      <AspectRatio ratio={1} className="bg-muted">
        <Image
          src={publicUrl}
          alt={product.name}
          fill
          className="rounded-md object-cover"
          priority
        />
      </AspectRatio>
      <div className="space-y-4">
        <div className="flex flex-col items-start gap-4">
          <h1 className="text-3xl font-bold tracking-tighter lg:text-4xl">{product.name}</h1>
          <div className="grid gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-0.5">
                  <StarIcon className="h-5 w-5 fill-primary" />
                  <StarIcon className="h-5 w-5 fill-primary" />
                  <StarIcon className="h-5 w-5 fill-primary" />
                  <StarIcon className="h-5 w-5 fill-muted stroke-muted-foreground" />
                  <StarIcon className="h-5 w-5 fill-muted stroke-muted-foreground" />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold">{product.price}₩</h2>
              <p className="text-sm leading-loose md:text-base">{product.description}</p>
            </div>
          </div>
        </div>
        <ProductOptionForm
          productId={product.id}
          availableColors={product.available_colors}
          availableSizes={product.available_sizes}
        />
      </div>
    </div>
  );
};

function StarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export default ProductPage;
