import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

const StudentHome = ({ currentUser, appointments = [] }) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const now = new Date();
  const todayName = days[now.getDay()];
  
  // FIX: Get Local Date (YYYY-MM-DD) correctly
  const offset = now.getTimezoneOffset() * 60000;
  const todayDate = new Date(now.getTime() - offset).toISOString().split('T')[0];

  // Filter Today's Meetings (Now includes Pending so you see your request)
  const todayMeetings = appointments.filter(a => 
      (a.studentId === currentUser._id || a.studentId === currentUser.id) && 
      a.date === todayDate && 
      (a.status === 'approved' || a.status === 'completed' || a.status === 'pending')
  );

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Hello, {currentUser.name}!</h1>
            <p className="text-emerald-100">Ready for your sessions today, {todayName}?</p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
            <Calendar className="w-64 h-64" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* TODAY'S SCHEDULE CARD */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-full">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="bg-emerald-100 p-2 rounded-lg text-emerald-600"><Clock className="w-5 h-5"/></span>
                Today's Schedule
            </h2>
            
            {todayMeetings.length === 0 ? (
                <div className="text-center py-10">
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Calendar className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="text-slate-400 font-medium">No meetings scheduled for today.</p>
                    <p className="text-xs text-slate-300 mt-1">Enjoy your free time!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {todayMeetings.map((mtg, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:border-emerald-200 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="font-bold text-emerald-600 bg-white px-3 py-2 rounded-xl border border-emerald-100 text-xs text-center min-w-[60px]">
                                    {mtg.time}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{mtg.facultyName || 'Faculty Meeting'}</h3>
                                    <p className="text-xs text-slate-500 italic">"{mtg.purpose}"</p>
                                </div>
                            </div>
                            {mtg.status === 'completed' ? (
                                <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded">Done</span>
                            ) : mtg.status === 'pending' ? (
                                <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded">Pending</span>
                            ) : (
                                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Confirmed</span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* QUICK STATS CARD */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-full flex flex-col justify-center items-center text-center">
             <div className="w-full grid grid-cols-2 gap-4">
                 <div className="p-4 bg-indigo-50 rounded-2xl">
                    <div className="text-3xl font-bold text-indigo-600">{appointments.filter(a => a.status === 'pending').length}</div>
                    <div className="text-xs text-indigo-400 font-bold uppercase mt-1">Pending</div>
                 </div>
                 <div className="p-4 bg-purple-50 rounded-2xl">
                    <div className="text-3xl font-bold text-purple-600">{appointments.filter(a => a.status === 'completed').length}</div>
                    <div className="text-xs text-purple-400 font-bold uppercase mt-1">Attended</div>
                 </div>
             </div>
             <p className="text-xs text-slate-400 mt-6">
                Keep track of your academic progress here.
             </p>
        </div>

      </div>
    </div>
  );
};

export default StudentHome;