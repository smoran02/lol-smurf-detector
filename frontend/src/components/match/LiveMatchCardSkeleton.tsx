import { PlayerCardSkeleton } from "../player/PlayerCardSkeleton";

export function LiveMatchCardSkeleton() {
  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-3">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--team-blue)]" />
          <h2 className="font-display text-2xl md:text-3xl text-[var(--text-primary)] tracking-wider">
            SCANNING MATCH
          </h2>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--team-red)]" />
        </div>

        <p className="text-[var(--text-secondary)] font-mono text-sm">
          Analyzing all players...
        </p>

        {/* Team labels */}
        <div className="flex items-center justify-center gap-6 pt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[var(--team-blue)] glow-team-blue" />
            <span className="font-display text-sm tracking-wider team-blue">BLUE</span>
          </div>
          <span className="font-display text-lg text-[var(--text-muted)]">VS</span>
          <div className="flex items-center gap-2">
            <span className="font-display text-sm tracking-wider team-red">RED</span>
            <div className="w-3 h-3 rounded-sm bg-[var(--team-red)] glow-team-red" />
          </div>
        </div>
      </div>

      {/* Teams grid */}
      <div className="grid md:grid-cols-2 gap-8 md:gap-6 items-start">
        <TeamSectionSkeleton team="blue" />
        <TeamSectionSkeleton team="red" />
      </div>

      {/* Footer skeleton */}
      <div className="glass-card p-4 border border-[var(--border-dim)]">
        <div className="flex items-center justify-between">
          <div className="h-10 w-24 rounded bg-[var(--bg-elevated)] animate-pulse" />
          <div className="text-center">
            <div className="h-3 w-20 mx-auto rounded bg-[var(--bg-elevated)] animate-pulse mb-2" />
            <div className="h-4 w-32 mx-auto rounded bg-[var(--bg-elevated)] animate-pulse" />
          </div>
          <div className="h-10 w-24 rounded bg-[var(--bg-elevated)] animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function TeamSectionSkeleton({ team }: { team: "blue" | "red" }) {
  const isBlue = team === "blue";
  const teamColor = isBlue ? "var(--team-blue)" : "var(--team-red)";
  const glowClass = isBlue ? "glow-team-blue" : "glow-team-red";

  return (
    <div className="space-y-4">
      {/* Team header */}
      <div className={`flex items-center gap-3 h-14 ${isBlue ? "" : "md:flex-row-reverse"}`}>
        <div
          className={`w-3 h-8 rounded-sm ${glowClass}`}
          style={{ backgroundColor: teamColor }}
        />
        <div className={`flex-1 ${isBlue ? "" : "md:text-right"}`}>
          <h3
            className="font-display text-lg tracking-wider"
            style={{ color: teamColor }}
          >
            {isBlue ? "BLUE TEAM" : "RED TEAM"}
          </h3>
          <div className={`flex items-center gap-2 mt-1 ${isBlue ? "" : "md:justify-end"}`}>
            <div className="h-4 w-24 rounded bg-[var(--bg-elevated)] animate-pulse" />
          </div>
        </div>
      </div>

      {/* 5 player card skeletons */}
      <div className="space-y-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <PlayerCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
