// Reads the site's content. For now it comes from the JSON files in /content;
// later this is the one place to switch over to Supabase.

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

export async function getThisMonthsPick(): Promise<MonthlyPick> {
  return thisMonthsPick;
}
