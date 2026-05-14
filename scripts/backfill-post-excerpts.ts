import { prisma } from "../lib/prisma.ts";
import { createPostExcerpt } from "../lib/post-content.ts";

async function main() {
  const posts = await prisma.post.findMany({
    where: {
      OR: [{ excerpt: null }, { excerpt: "" }],
    },
    select: {
      id: true,
      slug: true,
      content: true,
    },
    orderBy: { id: "asc" },
  });

  if (posts.length === 0) {
    console.log("No posts need excerpt backfill.");
    return;
  }

  let updatedCount = 0;

  for (const post of posts) {
    await prisma.post.update({
      where: { id: post.id },
      data: {
        excerpt: createPostExcerpt(post.content),
      },
    });

    updatedCount += 1;
    console.log(`Backfilled excerpt for post ${post.id} (${post.slug}).`);
  }

  console.log(`Done. Backfilled ${updatedCount} post excerpt(s).`);
}

main()
  .catch((error) => {
    console.error("Failed to backfill post excerpts.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
