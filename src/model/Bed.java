package model;

public class Bed {
    private String bedCode;
    private boolean isOccupied;
    private String allocatedStudentId;

    public Bed(String bedCode) {
        this.bedCode = bedCode;
        this.isOccupied = false;
        this.allocatedStudentId = null;
    }

    public String getBedCode() {
        return bedCode;
    }

    public void setBedCode(String bedCode) {
        this.bedCode = bedCode;
    }

    public boolean isOccupied() {
        return isOccupied;
    }

    public void setOccupied(boolean occupied) {
        isOccupied = occupied;
    }

    public String getAllocatedStudentId() {
        return allocatedStudentId;
    }

    public void setAllocatedStudentId(String allocatedStudentId) {
        this.allocatedStudentId = allocatedStudentId;
    }

    public void allocate(String studentId) {
        this.isOccupied = true;
        this.allocatedStudentId = studentId;
    }

    public void deallocate() {
        this.isOccupied = false;
        this.allocatedStudentId = null;
    }
}
