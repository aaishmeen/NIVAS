package service;

import model.Student;
import model.WiFiAccount;

public class WiFiService {
    public void displayAccount(Student student) {
        WiFiAccount account = student.getWifiAccount();
        if (account != null) {
            account.displayAccount();
        } else {
            System.out.println("No active Wi-Fi account found for student.");
        }
    }

    public void simulateDataUsage(Student student, double additionalGB) {
        WiFiAccount account = student.getWifiAccount();
        if (account != null) {
            account.recordUsage(additionalGB);
            DataStore.getInstance().updateStudentWifi(student.getStudentId(), account.getUsedGB());
            System.out.println("Recorded " + additionalGB + " GB of usage.");
            account.displayAccount();
        }
    }
}
