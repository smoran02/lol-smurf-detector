"""Unit tests for Riot API client."""

import pytest
from httpx import Response

from app.core.exceptions import RateLimitExceeded, RiotAPIError, SummonerNotFound
from app.services.riot_api import RiotAPIClient


@pytest.fixture
def riot_client():
    """Create a fresh Riot API client for each test."""
    return RiotAPIClient()


@pytest.mark.asyncio
async def test_get_account_by_riot_id_success(httpx_mock, riot_client, mock_riot_account):
    """Test successful account lookup by Riot ID."""
    httpx_mock.add_response(
        url="https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/TestPlayer/NA1",
        json=mock_riot_account,
    )

    result = await riot_client.get_account_by_riot_id("TestPlayer", "NA1")

    assert result.puuid == "test-puuid-12345"
    assert result.game_name == "TestPlayer"
    assert result.tag_line == "NA1"


@pytest.mark.asyncio
async def test_get_account_by_riot_id_not_found(httpx_mock, riot_client):
    """Test account lookup returns 404."""
    httpx_mock.add_response(
        url="https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/UnknownPlayer/NA1",
        status_code=404,
    )

    with pytest.raises(SummonerNotFound):
        await riot_client.get_account_by_riot_id("UnknownPlayer", "NA1")


@pytest.mark.asyncio
async def test_get_summoner_by_puuid_success(httpx_mock, riot_client, mock_summoner_data):
    """Test successful summoner lookup by PUUID."""
    httpx_mock.add_response(
        url="https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/test-puuid-12345",
        json=mock_summoner_data,
    )

    result = await riot_client.get_summoner_by_puuid("test-puuid-12345")

    assert result.id == "encrypted-summoner-id"
    assert result.puuid == "test-puuid-12345"
    assert result.summoner_level == 150
    assert result.profile_icon_id == 4567


@pytest.mark.asyncio
async def test_get_ranked_entries_success(httpx_mock, riot_client, mock_ranked_entries):
    """Test successful ranked entries lookup."""
    httpx_mock.add_response(
        url="https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/encrypted-summoner-id",
        json=mock_ranked_entries,
    )

    result = await riot_client.get_ranked_entries("encrypted-summoner-id")

    assert len(result) == 2
    assert result[0].queue_type == "RANKED_SOLO_5x5"
    assert result[0].tier == "GOLD"
    assert result[0].rank == "II"
    assert result[1].queue_type == "RANKED_FLEX_SR"


@pytest.mark.asyncio
async def test_get_live_game_success(httpx_mock, riot_client, mock_live_game):
    """Test successful live game lookup."""
    httpx_mock.add_response(
        url="https://na1.api.riotgames.com/lol/spectator/v5/active-games/by-summoner/test-puuid-1",
        json=mock_live_game,
    )

    result = await riot_client.get_live_game("test-puuid-1")

    assert result.game_id == 1234567890
    assert result.game_mode == "CLASSIC"
    assert len(result.participants) == 2
    assert result.participants[0].puuid == "test-puuid-1"


@pytest.mark.asyncio
async def test_get_live_game_not_in_game(httpx_mock, riot_client):
    """Test live game lookup when player is not in game."""
    httpx_mock.add_response(
        url="https://na1.api.riotgames.com/lol/spectator/v5/active-games/by-summoner/test-puuid-1",
        status_code=404,
    )

    with pytest.raises(SummonerNotFound):
        await riot_client.get_live_game("test-puuid-1")


@pytest.mark.asyncio
async def test_get_match_ids_success(httpx_mock, riot_client, mock_match_ids):
    """Test successful match IDs lookup."""
    httpx_mock.add_response(
        url="https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/test-puuid-1/ids?start=0&count=20",
        json=mock_match_ids,
    )

    result = await riot_client.get_match_ids("test-puuid-1")

    assert len(result) == 3
    assert result[0] == "NA1_1234567890"


@pytest.mark.asyncio
async def test_get_match_ids_with_queue_filter(httpx_mock, riot_client, mock_match_ids):
    """Test match IDs lookup with queue filter."""
    httpx_mock.add_response(
        url="https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/test-puuid-1/ids?start=0&count=20&queue=420",
        json=mock_match_ids,
    )

    result = await riot_client.get_match_ids("test-puuid-1", queue=420)

    assert len(result) == 3


@pytest.mark.asyncio
async def test_get_match_success(httpx_mock, riot_client, mock_match_data):
    """Test successful match lookup."""
    httpx_mock.add_response(
        url="https://americas.api.riotgames.com/lol/match/v5/matches/NA1_1234567890",
        json=mock_match_data,
    )

    result = await riot_client.get_match("NA1_1234567890")

    assert result.info.game_id == 1234567890
    assert result.info.game_mode == "CLASSIC"
    assert len(result.info.participants) == 1
    assert result.info.participants[0].kills == 10


@pytest.mark.asyncio
async def test_rate_limit_exceeded(httpx_mock, riot_client):
    """Test handling of rate limit exceeded response."""
    httpx_mock.add_response(
        url="https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/TestPlayer/NA1",
        status_code=429,
        headers={"Retry-After": "120"},
    )

    with pytest.raises(RateLimitExceeded) as exc_info:
        await riot_client.get_account_by_riot_id("TestPlayer", "NA1")

    assert exc_info.value.status_code == 429


@pytest.mark.asyncio
async def test_api_error(httpx_mock, riot_client):
    """Test handling of generic API error."""
    httpx_mock.add_response(
        url="https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/TestPlayer/NA1",
        status_code=500,
        text="Internal Server Error",
    )

    with pytest.raises(RiotAPIError) as exc_info:
        await riot_client.get_account_by_riot_id("TestPlayer", "NA1")

    assert exc_info.value.status_code == 500


@pytest.mark.asyncio
async def test_client_closes_properly(riot_client):
    """Test that the client can be closed without error."""
    # Initialize the client
    client = await riot_client._get_client()
    assert client is not None

    # Close the client
    await riot_client.close()

    # Closing again should not raise
    await riot_client.close()
