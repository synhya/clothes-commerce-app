import fs from 'fs';
import path from 'path';
import { faker } from '@faker-js/faker/locale/ko';

import { labels, priorities, statuses } from './data';

// index.js
console.log(`process.cwd(): ${process.cwd()}`);
console.log(`__dirname: ${__dirname}`);
console.log(`__filename: ${__filename}`);

const tasks = Array.from({ length: 100 }, () => ({
  id: `TASK-${faker.number.int({ min: 1000, max: 9999 })}`,
  title: faker.hacker.phrase().replace(/^./, (letter) => letter.toUpperCase()),
  status: faker.helpers.arrayElement(statuses).value,
  label: faker.helpers.arrayElement(labels).value,
  priority: faker.helpers.arrayElement(priorities).value,
}));

const users = Array.from({ length: 100 }, () => ({
  id: `USER-${faker.number.int({ min: 1000, max: 9999 })}`,
  name: faker.person.lastName() + faker.person.firstName(),
  email: faker.internet.email(),
  avatar: faker.image.avatar(),
  bio: faker.lorem.sentence(),
  address:
    faker.location.state() +
    ' ' +
    faker.location.city() +
    ' ' +
    faker.location.street() +
    ' ' +
    faker.location.secondaryAddress(),
}));

const products = Array.from({ length: 100 }, () => ({
  id: `PRODUCT-${faker.number.int({ min: 1000, max: 9999 })}`,
  name: faker.commerce.productName(),
  price: faker.commerce.price({ min: 1000, max: 1000000 }),
  image: faker.commerce.productDescription(),
  categories: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () =>
    faker.commerce.department(),
  ),
}));

fs.writeFileSync(path.join(__dirname, 'users.json'), JSON.stringify(users, null, 2));

fs.writeFileSync(path.join(__dirname, 'products.json'), JSON.stringify(products, null, 2));

console.log('✅ Data generated.');
