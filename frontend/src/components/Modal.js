// NIVAS Reusable Modal Component
import { getIcon } from '../icons.js';

export function openModal({ title, content, onConfirm, confirmText = 'Confirm', confirmClass = 'btn-primary', showCancel = true }) {
  const root = document.getElementById('modal-root');
  if (!root) return;

  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';

  const modal = document.createElement('div');
  modal.className = 'modal-content';

  modal.innerHTML = `
    <div class="modal-header">
      <h3 class="modal-title">${title}</h3>
      <button class="btn-icon close-btn" aria-label="Close modal">${getIcon('x', 18)}</button>
    </div>
    <div class="modal-body">
      ${typeof content === 'string' ? content : ''}
    </div>
    <div class="modal-footer">
      ${showCancel ? `<button class="btn btn-secondary cancel-btn">Cancel</button>` : ''}
      <button class="btn ${confirmClass} confirm-btn">${confirmText}</button>
    </div>
  `;

  if (typeof content !== 'string') {
    modal.querySelector('.modal-body').appendChild(content);
  }

  const close = () => {
    backdrop.remove();
    document.removeEventListener('keydown', handleKey);
  };

  const handleKey = (e) => {
    if (e.key === 'Escape') close();
  };

  modal.querySelector('.close-btn').addEventListener('click', close);
  if (showCancel) {
    modal.querySelector('.cancel-btn').addEventListener('click', close);
  }

  modal.querySelector('.confirm-btn').addEventListener('click', async () => {
    if (onConfirm) {
      const shouldClose = await onConfirm(modal);
      if (shouldClose !== false) close();
    } else {
      close();
    }
  });

  backdrop.appendChild(modal);
  root.appendChild(backdrop);
  document.addEventListener('keydown', handleKey);

  return { close, modal };
}
