"""Pytest fixtures and configuration."""

import pytest


@pytest.fixture
def mock_riot_account():
    """Mock Riot Account API response."""
    return {
        "puuid": "test-puuid-12345",
        "gameName": "TestPlayer",
        "tagLine": "NA1",
    }


@pytest.fixture
def mock_summoner_data():
    """Mock Summoner API response."""
    return {
        "id": "encrypted-summoner-id",
        "accountId": "encrypted-account-id",
        "puuid": "test-puuid-12345",
        "profileIconId": 4567,
        "summonerLevel": 150,
    }


@pytest.fixture
def mock_ranked_entries():
    """Mock League API response."""
    return [
        {
            "queueType": "RANKED_SOLO_5x5",
            "tier": "GOLD",
            "rank": "II",
            "leaguePoints": 75,
            "wins": 100,
            "losses": 90,
        },
        {
            "queueType": "RANKED_FLEX_SR",
            "tier": "SILVER",
            "rank": "I",
            "leaguePoints": 50,
            "wins": 30,
            "losses": 25,
        },
    ]


@pytest.fixture
def mock_live_game():
    """Mock Spectator API response."""
    return {
        "gameId": 1234567890,
        "gameType": "MATCHED_GAME",
        "gameStartTime": 1703299200000,
        "mapId": 11,
        "gameLength": 600,
        "gameMode": "CLASSIC",
        "gameQueueConfigId": 420,
        "participants": [
            {
                "puuid": "test-puuid-1",
                "summonerId": "summoner-1",
                "summonerName": "Player1",
                "riotId": "Player1#NA1",
                "championId": 1,
                "teamId": 100,
                "spell1Id": 4,
                "spell2Id": 12,
            },
            {
                "puuid": "test-puuid-2",
                "summonerId": "summoner-2",
                "summonerName": "Player2",
                "riotId": "Player2#NA1",
                "championId": 2,
                "teamId": 200,
                "spell1Id": 4,
                "spell2Id": 14,
            },
        ],
        "bannedChampions": [],
    }


@pytest.fixture
def mock_match_ids():
    """Mock Match IDs API response."""
    return [
        "NA1_1234567890",
        "NA1_1234567891",
        "NA1_1234567892",
    ]


@pytest.fixture
def mock_match_data():
    """Mock Match API response."""
    return {
        "metadata": {
            "matchId": "NA1_1234567890",
            "participants": ["test-puuid-1", "test-puuid-2"],
        },
        "info": {
            "gameCreation": 1703299200000,
            "gameDuration": 1800,
            "gameId": 1234567890,
            "gameMode": "CLASSIC",
            "gameType": "MATCHED_GAME",
            "queueId": 420,
            "participants": [
                {
                    "puuid": "test-puuid-1",
                    "summonerName": "Player1",
                    "riotIdGameName": "Player1",
                    "riotIdTagline": "NA1",
                    "championId": 1,
                    "championName": "Annie",
                    "teamId": 100,
                    "kills": 10,
                    "deaths": 3,
                    "assists": 8,
                    "totalMinionsKilled": 180,
                    "neutralMinionsKilled": 20,
                    "goldEarned": 15000,
                    "totalDamageDealtToChampions": 25000,
                    "visionScore": 35,
                    "win": True,
                },
            ],
        },
    }
