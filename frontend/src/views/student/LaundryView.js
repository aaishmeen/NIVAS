// NIVAS Laundry Management View
import { state } from '../../state.js';
import { laundryApi, studentApi } from '../../api.js';
import { getIcon } from '../../icons.js';
import { openModal } from '../../components/Modal.js';

export async function renderLaundryView() {
  const user = state.user;
  const container = document.createElement('div');
  container.className = 'laundry-view';

  try {
    const [studRes, reqRes] = await Promise.all([
      studentApi.getDashboard(user.studentId || user.id),
      laundryApi.getRequests(user.studentId || user.id)
    ]);

    const s = studRes.success ? studRes.student : null;
    const laundryPlan = s && s.laundryPlan ? s.laundryPlan : { remainingCycles: 30, totalCycles: 30, usedCycles: 0 };
    const requests = reqRes.success ? reqRes.requests : [];

    const percentLeft = Math.round((laundryPlan.remainingCycles / (laundryPlan.totalCycles || 30)) * 100);

    container.innerHTML = `
      <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px;">
        <div>
          <h2 style="font-size: 24px; font-weight: 800; color: var(--color-text);">Laundry Service & Quota Management</h2>
          <p style="font-size: 14px; color: var(--color-text-muted);">
            Complimentary 30-cycle annual laundry service with real-time pickup tracking and automatic cycle reconciliation.
          </p>
        </div>

        <button class="btn btn-primary" id="btn-new-pickup" ${laundryPlan.remainingCycles <= 0 ? 'disabled' : ''}>
          ${getIcon('plus', 16)}
          <span>Request Laundry Pickup</span>
        </button>
      </div>

      <!-- Quota Meter Card -->
      <div class="card" style="margin-bottom: 28px; padding: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
          <div style="display: flex; align-items: center; gap: 18px;">
            <div style="width: 56px; height: 56px; border-radius: var(--radius-md); background: var(--color-primary-subtle); color: var(--color-primary); display: flex; align-items: center; justify-content: center;">
              ${getIcon('shirt', 32)}
            </div>
            <div>
              <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--color-text-muted); letter-spacing: 0.6px;">
                Annual Laundry Allowance
              </div>
              <div style="font-family: var(--font-heading); font-size: 28px; font-weight: 800; color: var(--color-text);">
                ${laundryPlan.remainingCycles} <span style="font-size: 16px; font-weight: 500; color: var(--color-text-muted);">/ ${laundryPlan.totalCycles} Cycles Remaining</span>
              </div>
            </div>
          </div>

          <div style="text-align: right;">
            <span class="badge ${laundryPlan.remainingCycles > 5 ? 'badge-success' : 'badge-danger'}">
              ${laundryPlan.remainingCycles > 0 ? 'Quota Active' : 'Quota Exhausted'}
            </span>
            <div style="font-size: 12px; color: var(--color-text-muted); margin-top: 4px;">
              ${laundryPlan.usedCycles} cycles consumed so far
            </div>
          </div>
        </div>

        <div style="background: var(--color-border); height: 8px; border-radius: 4px; margin-top: 20px; overflow: hidden;">
          <div style="background: linear-gradient(90deg, var(--color-forest), var(--color-primary)); width: ${percentLeft}%; height: 100%; transition: width 0.3s;"></div>
        </div>

        <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--color-text-muted); margin-top: 6px;">
          <span>0 Cycles</span>
          <span>15 Cycles</span>
          <span>30 Cycles</span>
        </div>
      </div>

      <!-- Requests History Table -->
      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title">${getIcon('clock', 18)} Laundry Pickup Request History</h3>
            <p class="card-subtitle">Lifecycle tracking: REQUESTED → PICKED_UP → PROCESSING → READY → DELIVERED</p>
          </div>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Submission Date</th>
                <th>Pieces / Clothes</th>
                <th>Current Status</th>
                <th>Cycle Deducted</th>
              </tr>
            </thead>
            <tbody>
              ${requests.length === 0 ? `
                <tr>
                  <td colspan="5" style="text-align: center; padding: 32px; color: var(--color-text-muted);">
                    No laundry requests submitted yet. Click "Request Laundry Pickup" above to submit your first wash batch.
                  </td>
                </tr>
              ` : requests.map(r => {
                let badgeClass = 'badge-warning';
                if (r.status === 'DELIVERED') badgeClass = 'badge-success';
                else if (r.status === 'PROCESSING') badgeClass = 'badge-info';
                else if (r.status === 'READY') badgeClass = 'badge-terracotta';

                return `
                  <tr>
                    <td><strong>${r.requestId}</strong></td>
                    <td>${r.requestDate}</td>
                    <td><strong>${r.numberOfClothes}</strong> items</td>
                    <td><span class="badge ${badgeClass}">${r.status}</span></td>
                    <td>${r.cycleDeducted ? '<span class="badge badge-success">✓ 1 Cycle</span>' : '<span style="color: var(--color-text-muted);">On Delivery</span>'}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Pickup modal
    const btnNew = container.querySelector('#btn-new-pickup');
    if (btnNew) {
      btnNew.addEventListener('click', () => {
        const content = document.createElement('div');
        content.innerHTML = `
          <div class="form-group">
            <label class="form-label">Number of Clothes for Wash / Press</label>
            <input type="number" class="form-control" id="modal-clothes-count" min="1" max="25" value="6" required />
            <div style="font-size: 11px; color: var(--color-text-muted); margin-top: 4px;">Recommended limit: 1-15 garments per bag</div>
          </div>
          <div style="padding: 12px; background: var(--color-bg); border-radius: var(--radius-md); font-size: 12px; color: var(--color-text-muted);">
            ℹ️ Daily pickup window: <strong>08:00 AM – 11:00 AM</strong> at the Ground Floor Laundry Counter.<br>
            A cycle will only be deducted from your remaining balance (${laundryPlan.remainingCycles}) once your clothes are returned as <strong>DELIVERED</strong>.
          </div>
        `;

        openModal({
          title: 'Schedule Laundry Pickup',
          content,
          confirmText: 'Submit Request',
          onConfirm: async () => {
            const count = content.querySelector('#modal-clothes-count').value;
            try {
              const res = await laundryApi.createRequest(user.studentId, parseInt(count, 10));
              if (res.success) {
                state.showToast('Laundry pickup request submitted successfully!', 'success');
                state.setRoute('laundry');
                return true;
              }
            } catch (err) {
              state.showToast(err.message || 'Error submitting pickup', 'danger');
              return false;
            }
          }
        });
      });
    }

  } catch (err) {
    container.innerHTML = `<div class="empty-state"><p style="color: var(--color-danger);">Failed to load laundry data: ${err.message}</p></div>`;
  }

  return container;
}
