// NIVAS Mess & Dining View
import { state } from '../../state.js';
import { messApi, studentApi } from '../../api.js';
import { getIcon } from '../../icons.js';

export async function renderMessView() {
  const user = state.user;
  const container = document.createElement('div');
  container.className = 'mess-view';

  try {
    const [messRes, studRes] = await Promise.all([
      messApi.getAll(),
      user.role === 'STUDENT' ? studentApi.getDashboard(user.studentId || user.id) : Promise.resolve({ success: false })
    ]);

    const plans = messRes.success ? messRes.messPlans : [];
    const student = studRes.success ? studRes.student : null;
    const currentPlanId = student && student.messPlan ? student.messPlan.planId : 'MP01';

    container.innerHTML = `
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 24px; font-weight: 800; color: var(--color-text);">Mess Plans & Dining Services</h2>
        <p style="font-size: 14px; color: var(--color-text-muted);">
          Nutritious, hygienic multi-cuisine meal packages catered daily in the Central Hostel Mess.
        </p>
      </div>

      <!-- Current Subscription Banner -->
      <div class="card" style="margin-bottom: 28px; background: linear-gradient(135deg, var(--color-forest) 0%, var(--color-forest-dark) 100%); color: #fff;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
          <div>
            <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.8px; opacity: 0.8;">Active Dining Plan</div>
            <h3 style="font-size: 22px; font-weight: 800; color: #fff; margin: 4px 0;">
              ${student && student.messPlan ? student.messPlan.planName : 'Standard Mess Plan (Default)'}
            </h3>
            <p style="font-size: 13px; opacity: 0.9; max-width: 600px;">
              ${student && student.messPlan ? student.messPlan.description : 'Standard North & South Indian 4-meal buffet included with resident onboarding.'}
            </p>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 12px; opacity: 0.8;">Monthly Assessment</div>
            <div style="font-family: var(--font-heading); font-size: 26px; font-weight: 800; color: #fff;">
              ₹${student && student.messPlan ? student.messPlan.monthlyFee : '4500'}/mo
            </div>
          </div>
        </div>
      </div>

      <!-- Available Plans Grid -->
      <h3 style="font-size: 18px; font-weight: 700; color: var(--color-text); margin-bottom: 16px;">Available Meal Plans</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 28px;">
        ${plans.map(p => {
          const isSelected = p.planId === currentPlanId;
          return `
            <div class="card" style="display: flex; flex-direction: column; justify-content: space-between; border: 2px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'};">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                  <div>
                    <h4 style="font-size: 17px; font-weight: 800; color: var(--color-text);">${p.planName}</h4>
                    <span class="badge ${isSelected ? 'badge-terracotta' : 'badge-info'}" style="margin-top: 4px;">${p.planId}</span>
                  </div>
                  <div style="font-family: var(--font-heading); font-size: 20px; font-weight: 800; color: var(--color-forest);">
                    ₹${p.monthlyFee}<span style="font-size: 12px; font-weight: 500; color: var(--color-text-muted);">/mo</span>
                  </div>
                </div>

                <p style="font-size: 13px; color: var(--color-text-muted); line-height: 1.5; margin-bottom: 16px;">
                  ${p.description}
                </p>

                <div style="font-size: 12px; color: var(--color-text); margin-bottom: 16px;">
                  <div style="margin-bottom: 6px;">✓ 4 Meals daily (Breakfast, Lunch, Snacks, Dinner)</div>
                  <div style="margin-bottom: 6px;">✓ Weekly rotating menu approved by Dietitian</div>
                  <div>✓ Special festive banquets & weekend treats</div>
                </div>
              </div>

              ${user.role === 'STUDENT' ? `
                <button class="btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'} btn-switch-mess" data-plan="${p.planId}" style="width: 100%;">
                  ${isSelected ? 'Active Plan' : 'Switch to this Plan'}
                </button>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>

      <!-- Meal Timings Table -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">${getIcon('clock', 18)} Daily Mess Schedule</h3>
        </div>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Meal</th>
                <th>Weekdays (Mon - Fri)</th>
                <th>Weekends (Sat - Sun)</th>
                <th>Special Menu Feature</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Breakfast</strong></td>
                <td>07:30 AM – 09:30 AM</td>
                <td>08:00 AM – 10:00 AM</td>
                <td>Eggs / Sprouts, South Indian & Parathas</td>
              </tr>
              <tr>
                <td><strong>Lunch</strong></td>
                <td>12:30 PM – 02:30 PM</td>
                <td>12:30 PM – 02:30 PM</td>
                <td>Seasonal Veggies, Dal Tadka, Rice, Roti, Curd</td>
              </tr>
              <tr>
                <td><strong>Evening High Tea</strong></td>
                <td>05:00 PM – 06:00 PM</td>
                <td>05:00 PM – 06:00 PM</td>
                <td>Hot Tea/Coffee with Samosa / Pakoras / Cookies</td>
              </tr>
              <tr>
                <td><strong>Dinner</strong></td>
                <td>07:30 PM – 09:30 PM</td>
                <td>07:30 PM – 10:00 PM</td>
                <td>Paneer / Chicken / Sweet Halwa / Ice Cream</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Switch plan logic
    container.querySelectorAll('.btn-switch-mess').forEach(btn => {
      btn.addEventListener('click', async () => {
        const planId = btn.getAttribute('data-plan');
        try {
          const res = await studentApi.selectMess(user.studentId, planId);
          if (res.success) {
            state.showToast('Mess plan subscription updated successfully!', 'success');
            state.setRoute('mess');
          }
        } catch (err) {
          state.showToast(err.message || 'Error updating mess plan', 'danger');
        }
      });
    });

  } catch (err) {
    container.innerHTML = `<div class="empty-state"><p style="color: var(--color-danger);">Failed to load mess data: ${err.message}</p></div>`;
  }

  return container;
}
