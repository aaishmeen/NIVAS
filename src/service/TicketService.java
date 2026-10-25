package service;

import model.Ticket;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

public class TicketService {
    private DataStore dataStore;
    private int ticketCounter;

    public TicketService() {
        this.dataStore = DataStore.getInstance();
        this.ticketCounter = 200;
    }

    public Ticket createTicket(String studentId, String category, String description) {
        String id;
        do {
            ticketCounter++;
            id = "TCK" + ticketCounter;
        } while (dataStore.findTicketById(id) != null);

        String date = new SimpleDateFormat("yyyy-MM-dd").format(new Date());

        Ticket ticket = new Ticket(id, studentId, category, description, date);
        dataStore.getTickets().add(ticket);
        dataStore.persistTicket(ticket);
        System.out.println("Success: Ticket " + id + " created with status SUBMITTED.");
        return ticket;
    }

    public ArrayList<Ticket> getAllTickets() {
        return dataStore.getTickets();
    }

    public ArrayList<Ticket> getTicketsByStudent(String studentId) {
        ArrayList<Ticket> list = new ArrayList<>();
        for (Ticket t : dataStore.getTickets()) {
            if (t.getStudentId().equalsIgnoreCase(studentId)) {
                list.add(t);
            }
        }
        return list;
    }

    public ArrayList<Ticket> getTicketsByStaff(String staffId) {
        ArrayList<Ticket> list = new ArrayList<>();
        for (Ticket t : dataStore.getTickets()) {
            if (t.getAssignedToStaffId().equalsIgnoreCase(staffId)) {
                list.add(t);
            }
        }
        return list;
    }

    public boolean assignTicket(String ticketId, String staffId) {
        for (Ticket t : dataStore.getTickets()) {
            if (t.getTicketId().equalsIgnoreCase(ticketId)) {
                t.setAssignedToStaffId(staffId);
                t.setStatus("ASSIGNED");
                dataStore.persistTicket(t);
                System.out.println("Ticket " + ticketId + " assigned to staff " + staffId + " (Status: ASSIGNED).");
                return true;
            }
        }
        System.out.println("Ticket " + ticketId + " not found.");
        return false;
    }

    public boolean updateStatus(String ticketId, String newStatus, String notes) {
        for (Ticket t : dataStore.getTickets()) {
            if (t.getTicketId().equalsIgnoreCase(ticketId)) {
                t.setStatus(newStatus.toUpperCase());
                if (notes != null && !notes.trim().isEmpty()) {
                    t.setResolutionNotes(notes);
                }
                dataStore.persistTicket(t);
                System.out.println("Ticket " + ticketId + " updated to " + newStatus.toUpperCase());
                return true;
            }
        }
        System.out.println("Ticket " + ticketId + " not found.");
        return false;
    }
}
