"""Tier benchmarks and thresholds for smurf detection."""

# Average CS/min and KDA by tier (approximate values based on game data)
TIER_BENCHMARKS: dict[str, dict[str, float]] = {
    "IRON": {"cs": 4.0, "kda": 1.5, "vision": 10},
    "BRONZE": {"cs": 5.0, "kda": 1.8, "vision": 12},
    "SILVER": {"cs": 5.5, "kda": 2.0, "vision": 15},
    "GOLD": {"cs": 6.0, "kda": 2.3, "vision": 18},
    "PLATINUM": {"cs": 6.5, "kda": 2.6, "vision": 22},
    "EMERALD": {"cs": 7.0, "kda": 2.8, "vision": 25},
    "DIAMOND": {"cs": 7.5, "kda": 3.0, "vision": 28},
    "MASTER": {"cs": 8.0, "kda": 3.2, "vision": 32},
    "GRANDMASTER": {"cs": 8.5, "kda": 3.4, "vision": 35},
    "CHALLENGER": {"cs": 9.0, "kda": 3.5, "vision": 38},
}

# Expected account levels for reaching each tier normally
# These are intentionally high to catch smurfs - legitimate players
# typically have much higher levels by the time they reach these ranks
EXPECTED_LEVEL_FOR_TIER: dict[str, int] = {
    "IRON": 30,
    "BRONZE": 50,
    "SILVER": 80,
    "GOLD": 120,
    "PLATINUM": 180,
    "EMERALD": 250,
    "DIAMOND": 350,
    "MASTER": 500,
    "GRANDMASTER": 600,
    "CHALLENGER": 700,
}

# Indicator weights (must sum to 1.0)
INDICATOR_WEIGHTS: dict[str, float] = {
    "winrate": 0.25,
    "account_age": 0.25,  # Renamed from level_performance
    "champion_pool": 0.15,
    "cs_per_min": 0.15,
    "kda": 0.10,
    "game_frequency": 0.10,
}

# Classification thresholds
SCORE_THRESHOLDS = {
    "LIKELY_SMURF": 70,
    "POSSIBLE_SMURF": 50,
}

# Minimum games required for analysis
MIN_GAMES_FOR_ANALYSIS = 5
