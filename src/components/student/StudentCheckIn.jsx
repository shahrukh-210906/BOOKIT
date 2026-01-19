import React, { useState } from "react";
import { CheckCircle, Hash, User, Loader2, ArrowRight } from "lucide-react";
import { api } from "../../services/api";

const StudentCheckIn = ({ currentUser, users = [] }) => {
  const [step, setStep] = useState(1);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [pin, setPin] = useState(["", "", "", ""]);
  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: "",
  });

  // Filter only faculty users
  const facultyList = users.filter((u) => u.role === "faculty");

  const handlePinChange = (index, value) => {
    if (value.length > 1) return; // Only 1 digit per box
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto-focus next input
    if (value && index < 3) {
      document.getElementById(`pin-${index + 1}`).focus();
    }
  };

  const handleSubmit = async () => {
    const finalPin = pin.join("");
    if (!selectedFaculty || finalPin.length !== 4) {
      setStatus({
        ...status,
        error: "Please select faculty and enter 4-digit PIN.",
      });
      return;
    }

    setStatus({ loading: true, error: "" });

    try {
      // Send to backend
      await api.markAttendance({
        studentId: currentUser.id || currentUser._id,
        facultyId: selectedFaculty,
        pin: finalPin,
      });

      setStatus({ loading: false, success: true });
    } catch (err) {
      setStatus({ loading: false, error: "Invalid PIN or Session Closed." });
    }
  };

  // --- SUCCESS VIEW ---
  if (status.success) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-in zoom-in duration-300">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-200">
          <CheckCircle className="w-12 h-12 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">
          You're Checked In!
        </h2>
        <p className="text-slate-500 mt-2">Attendance marked successfully.</p>
        <button
          onClick={() => {
            setStep(1);
            setPin(["", "", "", ""]);
            setStatus({ success: false });
          }}
          className="mt-8 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold"
        >
          Check In Again
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-center max-w-md mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Class Check-In</h2>
        <p className="text-slate-500">
          Enter the code displayed by your professor.
        </p>
      </div>

      {/* STEP 1: SELECT FACULTY */}
      <div className="mb-6">
        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
          Select Professor
        </label>
        <div className="relative">
          <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
          <select
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none font-medium text-slate-700"
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
          >
            <option value="">-- Choose Faculty --</option>
            {facultyList.map((f) => (
              <option key={f.id || f._id} value={f.id || f._id}>
                {f.name} ({f.department || "Faculty"})
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-4 w-2 h-2 border-r-2 border-b-2 border-slate-400 rotate-45 pointer-events-none"></div>
        </div>
      </div>

      {/* STEP 2: ENTER PIN */}
      <div className="mb-8">
        <label className="block text-xs font-bold text-slate-500 uppercase mb-3 text-center">
          Enter 4-Digit PIN
        </label>
        <div className="flex justify-center gap-3">
          {pin.map((digit, i) => (
            <input
              key={i}
              id={`pin-${i}`}
              type="text"
              maxLength="1"
              className="w-14 h-16 text-center text-3xl font-bold border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
              value={digit}
              onChange={(e) => handlePinChange(i, e.target.value)}
            />
          ))}
        </div>
      </div>

      {/* Error Message */}
      {status.error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold text-center mb-6 animate-pulse">
          {status.error}
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={status.loading || !selectedFaculty || pin.join("").length < 4}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {status.loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            Verify Attendance <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </div>
  );
};

export default StudentCheckIn;
