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
  "title": "Vera Wong's Unsolicited Advice for Murderers",
  "author": "Jesse Q. Sutanto",
  "isbn": "9780593546178",
  "headline": "A cosy, laugh-out-loud mystery with the most gloriously nosy detective I've ever met.",
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

---

## About page

File: **`content/about.json`**

The text in this file right now is a **placeholder** — replace it with your own words whenever you're ready.

```json
{
  "title": "Hello, I'm Roshi",
  "summary": "Two short sentences about the club.",
  "photo": "cat-asleep-on-book",
  "story": [
    "First paragraph — shown larger, like an opening line.",
    "Second paragraph.",
    "Last paragraph."
  ],
  "howItWorks": [
    {
      "title": "One book a month",
      "text": "A sentence about this part of the club.",
      "photo": "steaming-mug-windowsill",
      "href": "/this-months-pick"
    }
  ]
}
```

| Line | What to put there |
| --- | --- |
| `title` | The big heading at the top of the page. |
| `summary` | **Two short sentences** about you and the club. They appear at the top of the About page, and the home page will show them too. |
| `photo` | The banner photo. Use one of the photo names listed in the Book Finder section above. |
| `story` | Your story, one paragraph per line. The first paragraph is shown larger. |
| `howItWorks` | The picture cards under "How the club works". Each has a `title`, a sentence of `text`, a `photo` name and `href` — the page it links to (`/this-months-pick`, `/videos` or `/book-finder`). |

---

## The Book Wall

Page: `herbookclub.vercel.app/book-wall`

**You don't need to add books to the wall.** Every book from This Month's Pick and your video pages appears on it automatically.

### Book previews

**Nothing is needed from you.** Each time the site is built, it asks Google Books whether each book has a preview that can be shown on other websites. When it does, visitors can read that preview inside the book on the wall; when it doesn't, the book opens to your words about it instead.

A few things worth knowing:

- Previews belong to a particular **edition**. If you know one edition has a preview (you can check on books.google.com — look for a **Preview** or **Read sample** button), use that edition's ISBN in your content file.
- Google decides previews partly by **country**, so a preview can be available to some visitors and not others. Anyone who can't see it gets a "Read on Google Books" link instead.
- If Google is unavailable while the site is being built, the site still builds; those books just open to your words that time.

### "If you loved this, try…" connections

File: **`content/connections.json`**

The connections in this file right now are **placeholders** — rewrite the reasons in your own words, and change the pairings however you like.

Each book is listed by its ISBN, followed by the books it leads to, each with a one-line reason:

```json
{
  "9780593546178": [
    { "isbn": "9781035042432", "why": "Another little shop that becomes the heart of an unlikely family." },
    { "isbn": "9781501160837", "why": "A bungled crime that brings strangers together, told with warmth and humour." }
  ],
  "9780385534635": [
    { "isbn": "9780061478789", "why": "Another world of enchantment you'll want to move into." }
  ]
}
```

| Part | What it means |
| --- | --- |
| `"9780593546178": [ … ]` | The book these connections belong to (here, *Vera Wong's Unsolicited Advice for Murderers*). |
| `"isbn"` | The book to suggest next. |
| `"why"` | One line, in your words, about why a reader of the first book will love it. |

**Good to know:**

- Give each book **2 to 4** connections.
- Both books must already be on the wall (in This Month's Pick or one of your video pages). If an ISBN isn't, the site won't update and Vercel's build log will say which ISBN is the problem and list the books that are on the wall.
- Connections only go one way. If you want *A* to suggest *B* **and** *B* to suggest *A*, add it under both books.

**To add connections for a new book:** after the last `]` for the previous book, add a comma, then a new line with the book's ISBN in quotes, a colon, and its list of connections in `[ … ]` — copy an existing one and change the details.
