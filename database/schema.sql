-- ====================================================================
-- NIVAS Hostel Management Platform - Relational Database Schema
-- Target: PostgreSQL 12+
-- ====================================================================

-- 1. Base Users Table (Role-based: STUDENT, ADMIN, STAFF)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('STUDENT', 'ADMIN', 'STAFF')),
    department VARCHAR(100),         -- For Admin
    role_designation VARCHAR(100),   -- For Staff
    assigned_block VARCHAR(50),      -- For Staff
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Rooms Table
CREATE TABLE IF NOT EXISTS rooms (
    room_number VARCHAR(20) PRIMARY KEY,
    floor INT NOT NULL,
    block VARCHAR(50) NOT NULL,
    capacity INT NOT NULL
);

-- 3. Room Beds Table
CREATE TABLE IF NOT EXISTS beds (
    bed_code VARCHAR(50) NOT NULL,
    room_number VARCHAR(20) NOT NULL REFERENCES rooms(room_number) ON DELETE CASCADE,
    is_occupied BOOLEAN DEFAULT FALSE,
    allocated_student_id VARCHAR(50),
    PRIMARY KEY (room_number, bed_code)
);

-- 4. Mess Plans Catalog
CREATE TABLE IF NOT EXISTS mess_plans (
    plan_id VARCHAR(50) PRIMARY KEY,
    plan_name VARCHAR(150) NOT NULL,
    description TEXT,
    monthly_cost NUMERIC(10, 2) NOT NULL
);

-- 5. Student Complete State Table
CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(50) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    student_id VARCHAR(50) UNIQUE NOT NULL, -- e.g. MUJ12345
    
    -- Personal details
    full_name VARCHAR(150),
    phone VARCHAR(25),
    gender VARCHAR(20),
    branch VARCHAR(100),
    year INT DEFAULT 1,
    address TEXT,
    guardian_name VARCHAR(150),
    guardian_phone VARCHAR(25),
    
    -- Documents
    document_type VARCHAR(50) DEFAULT 'Aadhaar Card',
    document_number VARCHAR(50),
    document_submitted BOOLEAN DEFAULT FALSE,
    undertaking_accepted BOOLEAN DEFAULT FALSE,
    
    -- Fee Payment
    payment_id VARCHAR(50),
    payment_amount NUMERIC(10, 2) DEFAULT 85000.00,
    payment_status VARCHAR(30) DEFAULT 'PENDING',
    payment_date VARCHAR(50),
    transaction_ref VARCHAR(100),
    
    -- Onboarding Application Status Flags
    personal_details_completed BOOLEAN DEFAULT FALSE,
    documents_submitted_flag BOOLEAN DEFAULT FALSE,
    undertaking_accepted_flag BOOLEAN DEFAULT FALSE,
    fee_paid_flag BOOLEAN DEFAULT FALSE,
    admin_verified BOOLEAN DEFAULT FALSE,
    room_bed_selected BOOLEAN DEFAULT FALSE,
    mess_selected BOOLEAN DEFAULT FALSE,
    laundry_activated BOOLEAN DEFAULT FALSE,
    pass_generated BOOLEAN DEFAULT FALSE,
    
    -- Allocations
    allocated_room VARCHAR(20) REFERENCES rooms(room_number) ON DELETE SET NULL,
    allocated_bed VARCHAR(50),
    mess_plan_id VARCHAR(50) REFERENCES mess_plans(plan_id) ON DELETE SET NULL,
    
    -- Laundry Plan
    laundry_total_cycles INT DEFAULT 30,
    laundry_used_cycles INT DEFAULT 0,
    laundry_status VARCHAR(20) DEFAULT 'INACTIVE',
    
    -- Wi-Fi Account
    wifi_username VARCHAR(100),
    wifi_allocated_gb NUMERIC(8, 2) DEFAULT 300.0,
    wifi_used_gb NUMERIC(8, 2) DEFAULT 0.0,
    
    -- Digital Hostel Pass
    pass_id VARCHAR(50),
    pass_issue_date VARCHAR(50),
    pass_verification_code VARCHAR(100),
    pass_status VARCHAR(30) DEFAULT 'ACTIVE'
);

-- 6. Laundry Requests
CREATE TABLE IF NOT EXISTS laundry_requests (
    request_id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    number_of_clothes INT NOT NULL,
    pickup_date VARCHAR(50) NOT NULL,
    status VARCHAR(30) DEFAULT 'REQUESTED',
    cycle_deducted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Maintenance Tickets
CREATE TABLE IF NOT EXISTS tickets (
    ticket_id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'SUBMITTED',
    created_date VARCHAR(50) NOT NULL,
    assigned_to_staff_id VARCHAR(50) DEFAULT 'UNASSIGNED',
    resolution_notes TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Emergency & Resident Assistance Requests
CREATE TABLE IF NOT EXISTS assistance_requests (
    request_id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    request_type VARCHAR(50) NOT NULL,
    additional_notes TEXT,
    status VARCHAR(30) DEFAULT 'REQUESTED',
    request_time VARCHAR(50) NOT NULL,
    assigned_staff_id VARCHAR(50) DEFAULT 'UNASSIGNED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Announcements Bulletin Board
CREATE TABLE IF NOT EXISTS announcements (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    date VARCHAR(50) NOT NULL,
    author VARCHAR(100) NOT NULL,
    target_audience VARCHAR(30) DEFAULT 'ALL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
