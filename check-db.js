const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTables() {
  try {
    const result = await prisma.$queryRawUnsafe('SELECT name FROM sqlite_master WHERE type="table";');
    console.log('Tables in the database:');
    result.forEach(table => console.log('-', table.name));
    
    try {
      const influencerCount = await prisma.influencer.count();
      console.log('\nNumber of influencer records:', influencerCount);
    } catch (e) {
      console.error('\nCould not count influencer records:', e.message);
    }
    
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

checkTables();
