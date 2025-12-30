"use client";

import Link from "next/link";

export default function TermsOfService() {
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
            TERMS OF SERVICE
          </h1>
          <p className="text-[var(--text-muted)] font-mono text-sm mt-2">
            Last updated: December 2024
          </p>
        </div>

        {/* Content */}
        <div className="glass-card p-8 border border-[var(--border-dim)] space-y-8">
          <section className="space-y-4">
            <h2 className="font-display text-xl text-[var(--text-primary)] tracking-wider">
              ACCEPTANCE OF TERMS
            </h2>
            <div className="text-[var(--text-secondary)]">
              <p>
                By accessing and using LoL Smurf Detector, you agree to be bound by these
                Terms of Service. If you do not agree to these terms, please do not use our service.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl text-[var(--text-primary)] tracking-wider">
              DESCRIPTION OF SERVICE
            </h2>
            <div className="text-[var(--text-secondary)] space-y-3">
              <p>
                LoL Smurf Detector is a tool that analyzes League of Legends match data to
                estimate the likelihood that players may be using secondary (&quot;smurf&quot;) accounts.
              </p>
              <p>
                Our analysis is based on statistical patterns and should be treated as an
                estimate, not a definitive determination. We cannot guarantee the accuracy
                of our smurf detection results.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl text-[var(--text-primary)] tracking-wider">
              ACCEPTABLE USE
            </h2>
            <div className="text-[var(--text-secondary)] space-y-3">
              <p>You agree NOT to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Use this service to harass, target, or harm other players</li>
                <li>Attempt to circumvent rate limits or abuse the API</li>
                <li>Use automated scripts or bots to access the service</li>
                <li>Redistribute or sell data obtained from this service</li>
                <li>Use this service for any illegal purpose</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl text-[var(--text-primary)] tracking-wider">
              DISCLAIMER OF WARRANTIES
            </h2>
            <div className="text-[var(--text-secondary)] space-y-3">
              <p>
                This service is provided &quot;as is&quot; without warranties of any kind, either
                express or implied. We do not guarantee that:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>The service will be uninterrupted or error-free</li>
                <li>The smurf detection results will be accurate</li>
                <li>The service will be available at all times</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl text-[var(--text-primary)] tracking-wider">
              LIMITATION OF LIABILITY
            </h2>
            <div className="text-[var(--text-secondary)]">
              <p>
                We shall not be liable for any indirect, incidental, special, consequential,
                or punitive damages resulting from your use of or inability to use this service.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl text-[var(--text-primary)] tracking-wider">
              INTELLECTUAL PROPERTY
            </h2>
            <div className="text-[var(--text-secondary)]">
              <p>
                League of Legends and all related assets are trademarks of Riot Games, Inc.
                This project is not affiliated with or endorsed by Riot Games.
                See our <Link href="/legal" className="text-[var(--neon-cyan)] hover:underline">Legal Disclaimer</Link> for
                more information.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl text-[var(--text-primary)] tracking-wider">
              CHANGES TO TERMS
            </h2>
            <div className="text-[var(--text-secondary)]">
              <p>
                We reserve the right to modify these terms at any time. Continued use of
                the service after changes constitutes acceptance of the new terms.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl text-[var(--text-primary)] tracking-wider">
              CONTACT
            </h2>
            <div className="text-[var(--text-secondary)]">
              <p>
                For questions about these Terms, please open an issue on our{" "}
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
          <Link href="/privacy" className="text-[var(--text-muted)] hover:text-[var(--neon-cyan)] transition-colors">
            Privacy Policy
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
