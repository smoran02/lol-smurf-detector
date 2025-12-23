"""Pydantic schemas for match data."""

from pydantic import BaseModel, Field


class LiveGameParticipant(BaseModel):
    """Participant in a live game."""

    puuid: str
    summoner_id: str = Field(alias="summonerId")
    riot_id_name: str = Field(alias="riotId", default="")
    summoner_name: str = Field(alias="summonerName", default="")
    champion_id: int = Field(alias="championId")
    team_id: int = Field(alias="teamId")  # 100 = blue, 200 = red
    spell1_id: int = Field(alias="spell1Id")
    spell2_id: int = Field(alias="spell2Id")

    class Config:
        populate_by_name = True


class LiveGameBan(BaseModel):
    """A banned champion in a live game."""

    champion_id: int = Field(alias="championId")
    team_id: int = Field(alias="teamId")
    pick_turn: int = Field(alias="pickTurn")

    class Config:
        populate_by_name = True


class LiveGameResponse(BaseModel):
    """Live game data from Spectator API."""

    game_id: int = Field(alias="gameId")
    game_type: str = Field(alias="gameType")
    game_start_time: int = Field(alias="gameStartTime")
    map_id: int = Field(alias="mapId")
    game_length: int = Field(alias="gameLength")
    game_mode: str = Field(alias="gameMode")
    game_queue_config_id: int = Field(alias="gameQueueConfigId")
    participants: list[LiveGameParticipant]
    banned_champions: list[LiveGameBan] = Field(alias="bannedChampions", default=[])

    class Config:
        populate_by_name = True


class MatchParticipant(BaseModel):
    """Participant stats from a completed match."""

    puuid: str
    summoner_name: str = Field(alias="summonerName")
    riot_id_game_name: str = Field(alias="riotIdGameName", default="")
    riot_id_tagline: str = Field(alias="riotIdTagline", default="")
    champion_id: int = Field(alias="championId")
    champion_name: str = Field(alias="championName")
    team_id: int = Field(alias="teamId")

    # Stats
    kills: int
    deaths: int
    assists: int
    total_minions_killed: int = Field(alias="totalMinionsKilled")
    neutral_minions_killed: int = Field(alias="neutralMinionsKilled")
    gold_earned: int = Field(alias="goldEarned")
    total_damage_dealt_to_champions: int = Field(alias="totalDamageDealtToChampions")
    vision_score: int = Field(alias="visionScore")
    win: bool

    class Config:
        populate_by_name = True


class MatchInfo(BaseModel):
    """Match info from Match API."""

    game_creation: int = Field(alias="gameCreation")
    game_duration: int = Field(alias="gameDuration")
    game_id: int = Field(alias="gameId")
    game_mode: str = Field(alias="gameMode")
    game_type: str = Field(alias="gameType")
    queue_id: int = Field(alias="queueId")
    participants: list[MatchParticipant]

    class Config:
        populate_by_name = True


class MatchResponse(BaseModel):
    """Full match response from Match API."""

    metadata: dict
    info: MatchInfo

    class Config:
        populate_by_name = True
