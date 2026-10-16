package server.exception;

/**
 * Thrown when an operation conflicts with the current state of a resource (e.g. bed already occupied) (HTTP 409).
 */
public class ConflictException extends ApiException {
    public ConflictException(String message) {
        super(409, "CONFLICT_STATE", message);
    }
}
