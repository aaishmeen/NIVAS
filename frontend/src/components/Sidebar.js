// NIVAS Sidebar Navigation Component
import { state } from '../state.js';
import { getIcon } from '../icons.js';

export function renderSidebar() {
  const user = state.user;
  if (!user) return '';

  const role = user.role || 'STUDENT';
  const currentRoute = state.currentRoute;

  let navItems = [];

  if (role === 'STUDENT') {
    navItems = [
      { id: 'dashboard', label: 'Dashboard', icon: 'home' },
      { id: 'onboarding', label: 'Hostel Onboarding', icon: 'shield' },
      { id: 'rooms', label: 'Rooms & Beds', icon: 'bed' },
      { id: 'mess', label: 'Mess & Dining', icon: 'utensils' },
      { id: 'laundry', label: 'Laundry Service', icon: 'shirt' },
      { id: 'wifi', label: 'Wi-Fi Quota', icon: 'wifi' },
      { id: 'tickets', label: 'Maintenance Tickets', icon: 'tool' },
      { id: 'assistance', label: 'Emergency & Care', icon: 'phoneCall' },
      { id: 'hostel-pass', label: 'Digital Hostel Pass', icon: 'qrCode' },
      { id: 'announcements', label: 'Announcements', icon: 'bell' }
    ];
  } else if (role === 'STAFF') {
    navItems = [
      { id: 'dashboard', label: 'Staff Dashboard', icon: 'home' },
      { id: 'tickets', label: 'Ticket Operations', icon: 'tool' },
      { id: 'laundry', label: 'Laundry Pickup/Deliver', icon: 'shirt' },
      { id: 'assistance', label: 'Emergency Calls', icon: 'phoneCall' },
      { id: 'rooms', label: 'Block Rooms & Beds', icon: 'bed' },
      { id: 'announcements', label: 'Announcements', icon: 'bell' }
    ];
  } else if (role === 'ADMIN') {
    navItems = [
      { id: 'dashboard', label: 'Chief Warden Console', icon: 'home' },
      { id: 'verification', label: 'Student Verification', icon: 'shield' },
      { id: 'rooms', label: 'Hostel Occupancy & Beds', icon: 'bed' },
      { id: 'tickets', label: 'All Maintenance Tickets', icon: 'tool' },
      { id: 'assistance', label: 'All Emergency Requests', icon: 'phoneCall' },
      { id: 'announcements', label: 'Announcements Bulletin', icon: 'bell' }
    ];
  }

  const itemsHtml = navItems.map(item => `
    <a class="nav-item ${currentRoute === item.id ? 'active' : ''}" data-route="${item.id}">
      ${getIcon(item.icon, 18)}
      <span>${item.label}</span>
      ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
    </a>
  `).join('');

  return `
    <aside class="sidebar" id="app-sidebar">
      <div class="sidebar-header">
        <a href="#" class="brand-logo" data-route="dashboard">
          <div class="brand-icon">
            ${getIcon('home', 20)}
          </div>
          <span>NIVAS</span>
          <span class="brand-badge">${role}</span>
        </a>
      </div>

      <div class="sidebar-nav">
        <div class="nav-section-title">Navigation</div>
        ${itemsHtml}
      </div>

      <div class="sidebar-footer">
        <div class="user-mini-card">
          <div class="user-avatar">
            ${(user.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div class="user-info">
            <div class="user-name" title="${user.name}">${user.name}</div>
            <div class="user-role-tag">${user.studentId || user.designation || user.department || user.role}</div>
          </div>
        </div>
      </div>
    </aside>
  `;
}

export function initSidebarListeners(container) {
  container.querySelectorAll('.sidebar .nav-item, .sidebar .brand-logo').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const route = el.getAttribute('data-route');
      if (route) {
        state.setRoute(route);
        // On mobile, close sidebar after clicking
        const sb = document.getElementById('app-sidebar');
        if (sb) sb.classList.remove('mobile-open');
      }
    });
  });
}
