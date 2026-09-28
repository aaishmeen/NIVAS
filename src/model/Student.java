package model;

public class Student extends User {
    private String studentId;
    private PersonalDetails personalDetails;
    private Document document;
    private Payment payment;
    private OnboardingApplication onboardingApp;
    private String allocatedRoom;
    private String allocatedBed;
    private MessPlan messPlan;
    private LaundryPlan laundryPlan;
    private WiFiAccount wifiAccount;
    private HostelPass hostelPass;

    public Student(String id, String name, String email, String password, String studentId) {
        super(id, name, email, password, "STUDENT");
        this.studentId = studentId;
        this.personalDetails = new PersonalDetails();
        this.document = new Document();
        this.payment = new Payment();
        this.onboardingApp = new OnboardingApplication(studentId);
        this.allocatedRoom = null;
        this.allocatedBed = null;
        this.messPlan = null;
        this.laundryPlan = new LaundryPlan();
        this.wifiAccount = new WiFiAccount(studentId, "wifi@" + studentId);
        this.hostelPass = null;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public PersonalDetails getPersonalDetails() {
        return personalDetails;
    }

    public void setPersonalDetails(PersonalDetails personalDetails) {
        this.personalDetails = personalDetails;
    }

    public Document getDocument() {
        return document;
    }

    public void setDocument(Document document) {
        this.document = document;
    }

    public Payment getPayment() {
        return payment;
    }

    public void setPayment(Payment payment) {
        this.payment = payment;
    }

    public OnboardingApplication getOnboardingApp() {
        return onboardingApp;
    }

    public void setOnboardingApp(OnboardingApplication onboardingApp) {
        this.onboardingApp = onboardingApp;
    }

    public String getAllocatedRoom() {
        return allocatedRoom;
    }

    public void setAllocatedRoom(String allocatedRoom) {
        this.allocatedRoom = allocatedRoom;
    }

    public String getAllocatedBed() {
        return allocatedBed;
    }

    public void setAllocatedBed(String allocatedBed) {
        this.allocatedBed = allocatedBed;
    }

    public MessPlan getMessPlan() {
        return messPlan;
    }

    public void setMessPlan(MessPlan messPlan) {
        this.messPlan = messPlan;
    }

    public LaundryPlan getLaundryPlan() {
        return laundryPlan;
    }

    public void setLaundryPlan(LaundryPlan laundryPlan) {
        this.laundryPlan = laundryPlan;
    }

    public WiFiAccount getWifiAccount() {
        return wifiAccount;
    }

    public void setWifiAccount(WiFiAccount wifiAccount) {
        this.wifiAccount = wifiAccount;
    }

    public HostelPass getHostelPass() {
        return hostelPass;
    }

    public void setHostelPass(HostelPass hostelPass) {
        this.hostelPass = hostelPass;
    }

    @Override
    public void displayProfile() {
        System.out.println("========== STUDENT PROFILE ==========");
        super.displayProfile();
        System.out.println("Student ID     : " + studentId);
        System.out.println("Allocated Room : " + (allocatedRoom != null ? allocatedRoom : "Not Allocated"));
        System.out.println("Allocated Bed  : " + (allocatedBed != null ? allocatedBed : "Not Allocated"));
        System.out.println("Mess Plan      : " + (messPlan != null ? messPlan.getPlanName() : "Not Selected"));
        System.out.println("Laundry Cycles : " + laundryPlan.getRemainingCycles() + "/" + laundryPlan.getTotalCycles() + " Remaining");
        System.out.println("Wi-Fi Quota    : " + String.format("%.2f", wifiAccount.getRemainingGB()) + "/" + wifiAccount.getAllocatedGB() + " GB");
        System.out.println("Hostel Pass    : " + (hostelPass != null ? "ISSUED (Active)" : "Pending Onboarding"));
        System.out.println("=====================================");
    }
}
