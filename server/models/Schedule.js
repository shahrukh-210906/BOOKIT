const mongoose = require('mongoose');

const scheduleSchema = mongoose.Schema({
  facultyId: { type: String, required: true },
  day: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  
  // Updated types to include 'meeting'
  type: { type: String, default: 'class', enum: ['class', 'office_hours', 'meeting'] },
  
  subject: String,
  room: String,
  cohort: String,
  capacity: { type: Number, default: 60 }
}, { timestamps: true });

scheduleSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id; }
});

module.exports = mongoose.model('Schedule', scheduleSchema);