"use client";

import { useState, useEffect } from "react";
import { SummonerSearch } from "@/components/search/SummonerSearch";
import { LiveMatchCard } from "@/components/match/LiveMatchCard";
import { useSummoner, useMatchAnalysis } from "@/hooks/useSmurfAnalysis";

export default function Home() {
  const [riotId, setRiotId] = useState<{ name: string; tag: string } | null>(null);
  const [showColdStartMessage, setShowColdStartMessage] = useState(false);

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

  // Only show cold start message if summoner lookup takes > 2 seconds
  useEffect(() => {
    if (!summonerLoading) {
      return;
    }
    const timer = setTimeout(() => {
      setShowColdStartMessage(true);
    }, 2000);
    return () => {
      clearTimeout(timer);
      setShowColdStartMessage(false);
    };
  }, [summonerLoading]);

  const handleSearch = (name: string, tag: string) => {
    setRiotId({ name, tag });
  };

  const isLoading = summonerLoading || analysisLoading;
  const error = summonerError || analysisError;

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
              SMURF DETECTOR
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
        {summoner && !matchAnalysis && !analysisLoading && (
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

        {/* Loading State - Summoner Lookup (only shows after 2s delay for cold starts) */}
        {summonerLoading && showColdStartMessage && (
          <div className="animate-slide-up text-center py-16">
            {/* Animated scanner */}
            <div className="relative inline-block mb-8">
              <div className="w-24 h-24 border-2 border-[var(--neon-magenta)] rounded-full animate-glow-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border-2 border-[var(--neon-cyan)] rounded-full animate-spin" style={{ animationDuration: '2s' }} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-[var(--neon-magenta)] rounded-full animate-pulse opacity-50" />
              </div>
            </div>

            <h3 className="font-display text-xl text-neon-magenta glow-magenta mb-3">
              CONNECTING
            </h3>
            <p className="text-[var(--text-secondary)] font-mono text-sm mb-2">
              Looking up player...
            </p>
            <p className="text-[var(--text-muted)] text-xs font-mono">
              First request may take ~30s if server is waking up
            </p>

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-[var(--neon-magenta)]"
                  style={{
                    animation: 'pulse-glow 1s ease-in-out infinite',
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Loading State - Match Analysis */}
        {analysisLoading && (
          <div className="animate-slide-up text-center py-16">
            {/* Animated scanner */}
            <div className="relative inline-block mb-8">
              <div className="w-24 h-24 border-2 border-[var(--neon-cyan)] rounded-full animate-glow-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border-2 border-[var(--neon-magenta)] rounded-full animate-spin" style={{ animationDuration: '2s' }} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-[var(--neon-cyan)] rounded-full animate-pulse opacity-50" />
              </div>
            </div>

            <h3 className="font-display text-xl text-neon-cyan glow-cyan mb-3">
              SCANNING MATCH
            </h3>
            <p className="text-[var(--text-secondary)] font-mono text-sm mb-2">
              Analyzing all players in the current game...
            </p>
            <p className="text-[var(--text-muted)] text-xs font-mono">
              This may take a moment as we gather match data
            </p>

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-[var(--neon-cyan)]"
                  style={{
                    animation: 'pulse-glow 1s ease-in-out infinite',
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Match Analysis Results */}
        {matchAnalysis && (
          <section className="animate-slide-up stagger-2 opacity-0">
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
