package model;

public class LaundryRequest {
    private String requestId;
    private String studentId;
    private int numberOfClothes;
    private String requestDate;
    private String status;
    private boolean cycleDeducted;

    public LaundryRequest(String requestId, String studentId, int numberOfClothes, String requestDate) {
        this.requestId = requestId;
        this.studentId = studentId;
        this.numberOfClothes = numberOfClothes;
        this.requestDate = requestDate;
        this.status = "REQUESTED";
        this.cycleDeducted = false;
    }

    public String getRequestId() {
        return requestId;
    }

    public String getStudentId() {
        return studentId;
    }

    public int getNumberOfClothes() {
        return numberOfClothes;
    }

    public String getRequestDate() {
        return requestDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isCycleDeducted() {
        return cycleDeducted;
    }

    public void setCycleDeducted(boolean cycleDeducted) {
        this.cycleDeducted = cycleDeducted;
    }

    public void displayRequest() {
        System.out.println("Request ID : " + requestId + " | Clothes: " + numberOfClothes +
                " | Date: " + requestDate + " | Status: " + status);
    }
}
