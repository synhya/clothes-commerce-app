import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase/schema';
import { metaCategories, productCategories } from '@/lib/types/client';

const categorizeProductsDb = async () => {
  const supabase = createClient<Database>(
    'https://ggvgrgddongthsuycbym.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdndmdyZ2Rkb25ndGhzdXljYnltIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNjk0OTU1MCwiZXhwIjoyMDIyNTI1NTUwfQ.Ve91-mEmbBCQHUMQZR_Irqvs28oChQ284ylcg0xfbrY',
  );

  const { data, error } = await supabase.from('products').select('*');

  if (error) {
    console.error(error);
    return;
  }

  for (const product of data) {
    let newCategories: string[] = Array.from(new Set(product.categories));

    product.categories.forEach((category) => {
      metaCategories.forEach((meta) => {
        if (productCategories[meta].includes(category as never)) {
          console.log(meta + ' category added to ' + product.name);
          newCategories.push(meta);
        }
      });
    });

    const { error } = await supabase
      .from('products')
      .update({ categories: newCategories })
      .eq('id', product.id);
    if (error) {
      console.error(error);
    } else {
      console.log('Categories updated for ' + product.name);
    }
  }
};

categorizeProductsDb();
