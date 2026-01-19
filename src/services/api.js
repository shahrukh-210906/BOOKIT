import axios from 'axios';

// 1. CREATE AXIOS INSTANCE
// 'withCredentials: true' is CRITICAL. It ensures cookies are sent to the backend.
const API = axios.create({
  baseURL: 'http://localhost:5000/api', 
  withCredentials: true, 
});

export const api = {
  
  // ================= AUTHENTICATION =================
  
  checkSession: async () => {
    try {
      // Calls /auth/me to see if user is logged in
      const res = await API.get('/auth/me');
      return res.data;
    } catch (error) {
      return null; // Returns null if no session exists (prevents crashing)
    }
  },

  login: async (credentials) => {
    // credentials = { email, password }
    const res = await API.post('/auth/login', credentials);
    return res.data;
  },

  register: async (userData) => {
    const res = await API.post('/auth/signup', userData);
    return res.data;
  },

  logout: async () => {
    await API.post('/auth/logout');
  },

  // ================= PROFILE MANAGEMENT =================

  updateProfile: async (userId, data) => {
    // PUT /users/:id - Updates name, school, room, etc.
    const res = await API.put(`/users/${userId}`, data);
    return res.data;
  },

  // ================= DASHBOARD DATA =================

  getData: async () => {
    // Fetches Users, Schedules, and Appointments in one request
    try {
      const res = await API.get('/data');
      return res.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },

  // ================= FACULTY SCHEDULES =================

  addSchedule: async (scheduleData) => {
    const res = await API.post('/schedules', scheduleData);
    return res.data;
  },

  deleteSchedule: async (scheduleId) => {
    const res = await API.delete(`/schedules/${scheduleId}`);
    return res.data;
  },

  // ================= APPOINTMENTS (BOOKING) =================

  bookAppointment: async (bookingData) => {
    const res = await API.post('/appointments', bookingData);
    return res.data;
  },

  updateAppointment: async (id, data) => {
    // Used for Approving/Rejecting requests
    // data = { status: 'approved' | 'rejected' }
    const res = await API.put(`/appointments/${id}`, data);
    return res.data;
  },

  cancelAppointment: async (id, reason = "Cancelled by user", cancelledBy = "student") => {
    const res = await API.put(`/appointments/${id}/cancel`, { reason, cancelledBy });
    return res.data;
  },

  // ================= MEETING CODES (ATTENDANCE) =================

  // Faculty: Generate a unique PIN for a specific appointment
  generateMeetingPin: async (appointmentId) => {
    const res = await API.put(`/appointments/${appointmentId}/pin`);
    return res.data; // Returns { success: true, pin: "1234" }
  },

  // Student: Verify the PIN to mark attendance
  verifyMeetingPin: async (appointmentId, pin) => {
    const res = await API.post(`/appointments/${appointmentId}/verify`, { pin });
    return res.data; // Returns { success: true, message: "Attendance Marked!" }
  }
};