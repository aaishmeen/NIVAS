package service;

import model.Announcement;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

public class AnnouncementService {
    private DataStore dataStore;
    private int counter;

    public AnnouncementService() {
        this.dataStore = DataStore.getInstance();
        this.counter = 10;
    }

    public void publishAnnouncement(String title, String message, String author) {
        counter++;
        String id = "ANN" + counter;
        String date = new SimpleDateFormat("yyyy-MM-dd").format(new Date());

        Announcement ann = new Announcement(id, title, message, date, author);
        dataStore.getAnnouncements().add(0, ann);
        System.out.println("Success: Announcement [" + title + "] published successfully.");
    }

    public void displayAllAnnouncements() {
        ArrayList<Announcement> list = dataStore.getAnnouncements();
        if (list.isEmpty()) {
            System.out.println("No announcements at this time.");
            return;
        }
        for (Announcement a : list) {
            a.displayAnnouncement();
        }
    }
}
