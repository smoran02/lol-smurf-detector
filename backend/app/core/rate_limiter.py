"""Simple rate limiter - just adds small delays between requests."""

import asyncio
import time


class RateLimiter:
    """Simple rate limiter that just adds a small delay between requests."""

    def __init__(self):
        self._last_request: float = 0
        self._min_interval: float = 0.05  # 50ms between requests (20/sec)
        self._lock = asyncio.Lock()

    def set_backoff(self, seconds: int) -> None:
        """Called when we hit 429 - not used in simple implementation."""
        pass

    async def acquire(self) -> float:
        """Add a small delay between requests to avoid bursting."""
        async with self._lock:
            now = time.monotonic()
            elapsed = now - self._last_request

            if elapsed < self._min_interval:
                wait_time = self._min_interval - elapsed
                await asyncio.sleep(wait_time)
            else:
                wait_time = 0

            self._last_request = time.monotonic()
            return wait_time


# Global rate limiter instance
rate_limiter = RateLimiter()
