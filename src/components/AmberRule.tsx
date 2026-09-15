/** A thin amber line that fades out at the end (or both ends when centred). */
export function AmberRule({
  align = "start",
  className = "",
}: {
  align?: "start" | "center";
  className?: string;
}) {
  const fade =
    align === "center"
      ? "from-transparent via-amber/70 to-transparent"
      : "from-amber/80 via-amber/40 to-transparent";

  return (
    <div
      aria-hidden="true"
      className={`h-px bg-linear-to-r ${fade} ${className}`}
    />
  );
}
