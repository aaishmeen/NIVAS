package service;

import model.*;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;

public class OnboardingService {
    private DataStore dataStore;
    private RoomService roomService;

    public OnboardingService(RoomService roomService) {
        this.dataStore = DataStore.getInstance();
        this.roomService = roomService;
    }

    public void submitPersonalDetails(Student student, String fullName, String phone, String gender,
                                      String branch, int year, String address,
                                      String guardianName, String guardianPhone) {
        PersonalDetails pd = student.getPersonalDetails();
        pd.setFullName(fullName);
        pd.setPhone(phone);
        pd.setGender(gender);
        pd.setBranch(branch);
        pd.setYear(year);
        pd.setAddress(address);
        pd.setGuardianName(guardianName);
        pd.setGuardianPhone(guardianPhone);

        student.getOnboardingApp().setPersonalDetailsCompleted(true);
        dataStore.persistStudent(student);
        System.out.println("Personal details updated successfully.");
    }

    public void submitAadhaar(Student student, String mockAadhaarNumber) {
        Document doc = student.getDocument();
        doc.setDocumentNumber(mockAadhaarNumber);
        doc.setSubmitted(true);
        student.getOnboardingApp().setDocumentsSubmitted(true);
        dataStore.persistStudent(student);
        System.out.println("Mock Aadhaar uploaded successfully.");
    }

    public void acceptUndertaking(Student student) {
        student.getDocument().setUndertakingAccepted(true);
        student.getOnboardingApp().setUndertakingAccepted(true);
        dataStore.persistStudent(student);
        System.out.println("Hostel rules & regulations undertaking accepted.");
    }

    public boolean payHostelFee(Student student) {
        Payment p = student.getPayment();
        if ("PAID".equalsIgnoreCase(p.getStatus())) {
            System.out.println("Hostel annual fee has already been paid.");
            return true;
        }

        String txn = "RZP_TEST_" + (100000 + new Random().nextInt(900000));
        String dateStr = new SimpleDateFormat("yyyy-MM-dd HH:mm").format(new Date());

        p.setStatus("PAID");
        p.setPaymentId("PAY-" + (2000 + new Random().nextInt(1000)));
        p.setPaymentDate(dateStr);
        p.setTransactionRef(txn);

        student.getOnboardingApp().setFeePaid(true);
        dataStore.persistStudent(student);

        System.out.println("Payment Successful via Razorpay Test Simulation.");
        p.displayPayment();
        return true;
    }

    public void adminVerifyStudent(Student student) {
        student.getOnboardingApp().setAdminVerified(true);
        dataStore.persistStudent(student);
        System.out.println("Student " + student.getName() + " (" + student.getStudentId() + ") has been verified by Administrator.");
    }

    public boolean selectMessPlan(Student student, String planId) {
        MessPlan selected = dataStore.findMessPlanById(planId);
        if (selected == null) {
            System.out.println("Invalid Mess Plan ID: " + planId);
            return false;
        }
        student.setMessPlan(selected);
        student.getOnboardingApp().setMessSelected(true);
        dataStore.persistStudent(student);
        System.out.println("Mess plan " + selected.getPlanName() + " selected successfully.");
        return true;
    }

    public void activateLaundryPlan(Student student) {
        student.getLaundryPlan().setStatus("ACTIVE");
        student.getOnboardingApp().setLaundryPlanActivated(true);
        dataStore.persistStudent(student);
        System.out.println("30-Cycle laundry plan activated for " + student.getName() + ".");
    }

    public HostelPass generateHostelPass(Student student) {
        OnboardingApplication app = student.getOnboardingApp();

        if (!app.isPersonalDetailsCompleted() || !app.isDocumentsSubmitted() ||
                !app.isUndertakingAccepted() || !app.isFeePaid() ||
                !app.isAdminVerified() || !app.isRoomBedSelected() ||
                !app.isMessSelected()) {
            System.out.println("Cannot generate Hostel Pass: Complete all required preceding onboarding stages first.");
            app.displayStatus();
            return null;
        }

        activateLaundryPlan(student);

        String passId = "HP-" + student.getStudentId() + "-" + (100 + new Random().nextInt(900));
        String issueDate = new SimpleDateFormat("yyyy-MM-dd").format(new Date());

        HostelPass pass = new HostelPass(
                passId,
                student.getStudentId(),
                student.getName(),
                student.getAllocatedRoom(),
                student.getAllocatedBed(),
                student.getMessPlan() != null ? student.getMessPlan().getPlanName() : "Standard",
                issueDate
        );

        student.setHostelPass(pass);
        app.setHostelPassGenerated(true);
        dataStore.persistStudent(student);

        System.out.println("Hostel Pass generated successfully!");
        pass.displayPass();
        return pass;
    }
}
