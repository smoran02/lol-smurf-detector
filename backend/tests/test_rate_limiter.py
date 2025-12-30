"""Unit tests for rate limiter."""

import asyncio
import time

import pytest

from app.core.rate_limiter import RateLimiter


@pytest.mark.asyncio
async def test_rate_limiter_first_request_no_wait():
    """Test that first request has no wait time."""
    limiter = RateLimiter()

    wait_time = await limiter.acquire()

    # First request should not wait
    assert wait_time == 0


@pytest.mark.asyncio
async def test_rate_limiter_adds_delay_between_requests():
    """Test that subsequent requests have delays."""
    limiter = RateLimiter()

    # First request - no wait
    await limiter.acquire()

    # Immediate second request should wait
    wait_time = await limiter.acquire()

    # Should have waited approximately min_interval (50ms)
    assert wait_time > 0
    assert wait_time <= 0.1  # Should be around 50ms


@pytest.mark.asyncio
async def test_rate_limiter_no_wait_after_interval():
    """Test that no wait needed after interval has passed."""
    limiter = RateLimiter()

    await limiter.acquire()

    # Wait longer than min_interval
    await asyncio.sleep(0.1)

    wait_time = await limiter.acquire()

    # Should not need to wait since interval passed
    assert wait_time == 0


@pytest.mark.asyncio
async def test_rate_limiter_concurrent_requests():
    """Test that concurrent requests are serialized."""
    limiter = RateLimiter()

    start = time.monotonic()

    # Acquire multiple times concurrently
    tasks = [limiter.acquire() for _ in range(5)]
    wait_times = await asyncio.gather(*tasks)

    elapsed = time.monotonic() - start

    # Total time should be at least 4 * min_interval (first request is instant)
    # 4 * 0.05 = 0.2 seconds minimum
    assert elapsed >= 0.15  # Allow some tolerance

    # At least some requests should have waited
    assert sum(wait_times) > 0


@pytest.mark.asyncio
async def test_rate_limiter_set_backoff():
    """Test that set_backoff is a no-op but doesn't error."""
    limiter = RateLimiter()

    # Should not raise
    limiter.set_backoff(120)

    # Should still work normally
    wait_time = await limiter.acquire()
    assert wait_time == 0
