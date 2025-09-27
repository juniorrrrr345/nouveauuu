import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default site configuration
  await prisma.siteConfig.upsert({
    where: { key: 'site_name' },
    update: {},
    create: {
      key: 'site_name',
      value: 'Boutique Fraîche',
      type: 'text'
    }
  });

  await prisma.siteConfig.upsert({
    where: { key: 'site_description' },
    update: {},
    create: {
      key: 'site_description',
      value: 'Boutique de produits frais directement de nos fermes partenaires',
      type: 'text'
    }
  });

  await prisma.siteConfig.upsert({
    where: { key: 'site_logo' },
    update: {},
    create: {
      key: 'site_logo',
      value: '/logo.svg',
      type: 'text'
    }
  });

  await prisma.siteConfig.upsert({
    where: { key: 'address' },
    update: {},
    create: {
      key: 'address',
      value: '123 Rue de la Ferme, 75000 Paris',
      type: 'text'
    }
  });

  await prisma.siteConfig.upsert({
    where: { key: 'phone' },
    update: {},
    create: {
      key: 'phone',
      value: '+33 1 23 45 67 89',
      type: 'text'
    }
  });

  await prisma.siteConfig.upsert({
    where: { key: 'email' },
    update: {},
    create: {
      key: 'email',
      value: 'contact@boutique-fraiche.fr',
      type: 'text'
    }
  });

  await prisma.siteConfig.upsert({
    where: { key: 'schedule' },
    update: {},
    create: {
      key: 'schedule',
      value: 'Lun-Ven: 9h-18h, Sam: 9h-17h',
      type: 'text'
    }
  });

  // Create default categories
  const category1 = await prisma.category.upsert({
    where: { name: 'Légumes' },
    update: {},
    create: {
      name: 'Légumes',
      isActive: true
    }
  });

  const category2 = await prisma.category.upsert({
    where: { name: 'Fruits' },
    update: {},
    create: {
      name: 'Fruits',
      isActive: true
    }
  });

  const category3 = await prisma.category.upsert({
    where: { name: 'Produits Laitiers' },
    update: {},
    create: {
      name: 'Produits Laitiers',
      isActive: true
    }
  });

  // Create default farms
  const farm1 = await prisma.farm.upsert({
    where: { name: 'Ferme du Soleil' },
    update: {},
    create: {
      name: 'Ferme du Soleil',
      isActive: true
    }
  });

  const farm2 = await prisma.farm.upsert({
    where: { name: 'Ferme BioNature' },
    update: {},
    create: {
      name: 'Ferme BioNature',
      isActive: true
    }
  });

  // Create example products
  const product1 = await prisma.product.upsert({
    where: { id: 'tomatoes-example' },
    update: {},
    create: {
      id: 'tomatoes-example',
      name: 'Tomates Cerises Bio',
      description: 'Tomates cerises fraîches et juteuses, cultivées sans pesticides',
      images: JSON.stringify(['/images/tomatoes.jpg']),
      videos: JSON.stringify([]),
      categoryId: category1.id,
      farmId: farm1.id,
      isActive: true
    }
  });

  const product2 = await prisma.product.upsert({
    where: { id: 'carrots-example' },
    update: {},
    create: {
      id: 'carrots-example',
      name: 'Carottes Bio',
      description: 'Carottes croquantes et sucrées, parfaites pour vos salades',
      images: JSON.stringify(['/images/carrots.jpg']),
      videos: JSON.stringify([]),
      categoryId: category1.id,
      farmId: farm1.id,
      isActive: true
    }
  });

  const product3 = await prisma.product.upsert({
    where: { id: 'apples-example' },
    update: {},
    create: {
      id: 'apples-example',
      name: 'Pommes Golden',
      description: 'Pommes golden délicieuses et parfumées',
      images: JSON.stringify(['/images/apples.jpg']),
      videos: JSON.stringify([]),
      categoryId: category2.id,
      farmId: farm2.id,
      isActive: true
    }
  });

  const product4 = await prisma.product.upsert({
    where: { id: 'milk-example' },
    update: {},
    create: {
      id: 'milk-example',
      name: 'Lait de Vache Bio',
      description: 'Lait frais de vaches élevées en plein air',
      images: JSON.stringify(['/images/milk.jpg']),
      videos: JSON.stringify([]),
      categoryId: category3.id,
      farmId: farm2.id,
      isActive: true
    }
  });

  // Create prices for products
  await prisma.productPrice.upsert({
    where: { productId_label: { productId: product1.id, label: '500g' } },
    update: {},
    create: {
      productId: product1.id,
      label: '500g',
      price: 4.50,
      isDefault: true
    }
  });

  await prisma.productPrice.upsert({
    where: { productId_label: { productId: product1.id, label: '1kg' } },
    update: {},
    create: {
      productId: product1.id,
      label: '1kg',
      price: 8.00,
      isDefault: false
    }
  });

  await prisma.productPrice.upsert({
    where: { productId_label: { productId: product2.id, label: '1kg' } },
    update: {},
    create: {
      productId: product2.id,
      label: '1kg',
      price: 3.20,
      isDefault: true
    }
  });

  await prisma.productPrice.upsert({
    where: { productId_label: { productId: product3.id, label: '1kg' } },
    update: {},
    create: {
      productId: product3.id,
      label: '1kg',
      price: 5.80,
      isDefault: true
    }
  });

  await prisma.productPrice.upsert({
    where: { productId_label: { productId: product4.id, label: '1L' } },
    update: {},
    create: {
      productId: product4.id,
      label: '1L',
      price: 2.90,
      isDefault: true
    }
  });

  // Create social media links
  await prisma.socialMedia.upsert({
    where: { id: 'whatsapp-default' },
    update: {},
    create: {
      id: 'whatsapp-default',
      platform: 'WhatsApp',
      name: 'WhatsApp',
      url: 'https://wa.me/33123456789',
      isActive: true
    }
  });

  await prisma.socialMedia.upsert({
    where: { id: 'facebook-default' },
    update: {},
    create: {
      id: 'facebook-default',
      platform: 'Facebook',
      name: 'Facebook',
      url: 'https://facebook.com/boutique-fraiche',
      isActive: true
    }
  });

  await prisma.socialMedia.upsert({
    where: { id: 'instagram-default' },
    update: {},
    create: {
      id: 'instagram-default',
      platform: 'Instagram',
      name: 'Instagram',
      url: 'https://instagram.com/boutique_fraiche',
      isActive: true
    }
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });