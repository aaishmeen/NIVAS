// NIVAS Emergency & Resident Assistance View
import { state } from '../../state.js';
import { assistanceApi } from '../../api.js';
import { getIcon } from '../../icons.js';
import { openModal } from '../../components/Modal.js';

export async function renderAssistanceView() {
  const user = state.user;
  const container = document.createElement('div');
  container.className = 'assistance-view';

  try {
    const res = await assistanceApi.getAll(user.studentId || user.id);
    const requests = res.success ? res.requests : [];

    container.innerHTML = `
      <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px;">
        <div>
          <h2 style="font-size: 24px; font-weight: 800; color: var(--color-text);">Emergency & Resident Assistance</h2>
          <p style="font-size: 14px; color: var(--color-text-muted);">
            Immediate 24/7 priority support for health emergencies, medical doctor dispatches, ambulance, and sick student meal delivery.
          </p>
        </div>

        <button class="btn btn-danger" id="btn-emergency-request">
          ${getIcon('phoneCall', 16)}
          <span>Request Urgent Assistance</span>
        </button>
      </div>

      <!-- Quick Dispatch Cards -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 28px;">
        <div class="card btn-urgent-type" data-type="MEDICAL_HELP" style="cursor: pointer; padding: 20px; border-left: 4px solid var(--color-danger); transition: all 0.2s;">
          <div style="font-size: 24px; margin-bottom: 8px;">🩺</div>
          <strong style="color: var(--color-text); font-size: 15px; display: block;">Medical Doctor Aid</strong>
          <span style="font-size: 12px; color: var(--color-text-muted);">Doctor or nurse room visit for fever or illness</span>
        </div>

        <div class="card btn-urgent-type" data-type="AMBULANCE" style="cursor: pointer; padding: 20px; border-left: 4px solid #b91c1c; transition: all 0.2s;">
          <div style="font-size: 24px; margin-bottom: 8px;">🚑</div>
          <strong style="color: var(--color-text); font-size: 15px; display: block;">Emergency Ambulance</strong>
          <span style="font-size: 12px; color: var(--color-text-muted);">Immediate transport to University Hospital</span>
        </div>

        <div class="card btn-urgent-type" data-type="FOOD_IN_ROOM" style="cursor: pointer; padding: 20px; border-left: 4px solid var(--color-primary); transition: all 0.2s;">
          <div style="font-size: 24px; margin-bottom: 8px;">🍲</div>
          <strong style="color: var(--color-text); font-size: 15px; display: block;">Sick Meal Delivery</strong>
          <span style="font-size: 12px; color: var(--color-text-muted);">Light mess food delivered to room for sick students</span>
        </div>

        <div class="card btn-urgent-type" data-type="URGENT_HELP" style="cursor: pointer; padding: 20px; border-left: 4px solid var(--color-warning); transition: all 0.2s;">
          <div style="font-size: 24px; margin-bottom: 8px;">🛡️</div>
          <strong style="color: var(--color-text); font-size: 15px; display: block;">Warden Intervention</strong>
          <span style="font-size: 12px; color: var(--color-text-muted);">Urgent security or disciplinary presence</span>
        </div>
      </div>

      <!-- Requests History Table -->
      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title">${getIcon('clock', 18)} Assistance Requests Log</h3>
            <p class="card-subtitle">REQUESTED → ACKNOWLEDGED → ASSIGNED → IN_PROGRESS → COMPLETED</p>
          </div>
          <span class="badge badge-info">${requests.length} Total Requests</span>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Timestamp</th>
                <th>Care Type</th>
                <th>Details / Symptoms</th>
                <th>Assigned Staff</th>
                <th>Current Status</th>
              </tr>
            </thead>
            <tbody>
              ${requests.length === 0 ? `
                <tr>
                  <td colspan="6" style="text-align: center; padding: 36px; color: var(--color-text-muted);">
                    No emergency or assistance requests logged. In case of illness or emergency, use the buttons above.
                  </td>
                </tr>
              ` : requests.map(a => {
                let badgeClass = 'badge-warning';
                if (a.status === 'COMPLETED') badgeClass = 'badge-success';
                else if (a.status === 'IN_PROGRESS' || a.status === 'ASSIGNED') badgeClass = 'badge-info';
                else if (a.status === 'REQUESTED') badgeClass = 'badge-danger';

                return `
                  <tr>
                    <td><strong>${a.requestId}</strong></td>
                    <td>${a.timestamp}</td>
                    <td><span class="badge badge-terracotta">${a.assistanceType}</span></td>
                    <td style="max-width: 250px;">${a.description}</td>
                    <td>${a.assignedStaffId || 'Pending dispatch'}</td>
                    <td><span class="badge ${badgeClass}">${a.status}</span></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    function openAssistanceModal(preselectedType = 'MEDICAL_HELP') {
      const content = document.createElement('div');
      content.innerHTML = `
        <div class="form-group">
          <label class="form-label">Assistance Type</label>
          <select class="form-control" id="modal-ast-type">
            <option value="MEDICAL_HELP" ${preselectedType === 'MEDICAL_HELP' ? 'selected' : ''}>Medical Doctor / Campus Clinic Aid</option>
            <option value="AMBULANCE" ${preselectedType === 'AMBULANCE' ? 'selected' : ''}>Urgent Hospital Ambulance</option>
            <option value="FOOD_IN_ROOM" ${preselectedType === 'FOOD_IN_ROOM' ? 'selected' : ''}>Sick Student Meal Delivery to Room</option>
            <option value="URGENT_HELP" ${preselectedType === 'URGENT_HELP' ? 'selected' : ''}>Urgent Security / Warden Presence</option>
            <option value="GENERAL_HELP" ${preselectedType === 'GENERAL_HELP' ? 'selected' : ''}>General Resident Support</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">Symptoms / Situation Details</label>
          <textarea class="form-control" id="modal-ast-desc" rows="4" placeholder="Briefly describe your symptoms or urgent situation (e.g. high fever, allergic reaction)..." required></textarea>
        </div>
      `;

      openModal({
        title: 'Emergency Assistance Dispatch',
        content,
        confirmText: 'Dispatch Emergency Request',
        confirmClass: 'btn-danger',
        onConfirm: async () => {
          const type = content.querySelector('#modal-ast-type').value;
          const desc = content.querySelector('#modal-ast-desc').value.trim();
          if (!desc) {
            state.showToast('Please provide brief symptom or situation details', 'warning');
            return false;
          }

          try {
            const r = await assistanceApi.create(user.studentId, type, desc);
            if (r.success) {
              state.showToast(`Emergency request ${r.request.requestId} registered. Duty staff notified!`, 'success');
              state.setRoute('assistance');
              return true;
            }
          } catch (err) {
            state.showToast(err.message || 'Error submitting request', 'danger');
            return false;
          }
        }
      });
    }

    container.querySelector('#btn-emergency-request')?.addEventListener('click', () => openAssistanceModal());

    container.querySelectorAll('.btn-urgent-type').forEach(card => {
      card.addEventListener('click', () => {
        const type = card.getAttribute('data-type');
        openAssistanceModal(type);
      });
    });

  } catch (err) {
    container.innerHTML = `<div class="empty-state"><p style="color: var(--color-danger);">Failed to load assistance data: ${err.message}</p></div>`;
  }

  return container;
}
