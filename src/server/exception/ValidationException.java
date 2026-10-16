package server.exception;

/**
 * Thrown when incoming request body, query parameter, or payload fails validation checks (HTTP 400).
 */
public class ValidationException extends ApiException {
    public ValidationException(String message) {
        super(400, "VALIDATION_ERROR", message);
    }

    public ValidationException(String field, String message) {
        super(400, "VALIDATION_ERROR", "Field '" + field + "': " + message);
    }
}
