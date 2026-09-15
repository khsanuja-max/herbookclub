/** A faint amber glow that flickers slowly, like a candle just out of view. */
export function CandleGlow({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`lamp-glow pointer-events-none absolute aspect-square rounded-full opacity-70 motion-safe:animate-flicker ${className}`}
    />
  );
}
