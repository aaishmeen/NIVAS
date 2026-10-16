// NIVAS Dedicated Staff Emergency Assistance Dispatch View
import { state } from '../../state.js';
import { staffApi, assistanceApi } from '../../api.js';
import { getIcon } from '../../icons.js';

export async function renderStaffAssistanceView() {
  const user = state.user;
  const container = document.createElement('div');
  container.className = 'staff-assistance-view';

  try {
    const res = await staffApi.getOverview(user.id);
    const assistance = res.success ? (res.assistanceRequests || []) : [];

    container.innerHTML = `
      <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px;">
        <div>
          <h2 style="font-size: 24px; font-weight: 800; color: var(--color-text);">Resident Emergency Care Calls</h2>
          <p style="font-size: 14px; color: var(--color-text-muted);">
            Immediate medical doctor visits, ambulance calls, and sick resident support alerts.
          </p>
        </div>

        <span class="badge badge-danger" style="font-size: 13px; padding: 6px 14px;">
          ${assistance.filter(a => a.status !== 'COMPLETED').length} Active Alerts
        </span>
      </div>

      <div class="card">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Alert ID</th>
                <th>Student ID</th>
                <th>Care Type</th>
                <th>Symptoms / Note</th>
                <th>Timestamp</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${assistance.length === 0 ? `
                <tr><td colspan="7" style="text-align: center; padding: 32px;">No resident emergency alerts registered.</td></tr>
              ` : assistance.map(a => `
                <tr>
                  <td><strong style="color: var(--color-forest);">${a.requestId}</strong></td>
                  <td><strong>${a.studentId}</strong></td>
                  <td><span class="badge badge-terracotta">${a.assistanceType}</span></td>
                  <td style="max-width: 250px;">${a.description}</td>
                  <td>${a.timestamp}</td>
                  <td><span class="badge ${a.status === 'COMPLETED' ? 'badge-success' : 'badge-danger'}">${a.status}</span></td>
                  <td>
                    ${a.status === 'COMPLETED' ? `
                      <span style="font-size: 12px; color: var(--color-forest); font-weight: 700;">Completed</span>
                    ` : `
                      <button class="btn btn-sm btn-primary btn-resolve-ast" data-id="${a.requestId}">
                        Mark Completed
                      </button>
                    `}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    container.querySelectorAll('.btn-resolve-ast').forEach(btn => {
      btn.addEventListener('click', async () => {
        const reqId = btn.getAttribute('data-id');
        btn.disabled = true;
        try {
          const r = await assistanceApi.updateStatus(reqId, 'COMPLETED', user.id);
          if (r.success) {
            state.showToast(`Emergency request ${reqId} resolved!`, 'success');
            state.setRoute('assistance');
          }
        } catch (err) {
          state.showToast(err.message || 'Action failed', 'danger');
          btn.disabled = false;
        }
      });
    });

  } catch (err) {
    container.innerHTML = `<div class="empty-state"><p style="color: var(--color-danger);">Failed to load assistance calls: ${err.message}</p></div>`;
  }

  return container;
}
