-- ====================================================================
-- NIVAS Hostel Management Platform - Seed Data
-- ====================================================================

-- 1. Insert Base Users (Admin, Staff, Students)
INSERT INTO users (id, name, email, password, role, department, role_designation, assigned_block)
VALUES 
    ('ADM01', 'Dr. Rajesh Sharma', 'admin@muj.ac.in', 'admin123', 'ADMIN', 'Chief Warden Office', NULL, NULL),
    ('STF01', 'Mr. Suresh Kumar', 'suresh@muj.ac.in', 'warden123', 'STAFF', NULL, 'Hostel Warden', 'Block A'),
    ('STF02', 'Mr. Ramesh Verma', 'ramesh@muj.ac.in', 'staff123', 'STAFF', NULL, 'Maintenance Supervisor', 'Block B'),
    ('STD01', 'Ved Malya', 'ved@muj.ac.in', 'student123', 'STUDENT', NULL, NULL, NULL),
    ('STD02', 'Aarav Patel', 'aarav@muj.ac.in', 'student123', 'STUDENT', NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Rooms
INSERT INTO rooms (room_number, floor, block, capacity)
VALUES 
    ('101', 1, 'Block A', 2),
    ('102', 1, 'Block A', 4),
    ('103', 1, 'Block A', 2),
    ('201', 2, 'Block B', 2),
    ('202', 2, 'Block B', 4)
ON CONFLICT (room_number) DO NOTHING;

-- 3. Insert Beds for Rooms
INSERT INTO beds (bed_code, room_number, is_occupied, allocated_student_id)
VALUES
    ('Bed A', '101', FALSE, NULL),
    ('Bed B', '101', FALSE, NULL),
    ('Bed A', '102', FALSE, NULL),
    ('Bed B', '102', FALSE, NULL),
    ('Bed C', '102', FALSE, NULL),
    ('Bed D', '102', FALSE, NULL),
    ('Bed A', '103', FALSE, NULL),
    ('Bed B', '103', FALSE, NULL),
    ('Bed A', '201', FALSE, NULL),
    ('Bed B', '201', FALSE, NULL),
    ('Bed A', '202', FALSE, NULL),
    ('Bed B', '202', FALSE, NULL),
    ('Bed C', '202', FALSE, NULL),
    ('Bed D', '202', FALSE, NULL)
ON CONFLICT (room_number, bed_code) DO NOTHING;

-- 4. Insert Mess Plans
INSERT INTO mess_plans (plan_id, plan_name, description, monthly_cost)
VALUES
    ('MP01', 'Standard Mess Plan', 'North & South Indian 4-meal buffet', 4500.00),
    ('MP02', 'Premium Mess Plan', 'Multi-cuisine buffet with live counter and desserts', 6000.00),
    ('MP03', 'Pure Vegetarian Plan', 'Nutritious pure vegetarian and Jain-friendly meals', 4200.00)
ON CONFLICT (plan_id) DO NOTHING;

-- 5. Insert Student Profiles & Onboarding State
INSERT INTO students (
    id, student_id, full_name, phone, gender, branch, year, address, guardian_name, guardian_phone,
    document_type, document_number, document_submitted, undertaking_accepted,
    payment_amount, payment_status,
    personal_details_completed, documents_submitted_flag, undertaking_accepted_flag, fee_paid_flag,
    admin_verified, room_bed_selected, mess_selected, laundry_activated, pass_generated,
    laundry_total_cycles, laundry_used_cycles, laundry_status,
    wifi_username, wifi_allocated_gb, wifi_used_gb
)
VALUES 
    (
        'STD01', 'MUJ12345', 'Ved Malya', '9876543210', 'Male', 'Computer Science & Engineering', 2, 
        'Jaipur, Rajasthan', 'Anil Malya', '9876500000',
        'Aadhaar Card', NULL, FALSE, FALSE,
        85000.00, 'PENDING',
        TRUE, FALSE, FALSE, FALSE,
        FALSE, FALSE, FALSE, FALSE, FALSE,
        30, 0, 'INACTIVE',
        'MUJ12345', 300.00, 0.00
    ),
    (
        'STD02', 'MUJ12346', 'Aarav Patel', NULL, NULL, NULL, 1, 
        NULL, NULL, NULL,
        'Aadhaar Card', NULL, FALSE, FALSE,
        85000.00, 'PENDING',
        FALSE, FALSE, FALSE, FALSE,
        FALSE, FALSE, FALSE, FALSE, FALSE,
        30, 0, 'INACTIVE',
        'MUJ12346', 300.00, 0.00
    )
ON CONFLICT (id) DO NOTHING;

-- 6. Insert Announcements
INSERT INTO announcements (id, title, message, date, author, target_audience)
VALUES
    ('ANN01', 'Hostel Verification Week', 'All 2nd year students must complete document verification by Friday.', '2026-09-25', 'Chief Warden', 'STUDENT'),
    ('ANN02', 'Hostel Block Inspection & Key Audit', 'All Block Wardens must complete floor room inventory check and report vacant beds by 6 PM.', '2026-09-26', 'Chief Warden', 'STAFF'),
    ('ANN03', 'Laundry Service Timings & Pickup Window', 'Laundry pickup is available daily between 8:00 AM and 11:00 AM at ground floor counters.', '2026-09-26', 'Hostel Office', 'STUDENT'),
    ('ANN04', 'Maintenance Team Duty Roster Update', 'Staff shift rotation for Block A and Block B electrical repairs has been updated for this week.', '2026-09-27', 'Hostel Supervisor', 'STAFF'),
    ('ANN05', 'Executive Council Hostel Review', 'Quarterly budget settlement and occupancy reconciliation are scheduled for Monday 10 AM.', '2026-09-28', 'Registrar Office', 'ADMIN'),
    ('ANN06', 'Campus High-Speed Wi-Fi Maintenance', 'Scheduled maintenance on central Wi-Fi backbone routers on Sunday from 2 AM to 4 AM.', '2026-09-28', 'IT Services', 'ALL')
ON CONFLICT (id) DO NOTHING;

-- 7. Insert Initial Ticket
INSERT INTO tickets (ticket_id, student_id, category, description, status, created_date, assigned_to_staff_id, resolution_notes)
VALUES
    ('TCK101', 'MUJ12345', 'Plumbing', 'Minor tap leakage in washroom', 'SUBMITTED', '2026-09-27', 'UNASSIGNED', '')
ON CONFLICT (ticket_id) DO NOTHING;
