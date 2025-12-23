"""Rate limiter for Riot API requests using token bucket algorithm."""

import asyncio
import time
from dataclasses import dataclass


@dataclass
class RateBucket:
    """A single rate limit bucket."""

    max_tokens: int
    refill_rate: float  # tokens per second
    tokens: float
    last_refill: float


class RateLimiter:
    """Token bucket rate limiter for Riot API.

    Handles both per-second and per-2-minute rate limits.
    """

    def __init__(self, per_second: int = 20, per_2min: int = 100):
        """Initialize rate limiter with Riot API limits.

        Args:
            per_second: Max requests per second (default: 20 for dev key)
            per_2min: Max requests per 2 minutes (default: 100 for dev key)
        """
        now = time.monotonic()
        self._buckets = {
            "second": RateBucket(
                max_tokens=per_second,
                refill_rate=per_second,  # Refill all tokens per second
                tokens=per_second,
                last_refill=now,
            ),
            "2min": RateBucket(
                max_tokens=per_2min,
                refill_rate=per_2min / 120,  # Refill over 2 minutes
                tokens=per_2min,
                last_refill=now,
            ),
        }
        self._lock = asyncio.Lock()

    def _refill_bucket(self, bucket: RateBucket) -> None:
        """Refill tokens based on time elapsed."""
        now = time.monotonic()
        elapsed = now - bucket.last_refill
        tokens_to_add = elapsed * bucket.refill_rate
        bucket.tokens = min(bucket.max_tokens, bucket.tokens + tokens_to_add)
        bucket.last_refill = now

    async def acquire(self) -> float:
        """Acquire a token, waiting if necessary.

        Returns:
            Wait time in seconds (0 if no wait was needed)
        """
        async with self._lock:
            wait_time = 0.0

            for bucket in self._buckets.values():
                self._refill_bucket(bucket)

                if bucket.tokens < 1:
                    # Calculate wait time until we have a token
                    needed_time = (1 - bucket.tokens) / bucket.refill_rate
                    wait_time = max(wait_time, needed_time)

            if wait_time > 0:
                await asyncio.sleep(wait_time)
                # Refill after waiting
                for bucket in self._buckets.values():
                    self._refill_bucket(bucket)

            # Consume a token from each bucket
            for bucket in self._buckets.values():
                bucket.tokens -= 1

            return wait_time

    def get_available_tokens(self) -> dict[str, float]:
        """Get current available tokens in each bucket."""
        for bucket in self._buckets.values():
            self._refill_bucket(bucket)
        return {name: bucket.tokens for name, bucket in self._buckets.items()}


# Global rate limiter instance
rate_limiter = RateLimiter()
