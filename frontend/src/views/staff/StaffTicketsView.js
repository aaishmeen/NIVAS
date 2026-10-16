// NIVAS Dedicated Staff Ticket Operations View
import { state } from '../../state.js';
import { staffApi, ticketsApi } from '../../api.js';
import { getIcon } from '../../icons.js';
import { openModal } from '../../components/Modal.js';

export async function renderStaffTicketsView() {
  const user = state.user;
  const container = document.createElement('div');
  container.className = 'staff-tickets-view';

  try {
    const res = await staffApi.getOverview(user.id);
    const tickets = res.success ? (res.tickets || []) : [];
    const block = res.assignedBlock || 'Block A';

    container.innerHTML = `
      <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px;">
        <div>
          <h2 style="font-size: 24px; font-weight: 800; color: var(--color-text);">Sector Maintenance Work Orders</h2>
          <p style="font-size: 14px; color: var(--color-text-muted);">
            Active work orders assigned to ${user.name} and unassigned repairs in <strong>${block}</strong>.
          </p>
        </div>

        <span class="badge badge-warning" style="font-size: 13px; padding: 6px 14px;">
          ${tickets.filter(t => t.status !== 'RESOLVED' && t.status !== 'CLOSED').length} Active Repairs
        </span>
      </div>

      <div class="card">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Student ID</th>
                <th>Category</th>
                <th>Description</th>
                <th>Status</th>
                <th>Resolution Notes</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${tickets.length === 0 ? `
                <tr><td colspan="7" style="text-align: center; padding: 32px;">No maintenance work orders assigned in your sector.</td></tr>
              ` : tickets.map(t => `
                <tr>
                  <td><strong style="color: var(--color-forest);">${t.ticketId}</strong></td>
                  <td><strong>${t.studentId}</strong></td>
                  <td><span class="badge badge-terracotta">${t.category}</span></td>
                  <td style="max-width: 250px;">${t.description}</td>
                  <td><span class="badge ${t.status === 'RESOLVED' ? 'badge-success' : 'badge-warning'}">${t.status}</span></td>
                  <td style="font-size: 12px; color: var(--color-text-muted);">${t.resolutionNotes || '<span style="font-style: italic;">None</span>'}</td>
                  <td>
                    <button class="btn btn-sm btn-primary btn-resolve-tkt" data-id="${t.ticketId}">
                      Update Status
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    container.querySelectorAll('.btn-resolve-tkt').forEach(btn => {
      btn.addEventListener('click', () => {
        const ticketId = btn.getAttribute('data-id');
        const content = document.createElement('div');
        content.innerHTML = `
          <div class="form-group">
            <label class="form-label">New Status</label>
            <select class="form-control" id="modal-staff-tkt-status">
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Resolution / Action Taken</label>
            <input type="text" class="form-control" id="modal-staff-tkt-notes" placeholder="e.g. Electrician fixed wiring connection" required />
          </div>
        `;

        openModal({
          title: `Update Ticket ${ticketId}`,
          content,
          confirmText: 'Save Status',
          onConfirm: async () => {
            const status = content.querySelector('#modal-staff-tkt-status').value;
            const notes = content.querySelector('#modal-staff-tkt-notes').value.trim();
            try {
              await ticketsApi.updateStatus(ticketId, status, notes);
              state.showToast(`Ticket ${ticketId} updated to ${status}!`, 'success');
              state.setRoute('tickets');
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
    container.innerHTML = `<div class="empty-state"><p style="color: var(--color-danger);">Failed to load tickets: ${err.message}</p></div>`;
  }

  return container;
}
