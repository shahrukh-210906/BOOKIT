import React, { useState } from "react";
import { Check, X, Calendar, Clock, Play, XCircle } from "lucide-react";
import { api } from "../../services/api";

const FacultyAppointments = ({
  appointments = [],
  users = [],
  onUpdateStatus,
  onCancel,
}) => {
  const [activeCode, setActiveCode] = useState(null);

  const handleGenerateCode = async (apptId, studentName, existingPin) => {
    if (existingPin) {
      setActiveCode({ pin: existingPin, studentName });
    } else {
      try {
        const res = await api.generateMeetingPin(apptId);
        setActiveCode({ pin: res.pin, studentName });
      } catch (err) {
        alert("Could not generate code");
      }
    }
  };

  const sorted = [...appointments].sort((a, b) =>
    a.status === "pending" ? -1 : 1,
  );

  if (appointments.length === 0)
    return (
      <div className="text-center py-20 text-slate-400">No requests found.</div>
    );

  return (
    <>
      <div className="space-y-4">
        {sorted.map((apt) => {
          const student = users.find((u) => (u.id || u._id) === apt.studentId);
          const isPending = apt.status === "pending";
          const isApproved = apt.status === "approved";
          
          // FIX: Robust ID selection to prevent 400 Bad Request
          const appointmentId = apt.id || apt._id;

          return (
            <div
              key={appointmentId} // FIX: Ensure Key is unique
              className={`bg-white rounded-2xl p-6 border transition-all ${isPending ? "border-indigo-100 shadow-md" : "border-slate-100"}`}
            >
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-2xl">
                    {student?.avatar || "🎓"}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">
                      {student?.name || "Student"}
                    </h4>
                    <p className="text-xs text-slate-500 flex gap-2 mt-1">
                      <span>📅 {apt.date}</span> <span>⏰ {apt.time}</span>
                    </p>
                  </div>
                </div>

                <div className="text-sm italic text-slate-500 bg-slate-50 p-2 rounded-lg w-full md:w-auto text-center md:text-left">
                  "{apt.purpose}"
                </div>

                <div className="flex gap-2 w-full md:w-auto justify-end">
                  {isPending ? (
                    <>
                      <button
                        onClick={() => onUpdateStatus(appointmentId, "rejected")}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => onUpdateStatus(appointmentId, "approved")}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-indigo-700 transition-colors"
                      >
                        Accept
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-end gap-2">
                      {isApproved && (
                        <button
                          onClick={() => handleGenerateCode(appointmentId, student?.name, apt.attendancePin)}
                          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-md animate-pulse"
                        >
                          <Play className="w-4 h-4" /> View Code
                        </button>
                      )}
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${apt.status === "completed" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}
                      >
                        {apt.status}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CODE POPUP */}
      {activeCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 text-center max-w-sm w-full relative animate-in zoom-in">
            <button
              onClick={() => setActiveCode(null)}
              className="absolute top-4 right-4 text-slate-300 hover:text-slate-600"
            >
              <XCircle />
            </button>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              Meeting Code
            </h3>
            <p className="text-slate-500 text-xs mb-6">
              For {activeCode.studentName}
            </p>
            <div className="text-6xl font-black text-indigo-600 tracking-widest font-mono bg-indigo-50 py-6 rounded-2xl mb-4">
              {activeCode.pin}
            </div>
            <p className="text-xs text-slate-400">
              Share this with the student to mark attendance.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default FacultyAppointments;