const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  facultyId: { type: String, required: true },
  facultyName: { type: String },
  date: { type: String, required: true },
  time: { type: String, required: true },
  day: { type: String }, 
  purpose: { type: String, required: true },
  status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected', 'cancelled', 'completed'] },
  note: { type: String },
  attendance: { type: String, default: 'pending', enum: ['pending', 'present', 'absent'] },
  attendancePin: { type: String, default: null } 
}, { timestamps: true });

// FIX: Add this transform to ensure 'id' is available on the frontend
AppointmentSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id; }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);