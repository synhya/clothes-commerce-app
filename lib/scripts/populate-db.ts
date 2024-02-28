import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase/schema';
import * as fs from 'fs';
import { uniqueCategories } from '@/lib/types';
import { productSizeEnums, ProductSubmit } from '@/lib/types/database';

const dirName = process.cwd() + '\\public\\products';

const uploadImage = async (files: string[], supabase: SupabaseClient) => {
  for (let i = 0; i < files.length; i++) {
    const fileName = files[i];

    const fileData = fs.readFileSync(dirName + '\\' + fileName);
    const blob = new Blob([fileData], { type: 'image/png' });

    const { error } = await supabase.storage.from('products').upload(fileName, blob, {
      contentType: 'image/png',
      upsert: true,
    });

    if (error) {
      console.log('Error uploading file: ', error);
    } else {
      console.log('File uploaded successfully: ' + fileName);
    }
  }
};

export const populateDb = async () => {
  const supabase = createClient<Database>(
    'https://ggvgrgddongthsuycbym.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdndmdyZ2Rkb25ndGhzdXljYnltIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNjk0OTU1MCwiZXhwIjoyMDIyNTI1NTUwfQ.Ve91-mEmbBCQHUMQZR_Irqvs28oChQ284ylcg0xfbrY',
  );

  const files = fs.readdirSync(dirName);

  // await uploadImage(files, supabase);

  const randomDescPrefix = [
    '멋진',
    '좋은',
    '훌륭한',
    '최고의',
    '아름다운',
    '훈훈한',
    '귀여운',
    '멋있는',
    '좋은',
    '행복한',
  ];
  const randomColors = ['red', 'blue', 'green', 'yellow', 'black', 'white'];
  const randomTags = ['new', 'hot', 'sale', 'best', 'limited', 'trending'];

  files.map(async (fileName) => {
    console.log('File uploaded successfully: ' + fileName);

    const shuffledCat = uniqueCategories.sort(() => 0.5 - Math.random());
    const shuffledColors = randomColors.sort(() => 0.5 - Math.random());
    const shuffledSizes = productSizeEnums.toSorted().sort(() => 0.5 - Math.random());
    const shuffledTags = randomTags.sort(() => 0.5 - Math.random());

    const product: ProductSubmit = {
      name: fileName.split('.')[0],
      image_url: fileName,
      price: Math.floor(Math.random() * 10000) * 10,
      sale_state: '판매중',
      categories: shuffledCat.slice(0, Math.ceil(Math.random() * 2)),
      description:
        randomDescPrefix[Math.floor(Math.random() * randomDescPrefix.length)] + ' 상품입니다.',
      available_sizes: shuffledSizes.slice(0, Math.ceil(Math.random() * 3)),
      available_colors: shuffledColors.slice(0, Math.ceil(Math.random() * 3)),
      tags: shuffledTags.slice(0, Math.ceil(Math.random() * 2)),
    };

    const { error } = await supabase.from('products').upsert({
      ...product,
    });

    if (error) {
      console.log('Error inserting category: ', error);
    } else {
      console.log('Product inserted successfully: ' + fileName);
    }
  });
};

populateDb();
