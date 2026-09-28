package service;

import model.Bed;
import model.Room;
import model.Student;
import java.util.ArrayList;

public class RoomService {
    private DataStore dataStore;

    public RoomService() {
        this.dataStore = DataStore.getInstance();
    }

    public ArrayList<Room> getAllRooms() {
        return dataStore.getRooms();
    }

    public ArrayList<Room> getAvailableRooms() {
        ArrayList<Room> available = new ArrayList<>();
        for (Room room : dataStore.getRooms()) {
            if (!room.isFull()) {
                available.add(room);
            }
        }
        return available;
    }

    public void displayAllRooms() {
        System.out.println("================== HOSTEL ROOMS STATUS ==================");
        System.out.printf("%-10s %-10s %-8s %-12s %-15s\n", "Room No", "Block", "Floor", "Capacity", "Availability");
        System.out.println("---------------------------------------------------------");
        for (Room r : dataStore.getRooms()) {
            String avail = r.getAvailableCount() + "/" + r.getCapacity() + " beds free";
            if (r.isFull()) {
                avail = "FULL";
            }
            System.out.printf("%-10s %-10s %-8d %-12d %-15s\n",
                    r.getRoomNumber(), r.getBlock(), r.getFloor(), r.getCapacity(), avail);
        }
        System.out.println("=========================================================");
    }

    public boolean allocateBed(Student student, String roomNumber, String bedCode) {
        Room targetRoom = dataStore.findRoomByNumber(roomNumber);
        if (targetRoom == null) {
            System.out.println("Error: Room " + roomNumber + " does not exist.");
            return false;
        }

        if (targetRoom.isFull()) {
            System.out.println("Error: Room " + roomNumber + " is already at maximum capacity.");
            return false;
        }

        Bed targetBed = targetRoom.findBed(bedCode);
        if (targetBed == null) {
            System.out.println("Error: Bed " + bedCode + " not found in Room " + roomNumber + ".");
            return false;
        }

        if (targetBed.isOccupied()) {
            System.out.println("Error: Bed " + bedCode + " is already occupied by student " + targetBed.getAllocatedStudentId() + ".");
            return false;
        }

        if (student.getAllocatedRoom() != null && student.getAllocatedBed() != null) {
            deallocateBed(student);
        }

        targetBed.allocate(student.getStudentId());
        student.setAllocatedRoom(targetRoom.getRoomNumber());
        student.setAllocatedBed(targetBed.getBedCode());
        student.getOnboardingApp().setRoomBedSelected(true);

        System.out.println("Success: Bed " + targetBed.getBedCode() + " in Room " + targetRoom.getRoomNumber() + " successfully allocated to " + student.getName() + ".");
        return true;
    }

    public void deallocateBed(Student student) {
        if (student.getAllocatedRoom() != null) {
            Room r = dataStore.findRoomByNumber(student.getAllocatedRoom());
            if (r != null && student.getAllocatedBed() != null) {
                Bed b = r.findBed(student.getAllocatedBed());
                if (b != null) {
                    b.deallocate();
                }
            }
            student.setAllocatedRoom(null);
            student.setAllocatedBed(null);
            student.getOnboardingApp().setRoomBedSelected(false);
        }
    }
}
