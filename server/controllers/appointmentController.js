const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');

exports.createAppointment = async (req, res) => {
  try {
    const appt = await Appointment.create({
        ...req.body,
        facultyId: req.body.facultyId.toString(),
        studentId: req.body.studentId.toString()
    });
    res.status(201).json(appt);
  } catch (error) { res.status(400).json({ message: 'Error booking' }); }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const appt = await Appointment.findByIdAndUpdate(req.params.id, { status, note }, { new: true });
    res.json(appt);
  } catch (error) { res.status(400).json({ message: 'Error updating' }); }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const { reason, cancelledBy } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, { status: 'cancelled', note: reason }, { new: true });
    if (!appointment) return res.status(404).send("Not found");
    
    const targetUserId = cancelledBy === 'faculty' ? appointment.studentId : appointment.facultyId;
    await Notification.create({
      userId: targetUserId,
      message: `Appointment cancelled by ${cancelledBy}. Reason: ${reason}`,
      type: 'error'
    });
    res.json(appointment);
  } catch (err) { res.status(500).send("Server Error"); }
};

exports.generatePin = async (req, res) => {
  try {
    const newPin = Math.floor(1000 + Math.random() * 9000).toString();
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, { attendancePin: newPin }, { new: true });
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json({ success: true, pin: newPin });
  } catch (err) { res.status(500).json({ message: 'Error generating PIN' }); }
};

exports.verifyPin = async (req, res) => {
  try {
    const { pin } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Meeting not found' });
    if (!appointment.attendancePin || appointment.attendancePin !== pin) {
        return res.status(400).json({ message: 'Incorrect Code' });
    }
    appointment.status = 'completed';
    appointment.attendance = 'present';
    await appointment.save();
    res.json({ success: true, message: 'Attendance Marked!', appointment });
  } catch (err) { res.status(500).json({ message: 'Server Error' }); }
};