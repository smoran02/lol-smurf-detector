"""Pydantic schemas for summoner data."""

from datetime import datetime

from pydantic import BaseModel, Field


class RiotAccount(BaseModel):
    """Response from Riot Account API."""

    puuid: str
    game_name: str = Field(alias="gameName")
    tag_line: str = Field(alias="tagLine")

    class Config:
        populate_by_name = True


class SummonerData(BaseModel):
    """Response from Summoner API."""

    puuid: str
    id: str  # Encrypted summoner ID (required for ranked lookups)
    profile_icon_id: int = Field(alias="profileIconId")
    summoner_level: int = Field(alias="summonerLevel")
    account_id: str | None = Field(default=None, alias="accountId")

    class Config:
        populate_by_name = True


class RankedEntry(BaseModel):
    """Single ranked queue entry."""

    queue_type: str = Field(alias="queueType")
    tier: str
    rank: str
    league_points: int = Field(alias="leaguePoints")
    wins: int
    losses: int

    class Config:
        populate_by_name = True


class SummonerResponse(BaseModel):
    """Full summoner response to client."""

    puuid: str
    summoner_id: str | None
    riot_id_name: str
    riot_id_tag: str
    summoner_level: int
    profile_icon_id: int

    # Ranked data
    solo_tier: str | None = None
    solo_rank: str | None = None
    solo_lp: int | None = None
    solo_wins: int | None = None
    solo_losses: int | None = None

    flex_tier: str | None = None
    flex_rank: str | None = None
    flex_lp: int | None = None
    flex_wins: int | None = None
    flex_losses: int | None = None

    # Timestamps
    updated_at: datetime | None = None

    class Config:
        from_attributes = True
