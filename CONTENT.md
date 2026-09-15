# Editing the site's content

Everything you'll want to change lives in the **`content`** folder. You don't need to touch any code.

After you save a change and it's pushed to GitHub, the live site updates on its own in about a minute.

## A few rules for these files

The files end in `.json`. They're picky about punctuation, so:

- Keep the **"double quotes"** around every piece of text.
- Put a **comma** after each line, except the last one before a `}` or `]`.
- If your text needs a double quote inside it, write it as `\"` — for example `She said \"hello\"`. Apostrophes (') are fine as they are.
- If something breaks, the site won't update and Vercel will show a failed build. Undo your last change and try again.

## Finding a book's ISBN

Every book is matched to its cover picture by its **ISBN** — the 13-digit number on the back of the book or in its online listing (Amazon, Bookshop.org, Goodreads). Write it without dashes.

Open Library doesn't have a cover for every edition. If a cover doesn't show, try the ISBN of a different edition (paperback, hardback) of the same book. If none has a cover, the site shows a neat card with the title and author instead.

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
| `isbn` | The book's 13-digit ISBN (see above). |
| `headline` | One big line at the top of your review. |
| `review` | Your review, one paragraph per line. Add or remove lines as you like. |
| `youtubeVideoId` | Leave as `""` until the video is up. Then take the video link, e.g. `https://www.youtube.com/watch?v=abc123XYZ`, and paste just the part after `v=` — here `"abc123XYZ"`. |

---

## Video pages

Folder: **`content/videos`** — **one file per video.**

The file name becomes the page's web address, so use lowercase words joined by dashes. For example, `books-that-made-me-cry.json` becomes `herbookclub.vercel.app/videos/books-that-made-me-cry`.

**To add a new video:** copy one of the existing files, give the copy a new name, and change what's inside. The newest video (by `date`) is always listed first.

```json
{
  "title": "Five books for a rainy weekend",
  "date": "2026-08-28",
  "youtubeVideoId": "",
  "summary": "A sentence or two about the video.",
  "books": [
    {
      "title": "The Night Circus",
      "author": "Erin Morgenstern",
      "isbn": "9780385534635",
      "note": "A short note about this book."
    },
    {
      "title": "Howl's Moving Castle",
      "author": "Diana Wynne Jones",
      "isbn": "9780061478789",
      "note": "Another short note."
    }
  ]
}
```

| Line | What to put there |
| --- | --- |
| `title` | The video's title. |
| `date` | The day the video went up, written as year-month-day: `2026-08-28`. |
| `youtubeVideoId` | Same as above: leave as `""` until the video is up, then paste the part after `v=`. |
| `summary` | A sentence or two about the video. |
| `books` | Every book in the video, **in the order you mention them**. Each book has a `title`, `author`, `isbn` and a short `note`. To add a book, copy one `{ … }` block, put a comma between blocks, and change the details. |

**To remove a video:** delete its file.

---

## Book Finder (moods)

File: **`content/moods.json`**

Each mood gets its own tile on the Book Finder page and its own page, e.g. `herbookclub.vercel.app/book-finder/comfort`. Moods appear in the same order as in the file.

```json
{
  "moods": [
    {
      "id": "comfort",
      "label": "I want to be comforted",
      "line": "Warm, kind books that feel like a hug.",
      "photo": "cat-asleep-on-book",
      "books": [
        {
          "title": "The House in the Cerulean Sea",
          "author": "TJ Klune",
          "isbn": "9781250217318",
          "reason": "Found family on a magical island, and the kindest book I know."
        }
      ]
    }
  ]
}
```

| Line | What to put there |
| --- | --- |
| `id` | A short name for the web address: lowercase, words joined by dashes, no spaces (e.g. `make-me-cry`). Each mood needs a different one. |
| `label` | The mood as visitors see it, e.g. "Make me cry". |
| `line` | One short line under the mood name. |
| `photo` | The background photo for the mood's tile and page. Use one of these names exactly: `cat-asleep-on-book`, `candle-plaid-blanket`, `coffee-book-autumn-leaves`, `hero-fairy-lights-book`, `hero-rain-poster`, `lamp-lit-bookshop-corner`, `steaming-mug-windowsill`. If the name is misspelled, the site won't update and Vercel's build log will list the correct names. |
| `books` | The books for this mood. Each has a `title`, `author`, `isbn` and a one-line `reason` in your own words. The same book can appear under more than one mood. |

**Nice extra:** if a book is also this month's pick or in one of your videos, its entry automatically links there.

**To add a mood:** copy one whole mood block `{ … }`, put a comma between blocks, and change the details. **To remove a mood:** delete its block (and the comma before it).
