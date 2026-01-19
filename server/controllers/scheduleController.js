const Schedule = require('../models/Schedule');

exports.addSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.create({ ...req.body, facultyId: req.body.facultyId.toString() });
    res.status(201).json(schedule);
  } catch (error) { res.status(400).json({ message: 'Error creating schedule' }); }
};

exports.deleteSchedule = async (req, res) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ message: 'Schedule removed' });
  } catch (error) { res.status(404).json({ message: 'Schedule not found' }); }
};