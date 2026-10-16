package server.security;

import server.config.EnvConfig;
import server.exception.RateLimitException;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Thread-safe Sliding Window Rate Limiter.
 * Enforces per-IP request limits with distinct thresholds for general traffic and authentication endpoints.
 */
public class RateLimiter {
    private static final long WINDOW_MS = 60_000L; // 1 minute sliding window

    private final int globalLimit;
    private final int authLimit;
    private final boolean enabled;

    private final Map<String, Deque<Long>> globalIpBuckets = new ConcurrentHashMap<>();
    private final Map<String, Deque<Long>> authIpBuckets = new ConcurrentHashMap<>();
    private long lastCleanupTime = System.currentTimeMillis();

    public static class RateLimitResult {
        public final boolean allowed;
        public final int limit;
        public final int remaining;
        public final long resetSeconds;
        public final int retryAfterSeconds;

        public RateLimitResult(boolean allowed, int limit, int remaining, long resetSeconds, int retryAfterSeconds) {
            this.allowed = allowed;
            this.limit = limit;
            this.remaining = remaining;
            this.resetSeconds = resetSeconds;
            this.retryAfterSeconds = retryAfterSeconds;
        }
    }

    public RateLimiter() {
        this.enabled = EnvConfig.getBoolean("RATE_LIMIT_ENABLED", true);
        this.globalLimit = EnvConfig.getInt("RATE_LIMIT_GLOBAL_PER_MIN", 120);
        this.authLimit = EnvConfig.getInt("RATE_LIMIT_AUTH_PER_MIN", 15);
    }

    /**
     * Checks if the given IP address is allowed to proceed under the current window.
     * Throws RateLimitException if the threshold is exceeded.
     */
    public RateLimitResult checkRateLimit(String clientIp, boolean isAuthEndpoint) {
        if (!enabled || clientIp == null || clientIp.isEmpty()) {
            return new RateLimitResult(true, globalLimit, globalLimit, 60, 0);
        }

        cleanupStaleEntriesIfNeeded();

        int limit = isAuthEndpoint ? authLimit : globalLimit;
        Map<String, Deque<Long>> targetBuckets = isAuthEndpoint ? authIpBuckets : globalIpBuckets;

        long now = System.currentTimeMillis();
        long windowStart = now - WINDOW_MS;

        Deque<Long> timestamps = targetBuckets.computeIfAbsent(clientIp, k -> new ArrayDeque<>());
        synchronized (timestamps) {
            // Remove timestamps older than the sliding window
            while (!timestamps.isEmpty() && timestamps.peekFirst() < windowStart) {
                timestamps.pollFirst();
            }

            int currentCount = timestamps.size();
            long oldestTimestamp = timestamps.isEmpty() ? now : timestamps.peekFirst();
            long resetSeconds = Math.max(1, (oldestTimestamp + WINDOW_MS - now) / 1000);

            if (currentCount >= limit) {
                int retryAfter = (int) Math.max(1, resetSeconds);
                throw new RateLimitException(clientIp, retryAfter);
            }

            timestamps.addLast(now);
            int remaining = Math.max(0, limit - timestamps.size());
            return new RateLimitResult(true, limit, remaining, resetSeconds, 0);
        }
    }

    private void cleanupStaleEntriesIfNeeded() {
        long now = System.currentTimeMillis();
        if (now - lastCleanupTime > 120_000L) { // Every 2 minutes
            lastCleanupTime = now;
            long windowStart = now - WINDOW_MS;
            cleanBucketMap(globalIpBuckets, windowStart);
            cleanBucketMap(authIpBuckets, windowStart);
        }
    }

    private void cleanBucketMap(Map<String, Deque<Long>> map, long windowStart) {
        map.entrySet().removeIf(entry -> {
            Deque<Long> q = entry.getValue();
            synchronized (q) {
                while (!q.isEmpty() && q.peekFirst() < windowStart) {
                    q.pollFirst();
                }
                return q.isEmpty();
            }
        });
    }

    public boolean isEnabled() {
        return enabled;
    }

    public int getGlobalLimit() {
        return globalLimit;
    }

    public int getAuthLimit() {
        return authLimit;
    }
}
