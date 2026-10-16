// NIVAS Modern SpaceBasic-Inspired Landing Page & Authentication Portal
import { state } from '../state.js';
import { authApi } from '../api.js';
import { getIcon } from '../icons.js';

export function renderLoginView() {
  return `
    <div class="landing-page">
      
      <!-- Top Sticky Navigation Bar -->
      <header class="landing-header">
        <div class="landing-nav-container">
          <a href="#" class="landing-brand">
            <div style="width: 38px; height: 38px; border-radius: 10px; background: #fff; border: 1px solid #E2E8F0; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06); display: flex; flex-direction: column; justify-content: center; gap: 3.5px; padding: 7px;">
              <div style="height: 4px; width: 100%; border-radius: 99px; background: #2F54EB;"></div>
              <div style="height: 4px; width: 85%; border-radius: 99px; background: #00B4D8;"></div>
              <div style="height: 4px; width: 70%; border-radius: 99px; background: #FF7A00;"></div>
              <div style="height: 4px; width: 95%; border-radius: 99px; background: #FF3E6C;"></div>
            </div>
            <div>
              <div class="landing-brand-logo">NIVAS</div>
              <div style="font-size: 10px; font-weight: 700; color: var(--color-text-muted); letter-spacing: 0.6px; text-transform: uppercase;">Campus Resident Services</div>
            </div>
          </a>

          <nav class="landing-nav-links">
            <a href="#why-nivas" class="landing-nav-link">Why NIVAS</a>
            <a href="#hostel-management" class="landing-nav-link">Hostel Living</a>
            <a href="#nivas-pay" class="landing-nav-link">NIVAS Pay</a>
            <a href="#smart-ids" class="landing-nav-link">Digital Passes</a>
            <a href="#contact-footer" class="landing-nav-link">Contact</a>
          </nav>

          <div class="landing-nav-actions">
            <button type="button" class="btn-landing-cta" id="btn-portal-signin-scroll">
              Portal Sign In
            </button>
          </div>
        </div>
      </header>

      <!-- Hero Section with Mockup Stage & Portal Login Card -->
      <section class="landing-hero" id="hero-section">
        <div class="landing-hero-container">
          
          <!-- Hero Left: Typography & Live Platform Mockup -->
          <div>
            <div class="hero-tagline-badge">
              <span style="color: #FF7A00; font-size: 14px;">⚡</span>
              <span>2026-27 Academic Session Allocations Live</span>
            </div>

            <h1 class="hero-main-title">
              5x Faster Hostel Operations & Unified Resident Services with <span class="highlight-forest">NIVAS</span>
            </h1>

            <p class="hero-description">
              Seamless campus living, automated single-occupancy bed allocations, annual fee settlements, and 24/7 resident emergency support for students, wardens, and university administration.
            </p>

            <!-- Hero Interactive Phone Device Mockup -->
            <div class="hero-mockup-stage">
              <div class="mockup-circle-bg"></div>

              <!-- Top Floating Badge -->
              <div class="float-badge badge-top-right">
                <div style="width: 26px; height: 26px; border-radius: 50%; background: var(--color-forest); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 11px;">
                  ${getIcon('bed', 14)}
                </div>
                <div>
                  <div style="font-size: 11px; color: var(--color-forest);">Room Allotted!</div>
                  <div style="font-size: 12px; font-weight: 800; color: var(--color-text);">Room 101 • Bed A</div>
                </div>
              </div>

              <!-- Center Device Card -->
              <div class="mockup-main-card">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid var(--color-border);">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 28px; height: 28px; border-radius: 50%; background: var(--color-primary-subtle); color: var(--color-primary); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700;">
                      S
                    </div>
                    <div>
                      <div style="font-size: 12px; font-weight: 800; color: var(--color-text);">Student</div>
                      <div style="font-size: 10px; color: var(--color-text-muted);">MUJ12345 • B.Tech CSE</div>
                    </div>
                  </div>
                  <span class="badge badge-success" style="font-size: 10px;">Active Resident</span>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
                  <div style="background: var(--color-bg); padding: 8px 10px; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
                    <div style="font-size: 10px; color: var(--color-text-muted);">HOSTEL BLOCK</div>
                    <div style="font-size: 13px; font-weight: 800; color: var(--color-forest);">Block A • 1st Floor</div>
                  </div>
                  <div style="background: var(--color-bg); padding: 8px 10px; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
                    <div style="font-size: 10px; color: var(--color-text-muted);">MESS PLAN</div>
                    <div style="font-size: 13px; font-weight: 800; color: #FF7A00;">North Veg 7-Day</div>
                  </div>
                </div>

                <div style="background: var(--color-forest-subtle); padding: 10px 12px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: var(--color-forest);">${getIcon('wifi', 16)}</span>
                    <span style="font-size: 11px; font-weight: 700; color: var(--color-forest);">Wi-Fi Allocation</span>
                  </div>
                  <span style="font-size: 11px; font-weight: 800; color: var(--color-forest);">184 / 300 GB</span>
                </div>
              </div>

              <!-- Bottom Floating Badge -->
              <div class="float-badge badge-bottom-left">
                <div style="width: 26px; height: 26px; border-radius: 50%; background: var(--color-success); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 12px;">
                  ✓
                </div>
                <div>
                  <div style="font-size: 11px; color: var(--color-success);">Fee Settled</div>
                  <div style="font-size: 12px; font-weight: 800; color: var(--color-text);">₹85,000 Verified</div>
                </div>
              </div>

            </div>

          </div>

          <!-- Hero Right: Modern Portal Login Card with Persona Switcher -->
          <div>
            <div class="landing-auth-card" id="landing-auth-card">
              
              <div id="login-form-container">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                  <h2 style="font-size: 24px; font-weight: 800; color: var(--color-text); letter-spacing: -0.5px;">Sign in to NIVAS</h2>
                  <span class="badge badge-info" style="font-size: 10px;">Secure Portal</span>
                </div>
                <p style="font-size: 13px; color: var(--color-text-muted); margin-bottom: 20px;">
                  Select your role or click a demo persona to test live data.
                </p>

                <!-- Role Selector Tabs -->
                <div class="role-tab-group" id="role-tab-group">
                  <button type="button" class="role-tab-btn active" data-role="student">Student</button>
                  <button type="button" class="role-tab-btn" data-role="staff">Staff / Warden</button>
                  <button type="button" class="role-tab-btn" data-role="admin">Admin</button>
                </div>

                <!-- Actual Form -->
                <form id="form-login">
                  <div class="form-group" style="margin-bottom: 14px;">
                    <label class="form-label" for="input-username" style="font-size: 12px;">Registration ID / Username</label>
                    <input type="text" id="input-username" class="form-control" placeholder="e.g. MUJ12345 or ADM01" required value="MUJ12345" />
                  </div>

                  <div class="form-group" style="margin-bottom: 18px;">
                    <label class="form-label" for="input-password" style="font-size: 12px;">Password</label>
                    <input type="password" id="input-password" class="form-control" placeholder="••••••••" required value="student123" />
                  </div>

                  <div id="login-error" style="display: none; padding: 10px 14px; border-radius: var(--radius-md); background: var(--color-danger-bg); color: var(--color-danger); font-size: 13px; margin-bottom: 16px; border: 1px solid var(--color-danger-border);"></div>

                  <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; border-radius: var(--radius-full);" id="btn-submit-login">
                    <span>Sign In to NIVAS</span>
                    ${getIcon('arrowRight', 16)}
                  </button>
                </form>

                <div style="margin-top: 18px; text-align: center; font-size: 11px; color: var(--color-text-muted);">
                  Manipal University Jaipur • Academic Residence Services
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      <!-- Section 2: "Why use NIVAS?" 3-Card Grid (SpaceBasic Reference Image 2) -->
      <section class="why-nivas-section" id="why-nivas">
        <div class="section-title-wrap">
          <div class="section-pretitle">WHY CHOOSE NIVAS?</div>
          <h2 class="section-heading">Why use <span style="color: var(--color-forest);">NIVAS</span>?</h2>
          <p style="font-size: 16px; color: var(--color-text-muted); margin-top: 12px; line-height: 1.6;">
            Purpose-built for modern university residential campuses, streamlining housing operations from admission to graduation.
          </p>
        </div>

        <div class="why-grid">
          
          <!-- Card 1: 30 Mins Onboarding -->
          <div class="feature-card-space">
            <div class="feature-icon-circle sage">
              ${getIcon('bed', 28)}
            </div>
            <h3 class="feature-card-title">Quick, 30 Minutes Onboarding</h3>
            <p class="feature-card-desc">
              Seamlessly onboard students and wardens with minimal disruption, automated profile checks, and instant bed allocations.
            </p>
            <div class="feature-checklist">
              <div class="checklist-item">
                ${getIcon('checkCircle', 16)}
                <span>Instant Bed & Room Allocation</span>
              </div>
              <div class="checklist-item">
                ${getIcon('checkCircle', 16)}
                <span>Single-Occupancy Bed Guarantee</span>
              </div>
              <div class="checklist-item">
                ${getIcon('checkCircle', 16)}
                <span>Personalised Resident Profile Setup</span>
              </div>
            </div>
          </div>

          <!-- Card 2: Obsessed with Resident Success -->
          <div class="feature-card-space">
            <div class="feature-icon-circle coral">
              ${getIcon('phoneCall', 28)}
            </div>
            <h3 class="feature-card-title">Obsessed with Resident Success</h3>
            <p class="feature-card-desc">
              With our integrated assistance desk and round-the-clock maintenance dispatch, resident issues are resolved swiftly.
            </p>
            <div class="feature-checklist">
              <div class="checklist-item">
                ${getIcon('checkCircle', 16)}
                <span>24/7 Warden & Emergency SOS</span>
              </div>
              <div class="checklist-item">
                ${getIcon('checkCircle', 16)}
                <span>Real-Time Ticket Status Updates</span>
              </div>
              <div class="checklist-item">
                ${getIcon('checkCircle', 16)}
                <span>300 GB Monthly Wi-Fi Management</span>
              </div>
            </div>
          </div>

          <!-- Card 3: Enterprise Grade Security -->
          <div class="feature-card-space">
            <div class="feature-icon-circle forest">
              ${getIcon('shield', 28)}
            </div>
            <h3 class="feature-card-title">Enterprise Grade Security</h3>
            <p class="feature-card-desc">
              We are committed to keeping resident data and university operations secure with strict multi-role authorization and audit trails.
            </p>
            <div class="feature-checklist">
              <div class="checklist-item">
                ${getIcon('checkCircle', 16)}
                <span>Role-Based Access: Student, Staff & Admin</span>
              </div>
              <div class="checklist-item">
                ${getIcon('checkCircle', 16)}
                <span>Instant Multi-Role Single-Sign-On</span>
              </div>
              <div class="checklist-item">
                ${getIcon('checkCircle', 16)}
                <span>Tamper-Proof Digital Resident Passes</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- Section 3: Feature Showcases (SpaceBasic Reference Images 3 & 4) -->
      <section class="showcase-section">
        
        <!-- Showcase Row 1: Hostel Management & Room Allocation (Ref Image 4) -->
        <div class="showcase-row" id="hostel-management">
          
          <!-- Mockup Left -->
          <div class="showcase-device-wrap">
            <div class="showcase-circle-backdrop bg-sage"></div>
            
            <div class="phone-mockup-frame">
              <div class="phone-notch"></div>
              <div class="phone-screen-inner">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                  <span style="font-weight: 800; font-size: 12px; color: var(--color-forest);">NIVAS Hostels</span>
                  <span class="badge badge-success" style="font-size: 9px;">98.4% Allotted</span>
                </div>

                <div style="background: #fff; border-radius: var(--radius-md); padding: 12px; border: 1px solid var(--color-border); margin-bottom: 10px;">
                  <div style="font-size: 10px; color: var(--color-text-muted); text-transform: uppercase;">Selected Room & Bed</div>
                  <div style="font-size: 15px; font-weight: 800; color: var(--color-text); margin: 2px 0;">Room 101 • Bed A</div>
                  <div style="font-size: 11px; color: var(--color-forest); font-weight: 700;">Block A • First Floor (Boys Wing)</div>
                </div>

                <div style="background: #fff; border-radius: var(--radius-md); padding: 10px; border: 1px solid var(--color-border); margin-bottom: 8px;">
                  <div style="font-size: 10px; font-weight: 700; color: var(--color-text);">Amenities Verified</div>
                  <div style="display: flex; gap: 6px; margin-top: 6px; flex-wrap: wrap;">
                    <span class="badge badge-neutral" style="font-size: 9px;">Single Bed</span>
                    <span class="badge badge-neutral" style="font-size: 9px;">Study Table</span>
                    <span class="badge badge-neutral" style="font-size: 9px;">Cupboard</span>
                    <span class="badge badge-neutral" style="font-size: 9px;">Balcony</span>
                  </div>
                </div>

                <div style="background: var(--color-sage); border-radius: var(--radius-md); padding: 10px; text-align: center; color: var(--color-forest); font-weight: 800; font-size: 11px;">
                  ✓ Check-in Verification Complete
                </div>
              </div>
            </div>

            <!-- Floating Badges -->
            <div class="phone-floating-pill pos-top-right">
              <div style="width: 24px; height: 24px; border-radius: 50%; background: var(--color-forest); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 11px;">
                ${getIcon('checkCircle', 14)}
              </div>
              <div>
                <div style="font-size: 10px; color: var(--color-forest); font-weight: 700;">Room Allotted!</div>
                <div style="font-size: 11px; color: var(--color-text); font-weight: 800;">ROOM 101 - A</div>
              </div>
            </div>

            <div class="phone-floating-pill pos-bottom-left">
              <div style="width: 24px; height: 24px; border-radius: 50%; background: var(--color-success); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 11px;">
                ✓
              </div>
              <div>
                <div style="font-size: 10px; color: var(--color-success); font-weight: 700;">Leave Approved</div>
                <div style="font-size: 11px; color: var(--color-text); font-weight: 800;">Weekend Out-Pass</div>
              </div>
            </div>

          </div>

          <!-- Content Right -->
          <div>
            <h2 class="showcase-title">Hostel Management & Automated Room Allocation</h2>
            <p class="showcase-desc">
              The simplest way to automate student housing on campus (hostels), end-to-end with real-time floor capacity tracking and zero administrative double-booking.
            </p>

            <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 24px;">
              <div class="checklist-item">
                ${getIcon('checkCircle', 18)}
                <span>Single-Occupancy Bed Allocation Guarantee</span>
              </div>
              <div class="checklist-item">
                ${getIcon('checkCircle', 18)}
                <span>Dynamic Block, Floor & Room Inventory Mapping</span>
              </div>
              <div class="checklist-item">
                ${getIcon('checkCircle', 18)}
                <span>Role-Based Access — from Chief Warden to Security Guards</span>
              </div>
            </div>
          </div>

        </div>

        <!-- Showcase Row 2: SpaceBasic Pay (Ref Image SpaceBasic Pay - Reversed) -->
        <div class="showcase-row reversed" id="nivas-pay">
          
          <!-- Mockup Right (Reversed) -->
          <div class="showcase-device-wrap">
            <div class="showcase-circle-backdrop bg-pink"></div>

            <!-- Floating Green Rupee Badge (Top Left of Device) -->
            <div style="position: absolute; top: 30px; left: 15px; z-index: 5; width: 44px; height: 44px; border-radius: 50%; background: #A7F3D0; color: #047857; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 800; box-shadow: 0 8px 20px rgba(16, 185, 129, 0.25);">
              ₹
            </div>
            
            <div class="phone-mockup-frame">
              <div class="phone-notch"></div>
              <div class="phone-screen-inner" style="background: #fff; padding: 14px 12px;">
                
                <!-- Mockup App Header -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid var(--color-border);">
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="font-size: 14px; color: var(--color-text);">←</span>
                    <span style="font-weight: 800; font-size: 12px; color: var(--color-text);">Payment Tracker</span>
                  </div>
                  <span style="font-size: 13px; color: var(--color-text-muted);">🔍</span>
                </div>

                <!-- Academic Tabs -->
                <div style="display: flex; background: #F1F5F9; border-radius: 99px; padding: 2px; margin-bottom: 12px; font-size: 9px; font-weight: 700; text-align: center;">
                  <span style="flex: 1; padding: 3px 0; color: var(--color-text-muted);">Last Year</span>
                  <span style="flex: 1; padding: 3px 0; background: #2F54EB; color: #fff; border-radius: 99px;">This Year</span>
                  <span style="flex: 1; padding: 3px 0; color: var(--color-text-muted);">Archived</span>
                </div>

                <!-- Donut Chart & Fee Breakdown -->
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px; padding: 8px; background: #F8FAFC; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
                  <!-- SVG Donut Chart with 4 Colors: Green, Blue, Orange, Pink -->
                  <div style="position: relative; width: 68px; height: 68px; flex-shrink: 0;">
                    <svg viewBox="0 0 36 36" style="width: 100%; height: 100%; transform: rotate(-90deg);">
                      <!-- Green arc (45%) -->
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#10B981" stroke-width="4.5" stroke-dasharray="45 100" stroke-dashoffset="0"></circle>
                      <!-- Blue arc (25%) -->
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#2F54EB" stroke-width="4.5" stroke-dasharray="25 100" stroke-dashoffset="-45"></circle>
                      <!-- Orange arc (18%) -->
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#FF7A00" stroke-width="4.5" stroke-dasharray="18 100" stroke-dashoffset="-70"></circle>
                      <!-- Pink arc (12%) -->
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#FF3E6C" stroke-width="4.5" stroke-dasharray="12 100" stroke-dashoffset="-88"></circle>
                    </svg>
                    <div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 7px; font-weight: 800; color: var(--color-text); line-height: 1;">
                      <span style="font-size: 6px; color: var(--color-text-muted);">TOTAL</span>
                      ₹1.30L
                    </div>
                  </div>

                  <div style="flex: 1; font-size: 10px; display: flex; flex-direction: column; gap: 3px;">
                    <div style="display: flex; justify-content: space-between;"><span style="color: #2F54EB; font-weight: 700;">● Tuition Fee</span> <span style="font-weight: 800;">₹1,20,044</span></div>
                    <div style="display: flex; justify-content: space-between;"><span style="color: #FF3E6C; font-weight: 700;">● Hostel Fee</span> <span style="font-weight: 800;">₹12,999</span></div>
                    <div style="display: flex; justify-content: space-between;"><span style="color: #FF7A00; font-weight: 700;">● Mess Fee</span> <span style="font-weight: 800;">₹1,233</span></div>
                  </div>
                </div>

                <!-- Clear Dues with Orange Pay Now Button -->
                <div style="font-size: 10px; font-weight: 800; color: var(--color-text); margin-bottom: 6px;">Clear Dues</div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 8px; background: #fff; border: 1px solid var(--color-border); border-radius: var(--radius-sm); margin-bottom: 6px;">
                  <div>
                    <div style="font-size: 10px; font-weight: 700;">Hostel Room Charges</div>
                    <div style="font-size: 9px; color: var(--color-text-muted);">₹12,999 pending</div>
                  </div>
                  <span style="background: #FF7A00; color: #fff; font-size: 9px; font-weight: 700; padding: 3px 10px; border-radius: 99px;">Pay Now</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 8px; background: #fff; border: 1px solid var(--color-border); border-radius: var(--radius-sm);">
                  <div>
                    <div style="font-size: 10px; font-weight: 700;">Mess Plan Fee</div>
                    <div style="font-size: 9px; color: var(--color-text-muted);">₹1,233 pending</div>
                  </div>
                  <span style="background: #FF7A00; color: #fff; font-size: 9px; font-weight: 700; padding: 3px 10px; border-radius: 99px;">Pay Now</span>
                </div>

              </div>
            </div>

            <!-- Floating Green Received Pill (Bottom Left) -->
            <div class="phone-floating-pill pos-bottom-left" style="color: #047857; border-color: #A7F3D0;">
              <span style="color: #10B981; font-size: 16px; font-weight: 800;">↗</span>
              <div>
                <div style="font-size: 12px; font-weight: 800; color: #047857;">₹ 12,27,131 received !</div>
              </div>
            </div>

            <!-- Floating G Pay Badge (Top Right) -->
            <div class="phone-floating-pill pos-center-right" style="padding: 8px 14px;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="font-weight: 800; font-size: 13px; color: #4285F4;">G</span>
                <span style="font-weight: 800; font-size: 13px; color: #5F6368;">Pay</span>
              </div>
            </div>

          </div>

          <!-- Content Left -->
          <div>
            <h2 class="showcase-title">SpaceBasic Pay</h2>
            <p class="showcase-desc">
              Simplified payments and reconciliation for complex campus payments.
            </p>

            <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 24px;">
              <div class="checklist-item">
                ${getIcon('checkCircle', 18)}
                <span>ZERO Processing Fee</span>
              </div>
              <div class="checklist-item">
                ${getIcon('checkCircle', 18)}
                <span>Simplified Reconciliation</span>
              </div>
              <div class="checklist-item">
                ${getIcon('checkCircle', 18)}
                <span>Centralised Reporting and Tracking</span>
              </div>
            </div>
          </div>

        </div>

        <!-- Showcase Row 3: Smart IDs & Digital Resident Passes (Ref Image 3 & 4) -->
        <div class="showcase-row" id="smart-ids">
          
          <!-- Mockup Left -->
          <div class="showcase-device-wrap">
            <div class="showcase-circle-backdrop bg-purple"></div>

            <!-- Floating Pink Badge (Top Left of Device) -->
            <div style="position: absolute; top: 40px; left: 15px; z-index: 5; width: 44px; height: 44px; border-radius: var(--radius-md); background: #FF3E6C; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 20px; box-shadow: 0 8px 20px rgba(255, 62, 108, 0.3);">
              ${getIcon('shield', 22)}
            </div>
            
            <div class="phone-mockup-frame">
              <div class="phone-notch"></div>
              <div class="phone-screen-inner" style="background: #fff; padding: 16px 12px;">
                <div style="text-align: center; margin-bottom: 10px;">
                  <div style="font-size: 10px; font-weight: 800; color: #2F54EB; text-transform: uppercase;">Manipal University Jaipur</div>
                  <div style="font-size: 12px; font-weight: 800; color: var(--color-text);">Resident Digital Pass</div>
                </div>

                <div style="background: #F8FAFC; border-radius: var(--radius-md); padding: 12px; border: 1px solid var(--color-border); text-align: center; margin-bottom: 10px; box-shadow: var(--shadow-sm);">
                  <div style="width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #2F54EB, #00B4D8); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800; margin: 0 auto 6px;">
                    S
                  </div>
                  <div style="font-size: 13px; font-weight: 800; color: var(--color-text);">Vishesh Shukla</div>
                  <div style="font-size: 10px; color: var(--color-text-muted);">REG: MUJ12345 • Room 101-A</div>

                  <div style="margin: 10px auto; width: 90px; height: 90px; background: #fff; border: 1px solid var(--color-border); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 4px;">
                    <img src="/qr-scanner.png" alt="Gate Verification QR Scanner Code" style="width: 100%; height: 100%; object-fit: contain; image-rendering: crisp-edges;" />
                  </div>
                  <div style="font-size: 9px; color: #2F54EB; font-weight: 700;">SCAN AT CAMPUS GATES</div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; background: #fff; padding: 8px 10px; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
                  <span style="font-size: 10px; font-weight: 700;">Laundry Allowance</span>
                  <span style="font-size: 11px; font-weight: 800; color: #FF7A00;">22 / 30 Used</span>
                </div>
              </div>
            </div>

            <!-- Floating Approval Badge with Blue Toggle (Bottom Right) -->
            <div class="phone-floating-pill pos-bottom-right" style="bottom: 30px; right: 10px; padding: 8px 14px; display: flex; align-items: center; gap: 8px;">
              <div style="width: 26px; height: 26px; border-radius: 50%; background: #0F172A; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 11px;">
                👤
              </div>
              <div>
                <div style="font-size: 10px; color: var(--color-text-muted); font-weight: 600;">Approved</div>
                <div style="font-size: 11px; font-weight: 800; color: var(--color-text);">Father</div>
              </div>
              <div style="width: 32px; height: 18px; border-radius: 99px; background: #2F54EB; display: flex; align-items: center; justify-content: flex-end; padding: 2px; margin-left: 4px;">
                <div style="width: 14px; height: 14px; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.2);"></div>
              </div>
            </div>

          </div>

          <!-- Content Right -->
          <div>
            <h2 class="showcase-title">Smart IDs</h2>
            <p class="showcase-desc">
              Multipurpose Campus ID that works like a physical card, but better!
            </p>

            <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 24px;">
              <div class="checklist-item">
                ${getIcon('checkCircle', 18)}
                <span>For Students, Staffs, and Parents</span>
              </div>
              <div class="checklist-item">
                ${getIcon('checkCircle', 18)}
                <span>Secure, Unique Access</span>
              </div>
              <div class="checklist-item">
                ${getIcon('checkCircle', 18)}
                <span>30-Cycle Monthly Laundry Pass Tracking</span>
              </div>
            </div>
          </div>

        </div>

      </section>

      <!-- Section 4: Modern SpaceBasic-Style Campus Footer (SpaceBasic Reference Image 1) -->
      <footer class="landing-footer" id="contact-footer">
        <div class="landing-footer-container">
          
          <div class="footer-top-grid">
            
            <!-- Brand & Address Column -->
            <div>
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
                <div style="width: 36px; height: 36px; border-radius: var(--radius-md); background: linear-gradient(135deg, var(--color-primary), var(--color-secondary)); display: flex; align-items: center; justify-content: center; color: #fff;">
                  ${getIcon('home', 20)}
                </div>
                <div style="font-family: var(--font-heading); font-size: 22px; font-weight: 800; color: var(--color-forest);">
                  NIVAS
                </div>
              </div>

              <div style="font-size: 13px; color: var(--color-text-muted); line-height: 1.6; margin-bottom: 20px;">
                Hostel Onboarding & Resident Services Platform<br>
                Manipal University Jaipur, Dehmi Kalan<br>
                Jaipur-Ajmer Expressway, Rajasthan 303007
              </div>

              <button type="button" class="btn btn-secondary btn-sm" style="border-radius: var(--radius-full);" onclick="document.querySelector('#landing-auth-card').scrollIntoView({behavior: 'smooth'})">
                Request a Campus Tour
              </button>
            </div>

            <!-- Products Column -->
            <div>
              <div class="footer-heading">Services</div>
              <ul class="footer-links">
                <li><a href="#hostel-management" class="footer-link">Hostel Management</a></li>
                <li><a href="#nivas-pay" class="footer-link">NIVAS Pay & Fees</a></li>
                <li><a href="#smart-ids" class="footer-link">Smart Resident IDs</a></li>
                <li><a href="#" class="footer-link">Laundry Cycle Tracking</a></li>
                <li><a href="#" class="footer-link">Wi-Fi Quota System</a></li>
                <li><a href="#" class="footer-link">Emergency SOS Support</a></li>
              </ul>
            </div>

            <!-- Resident Roles Column -->
            <div>
              <div class="footer-heading">Portals</div>
              <ul class="footer-links">
                <li><a href="#landing-auth-card" class="footer-link">Student Onboarding</a></li>
                <li><a href="#landing-auth-card" class="footer-link">Warden Management</a></li>
                <li><a href="#landing-auth-card" class="footer-link">Chief Warden Console</a></li>
                <li><a href="#landing-auth-card" class="footer-link">Maintenance Staff Desk</a></li>
                <li><a href="#" class="footer-link">Gate Security Check</a></li>
              </ul>
            </div>

          </div>

          <!-- Bottom Footer -->
          <div class="footer-bottom">
            <div>
              © 2026 NIVAS Platform • Manipal University Jaipur. All rights reserved.
            </div>
          </div>

        </div>
      </footer>

    </div>
  `;
}

export function initLoginListeners(container) {
  const formLogin = container.querySelector('#form-login');
  const inputUsername = container.querySelector('#input-username');
  const inputPassword = container.querySelector('#input-password');
  const loginError = container.querySelector('#login-error');
  const btnSubmitLogin = container.querySelector('#btn-submit-login');

  const roleTabBtns = container.querySelectorAll('.role-tab-btn');
  const btnPortalSignin = container.querySelector('#btn-portal-signin-scroll');

  // Header scroll action
  if (btnPortalSignin) {
    btnPortalSignin.addEventListener('click', () => {
      const form = container.querySelector('#landing-auth-card');
      if (form) {
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        inputUsername.focus();
      }
    });
  }

  // Role Tab Switching
  roleTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      roleTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const role = btn.getAttribute('data-role');
      if (role === 'student') {
        inputUsername.value = 'MUJ12345';
        inputPassword.value = 'student123';
      } else if (role === 'staff') {
        inputUsername.value = 'STF01';
        inputPassword.value = 'warden123';
      } else if (role === 'admin') {
        inputUsername.value = 'ADM01';
        inputPassword.value = 'admin123';
      }

      loginError.style.display = 'none';
    });
  });

  // Form Submit Login (Direct login without OTP)
  if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
      e.preventDefault();
      loginError.style.display = 'none';
      btnSubmitLogin.disabled = true;
      btnSubmitLogin.innerHTML = 'Authenticating...';

      try {
        const username = inputUsername.value.trim();
        const password = inputPassword.value;
        const res = await authApi.login(username, password);

        if (res.success) {
          state.setUser(res.user);
          state.setRoute('dashboard');
          state.showToast(`Welcome back, ${res.user.name}!`, 'success');
        }
      } catch (err) {
        loginError.textContent = err.message || 'Login failed. Please check your credentials.';
        loginError.style.display = 'block';
      } finally {
        btnSubmitLogin.disabled = false;
        btnSubmitLogin.innerHTML = `<span>Sign In to NIVAS</span> ${getIcon('arrowRight', 16)}`;
      }
    });
  }
}
