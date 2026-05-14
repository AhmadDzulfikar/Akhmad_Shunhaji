import { prisma } from "../lib/prisma.ts";
import { INITIAL_BOOKS } from "../lib/initial-books.ts";

async function main() {
  let createdCount = 0;

  for (const book of INITIAL_BOOKS) {
    const existing = await prisma.book.findUnique({
      where: {
        slug: book.slug,
      },
      select: {
        id: true,
      },
    });

    if (existing) {
      continue;
    }

    await prisma.book.create({
      data: {
        slug: book.slug,
        title: book.title,
        description: book.description,
        imageUrl: book.imageUrl,
        buyUrl: book.buyUrl,
      },
    });

    createdCount += 1;
    console.log(`Created initial book: ${book.slug}`);
  }

  console.log(`Done. Created ${createdCount} initial book(s).`);
}

main()
  .catch((error) => {
    console.error("Failed to backfill books.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
