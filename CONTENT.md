# Editing the site's content

Everything you'll want to change lives in the **`content`** folder. You don't need to touch any code.

After you save a change and it's pushed to GitHub, the live site updates on its own in about a minute.

## A few rules for these files

The files end in `.json`. They're picky about punctuation, so:

- Keep the **"double quotes"** around every piece of text.
- Put a **comma** after each line, except the last one before a `}` or `]`.
- If your text needs a double quote inside it, write it as `\"` — for example `She said \"hello\"`. Apostrophes (') are fine as they are.
- If something breaks, the site won't update and Vercel will show a failed build. Undo your last change and try again.

---

## This Month's Pick

File: **`content/this-months-pick.json`**

```json
{
  "month": "September 2026",
  "title": "The House in the Cerulean Sea",
  "author": "TJ Klune",
  "isbn": "9781250217318",
  "headline": "A warm blanket of a book: found family, gentle magic and a lot of heart.",
  "review": [
    "First paragraph of your review.",
    "Second paragraph.",
    "Last paragraph."
  ],
  "youtubeVideoId": ""
}
```

| Line | What to put there |
| --- | --- |
| `month` | The month, shown above the title. |
| `title` / `author` | The book's title and author. |
| `isbn` | The 13-digit ISBN from the back of the book or its online listing. No dashes. The cover picture is found using this. |
| `headline` | One big line at the top of your review. |
| `review` | Your review, one paragraph per line. Add or remove lines as you like. |
| `youtubeVideoId` | Leave as `""` until the video is up. Then take the video link, e.g. `https://www.youtube.com/watch?v=abc123XYZ`, and paste just the part after `v=` — here `"abc123XYZ"`. |

**Cover not showing?** Open Library doesn't have every edition. Try the ISBN of a different edition (paperback, hardback) of the same book. If none has a cover, the site shows a neat card with the title and author instead.

---

## Video pages and the Book Finder

Coming soon — instructions will be added here when those pages are built.
