"use client";

import { HiddenPlayer, getChampionImageUrl, CHAMPION_NAMES } from "@/lib/api";

interface StreamerModeCardProps {
  player: HiddenPlayer;
}

export function StreamerModeCard({ player }: StreamerModeCardProps) {
  const championImageUrl = player.champion_id ? getChampionImageUrl(player.champion_id) : null;
  const championName = player.champion_id
    ? (CHAMPION_NAMES[player.champion_id] || `Champion ${player.champion_id}`)
    : "Unknown";

  return (
    <div
      className="
        glass-card p-4
        border border-[var(--border-dim)] border-dashed
        opacity-70
      "
    >
      {/* Main row - matches PlayerCard exactly */}
      <div className="flex items-center justify-between gap-4">
        {/* Champion portrait + Streamer mode info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Champion image */}
          {championImageUrl ? (
            <div className="shrink-0 w-12 h-12 rounded-lg overflow-hidden ring-2 ring-[var(--border-dim)] bg-[var(--bg-elevated)]">
              <img
                src={championImageUrl}
                alt={championName}
                className="w-full h-full object-cover grayscale-[30%]"
              />
            </div>
          ) : (
            <div className="shrink-0 w-12 h-12 rounded-lg bg-[var(--bg-elevated)] ring-2 ring-[var(--border-dim)] flex items-center justify-center">
              <span className="text-[var(--text-muted)] text-xs font-mono">?</span>
            </div>
          )}

          {/* Player info */}
          <div className="min-w-0">
            <h3 className="font-medium text-[var(--text-muted)] truncate italic">
              Streamer Mode
            </h3>
            <div className="flex items-center gap-2 mt-1">
              {/* Hidden badge - matches level badge styling in PlayerCard */}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--bg-elevated)] rounded text-xs font-mono text-[var(--text-secondary)]">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                <span>HIDDEN</span>
              </span>
              {/* Champion name */}
              <span className="text-sm text-[var(--neon-cyan)] font-mono truncate">
                {championName}
              </span>
            </div>
          </div>
        </div>

        {/* Score indicator placeholder - matches SmurfIndicator size="sm" exactly */}
        <div className="shrink-0">
          <div className="flex flex-col items-center gap-1.5">
            {/* Circle container - matches SmurfIndicator's relative w-14 h-14 container */}
            <div className="relative w-14 h-14 flex items-center justify-center">
              {/* Background ring - matching SmurfIndicator's SVG ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r={24}
                  fill="none"
                  stroke="var(--border-dim)"
                  strokeWidth="3"
                />
              </svg>
              {/* Center content - matching SmurfIndicator's center circle (radius * 1.5 = 36px for sm) */}
              <div
                className="relative flex flex-col items-center justify-center rounded-full"
                style={{
                  width: 36,
                  height: 36,
                  backgroundColor: "rgba(85, 85, 102, 0.15)",
                }}
              >
                <span
                  className="font-display font-bold text-lg"
                  style={{ color: "var(--text-muted)" }}
                >
                  ?
                </span>
              </div>
            </div>
            {/* Label - matches SmurfIndicator's label exactly */}
            <span
              className="font-display text-[9px] tracking-wider px-2 py-0.5 rounded"
              style={{
                color: "var(--text-muted)",
                backgroundColor: "rgba(85, 85, 102, 0.15)",
              }}
            >
              HIDDEN
            </span>
          </div>
        </div>

        {/* Expand indicator - matches PlayerCard's chevron wrapper */}
        <div className="shrink-0">
          <svg
            className="w-5 h-5 text-[var(--text-muted)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
