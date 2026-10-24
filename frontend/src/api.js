// NIVAS API Client

const BASE_URL = '/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await response.text();
      if (text.includes('<!DOCTYPE') || text.includes('<html')) {
        throw new Error('NIVAS Java backend server is offline or unreachable on port 8085. Please start the Java backend: "java -cp \"bin;lib/*\" server.NivasHttpServer"');
      }
      throw new Error(`Server returned unexpected response (${response.status}): ${text.substring(0, 100)}`);
    }

    const data = await response.json();
    if (!response.ok || data.success === false) {
      throw new Error(data.message || data.error || `Server request failed with status ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('Cannot connect to NIVAS backend server. Please ensure the Java server is running on port 8085.');
    }
    throw error;
  }
}

export const authApi = {
  login: (username, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    }),
  verifyOtp: (studentId, otp) =>
    request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ studentId, otp })
    }),
  getUser: (userId) =>
    request(`/auth/user?userId=${encodeURIComponent(userId)}`)
};

export const studentApi = {
  getDashboard: (studentId) =>
    request(`/student/dashboard?studentId=${encodeURIComponent(studentId)}`),
  submitPersonalDetails: (payload) =>
    request('/student/onboarding/personal-details', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  submitAadhaar: (studentId, aadhaarNumber) =>
    request('/student/onboarding/aadhaar', {
      method: 'POST',
      body: JSON.stringify({ studentId, aadhaarNumber })
    }),
  acceptUndertaking: (studentId) =>
    request('/student/onboarding/undertaking', {
      method: 'POST',
      body: JSON.stringify({ studentId })
    }),
  payFee: (studentId) =>
    request('/student/onboarding/pay-fee', {
      method: 'POST',
      body: JSON.stringify({ studentId })
    }),
  selectRoom: (studentId, roomNumber, bedCode) =>
    request('/student/onboarding/select-room', {
      method: 'POST',
      body: JSON.stringify({ studentId, roomNumber, bedCode })
    }),
  selectMess: (studentId, planId) =>
    request('/student/onboarding/select-mess', {
      method: 'POST',
      body: JSON.stringify({ studentId, planId })
    }),
  generatePass: (studentId) =>
    request('/student/onboarding/generate-pass', {
      method: 'POST',
      body: JSON.stringify({ studentId })
    })
};

export const roomsApi = {
  getAll: () => request('/rooms')
};

export const messApi = {
  getAll: () => request('/mess-plans')
};

export const laundryApi = {
  getRequests: (studentId = '') =>
    request(`/laundry/requests${studentId ? `?studentId=${encodeURIComponent(studentId)}` : ''}`),
  createRequest: (studentId, numberOfClothes) =>
    request('/laundry/create', {
      method: 'POST',
      body: JSON.stringify({ studentId, numberOfClothes: String(numberOfClothes) })
    }),
  updateStatus: (requestId, newStatus) =>
    request('/laundry/update-status', {
      method: 'POST',
      body: JSON.stringify({ requestId, newStatus })
    })
};

export const wifiApi = {
  simulateUsage: (studentId, additionalGB) =>
    request('/wifi/simulate', {
      method: 'POST',
      body: JSON.stringify({ studentId, additionalGB: String(additionalGB) })
    })
};

export const ticketsApi = {
  getAll: (studentId = '', staffId = '') => {
    const params = new URLSearchParams();
    if (studentId) params.append('studentId', studentId);
    if (staffId) params.append('staffId', staffId);
    const qs = params.toString();
    return request(`/tickets${qs ? `?${qs}` : ''}`);
  },
  create: (studentId, category, description) =>
    request('/tickets/create', {
      method: 'POST',
      body: JSON.stringify({ studentId, category, description })
    }),
  assign: (ticketId, staffId) =>
    request('/tickets/assign', {
      method: 'POST',
      body: JSON.stringify({ ticketId, staffId })
    }),
  updateStatus: (ticketId, newStatus, notes = '') =>
    request('/tickets/update-status', {
      method: 'POST',
      body: JSON.stringify({ ticketId, newStatus, notes })
    })
};

export const assistanceApi = {
  getAll: (studentId = '', staffId = '') => {
    const params = new URLSearchParams();
    if (studentId) params.append('studentId', studentId);
    if (staffId) params.append('staffId', staffId);
    const qs = params.toString();
    return request(`/assistance${qs ? `?${qs}` : ''}`);
  },
  create: (studentId, assistanceType, description) =>
    request('/assistance/create', {
      method: 'POST',
      body: JSON.stringify({ studentId, assistanceType, description })
    }),
  updateStatus: (requestId, newStatus, staffId) =>
    request('/assistance/update-status', {
      method: 'POST',
      body: JSON.stringify({ requestId, newStatus, staffId })
    })
};

export const announcementsApi = {
  getAll: (role) => request(role ? `/announcements?role=${encodeURIComponent(role)}` : '/announcements'),
  create: (title, message, author, targetAudience = 'ALL') =>
    request('/announcements/create', {
      method: 'POST',
      body: JSON.stringify({ title, message, author, targetAudience })
    })
};

export const adminApi = {
  getOverview: () => request('/admin/overview'),
  verifyStudent: (studentId) =>
    request('/admin/verify-student', {
      method: 'POST',
      body: JSON.stringify({ studentId })
    })
};

export const staffApi = {
  getOverview: (staffId) =>
    request(`/staff/overview?staffId=${encodeURIComponent(staffId)}`)
};
