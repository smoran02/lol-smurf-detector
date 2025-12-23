/**
 * API client for communicating with the backend.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface SummonerResponse {
  puuid: string;
  summoner_id: string;
  riot_id_name: string;
  riot_id_tag: string;
  summoner_level: number;
  profile_icon_id: number;
  solo_tier: string | null;
  solo_rank: string | null;
  solo_lp: number | null;
  solo_wins: number | null;
  solo_losses: number | null;
  flex_tier: string | null;
  flex_rank: string | null;
  flex_lp: number | null;
  flex_wins: number | null;
  flex_losses: number | null;
}

export interface IndicatorScores {
  winrate: number | null;
  level_performance: number | null;
  champion_pool: number | null;
  cs_per_min: number | null;
  kda: number | null;
  game_frequency: number | null;
  account_age_ratio: number | null;
}

export interface RawMetrics {
  winrate: number | null;
  avg_cs_per_min: number | null;
  avg_kda: number | null;
  unique_champions: number | null;
  games_per_day: number | null;
  games_analyzed: number;
}

export type SmurfClassification =
  | "LIKELY_SMURF"
  | "POSSIBLE_SMURF"
  | "UNLIKELY"
  | "UNKNOWN";

export interface SmurfAnalysisResponse {
  puuid: string;
  riot_id_name: string;
  riot_id_tag: string;
  summoner_level: number;
  total_score: number;
  classification: SmurfClassification;
  confidence: string;
  indicator_scores: IndicatorScores;
  raw_metrics: RawMetrics;
  analyzed_at: string;
}

export interface LiveGameParticipant {
  puuid: string;
  summoner_id: string;
  riot_id_name: string;
  summoner_name: string;
  champion_id: number;
  team_id: number;
  spell1_id: number;
  spell2_id: number;
}

export interface LiveGameResponse {
  game_id: number;
  game_type: string;
  game_start_time: number;
  game_length: number;
  game_mode: string;
  game_queue_config_id: number;
  participants: LiveGameParticipant[];
}

export interface MatchAnalysisResponse {
  game_id: number;
  game_mode: string;
  blue_team: SmurfAnalysisResponse[];
  red_team: SmurfAnalysisResponse[];
}

class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Unknown error" }));
    throw new ApiError(response.status, error.detail || "Request failed");
  }

  return response.json();
}

export const api = {
  /**
   * Look up a summoner by their Riot ID.
   */
  getSummoner: (name: string, tag: string): Promise<SummonerResponse> =>
    fetchApi(`/api/v1/summoner/by-riot-id/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`),

  /**
   * Get a player's current live game.
   */
  getLiveGame: (puuid: string): Promise<LiveGameResponse> =>
    fetchApi(`/api/v1/match/live/${encodeURIComponent(puuid)}`),

  /**
   * Analyze a single player for smurf indicators.
   */
  analyzePlayer: (puuid: string): Promise<SmurfAnalysisResponse> =>
    fetchApi(`/api/v1/analysis/player?puuid=${encodeURIComponent(puuid)}`, {
      method: "POST",
    }),

  /**
   * Analyze all players in a live match.
   */
  analyzeMatch: (puuid: string): Promise<MatchAnalysisResponse> =>
    fetchApi(`/api/v1/analysis/match?puuid=${encodeURIComponent(puuid)}`, {
      method: "POST",
    }),
};

export { ApiError };
