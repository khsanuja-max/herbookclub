// Reads the site's content. For now it comes from the JSON files in /content;
// later this is the one place to switch over to Supabase.

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import thisMonthsPick from "../../content/this-months-pick.json";

export type MonthlyPick = {
  month: string;
  title: string;
  author: string;
  isbn: string;
  headline: string;
  review: string[];
  /** The part after "v=" in a YouTube link. Leave empty until the video is up. */
  youtubeVideoId: string;
};

export type VideoBook = {
  title: string;
  author: string;
  isbn: string;
  note: string;
};

export type VideoCompanion = {
  /** Taken from the file name, e.g. books-for-a-rainy-weekend.json → books-for-a-rainy-weekend */
  slug: string;
  title: string;
  /** Publish date as YYYY-MM-DD; the newest video is listed first */
  date: string;
  youtubeVideoId: string;
  summary: string;
  books: VideoBook[];
};

const videosDir = path.join(process.cwd(), "content", "videos");

export async function getThisMonthsPick(): Promise<MonthlyPick> {
  return thisMonthsPick;
}

/** All video companion pages, newest first. */
export const getVideos = cache(async (): Promise<VideoCompanion[]> => {
  const files = (await readdir(videosDir)).filter((file) =>
    file.endsWith(".json"),
  );

  const videos = await Promise.all(
    files.map(async (file) => {
      const data = JSON.parse(
        await readFile(path.join(videosDir, file), "utf8"),
      ) as Omit<VideoCompanion, "slug">;
      return { slug: file.replace(/\.json$/, ""), ...data };
    }),
  );

  return videos.sort((a, b) => b.date.localeCompare(a.date));
});

export async function getVideo(slug: string) {
  const videos = await getVideos();
  return videos.find((video) => video.slug === slug);
}

/** "2026-09-10" → "10 September 2026" */
export function formatDate(isoDate: string) {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
