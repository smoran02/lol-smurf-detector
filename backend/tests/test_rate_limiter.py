"""Unit tests for rate limiter."""

import asyncio
import time

import pytest

from app.core.rate_limiter import RateLimiter


@pytest.mark.asyncio
async def test_rate_limiter_initial_tokens():
    """Test that rate limiter starts with full tokens."""
    limiter = RateLimiter(per_second=20, per_2min=100)
    tokens = limiter.get_available_tokens()

    assert tokens["second"] == 20
    assert tokens["2min"] == 100


@pytest.mark.asyncio
async def test_rate_limiter_acquire_consumes_token():
    """Test that acquiring a token reduces available tokens."""
    limiter = RateLimiter(per_second=20, per_2min=100)

    await limiter.acquire()
    tokens = limiter.get_available_tokens()

    assert tokens["second"] == 19
    assert tokens["2min"] == 99


@pytest.mark.asyncio
async def test_rate_limiter_multiple_acquires():
    """Test multiple token acquisitions."""
    limiter = RateLimiter(per_second=5, per_2min=10)

    for _ in range(3):
        await limiter.acquire()

    tokens = limiter.get_available_tokens()
    assert tokens["second"] == 2
    assert tokens["2min"] == 7


@pytest.mark.asyncio
async def test_rate_limiter_waits_when_empty():
    """Test that limiter waits when tokens are exhausted."""
    # Create a limiter with very few tokens
    limiter = RateLimiter(per_second=2, per_2min=100)

    # Exhaust the per-second bucket
    await limiter.acquire()
    await limiter.acquire()

    # Next acquire should wait
    start = time.monotonic()
    wait_time = await limiter.acquire()
    elapsed = time.monotonic() - start

    # Should have waited approximately for token refill
    assert wait_time > 0
    assert elapsed > 0.1  # At least some wait time


@pytest.mark.asyncio
async def test_rate_limiter_refills_over_time():
    """Test that tokens refill over time."""
    limiter = RateLimiter(per_second=10, per_2min=100)

    # Use some tokens
    await limiter.acquire()
    await limiter.acquire()

    # Wait a bit for refill
    await asyncio.sleep(0.3)

    tokens = limiter.get_available_tokens()
    # Should have refilled some tokens
    assert tokens["second"] > 8


@pytest.mark.asyncio
async def test_rate_limiter_concurrent_acquires():
    """Test that concurrent acquires are handled correctly."""
    limiter = RateLimiter(per_second=10, per_2min=100)

    # Acquire multiple tokens concurrently
    tasks = [limiter.acquire() for _ in range(5)]
    await asyncio.gather(*tasks)

    tokens = limiter.get_available_tokens()
    # Should have consumed 5 tokens from each bucket
    assert tokens["second"] <= 5
    assert tokens["2min"] <= 95
