import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const HISTORY_ENTRY_DEBOUNCE_MS = 5 * 60 * 1000;

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const episodeId = String(body.episodeId ?? "").trim();
  const progressSec = Number(body.progressSec ?? 0);
  const completed = Boolean(body.completed);

  if (!episodeId || Number.isNaN(progressSec) || progressSec < 0) {
    return NextResponse.json({ message: "Invalid progress payload." }, { status: 400 });
  }

  await prisma.watchProgress.upsert({
    where: {
      userId_episodeId: {
        userId: session.user.id,
        episodeId,
      },
    },
    update: {
      progressSec,
      completed,
    },
    create: {
      userId: session.user.id,
      episodeId,
      progressSec,
      completed,
    },
  });

  if (completed) {
    const latest = await prisma.watchHistory.findFirst({
      where: {
        userId: session.user.id,
        episodeId,
      },
      orderBy: { watchedAt: "desc" },
    });

    const shouldCreate =
      !latest || Date.now() - latest.watchedAt.getTime() > HISTORY_ENTRY_DEBOUNCE_MS;

    if (shouldCreate) {
      await prisma.watchHistory.create({
        data: {
          userId: session.user.id,
          episodeId,
        },
      });
    }
  }

  return NextResponse.json({ ok: true });
}
