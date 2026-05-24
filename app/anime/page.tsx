import Link from "next/link";
import { prisma } from "@/lib/prisma";

type AnimePageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function AnimePage({ searchParams }: AnimePageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";

  const anime = await prisma.anime.findMany({
    where: query
      ? {
          title: {
            contains: query,
          },
        }
      : undefined,
    orderBy: { title: "asc" },
    include: {
      seasons: {
        include: {
          episodes: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Anime Catalog</h1>
      <form action="/anime" className="flex max-w-xl gap-2" method="get">
        <input
          className="w-full rounded-md border border-zinc-300 px-3 py-2"
          defaultValue={query}
          name="q"
          placeholder="Search by anime title"
        />
        <button className="rounded-md bg-zinc-900 px-4 py-2 text-white" type="submit">
          Search
        </button>
      </form>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {anime.map((item) => {
          const episodeCount = item.seasons.reduce((sum, season) => sum + season.episodes.length, 0);
          return (
            <Link
              className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm hover:border-zinc-400"
              href={`/anime/${item.slug}`}
              key={item.id}
            >
              <p className="text-lg font-semibold">{item.title}</p>
              <p className="mt-2 text-sm text-zinc-600 line-clamp-3">{item.description}</p>
              <p className="mt-3 text-xs text-zinc-500">
                {item.seasons.length} seasons • {episodeCount} episodes
              </p>
            </Link>
          );
        })}
      </div>

      {anime.length === 0 ? (
        <p className="rounded-md border border-dashed border-zinc-300 bg-white p-6 text-zinc-600">
          No anime matched your search.
        </p>
      ) : null}
    </div>
  );
}
