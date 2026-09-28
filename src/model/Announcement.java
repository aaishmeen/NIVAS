package model;

public class Announcement {
    private String id;
    private String title;
    private String message;
    private String date;
    private String author;

    public Announcement(String id, String title, String message, String date, String author) {
        this.id = id;
        this.title = title;
        this.message = message;
        this.date = date;
        this.author = author;
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

    public void displayAnnouncement() {
        System.out.println("--------------------------------------------------");
        System.out.println("📢 [" + date + "] " + title.toUpperCase());
        System.out.println("By: " + author);
        System.out.println(message);
        System.out.println("--------------------------------------------------");
    }
}
