package model;

public class Announcement {
    private String id;
    private String title;
    private String message;
    private String date;
    private String author;
    private String targetAudience; // "STUDENT", "STAFF", "ADMIN", "ALL"

    public Announcement(String id, String title, String message, String date, String author) {
        this(id, title, message, date, author, "ALL");
    }

    public Announcement(String id, String title, String message, String date, String author, String targetAudience) {
        this.id = id;
        this.title = title;
        this.message = message;
        this.date = date;
        this.author = author;
        this.targetAudience = (targetAudience != null && !targetAudience.trim().isEmpty())
                ? targetAudience.trim().toUpperCase() : "ALL";
    }

    public String getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getMessage() {
        return message;
    }

    public String getDate() {
        return date;
    }

    public String getAuthor() {
        return author;
    }

    public String getTargetAudience() {
        return targetAudience != null ? targetAudience : "ALL";
    }

    public void setTargetAudience(String targetAudience) {
        this.targetAudience = targetAudience;
    }

    public void displayAnnouncement() {
        System.out.println("--------------------------------------------------");
        System.out.println("📢 [" + date + "] [" + getTargetAudience() + "] " + title.toUpperCase());
        System.out.println("By: " + author);
        System.out.println(message);
        System.out.println("--------------------------------------------------");
    }
}
