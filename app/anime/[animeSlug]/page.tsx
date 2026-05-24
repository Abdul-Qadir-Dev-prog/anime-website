import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDuration } from "@/lib/utils";

type AnimeDetailPageProps = {
  params: Promise<{ animeSlug: string }>;
};

export default async function AnimeDetailPage({ params }: AnimeDetailPageProps) {
  const { animeSlug } = await params;
  const anime = await prisma.anime.findUnique({
    where: { slug: animeSlug },
    include: {
      seasons: {
        orderBy: { seasonNumber: "asc" },
        include: {
          episodes: {
            orderBy: { episodeNumber: "asc" },
          },
        },
      },
    },
  });

  if (!anime) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold">{anime.title}</h1>
        <p className="mt-2 text-zinc-700">{anime.description}</p>
      </div>

      {anime.seasons.map((season) => (
        <section className="rounded-xl border border-zinc-200 bg-white p-6" key={season.id}>
          <h2 className="text-2xl font-semibold">
            Season {season.seasonNumber}: {season.title}
          </h2>
          <div className="mt-4 space-y-3">
            {season.episodes.map((episode) => (
              <div
                className="flex flex-col justify-between gap-3 rounded-md border border-zinc-200 p-4 md:flex-row md:items-center"
                key={episode.id}
              >
                <div>
                  <p className="font-medium">
                    Episode {episode.episodeNumber}: {episode.title}
                  </p>
                  <p className="text-sm text-zinc-600">{episode.description}</p>
                  <p className="text-xs text-zinc-500">Duration: {formatDuration(episode.durationSec)}</p>
                </div>
                <Link
                  className="w-fit rounded-md bg-zinc-900 px-3 py-2 text-sm text-white"
                  href={`/watch/${episode.id}`}
                >
                  Watch episode
                </Link>
              </div>
            ))}
            {season.episodes.length === 0 ? <p className="text-sm text-zinc-500">No episodes yet.</p> : null}
          </div>
        </section>
      ))}
    </div>
  );
}
