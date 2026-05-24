import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const featured = await prisma.anime.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      seasons: {
        include: {
          episodes: true,
        },
      },
    },
    take: 4,
  });

  return (
    <div className="space-y-8">
      <section className="rounded-xl bg-zinc-900 p-8 text-white">
        <h1 className="text-3xl font-bold">Licensed Anime Streaming Platform</h1>
        <p className="mt-3 max-w-3xl text-zinc-200">
          Browse organized anime series, watch long-form episodes, and track viewing progress from your dashboard.
        </p>
        <form className="mt-6 flex max-w-xl gap-2" action="/anime" method="get">
          <input
            className="w-full rounded-md border border-zinc-600 bg-zinc-800 px-3 py-2"
            name="q"
            placeholder="Search anime title..."
          />
          <button className="rounded-md bg-white px-4 py-2 font-medium text-zinc-900" type="submit">
            Search
          </button>
        </form>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Recently Added</h2>
          <Link href="/anime" className="text-sm font-medium text-zinc-700 hover:underline">
            View full catalog
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {featured.map((anime) => {
            const episodeCount = anime.seasons.reduce((sum, season) => sum + season.episodes.length, 0);
            return (
              <Link
                href={`/anime/${anime.slug}`}
                key={anime.id}
                className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm hover:border-zinc-400"
              >
                <p className="text-lg font-semibold">{anime.title}</p>
                <p className="mt-1 text-sm text-zinc-600 line-clamp-2">{anime.description}</p>
                <p className="mt-2 text-xs text-zinc-500">
                  {anime.seasons.length} season(s) • {episodeCount} episode(s)
                </p>
              </Link>
            );
          })}
          {featured.length === 0 ? (
            <p className="rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-zinc-600">
              No anime uploaded yet. Sign in as admin to add series, seasons, and episodes.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
