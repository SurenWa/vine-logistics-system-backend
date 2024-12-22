import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
    // create two dummy articles
    const post1 = await prisma.businesses.upsert({
        where: { businessName: 'Test Business 1' }, // Ensure the unique identifier field is used here
        update: {},
        create: {
            businessName: 'Test Business 1',
            businessAddress: 'Test Business Address 1',
            businessNumber: '123456',
            telephoneNumber: '+123456789',
            isActive: true,
        },
    });
    // const post2 = await prisma.article.upsert({
    //     where: { title: "What's new in Prisma? (Q1/22)" },
    //     update: {},
    //     create: {
    //         title: "What's new in Prisma? (Q1/22)",
    //         body: 'Our engineers have been working hard, issuing new releases with many improvements...',
    //         description:
    //             'Learn about everything in the Prisma ecosystem and community from January to March 2022.',
    //         published: true,
    //     },
    // });
    // console.log({ post1, post2 });
}

// execute the main function
main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        // close Prisma Client at the end
        await prisma.$disconnect();
    });
