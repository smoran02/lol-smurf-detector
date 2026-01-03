export function PlayerCardSkeleton() {
  return (
    <div className="glass-card p-4 border border-[var(--border-dim)] min-h-[106px] overflow-hidden relative">
      {/* Shimmer overlay */}
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite]"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
        }}
      />

      <div className="flex items-center justify-between gap-4">
        {/* Champion + info */}
        <div className="flex items-center gap-3 flex-1">
          {/* Champion icon skeleton */}
          <div className="shrink-0 w-12 h-12 rounded-lg bg-[var(--border-glow)] animate-pulse" />

          {/* Name + badges */}
          <div className="space-y-2">
            <div className="h-4 w-32 rounded bg-[var(--border-glow)] animate-pulse" />
            <div className="flex gap-2">
              <div className="h-5 w-12 rounded bg-[var(--border-glow)] animate-pulse" />
              <div className="h-5 w-10 rounded bg-[var(--border-glow)] animate-pulse" />
            </div>
          </div>
        </div>

        {/* Score circle skeleton */}
        <div className="shrink-0 w-10 h-10 rounded-full bg-[var(--border-glow)] animate-pulse" />

        {/* Chevron placeholder */}
        <div className="shrink-0 w-5 h-5 rounded bg-[var(--border-glow)] animate-pulse" />
      </div>
    </div>
  );
}
