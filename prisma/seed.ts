import { projetos } from './projetos';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.projeto.createMany({ data: projetos, skipDuplicates: true });
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

// arrumar para camel case
// yarn prisma db seed
// yarn prisma migrate reset => roda o seed também
