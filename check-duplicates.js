const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDuplicates() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10
  });
  
  console.log('Recent products:');
  products.forEach(p => {
    console.log(`- ${p.title} (${p.id}) - ${p.createdAt}`);
  });
  
  const titleCounts = {};
  products.forEach(p => {
    titleCounts[p.title] = (titleCounts[p.title] || 0) + 1;
  });
  
  console.log('\nTitle counts:');
  Object.entries(titleCounts).forEach(([title, count]) => {
    if (count > 1) {
      console.log(`"${title}": ${count} occurrences`);
    }
  });
  
  await prisma.$disconnect();
}

checkDuplicates().catch(console.error);
