const User = require('../models/User');
const passport = require('passport');

const register = async (req, res, next) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    req.logout((err) => {
        if (err) console.error(err);
        (async () => {
            const roleAvatar = req.body.role === 'faculty' ? '👨‍🏫' : '👨‍🎓';
            const finalAvatar = req.body.avatar || roleAvatar;
            const newUser = await User.create({ ...req.body, avatar: finalAvatar });

            req.logIn(newUser, (err) => {
                if (err) return next(err);
                req.session.save(() => res.status(201).json(newUser));
            });
        })();
    });
  } catch (error) { 
    res.status(500).json({ message: error.message }); 
  }
};

const login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ msg: info.message });

    req.session.regenerate((err) => {
      if (err) return next(err);
      req.logIn(user, (err) => {
        if (err) return next(err);
        req.session.save(() => res.json(user));
      });
    });
  })(req, res, next);
};

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie('connect.sid');
      res.send('Logged out');
    });
  });
};

const getCurrentUser = (req, res) => {
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.json(req.user);
};

// EXPORT EVERYTHING AT ONCE (Fixes Vercel undefined handler issue)
module.exports = {
  register,
  login,
  logout,
  getCurrentUser
};