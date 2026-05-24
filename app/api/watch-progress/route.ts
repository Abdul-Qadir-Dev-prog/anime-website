import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
    await prisma.watchHistory.create({
      data: {
        userId: session.user.id,
        episodeId,
      },
    });
  }

  return NextResponse.json({ ok: true });
}
