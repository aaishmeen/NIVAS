<<<<<<< HEAD
public class Main {
    
=======
import model.*;
import service.*;

import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    private static Scanner scanner = new Scanner(System.in);
    private static DataStore dataStore = DataStore.getInstance();
    private static AuthenticationService authService = new AuthenticationService();
    private static RoomService roomService = new RoomService();
    private static OnboardingService onboardingService = new OnboardingService(roomService);
    private static LaundryService laundryService = new LaundryService();
    private static WiFiService wifiService = new WiFiService();
    private static TicketService ticketService = new TicketService();
    private static AssistanceService assistanceService = new AssistanceService();
    private static AnnouncementService announcementService = new AnnouncementService();

    public static void main(String[] args) {
        boolean running = true;
        while (running) {
            System.out.println("\n====================================");
            System.out.println("              NIVAS                 ");
            System.out.println("     Hostel Resident Services       ");
            System.out.println("====================================");
            System.out.println("1. Student Login");
            System.out.println("2. Admin Login");
            System.out.println("3. Staff / Warden Login");
            System.out.println("4. Exit");
            System.out.println("------------------------------------");
            System.out.println("[Demo Credentials]");
            System.out.println("Student : MUJ12345 / student123  (or MUJ12346)");
            System.out.println("Admin   : ADM01    / admin123");
            System.out.println("Staff   : STF01    / warden123   (or STF02 / staff123)");
            System.out.println("====================================");
            System.out.print("Enter your choice: ");

            String choice = scanner.nextLine().trim();

            switch (choice) {
                case "1":
                    handleStudentLogin();
                    break;
                case "2":
                    handleAdminLogin();
                    break;
                case "3":
                    handleStaffLogin();
                    break;
                case "4":
                    running = false;
                    System.out.println("Thank you for using NIVAS. Goodbye!");
                    break;
                default:
                    System.out.println("Invalid choice. Please select 1-4.");
            }
        }
    }

    private static void handleStudentLogin() {
        System.out.print("\nEnter Student ID or Email: ");
        String id = scanner.nextLine().trim();
        System.out.print("Enter Password: ");
        String pass = scanner.nextLine().trim();

        User user = authService.authenticateUser(id, pass);

        if (user != null && user instanceof Student) {
            Student student = (Student) user;

            authService.generateOtp(student.getStudentId());
            System.out.print("Enter OTP to verify: ");
            String enteredOtp = scanner.nextLine().trim();

            if (authService.verifyOtp(enteredOtp)) {
                System.out.println("OTP Verified Successfully! Welcome, " + student.getName());
                student.setFirstLogin(false);
                runStudentMenu(student);
            } else {
                System.out.println("Incorrect OTP. Authentication failed.");
            }
        } else {
            System.out.println("Authentication failed. Invalid Student ID or Password.");
        }
    }

    private static void runStudentMenu(Student student) {
        boolean inMenu = true;
        while (inMenu) {
            System.out.println("\n------------------------------------");
            System.out.println("         STUDENT DASHBOARD          ");
            System.out.println("Resident: " + student.getName() + " (" + student.getStudentId() + ")");
            System.out.println("------------------------------------");
            System.out.println("1.  View Profile");
            System.out.println("2.  View Onboarding Status");
            System.out.println("3.  Complete / Continue Onboarding");
            System.out.println("4.  Annual Hostel Fee Payment");
            System.out.println("5.  Select Room & Bed");
            System.out.println("6.  Select Mess Plan");
            System.out.println("7.  Laundry Management (30-Cycle Plan)");
            System.out.println("8.  Hostel Wi-Fi Usage");
            System.out.println("9.  View Digital Hostel Pass");
            System.out.println("10. Raise Maintenance Ticket");
            System.out.println("11. Request Emergency / Assistance");
            System.out.println("12. View Announcements");
            System.out.println("13. Logout");
            System.out.print("Enter choice: ");

            String ch = scanner.nextLine().trim();
            switch (ch) {
                case "1":
                    student.displayProfile();
                    break;
                case "2":
                    student.getOnboardingApp().displayStatus();
                    break;
                case "3":
                    handleStudentOnboardingWizard(student);
                    break;
                case "4":
                    handleStudentFee(student);
                    break;
                case "5":
                    handleStudentRoomSelection(student);
                    break;
                case "6":
                    handleStudentMessSelection(student);
                    break;
                case "7":
                    handleStudentLaundry(student);
                    break;
                case "8":
                    handleStudentWifi(student);
                    break;
                case "9":
                    handleStudentPass(student);
                    break;
                case "10":
                    handleStudentTickets(student);
                    break;
                case "11":
                    handleStudentAssistance(student);
                    break;
                case "12":
                    announcementService.displayAllAnnouncements();
                    break;
                case "13":
                    authService.logout();
                    inMenu = false;
                    System.out.println("Logged out successfully.");
                    break;
                default:
                    System.out.println("Invalid option.");
            }
        }
    }

    private static void handleStudentOnboardingWizard(Student student) {
        OnboardingApplication app = student.getOnboardingApp();
        System.out.println("\n========== ONBOARDING WIZARD ==========");
        app.displayStatus();

        if (!app.isPersonalDetailsCompleted()) {
            System.out.println("\n[Stage 1: Personal & Guardian Details]");
            System.out.print("Enter Full Name: ");
            String name = scanner.nextLine().trim();
            System.out.print("Enter Phone: ");
            String phone = scanner.nextLine().trim();
            System.out.print("Enter Gender: ");
            String gender = scanner.nextLine().trim();
            System.out.print("Enter Branch: ");
            String branch = scanner.nextLine().trim();
            System.out.print("Enter Academic Year (1-4): ");
            int year = 1;
            try {
                year = Integer.parseInt(scanner.nextLine().trim());
            } catch (Exception e) {
                year = 2;
            }
            System.out.print("Enter Permanent Address: ");
            String address = scanner.nextLine().trim();
            System.out.print("Enter Guardian Name: ");
            String gName = scanner.nextLine().trim();
            System.out.print("Enter Guardian Phone: ");
            String gPhone = scanner.nextLine().trim();

            onboardingService.submitPersonalDetails(student, name, phone, gender, branch, year, address, gName, gPhone);
        }

        if (!app.isDocumentsSubmitted()) {
            System.out.println("\n[Stage 2: Mock Aadhaar Document Upload]");
            System.out.print("Enter 12-Digit Mock Aadhaar Number: ");
            String aadhaar = scanner.nextLine().trim();
            onboardingService.submitAadhaar(student, aadhaar);
        }

        if (!app.isUndertakingAccepted()) {
            System.out.println("\n[Stage 3: Hostel Undertaking]");
            System.out.println("Undertaking Terms: I agree to abide by all hostel rules, anti-ragging policies, and timings.");
            System.out.print("Do you accept the undertaking? (Y/N): ");
            String accept = scanner.nextLine().trim();
            if (accept.equalsIgnoreCase("Y")) {
                onboardingService.acceptUndertaking(student);
            } else {
                System.out.println("Undertaking must be accepted to proceed.");
                return;
            }
        }

        if (!app.isFeePaid()) {
            System.out.println("\n[Stage 4: Annual Hostel Fee Payment]");
            System.out.println("Annual Hostel Fee: ₹85,000");
            System.out.print("Proceed to pay fee via Razorpay Test Simulation? (Y/N): ");
            String pay = scanner.nextLine().trim();
            if (pay.equalsIgnoreCase("Y")) {
                onboardingService.payHostelFee(student);
            } else {
                System.out.println("Hostel fee payment is required before room allocation.");
                return;
            }
        }

        if (!app.isAdminVerified()) {
            System.out.println("\n[Stage 5: Administrative Verification]");
            System.out.println("Status: Pending Administrator approval.");
            System.out.println("You can simulate instant Admin verification right now or wait for Admin to verify.");
            System.out.print("Simulate instant verification for viva demo? (Y/N): ");
            String v = scanner.nextLine().trim();
            if (v.equalsIgnoreCase("Y")) {
                onboardingService.adminVerifyStudent(student);
            } else {
                return;
            }
        }

        if (!app.isRoomBedSelected()) {
            System.out.println("\n[Stage 6: Room & Bed Selection]");
            handleStudentRoomSelection(student);
            if (!app.isRoomBedSelected()) return;
        }

        if (!app.isMessSelected()) {
            System.out.println("\n[Stage 7: Mess Plan Selection]");
            handleStudentMessSelection(student);
            if (!app.isMessSelected()) return;
        }

        if (!app.isLaundryPlanActivated()) {
            onboardingService.activateLaundryPlan(student);
        }

        if (!app.isHostelPassGenerated()) {
            System.out.println("\n[Stage 8: Generating Digital Hostel Pass]");
            onboardingService.generateHostelPass(student);
        }

        System.out.println("\nCongratulations! Onboarding process is fully complete.");
    }

    private static void handleStudentFee(Student student) {
        System.out.println("\n===== ANNUAL HOSTEL FEE =====");
        student.getPayment().displayPayment();
        if (!student.getOnboardingApp().isFeePaid()) {
            System.out.print("Pay ₹85,000 now via Razorpay Simulation? (Y/N): ");
            String ch = scanner.nextLine().trim();
            if (ch.equalsIgnoreCase("Y")) {
                onboardingService.payHostelFee(student);
            }
        }
    }

    private static void handleStudentRoomSelection(Student student) {
        if (!student.getOnboardingApp().isFeePaid()) {
            System.out.println("Notice: Annual hostel fee must be paid before room selection.");
            return;
        }
        if (!student.getOnboardingApp().isAdminVerified()) {
            System.out.println("Notice: Document & payment verification by Admin is required before room selection.");
            return;
        }

        roomService.displayAllRooms();
        System.out.print("Enter Room Number to choose: ");
        String roomNo = scanner.nextLine().trim();
        Room r = dataStore.findRoomByNumber(roomNo);
        if (r == null) {
            System.out.println("Invalid Room Number.");
            return;
        }

        ArrayList<Bed> beds = r.getAvailableBeds();
        if (beds.isEmpty()) {
            System.out.println("Sorry, Room " + roomNo + " is fully occupied.");
            return;
        }

        System.out.println("Available Beds in Room " + roomNo + ":");
        for (int i = 0; i < beds.size(); i++) {
            System.out.println((i + 1) + ". " + beds.get(i).getBedCode());
        }
        System.out.print("Enter Bed Code (e.g. Bed A, Bed B): ");
        String bedCode = scanner.nextLine().trim();

        roomService.allocateBed(student, roomNo, bedCode);
    }

    private static void handleStudentMessSelection(Student student) {
        System.out.println("\n===== AVAILABLE MESS PLANS =====");
        for (MessPlan mp : dataStore.getMessPlans()) {
            mp.displayPlan();
        }
        System.out.print("Enter Mess Plan ID (e.g. MP01, MP02, MP03): ");
        String pid = scanner.nextLine().trim();
        onboardingService.selectMessPlan(student, pid);
    }

    private static void handleStudentLaundry(Student student) {
        boolean inLaundry = true;
        while (inLaundry) {
            System.out.println("\n===== LAUNDRY SERVICES (30-Cycle Plan) =====");
            student.getLaundryPlan().displayPlan();
            System.out.println("1. Request Laundry Pickup");
            System.out.println("2. View My Laundry Requests");
            System.out.println("3. Back to Dashboard");
            System.out.print("Enter choice: ");
            String ch = scanner.nextLine().trim();
            switch (ch) {
                case "1":
                    if (!student.getLaundryPlan().canRequestLaundry()) {
                        System.out.println("Cannot request: Laundry cycles exhausted (0 remaining).");
                        break;
                    }
                    System.out.print("Enter number of clothes: ");
                    int clothes = 5;
                    try {
                        clothes = Integer.parseInt(scanner.nextLine().trim());
                    } catch (Exception e) {
                        clothes = 5;
                    }
                    laundryService.createPickupRequest(student, clothes);
                    break;
                case "2":
                    ArrayList<LaundryRequest> list = laundryService.getRequestsByStudent(student.getStudentId());
                    if (list.isEmpty()) {
                        System.out.println("No laundry requests found.");
                    } else {
                        System.out.println("\n--- Your Laundry Requests ---");
                        for (LaundryRequest lr : list) {
                            lr.displayRequest();
                        }
                    }
                    break;
                case "3":
                    inLaundry = false;
                    break;
                default:
                    System.out.println("Invalid option.");
            }
        }
    }

    private static void handleStudentWifi(Student student) {
        System.out.println("\n===== HOSTEL WI-FI SERVICES =====");
        wifiService.displayAccount(student);
        System.out.println("1. Simulate Data Consumption");
        System.out.println("2. Back");
        System.out.print("Enter choice: ");
        String ch = scanner.nextLine().trim();
        if (ch.equals("1")) {
            System.out.print("Enter GB used: ");
            try {
                double gb = Double.parseDouble(scanner.nextLine().trim());
                wifiService.simulateDataUsage(student, gb);
            } catch (Exception e) {
                System.out.println("Invalid number.");
            }
        }
    }

    private static void handleStudentPass(Student student) {
        if (student.getHostelPass() != null) {
            student.getHostelPass().displayPass();
        } else {
            System.out.println("Digital Hostel Pass has not been generated yet.");
            System.out.println("Please complete all required onboarding stages first.");
            System.out.print("Would you like to generate it now if eligible? (Y/N): ");
            String ans = scanner.nextLine().trim();
            if (ans.equalsIgnoreCase("Y")) {
                onboardingService.generateHostelPass(student);
            }
        }
    }

    private static void handleStudentTickets(Student student) {
        boolean inTickets = true;
        while (inTickets) {
            System.out.println("\n===== HOSTEL MAINTENANCE TICKETS =====");
            System.out.println("1. Raise New Ticket");
            System.out.println("2. View My Raised Tickets");
            System.out.println("3. Back");
            System.out.print("Enter choice: ");
            String ch = scanner.nextLine().trim();
            switch (ch) {
                case "1":
                    System.out.println("Categories: [Electrical, Plumbing, Carpentry, Cleanliness, Wi-Fi, Other]");
                    System.out.print("Enter Category: ");
                    String cat = scanner.nextLine().trim();
                    System.out.print("Describe Issue: ");
                    String desc = scanner.nextLine().trim();
                    ticketService.createTicket(student.getStudentId(), cat, desc);
                    break;
                case "2":
                    ArrayList<Ticket> list = ticketService.getTicketsByStudent(student.getStudentId());
                    if (list.isEmpty()) {
                        System.out.println("No tickets submitted.");
                    } else {
                        System.out.println("\n--- Your Tickets ---");
                        for (Ticket t : list) {
                            t.displayTicket();
                            if (!t.getResolutionNotes().equals("None")) {
                                System.out.println("  Resolution Note: " + t.getResolutionNotes());
                            }
                        }
                    }
                    break;
                case "3":
                    inTickets = false;
                    break;
                default:
                    System.out.println("Invalid option.");
            }
        }
    }

    private static void handleStudentAssistance(Student student) {
        System.out.println("\n===== RESIDENT ASSISTANCE & EMERGENCY =====");
        System.out.println("1. Food Request in Room (Sick)");
        System.out.println("2. Medical Help");
        System.out.println("3. Ambulance Request");
        System.out.println("4. Urgent Help / Emergency");
        System.out.println("5. General Assistance");
        System.out.println("6. View My Assistance Requests");
        System.out.println("7. Back");
        System.out.print("Enter choice: ");
        String ch = scanner.nextLine().trim();

        String type = null;
        switch (ch) {
            case "1": type = "FOOD_IN_ROOM"; break;
            case "2": type = "MEDICAL_HELP"; break;
            case "3": type = "AMBULANCE"; break;
            case "4": type = "URGENT_HELP"; break;
            case "5": type = "GENERAL_ASSISTANCE"; break;
            case "6":
                ArrayList<AssistanceRequest> list = assistanceService.getRequestsByStudent(student.getStudentId());
                if (list.isEmpty()) {
                    System.out.println("No assistance requests found.");
                } else {
                    for (AssistanceRequest ar : list) {
                        ar.displayRequest();
                    }
                }
                return;
            case "7":
                return;
            default:
                System.out.println("Invalid choice.");
                return;
        }

        System.out.print("Enter specific notes or requirements: ");
        String note = scanner.nextLine().trim();
        assistanceService.createRequest(student.getStudentId(), type, note);
    }

    private static void handleAdminLogin() {
        System.out.print("\nEnter Admin ID or Email: ");
        String id = scanner.nextLine().trim();
        System.out.print("Enter Password: ");
        String pass = scanner.nextLine().trim();

        User user = authService.authenticateUser(id, pass);
        if (user != null && user instanceof Admin) {
            System.out.println("Welcome, Administrator " + user.getName());
            runAdminMenu((Admin) user);
        } else {
            System.out.println("Invalid Admin credentials.");
        }
    }

    private static void runAdminMenu(Admin admin) {
        boolean inMenu = true;
        while (inMenu) {
            System.out.println("\n------------------------------------");
            System.out.println("          ADMINISTRATOR MENU        ");
            System.out.println("Admin: " + admin.getName());
            System.out.println("------------------------------------");
            System.out.println("1. View All Students");
            System.out.println("2. Verify Student Onboarding & Payment");
            System.out.println("3. View Hostel Rooms & Occupancy");
            System.out.println("4. Manage Mess Plans");
            System.out.println("5. Manage Maintenance Tickets");
            System.out.println("6. Manage Assistance Requests");
            System.out.println("7. View Laundry Requests");
            System.out.println("8. Publish Hostel Announcement");
            System.out.println("9. Logout");
            System.out.print("Enter choice: ");

            String ch = scanner.nextLine().trim();
            switch (ch) {
                case "1":
                    System.out.println("\n========== REGISTERED STUDENTS ==========");
                    for (User u : dataStore.getUsers()) {
                        if (u instanceof Student) {
                            Student s = (Student) u;
                            System.out.println("ID: " + s.getStudentId() + " | Name: " + s.getName() +
                                    " | Room: " + (s.getAllocatedRoom() != null ? s.getAllocatedRoom() : "None") +
                                    " | Fee: " + s.getPayment().getStatus() +
                                    " | Verified: " + s.getOnboardingApp().isAdminVerified());
                        }
                    }
                    break;
                case "2":
                    System.out.print("Enter Student ID to verify: ");
                    String sid = scanner.nextLine().trim();
                    Student s = dataStore.findStudentById(sid);
                    if (s != null) {
                        onboardingService.adminVerifyStudent(s);
                    } else {
                        System.out.println("Student not found.");
                    }
                    break;
                case "3":
                    roomService.displayAllRooms();
                    break;
                case "4":
                    System.out.println("\n========== MESS PLANS ==========");
                    for (MessPlan mp : dataStore.getMessPlans()) {
                        mp.displayPlan();
                    }
                    break;
                case "5":
                    handleAdminTickets();
                    break;
                case "6":
                    handleAdminAssistance();
                    break;
                case "7":
                    System.out.println("\n========== ALL LAUNDRY REQUESTS ==========");
                    ArrayList<LaundryRequest> lreqs = laundryService.getAllRequests();
                    if (lreqs.isEmpty()) {
                        System.out.println("No laundry requests recorded.");
                    } else {
                        for (LaundryRequest lr : lreqs) {
                            lr.displayRequest();
                        }
                    }
                    break;
                case "8":
                    System.out.print("Enter Announcement Title: ");
                    String title = scanner.nextLine().trim();
                    System.out.print("Enter Announcement Body: ");
                    String body = scanner.nextLine().trim();
                    announcementService.publishAnnouncement(title, body, admin.getName());
                    break;
                case "9":
                    inMenu = false;
                    System.out.println("Admin logged out.");
                    break;
                default:
                    System.out.println("Invalid option.");
            }
        }
    }

    private static void handleAdminTickets() {
        System.out.println("\n========== ALL TICKETS ==========");
        ArrayList<Ticket> tickets = ticketService.getAllTickets();
        if (tickets.isEmpty()) {
            System.out.println("No tickets.");
            return;
        }
        for (Ticket t : tickets) {
            t.displayTicket();
        }
        System.out.println("1. Assign Ticket to Staff");
        System.out.println("2. Update Ticket Status");
        System.out.println("3. Back");
        System.out.print("Choice: ");
        String ch = scanner.nextLine().trim();
        if (ch.equals("1")) {
            System.out.print("Enter Ticket ID: ");
            String tid = scanner.nextLine().trim();
            System.out.print("Enter Staff ID (e.g. STF01, STF02): ");
            String stf = scanner.nextLine().trim();
            ticketService.assignTicket(tid, stf);
        } else if (ch.equals("2")) {
            System.out.print("Enter Ticket ID: ");
            String tid = scanner.nextLine().trim();
            System.out.print("Enter New Status [SUBMITTED, ASSIGNED, IN_PROGRESS, RESOLVED, CLOSED]: ");
            String stat = scanner.nextLine().trim();
            System.out.print("Enter Resolution Notes: ");
            String notes = scanner.nextLine().trim();
            ticketService.updateStatus(tid, stat, notes);
        }
    }

    private static void handleAdminAssistance() {
        System.out.println("\n========== ALL ASSISTANCE REQUESTS ==========");
        ArrayList<AssistanceRequest> reqs = assistanceService.getAllRequests();
        if (reqs.isEmpty()) {
            System.out.println("No assistance requests.");
            return;
        }
        for (AssistanceRequest ar : reqs) {
            ar.displayRequest();
        }
        System.out.print("Update Request Status? (Y/N): ");
        String ch = scanner.nextLine().trim();
        if (ch.equalsIgnoreCase("Y")) {
            System.out.print("Enter Request ID: ");
            String rid = scanner.nextLine().trim();
            System.out.print("Enter Status [REQUESTED, ACKNOWLEDGED, ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED]: ");
            String stat = scanner.nextLine().trim();
            System.out.print("Assign to Staff ID: ");
            String stf = scanner.nextLine().trim();
            assistanceService.updateStatus(rid, stat, stf);
        }
    }

    private static void handleStaffLogin() {
        System.out.print("\nEnter Staff / Warden ID or Email: ");
        String id = scanner.nextLine().trim();
        System.out.print("Enter Password: ");
        String pass = scanner.nextLine().trim();

        User user = authService.authenticateUser(id, pass);
        if (user != null && user instanceof Staff) {
            System.out.println("Welcome, Staff Member " + user.getName());
            runStaffMenu((Staff) user);
        } else {
            System.out.println("Invalid Staff credentials.");
        }
    }

    private static void runStaffMenu(Staff staff) {
        boolean inMenu = true;
        while (inMenu) {
            System.out.println("\n------------------------------------");
            System.out.println("       STAFF / WARDEN DASHBOARD     ");
            System.out.println("Staff: " + staff.getName() + " (" + staff.getDesignation() + " - " + staff.getAssignedBlock() + ")");
            System.out.println("------------------------------------");
            System.out.println("1. View Assigned Block Rooms");
            System.out.println("2. View & Update Assigned Tickets");
            System.out.println("3. Handle Assistance Requests");
            System.out.println("4. Update Laundry Pickup Status (REQUESTED -> DELIVERED)");
            System.out.println("5. View Announcements");
            System.out.println("6. Logout");
            System.out.print("Enter choice: ");

            String ch = scanner.nextLine().trim();
            switch (ch) {
                case "1":
                    System.out.println("\n========== ROOMS IN " + staff.getAssignedBlock() + " ==========");
                    for (Room r : dataStore.getRooms()) {
                        if (r.getBlock().equalsIgnoreCase(staff.getAssignedBlock())) {
                            System.out.println("Room " + r.getRoomNumber() + " | Floor: " + r.getFloor() +
                                    " | Beds Free: " + r.getAvailableCount() + "/" + r.getCapacity());
                        }
                    }
                    break;
                case "2":
                    System.out.println("\n--- Tickets Assigned to " + staff.getId() + " ---");
                    ArrayList<Ticket> list = ticketService.getTicketsByStaff(staff.getId());
                    if (list.isEmpty()) {
                        System.out.println("No tickets assigned to you.");
                    } else {
                        for (Ticket t : list) {
                            t.displayTicket();
                        }
                    }
                    System.out.print("Update any ticket? (Y/N): ");
                    String ans = scanner.nextLine().trim();
                    if (ans.equalsIgnoreCase("Y")) {
                        System.out.print("Enter Ticket ID: ");
                        String tid = scanner.nextLine().trim();
                        System.out.print("Enter New Status [IN_PROGRESS, RESOLVED, CLOSED]: ");
                        String nstat = scanner.nextLine().trim();
                        System.out.print("Enter Resolution Note: ");
                        String note = scanner.nextLine().trim();
                        ticketService.updateStatus(tid, nstat, note);
                    }
                    break;
                case "3":
                    System.out.println("\n--- Assistance Requests ---");
                    for (AssistanceRequest ar : assistanceService.getAllRequests()) {
                        ar.displayRequest();
                    }
                    System.out.print("Update Request Status? (Y/N): ");
                    String uans = scanner.nextLine().trim();
                    if (uans.equalsIgnoreCase("Y")) {
                        System.out.print("Enter Request ID: ");
                        String rid = scanner.nextLine().trim();
                        System.out.print("Enter Status [ACKNOWLEDGED, IN_PROGRESS, COMPLETED, CANCELLED]: ");
                        String st = scanner.nextLine().trim();
                        assistanceService.updateStatus(rid, st, staff.getId());
                    }
                    break;
                case "4":
                    System.out.println("\n--- Laundry Requests ---");
                    for (LaundryRequest lr : laundryService.getAllRequests()) {
                        lr.displayRequest();
                    }
                    System.out.print("Update status of a laundry request? (Y/N): ");
                    String lans = scanner.nextLine().trim();
                    if (lans.equalsIgnoreCase("Y")) {
                        System.out.print("Enter Request ID: ");
                        String reqId = scanner.nextLine().trim();
                        System.out.print("Enter New Status [PICKED_UP, PROCESSING, READY, DELIVERED]: ");
                        String nstatus = scanner.nextLine().trim();
                        laundryService.updateStatus(reqId, nstatus);
                    }
                    break;
                case "5":
                    announcementService.displayAllAnnouncements();
                    break;
                case "6":
                    inMenu = false;
                    System.out.println("Staff logged out.");
                    break;
                default:
                    System.out.println("Invalid option.");
            }
        }
    }
>>>>>>> f38f30e (Implement NIVAS core OOP modules, services, and interactive CLI)
}
