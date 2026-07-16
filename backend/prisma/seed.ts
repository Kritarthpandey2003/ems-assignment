import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const superAdmin = await prisma.employee.upsert({
    where: { email: 'admin@ems.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@ems.com',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      department: 'Administration',
      designation: 'CEO',
      salary: 100000,
      joiningDate: new Date(),
    },
  });

  console.log({ superAdmin });
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
