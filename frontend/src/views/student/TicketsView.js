// NIVAS Student Maintenance Tickets View
import { state } from '../../state.js';
import { ticketsApi } from '../../api.js';
import { getIcon } from '../../icons.js';
import { openModal } from '../../components/Modal.js';

export async function renderTicketsView() {
  const user = state.user;
  const container = document.createElement('div');
  container.className = 'tickets-view';

  try {
    const res = await ticketsApi.getAll(user.studentId || user.id);
    const tickets = res.success ? res.tickets : [];

    container.innerHTML = `
      <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px;">
        <div>
          <h2 style="font-size: 24px; font-weight: 800; color: var(--color-text);">Maintenance & Facility Tickets</h2>
          <p style="font-size: 14px; color: var(--color-text-muted);">
            Report electrical, plumbing, carpentry, or appliance issues directly to your hostel block supervisor.
          </p>
        </div>

        <button class="btn btn-primary" id="btn-raise-ticket">
          ${getIcon('plus', 16)}
          <span>Raise New Ticket</span>
        </button>
      </div>

      <!-- Tickets List Table -->
      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title">${getIcon('tool', 18)} Your Submitted Tickets</h3>
            <p class="card-subtitle">Lifecycle: SUBMITTED → ASSIGNED → IN_PROGRESS → RESOLVED → CLOSED</p>
          </div>
          <span class="badge badge-info">${tickets.length} Total Tickets</span>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Created Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Assigned Staff</th>
                <th>Current Status</th>
                <th>Resolution Notes</th>
              </tr>
            </thead>
            <tbody>
              ${tickets.length === 0 ? `
                <tr>
                  <td colspan="7" style="text-align: center; padding: 36px; color: var(--color-text-muted);">
                    No maintenance tickets submitted. If your room needs electrical, plumbing, or appliance repairs, click "Raise New Ticket" above.
                  </td>
                </tr>
              ` : tickets.map(t => {
                let badgeClass = 'badge-warning';
                if (t.status === 'RESOLVED' || t.status === 'CLOSED') badgeClass = 'badge-success';
                else if (t.status === 'IN_PROGRESS') badgeClass = 'badge-info';
                else if (t.status === 'ASSIGNED') badgeClass = 'badge-terracotta';

                return `
                  <tr>
                    <td><strong>${t.ticketId}</strong></td>
                    <td>${t.createdDate}</td>
                    <td><span class="badge badge-sage" style="background: var(--color-sage); color: var(--color-forest);">${t.category}</span></td>
                    <td style="max-width: 250px;">${t.description}</td>
                    <td>${t.assignedToStaffId || '<span style="color: var(--color-text-muted);">Unassigned</span>'}</td>
                    <td><span class="badge ${badgeClass}">${t.status}</span></td>
                    <td>${t.resolutionNotes || '<span style="color: var(--color-text-muted); font-style: italic;">Pending resolution</span>'}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Raise ticket modal
    const btnRaise = container.querySelector('#btn-raise-ticket');
    if (btnRaise) {
      btnRaise.addEventListener('click', () => {
        const content = document.createElement('div');
        content.innerHTML = `
          <div class="form-group">
            <label class="form-label">Category</label>
            <select class="form-control" id="modal-category">
              <option value="Electrical">Electrical (Switches, Lights, Fan, Sockets)</option>
              <option value="Plumbing">Plumbing (Tap leakage, Shower, Flush, Drain)</option>
              <option value="Carpentry">Carpentry (Bed frame, Wardrobe, Desk, Door lock)</option>
              <option value="Network">Wi-Fi & LAN Network connectivity</option>
              <option value="Appliance">Water Cooler / Geyser / Air Conditioner</option>
              <option value="General">General Housekeeping</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Issue Description</label>
            <textarea class="form-control" id="modal-desc" rows="4" placeholder="Please describe the exact issue and location in your room..." required></textarea>
          </div>
        `;

        openModal({
          title: 'Raise Maintenance Ticket',
          content,
          confirmText: 'Submit Ticket',
          onConfirm: async () => {
            const cat = content.querySelector('#modal-category').value;
            const desc = content.querySelector('#modal-desc').value.trim();
            if (!desc) {
              state.showToast('Please enter an issue description', 'warning');
              return false;
            }

            try {
              const res = await ticketsApi.create(user.studentId, cat, desc);
              if (res.success) {
                state.showToast(`Ticket ${res.ticket.ticketId} created with status SUBMITTED!`, 'success');
                state.setRoute('tickets');
                return true;
              }
            } catch (err) {
              state.showToast(err.message || 'Error raising ticket', 'danger');
              return false;
            }
          }
        });
      });
    }

  } catch (err) {
    container.innerHTML = `<div class="empty-state"><p style="color: var(--color-danger);">Failed to load tickets: ${err.message}</p></div>`;
  }

  return container;
}
