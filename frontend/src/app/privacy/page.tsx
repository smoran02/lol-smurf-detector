"use client";

import Link from "next/link";

export default function PrivacyPolicy() {
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
            PRIVACY POLICY
          </h1>
          <p className="text-[var(--text-muted)] font-mono text-sm mt-2">
            Last updated: December 2024
          </p>
        </div>

        {/* Content */}
        <div className="glass-card p-8 border border-[var(--border-dim)] space-y-8">
          <section className="space-y-4">
            <h2 className="font-display text-xl text-[var(--text-primary)] tracking-wider">
              INFORMATION WE COLLECT
            </h2>
            <div className="text-[var(--text-secondary)] space-y-3">
              <p>
                LoL Smurf Detector collects the following information to provide and improve our service:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong className="text-[var(--text-primary)]">Player Identifiers:</strong> PUUID (a unique player identifier) and Riot ID used to retrieve match data
                </li>
                <li>
                  <strong className="text-[var(--text-primary)]">Match History:</strong> Publicly available match data including game statistics, champion picks, KDA, CS scores, and win/loss records
                </li>
                <li>
                  <strong className="text-[var(--text-primary)]">Analysis Results:</strong> Calculated smurf detection scores and classifications
                </li>
                <li>
                  <strong className="text-[var(--text-primary)]">Usage Analytics:</strong> Basic analytics about how the service is used
                </li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl text-[var(--text-primary)] tracking-wider">
              HOW WE USE YOUR INFORMATION
            </h2>
            <div className="text-[var(--text-secondary)] space-y-3">
              <p>We use the collected information to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Retrieve and analyze match data from Riot Games API</li>
                <li>Display smurf detection analysis results</li>
                <li>Store match data to train and improve our detection algorithms</li>
                <li>Build statistical models for more accurate smurf identification</li>
                <li>Reduce API calls through efficient data caching</li>
                <li>Monitor and prevent abuse of our service</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl text-[var(--text-primary)] tracking-wider">
              DATA STORAGE
            </h2>
            <div className="text-[var(--text-secondary)] space-y-3">
              <p>
                We store match data in our database to improve our smurf detection algorithms
                and provide faster analysis results. This includes:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Match statistics and game performance data</li>
                <li>Aggregated player metrics used for analysis</li>
                <li>Historical analysis results</li>
              </ul>
              <p>
                All stored data is publicly available match information from the Riot Games API.
                We use PUUID (an anonymous identifier) rather than summoner names as the primary
                identifier, as summoner names can change.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl text-[var(--text-primary)] tracking-wider">
              DATA RETENTION
            </h2>
            <div className="text-[var(--text-secondary)] space-y-3">
              <p>
                Match data is retained to maintain accurate detection algorithms. We periodically
                refresh data to ensure accuracy as the game meta evolves.
              </p>
              <p>
                You may request deletion of your data by contacting us through our GitHub repository.
                We will remove your specific player data upon verified request.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl text-[var(--text-primary)] tracking-wider">
              THIRD-PARTY SERVICES
            </h2>
            <div className="text-[var(--text-secondary)] space-y-3">
              <p>
                This application uses the Riot Games API to retrieve match and player data.
                Your use of this service is also subject to Riot Games&apos; privacy policy and terms of service.
              </p>
              <p>
                We do not sell, trade, or transfer your information to third parties.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl text-[var(--text-primary)] tracking-wider">
              COOKIES
            </h2>
            <div className="text-[var(--text-secondary)]">
              <p>
                We may use cookies or similar technologies to enhance user experience and
                gather anonymous usage statistics. You can disable cookies in your browser settings.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl text-[var(--text-primary)] tracking-wider">
              CONTACT
            </h2>
            <div className="text-[var(--text-secondary)]">
              <p>
                If you have questions about this Privacy Policy, please open an issue on our{" "}
                <a
                  href="https://github.com/smoran02/lol-smurf-detector"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--neon-cyan)] hover:underline"
                >
                  GitHub repository
                </a>
                .
              </p>
            </div>
          </section>
        </div>

        {/* Footer links */}
        <div className="mt-8 flex items-center justify-center gap-6 text-sm font-mono">
          <Link href="/terms" className="text-[var(--text-muted)] hover:text-[var(--neon-cyan)] transition-colors">
            Terms of Service
          </Link>
          <span className="text-[var(--border-dim)]">|</span>
          <Link href="/legal" className="text-[var(--text-muted)] hover:text-[var(--neon-cyan)] transition-colors">
            Legal Disclaimer
          </Link>
        </div>
      </div>
    </main>
  );
}
