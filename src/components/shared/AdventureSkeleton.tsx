const BLOCK = "bg-white/[0.03] motion-safe:animate-pulse";

/** Shown until the device is known: a sidebar and cards on wide screens, stacked cards otherwise. */
export function AdventureSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="grid-backdrop flex h-full overflow-hidden"
    >
      <div className="hidden w-72 shrink-0 flex-col gap-4 border-r border-white/8 bg-surface p-8 lg:flex">
        <div className={`${BLOCK} h-24 w-24`} />
        <div className={`${BLOCK} h-4 w-32`} />
        <div className={`${BLOCK} h-4 w-24`} />
      </div>
      <div className="flex flex-1 flex-col gap-8 p-8 lg:px-16 lg:py-12">
        <div className={`${BLOCK} h-16 w-full max-w-lg`} />
        <div className={`${BLOCK} h-40 w-full`} />
        <div className={`${BLOCK} h-40 w-full`} />
      </div>
    </div>
  );
}
