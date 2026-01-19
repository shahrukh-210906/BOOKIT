import React, { useState, useEffect } from 'react';
import { Users, RefreshCw, Hash, CheckCircle, Copy } from 'lucide-react';

const MeetingMode = ({ user }) => {
  const [pin, setPin] = useState('');
  const [attendees, setAttendees] = useState([]);

  // Generate a random 4-digit PIN on mount
  useEffect(() => {
    generatePin();
  }, []);

  const generatePin = () => {
    // Generate random number between 1000 and 9999
    const newPin = Math.floor(1000 + Math.random() * 9000).toString();
    setPin(newPin);
    setAttendees([]); // Reset list for new session
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col md:flex-row animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-[500px]">
      
      {/* LEFT: PIN DISPLAY SECTION */}
      <div className="flex-1 bg-indigo-600 p-8 flex flex-col items-center justify-center text-white relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 text-center space-y-6">
          <div>
            <h2 className="text-3xl font-bold">Attendance PIN</h2>
            <p className="text-indigo-200 mt-2">Share this code with your students</p>
          </div>

          {/* THE PIN DISPLAY */}
          <div className="bg-white text-indigo-900 px-12 py-8 rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-300 border-4 border-indigo-200/50">
            <div className="text-7xl font-mono font-black tracking-widest flex items-center justify-center gap-2">
                {pin.split('').map((digit, i) => (
                    <span key={i} className="bg-slate-100 px-2 rounded-lg border border-slate-200 shadow-inner">{digit}</span>
                ))}
            </div>
          </div>

          <button 
            onClick={generatePin} 
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl backdrop-blur-md transition-all font-semibold"
          >
            <RefreshCw className="w-5 h-5" /> New Code
          </button>
        </div>
      </div>

      {/* RIGHT: ATTENDEE LIST */}
      <div className="flex-1 bg-white p-8 flex flex-col">
        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
          <div>
             <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-6 h-6 text-indigo-600" /> Live Attendees
             </h3>
             <p className="text-slate-500 text-sm">Waiting for students to enter code...</p>
          </div>
          <div className="text-2xl font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl">
             {attendees.length}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
           {attendees.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                <Hash className="w-12 h-12 mb-3" />
                <p>No students yet.</p>
             </div>
           ) : (
             attendees.map((student, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 bg-slate-50 animate-in slide-in-from-right-4">
                   <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-lg shadow-sm">
                      {student.avatar || '🎓'}
                   </div>
                   <div>
                      <p className="font-bold text-slate-800">{student.name}</p>
                      <p className="text-xs text-slate-500">{student.email}</p>
                   </div>
                   <CheckCircle className="w-5 h-5 text-emerald-500 ml-auto" />
                </div>
             ))
           )}
        </div>
      </div>

    </div>
  );
};

export default MeetingMode;