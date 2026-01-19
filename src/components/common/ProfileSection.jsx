import React, { useState } from "react";
import {
  User,
  Calendar,
  CheckCircle,
  XCircle,
  Edit2,
  X,
  BookOpen,
  MapPin,
  LogOut,
  Loader2,
  History,
} from "lucide-react";
// FIX: Go up two levels (../../) to find services
import { api } from "../../services/api"; 

const ProfileSection = ({ user, appointments = [], onLogout }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Edit Form State
  const [formData, setFormData] = useState({
    name: user.name || "",
    school: user.school || "",
    staffRoom: user.staffRoom || "",
    year: user.year || "",
    cohort: user.cohort || "",
  });

  // School Options (Matches Login)
  const schoolOptions = [
    "School of Technology",
    "School of Business",
    "School of Arts & Design",
    "School of Architecture & Planning",
    "School of Liberal Arts & Humanities",
    "School of Law",
    "School of Sciences",
  ];

  // Filter History Data
  const history = appointments.filter(
    (appt) =>
      (appt.studentId === user._id ||
        appt.studentId === user.id ||
        appt.facultyId === user._id ||
        appt.facultyId === user.id) &&
      (appt.status === "completed" || appt.status === "cancelled"),
  );

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.updateProfile(user._id || user.id, formData);
      setIsEditModalOpen(false);
      window.location.reload();
    } catch (error) {
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in-up max-w-4xl mx-auto pb-10">
      {/* --- PROFILE CARD --- */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-5xl border-4 border-white shadow-sm z-10">
          {user.avatar || "👤"}
        </div>

        <div className="text-center md:text-left flex-1 z-10">
          <h2 className="text-3xl font-bold text-slate-800">{user.name}</h2>
          <p className="text-slate-500 font-medium capitalize flex items-center justify-center md:justify-start gap-2 mt-1">
            {user.role}
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            {user.school || "Woxsen University"}
          </p>

          <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
            {user.school && (
              <span className="px-3 py-1 bg-slate-50 rounded-lg text-xs font-bold text-slate-600 border border-slate-100 flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> {user.school}
              </span>
            )}
            {user.staffRoom && (
              <span className="px-3 py-1 bg-slate-50 rounded-lg text-xs font-bold text-slate-600 border border-slate-100 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {user.staffRoom}
              </span>
            )}
            {user.cohort && (
              <span className="px-3 py-1 bg-slate-50 rounded-lg text-xs font-bold text-slate-600 border border-slate-100">
                🎓 {user.cohort}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 z-10 w-full md:w-auto min-w-[160px]">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-white text-slate-700 px-6 py-2.5 rounded-xl font-bold border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
          >
            <Edit2 className="w-4 h-4" /> Edit Profile
          </button>
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="flex items-center justify-center gap-2 bg-white text-indigo-600 px-6 py-2.5 rounded-xl font-bold border border-indigo-100 hover:bg-indigo-50 transition-all shadow-sm"
          >
            <History className="w-4 h-4" /> View History
          </button>
          <button
            onClick={onLogout}
            className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-6 py-2.5 rounded-xl font-bold hover:bg-red-100 transition-all border border-transparent"
          >
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-slate-50 rounded-full z-0 opacity-50"></div>
      </div>

      {/* --- HISTORY MODAL --- */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 flex flex-col max-h-[80vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" /> Meeting History
              </h3>
              <button
                onClick={() => setIsHistoryOpen(false)}
                className="bg-white p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar space-y-4">
              {history.length === 0 ? (
                <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  No meeting history found yet.
                </div>
              ) : (
                history.map((appt) => (
                  <div
                    key={appt._id || appt.id}
                    className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center shadow-sm hover:shadow-md transition-all"
                  >
                    <div>
                      <div className="font-bold text-slate-800 text-sm">
                        {appt.date}{" "}
                        <span className="text-slate-300 mx-1">|</span>{" "}
                        {appt.time}
                      </div>
                      <div className="text-xs text-slate-500 mt-1 italic flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>{" "}
                        "{appt.purpose}"
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1.5 ${appt.status === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                    >
                      {appt.status === "completed" ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      {appt.status}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- EDIT MODAL --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-lg text-slate-800">Edit Profile</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Full Name
                </label>
                <input
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              {user.role === "faculty" ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                      School
                    </label>
                    {/* DROPDOWN INSTEAD OF TEXT INPUT */}
                    <div className="relative">
                      <select
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none appearance-none bg-white"
                        value={formData.school}
                        onChange={(e) =>
                          setFormData({ ...formData, school: e.target.value })
                        }
                      >
                        <option value="">Select School</option>
                        {schoolOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-3.5 pointer-events-none text-slate-400">
                        ▼
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                      Staff Room
                    </label>
                    <input
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={formData.staffRoom}
                      onChange={(e) =>
                        setFormData({ ...formData, staffRoom: e.target.value })
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                      Year
                    </label>
                    <input
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={formData.year}
                      onChange={(e) =>
                        setFormData({ ...formData, year: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                      Cohort
                    </label>
                    <input
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={formData.cohort}
                      onChange={(e) =>
                        setFormData({ ...formData, cohort: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;