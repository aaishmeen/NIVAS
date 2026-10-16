// NIVAS Wi-Fi Quota View
import { state } from '../../state.js';
import { studentApi, wifiApi } from '../../api.js';
import { getIcon } from '../../icons.js';

export async function renderWifiView() {
  const user = state.user;
  const container = document.createElement('div');
  container.className = 'wifi-view';

  try {
    const studRes = await studentApi.getDashboard(user.studentId || user.id);
    const s = studRes.success ? studRes.student : null;
    const wifi = s && s.wifiAccount ? s.wifiAccount : { username: user.studentId, allocatedGB: 300.0, usedGB: 45.5, remainingGB: 254.5, status: 'ACTIVE' };

    const percentUsed = Math.min(100, Math.round((wifi.usedGB / (wifi.allocatedGB || 300)) * 100));

    container.innerHTML = `
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 24px; font-weight: 800; color: var(--color-text);">High-Speed Campus Wi-Fi Quota</h2>
        <p style="font-size: 14px; color: var(--color-text-muted);">
          Dedicated 300.0 GB monthly high-speed residential fiber connection across all hostel rooms and study lounges.
        </p>
      </div>

      <!-- Main Quota Gauge Card -->
      <div class="card" style="margin-bottom: 28px; padding: 28px;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 24px;">
          <div style="display: flex; align-items: center; gap: 20px;">
            <div style="width: 64px; height: 64px; border-radius: var(--radius-lg); background: var(--color-sage); color: var(--color-forest); display: flex; align-items: center; justify-content: center;">
              ${getIcon('wifi', 36)}
            </div>
            <div>
              <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--color-text-muted); letter-spacing: 0.6px;">
                Monthly Data Balance
              </div>
              <div style="font-family: var(--font-heading); font-size: 32px; font-weight: 800; color: var(--color-text);">
                ${wifi.remainingGB} <span style="font-size: 18px; font-weight: 500; color: var(--color-text-muted);">/ ${wifi.allocatedGB} GB Remaining</span>
              </div>
              <div style="font-size: 13px; color: var(--color-forest); font-weight: 600; margin-top: 2px;">
                Active Account: wifi@${wifi.username} • 1 Gbps Mesh Access
              </div>
            </div>
          </div>

          <div style="text-align: right;">
            <span class="badge badge-success" style="font-size: 13px; padding: 6px 14px;">
              ${wifi.status || 'ACTIVE'}
            </span>
            <div style="font-size: 12px; color: var(--color-text-muted); margin-top: 6px;">
              Resets on 1st of every month
            </div>
          </div>
        </div>

        <div style="background: var(--color-border); height: 10px; border-radius: 5px; margin-top: 24px; overflow: hidden;">
          <div style="background: linear-gradient(90deg, var(--color-forest), var(--color-primary)); width: ${percentUsed}%; height: 100%; transition: width 0.3s;"></div>
        </div>

        <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--color-text-muted); margin-top: 8px;">
          <span>0 GB (${wifi.usedGB} GB Used)</span>
          <span>150 GB (50%)</span>
          <span>300 GB Max</span>
        </div>
      </div>

      <!-- Campus Network Guidelines -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">${getIcon('shield', 18)} Campus Network Connection Guide</h3>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; font-size: 13px;">
          <div style="padding: 14px; background: var(--color-bg); border-radius: var(--radius-md);">
            <strong style="color: var(--color-text); font-size: 14px; display: block; margin-bottom: 4px;">Hostel SSID:</strong>
            <span style="color: var(--color-forest); font-weight: 700;">MUJ_HOSTEL_5G</span>
            <p style="color: var(--color-text-muted); font-size: 12px; margin-top: 4px;">Available in all hostel rooms and corridors.</p>
          </div>
          <div style="padding: 14px; background: var(--color-bg); border-radius: var(--radius-md);">
            <strong style="color: var(--color-text); font-size: 14px; display: block; margin-bottom: 4px;">Security Protocol:</strong>
            <span style="color: var(--color-forest); font-weight: 700;">WPA2-Enterprise (802.1X)</span>
            <p style="color: var(--color-text-muted); font-size: 12px; margin-top: 4px;">Authenticate using your student credentials.</p>
          </div>
          <div style="padding: 14px; background: var(--color-bg); border-radius: var(--radius-md);">
            <strong style="color: var(--color-text); font-size: 14px; display: block; margin-bottom: 4px;">MAC Registration:</strong>
            <span style="color: var(--color-forest); font-weight: 700;">Up to 3 Devices</span>
            <p style="color: var(--color-text-muted); font-size: 12px; margin-top: 4px;">Laptop, Smartphone, and Tablet supported simultaneously.</p>
          </div>
        </div>
      </div>
    `;

  } catch (err) {
    container.innerHTML = `<div class="empty-state"><p style="color: var(--color-danger);">Failed to load Wi-Fi details: ${err.message}</p></div>`;
  }

  return container;
}
