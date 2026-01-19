import React, { useState } from "react";
import {
  Trash2,
  Plus,
  Users,
  Briefcase,
  GraduationCap,
  Save,
  X,
} from "lucide-react";
import { api } from "../../services/api";
import Modal from "../layout/Modal";

const FacultyTimetable = ({
  schedules,
  setSchedules,
  currentUser,
  appointments = [],
  readOnly = false,
}) => {
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, slot: null });
  const [newSchedule, setNewSchedule] = useState({
    day: "",
    startTime: "",
    endTime: "",
    type: "class",
    subject: "",
    room: "",
    cohort: "",
  });

  const timeSlotMap = [
    { start: "09:00", end: "10:00" },
    { start: "10:00", end: "11:00" },
    { start: "11:00", end: "12:00" },
    { start: "12:00", end: "13:00" },
    { start: "13:00", end: "14:00" },
    { start: "14:00", end: "15:00" },
    { start: "15:00", end: "16:00" },
    { start: "16:00", end: "17:00" },
    { start: "17:00", end: "18:00" },
  ];
  const displaySlots = [
    "9 AM",
    "10 AM",
    "11 AM",
    "12 PM",
    "1 PM",
    "2 PM",
    "3 PM",
    "4 PM",
    "5 PM",
  ];
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const getCellContent = (day, timeStart) => {
    const blockedSlot = schedules.find(
      (s) =>
        s.day === day &&
        s.startTime === timeStart &&
        String(s.facultyId) === String(currentUser.id || currentUser._id),
    );
    const bookingCount = appointments.filter(
      (a) =>
        String(a.facultyId) === String(currentUser.id || currentUser._id) &&
        a.day === day &&
        a.time === timeStart &&
        a.status !== "rejected" &&
        a.status !== "cancelled",
    ).length;

    if (blockedSlot)
      return { ...blockedSlot, status: "unavailable", bookingCount: 0 };
    return {
      _id: `auto_${day}_${timeStart}`,
      day,
      startTime: timeStart,
      type: "office_hours",
      subject: "Available",
      room: currentUser.staffRoom || "Staff Room",
      status: "available",
      bookingCount,
    };
  };

  const handleCellClick = (day, time, slot) => {
    if (readOnly) return; // DISABLE INTERACTION IF READ-ONLY
    if (slot.status === "unavailable") {
      setDeleteModal({ isOpen: true, slot });
    } else {
      setNewSchedule({
        ...newSchedule,
        day,
        startTime: time.start,
        endTime: time.end,
        type: "class",
        subject: "",
        room: currentUser.staffRoom || "",
      });
      setIsSlotModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.slot) return;
    setSchedules(
      schedules.filter(
        (s) =>
          (s._id || s.id) !== (deleteModal.slot._id || deleteModal.slot.id),
      ),
    );
    setDeleteModal({ isOpen: false, slot: null });
    await api.deleteSchedule(deleteModal.slot._id || deleteModal.slot.id);
  };

  const saveSchedule = async () => {
    const payload = {
      facultyId: currentUser.id || currentUser._id,
      ...newSchedule,
      capacity: 60,
    };
    const saved = await api.addSchedule(payload);
    setSchedules([...schedules, saved]);
    setIsSlotModalOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="flex flex-col sm:flex-row justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50 gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            {readOnly ? `${currentUser.name}'s Schedule` : "My Weekly Schedule"}
          </h2>
          <p className="text-xs text-slate-500">
            Staff Room:{" "}
            <span className="font-bold text-indigo-600">
              {currentUser.staffRoom || "Not Set"}
            </span>
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[1000px]">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="p-4 bg-slate-50 text-slate-500 font-bold text-xs uppercase w-28 border-b border-slate-200 sticky left-0 z-10">
                  Day
                </th>
                {displaySlots.map((label, i) => (
                  <th
                    key={i}
                    className="p-4 bg-slate-50 text-slate-500 font-bold text-xs uppercase border-b border-r border-slate-200 last:border-r-0 text-center w-32"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {daysOfWeek.map((day) => (
                <tr key={day}>
                  <td className="p-4 font-bold text-slate-700 bg-slate-50/30 text-sm border-b border-slate-100 sticky left-0 z-10">
                    {day}
                  </td>
                  {timeSlotMap.map((time, i) => {
                    const slot = getCellContent(day, time.start);
                    let cardStyle = "",
                      icon = null,
                      label = "",
                      subText = "";

                    if (slot.status === "available") {
                      cardStyle = `bg-emerald-50 border-emerald-100 text-emerald-800 ${!readOnly && "hover:bg-emerald-100 cursor-cell"}`;
                      icon = <Users className="w-3 h-3 text-emerald-600" />;
                      label = "AVAILABLE";
                      subText = `${slot.bookingCount}/3 Booked`;
                    } else {
                      cardStyle = `bg-indigo-50 border-indigo-100 text-indigo-900 ${!readOnly && "cursor-pointer hover:bg-red-50 hover:text-red-600"}`;
                      icon =
                        slot.type === "class" ? (
                          <GraduationCap className="w-3 h-3" />
                        ) : (
                          <Briefcase className="w-3 h-3" />
                        );
                      label = slot.type === "class" ? "CLASS" : "BUSY";
                      subText = slot.room;
                    }

                    return (
                      <td
                        key={i}
                        onClick={() => handleCellClick(day, time, slot)}
                        className="p-1 h-28 align-top border-b border-r border-slate-100"
                      >
                        <div
                          className={`h-full w-full p-2.5 rounded-xl border flex flex-col justify-between transition-all duration-200 ${cardStyle}`}
                        >
                          <div className="flex items-center gap-1.5 opacity-90">
                            {icon}
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                              {label}
                            </span>
                          </div>
                          {slot.status !== "available" && (
                            <div className="font-bold text-xs leading-tight line-clamp-2 mt-1">
                              {slot.subject}
                            </div>
                          )}
                          <div className="flex justify-between items-end mt-1">
                            <div className="text-[10px] font-medium opacity-70 truncate max-w-[60px]">
                              {slot.room || "TBD"}
                            </div>
                            {slot.status === "available" && (
                              <div className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-200 text-emerald-800 flex items-center gap-1">
                                {subText}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isSlotModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Add Slot</h3>
              <button onClick={() => setIsSlotModalOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {["class", "meeting"].map((type) => (
                <button
                  key={type}
                  onClick={() => setNewSchedule({ ...newSchedule, type })}
                  className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg ${newSchedule.type === type ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400"}`}
                >
                  {type}
                </button>
              ))}
            </div>
            <input
              className="w-full border p-2 rounded-xl text-sm"
              value={newSchedule.subject}
              onChange={(e) =>
                setNewSchedule({ ...newSchedule, subject: e.target.value })
              }
              placeholder="Subject / Title"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                className="border p-2 rounded-xl text-sm"
                value={newSchedule.room}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, room: e.target.value })
                }
                placeholder="Room"
              />
              <input
                className="border p-2 rounded-xl text-sm"
                value={newSchedule.cohort}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, cohort: e.target.value })
                }
                placeholder="Cohort"
              />
            </div>
            <button
              onClick={saveSchedule}
              className="w-full py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </div>
      )}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, slot: null })}
        onConfirm={confirmDelete}
        title="Remove Slot?"
        message="This will free up the time."
        type="danger"
        confirmText="Remove"
        cancelText="Cancel"
      />
    </div>
  );
};

export default FacultyTimetable;
