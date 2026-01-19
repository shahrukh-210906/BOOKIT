import React, { useState } from "react";
import { Calendar, Clock, CheckCircle, Loader2, XCircle } from "lucide-react";
import { api } from "../../services/api";

const StudentAppointments = ({
  appointments,
  users,
  schedules = [],
  onCancel,
}) => {
  const [verifyingId, setVerifyingId] = useState(null);
  const [pin, setPin] = useState("");
  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: "",
  });

  const handleVerify = async () => {
    if (pin.length !== 4) return;
    setStatus({ loading: true, error: "", success: false });

    try {
      await api.verifyMeetingPin(verifyingId, pin);
      setStatus({ loading: false, error: "", success: true });

      // Close modal after success
      setTimeout(() => {
        setVerifyingId(null);
        setPin("");
        setStatus({ success: false, loading: false, error: "" });
        // Force page reload to show updated "Completed" status
        window.location.reload();
      }, 1500);
    } catch (err) {
      setStatus({ loading: false, success: false, error: "Incorrect Code" });
    }
  };

  // Sort by date (reverse chronological)
  const sorted = [...appointments].slice().reverse();

  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
        <Calendar className="w-12 h-12 text-slate-300 mb-2" />
        <p className="text-slate-500 font-medium">No bookings yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sorted.map((apt) => {
          const faculty = users.find((u) => (u.id || u._id) === apt.facultyId);
          const isApproved = apt.status === "approved";
          // FIX: Handle both _id (MongoDB) and id
          const appointmentId = apt._id || apt.id;

          return (
            <div
              key={appointmentId}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-xl shadow-inner">
                    {faculty?.avatar || "👤"}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">
                      {faculty?.name || "Unknown Faculty"}
                    </h4>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${isApproved ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
                    >
                      {apt.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-sm text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex gap-4 mb-2">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />{" "}
                    {apt.date}
                  </span>
                  <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" /> {apt.time}
                  </span>
                </div>
                <div className="italic text-xs opacity-80 pl-1 border-l-2 border-indigo-200">
                  "{apt.purpose}"
                </div>
              </div>

              <div className="flex gap-2 items-center">
                {isApproved && (
                  <button
                    onClick={() => {
                      setVerifyingId(appointmentId); // FIX: Uses valid ID now
                      setPin("");
                      setStatus({ loading: false, error: "", success: false });
                    }}
                    className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
                  >
                    Check In
                  </button>
                )}

                {["pending", "approved"].includes(apt.status) && (
                  <button
                    onClick={() => onCancel(appointmentId)}
                    className="px-4 py-2.5 text-red-500 text-xs font-bold hover:bg-red-50 rounded-xl border border-transparent hover:border-red-100 transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* VERIFY MODAL */}
      {verifyingId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs text-center relative shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setVerifyingId(null)}
              className="absolute top-4 right-4 text-slate-300 hover:text-slate-600 transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>

            {status.success ? (
              <div className="py-6 flex flex-col items-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-3 animate-bounce">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="font-bold text-xl text-emerald-700">Present!</h3>
                <p className="text-xs text-emerald-600">
                  Attendance marked successfully.
                </p>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-lg text-slate-800 mb-1">
                  Enter Class Code
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Ask your faculty for the 4-digit PIN.
                </p>

                <input
                  autoFocus
                  maxLength={4}
                  value={pin}
                  onChange={(e) =>
                    setPin(e.target.value.replace(/[^0-9]/g, ""))
                  } // Numbers only
                  className="w-full text-center text-4xl font-mono tracking-[0.5em] font-bold border-2 border-slate-200 rounded-2xl py-4 mb-4 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-indigo-600"
                  placeholder="0000"
                />

                {status.error && (
                  <div className="text-xs text-red-500 font-bold mb-4 bg-red-50 p-2 rounded-lg border border-red-100">
                    {status.error}
                  </div>
                )}

                <button
                  onClick={handleVerify}
                  disabled={status.loading || pin.length !== 4}
                  className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-xl shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  {status.loading ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    "Verify Attendance"
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default StudentAppointments;
