"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function createAnime(formData: FormData) {
  await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const coverImage = String(formData.get("coverImage") ?? "").trim();
  const metadata = String(formData.get("metadata") ?? "").trim();

  if (!title || !description || !coverImage) {
    throw new Error("Title, description and cover image are required.");
  }

  await prisma.anime.create({
    data: {
      title,
      slug: slugify(title),
      description,
      coverImage,
      metadata: metadata || null,
    },
  });

  revalidatePath("/anime");
  revalidatePath("/admin");
}

export async function createSeason(formData: FormData) {
  await requireAdmin();

  const animeId = String(formData.get("animeId") ?? "").trim();
  const seasonNumber = Number(formData.get("seasonNumber") ?? 0);
  const title = String(formData.get("title") ?? "").trim();

  if (!animeId || !seasonNumber || !title) {
    throw new Error("Anime, season number and season title are required.");
  }

  await prisma.season.create({
    data: {
      animeId,
      seasonNumber,
      title,
    },
  });

  revalidatePath("/anime");
  revalidatePath("/admin");
}

export async function createEpisode(formData: FormData) {
  await requireAdmin();

  const seasonId = String(formData.get("seasonId") ?? "").trim();
  const episodeNumber = Number(formData.get("episodeNumber") ?? 0);
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const durationSec = Number(formData.get("durationSec") ?? 0);
  const videoUrl = String(formData.get("videoUrl") ?? "").trim();
  const thumbnailUrl = String(formData.get("thumbnailUrl") ?? "").trim();

  if (!seasonId || !episodeNumber || !title || !description || !durationSec || !videoUrl) {
    throw new Error("All episode fields except thumbnail are required.");
  }

  await prisma.episode.create({
    data: {
      seasonId,
      episodeNumber,
      title,
      description,
      durationSec,
      videoUrl,
      thumbnailUrl: thumbnailUrl || null,
    },
  });

  revalidatePath("/anime");
  revalidatePath("/admin");
}
