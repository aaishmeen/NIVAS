// NIVAS Digital Hostel Pass View
import { state } from '../../state.js';
import { studentApi } from '../../api.js';
import { getIcon } from '../../icons.js';

export async function renderHostelPassView() {
  const user = state.user;
  const container = document.createElement('div');
  container.className = 'hostel-pass-view';

  try {
    const res = await studentApi.getDashboard(user.studentId || user.id);
    const s = res.success ? res.student : null;
    const pass = s && s.hostelPass ? s.hostelPass : null;

    if (!pass) {
      container.innerHTML = `
        <div style="max-width: 600px; margin: 40px auto; text-align: center;">
          <div class="card" style="padding: 48px 32px;">
            <div style="width: 64px; height: 64px; border-radius: var(--radius-full); background: var(--color-warning-bg); color: var(--color-warning); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
              ${getIcon('qrCode', 32)}
            </div>
            <h2 style="font-size: 22px; font-weight: 800; color: var(--color-text); margin-bottom: 8px;">
              Digital Hostel Pass Pending
            </h2>
            <p style="font-size: 14px; color: var(--color-text-muted); line-height: 1.6; margin-bottom: 24px;">
              Your official Digital Hostel Pass is generated strictly after you complete the required onboarding stages (personal details, mock Aadhaar, rules undertaking, fee payment, admin verification, and room selection).
            </p>
            <button class="btn btn-primary" id="btn-goto-onboarding">
              ${getIcon('shield', 16)}
              <span>Open Onboarding Pipeline</span>
            </button>
          </div>
        </div>
      `;

      container.querySelector('#btn-goto-onboarding')?.addEventListener('click', () => state.setRoute('onboarding'));
      return container;
    }

    container.innerHTML = `
      <div style="margin-bottom: 24px; text-align: center;">
        <h2 style="font-size: 24px; font-weight: 800; color: var(--color-text);">Official Digital Hostel Pass</h2>
        <p style="font-size: 14px; color: var(--color-text-muted);">
          Verified institutional resident identity document for campus gate verification and hostel entry.
        </p>
      </div>

      <div class="hostel-pass-card" id="printable-pass">
        <div class="pass-header">
          <div class="pass-university">MANIPAL UNIVERSITY JAIPUR</div>
          <h2 class="pass-title">DIGITAL HOSTEL PASS</h2>
          <div style="font-size: 12px; opacity: 0.85;">Academic Year 2026-27 • Resident Identification</div>
        </div>

        <div class="pass-body">
          <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--color-border);">
            <div style="width: 52px; height: 52px; border-radius: var(--radius-full); background: linear-gradient(135deg, var(--color-forest), var(--color-forest-dark)); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 800; box-shadow: 0 4px 10px rgba(0, 129, 167, 0.2);">
              ${(pass.studentName || 'S').charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 style="font-size: 18px; font-weight: 800; color: var(--color-text); line-height: 1.2;">${pass.studentName}</h3>
              <div style="font-size: 13px; color: var(--color-forest); font-weight: 700;">Student ID: ${pass.studentId}</div>
            </div>
            <div style="margin-left: auto;">
              <span class="badge badge-success" style="font-size: 11px;">${pass.status || 'ACTIVE'}</span>
            </div>
          </div>

          <div class="pass-grid">
            <div>
              <div class="pass-field-label">Assigned Room</div>
              <div class="pass-field-value" style="color: var(--color-primary); font-size: 16px;">Room ${pass.roomNumber}</div>
            </div>
            <div>
              <div class="pass-field-label">Allocated Bed</div>
              <div class="pass-field-value" style="color: var(--color-forest); font-size: 16px;">${pass.bedCode}</div>
            </div>
            <div>
              <div class="pass-field-label">Mess Subscription</div>
              <div class="pass-field-value">${pass.messPlanName}</div>
            </div>
            <div>
              <div class="pass-field-label">Issue Date</div>
              <div class="pass-field-value">${pass.issueDate}</div>
            </div>
          </div>

          <div class="pass-qr-box">
            <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: var(--color-forest); letter-spacing: 0.8px; margin-bottom: 8px;">
              Gate Verification QR Code
            </div>
            <div style="margin: 8px auto; width: 120px; height: 120px; background: #fff; border: 1px solid var(--color-border); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 6px;">
              <img src="/qr-scanner.png" alt="Gate Verification QR Code" style="width: 100%; height: 100%; object-fit: contain; image-rendering: crisp-edges;" />
            </div>
            <div style="font-size: 12px; font-weight: 700; color: var(--color-text); margin-top: 8px;">
              Pass ID: <span style="font-family: monospace;">${pass.passId}</span>
            </div>
            <div style="font-size: 11px; color: var(--color-text-muted);">
              Checksum: <span style="font-family: monospace;">${pass.verificationCode}</span>
            </div>
          </div>
        </div>
      </div>

      <div style="text-align: center; margin-top: 24px;">
        <button class="btn btn-secondary" id="btn-print-pass">
          ${getIcon('fileText', 16)}
          <span>Print / Save Pass</span>
        </button>
      </div>
    `;

    container.querySelector('#btn-print-pass')?.addEventListener('click', () => {
      window.print();
    });

  } catch (err) {
    container.innerHTML = `<div class="empty-state"><p style="color: var(--color-danger);">Failed to load pass: ${err.message}</p></div>`;
  }

  return container;
}
