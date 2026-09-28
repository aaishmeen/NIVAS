package model;

public class MessPlan {
    private String planId;
    private String planName;
    private String description;
    private double monthlyFee;

    public MessPlan(String planId, String planName, String description, double monthlyFee) {
        this.planId = planId;
        this.planName = planName;
        this.description = description;
        this.monthlyFee = monthlyFee;
    }

    public String getPlanId() {
        return planId;
    }

    public String getPlanName() {
        return planName;
    }

    public String getDescription() {
        return description;
    }

    public double getMonthlyFee() {
        return monthlyFee;
    }

    public void displayPlan() {
        System.out.println("[" + planId + "] " + planName + " - " + description + " (₹" + monthlyFee + "/month)");
    }
}
