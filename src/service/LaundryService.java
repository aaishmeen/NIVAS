package service;

import model.LaundryPlan;
import model.LaundryRequest;
import model.Student;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

public class LaundryService {
    private DataStore dataStore;
    private int requestCounter;

    public LaundryService() {
        this.dataStore = DataStore.getInstance();
        this.requestCounter = 100;
    }

    public LaundryRequest createPickupRequest(Student student, int numberOfClothes) {
        LaundryPlan plan = student.getLaundryPlan();
        if (!plan.canRequestLaundry()) {
            System.out.println("Error: No laundry cycles remaining or plan is exhausted.");
            return null;
        }

        requestCounter++;
        String reqId = "LR-" + requestCounter;
        String dateStr = new SimpleDateFormat("yyyy-MM-dd").format(new Date());

        LaundryRequest req = new LaundryRequest(reqId, student.getStudentId(), numberOfClothes, dateStr);
        dataStore.getLaundryRequests().add(req);
        dataStore.persistLaundryRequest(req);

        System.out.println("Success: Laundry pickup request " + reqId + " submitted for " + numberOfClothes + " clothes.");
        return req;
    }

    public ArrayList<LaundryRequest> getRequestsByStudent(String studentId) {
        ArrayList<LaundryRequest> list = new ArrayList<>();
        for (LaundryRequest req : dataStore.getLaundryRequests()) {
            if (req.getStudentId().equalsIgnoreCase(studentId)) {
                list.add(req);
            }
        }
        return list;
    }

    public ArrayList<LaundryRequest> getAllRequests() {
        return dataStore.getLaundryRequests();
    }

    public boolean updateStatus(String requestId, String newStatus) {
        for (LaundryRequest req : dataStore.getLaundryRequests()) {
            if (req.getRequestId().equalsIgnoreCase(requestId)) {
                req.setStatus(newStatus.toUpperCase());
                if ("DELIVERED".equalsIgnoreCase(newStatus) && !req.isCycleDeducted()) {
                    Student s = dataStore.findStudentById(req.getStudentId());
                    if (s != null) {
                        s.getLaundryPlan().consumeCycle();
                        req.setCycleDeducted(true);
                        dataStore.updateStudentLaundryPlan(s.getStudentId(), s.getLaundryPlan().getUsedCycles(), s.getLaundryPlan().getStatus());
                        System.out.println("Cycle deducted for student " + s.getName() + ". Remaining: " + s.getLaundryPlan().getRemainingCycles());
                    }
                }
                dataStore.updateLaundryRequestStatus(req.getRequestId(), req.getStatus(), req.isCycleDeducted());
                System.out.println("Status of laundry request " + requestId + " updated to " + newStatus.toUpperCase());
                return true;
            }
        }
        System.out.println("Laundry request " + requestId + " not found.");
        return false;
    }
}
