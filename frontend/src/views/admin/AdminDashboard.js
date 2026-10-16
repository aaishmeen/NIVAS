// NIVAS Administrator Executive Overview Dashboard (Admin)
import { state } from '../../state.js';
import { adminApi, announcementsApi } from '../../api.js';
import { getIcon } from '../../icons.js';
import { openModal } from '../../components/Modal.js';

export async function renderAdminDashboard() {
  const container = document.createElement('div');
  container.className = 'admin-dashboard';

  try {
    const res = await adminApi.getOverview();
    if (!res.success) {
      container.innerHTML = `<div class="empty-state"><p>Could not load admin overview.</p></div>`;
      return container;
    }

    const students = res.students || [];
    const pendingCount = students.filter(s => !(s.onboardingApp && s.onboardingApp.adminVerified)).length;
    const occPercent = res.totalBeds > 0 ? Math.round((res.occupiedBeds / res.totalBeds) * 100) : 0;

    container.innerHTML = `
      <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px;">
        <div>
          <h2 style="font-size: 24px; font-weight: 800; color: var(--color-text);">Chief Warden Console</h2>
          <p style="font-size: 14px; color: var(--color-text-muted);">
            Executive institutional command center for student onboarding, room allocations, facility operations, and safety.
          </p>
        </div>

        <button class="btn btn-primary" id="btn-publish-notice">
          ${getIcon('plus', 16)}
          <span>Broadcast Notice</span>
        </button>
      </div>

      <!-- KPI Summary Grid -->
      <div class="kpi-grid">
        <div class="kpi-card accent-green">
          <div class="kpi-icon-box">
            ${getIcon('user', 24)}
          </div>
          <div class="kpi-details">
            <div class="kpi-label">Registered Students</div>
            <div class="kpi-value">${res.totalStudents}</div>
            <div class="kpi-subtext">${pendingCount} pending verification</div>
          </div>
        </div>

        <div class="kpi-card accent-orange">
          <div class="kpi-icon-box orange">
            ${getIcon('bed', 24)}
          </div>
          <div class="kpi-details">
            <div class="kpi-label">Hostel Occupancy</div>
            <div class="kpi-value">${occPercent}%</div>
            <div class="kpi-subtext">${res.occupiedBeds} occupied of ${res.totalBeds} beds</div>
          </div>
        </div>

        <div class="kpi-card accent-coral">
          <div class="kpi-icon-box">
            ${getIcon('tool', 24)}
          </div>
          <div class="kpi-details">
            <div class="kpi-label">Maintenance Tickets</div>
            <div class="kpi-value">${res.openTickets}</div>
            <div class="kpi-subtext">Active repair requests</div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon-box">
            ${getIcon('phoneCall', 24)}
          </div>
          <div class="kpi-details">
            <div class="kpi-label">Emergency Requests</div>
            <div class="kpi-value">${res.openAssistance}</div>
            <div class="kpi-subtext">Medical & warden alerts</div>
          </div>
        </div>
      </div>

      <!-- Quick Navigation Cards to Dedicated Modules -->
      <div style="margin-bottom: 28px;">
        <h3 style="font-size: 17px; font-weight: 700; color: var(--color-text); margin-bottom: 14px;">Administrative Modules</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">
          
          <div class="card btn-nav-card" data-route="verification" style="padding: 20px; cursor: pointer; transition: all 0.2s; border-left: 4px solid var(--color-forest);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
              <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: var(--color-sage); color: var(--color-forest); display: flex; align-items: center; justify-content: center;">
                ${getIcon('shield', 22)}
              </div>
              <span class="badge ${pendingCount > 0 ? 'badge-warning' : 'badge-success'}">${pendingCount} Pending</span>
            </div>
            <h4 style="font-size: 16px; font-weight: 800; color: var(--color-text); margin-bottom: 4px;">Student Verification</h4>
            <p style="font-size: 13px; color: var(--color-text-muted); line-height: 1.45;">
              Review submitted personal info, mock Aadhaar documents, and ₹85,000 fee clearances to approve allocations.
            </p>
          </div>

          <div class="card btn-nav-card" data-route="rooms" style="padding: 20px; cursor: pointer; transition: all 0.2s; border-left: 4px solid var(--color-primary);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
              <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: var(--color-primary-subtle); color: var(--color-primary); display: flex; align-items: center; justify-content: center;">
                ${getIcon('bed', 22)}
              </div>
              <span class="badge badge-info">${res.totalRooms} Rooms</span>
            </div>
            <h4 style="font-size: 16px; font-weight: 800; color: var(--color-text); margin-bottom: 4px;">Hostel Occupancy & Beds</h4>
            <p style="font-size: 13px; color: var(--color-text-muted); line-height: 1.45;">
              Visual layout of Block A and Block B rooms, occupied vs available beds, and capacity constraints.
            </p>
          </div>

          <div class="card btn-nav-card" data-route="tickets" style="padding: 20px; cursor: pointer; transition: all 0.2s; border-left: 4px solid var(--color-secondary);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
              <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: var(--color-sage); color: var(--color-forest); display: flex; align-items: center; justify-content: center;">
                ${getIcon('tool', 22)}
              </div>
              <span class="badge badge-terracotta">${res.openTickets} Logged</span>
            </div>
            <h4 style="font-size: 16px; font-weight: 800; color: var(--color-text); margin-bottom: 4px;">All Maintenance Tickets</h4>
            <p style="font-size: 13px; color: var(--color-text-muted); line-height: 1.45;">
              Assign duty staff, track resolution statuses, and audit facility work orders across campus sectors.
            </p>
          </div>

          <div class="card btn-nav-card" data-route="assistance" style="padding: 20px; cursor: pointer; transition: all 0.2s; border-left: 4px solid var(--color-danger);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
              <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: var(--color-danger-bg); color: var(--color-danger); display: flex; align-items: center; justify-content: center;">
                ${getIcon('phoneCall', 22)}
              </div>
              <span class="badge badge-danger">${res.openAssistance} Requests</span>
            </div>
            <h4 style="font-size: 16px; font-weight: 800; color: var(--color-text); margin-bottom: 4px;">All Emergency Requests</h4>
            <p style="font-size: 13px; color: var(--color-text-muted); line-height: 1.45;">
              Priority dispatch center for 24/7 medical doctor visits, ambulance transport, and emergency warden aid.
            </p>
          </div>

        </div>
      </div>

      <!-- Campus Notices Overview -->
      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title">${getIcon('bell', 18)} Active Campus Bulletins</h3>
            <p class="card-subtitle">Broadcasts visible to all student residents and duty staff</p>
          </div>
          <button class="btn btn-sm btn-secondary" id="btn-view-all-notices">View All Notices</button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div style="padding: 14px 16px; background-color: var(--color-bg); border-radius: var(--radius-md); border-left: 3px solid var(--color-primary);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <strong style="color: var(--color-text); font-size: 14px;">Hostel Verification Week</strong>
              <span style="font-size: 11px; color: var(--color-text-muted); font-weight: 600;">2026-09-25</span>
            </div>
            <p style="font-size: 13px; color: var(--color-text-muted);">All 2nd year students must complete document verification by Friday.</p>
          </div>

          <div style="padding: 14px 16px; background-color: var(--color-bg); border-radius: var(--radius-md); border-left: 3px solid var(--color-primary);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <strong style="color: var(--color-text); font-size: 14px;">Laundry Service Timings</strong>
              <span style="font-size: 11px; color: var(--color-text-muted); font-weight: 600;">2026-09-26</span>
            </div>
            <p style="font-size: 13px; color: var(--color-text-muted);">Laundry pickup is available daily between 8:00 AM and 11:00 AM.</p>
          </div>
        </div>
      </div>
    `;

    // Navigation card clicks
    container.querySelectorAll('.btn-nav-card').forEach(card => {
      card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-2px)');
      card.addEventListener('mouseleave', () => card.style.transform = 'translateY(0)');
      card.addEventListener('click', () => {
        const route = card.getAttribute('data-route');
        if (route) state.setRoute(route);
      });
    });

    container.querySelector('#btn-view-all-notices')?.addEventListener('click', () => state.setRoute('announcements'));

    // Broadcast notice modal
    container.querySelector('#btn-publish-notice')?.addEventListener('click', () => {
      const content = document.createElement('div');
      content.innerHTML = `
        <div class="form-group">
          <label class="form-label">Announcement Title</label>
          <input type="text" class="form-control" id="modal-dash-title" placeholder="e.g. Campus Library Extended Timings" required />
        </div>
        <div class="form-group">
          <label class="form-label">Target Division / Audience</label>
          <select class="form-control" id="modal-dash-target">
            <option value="STUDENT">🎓 Students Only</option>
            <option value="STAFF">🛡️ Staff & Wardens Only</option>
            <option value="ADMIN">⚙️ Administrators Only</option>
            <option value="ALL" selected>🌐 All Divisions (Campus-Wide)</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Message Content</label>
          <textarea class="form-control" id="modal-dash-msg" rows="4" placeholder="Enter notice content to broadcast..." required></textarea>
        </div>
      `;

      openModal({
        title: 'Broadcast Institutional Notice',
        content,
        confirmText: 'Broadcast Notice',
        onConfirm: async () => {
          const title = content.querySelector('#modal-dash-title').value.trim();
          const targetAudience = content.querySelector('#modal-dash-target').value;
          const message = content.querySelector('#modal-dash-msg').value.trim();
          if (!title || !message) {
            state.showToast('Please enter both title and message', 'warning');
            return false;
          }

          try {
            const r = await announcementsApi.create(title, message, 'Chief Warden Office', targetAudience);
            if (r.success) {
              state.showToast(`Notice broadcasted to ${targetAudience} division!`, 'success');
              state.setRoute('announcements');
              return true;
            }
          } catch (err) {
            state.showToast(err.message || 'Error broadcasting notice', 'danger');
            return false;
          }
        }
      });
    });

  } catch (err) {
    container.innerHTML = `<div class="empty-state"><p style="color: var(--color-danger);">Failed to load admin console: ${err.message}</p></div>`;
  }

  return container;
}
