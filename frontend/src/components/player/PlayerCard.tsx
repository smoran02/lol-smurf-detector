"use client";

import { SmurfAnalysisResponse } from "@/lib/api";
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

  return (
    <div
      className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-white">
              {displayName}
              <span className="text-gray-400">#{displayTag}</span>
            </h3>
            <span className="text-xs px-2 py-0.5 bg-gray-700 rounded text-gray-300">
              Lv. {analysis.summoner_level}
            </span>
          </div>
          {championName && (
            <p className="text-sm text-gray-400 mt-1">{championName}</p>
          )}
        </div>

        <SmurfIndicator
          score={analysis.total_score}
          classification={analysis.classification}
          size="sm"
        />
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-700 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Win Rate:</span>
              <span className="ml-2 text-white">
                {analysis.raw_metrics.winrate?.toFixed(1) ?? "N/A"}%
              </span>
            </div>
            <div>
              <span className="text-gray-400">KDA:</span>
              <span className="ml-2 text-white">
                {analysis.raw_metrics.avg_kda?.toFixed(2) ?? "N/A"}
              </span>
            </div>
            <div>
              <span className="text-gray-400">CS/min:</span>
              <span className="ml-2 text-white">
                {analysis.raw_metrics.avg_cs_per_min?.toFixed(1) ?? "N/A"}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Champions:</span>
              <span className="ml-2 text-white">
                {analysis.raw_metrics.unique_champions ?? "N/A"}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Indicator Breakdown
            </h4>
            <ScoreBar
              label="Win Rate"
              score={analysis.indicator_scores.winrate}
            />
            <ScoreBar
              label="Level vs Performance"
              score={analysis.indicator_scores.level_performance}
            />
            <ScoreBar
              label="Champion Pool"
              score={analysis.indicator_scores.champion_pool}
            />
            <ScoreBar
              label="CS/min"
              score={analysis.indicator_scores.cs_per_min}
            />
            <ScoreBar label="KDA" score={analysis.indicator_scores.kda} />
            <ScoreBar
              label="Game Frequency"
              score={analysis.indicator_scores.game_frequency}
            />
            <ScoreBar
              label="Account Age"
              score={analysis.indicator_scores.account_age_ratio}
            />
          </div>

          <div className="text-xs text-gray-500">
            Based on {analysis.raw_metrics.games_analyzed} games | Confidence:{" "}
            {analysis.confidence}
          </div>
        </div>
      )}
    </div>
  );
}
