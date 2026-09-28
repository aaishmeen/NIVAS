package model;

public class Admin extends User {
    private String department;

    public Admin(String id, String name, String email, String password, String department) {
        super(id, name, email, password, "ADMIN");
        this.department = department;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    @Override
    public void displayProfile() {
        System.out.println("========== ADMIN PROFILE ==========");
        super.displayProfile();
        System.out.println("Department : " + department);
        System.out.println("===================================");
    }
}
