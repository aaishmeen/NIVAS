package service;

import db.PostgresRepository;
import model.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class DataStore {
    private static DataStore instance;

    private ArrayList<User> users;
    private ArrayList<Room> rooms;
    private ArrayList<MessPlan> messPlans;
    private ArrayList<Ticket> tickets;
    private ArrayList<AssistanceRequest> assistanceRequests;
    private ArrayList<LaundryRequest> laundryRequests;
    private ArrayList<Announcement> announcements;

    private PostgresRepository repository;

    private DataStore() {
        users = new ArrayList<>();
        rooms = new ArrayList<>();
        messPlans = new ArrayList<>();
        tickets = new ArrayList<>();
        assistanceRequests = new ArrayList<>();
        laundryRequests = new ArrayList<>();
        announcements = new ArrayList<>();

        repository = PostgresRepository.getInstance();
        loadData();
    }

    public static synchronized DataStore getInstance() {
        if (instance == null) {
            instance = new DataStore();
        }
        return instance;
    }

    private void loadData() {
        boolean dbReady = repository.init();
        if (dbReady) {
            System.out.println("[DataStore] Loading domain data from PostgreSQL...");
            messPlans = repository.loadMessPlans();
            rooms = repository.loadRooms();

            Map<String, MessPlan> planMap = new HashMap<>();
            for (MessPlan mp : messPlans) {
                planMap.put(mp.getPlanId(), mp);
            }

            users = repository.loadUsers(planMap);
            tickets = repository.loadTickets();
            assistanceRequests = repository.loadAssistanceRequests();
            laundryRequests = repository.loadLaundryRequests();
            announcements = repository.loadAnnouncements();

            if (!users.isEmpty() && !rooms.isEmpty()) {
                System.out.println("[DataStore] PostgreSQL synchronization successful: " +
                        users.size() + " users, " + rooms.size() + " rooms, " +
                        announcements.size() + " announcements loaded.");
                return;
            } else {
                System.out.println("[DataStore] PostgreSQL tables are empty. Seeding initial domain models...");
            }
        }

        // Fallback or Initial Seed when DB is unavailable or empty
        initializeData();

        // If DB is connected but was empty, persist the baseline data
        if (dbReady) {
            for (User u : users) {
                if (u instanceof Student) {
                    repository.saveStudent((Student) u);
                }
            }
            for (Announcement a : announcements) {
                repository.saveAnnouncement(a);
            }
            for (Ticket t : tickets) {
                repository.saveTicket(t);
            }
        }
    }

    private void initializeData() {
        users.clear();
        rooms.clear();
        messPlans.clear();
        tickets.clear();
        assistanceRequests.clear();
        laundryRequests.clear();
        announcements.clear();

        Admin admin = new Admin("ADM01", "Dr. Rajesh Sharma", "admin@muj.ac.in", "admin123", "Chief Warden Office");
        Staff warden = new Staff("STF01", "Mr. Suresh Kumar", "suresh@muj.ac.in", "warden123", "Hostel Warden", "Block A");
        Staff caretaker = new Staff("STF02", "Mr. Ramesh Verma", "ramesh@muj.ac.in", "staff123", "Maintenance Supervisor", "Block B");

        users.add(admin);
        users.add(warden);
        users.add(caretaker);

        Student s1 = new Student("STD01", "Ved Malya", "ved@muj.ac.in", "student123", "MUJ12345");
        s1.getPersonalDetails().setFullName("Ved Malya");
        s1.getPersonalDetails().setPhone("9876543210");
        s1.getPersonalDetails().setGender("Male");
        s1.getPersonalDetails().setBranch("Computer Science & Engineering");
        s1.getPersonalDetails().setYear(2);
        s1.getPersonalDetails().setAddress("Jaipur, Rajasthan");
        s1.getPersonalDetails().setGuardianName("Anil Malya");
        s1.getPersonalDetails().setGuardianPhone("9876500000");

        Student s2 = new Student("STD02", "Aarav Patel", "aarav@muj.ac.in", "student123", "MUJ12346");

        users.add(s1);
        users.add(s2);

        Room r101 = new Room("101", 1, "Block A", 2);
        Room r102 = new Room("102", 1, "Block A", 4);
        Room r103 = new Room("103", 1, "Block A", 2);
        Room r201 = new Room("201", 2, "Block B", 2);
        Room r202 = new Room("202", 2, "Block B", 4);

        rooms.add(r101);
        rooms.add(r102);
        rooms.add(r103);
        rooms.add(r201);
        rooms.add(r202);

        MessPlan standard = new MessPlan("MP01", "Standard Mess Plan", "North & South Indian 4-meal buffet", 4500.0);
        MessPlan premium = new MessPlan("MP02", "Premium Mess Plan", "Multi-cuisine buffet with live counter and desserts", 6000.0);
        MessPlan veg = new MessPlan("MP03", "Pure Vegetarian Plan", "Nutritious pure vegetarian and Jain-friendly meals", 4200.0);

        messPlans.add(standard);
        messPlans.add(premium);
        messPlans.add(veg);

        announcements.add(new Announcement("ANN01", "Hostel Verification Week", "All 2nd year students must complete document verification by Friday.", "2026-09-25", "Chief Warden", "STUDENT"));
        announcements.add(new Announcement("ANN02", "Hostel Block Inspection & Key Audit", "All Block Wardens must complete floor room inventory check and report vacant beds by 6 PM.", "2026-09-26", "Chief Warden", "STAFF"));
        announcements.add(new Announcement("ANN03", "Laundry Service Timings & Pickup Window", "Laundry pickup is available daily between 8:00 AM and 11:00 AM at ground floor counters.", "2026-09-26", "Hostel Office", "STUDENT"));
        announcements.add(new Announcement("ANN04", "Maintenance Team Duty Roster Update", "Staff shift rotation for Block A and Block B electrical repairs has been updated for this week.", "2026-09-27", "Hostel Supervisor", "STAFF"));
        announcements.add(new Announcement("ANN05", "Executive Council Hostel Review", "Quarterly budget settlement and occupancy reconciliation are scheduled for Monday 10 AM.", "2026-09-28", "Registrar Office", "ADMIN"));
        announcements.add(new Announcement("ANN06", "Campus High-Speed Wi-Fi Maintenance", "Scheduled maintenance on central Wi-Fi backbone routers on Sunday from 2 AM to 4 AM.", "2026-09-28", "IT Services", "ALL"));

        Ticket t1 = new Ticket("TCK101", "MUJ12345", "Plumbing", "Minor tap leakage in washroom", "2026-09-27");
        tickets.add(t1);
    }

    public boolean isDatabaseConnected() {
        return repository != null && repository.isConnected();
    }

    // =========================================================================
    // PERSISTENCE HELPERS
    // =========================================================================

    public void persistStudent(Student s) {
        if (repository != null && s != null) {
            repository.saveStudent(s);
        }
    }

    public void persistBedAllocation(String roomNumber, String bedCode, boolean occupied, String studentId) {
        if (repository != null) {
            repository.saveBedAllocation(roomNumber, bedCode, occupied, studentId);
        }
    }

    public void persistLaundryRequest(LaundryRequest req) {
        if (repository != null && req != null) {
            repository.saveLaundryRequest(req);
        }
    }

    public void updateLaundryRequestStatus(String reqId, String status, boolean cycleDeducted) {
        if (repository != null) {
            repository.updateLaundryRequestStatus(reqId, status, cycleDeducted);
        }
    }

    public void updateStudentLaundryPlan(String studentId, int usedCycles, String status) {
        if (repository != null) {
            repository.updateStudentLaundryPlan(studentId, usedCycles, status);
        }
    }

    public void updateStudentWifi(String studentId, double usedGB) {
        if (repository != null) {
            repository.updateStudentWifi(studentId, usedGB);
        }
    }

    public void persistTicket(Ticket t) {
        if (repository != null && t != null) {
            repository.saveTicket(t);
        }
    }

    public void persistAssistanceRequest(AssistanceRequest ar) {
        if (repository != null && ar != null) {
            repository.saveAssistanceRequest(ar);
        }
    }

    public void persistAnnouncement(Announcement a) {
        if (repository != null && a != null) {
            repository.saveAnnouncement(a);
        }
    }

    // =========================================================================
    // ACCESSORS & SEARCH
    // =========================================================================

    public ArrayList<User> getUsers() {
        return users;
    }

    public ArrayList<Room> getRooms() {
        return rooms;
    }

    public ArrayList<MessPlan> getMessPlans() {
        return messPlans;
    }

    public ArrayList<Ticket> getTickets() {
        return tickets;
    }

    public ArrayList<AssistanceRequest> getAssistanceRequests() {
        return assistanceRequests;
    }

    public ArrayList<LaundryRequest> getLaundryRequests() {
        return laundryRequests;
    }

    public ArrayList<Announcement> getAnnouncements() {
        return announcements;
    }

    public Student findStudentById(String studentId) {
        for (User user : users) {
            if (user instanceof Student) {
                Student s = (Student) user;
                if (s.getStudentId().equalsIgnoreCase(studentId) || s.getId().equalsIgnoreCase(studentId)) {
                    return s;
                }
            }
        }
        return null;
    }

    public Staff findStaffById(String staffId) {
        for (User user : users) {
            if (user instanceof Staff) {
                Staff st = (Staff) user;
                if (st.getId().equalsIgnoreCase(staffId)) {
                    return st;
                }
            }
        }
        return null;
    }

    public Room findRoomByNumber(String roomNumber) {
        for (Room room : rooms) {
            if (room.getRoomNumber().equalsIgnoreCase(roomNumber)) {
                return room;
            }
        }
        return null;
    }

    public MessPlan findMessPlanById(String planId) {
        for (MessPlan plan : messPlans) {
            if (plan.getPlanId().equalsIgnoreCase(planId)) {
                return plan;
            }
        }
        return null;
    }
}
