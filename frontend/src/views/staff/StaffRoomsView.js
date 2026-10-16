// NIVAS Dedicated Staff Sector Rooms View
import { state } from '../../state.js';
import { staffApi } from '../../api.js';
import { getIcon } from '../../icons.js';

export async function renderStaffRoomsView() {
  const user = state.user;
  const container = document.createElement('div');
  container.className = 'staff-rooms-view';

  try {
    const res = await staffApi.getOverview(user.id);
    const rooms = res.success ? (res.rooms || []) : [];
    const block = res.assignedBlock || 'Block A';

    container.innerHTML = `
      <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px;">
        <div>
          <h2 style="font-size: 24px; font-weight: 800; color: var(--color-text);">Sector Residential Rooms & Beds</h2>
          <p style="font-size: 14px; color: var(--color-text-muted);">
            Occupancy and resident directory for your assigned sector: <strong>${block}</strong>.
          </p>
        </div>

        <span class="badge badge-info" style="font-size: 13px; padding: 6px 14px;">
          ${rooms.length} Rooms in Sector
        </span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px;">
        ${rooms.map(r => `
          <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <div>
                <h3 style="font-size: 18px; font-weight: 800; color: var(--color-text);">Room ${r.roomNumber}</h3>
                <div style="font-size: 12px; color: var(--color-forest); font-weight: 600;">${r.block} • Floor ${r.floor}</div>
              </div>
              <span class="badge ${r.isFull ? 'badge-danger' : 'badge-info'}">
                ${r.isFull ? 'FULL' : `${r.availableCount}/${r.capacity} Free`}
              </span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${r.beds.map(b => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; border-radius: var(--radius-md); background: ${b.occupied ? 'var(--color-bg)' : 'var(--color-sage-subtle)'}; border: 1px solid var(--color-border);">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: ${b.occupied ? 'var(--color-danger)' : 'var(--color-forest)'};">
                      ${getIcon('bed', 16)}
                    </span>
                    <strong style="font-size: 13px;">${b.bedCode}</strong>
                  </div>
                  <div>
                    ${b.occupied ? `
                      <span class="badge badge-danger">Occupied (${b.allocatedStudentId})</span>
                    ` : `
                      <span class="badge badge-success">Available</span>
                    `}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;

  } catch (err) {
    container.innerHTML = `<div class="empty-state"><p style="color: var(--color-danger);">Failed to load rooms: ${err.message}</p></div>`;
  }

  return container;
}
