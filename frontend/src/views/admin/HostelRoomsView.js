// NIVAS Dedicated Hostel Occupancy & Bed Allocation View (Admin)
import { state } from '../../state.js';
import { roomsApi, adminApi } from '../../api.js';
import { getIcon } from '../../icons.js';

export async function renderHostelRoomsView() {
  const container = document.createElement('div');
  container.className = 'hostel-rooms-view';

  try {
    const [roomsRes, overviewRes] = await Promise.all([
      roomsApi.getAll(),
      adminApi.getOverview()
    ]);

    const rooms = roomsRes.success ? roomsRes.rooms : [];
    const overview = overviewRes.success ? overviewRes : { totalRooms: rooms.length, totalBeds: 0, occupiedBeds: 0, availableBeds: 0 };

    const occPercent = overview.totalBeds > 0 ? Math.round((overview.occupiedBeds / overview.totalBeds) * 100) : 0;

    container.innerHTML = `
      <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px;">
        <div>
          <h2 style="font-size: 24px; font-weight: 800; color: var(--color-text);">Hostel Occupancy & Bed Allocation</h2>
          <p style="font-size: 14px; color: var(--color-text-muted);">
            Real-time visual monitoring of room capacities, block allotments, and single-occupancy bed distribution.
          </p>
        </div>

        <div style="font-size: 13px; color: var(--color-text-muted);">
          Campus Housing: <strong>Block A & Block B</strong>
        </div>
      </div>

      <!-- KPI Overview Grid -->
      <div class="kpi-grid">
        <div class="kpi-card accent-green">
          <div class="kpi-icon-box">
            ${getIcon('building', 24)}
          </div>
          <div class="kpi-details">
            <div class="kpi-label">Total Rooms</div>
            <div class="kpi-value">${overview.totalRooms}</div>
            <div class="kpi-subtext">Across 2 residential wings</div>
          </div>
        </div>

        <div class="kpi-card accent-orange">
          <div class="kpi-icon-box orange">
            ${getIcon('bed', 24)}
          </div>
          <div class="kpi-details">
            <div class="kpi-label">Bed Capacity</div>
            <div class="kpi-value">${overview.totalBeds} <span style="font-size: 14px; font-weight: 500; color: var(--color-text-muted);">Total Beds</span></div>
            <div class="kpi-subtext">${overview.occupiedBeds} occupied • ${overview.availableBeds} available</div>
          </div>
        </div>

        <div class="kpi-card accent-coral">
          <div class="kpi-icon-box">
            ${getIcon('award', 24)}
          </div>
          <div class="kpi-details">
            <div class="kpi-label">Occupancy Rate</div>
            <div class="kpi-value">${occPercent}%</div>
            <div style="background: var(--color-border); height: 6px; border-radius: 3px; margin-top: 6px; overflow: hidden;">
              <div style="background: linear-gradient(90deg, var(--color-forest), var(--color-primary)); width: ${occPercent}%; height: 100%;"></div>
            </div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon-box">
            ${getIcon('shield', 24)}
          </div>
          <div class="kpi-details">
            <div class="kpi-label">Allocation Policy</div>
            <div class="kpi-value" style="font-size: 18px;">Single-Occupant</div>
            <div class="kpi-subtext">Zero double-booking guarantee</div>
          </div>
        </div>
      </div>

      <!-- Filter Controls -->
      <div class="card" style="margin-bottom: 24px; padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-sm btn-secondary room-filter-btn active" data-filter="all">All Blocks (${rooms.length} Rooms)</button>
          <button class="btn btn-sm btn-secondary room-filter-btn" data-filter="Block A">Block A (Senior Wing)</button>
          <button class="btn btn-sm btn-secondary room-filter-btn" data-filter="Block B">Block B (Junior Wing)</button>
        </div>

        <div style="display: flex; align-items: center; gap: 16px; font-size: 12px;">
          <span style="display: flex; align-items: center; gap: 6px;">
            <span style="width: 10px; height: 10px; border-radius: 2px; background: var(--color-forest);"></span> Free Bed
          </span>
          <span style="display: flex; align-items: center; gap: 6px;">
            <span style="width: 10px; height: 10px; border-radius: 2px; background: var(--color-danger);"></span> Occupied Bed
          </span>
        </div>
      </div>

      <!-- Rooms Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px;" id="admin-rooms-grid">
        ${rooms.map(r => `
          <div class="card admin-room-card" data-block="${r.block}">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
              <div>
                <h3 style="font-size: 19px; font-weight: 800; color: var(--color-text);">Room ${r.roomNumber}</h3>
                <div style="font-size: 12px; color: var(--color-forest); font-weight: 700;">${r.block} • Floor ${r.floor}</div>
              </div>
              <span class="badge ${r.isFull ? 'badge-danger' : 'badge-info'}">
                ${r.isFull ? 'FULL' : `${r.availableCount}/${r.capacity} Free`}
              </span>
            </div>

            <div style="font-size: 12px; color: var(--color-text-muted); margin-bottom: 14px;">
              Total Capacity: <strong>${r.capacity} Students</strong>
            </div>

            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${r.beds.map(b => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; border-radius: var(--radius-md); background: ${b.occupied ? 'var(--color-bg)' : 'var(--color-sage-subtle)'}; border: 1px solid ${b.occupied ? 'var(--color-border)' : 'var(--color-info-border)'};">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: ${b.occupied ? 'var(--color-danger)' : 'var(--color-forest)'};">
                      ${getIcon('bed', 16)}
                    </span>
                    <strong style="font-size: 13px; color: var(--color-text);">${b.bedCode}</strong>
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

    // Filter logic
    const filterBtns = container.querySelectorAll('.room-filter-btn');
    const cards = container.querySelectorAll('.admin-room-card');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active', 'btn-primary'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        cards.forEach(card => {
          if (filter === 'all' || card.getAttribute('data-block') === filter) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

  } catch (err) {
    container.innerHTML = `<div class="empty-state"><p style="color: var(--color-danger);">Failed to load rooms: ${err.message}</p></div>`;
  }

  return container;
}
