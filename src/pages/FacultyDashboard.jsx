import React, { useState } from 'react';
import { Home, Calendar, Users, Clock, Search, User } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';

import FacultyHome from '../components/faculty/FacultyHome';
import FacultyAppointments from '../components/faculty/FacultyAppointments';
import FacultyTimetable from '../components/faculty/FacultyTimetable';
import FacultySearch from '../components/faculty/FacultySearch';
import ProfileSection from '../components/common/ProfileSection';

import { api } from '../services/api';

const FacultyDashboard = ({ 
  currentUser, facultySchedules = [], setFacultySchedules, appointments = [], setAppointments, users = [], onLogout 
}) => {
  const [activeTab, setActiveTab] = useState('home');

  // FIX: Safety check - Ensure appointments is always an array before filtering
  const safeAppointments = Array.isArray(appointments) ? appointments : [];

  const myAppointments = safeAppointments.filter(a => String(a.facultyId) === String(currentUser._id || currentUser.id));
  const pendingReqs = myAppointments.filter(a => a.status === 'pending');
  const approvedAppts = myAppointments.filter(a => ['approved', 'completed'].includes(a.status));

  const handleStatusUpdate = async (id, status) => {
    // Optimistic Update
    setAppointments(prev => prev.map(a => (a.id === id || a._id === id) ? { ...a, status } : a));
    try { await api.updateAppointment(id, { status }); } catch (e) { alert("Failed to update"); }
  };

  const handleCancel = async (id) => {
     if(!window.confirm("Cancel this appointment?")) return;
     setAppointments(prev => prev.filter(a => (a.id !== id && a._id !== id)));
     try { await api.cancelAppointment(id, "Cancelled", "faculty"); } catch (e) { alert("Failed to cancel"); }
  };

  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'requests', icon: Users, label: 'Requests', count: pendingReqs.length },
    { id: 'appointments', icon: Clock, label: 'Meetings' },
    { id: 'schedule', icon: Calendar, label: 'Schedule' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  return (
    <DashboardLayout 
      user={currentUser} 
      title="Faculty" 
      themeColor="indigo"
      tabs={tabs}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onLogout={onLogout}
    >
      {activeTab === 'home' && <FacultyHome currentUser={currentUser} schedules={facultySchedules} appointments={safeAppointments} />}
      
      {activeTab === 'requests' && (
         <div className="animate-in fade-in space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Pending Requests</h2>
            <FacultyAppointments appointments={pendingReqs} users={users} onUpdateStatus={handleStatusUpdate} onCancel={handleCancel} />
         </div>
      )}

      {activeTab === 'appointments' && (
         <div className="animate-in fade-in space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Upcoming Appointments</h2>
            <FacultyAppointments appointments={approvedAppts} users={users} onUpdateStatus={handleStatusUpdate} onCancel={handleCancel} />
         </div>
      )}

      {activeTab === 'schedule' && (
         <FacultyTimetable schedules={facultySchedules} setSchedules={setFacultySchedules} currentUser={currentUser} appointments={safeAppointments} />
      )}

      {activeTab === 'search' && <FacultySearch users={users} schedules={facultySchedules} appointments={safeAppointments} />}
      
      {activeTab === 'profile' && <ProfileSection user={currentUser} appointments={myAppointments} onLogout={onLogout} />}

    </DashboardLayout>
  );
};

export default FacultyDashboard;