// NIVAS Staff / Warden Portal Dashboard Overview
import { state } from '../../state.js';
import { staffApi } from '../../api.js';
import { getIcon } from '../../icons.js';

export async function renderStaffDashboard() {
  const user = state.user;
  const container = document.createElement('div');
  container.className = 'staff-dashboard';

  try {
    const res = await staffApi.getOverview(user.id);
    if (!res.success) {
      container.innerHTML = `<div class="empty-state"><p>Could not load staff portal.</p></div>`;
      return container;
    }

    const assignedBlock = res.assignedBlock || 'Block A';
    const tickets = res.tickets || [];
    const laundry = res.laundryRequests || [];
    const assistance = res.assistanceRequests || [];
    const rooms = res.rooms || [];

    const openTicketsCount = tickets.filter(t => t.status !== 'RESOLVED' && t.status !== 'CLOSED').length;
    const pendingLaundryCount = laundry.filter(l => l.status !== 'DELIVERED').length;
    const activeAssistanceCount = assistance.filter(a => a.status !== 'COMPLETED').length;

    container.innerHTML = `
      <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <span class="badge badge-success">DUTY ACTIVE</span>
            <span style="font-size: 13px; font-weight: 700; color: var(--color-forest);">${assignedBlock}</span>
          </div>
          <h2 style="font-size: 24px; font-weight: 800; color: var(--color-text);">Warden & Facility Operations Portal</h2>
          <p style="font-size: 14px; color: var(--color-text-muted);">
            Manage room maintenance, process laundry deliveries, and respond to student emergency care calls.
          </p>
        </div>

        <div style="font-size: 13px; color: var(--color-text-muted);">
          Staff Member: <strong>${user.name}</strong> (${user.designation || 'Hostel Supervisor'})
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="kpi-grid">
        <div class="kpi-card accent-green">
          <div class="kpi-icon-box">
            ${getIcon('building', 24)}
          </div>
          <div class="kpi-details">
            <div class="kpi-label">Assigned Sector</div>
            <div class="kpi-value" style="font-size: 22px;">${assignedBlock}</div>
            <div class="kpi-subtext">${rooms.length} residential rooms overseen</div>
          </div>
        </div>

        <div class="kpi-card accent-orange">
          <div class="kpi-icon-box orange">
            ${getIcon('tool', 24)}
          </div>
          <div class="kpi-details">
            <div class="kpi-label">Active Tickets</div>
            <div class="kpi-value">${openTicketsCount}</div>
            <div class="kpi-subtext">Assigned to your duty shift</div>
          </div>
        </div>

        <div class="kpi-card accent-coral">
          <div class="kpi-icon-box">
            ${getIcon('shirt', 24)}
          </div>
          <div class="kpi-details">
            <div class="kpi-label">Laundry Batches</div>
            <div class="kpi-value">${pendingLaundryCount}</div>
            <div class="kpi-subtext">Pickups & wash in progress</div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon-box">
            ${getIcon('phoneCall', 24)}
          </div>
          <div class="kpi-details">
            <div class="kpi-label">Emergency Care</div>
            <div class="kpi-value">${activeAssistanceCount}</div>
            <div class="kpi-subtext">Medical & warden alerts</div>
          </div>
        </div>
      </div>

      <!-- Quick Action Modules Navigation -->
      <div style="margin-bottom: 28px;">
        <h3 style="font-size: 17px; font-weight: 700; color: var(--color-text); margin-bottom: 14px;">Operational Duty Modules</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">
          
          <div class="card btn-staff-nav" data-route="tickets" style="padding: 20px; cursor: pointer; transition: all 0.2s; border-left: 4px solid var(--color-primary);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
              <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: var(--color-primary-subtle); color: var(--color-primary); display: flex; align-items: center; justify-content: center;">
                ${getIcon('tool', 22)}
              </div>
              <span class="badge ${openTicketsCount > 0 ? 'badge-warning' : 'badge-success'}">${openTicketsCount} Open</span>
            </div>
            <h4 style="font-size: 16px; font-weight: 800; color: var(--color-text); margin-bottom: 4px;">Ticket Operations</h4>
            <p style="font-size: 13px; color: var(--color-text-muted); line-height: 1.45;">
              View and resolve sector electrical, plumbing, carpentry, and appliance repair orders.
            </p>
          </div>

          <div class="card btn-staff-nav" data-route="laundry" style="padding: 20px; cursor: pointer; transition: all 0.2s; border-left: 4px solid var(--color-forest);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
              <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: var(--color-sage); color: var(--color-forest); display: flex; align-items: center; justify-content: center;">
                ${getIcon('shirt', 22)}
              </div>
              <span class="badge badge-info">${pendingLaundryCount} In Progress</span>
            </div>
            <h4 style="font-size: 16px; font-weight: 800; color: var(--color-text); margin-bottom: 4px;">Laundry Pickup & Delivery</h4>
            <p style="font-size: 13px; color: var(--color-text-muted); line-height: 1.45;">
              Process student wash batches. Marking as DELIVERED decrements 1 cycle from their 30-cycle plan.
            </p>
          </div>

          <div class="card btn-staff-nav" data-route="assistance" style="padding: 20px; cursor: pointer; transition: all 0.2s; border-left: 4px solid var(--color-danger);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
              <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: var(--color-danger-bg); color: var(--color-danger); display: flex; align-items: center; justify-content: center;">
                ${getIcon('phoneCall', 22)}
              </div>
              <span class="badge badge-danger">${activeAssistanceCount} Active</span>
            </div>
            <h4 style="font-size: 16px; font-weight: 800; color: var(--color-text); margin-bottom: 4px;">Emergency Care Alerts</h4>
            <p style="font-size: 13px; color: var(--color-text-muted); line-height: 1.45;">
              Respond to medical clinic doctor calls, urgent ambulance dispatch, and sick student room meal delivery.
            </p>
          </div>

          <div class="card btn-staff-nav" data-route="rooms" style="padding: 20px; cursor: pointer; transition: all 0.2s; border-left: 4px solid var(--color-secondary);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
              <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: var(--color-sage); color: var(--color-forest); display: flex; align-items: center; justify-content: center;">
                ${getIcon('building', 22)}
              </div>
              <span class="badge badge-info">${rooms.length} Rooms</span>
            </div>
            <h4 style="font-size: 16px; font-weight: 800; color: var(--color-text); margin-bottom: 4px;">Block Rooms & Beds</h4>
            <p style="font-size: 13px; color: var(--color-text-muted); line-height: 1.45;">
              Inspect rooms and bed allotments on floors under your direct residential supervision.
            </p>
          </div>

        </div>
      </div>
    `;

    container.querySelectorAll('.btn-staff-nav').forEach(card => {
      card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-2px)');
      card.addEventListener('mouseleave', () => card.style.transform = 'translateY(0)');
      card.addEventListener('click', () => {
        const route = card.getAttribute('data-route');
        if (route) state.setRoute(route);
      });
    });

  } catch (err) {
    container.innerHTML = `<div class="empty-state"><p style="color: var(--color-danger);">Failed to load staff portal: ${err.message}</p></div>`;
  }

  return container;
}
