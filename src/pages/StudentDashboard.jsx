import React, { useState } from 'react';
import { Home, User, Calendar, Search } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';

// Feature Components
import StudentHome from '../components/student/StudentHome';
import FacultyDirectory from '../components/student/FacultyDirectory';
import StudentAppointments from '../components/student/StudentAppointments';
import ProfileSection from '../components/common/ProfileSection';

import { api } from '../services/api';

const StudentDashboard = ({ 
  currentUser, users, facultySchedules, appointments, setAppointments, onLogout 
}) => {
  const [activeTab, setActiveTab] = useState('home');

  // Logic
  const facultyList = users.filter(u => u.role === 'faculty');
  const myAppointments = appointments.filter(a => (a.studentId === currentUser._id || a.studentId === currentUser.id));

  const handleCancel = async (appointmentId) => {
    if(!window.confirm("Cancel booking?")) return;
    setAppointments(prev => prev.filter(a => (a._id || a.id) !== appointmentId));
    try { await api.cancelAppointment(appointmentId); } catch (e) { alert("Error cancelling"); }
  };

  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'directory', icon: Search, label: 'Find Faculty' },
    { id: 'appointments', icon: Calendar, label: 'Bookings' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  return (
    <DashboardLayout
      user={currentUser}
      title="Student"
      themeColor="emerald"
      tabs={tabs}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onLogout={onLogout}
    >
      {activeTab === 'home' && <StudentHome currentUser={currentUser} appointments={appointments} />}
      
      {activeTab === 'directory' && (
         <FacultyDirectory 
            facultyList={facultyList} 
            schedules={facultySchedules} 
            appointments={appointments}
            currentUser={currentUser}
            setAppointments={setAppointments} 
         />
      )}

      {activeTab === 'appointments' && (
         <div className="animate-in fade-in space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">My Bookings</h2>
            <StudentAppointments 
                appointments={myAppointments} 
                users={users} 
                schedules={facultySchedules} 
                onCancel={handleCancel} 
            />
         </div>
      )}

      {activeTab === 'profile' && <ProfileSection user={currentUser} appointments={myAppointments} onLogout={onLogout} />}
      
    </DashboardLayout>
  );
};

export default StudentDashboard;