// NIVAS Dedicated Student Onboarding Verification Queue View (Admin)
import { state } from '../../state.js';
import { adminApi } from '../../api.js';
import { getIcon } from '../../icons.js';
import { openModal } from '../../components/Modal.js';

export async function renderStudentVerificationView() {
  const container = document.createElement('div');
  container.className = 'verification-view';

  try {
    const res = await adminApi.getOverview();
    if (!res.success) {
      container.innerHTML = `<div class="empty-state"><p>Could not load verification queue.</p></div>`;
      return container;
    }

    const students = res.students || [];
    const pendingCount = students.filter(st => {
      const app = st.onboardingApp || {};
      return !app.adminVerified;
    }).length;

    const verifiedCount = students.filter(st => {
      const app = st.onboardingApp || {};
      return app.adminVerified;
    }).length;

    container.innerHTML = `
      <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px;">
        <div>
          <h2 style="font-size: 24px; font-weight: 800; color: var(--color-text);">Student Onboarding Verification Queue</h2>
          <p style="font-size: 14px; color: var(--color-text-muted);">
            Administrative review of student identity documents, hostel rules undertaking, and ₹85,000 annual fee clearance.
          </p>
        </div>

        <div style="display: flex; gap: 10px;">
          <span class="badge badge-warning" style="font-size: 13px; padding: 6px 14px;">
            ${pendingCount} Pending Verification
          </span>
          <span class="badge badge-success" style="font-size: 13px; padding: 6px 14px;">
            ${verifiedCount} Verified
          </span>
        </div>
      </div>

      <!-- Controls: Filters & Search -->
      <div class="card" style="margin-bottom: 24px; padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-sm btn-secondary filter-tab-btn active" data-filter="all">All Applicants (${students.length})</button>
          <button class="btn btn-sm btn-secondary filter-tab-btn" data-filter="pending">Pending Approval (${pendingCount})</button>
          <button class="btn btn-sm btn-secondary filter-tab-btn" data-filter="verified">Verified (${verifiedCount})</button>
        </div>

        <div style="position: relative; max-width: 280px; width: 100%;">
          <input type="text" id="verification-search" class="form-control" placeholder="Search by name or ID..." style="padding-left: 36px;" />
          <div style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--color-text-subtle);">
            ${getIcon('search', 16)}
          </div>
        </div>
      </div>

      <!-- Students Table -->
      <div class="card">
        <div class="table-container">
          <table class="data-table" id="verification-table">
            <thead>
              <tr>
                <th>Registration ID</th>
                <th>Student Details</th>
                <th>Aadhaar Document</th>
                <th>Hostel Undertaking</th>
                <th>Annual Fee (₹85,000)</th>
                <th>Verification State</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${students.length === 0 ? `
                <tr><td colspan="7" style="text-align: center; padding: 32px;">No student records found.</td></tr>
              ` : students.map(st => {
                const app = st.onboardingApp || {};
                const pd = st.personalDetails || {};
                const doc = st.document || {};
                const pay = st.payment || {};
                const isVerified = app.adminVerified;
                const isReady = app.feePaid && !isVerified;

                return `
                  <tr class="student-row" data-verified="${isVerified ? 'verified' : 'pending'}" data-name="${(st.name || '').toLowerCase()}" data-id="${(st.studentId || '').toLowerCase()}">
                    <td>
                      <strong style="color: var(--color-forest);">${st.studentId}</strong>
                    </td>
                    <td>
                      <div style="font-weight: 700; color: var(--color-text); font-size: 14px;">${st.name}</div>
                      <div style="font-size: 12px; color: var(--color-text-muted);">${pd.branch || 'B.Tech CSE'} • Year ${pd.year || 2}</div>
                      <div style="font-size: 11px; color: var(--color-text-subtle);">${st.email}</div>
                    </td>
                    <td>
                      ${app.documentsSubmitted ? `
                        <div>
                          <span class="badge badge-success">✓ Uploaded</span>
                          <div style="font-family: monospace; font-size: 11px; color: var(--color-text); margin-top: 3px;">
                            ${doc.documentNumber || '1234-5678-9012'}
                          </div>
                        </div>
                      ` : `
                        <span class="badge badge-warning">Not Uploaded</span>
                      `}
                    </td>
                    <td>
                      ${app.undertakingAccepted ? `
                        <span class="badge badge-success">✓ Signed & Accepted</span>
                      ` : `
                        <span class="badge badge-warning">Pending</span>
                      `}
                    </td>
                    <td>
                      ${app.feePaid ? `
                        <div>
                          <span class="badge badge-success">✓ ₹85,000 PAID</span>
                          <div style="font-size: 11px; color: var(--color-text-muted); margin-top: 2px;">
                            Ref: <span style="font-family: monospace;">${pay.transactionRef || 'RZP_TEST'}</span>
                          </div>
                        </div>
                      ` : `
                        <span class="badge badge-danger">Unpaid</span>
                      `}
                    </td>
                    <td>
                      ${isVerified ? `
                        <span class="badge badge-success" style="font-weight: 700;">✓ VERIFIED</span>
                      ` : (isReady ? `
                        <span class="badge badge-warning">Ready for Approval</span>
                      ` : `
                        <span class="badge badge-info">Incomplete</span>
                      `)}
                    </td>
                    <td>
                      <div style="display: flex; gap: 6px;">
                        <button class="btn btn-sm btn-secondary btn-inspect-student" data-id="${st.studentId}" title="Inspect full profile & documents">
                          ${getIcon('fileText', 14)} Inspect
                        </button>

                        ${isVerified ? `
                          <button class="btn btn-sm btn-sage" disabled style="opacity: 0.85;">
                            ✓ Verified
                          </button>
                        ` : `
                          <button class="btn btn-sm ${isReady ? 'btn-primary' : 'btn-secondary'} btn-verify-action" data-id="${st.studentId}">
                            ${getIcon('checkCircle', 14)} Approve
                          </button>
                        `}
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Filter logic
    const filterTabs = container.querySelectorAll('.filter-tab-btn');
    const rows = container.querySelectorAll('.student-row');
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active', 'btn-primary'));
        tab.classList.add('active');
        const filter = tab.getAttribute('data-filter');

        rows.forEach(row => {
          const status = row.getAttribute('data-verified');
          if (filter === 'all' || filter === status) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      });
    });

    // Search logic
    const searchInput = container.querySelector('#verification-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        rows.forEach(row => {
          const name = row.getAttribute('data-name');
          const id = row.getAttribute('data-id');
          if (name.includes(query) || id.includes(query)) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      });
    }

    // Verify Action
    container.querySelectorAll('.btn-verify-action').forEach(btn => {
      btn.addEventListener('click', async () => {
        const studentId = btn.getAttribute('data-id');
        btn.disabled = true;
        btn.innerHTML = 'Verifying...';

        try {
          const r = await adminApi.verifyStudent(studentId);
          if (r.success) {
            state.showToast(`Student ${studentId} verified by Chief Warden Office!`, 'success');
            state.setRoute('verification');
          }
        } catch (err) {
          state.showToast(err.message || 'Verification failed', 'danger');
          btn.disabled = false;
        }
      });
    });

    // Inspect student details modal
    container.querySelectorAll('.btn-inspect-student').forEach(btn => {
      btn.addEventListener('click', () => {
        const studentId = btn.getAttribute('data-id');
        const st = students.find(s => s.studentId === studentId);
        if (!st) return;

        const pd = st.personalDetails || {};
        const doc = st.document || {};
        const pay = st.payment || {};
        const app = st.onboardingApp || {};

        const content = document.createElement('div');
        content.innerHTML = `
          <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 18px; padding-bottom: 14px; border-bottom: 1px solid var(--color-border);">
            <div style="width: 48px; height: 48px; border-radius: var(--radius-full); background: var(--color-forest); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 700;">
              ${(st.name || 'S').charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 style="font-size: 18px; font-weight: 800; color: var(--color-text);">${st.name}</h4>
              <div style="font-size: 13px; color: var(--color-forest); font-weight: 600;">Student ID: ${st.studentId} • ${st.email}</div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 18px; font-size: 13px;">
            <div style="padding: 10px; background: var(--color-bg); border-radius: var(--radius-md);">
              <span style="font-size: 11px; text-transform: uppercase; color: var(--color-text-muted); font-weight: 700;">Branch & Year</span>
              <div style="font-weight: 700; color: var(--color-text); margin-top: 2px;">${pd.branch || 'CSE'} (Year ${pd.year || 2})</div>
            </div>
            <div style="padding: 10px; background: var(--color-bg); border-radius: var(--radius-md);">
              <span style="font-size: 11px; text-transform: uppercase; color: var(--color-text-muted); font-weight: 700;">Contact Phone</span>
              <div style="font-weight: 700; color: var(--color-text); margin-top: 2px;">${pd.phone || '9876543210'}</div>
            </div>
            <div style="padding: 10px; background: var(--color-bg); border-radius: var(--radius-md);">
              <span style="font-size: 11px; text-transform: uppercase; color: var(--color-text-muted); font-weight: 700;">Guardian Name</span>
              <div style="font-weight: 700; color: var(--color-text); margin-top: 2px;">${pd.guardianName || 'Anil Malya'}</div>
            </div>
            <div style="padding: 10px; background: var(--color-bg); border-radius: var(--radius-md);">
              <span style="font-size: 11px; text-transform: uppercase; color: var(--color-text-muted); font-weight: 700;">Guardian Phone</span>
              <div style="font-weight: 700; color: var(--color-text); margin-top: 2px;">${pd.guardianPhone || '9876500000'}</div>
            </div>
          </div>

          <div style="padding: 12px; background: var(--color-surface-hover); border: 1px solid var(--color-border); border-radius: var(--radius-md); font-size: 13px; margin-bottom: 14px;">
            <div style="font-weight: 700; color: var(--color-text); margin-bottom: 4px;">Mock Aadhaar Identification:</div>
            <span style="font-family: monospace; font-size: 15px; font-weight: 700; color: var(--color-forest);">${doc.documentNumber || '1234-5678-9012'}</span>
          </div>

          <div style="padding: 12px; background: var(--color-surface-hover); border: 1px solid var(--color-border); border-radius: var(--radius-md); font-size: 13px;">
            <div style="font-weight: 700; color: var(--color-text); margin-bottom: 4px;">Fee Settlement Details:</div>
            <div>Amount: <strong>₹85,000.00</strong> • Status: <strong style="color: var(--color-success);">${pay.status || 'PAID'}</strong></div>
            <div style="font-size: 12px; color: var(--color-text-muted); margin-top: 2px;">Ref: <span style="font-family: monospace;">${pay.transactionRef || 'RZP_TEST'}</span> • Date: ${pay.paymentDate || '2026-09-28'}</div>
          </div>
        `;

        openModal({
          title: `Applicant Profile: ${st.name}`,
          content,
          confirmText: app.adminVerified ? 'Close' : 'Approve & Verify Student',
          confirmClass: app.adminVerified ? 'btn-secondary' : 'btn-primary',
          onConfirm: async () => {
            if (!app.adminVerified) {
              try {
                const r = await adminApi.verifyStudent(st.studentId);
                if (r.success) {
                  state.showToast(`Student ${st.studentId} verified successfully!`, 'success');
                  state.setRoute('verification');
                  return true;
                }
              } catch (err) {
                state.showToast(err.message || 'Verification failed', 'danger');
                return false;
              }
            }
            return true;
          }
        });
      });
    });

  } catch (err) {
    container.innerHTML = `<div class="empty-state"><p style="color: var(--color-danger);">Failed to load verification queue: ${err.message}</p></div>`;
  }

  return container;
}
