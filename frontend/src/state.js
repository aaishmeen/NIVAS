// NIVAS Global State Management

class StateManager {
  constructor() {
    this.user = this.loadUser();
    this.currentRoute = 'dashboard';
    this.listeners = new Set();
    this.toasts = [];
  }

  loadUser() {
    try {
      const saved = localStorage.getItem('nivas_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  }

  setUser(user) {
    this.user = user;
    if (user) {
      localStorage.setItem('nivas_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('nivas_user');
      this.currentRoute = 'login';
    }
    this.notify();
  }

  setRoute(route) {
    this.currentRoute = route;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      listener(this);
    }
  }

  showToast(message, type = 'info', duration = 3500) {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    const toast = { id, message, type };
    this.toasts.push(toast);
    this.renderToasts();

    setTimeout(() => {
      this.removeToast(id);
    }, duration);
  }

  removeToast(id) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.renderToasts();
  }

  renderToasts() {
    const root = document.getElementById('toast-root');
    if (!root) return;
    root.innerHTML = '';
    this.toasts.forEach(t => {
      const el = document.createElement('div');
      el.className = `toast toast-${t.type}`;
      el.innerHTML = `
        <span class="toast-indicator"></span>
        <span class="toast-message">${t.message}</span>
      `;
      root.appendChild(el);
    });
  }
}

export const state = new StateManager();
