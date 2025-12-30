"use client";

import Link from "next/link";

export default function LegalDisclaimer() {
  return (
    <main className="min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--neon-cyan)] transition-colors font-mono text-sm mb-6"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <h1 className="font-display text-3xl md:text-4xl text-[var(--neon-cyan)] glow-cyan tracking-wider">
            LEGAL DISCLAIMER
          </h1>
          <p className="text-[var(--text-muted)] font-mono text-sm mt-2">
            Riot Games Legal Attribution
          </p>
        </div>

        {/* Riot Games Disclaimer - Required Attribution */}
        <div className="glass-card p-8 border border-[var(--neon-orange)] box-glow-orange mb-8">
          <h2 className="font-display text-xl text-[var(--neon-orange)] tracking-wider mb-4">
            RIOT GAMES DISCLAIMER
          </h2>
          <div className="text-[var(--text-primary)] space-y-4 text-lg">
            <p>
              LoL Smurf Detector isn&apos;t endorsed by Riot Games and doesn&apos;t reflect the views
              or opinions of Riot Games or anyone officially involved in producing or managing
              Riot Games properties.
            </p>
            <p>
              Riot Games, and all associated properties are trademarks or registered
              trademarks of Riot Games, Inc.
            </p>
          </div>
        </div>

        {/* Additional Legal Info */}
        <div className="glass-card p-8 border border-[var(--border-dim)] space-y-8">
          <section className="space-y-4">
            <h2 className="font-display text-xl text-[var(--text-primary)] tracking-wider">
              ABOUT THIS PROJECT
            </h2>
            <div className="text-[var(--text-secondary)] space-y-3">
              <p>
                LoL Smurf Detector is an independent, community-created tool that uses the
                official Riot Games API to analyze publicly available match data.
              </p>
              <p>
                This project is open source and available on{" "}
                <a
                  href="https://github.com/smoran02/lol-smurf-detector"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--neon-cyan)] hover:underline"
                >
                  GitHub
                </a>
                .
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl text-[var(--text-primary)] tracking-wider">
              RIOT GAMES API
            </h2>
            <div className="text-[var(--text-secondary)] space-y-3">
              <p>
                This application uses the Riot Games API in accordance with Riot&apos;s API terms
                and conditions. We access only publicly available data and respect all rate
                limits and usage policies.
              </p>
              <p>
                For more information about the Riot Games API, visit the{" "}
                <a
                  href="https://developer.riotgames.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--neon-cyan)] hover:underline"
                >
                  Riot Developer Portal
                </a>
                .
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl text-[var(--text-primary)] tracking-wider">
              ACCURACY DISCLAIMER
            </h2>
            <div className="text-[var(--text-secondary)] space-y-3">
              <p>
                The smurf detection analysis provided by this tool is based on statistical
                patterns and heuristics. Results should be interpreted as estimates, not
                definitive determinations.
              </p>
              <p>
                We make no guarantees about the accuracy of our analysis. Many factors can
                affect player performance that are not indicative of a smurf account.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl text-[var(--text-primary)] tracking-wider">
              FAIR USE
            </h2>
            <div className="text-[var(--text-secondary)]">
              <p>
                This tool is intended for informational and entertainment purposes only.
                It should not be used to harass, target, or negatively impact other players.
                We encourage fair play and respect for all members of the League of Legends community.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl text-[var(--text-primary)] tracking-wider">
              TRADEMARKS
            </h2>
            <div className="text-[var(--text-secondary)]">
              <p>
                League of Legends, Riot Games, and all related logos, characters, names,
                and distinctive likenesses are the exclusive property of Riot Games, Inc.
                All Rights Reserved.
              </p>
            </div>
          </section>
        </div>

        {/* Footer links */}
        <div className="mt-8 flex items-center justify-center gap-6 text-sm font-mono">
          <Link href="/privacy" className="text-[var(--text-muted)] hover:text-[var(--neon-cyan)] transition-colors">
            Privacy Policy
          </Link>
          <span className="text-[var(--border-dim)]">|</span>
          <Link href="/terms" className="text-[var(--text-muted)] hover:text-[var(--neon-cyan)] transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </main>
  );
}
