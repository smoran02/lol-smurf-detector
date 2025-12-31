"""Core smurf detection algorithm."""

import logging
from dataclasses import dataclass
from enum import Enum

from app.algorithms.thresholds import (
    EXPECTED_LEVEL_FOR_TIER,
    INDICATOR_WEIGHTS,
    MIN_GAMES_FOR_ANALYSIS,
    SCORE_THRESHOLDS,
    TIER_BENCHMARKS,
)

logger = logging.getLogger(__name__)


class SmurfClassification(str, Enum):
    """Smurf detection classification levels."""

    LIKELY_SMURF = "LIKELY_SMURF"
    POSSIBLE_SMURF = "POSSIBLE_SMURF"
    UNLIKELY = "UNLIKELY"
    UNKNOWN = "UNKNOWN"


@dataclass
class IndicatorScores:
    """Individual indicator scores (0-100)."""

    winrate: float | None = None
    level_performance: float | None = None
    champion_pool: float | None = None
    cs_per_min: float | None = None
    kda: float | None = None
    game_frequency: float | None = None
    account_age_ratio: float | None = None


@dataclass
class SmurfAnalysisResult:
    """Complete smurf analysis result."""

    total_score: float
    classification: SmurfClassification
    confidence: str  # "high", "medium", "low"
    indicator_scores: IndicatorScores
    games_analyzed: int


class SmurfDetector:
    """Smurf detection algorithm using weighted scoring."""

    def analyze(
        self,
        aggregate_stats: dict,
        summoner_level: int,
        tier: str | None,
        rank: str | None,
        ranked_wins: int | None,
        ranked_losses: int | None,
    ) -> SmurfAnalysisResult:
        """Analyze a player for smurf indicators.

        Args:
            aggregate_stats: Aggregated match stats from MatchService
            summoner_level: Player's account level
            tier: Current ranked tier (e.g., "GOLD")
            rank: Current rank within tier (e.g., "II")
            ranked_wins: Total ranked wins
            ranked_losses: Total ranked losses

        Returns:
            SmurfAnalysisResult with scores and classification
        """
        games = aggregate_stats.get("games_analyzed", 0)

        # Not enough data for analysis
        if games < MIN_GAMES_FOR_ANALYSIS:
            return SmurfAnalysisResult(
                total_score=0,
                classification=SmurfClassification.UNKNOWN,
                confidence="low",
                indicator_scores=IndicatorScores(),
                games_analyzed=games,
            )

        # Calculate individual indicator scores
        indicator_scores = IndicatorScores(
            winrate=self._score_winrate(aggregate_stats.get("winrate")),
            level_performance=self._score_level_performance(summoner_level, tier),
            champion_pool=self._score_champion_pool(
                aggregate_stats.get("unique_champions", 0),
                games,
            ),
            cs_per_min=self._score_cs_per_min(
                aggregate_stats.get("avg_cs_per_min"),
                tier,
            ),
            kda=self._score_kda(aggregate_stats.get("avg_kda"), tier),
            game_frequency=self._score_game_frequency(
                aggregate_stats.get("games_per_day", 0)
            ),
            account_age_ratio=self._score_account_age_ratio(
                summoner_level,
                ranked_wins,
                ranked_losses,
                tier,
            ),
        )

        # Calculate weighted total score
        total_score = self._calculate_weighted_score(indicator_scores)

        # Determine classification
        classification = self._classify(total_score)

        # Determine confidence based on games analyzed
        if games >= 20:
            confidence = "high"
        elif games >= 10:
            confidence = "medium"
        else:
            confidence = "low"

        return SmurfAnalysisResult(
            total_score=round(total_score, 1),
            classification=classification,
            confidence=confidence,
            indicator_scores=indicator_scores,
            games_analyzed=games,
        )

    def _score_winrate(self, winrate: float | None) -> float:
        """Score based on win rate.

        High win rates (>65%) on newer accounts are suspicious.
        """
        if winrate is None:
            return 0

        if winrate >= 75:
            return 100
        elif winrate >= 70:
            return 85
        elif winrate >= 65:
            return 70
        elif winrate >= 60:
            return 50
        elif winrate >= 55:
            return 30
        else:
            return 0

    def _score_level_performance(
        self,
        level: int,
        tier: str | None,
    ) -> float:
        """Score based on account level vs achieved rank.

        Low level accounts in high ranks are suspicious.
        """
        if not tier or tier not in EXPECTED_LEVEL_FOR_TIER:
            return 0

        expected_level = EXPECTED_LEVEL_FOR_TIER[tier]
        level_ratio = level / expected_level

        # If level is much lower than expected for the rank
        if level_ratio < 0.3:
            return 100
        elif level_ratio < 0.5:
            return 80
        elif level_ratio < 0.7:
            return 60
        elif level_ratio < 0.9:
            return 40
        elif level_ratio < 1.1:
            return 20
        else:
            return 0

    def _score_champion_pool(
        self,
        unique_champions: int,
        games: int,
    ) -> float:
        """Score based on champion pool concentration.

        Smurfs often one-trick or play very few champions.
        Uses absolute champion count since we only analyze ~5 games.
        """
        if games == 0:
            return 0

        # Score based on absolute unique champion count
        # With 5 games, playing 1-2 champs is suspicious
        if unique_champions == 1:
            return 100
        elif unique_champions == 2:
            return 60
        elif unique_champions == 3:
            return 30
        else:
            return 0

    def _score_cs_per_min(
        self,
        cs_per_min: float | None,
        tier: str | None,
    ) -> float:
        """Score based on CS/min compared to tier benchmark.

        CS significantly above tier average is suspicious.
        """
        if cs_per_min is None:
            return 0

        # Get benchmark for tier (default to Silver if unknown)
        benchmark = TIER_BENCHMARKS.get(tier or "SILVER", TIER_BENCHMARKS["SILVER"])
        expected_cs = benchmark["cs"]

        # Calculate how much above expected
        cs_diff = cs_per_min - expected_cs

        if cs_diff >= 2.5:
            return 100
        elif cs_diff >= 2.0:
            return 80
        elif cs_diff >= 1.5:
            return 60
        elif cs_diff >= 1.0:
            return 40
        elif cs_diff >= 0.5:
            return 20
        else:
            return 0

    def _score_kda(self, kda: float | None, tier: str | None) -> float:
        """Score based on KDA compared to tier benchmark.

        KDA significantly above tier average is suspicious.
        """
        if kda is None:
            return 0

        benchmark = TIER_BENCHMARKS.get(tier or "SILVER", TIER_BENCHMARKS["SILVER"])
        expected_kda = benchmark["kda"]

        kda_diff = kda - expected_kda

        if kda_diff >= 2.0:
            return 100
        elif kda_diff >= 1.5:
            return 80
        elif kda_diff >= 1.0:
            return 60
        elif kda_diff >= 0.5:
            return 40
        elif kda_diff >= 0.25:
            return 20
        else:
            return 0

    def _score_game_frequency(self, games_per_day: float) -> float:
        """Score based on games played per day.

        Very high game frequency on new accounts is suspicious.
        """
        if games_per_day >= 10:
            return 100
        elif games_per_day >= 8:
            return 80
        elif games_per_day >= 6:
            return 60
        elif games_per_day >= 4:
            return 40
        elif games_per_day >= 3:
            return 20
        else:
            return 0

    def _score_account_age_ratio(
        self,
        level: int,
        wins: int | None,
        losses: int | None,
        tier: str | None,
    ) -> float:
        """Score based on how quickly account reached current rank.

        Reaching high ranks with few total games is suspicious.
        """
        if wins is None or losses is None or not tier:
            return 0

        total_games = wins + losses
        if total_games == 0:
            return 0

        # Expected games to reach each tier
        expected_games = {
            "IRON": 10,
            "BRONZE": 30,
            "SILVER": 80,
            "GOLD": 150,
            "PLATINUM": 250,
            "EMERALD": 400,
            "DIAMOND": 600,
            "MASTER": 1000,
            "GRANDMASTER": 1500,
            "CHALLENGER": 2000,
        }

        expected = expected_games.get(tier, 100)
        ratio = total_games / expected

        # If total games is much lower than expected for the rank
        if ratio < 0.2:
            return 100
        elif ratio < 0.3:
            return 80
        elif ratio < 0.4:
            return 60
        elif ratio < 0.5:
            return 40
        elif ratio < 0.7:
            return 20
        else:
            return 0

    def _calculate_weighted_score(self, scores: IndicatorScores) -> float:
        """Calculate weighted average of all indicator scores."""
        total = 0
        weight_sum = 0

        score_map = {
            "winrate": scores.winrate,
            "level_performance": scores.level_performance,
            "champion_pool": scores.champion_pool,
            "cs_per_min": scores.cs_per_min,
            "kda": scores.kda,
            "game_frequency": scores.game_frequency,
            "account_age_ratio": scores.account_age_ratio,
        }

        for indicator, score in score_map.items():
            if score is not None:
                weight = INDICATOR_WEIGHTS[indicator]
                total += score * weight
                weight_sum += weight

        if weight_sum == 0:
            return 0

        # Normalize if not all indicators available
        return total / weight_sum * sum(INDICATOR_WEIGHTS.values())

    def _classify(self, score: float) -> SmurfClassification:
        """Classify based on total score."""
        if score >= SCORE_THRESHOLDS["LIKELY_SMURF"]:
            return SmurfClassification.LIKELY_SMURF
        elif score >= SCORE_THRESHOLDS["POSSIBLE_SMURF"]:
            return SmurfClassification.POSSIBLE_SMURF
        else:
            return SmurfClassification.UNLIKELY


# Global detector instance
smurf_detector = SmurfDetector()
