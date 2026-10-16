package server.exception;

/**
 * Thrown when a client exceeds allowed request thresholds within a time window (HTTP 429).
 */
public class RateLimitException extends ApiException {
    private final int retryAfterSeconds;
    private final String clientIp;

    public RateLimitException(String clientIp, int retryAfterSeconds) {
        super(429, "RATE_LIMIT_EXCEEDED", "Too many requests from IP " + clientIp + ". Please retry after " + retryAfterSeconds + " seconds.");
        this.clientIp = clientIp;
        this.retryAfterSeconds = retryAfterSeconds;
    }

    public int getRetryAfterSeconds() {
        return retryAfterSeconds;
    }

    public String getClientIp() {
        return clientIp;
    }
}
