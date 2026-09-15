import type { Mood } from "@/lib/content";
import { getPhoto } from "@/lib/photos";
import { MoodTile } from "./MoodTile";

/** All moods as photo tiles: two across on phones, five across on laptops. */
export function MoodGrid({ moods }: { moods: Mood[] }) {
  const lastTileAlone = moods.length % 2 === 1;

  return (
    <ul className="grid grid-cols-2 gap-x-2 gap-y-4 sm:gap-6 lg:grid-cols-5">
      {moods.map((mood, index) => {
        const spansRow = lastTileAlone && index === moods.length - 1;
        return (
          <li
            key={mood.id}
            className={spansRow ? "col-span-2 lg:col-span-1" : undefined}
          >
            <MoodTile
              href={`/book-finder/${mood.id}`}
              label={mood.label}
              line={mood.line}
              photo={getPhoto(mood.photo)}
              sizes={
                spansRow
                  ? "(min-width: 1024px) 20vw, 100vw"
                  : "(min-width: 1024px) 20vw, 50vw"
              }
              aspect={spansRow ? "aspect-video lg:aspect-[3/4]" : "aspect-[3/4]"}
            />
          </li>
        );
      })}
    </ul>
  );
}
