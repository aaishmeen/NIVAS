package model;

public class HostelPass {
    private String passId;
    private String studentId;
    private String studentName;
    private String roomNumber;
    private String bedCode;
    private String messPlanName;
    private String issueDate;
    private String status;

    public HostelPass(String passId, String studentId, String studentName, String roomNumber,
                      String bedCode, String messPlanName, String issueDate) {
        this.passId = passId;
        this.studentId = studentId;
        this.studentName = studentName;
        this.roomNumber = roomNumber;
        this.bedCode = bedCode;
        this.messPlanName = messPlanName;
        this.issueDate = issueDate;
        this.status = "ACTIVE";
    }

    public String getPassId() {
        return passId;
    }

    public String getStudentId() {
        return studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public String getBedCode() {
        return bedCode;
    }

    public String getMessPlanName() {
        return messPlanName;
    }

    public String getIssueDate() {
        return issueDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void displayPass() {
        System.out.println("========================================");
        System.out.println("                 NIVAS                  ");
        System.out.println("          DIGITAL HOSTEL PASS           ");
        System.out.println("========================================");
        System.out.println("Pass ID      : " + passId);
        System.out.println("Student Name : " + studentName);
        System.out.println("Student ID   : " + studentId);
        System.out.println("Room         : " + roomNumber);
        System.out.println("Bed          : " + bedCode);
        System.out.println("Mess Plan    : " + messPlanName);
        System.out.println("Issue Date   : " + issueDate);
        System.out.println("Status       : " + status);
        System.out.println("----------------------------------------");
        System.out.println("          [ DIGITAL QR CODE ]           ");
        System.out.println("  █▀▀▀▀▀█  ▄█▀ █▄  █▀▀▀▀▀█  ");
        System.out.println("  █ ███ █  █▄▀▀▀▄  █ ███ █  ");
        System.out.println("  █▀▀▀▀▀█  █▀█▀█▀  █▀▀▀▀▀█  ");
        System.out.println("  ▄▄▄▄▄▄▄  █ ▄ █ ▄ ▄▄▄▄▄▄▄  ");
        System.out.println("  █ ▄█▄ █  ▀█▀▀▀▄  █▄ ▀▄ █  ");
        System.out.println("  █▀▀▀▀▀█  █▄▄ ▄█  █▀ █▀▀█  ");
        System.out.println("  Verification Code: " + passId.hashCode());
        System.out.println("========================================");
    }
}
