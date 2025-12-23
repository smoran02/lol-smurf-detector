"use client";

import { useState } from "react";

interface SummonerSearchProps {
  onSearch: (name: string, tag: string) => void;
  isLoading?: boolean;
}

export function SummonerSearch({ onSearch, isLoading }: SummonerSearchProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Parse Riot ID format: Name#TAG
    const parts = input.split("#");
    if (parts.length !== 2) {
      setError("Please enter a valid Riot ID (e.g., PlayerName#NA1)");
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
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="riotId"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Enter Riot ID
          </label>
          <div className="relative">
            <input
              id="riotId"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="PlayerName#NA1"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-400">{error}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Searching...
            </span>
          ) : (
            "Find Match"
          )}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-500">
        Enter your Riot ID to analyze your current match
      </p>
    </div>
  );
}
