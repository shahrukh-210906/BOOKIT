const User = require('../models/User');

exports.updateProfile = async (req, res) => {
  try {
    const { name, school, staffRoom, year, cohort } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, school, staffRoom, year, cohort },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    
    // Update active session if needed
    if (req.user && req.user.id === req.params.id) {
        req.user.name = updatedUser.name;
        req.user.school = updatedUser.school; 
    }
    res.json(updatedUser);
  } catch (err) { res.status(500).json({ message: "Server Error" }); }
};