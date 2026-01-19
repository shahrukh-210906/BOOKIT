import React, { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import FacultyDashboard from "./pages/FacultyDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import { api } from "./services/api";
import { Loader2 } from "lucide-react";

const App = () => {
  const [view, setView] = useState("loading"); 
  const [currentUser, setCurrentUser] = useState(null);

  // Data State
  const [users, setUsers] = useState([]);
  const [facultySchedules, setFacultySchedules] = useState([]);
  const [appointments, setAppointments] = useState([]);

  // 1. INITIAL SESSION CHECK
  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = await api.checkSession();
        if (user) {
          setCurrentUser(user);
          if (user.role === "faculty") setView("faculty-dashboard");
          else setView("student-dashboard");
          fetchData();
        } else {
          setView("login");
        }
      } catch (error) {
        setView("login");
      }
    };
    checkSession();
  }, []);

  // 2. DATA FETCHING FUNCTION
  const fetchData = async () => {
    try {
      const data = await api.getData();
      // Only update if data exists to prevent flickering on empty responses
      if (data) {
        setUsers(data.users || []);
        setFacultySchedules(data.schedules || []);
        setAppointments(data.appointments || []);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  // --- 3. AJAX POLLING SETUP (NEW) ---
  useEffect(() => {
    // Only poll if a user is logged in
    if (!currentUser) return;

    // Run fetchData every 3 seconds (3000ms)
    const interval = setInterval(() => {
      fetchData();
    }, 3000); 

    // Cleanup: Stop polling if user logs out or component unmounts
    return () => clearInterval(interval);
  }, [currentUser]); // Re-run this effect when currentUser changes

  // 4. HANDLERS
  const handleLogin = (user) => {
    setCurrentUser(user);
    if (user.role === "faculty") setView("faculty-dashboard");
    else setView("student-dashboard");
    fetchData(); 
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
    setView("login");
    setUsers([]);
    setFacultySchedules([]);
    setAppointments([]);
  };

  // 5. RENDER
  if (view === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading BookIt...</p>
      </div>
    );
  }

  if (view === "login") {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (view === "faculty-dashboard" && currentUser) {
    return (
      <FacultyDashboard
        currentUser={currentUser}
        facultySchedules={facultySchedules}
        setFacultySchedules={setFacultySchedules}
        appointments={appointments}
        setAppointments={setAppointments}
        users={users} 
        onLogout={handleLogout}
      />
    );
  }

  if (view === "student-dashboard" && currentUser) {
    return (
      <StudentDashboard
        currentUser={currentUser}
        users={users} 
        facultySchedules={facultySchedules}
        appointments={appointments}
        setAppointments={setAppointments}
        onLogout={handleLogout}
      />
    );
  }

  return <div>Error: Unknown State</div>;
};

export default App;