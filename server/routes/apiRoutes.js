const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Schedule = require('../models/Schedule');
const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');

// Import Controllers
const appointmentController = require('../controllers/appointmentController');
const scheduleController = require('../controllers/scheduleController');
const userController = require('../controllers/userController');

// --- 1. DATA FETCHING ---
router.get('/data', async (req, res) => {
  try {
    const users = await User.find({});
    const schedules = await Schedule.find({});
    const appointments = await Appointment.find({});
    const notifications = await Notification.find({});
    res.json({ users, schedules, appointments, notifications });
  } catch (error) { res.status(500).json({ message: 'Error fetching data' }); }
});

// --- 2. SCHEDULES ---
router.post('/schedules', scheduleController.addSchedule);
router.delete('/schedules/:id', scheduleController.deleteSchedule);

// --- 3. APPOINTMENTS ---
router.post('/appointments', appointmentController.createAppointment);
router.put('/appointments/:id', appointmentController.updateStatus);
router.put('/appointments/:id/cancel', appointmentController.cancelAppointment);
router.put('/appointments/:id/pin', appointmentController.generatePin);
router.post('/appointments/:id/verify', appointmentController.verifyPin);

// --- 4. USER PROFILE ---
router.put('/users/:id', userController.updateProfile);

// --- 5. UTILS ---
router.get('/clear', async (req, res) => {
    await User.deleteMany({});
    await Schedule.deleteMany({});
    await Appointment.deleteMany({});
    await Notification.deleteMany({});
    res.json({ message: "DB Cleared" });
});

module.exports = router;