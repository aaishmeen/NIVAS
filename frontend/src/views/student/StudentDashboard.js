// NIVAS Student Dashboard View
import { state } from '../../state.js';
import { studentApi } from '../../api.js';
import { getIcon } from '../../icons.js';

export async function renderStudentDashboard() {
  const user = state.user;
  const container = document.createElement('div');
  container.className = 'dashboard-view';
  container.innerHTML = `<div class="empty-state"><p>Loading resident profile and dashboard data...</p></div>`;

  try {
    const res = await studentApi.getDashboard(user.studentId || user.id);
    if (!res.success || !res.student) {
      container.innerHTML = `<div class="empty-state"><p>Could not load resident data.</p></div>`;
      return container;
    }

    const s = res.student;
    const app = s.onboardingApp || {};
    const wifi = s.wifiAccount || { remainingGB: 300, usedGB: 0, allocatedGB: 300 };
    const laundry = s.laundryPlan || { remainingCycles: 30, totalCycles: 30 };
    const announcements = res.announcements || [];
    const tickets = res.tickets || [];

    const wifiPercent = Math.min(100, Math.round((wifi.usedGB / (wifi.allocatedGB || 300)) * 100));

    container.innerHTML = `
      <!-- Welcome Banner -->
      <div style="background: linear-gradient(135deg, #4A70E2 0%, #688DF7 100%); color: #fff; padding: 28px 32px; border-radius: var(--radius-xl); margin-bottom: 28px; box-shadow: 0 8px 24px rgba(74, 112, 226, 0.16); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
        <div>
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
            <span class="badge" style="background: rgba(255,255,255,0.22); color: #fff; font-size: 11px; backdrop-filter: blur(4px);">ACADEMIC YEAR 2026-27</span>
            <span style="font-size: 12px; opacity: 0.92;">Hostel Block Resident</span>
          </div>
          <h2 style="font-size: 26px; font-weight: 800; color: #fff; margin-bottom: 6px; letter-spacing: -0.3px;">Welcome back, ${s.name}</h2>
          <p style="font-size: 14px; opacity: 0.92; max-width: 650px;">
            Registration ID: <strong>${s.studentId}</strong> • ${s.personalDetails.branch || 'B.Tech CSE'} (Year ${s.personalDetails.year || 2})
          </p>
        </div>

        <div>
          ${app.isCompleted ? `
            <button class="btn btn-primary" id="btn-view-pass" style="background: rgba(255, 255, 255, 0.22); border: 1px solid rgba(255, 255, 255, 0.4); color: #fff; backdrop-filter: blur(8px); box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
              ${getIcon('qrCode', 18)}
              <span>View Digital Pass</span>
            </button>
          ` : `
            <button class="btn btn-primary" id="btn-continue-onboarding" style="background: rgba(255, 255, 255, 0.22); border: 1px solid rgba(255, 255, 255, 0.4); color: #fff; backdrop-filter: blur(8px); box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
              ${getIcon('arrowRight', 18)}
              <span>Continue Onboarding (${app.nextStep || 'Step 1'})</span>
            </button>
          `}
        </div>
      </div>

      <!-- Onboarding Status Alert if Pending -->
      ${!app.isCompleted ? `
        <div style="background-color: var(--color-sage-subtle); border: 1px solid var(--color-info-border); border-radius: var(--radius-lg); padding: 18px 24px; margin-bottom: 28px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="width: 40px; height: 40px; border-radius: var(--radius-md); background: var(--color-primary-subtle); color: var(--color-primary); display: flex; align-items: center; justify-content: center;">
              ${getIcon('shield', 20)}
            </div>
            <div>
              <div style="font-weight: 700; color: var(--color-text); font-size: 15px;">Onboarding in Progress</div>
              <div style="font-size: 13px; color: var(--color-text-muted);">
                Current Required Step: <strong style="color: var(--color-primary);">${app.nextStep}</strong>
              </div>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- KPI Summary Cards -->
      <div class="kpi-grid">
        <!-- Room & Bed -->
        <div class="kpi-card accent-green">
          <div class="kpi-icon-box">
            ${getIcon('bed', 24)}
          </div>
          <div class="kpi-details">
            <div class="kpi-label">Allocated Room & Bed</div>
            <div class="kpi-value" style="font-size: 20px;">
              ${s.allocatedRoom ? `Room ${s.allocatedRoom} (${s.allocatedBed})` : 'Not Allocated'}
            </div>
            <div class="kpi-subtext">
              ${s.allocatedRoom ? 'Single-Occupancy Bed Verified' : 'Complete onboarding step 6'}
            </div>
          </div>
        </div>

        <!-- Laundry Cycles -->
        <div class="kpi-card accent-orange">
          <div class="kpi-icon-box orange">
            ${getIcon('shirt', 24)}
          </div>
          <div class="kpi-details">
            <div class="kpi-label">Laundry Cycles</div>
            <div class="kpi-value">${laundry.remainingCycles} <span style="font-size: 14px; font-weight: 500; color: var(--color-text-muted);">/ ${laundry.totalCycles}</span></div>
            <div class="kpi-subtext">${laundry.status === 'ACTIVE' ? 'Active Plan • Automatic Deduction' : 'Pending Activation'}</div>
          </div>
        </div>

        <!-- Wi-Fi Quota -->
        <div class="kpi-card accent-coral">
          <div class="kpi-icon-box">
            ${getIcon('wifi', 24)}
          </div>
          <div class="kpi-details">
            <div class="kpi-label">Campus Wi-Fi Remaining</div>
            <div class="kpi-value">${wifi.remainingGB} <span style="font-size: 14px; font-weight: 500; color: var(--color-text-muted);">GB</span></div>
            <div style="background: var(--color-border); height: 6px; border-radius: 3px; margin-top: 6px; overflow: hidden;">
              <div style="background: linear-gradient(90deg, var(--color-forest), var(--color-primary)); width: ${wifiPercent}%; height: 100%;"></div>
            </div>
            <div class="kpi-subtext" style="margin-top: 4px;">${wifi.usedGB} GB consumed of 300 GB</div>
          </div>
        </div>

        <!-- Maintenance & Tickets -->
        <div class="kpi-card">
          <div class="kpi-icon-box">
            ${getIcon('tool', 24)}
          </div>
          <div class="kpi-details">
            <div class="kpi-label">Maintenance Tickets</div>
            <div class="kpi-value">${tickets.length}</div>
            <div class="kpi-subtext">${tickets.filter(t => t.status !== 'RESOLVED' && t.status !== 'CLOSED').length} currently active</div>
          </div>
        </div>
      </div>

      <!-- Quick Action Buttons Grid -->
      <div style="margin-bottom: 28px;">
        <h3 style="font-size: 16px; font-weight: 700; color: var(--color-text); margin-bottom: 14px;">Quick Actions</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px;">
          <button class="card btn-quick-action" data-route="laundry" style="padding: 16px; display: flex; align-items: center; gap: 12px; cursor: pointer; text-align: left; transition: all 0.2s;">
            <div style="width: 38px; height: 38px; border-radius: var(--radius-md); background: rgba(47, 84, 235, 0.1); color: var(--color-primary); display: flex; align-items: center; justify-content: center;">
              ${getIcon('shirt', 20)}
            </div>
            <div>
              <div style="font-weight: 700; font-size: 14px; color: var(--color-text);">Request Laundry</div>
              <div style="font-size: 12px; color: var(--color-text-muted);">Drop off wash clothes</div>
            </div>
          </button>

          <button class="card btn-quick-action" data-route="tickets" style="padding: 16px; display: flex; align-items: center; gap: 12px; cursor: pointer; text-align: left; transition: all 0.2s;">
            <div style="width: 38px; height: 38px; border-radius: var(--radius-md); background: rgba(0, 180, 216, 0.12); color: #00B4D8; display: flex; align-items: center; justify-content: center;">
              ${getIcon('tool', 20)}
            </div>
            <div>
              <div style="font-weight: 700; font-size: 14px; color: var(--color-text);">Raise Ticket</div>
              <div style="font-size: 12px; color: var(--color-text-muted);">Plumbing, electrical, AC</div>
            </div>
          </button>

          <button class="card btn-quick-action" data-route="assistance" style="padding: 16px; display: flex; align-items: center; gap: 12px; cursor: pointer; text-align: left; transition: all 0.2s;">
            <div style="width: 38px; height: 38px; border-radius: var(--radius-md); background: rgba(255, 62, 108, 0.12); color: var(--color-pink); display: flex; align-items: center; justify-content: center;">
              ${getIcon('phoneCall', 20)}
            </div>
            <div>
              <div style="font-weight: 700; font-size: 14px; color: var(--color-pink);">Medical / Urgent</div>
              <div style="font-size: 12px; color: var(--color-text-muted);">Ambulance & doctor aid</div>
            </div>
          </button>

          <button class="card btn-quick-action" data-route="hostel-pass" style="padding: 16px; display: flex; align-items: center; gap: 12px; cursor: pointer; text-align: left; transition: all 0.2s;">
            <div style="width: 38px; height: 38px; border-radius: var(--radius-md); background: rgba(255, 122, 0, 0.12); color: var(--color-orange); display: flex; align-items: center; justify-content: center;">
              ${getIcon('qrCode', 20)}
            </div>
            <div>
              <div style="font-weight: 700; font-size: 14px; color: var(--color-text);">Digital Hostel Pass</div>
              <div style="font-size: 12px; color: var(--color-text-muted);">Entry pass with QR</div>
            </div>
          </button>
        </div>
      </div>

      <!-- Two Column Layout: Announcements & Recent Activity -->
      <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 24px;" class="dashboard-split">
        <!-- Announcements Board -->
        <div class="card">
          <div class="card-header">
            <div>
              <h3 class="card-title">${getIcon('bell', 18)} Campus & Hostel Announcements</h3>
              <p class="card-subtitle">Official notifications from Chief Warden & Hostel Office</p>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 14px;">
            ${announcements.length === 0 ? `
              <div class="empty-state" style="padding: 24px;"><p>No active announcements posted.</p></div>
            ` : announcements.map(a => `
              <div style="padding: 14px 16px; background-color: var(--color-bg); border-radius: var(--radius-md); border-left: 3px solid var(--color-primary);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <span style="font-weight: 700; color: var(--color-text); font-size: 14px;">${a.title}</span>
                  <span style="font-size: 11px; color: var(--color-text-muted); font-weight: 600;">${a.date}</span>
                </div>
                <p style="font-size: 13px; color: var(--color-text-muted); line-height: 1.45;">${a.message}</p>
                <div style="font-size: 11px; color: var(--color-forest); font-weight: 600; margin-top: 6px;">Posted by: ${a.author}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Mess & Dietary Overview -->
        <div class="card">
          <div class="card-header">
            <div>
              <h3 class="card-title">${getIcon('utensils', 18)} Dining & Meal Subscription</h3>
              <p class="card-subtitle">Current dining package and mess timings</p>
            </div>
          </div>
          
          <div style="padding: 14px 18px; background: var(--color-surface-hover); border-radius: var(--radius-md); border: 1px solid var(--color-border); margin-bottom: 16px;">
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--color-text-muted);">Active Meal Plan</div>
            <div style="font-size: 17px; font-weight: 800; color: var(--color-forest); margin-top: 2px;">
              ${s.messPlan ? s.messPlan.planName : 'No Plan Selected (Default Standard)'}
            </div>
            <p style="font-size: 12px; color: var(--color-text-muted); margin-top: 4px;">
              ${s.messPlan ? s.messPlan.description : 'Please select your meal preference during onboarding step 7.'}
            </p>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px; font-size: 13px;">
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--color-border);">
              <span style="color: var(--color-text-muted);">Breakfast</span>
              <strong style="color: var(--color-text);">07:30 AM – 09:30 AM</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--color-border);">
              <span style="color: var(--color-text-muted);">Lunch</span>
              <strong style="color: var(--color-text);">12:30 PM – 02:30 PM</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--color-border);">
              <span style="color: var(--color-text-muted);">Evening High Tea</span>
              <strong style="color: var(--color-text);">05:00 PM – 06:00 PM</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0;">
              <span style="color: var(--color-text-muted);">Dinner</span>
              <strong style="color: var(--color-text);">07:30 PM – 09:30 PM</strong>
            </div>
          </div>
        </div>
      </div>
    `;

    // Event listeners
    container.querySelectorAll('.btn-quick-action').forEach(btn => {
      btn.addEventListener('click', () => {
        const route = btn.getAttribute('data-route');
        if (route) state.setRoute(route);
      });
    });

    const btnCont = container.querySelector('#btn-continue-onboarding');
    if (btnCont) btnCont.addEventListener('click', () => state.setRoute('onboarding'));

    const btnPass = container.querySelector('#btn-view-pass');
    if (btnPass) btnPass.addEventListener('click', () => state.setRoute('hostel-pass'));

  } catch (err) {
    container.innerHTML = `
      <div class="empty-state">
        <p style="color: var(--color-danger);">Failed to load student dashboard: ${err.message}</p>
        <button class="btn btn-secondary btn-sm" id="btn-retry" style="margin-top: 12px;">Retry</button>
      </div>
    `;
    container.querySelector('#btn-retry')?.addEventListener('click', () => state.notify());
  }

  return container;
}
