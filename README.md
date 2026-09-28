# NIVAS — Hostel Onboarding & Resident Services Platform

NIVAS is an Academic Java OOP Mini Project designed at a 2nd-year B.Tech CSE level, adhering to the project PRD specifications.

---

## 1. Project Overview & Features

### Onboarding Workflow
1. **Authentication & Session**: First-time OTP dispatch simulation and 10-day session tracking.
2. **Student Profile**: Personal details, academic info, and guardian details.
3. **Documents & Undertaking**: Mock 12-digit Aadhaar submission and hostel rules undertaking acceptance.
4. **Annual Hostel Fee Payment**: Annual ₹85,000 fee payment simulation with Razorpay transaction reference tracking.
5. **Admin Verification**: Administrative verification of submitted documents and payments before room allocation.
6. **Room & Bed Allocation**: Real-time room availability browsing and bed allocation. Strictly enforces room capacity limits and guarantees a bed cannot be allocated to more than one active student.
7. **Mess Plan Selection**: Choice between Standard, Premium, and Vegetarian meal plans.
8. **30-Cycle Laundry Plan**: Allocation of 30 cycles per student, on-demand pickup requests, request lifecycle tracking (`REQUESTED` -> `PICKED_UP` -> `PROCESSING` -> `READY` -> `DELIVERED`), and cycle decrement upon delivery.
9. **Hostel Wi-Fi**: 300 GB monthly quota tracking with allocated, used, and remaining data simulation.
10. **Digital Hostel Pass**: Generated strictly after completing required onboarding stages, complete with verification code and ASCII QR representation.

### Resident Support & Administration
- **Maintenance Tickets**: Non-emergency issue reporting with lifecycle (`SUBMITTED` -> `ASSIGNED` -> `IN_PROGRESS` -> `RESOLVED` -> `CLOSED`).
- **Emergency & Resident Assistance**: Requests for food-in-room, medical help, ambulance, urgent help, or general assistance (`REQUESTED` -> `ACKNOWLEDGED` -> `ASSIGNED` -> `IN_PROGRESS` -> `COMPLETED` / `CANCELLED`).
- **Announcements**: Broadcast board managed by administrators and viewable by all residents and staff.
- **Role-Based Access**: Specialized interfaces for Students, Administrators, and Staff/Wardens.

---

## 2. Java OOP Concepts Demonstrated

- **Encapsulation**: All fields in model classes are declared `private` with public getters and setters.
- **Inheritance**: Base class `User` extended by `Student`, `Admin`, and `Staff`.
- **Polymorphism & Method Overriding**: Subclasses override `displayProfile()` to display role-specific attributes.
- **Composition**: `Student` contains instances of `PersonalDetails`, `Document`, `Payment`, `OnboardingApplication`, `MessPlan`, `LaundryPlan`, `WiFiAccount`, and `HostelPass`.
- **Collections Framework**: Dynamic in-memory management using `ArrayList<T>`.
- **Static Members**: Singleton pattern in `DataStore` and static utility constants.
- **Exception Handling**: Safe user input parsing using `try-catch` blocks with `Scanner`.

---

## 3. Demo Credentials

| Role | Username / ID | Password | Notes |
| :--- | :--- | :--- | :--- |
| **Student** | `MUJ12345` | `student123` | Pre-configured student (Ved Malya) |
| **Student** | `MUJ12346` | `student123` | Second student (Aarav Patel) |
| **Admin** | `ADM01` | `admin123` | Chief Warden Office |
| **Staff / Warden** | `STF01` | `warden123` | Hostel Warden (Block A) |
| **Staff** | `STF02` | `staff123` | Maintenance Supervisor (Block B) |

---

## 4. How to Compile and Run

### Compile All Classes
```bash
javac -d bin src/model/*.java src/service/*.java src/Main.java src/TestRunner.java
```

### Run the Interactive Console Application
```bash
java -cp bin Main
```

### Run the Automated Test Suite (Phases 1–9)
```bash
java -cp bin TestRunner
```