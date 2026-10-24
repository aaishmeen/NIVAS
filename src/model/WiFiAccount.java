package model;

public class WiFiAccount {
    public static final double DEFAULT_QUOTA_GB = 300.0;

    private String username;
    private String wifiPassword;
    private double allocatedGB;
    private double usedGB;
    private String status;

    public WiFiAccount(String username, String wifiPassword) {
        this.username = username;
        this.wifiPassword = wifiPassword;
        this.allocatedGB = DEFAULT_QUOTA_GB;
        this.usedGB = 45.5;
        this.status = "ACTIVE";
    }

    public String getUsername() {
        return username;
    }

    public String getWifiPassword() {
        return wifiPassword;
    }

    public double getAllocatedGB() {
        return allocatedGB;
    }

    public void setAllocatedGB(double allocatedGB) {
        this.allocatedGB = allocatedGB;
    }

    public double getUsedGB() {
        return usedGB;
    }

    public void setUsedGB(double usedGB) {
        this.usedGB = usedGB;
    }

    public double getRemainingGB() {
        return Math.max(0, allocatedGB - usedGB);
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void recordUsage(double additionalGB) {
        this.usedGB = Math.min(allocatedGB, this.usedGB + additionalGB);
    }

    public void displayAccount() {
        System.out.println("---------------------------------");
        System.out.println("Wi-Fi Username : " + username);
        System.out.println("Wi-Fi Status   : " + status);
        System.out.println("Allocated Data : " + allocatedGB + " GB");
        System.out.println("Used Data      : " + String.format("%.2f", usedGB) + " GB");
        System.out.println("Remaining Data : " + String.format("%.2f", getRemainingGB()) + " GB");
        System.out.println("---------------------------------");
    }
}
