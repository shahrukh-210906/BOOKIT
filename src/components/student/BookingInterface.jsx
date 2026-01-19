import React, { useState } from 'react';
import { XCircle, Calendar, MessageSquare, Clock, Users, GraduationCap, CheckCircle } from 'lucide-react';
import Modal from '../layout/Modal';

const BookingInterface = ({ faculty, schedules, appointments, onClose, onBook, studentId }) => {
  const [bookingData, setBookingData] = useState({ date: '', time: '', purpose: '', day: '' });
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const timeSlotMap = [
    { start: '09:00', end: '10:00' }, { start: '10:00', end: '11:00' }, { start: '11:00', end: '12:00' },
    { start: '12:00', end: '13:00' }, { start: '13:00', end: '14:00' }, { start: '14:00', end: '15:00' },
    { start: '15:00', end: '16:00' }, { start: '16:00', end: '17:00' }, { start: '17:00', end: '18:00' },
  ];
  const displaySlots = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM'];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const getSlotStatus = (day, time) => {
    // 1. Check if Faculty is busy (Class)
    const blockedSlot = schedules.find(s => 
        String(s.facultyId) === String(faculty._id || faculty.id) && 
        s.day === day && 
        s.startTime === time
    );

    // 2. Filter active appointments
    const slotAppointments = appointments.filter(a => 
        String(a.facultyId) === String(faculty._id || faculty.id) && 
        a.day === day && 
        a.time === time && 
        a.status !== 'rejected' && a.status !== 'cancelled'
    );

    // 3. Check if *I* have booked it
    const myBooking = slotAppointments.find(a => String(a.studentId) === String(studentId));

    if (blockedSlot) {
        return { status: 'busy', label: blockedSlot.type === 'class' ? 'Class' : 'Busy', room: blockedSlot.room };
    }
    if (myBooking) {
        // FIX: Pass the actual booking object to check status later
        return { status: 'booked_by_me', label: 'My Slot', room: 'Booked', booking: myBooking };
    }
    if (slotAppointments.length >= 3) {
        return { status: 'full', label: 'Full', count: 3 };
    }

    return { 
        status: 'available', 
        label: 'Available', 
        count: slotAppointments.length,
        room: faculty.staffRoom || 'Staff Room' 
    };
  };

  const handleSlotClick = (day, time, slotStatus) => {
    if (slotStatus.status === 'available') {
        const nextDate = getNextDateForDay(day);
        setBookingData({ ...bookingData, day, time, date: nextDate, purpose: '' });
        setIsFormOpen(true);
    } 
  };

  const handleConfirmBooking = () => {
    if(!bookingData.purpose || !bookingData.date) { alert("Please fill in all details."); return; }
    onBook(bookingData);
    setIsFormOpen(false);
  };

  const getNextDateForDay = (dayName) => {
    const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(dayName);
    const today = new Date();
    const currentDay = today.getDay();
    let daysUntil = dayIndex - currentDay;
    if (daysUntil <= 0) daysUntil += 7;
    
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysUntil);
    return nextDate.toISOString().split('T')[0];
  };

  return (
    <>
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col h-full max-h-[85vh] w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
        
        <div className="bg-slate-50/80 backdrop-blur-sm p-6 flex justify-between items-center border-b border-slate-200 sticky left-0 right-0 top-0 z-20">
          <div className="flex gap-5 items-center">
            <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-slate-200">
                {faculty.avatar || '👨‍🏫'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{faculty.name}</h2>
              <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Available for booking
              </p>
            </div>
          </div>
          <button onClick={onClose} className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all shadow-sm">
            <XCircle className="w-6 h-6"/>
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6 bg-white custom-scrollbar">
          <div className="min-w-[1000px]">
            <table className="w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="p-4 bg-white text-slate-400 font-bold text-xs uppercase tracking-wider text-left w-28 sticky left-0 z-10 border-b border-slate-100">Day</th>
                  {displaySlots.map((label, i) => (
                      <th key={i} className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center border-b border-slate-100">{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {daysOfWeek.map(day => (
                  <tr key={day} className="group">
                    <td className="sticky left-0 bg-white z-10 py-2 align-top">
                        <div className="font-bold text-slate-700 text-sm bg-slate-50 py-3 px-4 rounded-xl text-left border border-slate-100 mr-2">
                            {day}
                        </div>
                    </td>

                    {timeSlotMap.map((t, i) => {
                      const slot = getSlotStatus(day, t.start);
                      let cardStyle = "bg-slate-50 border-slate-100 text-slate-400 opacity-60 cursor-not-allowed";
                      let icon = null;
                      let subText = slot.room || 'N/A';

                      if (slot.status === 'available') {
                        cardStyle = "bg-emerald-50 border-emerald-100 text-emerald-800 hover:bg-emerald-100 hover:border-emerald-200 hover:scale-105 hover:shadow-md cursor-pointer transition-all duration-200";
                        icon = <Users className="w-3 h-3 text-emerald-600" />;
                        subText = `${slot.count}/3 Filled`;
                      
                      } else if (slot.status === 'booked_by_me') {
                        // FIX: Check if completed
                        if (slot.booking && slot.booking.status === 'completed') {
                            // COMPLETED STYLE
                            cardStyle = "bg-slate-100 border-slate-200 text-slate-500 shadow-sm"; 
                            icon = <CheckCircle className="w-3 h-3 text-slate-400" />;
                            subText = "Meeting Done";
                        } else {
                            // ACTIVE STYLE
                            cardStyle = "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200";
                            icon = <CheckCircle className="w-3 h-3 text-white" />;
                            subText = "You are going";
                        }
                      
                      } else if (slot.status === 'full') {
                        cardStyle = "bg-red-50 border-red-100 text-red-500 opacity-90 cursor-not-allowed";
                        icon = <Users className="w-3 h-3" />;
                        subText = "Slot Full";
                      
                      } else if (slot.status === 'busy') {
                        cardStyle = "bg-indigo-50 border-indigo-100 text-indigo-400 cursor-not-allowed";
                        icon = <GraduationCap className="w-3 h-3" />;
                        subText = "Busy";
                      }

                      return (
                        <td key={i} onClick={() => handleSlotClick(day, t.start, slot)} className="p-1 h-28 align-top">
                          <div className={`h-full w-full p-2.5 rounded-xl border flex flex-col justify-between ${cardStyle}`}>
                            <div className="flex items-center gap-1.5">
                                {icon}
                                <span className="text-[10px] font-bold uppercase tracking-wider">{slot.label}</span>
                            </div>
                             {slot.status === 'available' && (
                                <div className="text-xs font-bold text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    Book Now
                                </div>
                             )}
                            <div className="text-[10px] font-medium opacity-80 truncate">
                                {subText}
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
      </div>

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Confirm Booking"
        message={`Requesting appointment with ${faculty.name}`}
        confirmText="Send Request"
        onConfirm={handleConfirmBooking}
      >
        <div className="space-y-5 mt-4">
            <div className="bg-slate-50 p-4 rounded-xl flex items-center justify-between border border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg border border-slate-200"><Calendar className="w-5 h-5 text-indigo-500"/></div>
                    <div>
                        <p className="text-xs text-slate-500 font-bold uppercase">Date</p>
                        <p className="text-sm font-bold text-slate-700">{bookingData.date} ({bookingData.day})</p>
                    </div>
                </div>
                <div className="h-8 w-px bg-slate-200"></div>
                <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg border border-slate-200"><Clock className="w-5 h-5 text-indigo-500"/></div>
                    <div>
                        <p className="text-xs text-slate-500 font-bold uppercase">Time</p>
                        <p className="text-sm font-bold text-slate-700">{bookingData.time}</p>
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Reason for Visit</label>
                <div className="relative group">
                    <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <textarea 
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm resize-none transition-all shadow-sm"
                        rows="3"
                        placeholder="e.g. Doubts regarding Project Phase 2..."
                        value={bookingData.purpose}
                        onChange={e => setBookingData({...bookingData, purpose: e.target.value})}
                    />
                </div>
            </div>
        </div>
      </Modal>
    </>
  );
};

export default BookingInterface;