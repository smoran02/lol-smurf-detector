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

export type Position = "TOP" | "JUNGLE" | "MID" | "BOT" | "SUPPORT" | "UNKNOWN";

// Position sort order: TOP, JUNGLE, MID, BOT, SUPPORT
export const POSITION_ORDER: Record<Position, number> = {
  TOP: 0,
  JUNGLE: 1,
  MID: 2,
  BOT: 3,
  SUPPORT: 4,
  UNKNOWN: 5,
};

export interface SmurfAnalysisResponse {
  puuid: string;
  riot_id_name: string;
  riot_id_tag: string;
  summoner_level: number;
  champion_id: number | null;
  position: Position;
  total_score: number;
  classification: SmurfClassification;
  confidence: string;
  indicator_scores: IndicatorScores;
  raw_metrics: RawMetrics;
  analyzed_at: string;
}

// Data Dragon version for champion images (use latest for newest champions)
const DDRAGON_VERSION = "15.24.1";

/**
 * Get the champion square image URL from Data Dragon CDN.
 */
export function getChampionImageUrl(championId: number): string | null {
  const key = CHAMPION_KEYS[championId];
  if (!key) return null;
  return `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/champion/${key}.png`;
}

// Champion ID to Data Dragon key mapping (for image URLs)
const CHAMPION_KEYS: Record<number, string> = {
  1: "Annie", 2: "Olaf", 3: "Galio", 4: "TwistedFate", 5: "XinZhao",
  6: "Urgot", 7: "Leblanc", 8: "Vladimir", 9: "Fiddlesticks", 10: "Kayle",
  11: "MasterYi", 12: "Alistar", 13: "Ryze", 14: "Sion", 15: "Sivir",
  16: "Soraka", 17: "Teemo", 18: "Tristana", 19: "Warwick", 20: "Nunu",
  21: "MissFortune", 22: "Ashe", 23: "Tryndamere", 24: "Jax", 25: "Morgana",
  26: "Zilean", 27: "Singed", 28: "Evelynn", 29: "Twitch", 30: "Karthus",
  31: "Chogath", 32: "Amumu", 33: "Rammus", 34: "Anivia", 35: "Shaco",
  36: "DrMundo", 37: "Sona", 38: "Kassadin", 39: "Irelia", 40: "Janna",
  41: "Gangplank", 42: "Corki", 43: "Karma", 44: "Taric", 45: "Veigar",
  48: "Trundle", 50: "Swain", 51: "Caitlyn", 53: "Blitzcrank", 54: "Malphite",
  55: "Katarina", 56: "Nocturne", 57: "Maokai", 58: "Renekton", 59: "JarvanIV",
  60: "Elise", 61: "Orianna", 62: "MonkeyKing", 63: "Brand", 64: "LeeSin",
  67: "Vayne", 68: "Rumble", 69: "Cassiopeia", 72: "Skarner", 74: "Heimerdinger",
  75: "Nasus", 76: "Nidalee", 77: "Udyr", 78: "Poppy", 79: "Gragas",
  80: "Pantheon", 81: "Ezreal", 82: "Mordekaiser", 83: "Yorick", 84: "Akali",
  85: "Kennen", 86: "Garen", 89: "Leona", 90: "Malzahar", 91: "Talon",
  92: "Riven", 96: "KogMaw", 98: "Shen", 99: "Lux", 101: "Xerath",
  102: "Shyvana", 103: "Ahri", 104: "Graves", 105: "Fizz", 106: "Volibear",
  107: "Rengar", 110: "Varus", 111: "Nautilus", 112: "Viktor", 113: "Sejuani",
  114: "Fiora", 115: "Ziggs", 117: "Lulu", 119: "Draven", 120: "Hecarim",
  121: "Khazix", 122: "Darius", 126: "Jayce", 127: "Lissandra", 131: "Diana",
  133: "Quinn", 134: "Syndra", 136: "AurelionSol", 141: "Kayn", 142: "Zoe",
  143: "Zyra", 145: "Kaisa", 147: "Seraphine", 150: "Gnar", 154: "Zac",
  157: "Yasuo", 161: "Velkoz", 163: "Taliyah", 164: "Camille", 166: "Akshan",
  200: "Belveth", 201: "Braum", 202: "Jhin", 203: "Kindred", 221: "Zeri",
  222: "Jinx", 223: "TahmKench", 233: "Briar", 234: "Viego", 235: "Senna", 236: "Lucian",
  238: "Zed", 240: "Kled", 245: "Ekko", 246: "Qiyana", 254: "Vi",
  266: "Aatrox", 267: "Nami", 268: "Azir", 350: "Yuumi", 360: "Samira",
  412: "Thresh", 420: "Illaoi", 421: "RekSai", 427: "Ivern", 429: "Kalista",
  432: "Bard", 497: "Rakan", 498: "Xayah", 516: "Ornn", 517: "Sylas",
  518: "Neeko", 523: "Aphelios", 526: "Rell", 555: "Pyke", 711: "Vex",
  777: "Yone", 875: "Sett", 876: "Lillia", 887: "Gwen", 888: "Renata",
  799: "Ambessa", 800: "Mel", 804: "Yunara", 904: "Zaahen",
  893: "Aurora", 895: "Nilah", 897: "KSante", 901: "Smolder", 902: "Milio",
  910: "Hwei", 950: "Naafiri",
};

// Common champion ID to name mapping (most popular champions)
export const CHAMPION_NAMES: Record<number, string> = {
  1: "Annie", 2: "Olaf", 3: "Galio", 4: "Twisted Fate", 5: "Xin Zhao",
  6: "Urgot", 7: "LeBlanc", 8: "Vladimir", 9: "Fiddlesticks", 10: "Kayle",
  11: "Master Yi", 12: "Alistar", 13: "Ryze", 14: "Sion", 15: "Sivir",
  16: "Soraka", 17: "Teemo", 18: "Tristana", 19: "Warwick", 20: "Nunu & Willump",
  21: "Miss Fortune", 22: "Ashe", 23: "Tryndamere", 24: "Jax", 25: "Morgana",
  26: "Zilean", 27: "Singed", 28: "Evelynn", 29: "Twitch", 30: "Karthus",
  31: "Cho'Gath", 32: "Amumu", 33: "Rammus", 34: "Anivia", 35: "Shaco",
  36: "Dr. Mundo", 37: "Sona", 38: "Kassadin", 39: "Irelia", 40: "Janna",
  41: "Gangplank", 42: "Corki", 43: "Karma", 44: "Taric", 45: "Veigar",
  48: "Trundle", 50: "Swain", 51: "Caitlyn", 53: "Blitzcrank", 54: "Malphite",
  55: "Katarina", 56: "Nocturne", 57: "Maokai", 58: "Renekton", 59: "Jarvan IV",
  60: "Elise", 61: "Orianna", 62: "Wukong", 63: "Brand", 64: "Lee Sin",
  67: "Vayne", 68: "Rumble", 69: "Cassiopeia", 72: "Skarner", 74: "Heimerdinger",
  75: "Nasus", 76: "Nidalee", 77: "Udyr", 78: "Poppy", 79: "Gragas",
  80: "Pantheon", 81: "Ezreal", 82: "Mordekaiser", 83: "Yorick", 84: "Akali",
  85: "Kennen", 86: "Garen", 89: "Leona", 90: "Malzahar", 91: "Talon",
  92: "Riven", 96: "Kog'Maw", 98: "Shen", 99: "Lux", 101: "Xerath",
  102: "Shyvana", 103: "Ahri", 104: "Graves", 105: "Fizz", 106: "Volibear",
  107: "Rengar", 110: "Varus", 111: "Nautilus", 112: "Viktor", 113: "Sejuani",
  114: "Fiora", 115: "Ziggs", 117: "Lulu", 119: "Draven", 120: "Hecarim",
  121: "Kha'Zix", 122: "Darius", 126: "Jayce", 127: "Lissandra", 131: "Diana",
  133: "Quinn", 134: "Syndra", 136: "Aurelion Sol", 141: "Kayn", 142: "Zoe",
  143: "Zyra", 145: "Kai'Sa", 147: "Seraphine", 150: "Gnar", 154: "Zac",
  157: "Yasuo", 161: "Vel'Koz", 163: "Taliyah", 164: "Camille", 166: "Akshan",
  200: "Bel'Veth", 201: "Braum", 202: "Jhin", 203: "Kindred", 221: "Zeri",
  222: "Jinx", 223: "Tahm Kench", 233: "Briar", 234: "Viego", 235: "Senna", 236: "Lucian",
  238: "Zed", 240: "Kled", 245: "Ekko", 246: "Qiyana", 254: "Vi",
  266: "Aatrox", 267: "Nami", 268: "Azir", 350: "Yuumi", 360: "Samira",
  412: "Thresh", 420: "Illaoi", 421: "Rek'Sai", 427: "Ivern", 429: "Kalista",
  432: "Bard", 497: "Rakan", 498: "Xayah", 516: "Ornn", 517: "Sylas",
  518: "Neeko", 523: "Aphelios", 526: "Rell", 555: "Pyke", 711: "Vex",
  777: "Yone", 875: "Sett", 876: "Lillia", 887: "Gwen", 888: "Renata Glasc",
  799: "Ambessa", 800: "Mel", 804: "Yunara", 904: "Zaahen",
  893: "Aurora", 895: "Nilah", 897: "K'Sante", 901: "Smolder", 902: "Milio",
  910: "Hwei", 950: "Naafiri",
};

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

export interface HiddenPlayer {
  champion_id: number | null; // null when completely hidden by Riot API
  position: Position;
  team_id: number; // 100 for blue, 200 for red
  is_hidden: boolean; // Always true
}

export interface MatchAnalysisResponse {
  game_id: number;
  game_mode: string;
  blue_team: SmurfAnalysisResponse[];
  red_team: SmurfAnalysisResponse[];
  hidden_players: HiddenPlayer[];
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
