package model;

public class AssistanceRequest {
    private String requestId;
    private String studentId;
    private String assistanceType;
    private String description;
    private String status;
    private String assignedStaffId;
    private String timestamp;

    public AssistanceRequest(String requestId, String studentId, String assistanceType, String description, String timestamp) {
        this.requestId = requestId;
        this.studentId = studentId;
        this.assistanceType = assistanceType;
        this.description = description;
        this.status = "REQUESTED";
        this.assignedStaffId = "Unassigned";
        this.timestamp = timestamp;
    }

    public String getRequestId() {
        return requestId;
    }

    public String getStudentId() {
        return studentId;
    }

    public String getAssistanceType() {
        return assistanceType;
    }

    public String getDescription() {
        return description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAssignedStaffId() {
        return assignedStaffId;
    }

    public void setAssignedStaffId(String assignedStaffId) {
        this.assignedStaffId = assignedStaffId;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void displayRequest() {
        System.out.println("[" + requestId + "] Type: " + assistanceType + " | Status: " + status +
                " | Assigned: " + assignedStaffId + " | Note: " + description);
    }
}
