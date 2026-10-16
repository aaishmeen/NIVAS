// NIVAS Topbar Component
import { state } from '../state.js';
import { getIcon } from '../icons.js';
import { openModal } from './Modal.js';
import { authApi } from '../api.js';

const ROUTE_TITLES = {
  dashboard: 'Overview & Resident Dashboard',
  onboarding: 'Hostel Onboarding Pipeline',
  rooms: 'Hostel Rooms & Bed Allocation',
  mess: 'Mess Plan & Dining Services',
  laundry: 'Laundry Quota & Pickup Requests',
  wifi: 'High-Speed Campus Wi-Fi Quota',
  tickets: 'Maintenance & Facility Tickets',
  assistance: 'Emergency & Medical Assistance',
  'hostel-pass': 'Official Digital Hostel Pass',
  announcements: 'Hostel Announcements Bulletin',
  verification: 'Student Onboarding Verification Queue'
};

export function renderTopbar() {
  const user = state.user;
  const currentRoute = state.currentRoute;
  const title = ROUTE_TITLES[currentRoute] || 'NIVAS Portal';

  return `
    <header class="topbar">
      <div class="topbar-left">
        <button class="mobile-menu-btn" id="sidebar-toggle" aria-label="Toggle menu">
          ${getIcon('menu', 22)}
        </button>
        <div>
          <h1 class="page-title">${title}</h1>
          <div class="page-breadcrumbs">
            <span>NIVAS</span>
            <span>/</span>
            <span style="color: var(--color-primary); font-weight: 600;">${currentRoute.toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div class="topbar-right">
        <div class="topbar-badge">
          ${getIcon('shield', 14)}
          <span>${user.role}</span>
        </div>

        <button class="btn btn-secondary btn-sm" id="btn-quick-switch" title="Quickly switch demo account">
          ${getIcon('user', 14)}
          <span>Switch Account</span>
        </button>

        <button class="btn-icon-topbar" id="btn-logout" title="Sign out of NIVAS">
          ${getIcon('logOut', 18)}
        </button>
      </div>
    </header>
  `;
}

export function initTopbarListeners(container) {
  const toggleBtn = container.querySelector('#sidebar-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const sb = document.getElementById('app-sidebar');
      if (sb) sb.classList.toggle('mobile-open');
    });
  }

  const logoutBtn = container.querySelector('#btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      state.setUser(null);
      state.showToast('You have been logged out of NIVAS.', 'info');
    });
  }

  const switchBtn = container.querySelector('#btn-quick-switch');
  if (switchBtn) {
    switchBtn.addEventListener('click', () => {
      openQuickSwitchModal();
    });
  }
}

function openQuickSwitchModal() {
  const accounts = [
    { id: 'MUJ12345', pass: 'student123', name: 'Ved Malya', role: 'Student (2nd Year CSE)', note: 'Pre-configured onboarded student' },
    { id: 'MUJ12346', pass: 'student123', name: 'Aarav Patel', role: 'Student (New Resident)', note: 'Fresh onboarding applicant' },
    { id: 'ADM01', pass: 'admin123', name: 'Dr. Rajesh Sharma', role: 'Chief Warden Office', note: 'Admin & Verification Approver' },
    { id: 'STF01', pass: 'warden123', name: 'Mr. Suresh Kumar', role: 'Hostel Warden', note: 'Block A Supervisor' },
    { id: 'STF02', pass: 'staff123', name: 'Mr. Ramesh Verma', role: 'Maintenance Supervisor', note: 'Block B Supervisor' }
  ];

  const content = document.createElement('div');
  content.innerHTML = `
    <p style="font-size: 13px; color: var(--color-text-muted); margin-bottom: 16px;">
      Select any demo persona to switch roles and inspect role-based dynamic interfaces:
    </p>
    <div style="display: flex; flex-direction: column; gap: 10px;">
      ${accounts.map(acc => `
        <div class="card account-select-card" data-user="${acc.id}" data-pass="${acc.pass}" style="padding: 12px 16px; cursor: pointer; transition: all 0.15s; border-radius: var(--radius-md);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: 700; color: var(--color-text); font-size: 14px;">${acc.name}</div>
              <div style="font-size: 12px; color: var(--color-forest); font-weight: 600;">${acc.role}</div>
            </div>
            <span class="badge badge-terracotta">${acc.id}</span>
          </div>
          <div style="font-size: 11px; color: var(--color-text-muted); margin-top: 4px;">${acc.note}</div>
        </div>
      `).join('')}
    </div>
  `;

  const { close } = openModal({
    title: 'Switch Demo Account',
    content,
    showCancel: true,
    confirmText: 'Cancel'
  });

  content.querySelectorAll('.account-select-card').forEach(card => {
    card.addEventListener('mouseenter', () => card.style.borderColor = 'var(--color-primary)');
    card.addEventListener('mouseleave', () => card.style.borderColor = 'var(--color-border)');
    card.addEventListener('click', async () => {
      const username = card.getAttribute('data-user');
      const password = card.getAttribute('data-pass');
      try {
        const res = await authApi.login(username, password);
        if (res.success) {
          state.setUser(res.user);
          state.setRoute('dashboard');
          state.showToast(`Switched account to ${res.user.name} (${res.user.role})`, 'success');
          close();
        }
      } catch (err) {
        state.showToast(err.message || 'Failed to switch account', 'danger');
      }
    });
  });
}
