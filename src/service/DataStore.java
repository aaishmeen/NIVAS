package service;

import model.*;
import java.util.ArrayList;

public class DataStore {
    private static DataStore instance;

    private ArrayList<User> users;
    private ArrayList<Room> rooms;
    private ArrayList<MessPlan> messPlans;
    private ArrayList<Ticket> tickets;
    private ArrayList<AssistanceRequest> assistanceRequests;
    private ArrayList<LaundryRequest> laundryRequests;
    private ArrayList<Announcement> announcements;

    private DataStore() {
        users = new ArrayList<>();
        rooms = new ArrayList<>();
        messPlans = new ArrayList<>();
        tickets = new ArrayList<>();
        assistanceRequests = new ArrayList<>();
        laundryRequests = new ArrayList<>();
        announcements = new ArrayList<>();
        initializeData();
    }

    public static DataStore getInstance() {
        if (instance == null) {
            instance = new DataStore();
        }
        return instance;
    }

    private void initializeData() {
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

        announcements.add(new Announcement("ANN01", "Hostel Verification Week", "All 2nd year students must complete document verification by Friday.", "2026-09-25", "Chief Warden"));
        announcements.add(new Announcement("ANN02", "Laundry Service Timings", "Laundry pickup is available daily between 8:00 AM and 11:00 AM.", "2026-09-26", "Hostel Office"));

        Ticket t1 = new Ticket("TCK101", "MUJ12345", "Plumbing", "Minor tap leakage in washroom", "2026-09-27");
        tickets.add(t1);
    }

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
