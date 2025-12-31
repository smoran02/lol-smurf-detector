"use client";

import { MatchAnalysisResponse, CHAMPION_NAMES, POSITION_ORDER, SmurfAnalysisResponse, HiddenPlayer } from "@/lib/api";
import { PlayerCard } from "../player/PlayerCard";
import { StreamerModeCard } from "../player/StreamerModeCard";

interface LiveMatchCardProps {
  analysis: MatchAnalysisResponse;
}

// Union type for display - either an analyzed player or a hidden player
type DisplayPlayer =
  | { type: "analyzed"; data: SmurfAnalysisResponse }
  | { type: "hidden"; data: HiddenPlayer };

// Sort display players (both analyzed and hidden) by position
function sortDisplayPlayers(players: DisplayPlayer[]): DisplayPlayer[] {
  return [...players].sort((a, b) => {
    const posA = a.type === "analyzed" ? a.data.position : a.data.position;
    const posB = b.type === "analyzed" ? b.data.position : b.data.position;
    const orderA = POSITION_ORDER[posA] ?? 5;
    const orderB = POSITION_ORDER[posB] ?? 5;
    return orderA - orderB;
  });
}

export function LiveMatchCard({ analysis }: LiveMatchCardProps) {
  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-3">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--team-blue)]" />
          <h2 className="font-display text-2xl md:text-3xl text-[var(--text-primary)] tracking-wider">
            MATCH ANALYSIS
          </h2>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--team-red)]" />
        </div>

        <div className="flex items-center justify-center gap-4 text-xs font-mono text-[var(--text-muted)]">
          <span>GAME ID: {analysis.game_id}</span>
          <span className="text-[var(--border-glow)]">|</span>
          <span className="text-[var(--neon-cyan)]">{analysis.game_mode}</span>
        </div>

        {/* Team labels with VS */}
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
        {/* Blue Team */}
        <TeamSection
          team="blue"
          players={analysis.blue_team}
          hiddenPlayers={analysis.hidden_players?.filter(p => p.team_id === 100) || []}
          label="BLUE TEAM"
        />

        {/* Red Team */}
        <TeamSection
          team="red"
          players={analysis.red_team}
          hiddenPlayers={analysis.hidden_players?.filter(p => p.team_id === 200) || []}
          label="RED TEAM"
        />
      </div>

      {/* Summary footer */}
      <div className="glass-card p-4 border border-[var(--border-dim)]">
        <div className="flex items-center justify-between">
          <TeamThreatLevel team="blue" players={analysis.blue_team} />
          <div className="text-center px-6">
            <div className="data-label mb-1">ANALYSIS COMPLETE</div>
            <div className="font-mono text-sm text-[var(--neon-green)]">
              {analysis.blue_team.length + analysis.red_team.length} PLAYERS SCANNED
            </div>
            {analysis.hidden_players && analysis.hidden_players.length > 0 && (
              <div className="font-mono text-xs text-[var(--text-muted)] mt-1">
                {analysis.hidden_players.length} HIDDEN (STREAMER MODE)
              </div>
            )}
          </div>
          <TeamThreatLevel team="red" players={analysis.red_team} />
        </div>
      </div>
    </div>
  );
}

interface TeamSectionProps {
  team: "blue" | "red";
  players: MatchAnalysisResponse["blue_team"];
  hiddenPlayers: HiddenPlayer[];
  label: string;
}

function TeamSection({ team, players, hiddenPlayers, label }: TeamSectionProps) {
  const isBlue = team === "blue";
  const teamColor = isBlue ? "var(--team-blue)" : "var(--team-red)";
  const glowClass = isBlue ? "glow-team-blue" : "glow-team-red";

  // Combine analyzed and hidden players into a unified list for display
  const displayPlayers: DisplayPlayer[] = [
    ...players.map((p) => ({ type: "analyzed" as const, data: p })),
    ...hiddenPlayers.map((p) => ({ type: "hidden" as const, data: p })),
  ];

  // Sort by position: TOP, JUNGLE, MID, BOT, SUPPORT
  const sortedDisplayPlayers = sortDisplayPlayers(displayPlayers);

  return (
    <div className="space-y-4">
      {/* Team header - fixed height for alignment */}
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
            {label}
          </h3>
          <TeamSmurfSummary players={players} team={team} />
        </div>
      </div>

      {/* Player cards */}
      <div className="space-y-3">
        {sortedDisplayPlayers.map((displayPlayer, index) => (
          <div
            key={displayPlayer.type === "analyzed" ? displayPlayer.data.puuid : `hidden-${displayPlayer.data.champion_id}-${index}`}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}
          >
            {displayPlayer.type === "analyzed" ? (
              <PlayerCard
                analysis={displayPlayer.data}
                championName={
                  displayPlayer.data.champion_id
                    ? CHAMPION_NAMES[displayPlayer.data.champion_id] || `Champion ${displayPlayer.data.champion_id}`
                    : undefined
                }
              />
            ) : (
              <StreamerModeCard player={displayPlayer.data} />
            )}
          </div>
        ))}
        {sortedDisplayPlayers.length === 0 && (
          <div className="glass-card p-8 text-center">
            <p className="text-[var(--text-muted)] font-mono text-sm">
              No player data available
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface TeamSmurfSummaryProps {
  players: MatchAnalysisResponse["blue_team"];
  team: "blue" | "red";
}

function TeamSmurfSummary({ players, team }: TeamSmurfSummaryProps) {
  const likelyCount = players.filter(
    (p) => p.classification === "LIKELY_SMURF"
  ).length;
  const possibleCount = players.filter(
    (p) => p.classification === "POSSIBLE_SMURF"
  ).length;

  if (likelyCount === 0 && possibleCount === 0) {
    return (
      <div className={`flex items-center gap-2 mt-1 ${team === "red" ? "md:justify-end" : ""}`}>
        <span className="w-2 h-2 rounded-full bg-[var(--neon-green)]" />
        <span className="text-xs font-mono text-[var(--neon-green)]">
          NO SMURFS DETECTED
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 mt-1 ${team === "red" ? "md:justify-end" : ""}`}>
      {likelyCount > 0 && (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[var(--neon-red)]/10 border border-[var(--neon-red)]/30 rounded text-xs font-mono text-neon-red">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon-red)]" />
          {likelyCount} LIKELY
        </span>
      )}
      {possibleCount > 0 && (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[var(--neon-orange)]/10 border border-[var(--neon-orange)]/30 rounded text-xs font-mono text-neon-orange">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon-orange)]" />
          {possibleCount} POSSIBLE
        </span>
      )}
    </div>
  );
}

interface TeamThreatLevelProps {
  team: "blue" | "red";
  players: MatchAnalysisResponse["blue_team"];
}

function TeamThreatLevel({ team, players }: TeamThreatLevelProps) {
  const isBlue = team === "blue";
  const teamColor = isBlue ? "var(--team-blue)" : "var(--team-red)";

  const likelyCount = players.filter((p) => p.classification === "LIKELY_SMURF").length;
  const possibleCount = players.filter((p) => p.classification === "POSSIBLE_SMURF").length;

  const threatScore = likelyCount * 2 + possibleCount;
  const threatLevel = threatScore >= 4 ? "HIGH" : threatScore >= 2 ? "MEDIUM" : "LOW";
  const threatColor =
    threatLevel === "HIGH"
      ? "var(--neon-red)"
      : threatLevel === "MEDIUM"
      ? "var(--neon-orange)"
      : "var(--neon-green)";

  return (
    <div className={`text-${isBlue ? "left" : "right"}`}>
      <div className="data-label mb-1" style={{ color: teamColor }}>
        {isBlue ? "BLUE" : "RED"} THREAT
      </div>
      <div
        className="font-display text-lg tracking-wider"
        style={{ color: threatColor }}
      >
        {threatLevel}
      </div>
    </div>
  );
}
