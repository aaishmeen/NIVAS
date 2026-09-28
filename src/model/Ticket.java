package model;

public class Ticket {
    private String ticketId;
    private String studentId;
    private String category;
    private String description;
    private String status;
    private String assignedToStaffId;
    private String createdDate;
    private String resolutionNotes;

    public Ticket(String ticketId, String studentId, String category, String description, String createdDate) {
        this.ticketId = ticketId;
        this.studentId = studentId;
        this.category = category;
        this.description = description;
        this.status = "SUBMITTED";
        this.assignedToStaffId = "Unassigned";
        this.createdDate = createdDate;
        this.resolutionNotes = "None";
    }

    public String getTicketId() {
        return ticketId;
    }

    public String getStudentId() {
        return studentId;
    }

    public String getCategory() {
        return category;
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

    public String getAssignedToStaffId() {
        return assignedToStaffId;
    }

    public void setAssignedToStaffId(String assignedToStaffId) {
        this.assignedToStaffId = assignedToStaffId;
    }

    public String getCreatedDate() {
        return createdDate;
    }

    public String getResolutionNotes() {
        return resolutionNotes;
    }

    public void setResolutionNotes(String resolutionNotes) {
        this.resolutionNotes = resolutionNotes;
    }

    public void displayTicket() {
        System.out.println("[" + ticketId + "] Cat: " + category + " | Status: " + status +
                " | Assigned: " + assignedToStaffId + " | Issue: " + description);
    }
}
