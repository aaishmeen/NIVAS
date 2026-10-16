package server.exception;

/**
 * Thrown when a requested resource (student, room, ticket, announcement) cannot be found (HTTP 404).
 */
public class ResourceNotFoundException extends ApiException {
    public ResourceNotFoundException(String resourceName, String identifier) {
        super(404, "RESOURCE_NOT_FOUND", resourceName + " with identifier '" + identifier + "' was not found");
    }

    public ResourceNotFoundException(String message) {
        super(404, "RESOURCE_NOT_FOUND", message);
    }
}
