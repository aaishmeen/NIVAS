-- ====================================================================
-- NIVAS Hostel Management Platform - Rich Demonstration Seed Data
-- ====================================================================

-- 1. Base Users (Admin, Staff, Students)
INSERT INTO users (id, name, email, password, role, department, role_designation, assigned_block)
VALUES 
    -- Administrative Leadership
    ('ADM01', 'Dr. Rajesh Sharma', 'admin@muj.ac.in', 'admin123', 'ADMIN', 'Chief Warden Office', NULL, NULL),
    ('ADM02', 'Prof. Sunita Rao', 'dean.sa@muj.ac.in', 'admin123', 'ADMIN', 'Dean Student Welfare', NULL, NULL),
    
    -- Hostel Staff & Wardens
    ('STF01', 'Mr. Suresh Kumar', 'suresh@muj.ac.in', 'warden123', 'STAFF', NULL, 'Chief Block Warden', 'Block A'),
    ('STF02', 'Mr. Ramesh Verma', 'ramesh@muj.ac.in', 'staff123', 'STAFF', NULL, 'Maintenance Supervisor', 'Block B'),
    ('STF03', 'Mrs. Anita Desai', 'anita@muj.ac.in', 'warden123', 'STAFF', NULL, 'Resident Welfare Officer', 'Block A'),
    ('STF04', 'Mr. Vikram Malhotra', 'vikram.m@muj.ac.in', 'staff123', 'STAFF', NULL, 'Network & Systems Engineer', 'Campus-Wide'),
    ('STF05', 'Ms. Priya Nair', 'priya.nair@muj.ac.in', 'warden123', 'STAFF', NULL, 'Accounts & Billing Officer', 'Central Office'),
    
    -- Student Residents (12 Students across branches & academic years)
    ('STD01', 'Ved Malya', 'ved@muj.ac.in', 'student123', 'STUDENT', NULL, NULL, NULL),
    ('STD02', 'Aarav Patel', 'aarav@muj.ac.in', 'student123', 'STUDENT', NULL, NULL, NULL),
    ('STD03', 'Rohan Iyer', 'rohan@muj.ac.in', 'student123', 'STUDENT', NULL, NULL, NULL),
    ('STD04', 'Sneha Reddy', 'sneha@muj.ac.in', 'student123', 'STUDENT', NULL, NULL, NULL),
    ('STD05', 'Vikram Chauhan', 'vikram@muj.ac.in', 'student123', 'STUDENT', NULL, NULL, NULL),
    ('STD06', 'Ananya Sen', 'ananya@muj.ac.in', 'student123', 'STUDENT', NULL, NULL, NULL),
    ('STD07', 'Aditya Sharma', 'aditya@muj.ac.in', 'student123', 'STUDENT', NULL, NULL, NULL),
    ('STD08', 'Pooja Mehra', 'pooja@muj.ac.in', 'student123', 'STUDENT', NULL, NULL, NULL),
    ('STD09', 'Harsh Vardhan', 'harsh@muj.ac.in', 'student123', 'STUDENT', NULL, NULL, NULL),
    ('STD10', 'Diya Kapoor', 'diya@muj.ac.in', 'student123', 'STUDENT', NULL, NULL, NULL),
    ('STD11', 'Kabir Singhania', 'kabir@muj.ac.in', 'student123', 'STUDENT', NULL, NULL, NULL),
    ('STD12', 'Ritu Bhattacharya', 'ritu@muj.ac.in', 'student123', 'STUDENT', NULL, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name, email = EXCLUDED.email, password = EXCLUDED.password,
    department = EXCLUDED.department, role_designation = EXCLUDED.role_designation,
    assigned_block = EXCLUDED.assigned_block;

-- 2. Rooms (Blocks A, B & C across Floors 1 to 4)
INSERT INTO rooms (room_number, floor, block, capacity)
VALUES 
    ('101', 1, 'Block A', 2),
    ('102', 1, 'Block A', 4),
    ('103', 1, 'Block A', 2),
    ('104', 1, 'Block A', 3),
    ('201', 2, 'Block B', 2),
    ('202', 2, 'Block B', 4),
    ('203', 2, 'Block B', 2),
    ('301', 3, 'Block A', 2),
    ('302', 3, 'Block A', 3),
    ('401', 4, 'Block B', 2)
ON CONFLICT (room_number) DO UPDATE SET 
    floor = EXCLUDED.floor, block = EXCLUDED.block, capacity = EXCLUDED.capacity;

-- 3. Beds (With Realistic Occupancy Distribution)
INSERT INTO beds (bed_code, room_number, is_occupied, allocated_student_id)
VALUES
    -- Room 101 (Block A - 1 Vacant for Ved Malya onboarding / test demo, 1 Occupied)
    ('Bed A', '101', FALSE, NULL),
    ('Bed B', '101', TRUE, 'MUJ12346'),
    
    -- Room 102 (Block A - 3 Occupied, 1 Vacant)
    ('Bed A', '102', TRUE, 'MUJ12347'),
    ('Bed B', '102', TRUE, 'MUJ12351'),
    ('Bed C', '102', TRUE, 'MUJ12353'),
    ('Bed D', '102', FALSE, NULL),
    
    -- Room 103 (Block A - 2 Vacant)
    ('Bed A', '103', FALSE, NULL),
    ('Bed B', '103', FALSE, NULL),

    -- Room 104 (Block A - 1 Occupied, 2 Vacant)
    ('Bed A', '104', TRUE, 'MUJ12355'),
    ('Bed B', '104', FALSE, NULL),
    ('Bed C', '104', FALSE, NULL),
    
    -- Room 201 (Block B - 1 Occupied, 1 Vacant)
    ('Bed A', '201', TRUE, 'MUJ12348'),
    ('Bed B', '201', FALSE, NULL),
    
    -- Room 202 (Block B - 3 Occupied, 1 Vacant)
    ('Bed A', '202', TRUE, 'MUJ12352'),
    ('Bed B', '202', TRUE, 'MUJ12354'),
    ('Bed C', '202', TRUE, 'MUJ12356'),
    ('Bed D', '202', FALSE, NULL),

    -- Room 203 (Block B - 2 Vacant)
    ('Bed A', '203', FALSE, NULL),
    ('Bed B', '203', FALSE, NULL),
    
    -- Room 301 (Block A - 1 Occupied, 1 Vacant)
    ('Bed A', '301', TRUE, 'MUJ12349'),
    ('Bed B', '301', FALSE, NULL),

    -- Room 302 (Block A - 3 Vacant)
    ('Bed A', '302', FALSE, NULL),
    ('Bed B', '302', FALSE, NULL),
    ('Bed C', '302', FALSE, NULL),

    -- Room 401 (Block B - 2 Vacant)
    ('Bed A', '401', FALSE, NULL),
    ('Bed B', '401', FALSE, NULL)
ON CONFLICT (room_number, bed_code) DO UPDATE SET 
    is_occupied = EXCLUDED.is_occupied, allocated_student_id = EXCLUDED.allocated_student_id;

-- 4. Mess Plans Catalog
INSERT INTO mess_plans (plan_id, plan_name, description, monthly_cost)
VALUES
    ('MP01', 'Standard Mess Plan', 'North & South Indian 4-meal buffet with evening snacks and tea', 4500.00),
    ('MP02', 'Premium Mess Plan', 'Multi-cuisine international buffet with live counter, milkshakes and desserts', 6000.00),
    ('MP03', 'Pure Vegetarian Plan', 'Nutritious sattvic pure vegetarian and Jain-friendly balanced meals', 4200.00),
    ('MP04', 'Fitness & High-Protein Plan', 'Custom sports diet with boiled eggs/paneer, sprouts, salads and fruit bowls', 6500.00)
ON CONFLICT (plan_id) DO UPDATE SET 
    plan_name = EXCLUDED.plan_name, description = EXCLUDED.description, monthly_cost = EXCLUDED.monthly_cost;

-- 5. Student Residents (12 Profiles with Diverse Lifecycle States)
INSERT INTO students (
    id, student_id, full_name, phone, gender, branch, year, address, guardian_name, guardian_phone,
    document_type, document_number, document_submitted, undertaking_accepted,
    payment_id, payment_amount, payment_status, payment_date, transaction_ref,
    personal_details_completed, documents_submitted_flag, undertaking_accepted_flag, fee_paid_flag,
    admin_verified, room_bed_selected, mess_selected, laundry_activated, pass_generated,
    allocated_room, allocated_bed, mess_plan_id,
    laundry_total_cycles, laundry_used_cycles, laundry_status,
    wifi_username, wifi_allocated_gb, wifi_used_gb,
    pass_id, pass_issue_date, pass_verification_code, pass_status
)
VALUES 
    -- 1. Ved Malya (Initial state ready for live demo/TestRunner onboarding)
    (
        'STD01', 'MUJ12345', 'Ved Malya', '9876543210', 'Male', 'Computer Science & Engineering', 2, 
        'Plot 42, Malviya Nagar, Jaipur, Rajasthan', 'Anil Malya', '9876500000',
        'Aadhaar Card', '4321-8765-1092', TRUE, TRUE,
        'PAY-1001', 85000.00, 'PAID', '2026-09-20 11:30', 'RZP_LIVE_847291',
        TRUE, TRUE, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE,
        NULL, NULL, NULL,
        30, 0, 'INACTIVE',
        'MUJ12345', 300.00, 15.20,
        NULL, NULL, NULL, 'PENDING'
    ),
    -- 2. Aarav Patel (Fully Onboarded - AI&ML, Block A, Room 101 Bed B)
    (
        'STD02', 'MUJ12346', 'Aarav Patel', '9823456781', 'Male', 'Artificial Intelligence & Machine Learning', 1, 
        '14 Vastrapur Lake Road, Ahmedabad, Gujarat', 'Kirit Patel', '9823400001',
        'Aadhaar Card', '8876-1234-9045', TRUE, TRUE,
        'PAY-1002', 85000.00, 'PAID', '2026-09-22 14:15', 'RZP_LIVE_910384',
        TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE,
        '101', 'Bed B', 'MP02',
        30, 4, 'ACTIVE',
        'MUJ12346', 300.00, 62.10,
        'HP-MUJ12346-802', '2026-09-22', '-1236024102', 'ACTIVE'
    ),
    -- 3. Rohan Iyer (Fully Onboarded - Data Science, Block A, Room 102 Bed A)
    (
        'STD03', 'MUJ12347', 'Rohan Iyer', '9811223344', 'Male', 'Data Science & Analytics', 3, 
        '28 Indiranagar 100ft Road, Bengaluru, Karnataka', 'S. Iyer', '9811200002',
        'Aadhaar Card', '6654-9988-3321', TRUE, TRUE,
        'PAY-1003', 85000.00, 'PAID', '2026-09-23 09:45', 'RZP_LIVE_482019',
        TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE,
        '102', 'Bed A', 'MP03',
        30, 8, 'ACTIVE',
        'MUJ12347', 300.00, 115.40,
        'HP-MUJ12347-803', '2026-09-23', '-1236024103', 'ACTIVE'
    ),
    -- 4. Sneha Reddy (Fully Onboarded - ECE, Block B, Room 201 Bed A)
    (
        'STD04', 'MUJ12348', 'Sneha Reddy', '9844556677', 'Female', 'Electronics & Communication', 2, 
        'Banjara Hills Road No. 12, Hyderabad, Telangana', 'K. V. Reddy', '9844500003',
        'Aadhaar Card', '9912-4455-7788', TRUE, TRUE,
        'PAY-1004', 85000.00, 'PAID', '2026-09-24 16:00', 'RZP_LIVE_639102',
        TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE,
        '201', 'Bed A', 'MP01',
        30, 2, 'ACTIVE',
        'MUJ12348', 300.00, 44.80,
        'HP-MUJ12348-804', '2026-09-24', '-1236024104', 'ACTIVE'
    ),
    -- 5. Vikram Chauhan (Fully Onboarded - IT, Block A, Room 301 Bed A)
    (
        'STD05', 'MUJ12349', 'Vikram Chauhan', '9877889900', 'Male', 'Information Technology', 1, 
        'Sector 17-C, Chandigarh, Punjab', 'Harjit Chauhan', '9877800004',
        'Aadhaar Card', '3344-5566-7788', TRUE, TRUE,
        'PAY-1005', 85000.00, 'PAID', '2026-09-25 10:20', 'RZP_LIVE_774920',
        TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE,
        '301', 'Bed A', 'MP04',
        30, 5, 'ACTIVE',
        'MUJ12349', 300.00, 78.90,
        'HP-MUJ12349-805', '2026-09-25', '-1236024105', 'ACTIVE'
    ),
    -- 6. Ananya Sen (In-Progress: Pending Fee Payment & Room Allocation)
    (
        'STD06', 'MUJ12350', 'Ananya Sen', '9833445566', 'Female', 'Computer Science & Engineering', 3, 
        'Salt Lake Sector V, Kolkata, West Bengal', 'Subhash Sen', '9833400005',
        'Aadhaar Card', '1122-3344-5566', TRUE, TRUE,
        'PAY-PENDING', 85000.00, 'PENDING', 'N/A', 'N/A',
        TRUE, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE,
        NULL, NULL, NULL,
        30, 0, 'INACTIVE',
        'MUJ12350', 300.00, 0.00,
        NULL, NULL, NULL, 'PENDING'
    ),
    -- 7. Aditya Sharma (Fully Onboarded - Cyber Security, Block A, Room 102 Bed B)
    (
        'STD07', 'MUJ12351', 'Aditya Sharma', '9899112233', 'Male', 'Cyber Security', 2,
        'Tower 4, Green Glen Layout, Delhi NCR', 'Rajiv Sharma', '9899100006',
        'Aadhaar Card', '7788-9900-1122', TRUE, TRUE,
        'PAY-1007', 85000.00, 'PAID', '2026-09-21 17:40', 'RZP_LIVE_334912',
        TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE,
        '102', 'Bed B', 'MP01',
        30, 6, 'ACTIVE',
        'MUJ12351', 300.00, 189.50,
        'HP-MUJ12351-807', '2026-09-21', '-1236024107', 'ACTIVE'
    ),
    -- 8. Pooja Mehra (Fully Onboarded - AI&ML, Block B, Room 202 Bed A)
    (
        'STD08', 'MUJ12352', 'Pooja Mehra', '9820011223', 'Female', 'Artificial Intelligence & Machine Learning', 2,
        'Juhu Tara Road, Mumbai, Maharashtra', 'Ashok Mehra', '9820000007',
        'Aadhaar Card', '5566-7788-9900', TRUE, TRUE,
        'PAY-1008', 85000.00, 'PAID', '2026-09-22 13:10', 'RZP_LIVE_883921',
        TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE,
        '202', 'Bed A', 'MP02',
        30, 3, 'ACTIVE',
        'MUJ12352', 300.00, 94.30,
        'HP-MUJ12352-808', '2026-09-22', '-1236024108', 'ACTIVE'
    ),
    -- 9. Harsh Vardhan (Fully Onboarded - Mechanical, Block A, Room 102 Bed C)
    (
        'STD09', 'MUJ12353', 'Harsh Vardhan', '9839011224', 'Male', 'Mechanical Engineering', 4,
        'Gomti Nagar Phase 2, Lucknow, Uttar Pradesh', 'Mahendra Vardhan', '9839000008',
        'Aadhaar Card', '4433-2211-0099', TRUE, TRUE,
        'PAY-1009', 85000.00, 'PAID', '2026-09-23 11:05', 'RZP_LIVE_114829',
        TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE,
        '102', 'Bed C', 'MP04',
        30, 11, 'ACTIVE',
        'MUJ12353', 300.00, 248.60,
        'HP-MUJ12353-809', '2026-09-23', '-1236024109', 'ACTIVE'
    ),
    -- 10. Diya Kapoor (Fully Onboarded - ECE, Block B, Room 202 Bed B)
    (
        'STD10', 'MUJ12354', 'Diya Kapoor', '9867011225', 'Female', 'Electronics & Communication', 1,
        'Koregaon Park Lane 7, Pune, Maharashtra', 'Sanjay Kapoor', '9867000009',
        'Aadhaar Card', '9988-7766-5544', TRUE, TRUE,
        'PAY-1010', 85000.00, 'PAID', '2026-09-24 15:20', 'RZP_LIVE_552910',
        TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE,
        '202', 'Bed B', 'MP03',
        30, 1, 'ACTIVE',
        'MUJ12354', 300.00, 36.40,
        'HP-MUJ12354-810', '2026-09-24', '-1236024110', 'ACTIVE'
    ),
    -- 11. Kabir Singhania (Fully Onboarded - Data Science, Block A, Room 104 Bed A)
    (
        'STD11', 'MUJ12355', 'Kabir Singhania', '9826011226', 'Male', 'Data Science & Analytics', 4,
        'Vijay Nagar Scheme 54, Indore, Madhya Pradesh', 'Devendra Singhania', '9826000010',
        'Aadhaar Card', '1234-9876-5432', TRUE, TRUE,
        'PAY-1011', 85000.00, 'PAID', '2026-09-25 09:15', 'RZP_LIVE_998124',
        TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE,
        '104', 'Bed A', 'MP01',
        30, 14, 'ACTIVE',
        'MUJ12355', 300.00, 282.10,
        'HP-MUJ12355-811', '2026-09-25', '-1236024111', 'ACTIVE'
    ),
    -- 12. Ritu Bhattacharya (Fully Onboarded - IT, Block B, Room 202 Bed C)
    (
        'STD12', 'MUJ12356', 'Ritu Bhattacharya', '9854011227', 'Female', 'Information Technology', 2,
        'GS Road, Christian Basti, Guwahati, Assam', 'Pranab Bhattacharya', '9854000011',
        'Aadhaar Card', '6677-8899-0011', TRUE, TRUE,
        'PAY-1012', 85000.00, 'PAID', '2026-09-25 18:00', 'RZP_LIVE_771239',
        TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE,
        '202', 'Bed C', 'MP02',
        30, 4, 'ACTIVE',
        'MUJ12356', 300.00, 88.70,
        'HP-MUJ12356-812', '2026-09-25', '-1236024112', 'ACTIVE'
    )
ON CONFLICT (id) DO UPDATE SET 
    full_name = EXCLUDED.full_name, phone = EXCLUDED.phone, branch = EXCLUDED.branch,
    payment_status = EXCLUDED.payment_status, allocated_room = EXCLUDED.allocated_room,
    allocated_bed = EXCLUDED.allocated_bed, mess_plan_id = EXCLUDED.mess_plan_id,
    laundry_used_cycles = EXCLUDED.laundry_used_cycles, wifi_used_gb = EXCLUDED.wifi_used_gb,
    pass_generated = EXCLUDED.pass_generated, pass_id = EXCLUDED.pass_id, pass_status = EXCLUDED.pass_status;

-- 6. Laundry Service Requests (10 Requests Across Varied Lifecycle States)
INSERT INTO laundry_requests (request_id, student_id, number_of_clothes, pickup_date, status, cycle_deducted)
VALUES
    ('LR-01', 'MUJ12346', 6, '2026-09-24', 'DELIVERED', TRUE),
    ('LR-02', 'MUJ12347', 8, '2026-09-25', 'DELIVERED', TRUE),
    ('LR-03', 'MUJ12348', 5, '2026-09-25', 'DELIVERED', TRUE),
    ('LR-04', 'MUJ12349', 9, '2026-09-26', 'PROCESSING', FALSE),
    ('LR-05', 'MUJ12351', 7, '2026-09-26', 'PROCESSING', FALSE),
    ('LR-06', 'MUJ12352', 4, '2026-09-26', 'PICKED_UP', FALSE),
    ('LR-07', 'MUJ12353', 10, '2026-09-27', 'PICKED_UP', FALSE),
    ('LR-08', 'MUJ12354', 5, '2026-09-27', 'REQUESTED', FALSE),
    ('LR-09', 'MUJ12355', 8, '2026-09-27', 'REQUESTED', FALSE),
    ('LR-10', 'MUJ12356', 6, '2026-09-27', 'REQUESTED', FALSE)
ON CONFLICT (request_id) DO UPDATE SET 
    status = EXCLUDED.status, cycle_deducted = EXCLUDED.cycle_deducted;

-- 7. Maintenance & Facility Tickets (10 Tickets with Staff Assignments)
INSERT INTO tickets (ticket_id, student_id, category, description, status, created_date, assigned_to_staff_id, resolution_notes)
VALUES
    ('TCK-01', 'MUJ12346', 'Plumbing', 'Washroom shower mixer valve leaking hot water continuously', 'RESOLVED', '2026-09-24', 'STF02', 'Replaced ceramic cartridge valve and tested pressure'),
    ('TCK-02', 'MUJ12347', 'Electrical', 'Ceiling study light table tube fixture flickering', 'RESOLVED', '2026-09-24', 'STF02', 'Fitted new Philips 20W LED ballast and starter'),
    ('TCK-03', 'MUJ12348', 'Carpentry', 'Wardrobe sliding door runner jammed off lower guide rail', 'RESOLVED', '2026-09-25', 'STF01', 'Aligned lower track rollers and applied silicone lubricant'),
    ('TCK-04', 'MUJ12349', 'Air Conditioning', 'AC indoor unit blower whistling at fan speed level 3', 'IN_PROGRESS', '2026-09-26', 'STF02', 'Blower bearings inspected; scheduled for lubrication shift'),
    ('TCK-05', 'MUJ12351', 'Network', 'Ethernet RJ45 wall port in Room 102 has high packet drop', 'IN_PROGRESS', '2026-09-26', 'STF04', 'Re-terminated keystone jack; verifying 1 Gbps link duplex'),
    ('TCK-06', 'MUJ12352', 'Electrical', 'Bedside 5A power socket not charging laptop charger', 'ASSIGNED', '2026-09-26', 'STF02', 'Work order issued to electrician team for evening shift'),
    ('TCK-07', 'MUJ12353', 'Plumbing', 'Bathroom washbasin drain pipe draining water very slowly', 'ASSIGNED', '2026-09-27', 'STF01', 'Scheduled drain chemical flush and pipe unclogging'),
    ('TCK-08', 'MUJ12354', 'Carpentry', 'Study chair ergonomic backrest screw loosened', 'SUBMITTED', '2026-09-27', 'UNASSIGNED', ''),
    ('TCK-09', 'MUJ12355', 'Air Conditioning', 'Remote control display screen cracked and keys unresponsive', 'SUBMITTED', '2026-09-27', 'UNASSIGNED', ''),
    ('TCK-10', 'MUJ12356', 'Network', 'Wi-Fi 5GHz band signal weak near window side of room', 'SUBMITTED', '2026-09-27', 'UNASSIGNED', '')
ON CONFLICT (ticket_id) DO UPDATE SET 
    status = EXCLUDED.status, assigned_to_staff_id = EXCLUDED.assigned_to_staff_id, resolution_notes = EXCLUDED.resolution_notes;

-- 8. Emergency & Resident Care Assistance (8 Real-World Requests)
INSERT INTO assistance_requests (request_id, student_id, request_type, additional_notes, status, request_time, assigned_staff_id)
VALUES
    ('AST-01', 'MUJ12346', 'MEDICAL_HELP', 'High viral fever (102.5 F) with severe chills; oral rehydration & doctor needed', 'COMPLETED', '2026-09-24 03:30', 'STF03'),
    ('AST-02', 'MUJ12347', 'FOOD_IN_ROOM', 'Right foot ankle sprain in compression bandage; requesting mess meal tray delivery', 'COMPLETED', '2026-09-25 12:45', 'STF01'),
    ('AST-03', 'MUJ12348', 'URGENT_HELP', 'Room door lock latch jammed from outside while returning from lab', 'COMPLETED', '2026-09-25 21:10', 'STF01'),
    ('AST-04', 'MUJ12352', 'MEDICAL_HELP', 'Severe allergic reaction on arms after lab session; anti-histamine kit requested', 'IN_PROGRESS', '2026-09-26 16:20', 'STF03'),
    ('AST-05', 'MUJ12353', 'FOOD_IN_ROOM', 'Suffering from stomach flu; requested light khichdi and curd diet from mess', 'IN_PROGRESS', '2026-09-26 19:30', 'STF03'),
    ('AST-06', 'MUJ12354', 'URGENT_HELP', 'Lost hostel RFID access card near Block B staircase; temporary gate entry pass needed', 'ASSIGNED', '2026-09-27 08:50', 'STF01'),
    ('AST-07', 'MUJ12355', 'COUNSELING', 'Appointment requested with student resident welfare counselor regarding exam stress', 'REQUESTED', '2026-09-27 11:15', 'UNASSIGNED'),
    ('AST-08', 'MUJ12356', 'MEDICAL_HELP', 'Acute migraine headache with nausea; requesting campus ambulance to health centre', 'REQUESTED', '2026-09-27 17:40', 'UNASSIGNED')
ON CONFLICT (request_id) DO UPDATE SET 
    status = EXCLUDED.status, assigned_staff_id = EXCLUDED.assigned_staff_id;

-- 9. Announcements Bulletin Board (8 University Notices)
INSERT INTO announcements (id, title, message, date, author, target_audience)
VALUES
    ('ANN01', 'Hostel Verification Week', 'All 2nd year students must complete physical document verification and parent undertakings by Friday 5 PM.', '2026-09-24', 'Chief Warden', 'STUDENT'),
    ('ANN02', 'Hostel Block Inspection & Key Audit', 'All Block Wardens must complete floor room inventory check and report vacant beds by 6 PM today.', '2026-09-25', 'Chief Warden', 'STAFF'),
    ('ANN03', 'Laundry Service Timings & Pickup Window', 'Laundry pickup is available daily between 8:00 AM and 11:00 AM at ground floor counters.', '2026-09-25', 'Hostel Office', 'STUDENT'),
    ('ANN04', 'Maintenance Team Shift Roster Update', 'Staff shift rotation for Block A and Block B electrical repairs has been updated for this week.', '2026-09-26', 'Hostel Supervisor', 'STAFF'),
    ('ANN05', 'Campus High-Speed Wi-Fi Backbone Upgrade', 'Scheduled maintenance on central Wi-Fi backbone fiber routers on Sunday from 2:00 AM to 4:00 AM.', '2026-09-26', 'IT Services', 'ALL'),
    ('ANN06', 'Executive Council Hostel Budget Review', 'Quarterly budget settlement and occupancy reconciliation are scheduled for Monday 10:00 AM in Senate Hall.', '2026-09-27', 'Registrar Office', 'ADMIN'),
    ('ANN07', 'Hostel Cultural Fest & Gala Night', 'Annual hostel cultural evening and music fest will take place on Saturday at the central amphitheater.', '2026-09-27', 'Welfare Council', 'ALL'),
    ('ANN08', 'Mess Menu Special Sunday Feast', 'Special dessert and regional delicacies counter will be set up during Sunday dinner service across all dining halls.', '2026-09-27', 'Mess Committee', 'STUDENT')
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title, message = EXCLUDED.message, author = EXCLUDED.author;
