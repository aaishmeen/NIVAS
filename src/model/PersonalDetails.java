package model;

public class PersonalDetails {
    private String fullName;
    private String phone;
    private String gender;
    private String branch;
    private int year;
    private String address;
    private String guardianName;
    private String guardianPhone;

    public PersonalDetails() {
    }

    public PersonalDetails(String fullName, String phone, String gender, String branch, int year,
                           String address, String guardianName, String guardianPhone) {
        this.fullName = fullName;
        this.phone = phone;
        this.gender = gender;
        this.branch = branch;
        this.year = year;
        this.address = address;
        this.guardianName = guardianName;
        this.guardianPhone = guardianPhone;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getGuardianName() {
        return guardianName;
    }

    public void setGuardianName(String guardianName) {
        this.guardianName = guardianName;
    }

    public String getGuardianPhone() {
        return guardianPhone;
    }

    public void setGuardianPhone(String guardianPhone) {
        this.guardianPhone = guardianPhone;
    }

    public void displayDetails() {
        System.out.println("Full Name      : " + fullName);
        System.out.println("Phone          : " + phone);
        System.out.println("Gender         : " + gender);
        System.out.println("Branch & Year  : " + branch + " (Year " + year + ")");
        System.out.println("Address        : " + address);
        System.out.println("Guardian Name  : " + guardianName);
        System.out.println("Guardian Phone : " + guardianPhone);
    }
}
