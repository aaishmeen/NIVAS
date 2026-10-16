// NIVAS Rooms & Beds View
import { state } from '../../state.js';
import { roomsApi, studentApi } from '../../api.js';
import { getIcon } from '../../icons.js';

export async function renderRoomsView() {
  const user = state.user;
  const container = document.createElement('div');
  container.className = 'rooms-view';

  try {
    const [roomsRes, studRes] = await Promise.all([
      roomsApi.getAll(),
      user.role === 'STUDENT' ? studentApi.getDashboard(user.studentId || user.id) : Promise.resolve({ success: false })
    ]);

    const rooms = roomsRes.success ? roomsRes.rooms : [];
    const student = studRes.success ? studRes.student : null;

    container.innerHTML = `
      <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px;">
        <div>
          <h2 style="font-size: 24px; font-weight: 800; color: var(--color-text);">Hostel Rooms & Bed Availability</h2>
          <p style="font-size: 14px; color: var(--color-text-muted);">
            Real-time occupancy status across Block A and Block B with strict single-occupancy bed enforcement.
          </p>
        </div>

        ${student && student.allocatedRoom ? `
          <div style="padding: 10px 18px; border-radius: var(--radius-md); background: var(--color-sage); color: var(--color-forest); font-weight: 700; font-size: 14px; border: 1px solid var(--color-info-border);">
            Your Room: Room ${student.allocatedRoom} (${student.allocatedBed})
          </div>
        ` : ''}
      </div>

      <!-- Filter Controls -->
      <div class="card" style="margin-bottom: 24px; padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-sm btn-secondary filter-btn active" data-filter="all">All Blocks</button>
          <button class="btn btn-sm btn-secondary filter-btn" data-filter="Block A">Block A (Senior Wing)</button>
          <button class="btn btn-sm btn-secondary filter-btn" data-filter="Block B">Block B (Junior Wing)</button>
        </div>

        <div style="font-size: 13px; color: var(--color-text-muted);">
          Total Rooms: <strong>${rooms.length}</strong>
        </div>
      </div>

      <!-- Rooms Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px;" id="rooms-grid">
        ${rooms.map(r => {
          const isMyRoom = student && student.allocatedRoom === r.roomNumber;
          return `
            <div class="card room-card" data-block="${r.block}" style="border: 2px solid ${isMyRoom ? 'var(--color-primary)' : 'var(--color-border)'};">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <div>
                  <h3 style="font-size: 18px; font-weight: 800; color: var(--color-text);">Room ${r.roomNumber}</h3>
                  <div style="font-size: 12px; color: var(--color-forest); font-weight: 600;">${r.block} • Floor ${r.floor}</div>
                </div>
                <span class="badge ${r.isFull ? 'badge-danger' : 'badge-info'}">
                  ${r.isFull ? 'FULLY OCCUPIED' : `${r.availableCount}/${r.capacity} BEDS FREE`}
                </span>
              </div>

              <div style="font-size: 12px; color: var(--color-text-muted); margin-bottom: 12px;">
                Capacity: <strong>${r.capacity} Residents</strong>
              </div>

              <!-- Beds Layout -->
              <div style="display: flex; flex-direction: column; gap: 8px;">
                ${r.beds.map(b => {
                  const isMyBed = isMyRoom && student.allocatedBed === b.bedCode;
                  const isOccupied = b.occupied && !isMyBed;
                  return `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; border-radius: var(--radius-md); background: ${isMyBed ? 'var(--color-primary-subtle)' : (isOccupied ? 'var(--color-bg)' : '#fff')}; border: 1px solid ${isMyBed ? 'var(--color-primary)' : 'var(--color-border)'};">
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="color: ${isMyBed ? 'var(--color-primary)' : (isOccupied ? 'var(--color-danger)' : 'var(--color-forest)')};">
                          ${getIcon('bed', 16)}
                        </span>
                        <strong style="font-size: 13px; color: var(--color-text);">${b.bedCode}</strong>
                      </div>

                      <div>
                        ${isMyBed ? `
                          <span class="badge badge-terracotta">Your Bed</span>
                        ` : (isOccupied ? `
                          <span class="badge badge-danger">Occupied (${b.allocatedStudentId})</span>
                        ` : `
                          <span class="badge badge-success">Available</span>
                        `)}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Filter logic
    const filterBtns = container.querySelectorAll('.filter-btn');
    const cards = container.querySelectorAll('.room-card');
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
