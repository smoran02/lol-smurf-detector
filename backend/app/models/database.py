"""SQLAlchemy database models."""

from enum import Enum as PyEnum

from sqlalchemy import (
    BigInteger,
    Column,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Index,
    Integer,
    String,
    func,
)
from sqlalchemy.orm import DeclarativeBase, relationship


class Base(DeclarativeBase):
    """Base class for all models."""

    pass


class SmurfClassification(str, PyEnum):
    """Smurf detection classification levels."""

    LIKELY_SMURF = "LIKELY_SMURF"
    POSSIBLE_SMURF = "POSSIBLE_SMURF"
    UNLIKELY = "UNLIKELY"
    UNKNOWN = "UNKNOWN"


class Summoner(Base):
    """Cached summoner data from Riot API."""

    __tablename__ = "summoners"

    id = Column(Integer, primary_key=True, autoincrement=True)
    puuid = Column(String(78), unique=True, nullable=False, index=True)
    summoner_id = Column(String(63), unique=True, nullable=False)
    riot_id_name = Column(String(96), nullable=False)
    riot_id_tag = Column(String(5), nullable=False)
    summoner_level = Column(Integer, nullable=False)
    profile_icon_id = Column(Integer, nullable=False)

    # Ranked data (nullable - player might be unranked)
    solo_tier = Column(String(20))
    solo_rank = Column(String(5))
    solo_lp = Column(Integer)
    solo_wins = Column(Integer)
    solo_losses = Column(Integer)

    flex_tier = Column(String(20))
    flex_rank = Column(String(5))
    flex_lp = Column(Integer)
    flex_wins = Column(Integer)
    flex_losses = Column(Integer)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    ranked_updated_at = Column(DateTime(timezone=True))

    # Relationships
    match_stats = relationship("PlayerMatchStats", back_populates="summoner")
    analyses = relationship("SmurfAnalysis", back_populates="summoner")

    __table_args__ = (
        Index("ix_summoners_riot_id", "riot_id_name", "riot_id_tag"),
    )


class PlayerMatchStats(Base):
    """Per-player stats from a match."""

    __tablename__ = "player_match_stats"

    id = Column(Integer, primary_key=True, autoincrement=True)
    summoner_id = Column(Integer, ForeignKey("summoners.id"), nullable=False)
    match_id = Column(String(20), nullable=False, index=True)

    # Match metadata
    game_duration_seconds = Column(Integer, nullable=False)
    game_creation = Column(BigInteger, nullable=False)
    queue_id = Column(Integer, nullable=False)
    champion_id = Column(Integer, nullable=False)
    champion_name = Column(String(50), nullable=False)

    # Performance stats
    kills = Column(Integer, nullable=False)
    deaths = Column(Integer, nullable=False)
    assists = Column(Integer, nullable=False)
    total_minions_killed = Column(Integer, nullable=False)
    gold_earned = Column(Integer, nullable=False)
    total_damage_dealt = Column(Integer, nullable=False)
    vision_score = Column(Integer, nullable=False)
    win = Column(Integer, nullable=False)  # 1 for win, 0 for loss

    # Calculated metrics (stored for efficiency)
    kda = Column(Float, nullable=False)
    cs_per_min = Column(Float, nullable=False)
    gold_per_min = Column(Float, nullable=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    summoner = relationship("Summoner", back_populates="match_stats")

    __table_args__ = (
        Index("ix_player_match_stats_summoner_match", "summoner_id", "match_id", unique=True),
    )


class SmurfAnalysis(Base):
    """Smurf analysis results for a summoner."""

    __tablename__ = "smurf_analyses"

    id = Column(Integer, primary_key=True, autoincrement=True)
    summoner_id = Column(Integer, ForeignKey("summoners.id"), nullable=False)

    # Overall result
    total_score = Column(Float, nullable=False)
    classification = Column(Enum(SmurfClassification), nullable=False)
    games_analyzed = Column(Integer, nullable=False)

    # Individual indicator scores (0-100)
    winrate_score = Column(Float)
    level_performance_score = Column(Float)
    champion_pool_score = Column(Float)
    cs_per_min_score = Column(Float)
    kda_score = Column(Float)
    game_frequency_score = Column(Float)
    account_age_ratio_score = Column(Float)

    # Raw metrics used for scoring
    winrate = Column(Float)
    avg_cs_per_min = Column(Float)
    avg_kda = Column(Float)
    unique_champions = Column(Integer)
    games_per_day = Column(Float)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    summoner = relationship("Summoner", back_populates="analyses")

    __table_args__ = (
        Index("ix_smurf_analyses_summoner_created", "summoner_id", "created_at"),
    )


class RateLimitTracker(Base):
    """Track API rate limit usage."""

    __tablename__ = "rate_limit_tracker"

    id = Column(Integer, primary_key=True, autoincrement=True)
    bucket = Column(String(20), nullable=False)  # 'second' or '2min'
    request_count = Column(Integer, nullable=False, default=0)
    window_start = Column(DateTime(timezone=True), nullable=False)

    __table_args__ = (
        Index("ix_rate_limit_bucket", "bucket", unique=True),
    )
