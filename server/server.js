const express = require("express");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const connectDB = require("./config/db");
const User = require("./models/User"); // Needed for Passport Strategy logic below

// Route Imports
const authRoutes = require("./routes/authRoutes");
const apiRoutes = require("./routes/apiRoutes");
// Import other routes (appointments, schedules) as you create them

dotenv.config();
const app = express();

// 1. Database
connectDB();

// 2. Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Session
app.use(
  session({
    secret: "woxsen_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000, secure: false, httpOnly: true },
  }),
);

// 4. Passport Config
// (You can move this Strategy to config/passport.js for even more cleanliness)
const LocalStrategy = require("passport-local").Strategy;
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user)
          return done(null, false, { message: "Email not registered" });
        if (user.password !== password)
          return done(null, false, { message: "Password incorrect" });
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

app.use(passport.initialize());
app.use(passport.session());

// 5. Use Routes
app.use("/api/auth", authRoutes);
app.use("/api", apiRoutes);
// app.use('/api/appointments', appointmentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
