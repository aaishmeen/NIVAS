package server.exception;

/**
 * Thrown when credentials fail or authentication is missing (HTTP 401).
 */
public class AuthenticationException extends ApiException {
    public AuthenticationException(String message) {
        super(401, "AUTHENTICATION_REQUIRED", message);
    }
}
