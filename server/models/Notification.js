const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
  userId: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, default: 'info' },
  timestamp: { type: String, default: new Date().toLocaleString() }
});

notificationSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id; }
});

module.exports = mongoose.model('Notification', notificationSchema);