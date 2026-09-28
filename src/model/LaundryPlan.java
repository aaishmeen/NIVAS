package model;

public class LaundryPlan {
    public static final int INITIAL_CYCLES = 30;

    private int totalCycles;
    private int usedCycles;
    private String status;

    public LaundryPlan() {
        this.totalCycles = INITIAL_CYCLES;
        this.usedCycles = 0;
        this.status = "ACTIVE";
    }

    public int getTotalCycles() {
        return totalCycles;
    }

    public int getUsedCycles() {
        return usedCycles;
    }

    public int getRemainingCycles() {
        return totalCycles - usedCycles;
    }

    public String getStatus() {
        if (getRemainingCycles() <= 0) {
            status = "EXHAUSTED";
        }
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean canRequestLaundry() {
        return getRemainingCycles() > 0 && "ACTIVE".equalsIgnoreCase(getStatus());
    }

    public boolean consumeCycle() {
        if (canRequestLaundry()) {
            usedCycles++;
            if (getRemainingCycles() <= 0) {
                status = "EXHAUSTED";
            }
            return true;
        }
        return false;
    }

    public void displayPlan() {
        System.out.println("---------------------------------");
        System.out.println("Laundry Plan Status : " + getStatus());
        System.out.println("Total Cycles        : " + totalCycles);
        System.out.println("Cycles Used         : " + usedCycles);
        System.out.println("Cycles Remaining    : " + getRemainingCycles());
        System.out.println("---------------------------------");
    }
}
