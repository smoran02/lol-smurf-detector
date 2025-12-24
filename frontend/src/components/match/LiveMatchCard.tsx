"use client";

import { MatchAnalysisResponse, CHAMPION_NAMES } from "@/lib/api";
import { PlayerCard } from "../player/PlayerCard";

interface LiveMatchCardProps {
  analysis: MatchAnalysisResponse;
}

export function LiveMatchCard({ analysis }: LiveMatchCardProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Match Analysis</h2>
        <p className="text-gray-400 mt-1">
          Game ID: {analysis.game_id} | Mode: {analysis.game_mode}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Blue Team */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded" />
            <h3 className="text-lg font-semibold text-blue-400">Blue Team</h3>
            <TeamSmurfSummary players={analysis.blue_team} />
          </div>
          <div className="space-y-3">
            {analysis.blue_team.map((player) => (
              <PlayerCard
                key={player.puuid}
                analysis={player}
                championName={player.champion_id ? CHAMPION_NAMES[player.champion_id] || `Champion ${player.champion_id}` : undefined}
              />
            ))}
            {analysis.blue_team.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No player data available
              </p>
            )}
          </div>
        </div>

        {/* Red Team */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded" />
            <h3 className="text-lg font-semibold text-red-400">Red Team</h3>
            <TeamSmurfSummary players={analysis.red_team} />
          </div>
          <div className="space-y-3">
            {analysis.red_team.map((player) => (
              <PlayerCard
                key={player.puuid}
                analysis={player}
                championName={player.champion_id ? CHAMPION_NAMES[player.champion_id] || `Champion ${player.champion_id}` : undefined}
              />
            ))}
            {analysis.red_team.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No player data available
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface TeamSmurfSummaryProps {
  players: MatchAnalysisResponse["blue_team"];
}

function TeamSmurfSummary({ players }: TeamSmurfSummaryProps) {
  const likelyCount = players.filter(
    (p) => p.classification === "LIKELY_SMURF"
  ).length;
  const possibleCount = players.filter(
    (p) => p.classification === "POSSIBLE_SMURF"
  ).length;

  if (likelyCount === 0 && possibleCount === 0) {
    return (
      <span className="text-xs px-2 py-1 bg-green-900/50 text-green-400 rounded">
        No smurfs detected
      </span>
    );
  }

  return (
    <div className="flex gap-2">
      {likelyCount > 0 && (
        <span className="text-xs px-2 py-1 bg-red-900/50 text-red-400 rounded">
          {likelyCount} likely
        </span>
      )}
      {possibleCount > 0 && (
        <span className="text-xs px-2 py-1 bg-orange-900/50 text-orange-400 rounded">
          {possibleCount} possible
        </span>
      )}
    </div>
  );
}
