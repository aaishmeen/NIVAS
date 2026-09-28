package model;

public class Document {
    private String documentType;
    private String documentNumber;
    private boolean isSubmitted;
    private boolean isUndertakingAccepted;

    public Document() {
        this.documentType = "Aadhaar Card";
        this.documentNumber = "";
        this.isSubmitted = false;
        this.isUndertakingAccepted = false;
    }

    public Document(String documentNumber, boolean isSubmitted, boolean isUndertakingAccepted) {
        this.documentType = "Aadhaar Card";
        this.documentNumber = documentNumber;
        this.isSubmitted = isSubmitted;
        this.isUndertakingAccepted = isUndertakingAccepted;
    }

    public String getDocumentType() {
        return documentType;
    }

    public String getDocumentNumber() {
        return documentNumber;
    }

    public void setDocumentNumber(String documentNumber) {
        this.documentNumber = documentNumber;
    }

    public boolean isSubmitted() {
        return isSubmitted;
    }

    public void setSubmitted(boolean submitted) {
        isSubmitted = submitted;
    }

    public boolean isUndertakingAccepted() {
        return isUndertakingAccepted;
    }

    public void setUndertakingAccepted(boolean undertakingAccepted) {
        isUndertakingAccepted = undertakingAccepted;
    }

    public void displayStatus() {
        System.out.println("Document Type         : " + documentType);
        System.out.println("Aadhaar Number (Mock) : " + (documentNumber.isEmpty() ? "Not Provided" : documentNumber));
        System.out.println("Submission Status     : " + (isSubmitted ? "Submitted" : "Pending"));
        System.out.println("Undertaking Accepted  : " + (isUndertakingAccepted ? "Accepted" : "Pending"));
    }
}
