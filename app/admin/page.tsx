import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createAnime, createEpisode, createSeason } from "./actions";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/login");
  }

  const [anime, seasons] = await Promise.all([
    prisma.anime.findMany({ orderBy: { title: "asc" } }),
    prisma.season.findMany({
      orderBy: [{ anime: { title: "asc" } }, { seasonNumber: "asc" }],
      include: { anime: true },
    }),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Admin Content Manager</h1>

      <section className="rounded-lg border border-zinc-200 bg-white p-6">
        <h2 className="text-xl font-semibold">Add Anime Series</h2>
        <form action={createAnime} className="mt-4 grid gap-3 md:grid-cols-2">
          <input className="rounded border border-zinc-300 px-3 py-2" name="title" placeholder="Anime title" required />
          <input className="rounded border border-zinc-300 px-3 py-2" name="coverImage" placeholder="Cover image URL" required />
          <textarea
            className="rounded border border-zinc-300 px-3 py-2 md:col-span-2"
            name="description"
            placeholder="Description"
            required
          />
          <input
            className="rounded border border-zinc-300 px-3 py-2 md:col-span-2"
            name="metadata"
            placeholder='Metadata JSON, e.g. {"genres":["Action"]}'
          />
          <button className="rounded bg-zinc-900 px-4 py-2 text-white md:col-span-2" type="submit">
            Save anime
          </button>
        </form>
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white p-6">
        <h2 className="text-xl font-semibold">Add Season</h2>
        <form action={createSeason} className="mt-4 grid gap-3 md:grid-cols-2">
          <select className="rounded border border-zinc-300 px-3 py-2" name="animeId" required>
            <option value="">Select anime</option>
            {anime.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
          <input
            className="rounded border border-zinc-300 px-3 py-2"
            min={1}
            name="seasonNumber"
            placeholder="Season number"
            required
            type="number"
          />
          <input
            className="rounded border border-zinc-300 px-3 py-2 md:col-span-2"
            name="title"
            placeholder="Season title"
            required
          />
          <button className="rounded bg-zinc-900 px-4 py-2 text-white md:col-span-2" type="submit">
            Save season
          </button>
        </form>
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white p-6">
        <h2 className="text-xl font-semibold">Add Episode</h2>
        <form action={createEpisode} className="mt-4 grid gap-3 md:grid-cols-2">
          <select className="rounded border border-zinc-300 px-3 py-2" name="seasonId" required>
            <option value="">Select season</option>
            {seasons.map((season) => (
              <option key={season.id} value={season.id}>
                {season.anime.title} - Season {season.seasonNumber}
              </option>
            ))}
          </select>
          <input
            className="rounded border border-zinc-300 px-3 py-2"
            min={1}
            name="episodeNumber"
            placeholder="Episode number"
            required
            type="number"
          />
          <input className="rounded border border-zinc-300 px-3 py-2 md:col-span-2" name="title" placeholder="Episode title" required />
          <textarea
            className="rounded border border-zinc-300 px-3 py-2 md:col-span-2"
            name="description"
            placeholder="Episode description"
            required
          />
          <input
            className="rounded border border-zinc-300 px-3 py-2"
            min={1}
            name="durationSec"
            placeholder="Duration in seconds"
            required
            type="number"
          />
          <input className="rounded border border-zinc-300 px-3 py-2" name="videoUrl" placeholder="Video URL" required />
          <input
            className="rounded border border-zinc-300 px-3 py-2 md:col-span-2"
            name="thumbnailUrl"
            placeholder="Thumbnail URL (optional)"
          />
          <button className="rounded bg-zinc-900 px-4 py-2 text-white md:col-span-2" type="submit">
            Save episode
          </button>
        </form>
      </section>
    </div>
  );
}
