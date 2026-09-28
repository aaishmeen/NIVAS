package model;

public class Payment {
    private String paymentId;
    private double amount;
    private String status;
    private String paymentDate;
    private String transactionRef;

    public Payment() {
        this.paymentId = "PAY-PENDING";
        this.amount = 85000.0;
        this.status = "PENDING";
        this.paymentDate = "N/A";
        this.transactionRef = "N/A";
    }

    public Payment(String paymentId, double amount, String status, String paymentDate, String transactionRef) {
        this.paymentId = paymentId;
        this.amount = amount;
        this.status = status;
        this.paymentDate = paymentDate;
        this.transactionRef = transactionRef;
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(String paymentDate) {
        this.paymentDate = paymentDate;
    }

    public String getTransactionRef() {
        return transactionRef;
    }

    public void setTransactionRef(String transactionRef) {
        this.transactionRef = transactionRef;
    }

    public void displayPayment() {
        System.out.println("Hostel Annual Fee : ₹" + amount);
        System.out.println("Payment Status    : " + status);
        System.out.println("Payment ID        : " + paymentId);
        System.out.println("Date              : " + paymentDate);
        System.out.println("Transaction Ref   : " + transactionRef);
    }
}
