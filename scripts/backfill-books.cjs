const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const DEFAULT_BOOK_BUY_URL = "https://www.instagram.com/shunhaji_09/";

const books = [
  {
    slug: "aku-kamu-dan-dia",
    title: "Aku, Kamu, DIA",
    description:
      "Buku ini mengajak pembaca berhenti sebentar dari ramainya hari, lalu bertanya dengan jujur tentang arah hidup. Lewat tiga pilar Aku, Kamu, dan DIA, pembaca diajak mengenal diri, memahami sesama, dan menata hubungan dengan Sang Pencipta.",
    imageUrl: "/aku_kamu_dan_dia.webp",
    buyUrl: DEFAULT_BOOK_BUY_URL,
  },
  {
    slug: "integrasi-filsafat-islam",
    title: "Integrasi Filsafat Islam dalam Pengembangan Pendidikan",
    description:
      "Buku ini memandang pendidikan bukan hanya sebagai metode mengajar, tetapi sebagai arah pembentukan manusia. Filsafat Islam dipakai sebagai fondasi untuk memadukan akal, wahyu, adab, dan kurikulum yang menumbuhkan iman serta akhlak.",
    imageUrl: "/integrasi_filsafat_islam_.webp",
    buyUrl: DEFAULT_BOOK_BUY_URL,
  },
  {
    slug: "manajemen-cinta-dalam-pendidikan",
    title: "Manajemen Cinta dalam Pendidikan",
    description:
      "Buku ini menghadirkan cinta sebagai fondasi pendidikan yang profesional dan terarah. Cinta dipahami sebagai komitmen nyata: perhatian penuh, penghargaan terhadap peserta didik, dan iklim belajar yang aman, hangat, serta efektif.",
    imageUrl: "/manajemen_cinta_dalam_pendidikan.webp",
    buyUrl: "https://shopee.co.id/product/270374387/27938913723/",
  },
  {
    slug: "manajemen-cinta-sebagai-hidden-curriculum",
    title: "Manajemen Cinta sebagai Hidden Curriculum di Madrasah",
    description:
      "Buku ini membahas cinta sebagai kurikulum tersembunyi yang hidup lewat kebiasaan madrasah: cara guru menyapa, menegur, mendengar, dan membangun suasana aman. Cinta dilihat sebagai kasih sayang, respek, empati, tanggung jawab, dan integritas.",
    imageUrl: "/manajemen_cinta_sebagai_hidden.webp",
    buyUrl: "https://shopee.co.id/product/270374387/41827660194/",
  },
  {
    slug: "konsep-dasar-manajemen-cinta",
    title: "Konsep Dasar Manajemen Cinta dalam Pendidikan",
    description:
      "Buku ini merapikan gagasan Manajemen Cinta menjadi konsep yang praktis untuk kelas dan lembaga. Nilai rahmah, adl, amanah, ihsan, dan syura dihubungkan dengan tata kelola, empati, keadilan, dan kinerja yang terukur.",
    imageUrl: "/konsep_dasar_manajemen_cinta.webp",
    buyUrl: DEFAULT_BOOK_BUY_URL,
  },
];

async function main() {
  let createdCount = 0;

  for (const book of books) {
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
      data: book,
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
