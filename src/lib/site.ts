// Site-wide settings: the name, tagline and navigation used on every page.

export const site = {
  name: "Roshi’s Book Club",
  tagline: "Rainy evenings, warm lights and a good book.",
  description:
    "A cosy corner for book lovers — Roshi’s monthly pick, video companions, and books for every mood.",
  url: "https://herbookclub.vercel.app",
  // TODO: replace with Roshi's real YouTube channel link
  youtubeUrl: "https://www.youtube.com/",
  nav: [
    {
      href: "/this-months-pick",
      label: "This Month’s Pick",
      blurb: "The book we’re all reading, with Roshi’s review and video.",
    },
    {
      href: "/videos",
      label: "Videos",
      blurb: "Every book from every video, with notes and where to find them.",
    },
    {
      href: "/book-finder",
      label: "Book Finder",
      blurb: "Skip the genres. Choose how you want to feel.",
    },
    {
      href: "/about",
      label: "About",
      blurb: "Who Roshi is and how the club works.",
    },
  ],
} as const;
