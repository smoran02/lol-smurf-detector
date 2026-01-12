"use client";

import { useState, useEffect } from "react";
import { SummonerSearch } from "@/components/search/SummonerSearch";
import { LiveMatchCard } from "@/components/match/LiveMatchCard";
import { LiveMatchCardSkeleton } from "@/components/match/LiveMatchCardSkeleton";
import { useSummoner, useLiveGame, useMatchAnalysis } from "@/hooks/useSmurfAnalysis";

export default function Home() {
  const [riotId, setRiotId] = useState<{ name: string; tag: string } | null>(null);
  const [showConnecting, setShowConnecting] = useState(false);

  const {
    data: summoner,
    isFetching: summonerFetching,
    error: summonerError,
    refetch: refetchSummoner,
  } = useSummoner(riotId?.name ?? "", riotId?.tag ?? "", !!riotId);

  // Check if player is in a live game (quick check)
  const {
    data: liveGame,
    isFetching: liveGameFetching,
    isNotInGame,
  } = useLiveGame(summoner?.puuid ?? "", !!summoner?.puuid);

  // Only analyze match if player is in a game
  // Use isNotInGame (404) instead of any error to prevent UI flicker on network hiccups
  const isInGame = !!liveGame && !isNotInGame;
  const {
    data: matchAnalysis,
    isFetching: analysisFetching,
    error: analysisError,
    refetch: refetchAnalysis,
  } = useMatchAnalysis(summoner?.puuid ?? "", isInGame);

  const handleSearch = (name: string, tag: string) => {
    // If searching for the same player, refetch instead of just setting state
    if (riotId?.name === name && riotId?.tag === tag) {
      refetchSummoner();
      // Only refetch analysis if player is actually in a game
      if (isInGame) {
        refetchAnalysis();
      }
    } else {
      setRiotId({ name, tag });
    }
  };

  const isLoading = summonerFetching || liveGameFetching || analysisFetching;
  const error = summonerError || analysisError; // live game 404 just means not in game, not an error

  // Only show CONNECTING if summoner lookup + live game check takes > 500ms (cold start)
  const isLookingUp = summonerFetching || liveGameFetching;
  useEffect(() => {
    if (!isLookingUp) {
      setShowConnecting(false);
      return;
    }
    const timer = setTimeout(() => {
      setShowConnecting(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [isLookingUp]);

  return (
    <main className="min-h-screen py-16 px-4 relative">
      {/* Ambient glow effects */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-[var(--neon-cyan)] opacity-5 blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-[var(--neon-magenta)] opacity-5 blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        {/* Header */}
        <header className="text-center space-y-6 animate-slide-up">
          {/* Decorative top line */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--neon-cyan)]" />
            <span className="font-mono text-xs text-[var(--text-muted)] tracking-[0.3em]">
              DETECTION SYSTEM v2.0
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--neon-cyan)]" />
          </div>

          {/* Main title */}
          <div className="relative inline-block">
            <h1 className="font-display text-5xl md:text-7xl font-black text-neon-cyan glow-cyan animate-flicker tracking-wider">
              <span className="relative inline-block">
                {/* Smurf hat on the S */}
                <svg
                  className="absolute -top-3 -left-3 md:-top-4 md:-left-4 w-8 h-8 md:w-12 md:h-12 transform -rotate-[30deg]"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  {/* Classic smurf hat */}
                  <path
                    d="M6 24 Q6 14 16 10 Q18 4 24 6 Q28 10 26 16 Q24 22 18 24 Z"
                    fill="white"
                    stroke="#e0e0e0"
                    strokeWidth="0.5"
                  />
                  <ellipse cx="16" cy="24" rx="12" ry="3" fill="white" stroke="#e0e0e0" strokeWidth="0.5"/>
                  {/* Pom-pom at tip */}
                  <circle cx="24" cy="6" r="3" fill="white" stroke="#e0e0e0" strokeWidth="0.5"/>
                </svg>
                S
              </span>MURF DETECTOR
            </h1>
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--neon-cyan)] to-transparent opacity-50" />
          </div>

          {/* Subtitle */}
          <p className="text-[var(--text-secondary)] max-w-lg mx-auto font-light tracking-wide">
            Advanced match analysis system. Enter your Riot ID to scan all players
            in your current game and identify potential smurf accounts.
          </p>

          {/* Status indicator */}
          <div className="flex items-center justify-center gap-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[var(--neon-green)] animate-pulse" />
            <span className="text-[var(--neon-green)]">SYSTEM ONLINE</span>
            <span className="text-[var(--text-muted)]">{"/"}</span>
            <span className="text-[var(--text-muted)]">READY TO ANALYZE</span>
          </div>
        </header>

        {/* Search Section */}
        <section className="animate-slide-up stagger-1 opacity-0">
          <SummonerSearch onSearch={handleSearch} isLoading={isLoading} />
        </section>

        {/* Error Display - don't show if summoner found but just not in game */}
        {error && !(summoner && analysisError) && (
          <div className="animate-slide-up max-w-md mx-auto">
            <div className="glass-card p-5 border-[var(--neon-red)] box-glow-red">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded flex items-center justify-center bg-[var(--neon-red)]/20 shrink-0">
                  <svg className="w-4 h-4 text-neon-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-display text-sm text-neon-red mb-1">ERROR DETECTED</h3>
                  <p className="text-[var(--text-secondary)] text-sm font-mono">
                    {error instanceof Error ? error.message : "An unexpected error occurred"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summoner Info (not in game) */}
        {summoner && !liveGameFetching && !summonerFetching && !isInGame && (
          <div className="animate-slide-up max-w-md mx-auto">
            <div className="glass-card p-6 border-[var(--neon-orange)] box-glow-orange">
              <div className="text-center space-y-4">
                {/* Player header */}
                <div className="space-y-1">
                  <h2 className="font-display text-2xl text-[var(--text-primary)]">
                    {summoner.riot_id_name}
                    <span className="text-[var(--text-muted)] text-lg ml-1">#{summoner.riot_id_tag}</span>
                  </h2>
                  <div className="font-mono text-sm text-[var(--text-secondary)]">
                    LEVEL {summoner.summoner_level}
                  </div>
                </div>

                {/* Rank display */}
                {summoner.solo_tier && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--bg-elevated)] rounded-lg border border-[var(--border-dim)]">
                    <span className="font-mono text-[var(--text-primary)]">
                      {summoner.solo_tier} {summoner.solo_rank}
                    </span>
                    <span className="text-[var(--neon-cyan)] font-mono">{summoner.solo_lp} LP</span>
                  </div>
                )}

                {/* Not in game notice */}
                <div className="pt-4 border-t border-[var(--border-dim)]">
                  <div className="flex items-center justify-center gap-2 text-[var(--neon-orange)]">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-mono text-sm">NOT CURRENTLY IN GAME</span>
                  </div>
                  <p className="text-[var(--text-muted)] text-xs mt-2 font-mono">
                    Start a match and search again to analyze players
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State - Spinner (only shows after 500ms for cold starts) */}
        {showConnecting && (
          <div className="text-center py-16">
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 border-2 rounded-full animate-glow-pulse border-[var(--neon-magenta)]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 border-2 rounded-full animate-spin border-[var(--neon-cyan)]" style={{ animationDuration: '2s' }} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full animate-pulse opacity-50 bg-[var(--neon-magenta)]" />
              </div>
            </div>
            <h3 className="font-display text-xl mb-2 text-neon-magenta glow-magenta">
              CONNECTING
            </h3>
            <p className="text-[var(--text-secondary)] font-mono text-sm">
              First request may take ~30s if server is waking up
            </p>
          </div>
        )}

        {/* Loading State - Skeleton (only during match analysis when actually in game) */}
        {analysisFetching && isInGame && !showConnecting && (
          <section>
            <LiveMatchCardSkeleton />
          </section>
        )}

        {/* Match Analysis Results */}
        {matchAnalysis && !analysisFetching && isInGame && (
          <section>
            <LiveMatchCard analysis={matchAnalysis} />
          </section>
        )}

        {/* Footer */}
        <footer className="text-center pt-12 border-t border-[var(--border-dim)] space-y-4">
          <p className="font-mono text-xs text-[var(--text-muted)] tracking-wider">
            POWERED BY RIOT GAMES API | NOT ENDORSED BY RIOT GAMES
          </p>
          <div className="flex items-center justify-center gap-4 text-xs font-mono">
            <a href="/privacy" className="text-[var(--text-muted)] hover:text-[var(--neon-cyan)] transition-colors">
              Privacy
            </a>
            <span className="text-[var(--border-dim)]">|</span>
            <a href="/terms" className="text-[var(--text-muted)] hover:text-[var(--neon-cyan)] transition-colors">
              Terms
            </a>
            <span className="text-[var(--border-dim)]">|</span>
            <a href="/legal" className="text-[var(--text-muted)] hover:text-[var(--neon-cyan)] transition-colors">
              Legal
            </a>
            <span className="text-[var(--border-dim)]">|</span>
            <a
              href="https://github.com/smoran02/lol-smurf-detector"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-muted)] hover:text-[var(--neon-cyan)] transition-colors"
            >
              GitHub
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
