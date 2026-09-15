// The site's own photos, by name. Content files (like content/moods.json)
// refer to a photo by one of these names.

import type { StaticImageData } from "next/image";
import candle from "@/assets/photos/candle-plaid-blanket.jpg";
import cat from "@/assets/photos/cat-asleep-on-book.jpg";
import coffee from "@/assets/photos/coffee-book-autumn-leaves.jpg";
import fairyLights from "@/assets/photos/hero-fairy-lights-book.jpg";
import rain from "@/assets/photos/hero-rain-poster.jpg";
import bookshop from "@/assets/photos/lamp-lit-bookshop-corner.jpg";
import mug from "@/assets/photos/steaming-mug-windowsill.jpg";

export type Photo = { image: StaticImageData; alt: string };

export const photos: Record<string, Photo> = {
  "candle-plaid-blanket": {
    image: candle,
    alt: "A candle glowing beside an open book on a plaid blanket",
  },
  "cat-asleep-on-book": {
    image: cat,
    alt: "A grey cat asleep with its chin resting on a thick book",
  },
  "coffee-book-autumn-leaves": {
    image: coffee,
    alt: "A cup of black coffee on an open book surrounded by autumn leaves",
  },
  "hero-fairy-lights-book": {
    image: fairyLights,
    alt: "An open book glowing under a tangle of fairy lights on a bed",
  },
  "hero-rain-poster": {
    image: rain,
    alt: "Raindrops on a window glowing in warm evening light",
  },
  "lamp-lit-bookshop-corner": {
    image: bookshop,
    alt: "A lamp-lit reading corner in a bookshop, lined with shelves of books",
  },
  "steaming-mug-windowsill": {
    image: mug,
    alt: "Steam rising from a mug beside an open book on a sunny windowsill",
  },
};

/** Looks up a photo by name, and stops the build with a helpful message if the name is misspelled. */
export function getPhoto(name: string): Photo {
  const photo = photos[name];
  if (!photo) {
    throw new Error(
      `Unknown photo "${name}". Use one of: ${Object.keys(photos).join(", ")}`,
    );
  }
  return photo;
}
