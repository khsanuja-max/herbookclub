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

## Book Finder

Coming soon — instructions will be added here when the Book Finder is built.
