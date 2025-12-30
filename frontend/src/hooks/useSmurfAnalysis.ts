/**
 * React Query hooks for smurf analysis.
 */

import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";

/**
 * Hook to fetch summoner data by Riot ID.
 */
export function useSummoner(name: string, tag: string, enabled = true) {
  return useQuery({
    queryKey: ["summoner", name, tag],
    queryFn: () => api.getSummoner(name, tag),
    enabled: enabled && !!name && !!tag,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch live game data.
 */
export function useLiveGame(puuid: string, enabled = true) {
  return useQuery({
    queryKey: ["liveGame", puuid],
    queryFn: () => api.getLiveGame(puuid),
    enabled: enabled && !!puuid,
    retry: false,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

/**
 * Hook to analyze all players in a match.
 */
export function useMatchAnalysis(puuid: string, enabled = true) {
  return useQuery({
    queryKey: ["matchAnalysis", puuid],
    queryFn: () => api.analyzeMatch(puuid),
    enabled: enabled && !!puuid,
    retry: false,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Mutation hook to manually trigger match analysis.
 */
export function useAnalyzeMatch() {
  return useMutation({
    mutationFn: (puuid: string) => api.analyzeMatch(puuid),
  });
}
