import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

const FacultyHome = ({ currentUser, schedules = [], appointments = [] }) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const now = new Date();
  const todayName = days[now.getDay()];

  // FIX: Get Local Date (YYYY-MM-DD) correctly
  // This adjusts for your timezone offset so it matches the database string
  const offset = now.getTimezoneOffset() * 60000;
  const todayDate = new Date(now.getTime() - offset).toISOString().split('T')[0];

  // Filter Data for Today
  const todayClasses = schedules.filter(s => s.day === todayName && String(s.facultyId) === String(currentUser.id || currentUser._id));
  
  // FIX: Filter matches Local Date AND Approved Status
  const todayMeetings = appointments.filter(a => 
    a.date === todayDate && 
    a.status === 'approved' && 
    String(a.facultyId) === String(currentUser.id || currentUser._id)
  );

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Good Day, {currentUser.name}!</h1>
            <p className="text-indigo-100">Here is what is happening today, {todayName}.</p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
            <Calendar className="w-64 h-64" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* TODAY'S CLASSES */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-full">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="bg-indigo-100 p-2 rounded-lg text-indigo-600"><Calendar className="w-5 h-5"/></span>
                Today's Classes
            </h2>
            {todayClasses.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No classes scheduled for today.</p>
            ) : (
                <div className="space-y-3">
                    {todayClasses.sort((a,b) => a.startTime.localeCompare(b.startTime)).map((cls, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:border-indigo-200 transition-all">
                            <div className="font-bold text-indigo-600 bg-white px-3 py-1 rounded-lg border border-indigo-100 text-xs text-center min-w-[60px]">
                                {cls.startTime}<br/><span className="text-slate-400 font-normal">to</span><br/>{cls.endTime}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">{cls.subject}</h3>
                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                    <MapPin className="w-3 h-3" /> {cls.room}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* TODAY'S MEETINGS */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-full">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="bg-emerald-100 p-2 rounded-lg text-emerald-600"><Clock className="w-5 h-5"/></span>
                Today's Appointments
            </h2>
            {todayMeetings.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-slate-400">No confirmed meetings today.</p>
                    <p className="text-xs text-slate-300 mt-1">Check "Requests" tab for pending items.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {todayMeetings.map((mtg, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50">
                            <div>
                                <div className="font-bold text-slate-800 text-sm mb-1">{mtg.time}</div>
                                <div className="text-xs text-slate-500 italic">"{mtg.purpose}"</div>
                            </div>
                            <div className="bg-white px-3 py-1 rounded-full border border-slate-200 text-xs font-bold text-slate-600">
                                Student Meeting
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default FacultyHome;