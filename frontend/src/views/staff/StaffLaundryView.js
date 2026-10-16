// NIVAS Dedicated Staff Laundry Processing & Delivery View
import { state } from '../../state.js';
import { staffApi, laundryApi } from '../../api.js';
import { getIcon } from '../../icons.js';

export async function renderStaffLaundryView() {
  const user = state.user;
  const container = document.createElement('div');
  container.className = 'staff-laundry-view';

  try {
    const res = await staffApi.getOverview(user.id);
    const laundry = res.success ? (res.laundryRequests || []) : [];

    container.innerHTML = `
      <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px;">
        <div>
          <h2 style="font-size: 24px; font-weight: 800; color: var(--color-text);">Laundry Processing & Delivery Operations</h2>
          <p style="font-size: 14px; color: var(--color-text-muted);">
            Manage student laundry batches. Marking an order as <strong>DELIVERED</strong> automatically decrements the resident's 30-cycle quota.
          </p>
        </div>

        <span class="badge badge-info" style="font-size: 13px; padding: 6px 14px;">
          ${laundry.filter(l => l.status !== 'DELIVERED').length} Batches in Progress
        </span>
      </div>

      <div class="card">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Batch Request ID</th>
                <th>Student ID</th>
                <th>Garments / Clothes</th>
                <th>Date Logged</th>
                <th>Current Status</th>
                <th>Cycle Deducted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${laundry.length === 0 ? `
                <tr><td colspan="7" style="text-align: center; padding: 32px;">No laundry batches registered in system.</td></tr>
              ` : laundry.map(l => `
                <tr>
                  <td><strong style="color: var(--color-forest);">${l.requestId}</strong></td>
                  <td><strong>${l.studentId}</strong></td>
                  <td><strong>${l.numberOfClothes}</strong> pieces</td>
                  <td>${l.requestDate}</td>
                  <td><span class="badge ${l.status === 'DELIVERED' ? 'badge-success' : 'badge-warning'}">${l.status}</span></td>
                  <td>${l.cycleDeducted ? '<span class="badge badge-success">✓ Deducted</span>' : '<span style="color: var(--color-text-muted);">On Delivery</span>'}</td>
                  <td>
                    ${l.status === 'DELIVERED' ? `
                      <span style="font-size: 12px; color: var(--color-success); font-weight: 700;">Delivered</span>
                    ` : `
                      <div style="display: flex; gap: 6px;">
                        <button class="btn btn-sm btn-secondary btn-update-laundry" data-id="${l.requestId}" data-status="PROCESSING">Set Processing</button>
                        <button class="btn btn-sm btn-primary btn-update-laundry" data-id="${l.requestId}" data-status="DELIVERED">Mark Delivered</button>
                      </div>
                    `}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    container.querySelectorAll('.btn-update-laundry').forEach(btn => {
      btn.addEventListener('click', async () => {
        const reqId = btn.getAttribute('data-id');
        const newStatus = btn.getAttribute('data-status');
        btn.disabled = true;
        try {
          const r = await laundryApi.updateStatus(reqId, newStatus);
          if (r.success) {
            state.showToast(`Batch ${reqId} updated to ${newStatus}!`, 'success');
            state.setRoute('laundry');
          }
        } catch (err) {
          state.showToast(err.message || 'Status update failed', 'danger');
          btn.disabled = false;
        }
      });
    });

  } catch (err) {
    container.innerHTML = `<div class="empty-state"><p style="color: var(--color-danger);">Failed to load laundry: ${err.message}</p></div>`;
  }

  return container;
}
