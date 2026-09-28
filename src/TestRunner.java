import model.*;
import service.*;

import java.util.ArrayList;

public class TestRunner {
    public static void main(String[] args) {
        System.out.println("====================================================");
        System.out.println("       NIVAS AUTOMATED TEST SUITE (PHASES 1-9)      ");
        System.out.println("====================================================");

        DataStore ds = DataStore.getInstance();
        AuthenticationService authService = new AuthenticationService();
        RoomService roomService = new RoomService();
        OnboardingService onboardingService = new OnboardingService(roomService);
        LaundryService laundryService = new LaundryService();
        WiFiService wifiService = new WiFiService();
        TicketService ticketService = new TicketService();
        AssistanceService assistanceService = new AssistanceService();
        AnnouncementService announcementService = new AnnouncementService();

        int passed = 0;
        int failed = 0;

        User user = authService.authenticateUser("MUJ12345", "student123");
        if (user != null && user instanceof Student) {
            System.out.println("[PASS] Phase 2: Student Authentication Successful");
            passed++;
        } else {
            System.out.println("[FAIL] Phase 2: Student Authentication Failed");
            failed++;
        }

        Student student = (Student) user;

        String otp = authService.generateOtp(student.getStudentId());
        if (authService.verifyOtp(otp)) {
            System.out.println("[PASS] Phase 2: OTP Generation & Verification Successful");
            passed++;
        } else {
            System.out.println("[FAIL] Phase 2: OTP Verification Failed");
            failed++;
        }

        onboardingService.submitPersonalDetails(student, "Ved Malya", "9876543210", "Male",
                "Computer Science", 2, "Jaipur, Rajasthan", "Anil Malya", "9876500000");
        onboardingService.submitAadhaar(student, "1234-5678-9012");
        onboardingService.acceptUndertaking(student);
        onboardingService.payHostelFee(student);

        if (student.getOnboardingApp().isFeePaid() && "PAID".equals(student.getPayment().getStatus())) {
            System.out.println("[PASS] Phase 3: Details, Mock Aadhaar, Undertaking & Payment Successful");
            passed++;
        } else {
            System.out.println("[FAIL] Phase 3: Payment Verification Failed");
            failed++;
        }

        onboardingService.adminVerifyStudent(student);
        if (student.getOnboardingApp().isAdminVerified()) {
            System.out.println("[PASS] Phase 3: Admin Verification Successful");
            passed++;
        } else {
            System.out.println("[FAIL] Phase 3: Admin Verification Failed");
            failed++;
        }

        boolean bedAllocated = roomService.allocateBed(student, "101", "Bed A");
        Student otherStudent = ds.findStudentById("MUJ12346");
        boolean doubleAllocated = roomService.allocateBed(otherStudent, "101", "Bed A");

        if (bedAllocated && !doubleAllocated) {
            System.out.println("[PASS] Phase 4: Bed Allocated & Double-Allocation Constraint Enforced");
            passed++;
        } else {
            System.out.println("[FAIL] Phase 4: Room/Bed Allocation Constraint Violated");
            failed++;
        }

        boolean messSelected = onboardingService.selectMessPlan(student, "MP01");
        if (messSelected && student.getMessPlan() != null) {
            System.out.println("[PASS] Phase 5: Mess Plan Selection Successful");
            passed++;
        } else {
            System.out.println("[FAIL] Phase 5: Mess Plan Selection Failed");
            failed++;
        }

        onboardingService.activateLaundryPlan(student);
        int initialCycles = student.getLaundryPlan().getRemainingCycles();
        LaundryRequest lReq = laundryService.createPickupRequest(student, 6);
        laundryService.updateStatus(lReq.getRequestId(), "DELIVERED");
        int remainingCycles = student.getLaundryPlan().getRemainingCycles();

        if (initialCycles == 30 && remainingCycles == 29) {
            System.out.println("[PASS] Phase 5: Laundry 30-Cycle Quota & Deduction Successful");
            passed++;
        } else {
            System.out.println("[FAIL] Phase 5: Laundry Cycle Tracking Failed");
            failed++;
        }

        double initialUsed = student.getWifiAccount().getUsedGB();
        wifiService.simulateDataUsage(student, 10.0);
        if (student.getWifiAccount().getUsedGB() == initialUsed + 10.0) {
            System.out.println("[PASS] Phase 5: Wi-Fi Usage Tracking Successful");
            passed++;
        } else {
            System.out.println("[FAIL] Phase 5: Wi-Fi Tracking Failed");
            failed++;
        }

        Ticket ticket = ticketService.createTicket(student.getStudentId(), "Electrical", "Switchboard loose");
        ticketService.assignTicket(ticket.getTicketId(), "STF01");
        ticketService.updateStatus(ticket.getTicketId(), "RESOLVED", "Replaced switch plate");

        if ("RESOLVED".equals(ticket.getStatus()) && "STF01".equals(ticket.getAssignedToStaffId())) {
            System.out.println("[PASS] Phase 6: Maintenance Ticket Workflow Successful");
            passed++;
        } else {
            System.out.println("[FAIL] Phase 6: Ticket Workflow Failed");
            failed++;
        }

        AssistanceRequest ast = assistanceService.createRequest(student.getStudentId(), "MEDICAL_HELP", "Fever and headache");
        assistanceService.updateStatus(ast.getRequestId(), "IN_PROGRESS", "STF01");
        assistanceService.updateStatus(ast.getRequestId(), "COMPLETED", "STF01");

        if ("COMPLETED".equals(ast.getStatus())) {
            System.out.println("[PASS] Phase 6: Assistance Request Workflow Successful");
            passed++;
        } else {
            System.out.println("[FAIL] Phase 6: Assistance Workflow Failed");
            failed++;
        }

        announcementService.publishAnnouncement("Hostel Gala Night", "Annual hostel cultural fest on Saturday.", "Admin");
        if (ds.getAnnouncements().size() >= 3) {
            System.out.println("[PASS] Phase 7: Administrative Announcements Successful");
            passed++;
        } else {
            System.out.println("[FAIL] Phase 7: Announcements Failed");
            failed++;
        }

        HostelPass pass = onboardingService.generateHostelPass(student);
        if (pass != null && student.getHostelPass() != null && student.getOnboardingApp().isCompleted()) {
            System.out.println("[PASS] Phase 8: Digital Hostel Pass Generation & QR Successful");
            passed++;
        } else {
            System.out.println("[FAIL] Phase 8: Hostel Pass Generation Failed");
            failed++;
        }

        System.out.println("\n----------------------------------------------------");
        System.out.println("TOTAL TESTS: " + (passed + failed) + " | PASSED: " + passed + " | FAILED: " + failed);
        System.out.println("----------------------------------------------------");

        if (failed == 0) {
            System.out.println("ALL PHASES VERIFIED SUCCESSFULLY WITH ZERO ERRORS!");
        }
    }
}
