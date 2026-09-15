export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <p className="font-sans text-sm uppercase tracking-[0.3em] text-terracotta">
        Coming soon
      </p>
      <h1 className="mt-6 font-serif text-5xl font-semibold leading-tight text-ink sm:text-7xl">
        Her Book Club
      </h1>
      <p className="mt-6 max-w-md font-serif text-xl italic text-ink-soft sm:text-2xl">
        Pull up a chair — the shelves are being dusted and the kettle is on.
      </p>
      <div className="mt-10 h-px w-24 bg-terracotta/40" aria-hidden="true" />
    </main>
  );
}
