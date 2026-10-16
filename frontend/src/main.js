// NIVAS Main Application Entry Point & Router
import './style.css';
import { state } from './state.js';
import { renderSidebar, initSidebarListeners } from './components/Sidebar.js';
import { renderTopbar, initTopbarListeners } from './components/Topbar.js';

// Student Views
import { renderLoginView, initLoginListeners } from './views/LoginView.js';
import { renderStudentDashboard } from './views/student/StudentDashboard.js';
import { renderOnboardingView } from './views/student/OnboardingView.js';
import { renderRoomsView } from './views/student/RoomsView.js';
import { renderMessView } from './views/student/MessView.js';
import { renderLaundryView } from './views/student/LaundryView.js';
import { renderWifiView } from './views/student/WifiView.js';
import { renderTicketsView } from './views/student/TicketsView.js';
import { renderAssistanceView } from './views/student/AssistanceView.js';
import { renderHostelPassView } from './views/student/HostelPassView.js';

// Admin Views (Dedicated Separated Pages)
import { renderAdminDashboard } from './views/admin/AdminDashboard.js';
import { renderStudentVerificationView } from './views/admin/StudentVerificationView.js';
import { renderHostelRoomsView } from './views/admin/HostelRoomsView.js';
import { renderAllTicketsView } from './views/admin/AllTicketsView.js';
import { renderAllAssistanceView } from './views/admin/AllAssistanceView.js';

// Staff Views (Dedicated Separated Pages)
import { renderStaffDashboard } from './views/staff/StaffDashboard.js';
import { renderStaffTicketsView } from './views/staff/StaffTicketsView.js';
import { renderStaffLaundryView } from './views/staff/StaffLaundryView.js';
import { renderStaffAssistanceView } from './views/staff/StaffAssistanceView.js';
import { renderStaffRoomsView } from './views/staff/StaffRoomsView.js';

// Shared Views
import { renderAnnouncementsView } from './views/AnnouncementsView.js';

const app = document.getElementById('app');

async function renderApp() {
  const user = state.user;

  // Unauthenticated -> Login View
  if (!user) {
    app.innerHTML = renderLoginView();
    initLoginListeners(app);
    return;
  }

  // Authenticated Shell Layout
  const route = state.currentRoute;
  const role = user.role || 'STUDENT';

  app.innerHTML = `
    <div class="app-layout">
      ${renderSidebar()}
      <div class="main-wrapper">
        ${renderTopbar()}
        <main class="content-area" id="view-content">
          <div style="padding: 40px; text-align: center; color: var(--color-text-muted);">
            Loading ${route}...
          </div>
        </main>
      </div>
    </div>
  `;

  initSidebarListeners(app);
  initTopbarListeners(app);

  const contentArea = app.querySelector('#view-content');
  if (!contentArea) return;

  let viewEl = null;

  if (role === 'STUDENT') {
    switch (route) {
      case 'dashboard':
        viewEl = await renderStudentDashboard();
        break;
      case 'onboarding':
        viewEl = await renderOnboardingView();
        break;
      case 'rooms':
        viewEl = await renderRoomsView();
        break;
      case 'mess':
        viewEl = await renderMessView();
        break;
      case 'laundry':
        viewEl = await renderLaundryView();
        break;
      case 'wifi':
        viewEl = await renderWifiView();
        break;
      case 'tickets':
        viewEl = await renderTicketsView();
        break;
      case 'assistance':
        viewEl = await renderAssistanceView();
        break;
      case 'hostel-pass':
        viewEl = await renderHostelPassView();
        break;
      case 'announcements':
        viewEl = await renderAnnouncementsView();
        break;
      default:
        viewEl = await renderStudentDashboard();
    }
  } else if (role === 'STAFF') {
    switch (route) {
      case 'dashboard':
        viewEl = await renderStaffDashboard();
        break;
      case 'tickets':
        viewEl = await renderStaffTicketsView();
        break;
      case 'laundry':
        viewEl = await renderStaffLaundryView();
        break;
      case 'assistance':
        viewEl = await renderStaffAssistanceView();
        break;
      case 'rooms':
        viewEl = await renderStaffRoomsView();
        break;
      case 'announcements':
        viewEl = await renderAnnouncementsView();
        break;
      default:
        viewEl = await renderStaffDashboard();
    }
  } else if (role === 'ADMIN') {
    switch (route) {
      case 'dashboard':
        viewEl = await renderAdminDashboard();
        break;
      case 'verification':
        viewEl = await renderStudentVerificationView();
        break;
      case 'rooms':
        viewEl = await renderHostelRoomsView();
        break;
      case 'tickets':
        viewEl = await renderAllTicketsView();
        break;
      case 'assistance':
        viewEl = await renderAllAssistanceView();
        break;
      case 'announcements':
        viewEl = await renderAnnouncementsView();
        break;
      default:
        viewEl = await renderAdminDashboard();
    }
  }

  contentArea.innerHTML = '';
  if (viewEl) {
    contentArea.appendChild(viewEl);
  }
}

// Subscribe to state changes (route changes, user login/logout)
state.subscribe(() => {
  renderApp();
});

// Initial boot
renderApp();
