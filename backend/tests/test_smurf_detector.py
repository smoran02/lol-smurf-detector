"""Unit tests for smurf detection algorithm."""

import pytest

from app.algorithms.smurf_detector import (
    SmurfClassification,
    SmurfDetector,
)


@pytest.fixture
def detector():
    """Create a fresh detector instance."""
    return SmurfDetector()


class TestSmurfDetector:
    """Tests for SmurfDetector class."""

    def test_insufficient_games_returns_unknown(self, detector):
        """Test that too few games returns UNKNOWN classification."""
        stats = {"games_analyzed": 3}

        result = detector.analyze(
            aggregate_stats=stats,
            summoner_level=30,
            tier="SILVER",
            rank="II",
            ranked_wins=10,
            ranked_losses=5,
        )

        assert result.classification == SmurfClassification.UNKNOWN
        assert result.total_score == 0
        assert result.confidence == "low"

    def test_high_winrate_high_score(self, detector):
        """Test that high win rate contributes to high score."""
        stats = {
            "games_analyzed": 5,
            "winrate": 75.0,
            "avg_kda": 2.5,
            "avg_cs_per_min": 6.0,
            "unique_champions": 1,  # One-trick = high champion pool score
            "games_per_day": 5,
        }

        result = detector.analyze(
            aggregate_stats=stats,
            summoner_level=35,
            tier="GOLD",
            rank="II",
            ranked_wins=45,
            ranked_losses=15,
        )

        # High winrate should give high score
        assert result.indicator_scores.winrate == 100
        assert result.indicator_scores.champion_pool == 100
        assert result.total_score > 50

    def test_normal_player_low_score(self, detector):
        """Test that normal stats give low smurf score."""
        stats = {
            "games_analyzed": 20,
            "winrate": 52.0,
            "avg_kda": 2.2,
            "avg_cs_per_min": 5.8,
            "unique_champions": 10,
            "games_per_day": 2,
        }

        result = detector.analyze(
            aggregate_stats=stats,
            summoner_level=120,
            tier="GOLD",
            rank="III",
            ranked_wins=200,
            ranked_losses=185,
        )

        assert result.classification == SmurfClassification.UNLIKELY
        assert result.total_score < 50

    def test_low_level_high_rank_suspicious(self, detector):
        """Test that low level with high rank is suspicious."""
        stats = {
            "games_analyzed": 20,
            "winrate": 65.0,
            "avg_kda": 3.5,
            "avg_cs_per_min": 7.5,
            "unique_champions": 2,
            "games_per_day": 6,
        }

        result = detector.analyze(
            aggregate_stats=stats,
            summoner_level=32,  # Very low for Diamond
            tier="DIAMOND",
            rank="IV",
            ranked_wins=50,
            ranked_losses=20,
        )

        # Low level for Diamond should trigger level_performance indicator
        assert result.indicator_scores.level_performance > 60
        assert result.classification in [
            SmurfClassification.LIKELY_SMURF,
            SmurfClassification.POSSIBLE_SMURF,
        ]

    def test_one_trick_champion_pool(self, detector):
        """Test that one-tricking is detected."""
        stats = {
            "games_analyzed": 20,
            "winrate": 55.0,
            "avg_kda": 2.5,
            "avg_cs_per_min": 6.0,
            "unique_champions": 1,  # Only 1 champion in 20 games
            "games_per_day": 2,
        }

        result = detector.analyze(
            aggregate_stats=stats,
            summoner_level=50,
            tier="SILVER",
            rank="I",
            ranked_wins=100,
            ranked_losses=100,
        )

        # Very low champion diversity should score high
        assert result.indicator_scores.champion_pool == 100

    def test_high_cs_above_tier(self, detector):
        """Test that CS above tier benchmark is detected."""
        stats = {
            "games_analyzed": 20,
            "winrate": 55.0,
            "avg_kda": 2.0,
            "avg_cs_per_min": 8.5,  # Very high for Silver
            "unique_champions": 8,
            "games_per_day": 2,
        }

        result = detector.analyze(
            aggregate_stats=stats,
            summoner_level=80,
            tier="SILVER",
            rank="II",
            ranked_wins=100,
            ranked_losses=90,
        )

        # CS way above Silver benchmark (5.5) should score high
        assert result.indicator_scores.cs_per_min >= 80

    def test_likely_smurf_classification(self, detector):
        """Test that high score gives LIKELY_SMURF classification."""
        stats = {
            "games_analyzed": 20,
            "winrate": 80.0,
            "avg_kda": 5.0,
            "avg_cs_per_min": 9.0,
            "unique_champions": 2,
            "games_per_day": 8,
        }

        result = detector.analyze(
            aggregate_stats=stats,
            summoner_level=31,
            tier="PLATINUM",
            rank="II",
            ranked_wins=30,
            ranked_losses=5,
        )

        assert result.classification == SmurfClassification.LIKELY_SMURF
        assert result.total_score >= 70

    def test_possible_smurf_classification(self, detector):
        """Test mid-range score gives POSSIBLE_SMURF."""
        stats = {
            "games_analyzed": 20,
            "winrate": 68.0,  # Higher winrate
            "avg_kda": 3.5,
            "avg_cs_per_min": 7.5,  # Higher CS
            "unique_champions": 3,  # Lower diversity
            "games_per_day": 5,
        }

        result = detector.analyze(
            aggregate_stats=stats,
            summoner_level=45,  # Lower level for Gold
            tier="GOLD",
            rank="I",
            ranked_wins=60,
            ranked_losses=30,
        )

        assert result.classification == SmurfClassification.POSSIBLE_SMURF
        assert 50 <= result.total_score < 70

    def test_confidence_levels(self, detector):
        """Test confidence is based on games analyzed."""
        base_stats = {
            "winrate": 55.0,
            "avg_kda": 2.5,
            "avg_cs_per_min": 6.0,
            "unique_champions": 5,
            "games_per_day": 2,
        }

        # 5-9 games = low confidence
        stats_low = {**base_stats, "games_analyzed": 7}
        result_low = detector.analyze(
            stats_low, 100, "SILVER", "II", 100, 100
        )
        assert result_low.confidence == "low"

        # 10-19 games = medium confidence
        stats_med = {**base_stats, "games_analyzed": 15}
        result_med = detector.analyze(
            stats_med, 100, "SILVER", "II", 100, 100
        )
        assert result_med.confidence == "medium"

        # 20+ games = high confidence
        stats_high = {**base_stats, "games_analyzed": 25}
        result_high = detector.analyze(
            stats_high, 100, "SILVER", "II", 100, 100
        )
        assert result_high.confidence == "high"

    def test_unranked_player(self, detector):
        """Test analysis works for unranked players."""
        stats = {
            "games_analyzed": 20,
            "winrate": 55.0,
            "avg_kda": 2.0,
            "avg_cs_per_min": 5.5,
            "unique_champions": 8,
            "games_per_day": 2,
        }

        result = detector.analyze(
            aggregate_stats=stats,
            summoner_level=50,
            tier=None,
            rank=None,
            ranked_wins=None,
            ranked_losses=None,
        )

        # Should still return a result
        assert result.classification != SmurfClassification.UNKNOWN
        assert result.games_analyzed == 20


class TestIndividualScorers:
    """Tests for individual scoring methods."""

    def test_winrate_scoring(self, detector):
        """Test winrate scoring thresholds."""
        assert detector._score_winrate(80) == 100
        assert detector._score_winrate(72) == 85
        assert detector._score_winrate(67) == 70
        assert detector._score_winrate(62) == 50
        assert detector._score_winrate(57) == 30
        assert detector._score_winrate(50) == 0

    def test_level_performance_scoring(self, detector):
        """Test level vs performance scoring."""
        # Level 30 in Diamond (expected 160) = ratio 0.19
        assert detector._score_level_performance(30, "DIAMOND") == 100

        # Level 80 in Gold (expected 80) = ratio 1.0
        assert detector._score_level_performance(80, "GOLD") == 20

        # Unknown tier
        assert detector._score_level_performance(50, None) == 0

    def test_game_frequency_scoring(self, detector):
        """Test game frequency scoring."""
        assert detector._score_game_frequency(12) == 100
        assert detector._score_game_frequency(9) == 80
        assert detector._score_game_frequency(7) == 60
        assert detector._score_game_frequency(5) == 40
        assert detector._score_game_frequency(3.5) == 20
        assert detector._score_game_frequency(2) == 0
