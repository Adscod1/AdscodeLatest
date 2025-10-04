const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deleteDuplicates() {
  // Delete one of the duplicate "MTN WakaNet Router" products
  const productToDelete = '8c82adc8-9923-41bd-ae6d-6352f0279b82';
  
  try {
    await prisma.product.delete({
      where: { id: productToDelete }
    });
    console.log('Successfully deleted duplicate product:', productToDelete);
  } catch (error) {
    console.error('Error deleting product:', error);
  }
  
  await prisma.$disconnect();
}

deleteDuplicates();
