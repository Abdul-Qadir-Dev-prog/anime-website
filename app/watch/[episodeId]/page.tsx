import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EpisodePlayer } from "@/app/components/episode-player";
import { formatDuration } from "@/lib/utils";

type WatchPageProps = {
  params: Promise<{ episodeId: string }>;
};

export default async function WatchPage({ params }: WatchPageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const { episodeId } = await params;
  const episode = await prisma.episode.findUnique({
    where: { id: episodeId },
    include: {
      season: {
        include: {
          anime: true,
        },
      },
    },
  });

  if (!episode) {
    redirect("/anime");
  }

  const progress = await prisma.watchProgress.findUnique({
    where: {
      userId_episodeId: {
        userId: session.user.id,
        episodeId: episode.id,
      },
    },
  });

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm text-zinc-500">{episode.season.anime.title}</p>
        <h1 className="text-2xl font-bold">
          Episode {episode.episodeNumber}: {episode.title}
        </h1>
        <p className="text-sm text-zinc-600">Duration: {formatDuration(episode.durationSec)}</p>
      </div>
      <EpisodePlayer
        episodeId={episode.id}
        startAt={progress?.progressSec ?? 0}
        videoUrl={episode.videoUrl}
      />
      <p className="text-sm text-zinc-600">Playback supports long-form episodes (1 hour or longer).</p>
    </div>
  );
}
