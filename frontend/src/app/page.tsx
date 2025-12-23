"use client";

import { useState } from "react";
import { SummonerSearch } from "@/components/search/SummonerSearch";
import { LiveMatchCard } from "@/components/match/LiveMatchCard";
import { useSummoner, useMatchAnalysis } from "@/hooks/useSmurfAnalysis";

export default function Home() {
  const [riotId, setRiotId] = useState<{ name: string; tag: string } | null>(null);

  const {
    data: summoner,
    isLoading: summonerLoading,
    error: summonerError,
  } = useSummoner(riotId?.name ?? "", riotId?.tag ?? "", !!riotId);

  const {
    data: matchAnalysis,
    isLoading: analysisLoading,
    error: analysisError,
  } = useMatchAnalysis(summoner?.puuid ?? "", !!summoner?.puuid);

  const handleSearch = (name: string, tag: string) => {
    setRiotId({ name, tag });
  };

  const isLoading = summonerLoading || analysisLoading;
  const error = summonerError || analysisError;

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            LoL Smurf Detector
          </h1>
          <p className="text-gray-400 max-w-md mx-auto">
            Enter your Riot ID to analyze players in your current match and
            identify potential smurfs
          </p>
        </div>

        {/* Search */}
        <SummonerSearch onSearch={handleSearch} isLoading={isLoading} />

        {/* Error Display */}
        {error && (
          <div className="max-w-md mx-auto p-4 bg-red-900/30 border border-red-500 rounded-lg text-center">
            <p className="text-red-400">
              {error instanceof Error ? error.message : "An error occurred"}
            </p>
          </div>
        )}

        {/* Summoner Info */}
        {summoner && !matchAnalysis && !analysisLoading && (
          <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-lg text-center space-y-4">
            <h2 className="text-xl font-semibold">
              {summoner.riot_id_name}
              <span className="text-gray-400">#{summoner.riot_id_tag}</span>
            </h2>
            <p className="text-gray-400">Level {summoner.summoner_level}</p>
            {summoner.solo_tier && (
              <p className="text-gray-300">
                {summoner.solo_tier} {summoner.solo_rank} - {summoner.solo_lp} LP
              </p>
            )}
            <p className="text-yellow-500">
              Player is not currently in a game
            </p>
          </div>
        )}

        {/* Loading */}
        {analysisLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
            <p className="mt-4 text-gray-400">Analyzing match...</p>
            <p className="text-sm text-gray-500">
              This may take a moment as we analyze all players
            </p>
          </div>
        )}

        {/* Match Analysis */}
        {matchAnalysis && <LiveMatchCard analysis={matchAnalysis} />}
      </div>
    </main>
  );
}
