import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDuration } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const [continueWatching, watchHistory] = await Promise.all([
    prisma.watchProgress.findMany({
      where: {
        userId: session.user.id,
        completed: false,
      },
      orderBy: { lastWatchedAt: "desc" },
      include: {
        episode: {
          include: {
            season: {
              include: {
                anime: true,
              },
            },
          },
        },
      },
      take: 10,
    }),
    prisma.watchHistory.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: { watchedAt: "desc" },
      include: {
        episode: {
          include: {
            season: {
              include: {
                anime: true,
              },
            },
          },
        },
      },
      take: 20,
    }),
  ]);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold">Your Dashboard</h1>
        <p className="mt-2 text-zinc-600">Track recent activity, continue watching, and review your watch history.</p>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Continue Watching</h2>
        <div className="space-y-3">
          {continueWatching.map((item) => (
            <Link
              className="block rounded-md border border-zinc-200 bg-white p-4 hover:border-zinc-400"
              href={`/watch/${item.episodeId}`}
              key={item.id}
            >
              <p className="font-medium">
                {item.episode.season.anime.title} • S{item.episode.season.seasonNumber}E{item.episode.episodeNumber}
              </p>
              <p className="text-sm text-zinc-600">{item.episode.title}</p>
              <p className="text-xs text-zinc-500">
                Progress: {formatDuration(item.progressSec)} / {formatDuration(item.episode.durationSec)}
              </p>
            </Link>
          ))}
          {continueWatching.length === 0 ? (
            <p className="rounded-md border border-dashed border-zinc-300 bg-white p-5 text-sm text-zinc-600">
              Nothing in progress yet.
            </p>
          ) : null}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Recent Activity</h2>
        <div className="space-y-2">
          {watchHistory.map((entry) => (
            <div key={entry.id} className="rounded-md border border-zinc-200 bg-white p-4">
              <p className="font-medium">
                Watched {entry.episode.season.anime.title} • Episode {entry.episode.episodeNumber}
              </p>
              <p className="text-xs text-zinc-500">{entry.watchedAt.toLocaleString()}</p>
            </div>
          ))}
          {watchHistory.length === 0 ? (
            <p className="rounded-md border border-dashed border-zinc-300 bg-white p-5 text-sm text-zinc-600">
              You have no recent watch history.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
