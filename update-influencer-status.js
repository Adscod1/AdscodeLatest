const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Update all PENDING influencers to APPROVED
  const result = await prisma.influencer.updateMany({
    where: {
      status: 'PENDING'
    },
    data: {
      status: 'APPROVED',
      approvalDate: new Date()
    }
  });

  console.log(`Updated ${result.count} influencer(s) to APPROVED status`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
