package model;

public class OnboardingApplication {
    private String studentId;
    private boolean personalDetailsCompleted;
    private boolean documentsSubmitted;
    private boolean undertakingAccepted;
    private boolean feePaid;
    private boolean adminVerified;
    private boolean roomBedSelected;
    private boolean messSelected;
    private boolean laundryPlanActivated;
    private boolean hostelPassGenerated;

    public OnboardingApplication(String studentId) {
        this.studentId = studentId;
        this.personalDetailsCompleted = false;
        this.documentsSubmitted = false;
        this.undertakingAccepted = false;
        this.feePaid = false;
        this.adminVerified = false;
        this.roomBedSelected = false;
        this.messSelected = false;
        this.laundryPlanActivated = false;
        this.hostelPassGenerated = false;
    }

    public String getStudentId() {
        return studentId;
    }

    public boolean isPersonalDetailsCompleted() {
        return personalDetailsCompleted;
    }

    public void setPersonalDetailsCompleted(boolean personalDetailsCompleted) {
        this.personalDetailsCompleted = personalDetailsCompleted;
    }

    public boolean isDocumentsSubmitted() {
        return documentsSubmitted;
    }

    public void setDocumentsSubmitted(boolean documentsSubmitted) {
        this.documentsSubmitted = documentsSubmitted;
    }

    public boolean isUndertakingAccepted() {
        return undertakingAccepted;
    }

    public void setUndertakingAccepted(boolean undertakingAccepted) {
        this.undertakingAccepted = undertakingAccepted;
    }

    public boolean isFeePaid() {
        return feePaid;
    }

    public void setFeePaid(boolean feePaid) {
        this.feePaid = feePaid;
    }

    public boolean isAdminVerified() {
        return adminVerified;
    }

    public void setAdminVerified(boolean adminVerified) {
        this.adminVerified = adminVerified;
    }

    public boolean isRoomBedSelected() {
        return roomBedSelected;
    }

    public void setRoomBedSelected(boolean roomBedSelected) {
        this.roomBedSelected = roomBedSelected;
    }

    public boolean isMessSelected() {
        return messSelected;
    }

    public void setMessSelected(boolean messSelected) {
        this.messSelected = messSelected;
    }

    public boolean isLaundryPlanActivated() {
        return laundryPlanActivated;
    }

    public void setLaundryPlanActivated(boolean laundryPlanActivated) {
        this.laundryPlanActivated = laundryPlanActivated;
    }

    public boolean isHostelPassGenerated() {
        return hostelPassGenerated;
    }

    public void setHostelPassGenerated(boolean hostelPassGenerated) {
        this.hostelPassGenerated = hostelPassGenerated;
    }

    public boolean isCompleted() {
        return personalDetailsCompleted && documentsSubmitted && undertakingAccepted &&
                feePaid && adminVerified && roomBedSelected && messSelected &&
                laundryPlanActivated && hostelPassGenerated;
    }

    public String getNextStep() {
        if (!personalDetailsCompleted) return "Personal Details";
        if (!documentsSubmitted) return "Document Submission";
        if (!undertakingAccepted) return "Undertaking Acceptance";
        if (!feePaid) return "Annual Hostel Fee Payment";
        if (!adminVerified) return "Administrative Verification (Pending Admin Approval)";
        if (!roomBedSelected) return "Room & Bed Selection";
        if (!messSelected) return "Mess Plan Selection";
        if (!laundryPlanActivated) return "Laundry Plan Activation";
        if (!hostelPassGenerated) return "Generate Digital Hostel Pass";
        return "Onboarding Completed";
    }

    public void displayStatus() {
        System.out.println("================= ONBOARDING STATUS =================");
        System.out.println("1. Personal Details     : " + (personalDetailsCompleted ? "✓ Completed" : "- Pending"));
        System.out.println("2. Mock Aadhaar Upload  : " + (documentsSubmitted ? "✓ Completed" : "- Pending"));
        System.out.println("3. Undertaking          : " + (undertakingAccepted ? "✓ Accepted" : "- Pending"));
        System.out.println("4. Annual Hostel Fee    : " + (feePaid ? "✓ Paid" : "- Pending"));
        System.out.println("5. Admin Verification   : " + (adminVerified ? "✓ Verified" : "- Pending"));
        System.out.println("6. Room & Bed Selection : " + (roomBedSelected ? "✓ Allocated" : "- Pending"));
        System.out.println("7. Mess Plan Selection  : " + (messSelected ? "✓ Selected" : "- Pending"));
        System.out.println("8. Laundry Plan         : " + (laundryPlanActivated ? "✓ 30 Cycles Active" : "- Pending"));
        System.out.println("9. Digital Hostel Pass  : " + (hostelPassGenerated ? "✓ Issued" : "- Pending"));
        System.out.println("-----------------------------------------------------");
        System.out.println("Current Next Step: " + getNextStep());
        System.out.println("=====================================================");
    }
}
