import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      role: Role.ADMIN,
      passwordHash: adminPassword,
    },
  });

  const anime = await prisma.anime.upsert({
    where: { slug: "echoes-of-neon" },
    update: {},
    create: {
      slug: "echoes-of-neon",
      title: "Echoes of Neon",
      description:
        "A cyber-fantasy saga following archivists who decode memories hidden in neon storms.",
      coverImage:
        "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop&w=900&q=80",
      metadata: JSON.stringify({
        genres: ["Sci-Fi", "Adventure"],
        studio: "Nebula Works",
      }),
    },
  });

  const seasonOne = await prisma.season.upsert({
    where: {
      animeId_seasonNumber: {
        animeId: anime.id,
        seasonNumber: 1,
      },
    },
    update: {},
    create: {
      animeId: anime.id,
      seasonNumber: 1,
      title: "Season 1",
    },
  });

  const episodeOne = await prisma.episode.upsert({
    where: {
      seasonId_episodeNumber: {
        seasonId: seasonOne.id,
        episodeNumber: 1,
      },
    },
    update: {},
    create: {
      seasonId: seasonOne.id,
      episodeNumber: 1,
      title: "Stormlight Awakening",
      description: "The archivists begin their first memory recovery mission.",
      durationSec: 4200,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=900&q=80",
    },
  });

  await prisma.watchProgress.upsert({
    where: {
      userId_episodeId: {
        userId: admin.id,
        episodeId: episodeOne.id,
      },
    },
    update: {
      progressSec: 900,
      completed: false,
    },
    create: {
      userId: admin.id,
      episodeId: episodeOne.id,
      progressSec: 900,
      completed: false,
    },
  });

  await prisma.watchHistory.create({
    data: {
      userId: admin.id,
      episodeId: episodeOne.id,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
