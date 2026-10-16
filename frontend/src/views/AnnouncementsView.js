// NIVAS Campus Announcements Bulletin View with Strict Role-Based Division Filtering
import { state } from '../state.js';
import { announcementsApi } from '../api.js';
import { getIcon } from '../icons.js';
import { openModal } from '../components/Modal.js';

export async function renderAnnouncementsView() {
  const user = state.user || {};
  const container = document.createElement('div');
  container.className = 'announcements-view';

  try {
    // Pass user.role to fetch role-specific postings
    const res = await announcementsApi.getAll(user.role);
    const allList = res.success ? res.announcements : [];

    let activeFilter = 'ALL';

    const getTargetBadge = (target) => {
      const t = (target || 'ALL').toUpperCase();
      if (t === 'STUDENT') {
        return `<span class="badge badge-primary" style="font-size: 11px;">🎓 Students</span>`;
      } else if (t === 'STAFF') {
        return `<span class="badge badge-info" style="font-size: 11px;">🛡️ Staff & Wardens</span>`;
      } else if (t === 'ADMIN') {
        return `<span class="badge badge-warning" style="font-size: 11px;">⚙️ Admin Only</span>`;
      } else {
        return `<span class="badge badge-success" style="font-size: 11px;">🌐 Campus-Wide</span>`;
      }
    };

    const getBorderColor = (target) => {
      const t = (target || 'ALL').toUpperCase();
      if (t === 'STUDENT') return 'var(--color-primary)';
      if (t === 'STAFF') return 'var(--color-forest)';
      if (t === 'ADMIN') return 'var(--color-warning)';
      return 'var(--color-text)';
    };

    const renderCards = (items) => {
      if (!items || items.length === 0) {
        return `<div class="card empty-state" style="padding: 40px; text-align: center;"><p style="color: var(--color-text-muted);">No postings available for this division at this time.</p></div>`;
      }
      return items.map(a => `
        <div class="card" style="border-left: 5px solid ${getBorderColor(a.targetAudience)}; transition: transform 0.2s ease;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 8px; margin-bottom: 8px;">
            <div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                <h3 style="font-size: 17px; font-weight: 800; color: var(--color-text); margin: 0;">${a.title}</h3>
                ${getTargetBadge(a.targetAudience)}
              </div>
              <div style="font-size: 12px; color: var(--color-forest); font-weight: 600;">Posted by: ${a.author}</div>
            </div>
            <span class="badge badge-neutral" style="font-size: 12px;">${a.date}</span>
          </div>
          <p style="font-size: 14px; color: var(--color-text); line-height: 1.6; margin-top: 10px;">
            ${a.message}
          </p>
        </div>
      `).join('');
    };

    container.innerHTML = `
      <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px;">
        <div>
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
            <h2 style="font-size: 24px; font-weight: 800; color: var(--color-text); margin: 0;">Hostel Announcements Bulletin</h2>
          </div>
          <p style="font-size: 14px; color: var(--color-text-muted); margin: 0;">
            ${user.role === 'STUDENT'
              ? 'Official notices, onboarding updates, and mess guidelines targeted for student residents.'
              : user.role === 'STAFF'
                ? 'Operational notices, duty rosters, and facility protocols targeted for hostel wardens and staff.'
                : 'Central broadcast repository across all student, warden, and administration divisions.'}
          </p>
        </div>

        ${user.role === 'ADMIN' ? `
          <button class="btn btn-primary" id="btn-post-ann">
            ${getIcon('plus', 16)}
            <span>Post New Announcement</span>
          </button>
        ` : ''}
      </div>

      <!-- Admin Division Filter Tabs -->
      ${user.role === 'ADMIN' ? `
        <div style="display: flex; gap: 8px; margin-bottom: 20px; overflow-x: auto; padding-bottom: 4px;">
          <button type="button" class="btn btn-sm btn-primary ann-filter-btn" data-filter="ALL">All Postings (${allList.length})</button>
          <button type="button" class="btn btn-sm btn-secondary ann-filter-btn" data-filter="STUDENT">Students (${allList.filter(a => a.targetAudience === 'STUDENT').length})</button>
          <button type="button" class="btn btn-sm btn-secondary ann-filter-btn" data-filter="STAFF">Staff Division (${allList.filter(a => a.targetAudience === 'STAFF').length})</button>
          <button type="button" class="btn btn-sm btn-secondary ann-filter-btn" data-filter="ADMIN">Admin Division (${allList.filter(a => a.targetAudience === 'ADMIN').length})</button>
        </div>
      ` : ''}

      <div id="announcements-list-container" style="display: flex; flex-direction: column; gap: 16px;">
        ${renderCards(allList)}
      </div>
    `;

    // Admin filter buttons logic
    if (user.role === 'ADMIN') {
      const listContainer = container.querySelector('#announcements-list-container');
      const filterBtns = container.querySelectorAll('.ann-filter-btn');

      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          filterBtns.forEach(b => {
            b.classList.remove('btn-primary');
            b.classList.add('btn-secondary');
          });
          btn.classList.remove('btn-secondary');
          btn.classList.add('btn-primary');

          activeFilter = btn.getAttribute('data-filter');
          if (activeFilter === 'ALL') {
            listContainer.innerHTML = renderCards(allList);
          } else {
            const filtered = allList.filter(a => (a.targetAudience || 'ALL').toUpperCase() === activeFilter);
            listContainer.innerHTML = renderCards(filtered);
          }
        });
      });
    }

    // Modal to Post New Announcement
    const btnPost = container.querySelector('#btn-post-ann');
    if (btnPost) {
      btnPost.addEventListener('click', () => {
        const content = document.createElement('div');
        content.innerHTML = `
          <div class="form-group" style="margin-bottom: 14px;">
            <label class="form-label">Announcement Title</label>
            <input type="text" class="form-control" id="modal-new-ann-title" placeholder="e.g. Hostel Verification Week" required />
          </div>

          <div class="form-group" style="margin-bottom: 14px;">
            <label class="form-label">Target Division / Audience</label>
            <select class="form-control" id="modal-new-ann-target">
              <option value="STUDENT" selected>🎓 Students Only (Visible only to Students)</option>
              <option value="STAFF">🛡️ Staff & Wardens Division Only (Visible only to Staff)</option>
              <option value="ADMIN">⚙️ Administrators Division Only (Visible only to Admins)</option>
              <option value="ALL">🌐 All Divisions (Campus-Wide Broadcast)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Message Content</label>
            <textarea class="form-control" id="modal-new-ann-msg" rows="4" placeholder="Enter notice content to publish..." required></textarea>
          </div>
        `;

        openModal({
          title: 'Publish Institutional Notice',
          content,
          confirmText: 'Publish to Division',
          onConfirm: async () => {
            const title = content.querySelector('#modal-new-ann-title').value.trim();
            const targetAudience = content.querySelector('#modal-new-ann-target').value;
            const message = content.querySelector('#modal-new-ann-msg').value.trim();

            if (!title || !message) {
              state.showToast('Please provide both title and content', 'warning');
              return false;
            }

            try {
              const r = await announcementsApi.create(title, message, user.name || 'Chief Warden Office', targetAudience);
              if (r.success) {
                state.showToast(`Notice published for ${targetAudience} division!`, 'success');
                state.setRoute('announcements');
                return true;
              }
            } catch (err) {
              state.showToast(err.message || 'Error posting notice', 'danger');
              return false;
            }
          }
        });
      });
    }

  } catch (err) {
    container.innerHTML = `<div class="empty-state"><p style="color: var(--color-danger);">Failed to load announcements: ${err.message}</p></div>`;
  }

  return container;
}
