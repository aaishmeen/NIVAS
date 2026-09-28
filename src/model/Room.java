package model;

import java.util.ArrayList;

public class Room {
    private String roomNumber;
    private int floor;
    private String block;
    private int capacity;
    private ArrayList<Bed> beds;

    public Room(String roomNumber, int floor, String block, int capacity) {
        this.roomNumber = roomNumber;
        this.floor = floor;
        this.block = block;
        this.capacity = capacity;
        this.beds = new ArrayList<>();
        char bedLetter = 'A';
        for (int i = 0; i < capacity; i++) {
            this.beds.add(new Bed("Bed " + bedLetter));
            bedLetter++;
        }
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public int getFloor() {
        return floor;
    }

    public void setFloor(int floor) {
        this.floor = floor;
    }

    public String getBlock() {
        return block;
    }

    public void setBlock(String block) {
        this.block = block;
    }

    public int getCapacity() {
        return capacity;
    }

    public ArrayList<Bed> getBeds() {
        return beds;
    }

    public int getOccupiedCount() {
        int count = 0;
        for (Bed bed : beds) {
            if (bed.isOccupied()) {
                count++;
            }
        }
        return count;
    }

    public int getAvailableCount() {
        return capacity - getOccupiedCount();
    }

    public boolean isFull() {
        return getAvailableCount() <= 0;
    }

    public ArrayList<Bed> getAvailableBeds() {
        ArrayList<Bed> available = new ArrayList<>();
        for (Bed bed : beds) {
            if (!bed.isOccupied()) {
                available.add(bed);
            }
        }
        return available;
    }

    public Bed findBed(String bedCode) {
        for (Bed bed : beds) {
            if (bed.getBedCode().equalsIgnoreCase(bedCode)) {
                return bed;
            }
        }
        return null;
    }
}
