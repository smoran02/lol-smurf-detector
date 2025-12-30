"use client";

import { useState } from "react";

interface SummonerSearchProps {
  onSearch: (name: string, tag: string) => void;
  isLoading?: boolean;
}

export function SummonerSearch({ onSearch, isLoading }: SummonerSearchProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Parse Riot ID format: Name#TAG
    const parts = input.split("#");
    if (parts.length !== 2) {
      setError("Invalid format. Use: PlayerName#TAG");
      return;
    }

    const [name, tag] = parts;
    if (!name.trim() || !tag.trim()) {
      setError("Both name and tag are required");
      return;
    }

    onSearch(name.trim(), tag.trim());
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input container */}
        <div className="relative group">
          {/* Glow effect container */}
          <div
            className={`absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-magenta)] to-[var(--neon-cyan)] opacity-0 blur transition-all duration-500 ${
              isFocused ? "opacity-50" : "group-hover:opacity-30"
            }`}
          />

          {/* Main input wrapper */}
          <div className="relative glass-card p-1 rounded-xl">
            {/* Label */}
            <div className="px-4 pt-3 pb-1">
              <label
                htmlFor="riotId"
                className="data-label"
              >
                TARGET RIOT ID
              </label>
            </div>

            {/* Input row */}
            <div className="flex items-stretch">
              <div className="flex-1 px-4 pb-3">
                <input
                  id="riotId"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="PlayerName#NA1"
                  className="w-full bg-transparent text-[var(--text-primary)] text-lg font-mono placeholder:text-[var(--text-muted)] focus:outline-none"
                  disabled={isLoading}
                  autoComplete="off"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={`
                  relative px-6 m-1 rounded-lg font-display text-sm tracking-wider
                  transition-all duration-300 overflow-hidden
                  ${
                    isLoading || !input.trim()
                      ? "bg-[var(--bg-elevated)] text-[var(--text-muted)] cursor-not-allowed"
                      : "bg-[var(--neon-cyan)] text-[var(--bg-void)] hover:shadow-[0_0_20px_var(--neon-cyan)] active:scale-95"
                  }
                `}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>SCANNING</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>SCAN</span>
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 px-4 py-2 bg-[var(--neon-red)]/10 border border-[var(--neon-red)]/30 rounded-lg">
            <svg className="w-4 h-4 text-neon-red shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-neon-red font-mono">{error}</p>
          </div>
        )}
      </form>

      {/* Helper text */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs font-mono text-[var(--text-muted)]">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon-cyan)] opacity-50" />
          Format: Name#TAG
        </span>
        <span className="text-[var(--border-dim)]">|</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon-magenta)] opacity-50" />
          Must be in active game
        </span>
      </div>
    </div>
  );
}
