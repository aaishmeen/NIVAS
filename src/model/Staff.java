package model;

public class Staff extends User {
    private String designation;
    private String assignedBlock;

    public Staff(String id, String name, String email, String password, String designation, String assignedBlock) {
        super(id, name, email, password, "STAFF");
        this.designation = designation;
        this.assignedBlock = assignedBlock;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getAssignedBlock() {
        return assignedBlock;
    }

    public void setAssignedBlock(String assignedBlock) {
        this.assignedBlock = assignedBlock;
    }

    @Override
    public void displayProfile() {
        System.out.println("========== STAFF / WARDEN PROFILE ==========");
        super.displayProfile();
        System.out.println("Designation    : " + designation);
        System.out.println("Assigned Block : " + assignedBlock);
        System.out.println("============================================");
    }
}
