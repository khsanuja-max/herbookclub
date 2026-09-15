# Roshi's Book Club

A cosy book club website — monthly picks, video companion pages, and a mood-based book finder.

Live at **https://herbookclub.vercel.app**

## Tech

- Next.js (App Router, TypeScript)
- Tailwind CSS
- Hosted on Vercel (deploys automatically from the `main` branch on GitHub)

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Where things live

| Folder / file              | What it is                                      |
| -------------------------- | ----------------------------------------------- |
| `src/lib/site.ts`          | Site name, tagline, menu links, YouTube link    |
| `src/app/`                 | One folder per page                             |
| `src/components/`          | Header, footer and shared building blocks       |
| `src/assets/photos/`       | Background photos (credits in `CREDITS.md`)     |

## Useful commands

| Command         | What it does                                 |
| --------------- | -------------------------------------------- |
| `npm run dev`   | Start the local development server           |
| `npm run build` | Build the production site (what Vercel runs) |
| `npm run lint`  | Check the code for common mistakes           |
