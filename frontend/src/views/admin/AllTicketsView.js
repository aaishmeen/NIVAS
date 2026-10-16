// NIVAS Dedicated Maintenance Tickets Oversight View (Admin)
import { state } from '../../state.js';
import { ticketsApi } from '../../api.js';
import { getIcon } from '../../icons.js';
import { openModal } from '../../components/Modal.js';

export async function renderAllTicketsView() {
  const container = document.createElement('div');
  container.className = 'all-tickets-view';

  try {
    const res = await ticketsApi.getAll();
    const tickets = res.success ? res.tickets : [];

    const submittedCount = tickets.filter(t => t.status === 'SUBMITTED').length;
    const assignedCount = tickets.filter(t => t.status === 'ASSIGNED').length;
    const inProgressCount = tickets.filter(t => t.status === 'IN_PROGRESS').length;
    const resolvedCount = tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length;

    container.innerHTML = `
      <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px;">
        <div>
          <h2 style="font-size: 24px; font-weight: 800; color: var(--color-text);">Facility Maintenance Tickets Oversight</h2>
          <p style="font-size: 14px; color: var(--color-text-muted);">
            Comprehensive log of all student maintenance requests across campus with staff delegation and status auditing.
          </p>
        </div>

        <div style="display: flex; gap: 10px;">
          <span class="badge badge-warning" style="font-size: 13px; padding: 6px 14px;">
            ${submittedCount + assignedCount + inProgressCount} Open Tickets
          </span>
          <span class="badge badge-success" style="font-size: 13px; padding: 6px 14px;">
            ${resolvedCount} Resolved
          </span>
        </div>
      </div>

      <!-- Controls: Filters & Search -->
      <div class="card" style="margin-bottom: 24px; padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button class="btn btn-sm btn-secondary tkt-filter-btn active" data-filter="all">All (${tickets.length})</button>
          <button class="btn btn-sm btn-secondary tkt-filter-btn" data-filter="SUBMITTED">Submitted (${submittedCount})</button>
          <button class="btn btn-sm btn-secondary tkt-filter-btn" data-filter="ASSIGNED">Assigned (${assignedCount})</button>
          <button class="btn btn-sm btn-secondary tkt-filter-btn" data-filter="IN_PROGRESS">In Progress (${inProgressCount})</button>
          <button class="btn btn-sm btn-secondary tkt-filter-btn" data-filter="RESOLVED">Resolved (${resolvedCount})</button>
        </div>

        <div style="position: relative; max-width: 260px; width: 100%;">
          <input type="text" id="tickets-search" class="form-control" placeholder="Search ticket or student..." style="padding-left: 36px;" />
          <div style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--color-text-subtle);">
            ${getIcon('search', 16)}
          </div>
        </div>
      </div>

      <!-- Tickets Table -->
      <div class="card">
        <div class="table-container">
          <table class="data-table" id="all-tickets-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Student ID</th>
                <th>Category</th>
                <th>Issue Description</th>
                <th>Date Logged</th>
                <th>Assigned Staff</th>
                <th>Status</th>
                <th>Resolution Notes</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${tickets.length === 0 ? `
                <tr><td colspan="9" style="text-align: center; padding: 32px;">No maintenance tickets registered in system.</td></tr>
              ` : tickets.map(t => {
                let badgeClass = 'badge-warning';
                if (t.status === 'RESOLVED' || t.status === 'CLOSED') badgeClass = 'badge-success';
                else if (t.status === 'IN_PROGRESS') badgeClass = 'badge-info';
                else if (t.status === 'ASSIGNED') badgeClass = 'badge-terracotta';

                return `
                  <tr class="tkt-row" data-status="${t.status}" data-id="${t.ticketId.toLowerCase()}" data-student="${t.studentId.toLowerCase()}">
                    <td><strong style="color: var(--color-forest);">${t.ticketId}</strong></td>
                    <td><strong>${t.studentId}</strong></td>
                    <td><span class="badge badge-terracotta">${t.category}</span></td>
                    <td style="max-width: 240px;">${t.description}</td>
                    <td>${t.createdDate}</td>
                    <td>
                      ${t.assignedToStaffId ? `
                        <strong style="color: var(--color-forest);">${t.assignedToStaffId}</strong>
                      ` : `
                        <span style="color: var(--color-danger); font-weight: 700;">Unassigned</span>
                      `}
                    </td>
                    <td><span class="badge ${badgeClass}">${t.status}</span></td>
                    <td style="font-size: 12px; color: var(--color-text-muted); max-width: 200px;">
                      ${t.resolutionNotes || '<span style="font-style: italic;">None</span>'}
                    </td>
                    <td>
                      <button class="btn btn-sm btn-primary btn-manage-tkt" data-id="${t.ticketId}" data-staff="${t.assignedToStaffId || 'STF01'}" data-status="${t.status}" data-notes="${t.resolutionNotes || ''}">
                        Manage
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

    // Filter tabs
    const filterTabs = container.querySelectorAll('.tkt-filter-btn');
    const rows = container.querySelectorAll('.tkt-row');
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

    // Search filter
    const searchInput = container.querySelector('#tickets-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        rows.forEach(row => {
          const id = row.getAttribute('data-id');
          const student = row.getAttribute('data-student');
          if (id.includes(query) || student.includes(query)) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      });
    }

    // Manage ticket modal
    container.querySelectorAll('.btn-manage-tkt').forEach(btn => {
      btn.addEventListener('click', () => {
        const ticketId = btn.getAttribute('data-id');
        const curStaff = btn.getAttribute('data-staff');
        const curStatus = btn.getAttribute('data-status');
        const curNotes = btn.getAttribute('data-notes');

        const content = document.createElement('div');
        content.innerHTML = `
          <div class="form-group">
            <label class="form-label">Assign to Staff Member / Supervisor</label>
            <select class="form-control" id="modal-manage-staff">
              <option value="STF01" ${curStaff === 'STF01' ? 'selected' : ''}>STF01 - Mr. Suresh Kumar (Hostel Warden, Block A)</option>
              <option value="STF02" ${curStaff === 'STF02' ? 'selected' : ''}>STF02 - Mr. Ramesh Verma (Maintenance Supervisor, Block B)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Update Ticket Status</label>
            <select class="form-control" id="modal-manage-status">
              <option value="SUBMITTED" ${curStatus === 'SUBMITTED' ? 'selected' : ''}>SUBMITTED</option>
              <option value="ASSIGNED" ${curStatus === 'ASSIGNED' ? 'selected' : ''}>ASSIGNED</option>
              <option value="IN_PROGRESS" ${curStatus === 'IN_PROGRESS' ? 'selected' : ''}>IN_PROGRESS</option>
              <option value="RESOLVED" ${curStatus === 'RESOLVED' ? 'selected' : ''}>RESOLVED</option>
              <option value="CLOSED" ${curStatus === 'CLOSED' ? 'selected' : ''}>CLOSED</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Resolution / Action Notes</label>
            <textarea class="form-control" id="modal-manage-notes" rows="3" placeholder="Enter resolution details...">${curNotes}</textarea>
          </div>
        `;

        openModal({
          title: `Manage Ticket ${ticketId}`,
          content,
          confirmText: 'Save Ticket Updates',
          onConfirm: async () => {
            const staffId = content.querySelector('#modal-manage-staff').value;
            const newStatus = content.querySelector('#modal-manage-status').value;
            const notes = content.querySelector('#modal-manage-notes').value.trim();

            try {
              await ticketsApi.assign(ticketId, staffId);
              await ticketsApi.updateStatus(ticketId, newStatus, notes);
              state.showToast(`Ticket ${ticketId} updated successfully!`, 'success');
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
