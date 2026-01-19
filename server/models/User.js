const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['student', 'faculty'] },
  
  // Faculty Specific
  school: { type: String },     // Renamed from department
  staffRoom: { type: String },  // NEW: Staff Room Number
  
  // Student Specific
  year: { type: String },
  cohort: { type: String },
  
  avatar: { type: String, default: '👤' }
}, { timestamps: true });

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id; }
});

module.exports = mongoose.model('User', userSchema);