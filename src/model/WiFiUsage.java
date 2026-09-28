package model;

public class WiFiUsage {
    private String studentId;
    private String date;
    private double dataConsumedMB;
    private String deviceName;

    public WiFiUsage(String studentId, String date, double dataConsumedMB, String deviceName) {
        this.studentId = studentId;
        this.date = date;
        this.dataConsumedMB = dataConsumedMB;
        this.deviceName = deviceName;
    }

    public String getStudentId() {
        return studentId;
    }

    public String getDate() {
        return date;
    }

    public double getDataConsumedMB() {
        return dataConsumedMB;
    }

    public String getDeviceName() {
        return deviceName;
    }

    public void displayUsage() {
        System.out.println("Date: " + date + " | Device: " + deviceName + " | Consumed: " + dataConsumedMB + " MB");
    }
}
