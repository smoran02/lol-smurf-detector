"use client";

import { SmurfAnalysisResponse, getChampionImageUrl, getRankEmblemUrl } from "@/lib/api";
import { SmurfIndicator, ScoreBar } from "./SmurfIndicator";
import { useState } from "react";

interface PlayerCardProps {
  analysis: SmurfAnalysisResponse;
  championName?: string;
}

export function PlayerCard({ analysis, championName }: PlayerCardProps) {
  const [expanded, setExpanded] = useState(false);

  const displayName = analysis.riot_id_name || "Unknown Player";
  const displayTag = analysis.riot_id_tag || "???";
  const championImageUrl = analysis.champion_id
    ? getChampionImageUrl(analysis.champion_id)
    : null;
  const rankEmblemUrl = getRankEmblemUrl(analysis.solo_tier);

  // Format rank as short form (e.g., "D1" for Diamond I)
  const getShortRank = () => {
    if (!analysis.solo_tier) return null;
    const tierShort: Record<string, string> = {
      IRON: "I", BRONZE: "B", SILVER: "S", GOLD: "G",
      PLATINUM: "P", EMERALD: "E", DIAMOND: "D",
      MASTER: "M", GRANDMASTER: "GM", CHALLENGER: "C",
    };
    const rankNum: Record<string, string> = { I: "1", II: "2", III: "3", IV: "4" };
    const t = tierShort[analysis.solo_tier] || analysis.solo_tier[0];
    const r = analysis.solo_rank ? rankNum[analysis.solo_rank] || "" : "";
    return t + r;
  };

  // Get border accent based on classification
  const getBorderAccent = () => {
    switch (analysis.classification) {
      case "LIKELY_SMURF":
        return "hover:border-[var(--neon-red)]/50";
      case "POSSIBLE_SMURF":
        return "hover:border-[var(--neon-orange)]/50";
      case "UNLIKELY":
        return "hover:border-[var(--neon-green)]/50";
      default:
        return "hover:border-[var(--border-glow)]";
    }
  };

  // Get ring color based on classification
  const getChampionRingColor = () => {
    switch (analysis.classification) {
      case "LIKELY_SMURF":
        return "ring-[var(--neon-red)]/60";
      case "POSSIBLE_SMURF":
        return "ring-[var(--neon-orange)]/60";
      case "UNLIKELY":
        return "ring-[var(--neon-green)]/60";
      default:
        return "ring-[var(--border-glow)]";
    }
  };

  return (
    <div
      className={`
        glass-card glass-card-hover p-4 cursor-pointer
        border border-[var(--border-dim)] ${getBorderAccent()}
        transition-all duration-300 min-h-[106px]
        ${expanded ? "ring-1 ring-[var(--border-glow)]" : ""}
      `}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Main row */}
      <div className="flex items-center justify-between gap-4">
        {/* Champion portrait + Player info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Champion image */}
          {championImageUrl ? (
            <div className={`shrink-0 w-12 h-12 rounded-lg overflow-hidden ring-2 ${getChampionRingColor()} bg-[var(--bg-elevated)]`}>
              <img
                src={championImageUrl}
                alt={championName || "Champion"}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="shrink-0 w-12 h-12 rounded-lg bg-[var(--bg-elevated)] ring-2 ring-[var(--border-dim)] flex items-center justify-center">
              <span className="text-[var(--text-muted)] text-xs font-mono">?</span>
            </div>
          )}

          {/* Player name */}
          <div className="min-w-0">
            <h3 className="font-medium text-[var(--text-primary)] truncate">
              {displayName}
              <span className="text-[var(--text-muted)] ml-1">#{displayTag}</span>
            </h3>
            <div className="flex items-center gap-2 mt-1">
              {/* Level badge */}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--bg-elevated)] rounded text-xs font-mono text-[var(--text-secondary)]">
                <span className="text-[var(--text-muted)]">LV</span>
                <span>{analysis.summoner_level}</span>
              </span>
              {/* Rank badge */}
              {analysis.solo_tier && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[var(--bg-elevated)] rounded text-xs font-mono text-[var(--text-secondary)]">
                  {rankEmblemUrl && (
                    <img
                      src={rankEmblemUrl}
                      alt={analysis.solo_tier}
                      className="w-4 h-4"
                    />
                  )}
                  <span className="text-[var(--neon-cyan)]">{getShortRank()}</span>
                </span>
              )}
              {/* Champion name */}
              {championName && (
                <span className="text-sm text-[var(--neon-cyan)] font-mono truncate">
                  {championName}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Score indicator */}
        <div className="shrink-0">
          <SmurfIndicator
            score={analysis.total_score}
            classification={analysis.classification}
            size="sm"
          />
        </div>

        {/* Expand indicator */}
        <div className="shrink-0">
          <svg
            className={`w-5 h-5 text-[var(--text-muted)] transition-transform duration-300 ${
              expanded ? "rotate-180" : ""
            }`}
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

      {/* Expanded content */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-[var(--border-dim)] space-y-5 animate-slide-up">
          {/* Raw metrics */}
          <div>
            <h4 className="data-label mb-3">RAW METRICS</h4>
            <div className="grid grid-cols-2 gap-3">
              <MetricDisplay
                label="Win Rate"
                value={analysis.raw_metrics.winrate}
                suffix="%"
                decimals={1}
              />
              <MetricDisplay
                label="KDA"
                value={analysis.raw_metrics.avg_kda}
                decimals={2}
              />
              <MetricDisplay
                label="CS/min"
                value={analysis.raw_metrics.avg_cs_per_min}
                decimals={1}
              />
              <MetricDisplay
                label="Champions"
                value={analysis.raw_metrics.unique_champions}
                decimals={0}
              />
            </div>
          </div>

          {/* Indicator breakdown */}
          <div>
            <h4 className="data-label mb-3">INDICATOR BREAKDOWN</h4>
            <div className="space-y-3">
              <ScoreBar
                label="Win Rate"
                score={analysis.indicator_scores.winrate}
                tooltip="Win rates above the normal range suggest the player is outclassing their opponents."
              />
              <ScoreBar
                label="Account Age"
                score={analysis.indicator_scores.account_age}
                tooltip="Low level for their rank indicates rapid climbing on a fresh account."
              />
              <ScoreBar
                label="Champion Pool"
                score={analysis.indicator_scores.champion_pool}
                tooltip="Playing only 1-2 champions is common among smurfs."
              />
              <ScoreBar
                label="CS/min"
                score={analysis.indicator_scores.cs_per_min}
                tooltip="Creep score above their rank's average shows superior laning fundamentals."
              />
              <ScoreBar
                label="KDA"
                score={analysis.indicator_scores.kda}
                tooltip="KDA far above their tier benchmark indicates skill beyond their current rank."
              />
              <ScoreBar
                label="Game Frequency"
                score={analysis.indicator_scores.game_frequency}
                tooltip="Playing 6+ games per day on a new account signals a leveling grind."
              />
            </div>
          </div>

          {/* Footer info */}
          <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-[var(--border-dim)]">
            <span className="text-[var(--text-muted)]">
              {analysis.raw_metrics.games_analyzed} games analyzed
            </span>
            <span className="text-[var(--neon-cyan)]">
              {analysis.confidence} confidence
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

interface MetricDisplayProps {
  label: string;
  value: number | null | undefined;
  suffix?: string;
  decimals?: number;
}

function MetricDisplay({ label, value, suffix = "", decimals = 1 }: MetricDisplayProps) {
  const displayValue = value !== null && value !== undefined
    ? value.toFixed(decimals) + suffix
    : "N/A";

  return (
    <div className="bg-[var(--bg-elevated)] rounded-lg p-3">
      <div className="data-label mb-1">{label}</div>
      <div className="font-mono text-lg text-[var(--text-primary)]">
        {displayValue}
      </div>
    </div>
  );
}
