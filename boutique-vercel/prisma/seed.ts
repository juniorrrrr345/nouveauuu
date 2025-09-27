import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Créer des catégories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Légumes' },
      update: {},
      create: {
        name: 'Légumes',
        description: 'Légumes frais de saison',
        order: 1,
      },
    }),
    prisma.category.upsert({
      where: { name: 'Fruits' },
      update: {},
      create: {
        name: 'Fruits',
        description: 'Fruits de saison, cueillis à maturité',
        order: 2,
      },
    }),
    prisma.category.upsert({
      where: { name: 'Produits laitiers' },
      update: {},
      create: {
        name: 'Produits laitiers',
        description: 'Fromages et produits laitiers artisanaux',
        order: 3,
      },
    }),
  ]);

  // Créer des fermes
  const farms = await Promise.all([
    prisma.farm.upsert({
      where: { name: 'Ferme du Soleil' },
      update: {},
      create: {
        name: 'Ferme du Soleil',
        description: 'Ferme familiale depuis 3 générations, spécialisée dans les légumes bio',
        location: 'Provence, France',
      },
    }),
    prisma.farm.upsert({
      where: { name: 'Vergers de la Vallée' },
      update: {},
      create: {
        name: 'Vergers de la Vallée',
        description: 'Producteur de fruits de qualité dans un environnement préservé',
        location: 'Vallée du Rhône, France',
      },
    }),
  ]);

  // Créer des produits avec prix multiples
  const products = [
    {
      name: 'Tomates cerises bio',
      description: 'Tomates cerises cultivées sans pesticides, goût authentique',
      categoryId: categories[0].id,
      farmId: farms[0].id,
      stock: 25,
      images: JSON.stringify(['https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop']),
      videos: JSON.stringify([]),
      prices: [
        { label: '250g', price: 3.50, isDefault: true },
        { label: '500g', price: 6.00, isDefault: false },
        { label: '1kg', price: 10.00, originalPrice: 12.00, isDefault: false },
      ],
    },
    {
      name: 'Pommes Golden',
      description: 'Pommes Golden croquantes et sucrées, parfaites pour les enfants',
      categoryId: categories[1].id,
      farmId: farms[1].id,
      stock: 50,
      images: JSON.stringify(['https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=400&fit=crop']),
      videos: JSON.stringify([]),
      prices: [
        { label: '1kg', price: 4.50, isDefault: true },
        { label: '2kg', price: 8.00, originalPrice: 9.00, isDefault: false },
        { label: '5kg', price: 18.00, isDefault: false },
      ],
    },
    {
      name: 'Fromage de chèvre',
      description: 'Fromage de chèvre artisanal, affiné dans nos caves',
      categoryId: categories[2].id,
      stock: 15,
      images: JSON.stringify(['https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=400&fit=crop']),
      videos: JSON.stringify([]),
      prices: [
        { label: '200g', price: 8.50, isDefault: true },
        { label: '400g', price: 15.00, isDefault: false },
      ],
    },
    {
      name: 'Courgettes bio',
      description: 'Courgettes biologiques, fraîchement récoltées',
      categoryId: categories[0].id,
      farmId: farms[0].id,
      stock: 30,
      images: JSON.stringify(['https://images.unsplash.com/photo-1591958911259-bee2173bdab6?w=400&h=400&fit=crop']),
      videos: JSON.stringify([]),
      prices: [
        { label: '500g', price: 2.50, isDefault: true },
        { label: '1kg', price: 4.50, isDefault: false },
      ],
    },
  ];

  for (const productData of products) {
    const { prices, ...product } = productData;
    
    const createdProduct = await prisma.product.upsert({
      where: { name: product.name },
      update: {},
      create: product,
    });

    // Créer les prix
    for (const price of prices) {
      await prisma.productPrice.upsert({
        where: { 
          productId_label: {
            productId: createdProduct.id,
            label: price.label,
          }
        },
        update: {},
        create: {
          ...price,
          productId: createdProduct.id,
        },
      });
    }
  }

  // Créer des réseaux sociaux de démonstration
  await prisma.socialMedia.upsert({
    where: { platform: 'facebook' },
    update: {},
    create: {
      platform: 'facebook',
      name: 'Notre Facebook',
      url: 'https://facebook.com/boutique',
      order: 1,
    },
  });

  await prisma.socialMedia.upsert({
    where: { platform: 'instagram' },
    update: {},
    create: {
      platform: 'instagram',
      name: 'Instagram',
      url: 'https://instagram.com/boutique',
      order: 2,
    },
  });

  // Configuration du site
  await prisma.siteConfig.upsert({
    where: { key: 'site_name' },
    update: {},
    create: {
      key: 'site_name',
      value: 'Boutique Fresh',
      type: 'text',
    },
  });

  await prisma.siteConfig.upsert({
    where: { key: 'site_description' },
    update: {},
    create: {
      key: 'site_description',
      value: 'Découvrez nos produits frais de qualité, directement de nos fermes partenaires',
      type: 'text',
    },
  });

  await prisma.siteConfig.upsert({
    where: { key: 'promotion_images' },
    update: {},
    create: {
      key: 'promotion_images',
      value: JSON.stringify([
        'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=400&fit=crop',
        'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=400&fit=crop',
      ]),
      type: 'json',
    },
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