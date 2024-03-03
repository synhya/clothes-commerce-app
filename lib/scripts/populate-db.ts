import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase/schema';
import * as fs from 'fs';
import { ProductSubmit } from '@/lib/types';
import { productSizeEnums, uniqueCategories } from '@/config/product';
import { fakerKO as faker } from '@faker-js/faker';

const dirName = process.cwd() + '\\public\\products';

const translateMap = {
  color: {
    'black': '검정',
    'blue': '파랑',
    'white': '흰색',
    'gray': '회색',
    'beige': '베이지',
  },
  name : {
    'cap': '모자',
    'onesie': '원피스',
    'shoes': '신발',
    'bag': '가방',
    'jacket': '자켓',
    'hat': '모자',
    'cup': '컵',
    'sweater': '스웨터',
    'hoodie': '후드',
    'keyboard': '키보드',
    'mug': '머그',
    'sticker': '스티커',
    't-shirt': '티셔츠',
  }
}

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

  const initialColors = ['red', 'blue', 'green', 'yellow', 'black', 'white'];
  const initialTags = ['new', 'hot', 'sale', 'best', 'limited', 'trending'];

  files.map(async (fileName) => {
    const shuffledCat = uniqueCategories.sort(() => 0.5 - Math.random());

    const name = faker.commerce.productName();

    // faker.commerce.productAdjective() + ' ' +
    // Object.entries(translateMap.name).forEach(([key, value]) => {
    //   if (fileName.includes(key)) {
    //     fileName = fileName.replace(key, value);
    //   }
    // });

    const product: ProductSubmit = {
      name: name,
      image_url: fileName,
      price: Math.floor(Math.random() * 10000) * 10,
      sale_state: '판매중',
      categories: faker.helpers.shuffle(shuffledCat).slice(0, faker.number.int({min: 1, max: 3})),
      description: faker.commerce.productDescription(),
      available_sizes: faker.helpers.shuffle(productSizeEnums).slice(0, faker.number.int({ min: 1, max: 5 })),
      available_colors: faker.helpers.shuffle(initialColors).slice(0, faker.number.int({ min: 2, max: 6 })),
      tags: faker.helpers.shuffle(initialTags).slice(0, faker.number.int({ min: 0, max: 2 })),
    };

    const { error:deleteError } = await supabase.from('products').delete();
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
