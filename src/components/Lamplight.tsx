type Glow = "left" | "right" | "center";

const glowPosition: Record<Glow, string> = {
  left: "left-0 -translate-x-1/3",
  right: "right-0 translate-x-1/3",
  center: "left-1/2 -translate-x-1/2",
};

/**
 * Soft background light for a section: an optional pool of amber lamplight
 * and an optional long vertical wash. Place it inside a `relative isolate` section.
 */
export function Lamplight({
  glow,
  wash = false,
}: {
  glow?: Glow;
  wash?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {wash && <div className="lamp-wash absolute inset-0" />}
      {glow && (
        <div
          className={`lamp-glow absolute top-0 aspect-square h-full ${glowPosition[glow]}`}
        />
      )}
    </div>
  );
}
