// NIVAS 9-Stage Student Onboarding View
import { state } from '../../state.js';
import { studentApi, roomsApi, messApi } from '../../api.js';
import { getIcon } from '../../icons.js';

export async function renderOnboardingView() {
  const user = state.user;
  const container = document.createElement('div');
  container.className = 'onboarding-view';
  container.innerHTML = `<div class="empty-state"><p>Loading onboarding application state...</p></div>`;

  try {
    const res = await studentApi.getDashboard(user.studentId || user.id);
    if (!res.success || !res.student) {
      container.innerHTML = `<div class="empty-state"><p>Could not retrieve student application.</p></div>`;
      return container;
    }

    const s = res.student;
    const app = s.onboardingApp || {};
    const roomsRes = await roomsApi.getAll();
    const rooms = roomsRes.success ? roomsRes.rooms : [];
    const messRes = await messApi.getAll();
    const messPlans = messRes.success ? messRes.messPlans : [];

    // Calculate active step index (1-9)
    let currentStepIndex = 1;
    if (!app.personalDetailsCompleted) currentStepIndex = 1;
    else if (!app.documentsSubmitted) currentStepIndex = 2;
    else if (!app.undertakingAccepted) currentStepIndex = 3;
    else if (!app.feePaid) currentStepIndex = 4;
    else if (!app.adminVerified) currentStepIndex = 5;
    else if (!app.roomBedSelected) currentStepIndex = 6;
    else if (!app.messSelected) currentStepIndex = 7;
    else if (!app.laundryPlanActivated) currentStepIndex = 8;
    else if (!app.hostelPassGenerated) currentStepIndex = 9;
    else currentStepIndex = 9;

    const steps = [
      { num: 1, label: 'Details', done: app.personalDetailsCompleted },
      { num: 2, label: 'Aadhaar', done: app.documentsSubmitted },
      { num: 3, label: 'Rules', done: app.undertakingAccepted },
      { num: 4, label: 'Fee Payment', done: app.feePaid },
      { num: 5, label: 'Verification', done: app.adminVerified },
      { num: 6, label: 'Room & Bed', done: app.roomBedSelected },
      { num: 7, label: 'Mess Plan', done: app.messSelected },
      { num: 8, label: 'Laundry', done: app.laundryPlanActivated },
      { num: 9, label: 'Hostel Pass', done: app.hostelPassGenerated }
    ];

    const completedCount = steps.filter(st => st.done).length;
    const progressPercent = Math.round((completedCount / steps.length) * 100);

    container.innerHTML = `
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 24px; font-weight: 800; color: var(--color-text);">Hostel Onboarding Pipeline</h2>
        <p style="font-size: 14px; color: var(--color-text-muted);">
          Complete each of the 9 required stages to secure your verified hostel accommodation and official digital pass.
        </p>
      </div>

      <!-- Stepper Progress Bar -->
      <div class="card" style="margin-bottom: 28px; padding: 24px 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
          <span style="font-size: 13px; font-weight: 700; color: var(--color-forest);">
            STAGE PROGRESSION: ${completedCount} OF 9 COMPLETED (${progressPercent}%)
          </span>
          <span class="badge ${app.isCompleted ? 'badge-success' : 'badge-terracotta'}">
            ${app.isCompleted ? 'Onboarding Completed' : `Current Stage: ${app.nextStep}`}
          </span>
        </div>

        <div style="position: relative; display: flex; justify-content: space-between; align-items: center; padding: 10px 0;">
          <div style="position: absolute; top: 22px; left: 20px; right: 20px; height: 3px; background: var(--color-border); z-index: 1;"></div>
          <div style="position: absolute; top: 22px; left: 20px; width: ${Math.max(0, (completedCount / 8) * 94)}%; height: 3px; background: linear-gradient(90deg, var(--color-forest), var(--color-primary)); z-index: 2; transition: width 0.3s;"></div>

          ${steps.map(st => `
            <div style="position: relative; z-index: 3; display: flex; flex-direction: column; align-items: center; gap: 6px;">
              <div style="width: 28px; height: 28px; border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; background: ${st.done ? 'var(--color-forest)' : (st.num === currentStepIndex ? 'var(--color-primary)' : '#fff')}; color: ${st.done || st.num === currentStepIndex ? '#fff' : 'var(--color-text-muted)'}; border: 2px solid ${st.done ? 'var(--color-forest)' : (st.num === currentStepIndex ? 'var(--color-primary)' : 'var(--color-border)')}; box-shadow: ${st.num === currentStepIndex ? '0 0 0 3px var(--color-primary-subtle)' : 'none'};">
                ${st.done ? '✓' : st.num}
              </div>
              <span style="font-size: 11px; font-weight: 600; color: ${st.num === currentStepIndex ? 'var(--color-primary)' : (st.done ? 'var(--color-forest)' : 'var(--color-text-muted)')}; text-align: center;">
                ${st.label}
              </span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Stage Cards Accordion -->
      <div style="display: flex; flex-direction: column; gap: 20px;">

        <!-- STEP 1: Personal Details -->
        <div class="card ${app.personalDetailsCompleted ? '' : 'active-stage'}" style="border-left: 4px solid ${app.personalDetailsCompleted ? 'var(--color-success)' : 'var(--color-primary)'};">
          <div class="card-header">
            <div>
              <h3 class="card-title">
                <span>1. Personal & Guardian Details</span>
                ${app.personalDetailsCompleted ? `<span class="badge badge-success">✓ Completed</span>` : `<span class="badge badge-warning">Action Required</span>`}
              </h3>
              <p class="card-subtitle">Student academic and emergency contact registration</p>
            </div>
          </div>
          
          <form id="form-step-1">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Full Name</label>
                <input type="text" class="form-control" name="fullName" required value="${s.personalDetails.fullName || s.name || ''}" />
              </div>
              <div class="form-group">
                <label class="form-label">Phone Number (10 digits)</label>
                <input type="text" class="form-control" name="phone" required placeholder="9876543210" value="${s.personalDetails.phone || ''}" />
              </div>
              <div class="form-group">
                <label class="form-label">Gender</label>
                <select class="form-control" name="gender">
                  <option value="Male" ${s.personalDetails.gender === 'Male' ? 'selected' : ''}>Male</option>
                  <option value="Female" ${s.personalDetails.gender === 'Female' ? 'selected' : ''}>Female</option>
                  <option value="Other" ${s.personalDetails.gender === 'Other' ? 'selected' : ''}>Other</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Branch of Study</label>
                <input type="text" class="form-control" name="branch" value="${s.personalDetails.branch || 'Computer Science & Engineering'}" required />
              </div>
              <div class="form-group">
                <label class="form-label">Year of Study</label>
                <input type="number" class="form-control" name="year" min="1" max="5" value="${s.personalDetails.year || 2}" required />
              </div>
              <div class="form-group">
                <label class="form-label">Permanent Home Address</label>
                <input type="text" class="form-control" name="address" placeholder="City, State" value="${s.personalDetails.address || ''}" required />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Guardian / Parent Full Name</label>
                <input type="text" class="form-control" name="guardianName" placeholder="Guardian Name" value="${s.personalDetails.guardianName || ''}" required />
              </div>
              <div class="form-group">
                <label class="form-label">Guardian Emergency Contact</label>
                <input type="text" class="form-control" name="guardianPhone" placeholder="Guardian Phone" value="${s.personalDetails.guardianPhone || ''}" required />
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-sm">
              ${app.personalDetailsCompleted ? 'Update Details' : 'Save & Continue to Step 2'}
            </button>
          </form>
        </div>

        <!-- STEP 2: Document Submission (Aadhaar) -->
        <div class="card" style="border-left: 4px solid ${app.documentsSubmitted ? 'var(--color-success)' : (app.personalDetailsCompleted ? 'var(--color-primary)' : 'var(--color-border)')};">
          <div class="card-header">
            <div>
              <h3 class="card-title">
                <span>2. Identity Verification (Mock 12-Digit Aadhaar)</span>
                ${app.documentsSubmitted ? `<span class="badge badge-success">✓ Uploaded (${s.document.documentNumber})</span>` : `<span class="badge ${app.personalDetailsCompleted ? 'badge-warning' : 'badge-info'}">Step 2</span>`}
              </h3>
              <p class="card-subtitle">Official national identification record for hostel admission</p>
            </div>
          </div>

          ${!app.personalDetailsCompleted ? `
            <div style="font-size: 13px; color: var(--color-text-muted);">Complete Step 1 (Personal Details) to unlock Aadhaar submission.</div>
          ` : `
            <form id="form-step-2">
              <div class="form-row">
                <div class="form-group" style="max-width: 320px;">
                  <label class="form-label">12-Digit Aadhaar Number</label>
                  <input type="text" class="form-control" name="aadhaarNumber" placeholder="1234-5678-9012" value="${s.document.documentNumber || '1234-5678-9012'}" required />
                </div>
              </div>
              <button type="submit" class="btn btn-primary btn-sm">
                ${app.documentsSubmitted ? 'Re-upload Aadhaar' : 'Submit Aadhaar Document'}
              </button>
            </form>
          `}
        </div>

        <!-- STEP 3: Undertaking Acceptance -->
        <div class="card" style="border-left: 4px solid ${app.undertakingAccepted ? 'var(--color-success)' : (app.documentsSubmitted ? 'var(--color-primary)' : 'var(--color-border)')};">
          <div class="card-header">
            <div>
              <h3 class="card-title">
                <span>3. Hostel Rules & Code of Conduct Undertaking</span>
                ${app.undertakingAccepted ? `<span class="badge badge-success">✓ Accepted</span>` : `<span class="badge ${app.documentsSubmitted ? 'badge-warning' : 'badge-info'}">Step 3</span>`}
              </h3>
              <p class="card-subtitle">Acceptance of university campus housing rules and regulations</p>
            </div>
          </div>

          ${!app.documentsSubmitted ? `
            <div style="font-size: 13px; color: var(--color-text-muted);">Complete Step 2 (Aadhaar Upload) to unlock the rules undertaking.</div>
          ` : `
            <div>
              <div style="max-height: 140px; overflow-y: auto; padding: 14px; background: var(--color-bg); border-radius: var(--radius-md); border: 1px solid var(--color-border); font-size: 12px; line-height: 1.6; color: var(--color-text-muted); margin-bottom: 14px;">
                <strong>UNIVERSITY HOSTEL UNDERTAKING & BYLAWS (2026-27):</strong><br>
                1. Ragging in any form is strictly banned on and off campus under the UGC anti-ragging regulations.<br>
                2. Strict curfew hours are enforced daily at 10:30 PM. Late entry requires written permission from the Chief Warden.<br>
                3. Electrical appliances exceeding 500W (heaters, heavy cooking appliances) are not permitted in residential rooms.<br>
                4. Residents must maintain peace and quiet during study hours (09:00 PM to 06:00 AM).<br>
                5. Smoking, consumption of alcohol, or illegal substances is grounds for immediate expulsion.
              </div>

              <form id="form-step-3">
                <label style="display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 600; cursor: pointer; margin-bottom: 14px;">
                  <input type="checkbox" id="chk-undertaking" ${app.undertakingAccepted ? 'checked' : ''} required />
                  <span>I have read, understood, and accept all hostel rules and regulations without exception.</span>
                </label>
                <button type="submit" class="btn btn-primary btn-sm" ${app.undertakingAccepted ? 'disabled' : ''}>
                  ${app.undertakingAccepted ? 'Undertaking Signed & Active' : 'Sign & Accept Undertaking'}
                </button>
              </form>
            </div>
          `}
        </div>

        <!-- STEP 4: Annual Hostel Fee Payment -->
        <div class="card" style="border-left: 4px solid ${app.feePaid ? 'var(--color-success)' : (app.undertakingAccepted ? 'var(--color-primary)' : 'var(--color-border)')};">
          <div class="card-header">
            <div>
              <h3 class="card-title">
                <span>4. Annual Hostel Fee Settlement</span>
                ${app.feePaid ? `<span class="badge badge-success">✓ Paid (₹85,000)</span>` : `<span class="badge ${app.undertakingAccepted ? 'badge-warning' : 'badge-info'}">Step 4</span>`}
              </h3>
              <p class="card-subtitle">₹85,000 annual accommodation & facility fee via Razorpay test simulation</p>
            </div>
          </div>

          ${!app.undertakingAccepted ? `
            <div style="font-size: 13px; color: var(--color-text-muted);">Sign the undertaking in Step 3 to proceed to annual fee payment.</div>
          ` : (app.feePaid ? `
            <div style="background: var(--color-success-bg); border: 1px solid var(--color-success-border); padding: 14px 18px; border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
              <div>
                <div style="font-weight: 700; color: var(--color-success); font-size: 14px;">Hostel Annual Fee: ₹85,000 PAID IN FULL</div>
                <div style="font-size: 12px; color: var(--color-text-muted); margin-top: 2px;">
                  Payment ID: <strong>${s.payment.paymentId}</strong> • Ref: <strong>${s.payment.transactionRef}</strong> • Date: ${s.payment.paymentDate}
                </div>
              </div>
              <span class="badge badge-success">Razorpay Verified</span>
            </div>
          ` : `
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px; background: var(--color-bg); border-radius: var(--radius-md); border: 1px solid var(--color-border); margin-bottom: 14px;">
                <div>
                  <div style="font-size: 14px; font-weight: 700; color: var(--color-text);">Annual Residential Fee (Academic 2026-27)</div>
                  <div style="font-size: 12px; color: var(--color-text-muted);">Includes room maintenance, 30 laundry cycles, and high-speed Wi-Fi</div>
                </div>
                <div style="font-family: var(--font-heading); font-size: 22px; font-weight: 800; color: var(--color-forest);">₹85,000</div>
              </div>
              <button class="btn btn-primary" id="btn-pay-fee">
                ${getIcon('creditCard', 16)}
                <span>Simulate Razorpay Payment (₹85,000)</span>
              </button>
            </div>
          `)}
        </div>

        <!-- STEP 5: Admin Verification Gate -->
        <div class="card" style="border-left: 4px solid ${app.adminVerified ? 'var(--color-success)' : (app.feePaid ? 'var(--color-warning)' : 'var(--color-border)')};">
          <div class="card-header">
            <div>
              <h3 class="card-title">
                <span>5. Administrative Verification Gate</span>
                ${app.adminVerified ? `<span class="badge badge-success">✓ Verified by Chief Warden</span>` : `<span class="badge ${app.feePaid ? 'badge-warning' : 'badge-info'}">Step 5</span>`}
              </h3>
              <p class="card-subtitle">Mandatory administrative verification of documents and fee clearance</p>
            </div>
          </div>

          ${!app.feePaid ? `
            <div style="font-size: 13px; color: var(--color-text-muted);">Complete Step 4 (Fee Payment) before administrative verification can occur.</div>
          ` : (app.adminVerified ? `
            <div style="display: flex; align-items: center; gap: 12px; color: var(--color-success); font-weight: 600; font-size: 14px;">
              ${getIcon('checkCircle', 20)}
              <span>Application approved and verified by Chief Warden Office. Room & Bed allocation is unlocked!</span>
            </div>
          ` : `
            <div style="background: var(--color-warning-bg); border: 1px solid var(--color-warning-border); border-radius: var(--radius-md); padding: 16px;">
              <div style="display: flex; align-items: flex-start; gap: 12px;">
                <span style="color: var(--color-warning);">${getIcon('clock', 22)}</span>
                <div>
                  <div style="font-weight: 700; color: var(--color-warning); font-size: 14px;">Awaiting Administrative Approval</div>
                  <p style="font-size: 13px; color: var(--color-text); margin-top: 4px; line-height: 1.45;">
                    Your fee payment has been registered. The Chief Warden Office must verify your documents before you can choose a room.
                    <br><em>(Tip: You can switch to the Admin demo account <strong>ADM01</strong> to approve this application immediately!)</em>
                  </p>
                </div>
              </div>
            </div>
          `)}
        </div>

        <!-- STEP 6: Room & Bed Allocation -->
        <div class="card" style="border-left: 4px solid ${app.roomBedSelected ? 'var(--color-success)' : (app.adminVerified ? 'var(--color-primary)' : 'var(--color-border)')};">
          <div class="card-header">
            <div>
              <h3 class="card-title">
                <span>6. Room & Single-Occupancy Bed Allocation</span>
                ${app.roomBedSelected ? `<span class="badge badge-success">✓ Allocated (Room ${s.allocatedRoom} • ${s.allocatedBed})</span>` : `<span class="badge ${app.adminVerified ? 'badge-warning' : 'badge-info'}">Step 6</span>`}
              </h3>
              <p class="card-subtitle">Real-time room availability browsing with strict single-occupancy bed guarantee</p>
            </div>
          </div>

          ${!app.adminVerified ? `
            <div style="font-size: 13px; color: var(--color-text-muted);">Administrative verification in Step 5 is required to access room selection.</div>
          ` : `
            <div>
              <p style="font-size: 13px; color: var(--color-text-muted); margin-bottom: 14px;">
                Select an available room and click an unallocated bed to secure your accommodation:
              </p>

              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">
                ${rooms.map(r => `
                  <div class="card" style="padding: 16px; border: 1px solid ${s.allocatedRoom === r.roomNumber ? 'var(--color-forest)' : 'var(--color-border)'}; background: ${s.allocatedRoom === r.roomNumber ? 'var(--color-sage-subtle)' : '#fff'};">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                      <div>
                        <strong style="font-size: 16px; color: var(--color-text);">Room ${r.roomNumber}</strong>
                        <span style="font-size: 12px; color: var(--color-text-muted); margin-left: 6px;">(${r.block} • Floor ${r.floor})</span>
                      </div>
                      <span class="badge ${r.isFull ? 'badge-danger' : 'badge-info'}">${r.availableCount}/${r.capacity} beds free</span>
                    </div>

                    <div style="display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap;">
                      ${r.beds.map(b => {
                        const isMyBed = s.allocatedRoom === r.roomNumber && s.allocatedBed === b.bedCode;
                        const isTaken = b.occupied && !isMyBed;
                        return `
                          <button class="btn btn-sm btn-select-bed ${isMyBed ? 'btn-forest' : (isTaken ? 'btn-secondary' : 'btn-sage')}"
                            data-room="${r.roomNumber}" data-bed="${b.bedCode}" ${isTaken ? 'disabled' : ''} style="flex: 1; min-width: 90px;">
                            ${isMyBed ? `✓ ${b.bedCode}` : (isTaken ? `Occupied` : `Select ${b.bedCode}`)}
                          </button>
                        `;
                      }).join('')}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `}
        </div>

        <!-- STEP 7: Mess Plan Selection -->
        <div class="card" style="border-left: 4px solid ${app.messSelected ? 'var(--color-success)' : (app.roomBedSelected ? 'var(--color-primary)' : 'var(--color-border)')};">
          <div class="card-header">
            <div>
              <h3 class="card-title">
                <span>7. Mess & Meal Plan Selection</span>
                ${app.messSelected ? `<span class="badge badge-success">✓ Selected (${s.messPlan ? s.messPlan.planName : 'Standard'})</span>` : `<span class="badge ${app.roomBedSelected ? 'badge-warning' : 'badge-info'}">Step 7</span>`}
              </h3>
              <p class="card-subtitle">Choose your dietary meal subscription plan</p>
            </div>
          </div>

          ${!app.roomBedSelected ? `
            <div style="font-size: 13px; color: var(--color-text-muted);">Allocate your room and bed in Step 6 to select a mess plan.</div>
          ` : `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">
              ${messPlans.map(mp => {
                const isSelected = s.messPlan && s.messPlan.planId === mp.planId;
                return `
                  <div class="card" style="padding: 18px; border: 2px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}; background: ${isSelected ? 'var(--color-primary-subtle)' : '#fff'};">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                      <div>
                        <strong style="font-size: 16px; color: var(--color-text);">${mp.planName}</strong>
                        <div style="font-size: 12px; color: var(--color-forest); font-weight: 700;">Plan ID: ${mp.planId}</div>
                      </div>
                      <div style="font-family: var(--font-heading); font-size: 18px; font-weight: 800; color: var(--color-forest);">₹${mp.monthlyFee}/mo</div>
                    </div>
                    <p style="font-size: 13px; color: var(--color-text-muted); margin-bottom: 14px; min-height: 40px;">${mp.description}</p>
                    <button class="btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'} btn-select-mess" data-plan="${mp.planId}" style="width: 100%;">
                      ${isSelected ? 'Active Plan' : 'Select This Plan'}
                    </button>
                  </div>
                `;
              }).join('')}
            </div>
          `}
        </div>

        <!-- STEP 8: Laundry Plan Activation -->
        <div class="card" style="border-left: 4px solid ${app.laundryPlanActivated ? 'var(--color-success)' : (app.messSelected ? 'var(--color-primary)' : 'var(--color-border)')};">
          <div class="card-header">
            <div>
              <h3 class="card-title">
                <span>8. 30-Cycle Laundry Plan Activation</span>
                ${app.laundryPlanActivated ? `<span class="badge badge-success">✓ 30 Cycles Active</span>` : `<span class="badge ${app.messSelected ? 'badge-warning' : 'badge-info'}">Step 8</span>`}
              </h3>
              <p class="card-subtitle">Complimentary 30 wash cycles credited for the academic year</p>
            </div>
          </div>

          ${!app.messSelected ? `
            <div style="font-size: 13px; color: var(--color-text-muted);">Select a mess plan in Step 7 to activate your laundry account.</div>
          ` : `
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; padding: 14px 18px; background: var(--color-bg); border-radius: var(--radius-md);">
              <div style="display: flex; align-items: center; gap: 14px;">
                <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: var(--color-sage); color: var(--color-forest); display: flex; align-items: center; justify-content: center;">
                  ${getIcon('shirt', 24)}
                </div>
                <div>
                  <div style="font-weight: 700; color: var(--color-text); font-size: 15px;">Hostel Laundry Package Active</div>
                  <div style="font-size: 13px; color: var(--color-text-muted);">
                    Remaining Balance: <strong>${s.laundryPlan ? s.laundryPlan.remainingCycles : 30} cycles</strong> (1 cycle automatically deducted upon delivery).
                  </div>
                </div>
              </div>
              <span class="badge badge-success">Activated</span>
            </div>
          `}
        </div>

        <!-- STEP 9: Digital Hostel Pass Generation -->
        <div class="card" style="border-left: 4px solid ${app.hostelPassGenerated ? 'var(--color-success)' : (app.messSelected && app.roomBedSelected ? 'var(--color-primary)' : 'var(--color-border)')};">
          <div class="card-header">
            <div>
              <h3 class="card-title">
                <span>9. Digital Hostel Pass Issuance</span>
                ${app.hostelPassGenerated ? `<span class="badge badge-success">✓ Issued & Active</span>` : `<span class="badge ${app.roomBedSelected ? 'badge-warning' : 'badge-info'}">Step 9</span>`}
              </h3>
              <p class="card-subtitle">Official verified residence pass with ASCII/QR code and security checksum</p>
            </div>
          </div>

          ${!app.roomBedSelected || !app.messSelected || !app.adminVerified ? `
            <div style="font-size: 13px; color: var(--color-text-muted);">Complete all prior stages (1 to 8) to generate your official Digital Hostel Pass.</div>
          ` : (app.hostelPassGenerated ? `
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
              <div>
                <div style="font-weight: 700; color: var(--color-forest); font-size: 15px;">Digital Hostel Pass Generated!</div>
                <div style="font-size: 13px; color: var(--color-text-muted); margin-top: 2px;">
                  Pass ID: <strong>${s.hostelPass ? s.hostelPass.passId : 'Active'}</strong> • Checksum: <strong>${s.hostelPass ? s.hostelPass.verificationCode : ''}</strong>
                </div>
              </div>
              <button class="btn btn-primary" id="btn-view-pass-step9">
                ${getIcon('qrCode', 16)}
                <span>View Full Digital Pass</span>
              </button>
            </div>
          ` : `
            <div>
              <p style="font-size: 13px; color: var(--color-text-muted); margin-bottom: 14px;">
                All preceding verification and allocation criteria have been satisfied. Click below to issue your official pass:
              </p>
              <button class="btn btn-primary btn-lg" id="btn-generate-pass">
                ${getIcon('award', 18)}
                <span>Generate Official Digital Hostel Pass</span>
              </button>
            </div>
          `)}
        </div>

      </div>
    `;

    // Step 1 Submission
    const form1 = container.querySelector('#form-step-1');
    if (form1) {
      form1.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(form1);
        try {
          const payload = {
            studentId: s.studentId,
            fullName: fd.get('fullName'),
            phone: fd.get('phone'),
            gender: fd.get('gender'),
            branch: fd.get('branch'),
            year: fd.get('year'),
            address: fd.get('address'),
            guardianName: fd.get('guardianName'),
            guardianPhone: fd.get('guardianPhone')
          };
          const r = await studentApi.submitPersonalDetails(payload);
          if (r.success) {
            state.showToast('Personal details submitted successfully!', 'success');
            state.setRoute('onboarding');
          }
        } catch (err) {
          state.showToast(err.message || 'Error submitting details', 'danger');
        }
      });
    }

    // Step 2 Submission (Aadhaar)
    const form2 = container.querySelector('#form-step-2');
    if (form2) {
      form2.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(form2);
        try {
          const r = await studentApi.submitAadhaar(s.studentId, fd.get('aadhaarNumber'));
          if (r.success) {
            state.showToast('Mock Aadhaar submitted successfully!', 'success');
            state.setRoute('onboarding');
          }
        } catch (err) {
          state.showToast(err.message || 'Error submitting Aadhaar', 'danger');
        }
      });
    }

    // Step 3 Submission (Undertaking)
    const form3 = container.querySelector('#form-step-3');
    if (form3) {
      form3.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
          const r = await studentApi.acceptUndertaking(s.studentId);
          if (r.success) {
            state.showToast('Undertaking accepted!', 'success');
            state.setRoute('onboarding');
          }
        } catch (err) {
          state.showToast(err.message || 'Error accepting undertaking', 'danger');
        }
      });
    }

    // Step 4 Payment
    const btnPay = container.querySelector('#btn-pay-fee');
    if (btnPay) {
      btnPay.addEventListener('click', async () => {
        btnPay.disabled = true;
        btnPay.innerHTML = 'Simulating Razorpay Payment...';
        try {
          const r = await studentApi.payFee(s.studentId);
          if (r.success) {
            state.showToast('Fee paid successfully via Razorpay test simulation!', 'success');
            state.setRoute('onboarding');
          }
        } catch (err) {
          state.showToast(err.message || 'Payment simulation failed', 'danger');
          btnPay.disabled = false;
        }
      });
    }

    // Step 6 Bed Select
    container.querySelectorAll('.btn-select-bed').forEach(btn => {
      btn.addEventListener('click', async () => {
        const room = btn.getAttribute('data-room');
        const bed = btn.getAttribute('data-bed');
        try {
          const r = await studentApi.selectRoom(s.studentId, room, bed);
          if (r.success) {
            state.showToast(`Allocated Room ${room} (${bed}) successfully!`, 'success');
            state.setRoute('onboarding');
          }
        } catch (err) {
          state.showToast(err.message || 'Could not allocate bed', 'danger');
        }
      });
    });

    // Step 7 Mess Select
    container.querySelectorAll('.btn-select-mess').forEach(btn => {
      btn.addEventListener('click', async () => {
        const planId = btn.getAttribute('data-plan');
        try {
          const r = await studentApi.selectMess(s.studentId, planId);
          if (r.success) {
            state.showToast('Mess plan selected!', 'success');
            state.setRoute('onboarding');
          }
        } catch (err) {
          state.showToast(err.message || 'Error selecting plan', 'danger');
        }
      });
    });

    // Step 9 Generate Pass
    const btnGenPass = container.querySelector('#btn-generate-pass');
    if (btnGenPass) {
      btnGenPass.addEventListener('click', async () => {
        btnGenPass.disabled = true;
        try {
          const r = await studentApi.generatePass(s.studentId);
          if (r.success) {
            state.showToast('Official Digital Hostel Pass Generated!', 'success');
            state.setRoute('hostel-pass');
          }
        } catch (err) {
          state.showToast(err.message || 'Pass generation failed', 'danger');
          btnGenPass.disabled = false;
        }
      });
    }

    const btnViewPass9 = container.querySelector('#btn-view-pass-step9');
    if (btnViewPass9) {
      btnViewPass9.addEventListener('click', () => state.setRoute('hostel-pass'));
    }

  } catch (err) {
    container.innerHTML = `<div class="empty-state"><p style="color: var(--color-danger);">Error loading onboarding: ${err.message}</p></div>`;
  }

  return container;
}
