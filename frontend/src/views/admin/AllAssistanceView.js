// NIVAS Dedicated Emergency & Assistance Requests Oversight View (Admin)
import { state } from '../../state.js';
import { assistanceApi } from '../../api.js';
import { getIcon } from '../../icons.js';
import { openModal } from '../../components/Modal.js';

export async function renderAllAssistanceView() {
  const container = document.createElement('div');
  container.className = 'all-assistance-view';

  try {
    const res = await assistanceApi.getAll();
    const requests = res.success ? res.requests : [];

    const activeCount = requests.filter(a => a.status !== 'COMPLETED' && a.status !== 'CANCELLED').length;
    const completedCount = requests.filter(a => a.status === 'COMPLETED').length;

    container.innerHTML = `
      <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px;">
        <div>
          <h2 style="font-size: 24px; font-weight: 800; color: var(--color-text);">Emergency & Resident Assistance Logs</h2>
          <p style="font-size: 14px; color: var(--color-text-muted);">
            Immediate institutional oversight of student medical clinic calls, ambulance dispatches, and emergency assistance.
          </p>
        </div>

        <div style="display: flex; gap: 10px;">
          <span class="badge badge-danger" style="font-size: 13px; padding: 6px 14px;">
            ${activeCount} Active Emergencies
          </span>
          <span class="badge badge-success" style="font-size: 13px; padding: 6px 14px;">
            ${completedCount} Resolved
          </span>
        </div>
      </div>

      <!-- Quick Category Metrics -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 28px;">
        <div class="card" style="padding: 18px; border-left: 4px solid var(--color-danger);">
          <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: var(--color-text-muted);">Doctor Clinic Visits</div>
          <div style="font-family: var(--font-heading); font-size: 24px; font-weight: 800; color: var(--color-text); margin-top: 4px;">
            ${requests.filter(r => r.assistanceType === 'MEDICAL_HELP').length}
          </div>
        </div>

        <div class="card" style="padding: 18px; border-left: 4px solid #b91c1c;">
          <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: var(--color-text-muted);">Ambulance Dispatches</div>
          <div style="font-family: var(--font-heading); font-size: 24px; font-weight: 800; color: var(--color-text); margin-top: 4px;">
            ${requests.filter(r => r.assistanceType === 'AMBULANCE').length}
          </div>
        </div>

        <div class="card" style="padding: 18px; border-left: 4px solid var(--color-primary);">
          <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: var(--color-text-muted);">Sick Meal Deliveries</div>
          <div style="font-family: var(--font-heading); font-size: 24px; font-weight: 800; color: var(--color-text); margin-top: 4px;">
            ${requests.filter(r => r.assistanceType === 'FOOD_IN_ROOM').length}
          </div>
        </div>

        <div class="card" style="padding: 18px; border-left: 4px solid var(--color-warning);">
          <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: var(--color-text-muted);">Warden Interventions</div>
          <div style="font-family: var(--font-heading); font-size: 24px; font-weight: 800; color: var(--color-text); margin-top: 4px;">
            ${requests.filter(r => r.assistanceType === 'URGENT_HELP').length}
          </div>
        </div>
      </div>

      <!-- Controls: Filters -->
      <div class="card" style="margin-bottom: 24px; padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button class="btn btn-sm btn-secondary ast-filter-btn active" data-filter="all">All (${requests.length})</button>
          <button class="btn btn-sm btn-secondary ast-filter-btn" data-filter="REQUESTED">Requested</button>
          <button class="btn btn-sm btn-secondary ast-filter-btn" data-filter="ACKNOWLEDGED">Acknowledged</button>
          <button class="btn btn-sm btn-secondary ast-filter-btn" data-filter="IN_PROGRESS">In Progress</button>
          <button class="btn btn-sm btn-secondary ast-filter-btn" data-filter="COMPLETED">Completed</button>
        </div>

        <div style="font-size: 13px; color: var(--color-text-muted);">
          Emergency Duty: <strong>24/7 Active</strong>
        </div>
      </div>

      <!-- Table -->
      <div class="card">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Student ID</th>
                <th>Care Type</th>
                <th>Symptoms / Note</th>
                <th>Logged Time</th>
                <th>Assigned Duty Staff</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${requests.length === 0 ? `
                <tr><td colspan="8" style="text-align: center; padding: 32px;">No assistance requests recorded.</td></tr>
              ` : requests.map(a => {
                let badgeClass = 'badge-warning';
                if (a.status === 'COMPLETED') badgeClass = 'badge-success';
                else if (a.status === 'IN_PROGRESS' || a.status === 'ASSIGNED') badgeClass = 'badge-info';
                else if (a.status === 'REQUESTED') badgeClass = 'badge-danger';

                return `
                  <tr class="ast-row" data-status="${a.status}">
                    <td><strong style="color: var(--color-forest);">${a.requestId}</strong></td>
                    <td><strong>${a.studentId}</strong></td>
                    <td><span class="badge badge-terracotta">${a.assistanceType}</span></td>
                    <td style="max-width: 260px;">${a.description}</td>
                    <td>${a.timestamp}</td>
                    <td>
                      ${a.assignedStaffId && a.assignedStaffId !== 'Unassigned' ? `
                        <strong style="color: var(--color-forest);">${a.assignedStaffId}</strong>
                      ` : `
                        <span style="color: var(--color-danger); font-weight: 700;">Unassigned</span>
                      `}
                    </td>
                    <td><span class="badge ${badgeClass}">${a.status}</span></td>
                    <td>
                      <button class="btn btn-sm btn-primary btn-respond-ast" data-id="${a.requestId}" data-status="${a.status}">
                        Respond
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Filter logic
    const filterTabs = container.querySelectorAll('.ast-filter-btn');
    const rows = container.querySelectorAll('.ast-row');
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active', 'btn-primary'));
        tab.classList.add('active');
        const filter = tab.getAttribute('data-filter');

        rows.forEach(row => {
          const status = row.getAttribute('data-status');
          if (filter === 'all' || filter === status) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      });
    });

    // Respond modal
    container.querySelectorAll('.btn-respond-ast').forEach(btn => {
      btn.addEventListener('click', () => {
        const reqId = btn.getAttribute('data-id');
        const curStatus = btn.getAttribute('data-status');

        const content = document.createElement('div');
        content.innerHTML = `
          <div class="form-group">
            <label class="form-label">Assign Duty Staff</label>
            <select class="form-control" id="modal-ast-staff">
              <option value="STF01">STF01 - Mr. Suresh Kumar (Hostel Warden, Block A)</option>
              <option value="STF02">STF02 - Mr. Ramesh Verma (Maintenance Supervisor, Block B)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Status</label>
            <select class="form-control" id="modal-ast-status">
              <option value="ACKNOWLEDGED" ${curStatus === 'ACKNOWLEDGED' ? 'selected' : ''}>ACKNOWLEDGED</option>
              <option value="ASSIGNED" ${curStatus === 'ASSIGNED' ? 'selected' : ''}>ASSIGNED</option>
              <option value="IN_PROGRESS" ${curStatus === 'IN_PROGRESS' ? 'selected' : ''}>IN_PROGRESS</option>
              <option value="COMPLETED" ${curStatus === 'COMPLETED' ? 'selected' : ''}>COMPLETED</option>
            </select>
          </div>
        `;

        openModal({
          title: `Respond to Assistance Call ${reqId}`,
          content,
          confirmText: 'Save Action',
          onConfirm: async () => {
            const staffId = content.querySelector('#modal-ast-staff').value;
            const status = content.querySelector('#modal-ast-status').value;

            try {
              await assistanceApi.updateStatus(reqId, status, staffId);
              state.showToast(`Assistance request ${reqId} updated to ${status}!`, 'success');
              state.setRoute('assistance');
              return true;
            } catch (err) {
              state.showToast(err.message || 'Update failed', 'danger');
              return false;
            }
          }
        });
      });
    });

  } catch (err) {
    container.innerHTML = `<div class="empty-state"><p style="color: var(--color-danger);">Failed to load assistance: ${err.message}</p></div>`;
  }

  return container;
}
