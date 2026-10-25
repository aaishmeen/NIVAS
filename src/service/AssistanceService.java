package service;

import model.AssistanceRequest;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

public class AssistanceService {
    private DataStore dataStore;
    private int reqCounter;

    public AssistanceService() {
        this.dataStore = DataStore.getInstance();
        this.reqCounter = 300;
    }

    public AssistanceRequest createRequest(String studentId, String type, String details) {
        String id;
        do {
            reqCounter++;
            id = "AST" + reqCounter;
        } while (dataStore.findAssistanceRequestById(id) != null);

        String time = new SimpleDateFormat("yyyy-MM-dd HH:mm").format(new Date());

        AssistanceRequest request = new AssistanceRequest(id, studentId, type, details, time);
        dataStore.getAssistanceRequests().add(request);
        dataStore.persistAssistanceRequest(request);
        System.out.println("Success: Assistance request " + id + " [" + type + "] registered.");
        return request;
    }

    public ArrayList<AssistanceRequest> getAllRequests() {
        return dataStore.getAssistanceRequests();
    }

    public ArrayList<AssistanceRequest> getRequestsByStudent(String studentId) {
        ArrayList<AssistanceRequest> list = new ArrayList<>();
        for (AssistanceRequest ar : dataStore.getAssistanceRequests()) {
            if (ar.getStudentId().equalsIgnoreCase(studentId)) {
                list.add(ar);
            }
        }
        return list;
    }

    public boolean updateStatus(String requestId, String newStatus, String staffId) {
        for (AssistanceRequest ar : dataStore.getAssistanceRequests()) {
            if (ar.getRequestId().equalsIgnoreCase(requestId)) {
                ar.setStatus(newStatus.toUpperCase());
                if (staffId != null && !staffId.isEmpty()) {
                    ar.setAssignedStaffId(staffId);
                }
                dataStore.persistAssistanceRequest(ar);
                System.out.println("Assistance Request " + requestId + " updated to " + newStatus.toUpperCase());
                return true;
            }
        }
        System.out.println("Assistance request " + requestId + " not found.");
        return false;
    }
}
