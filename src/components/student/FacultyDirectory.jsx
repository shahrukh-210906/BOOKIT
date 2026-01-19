import React, { useState } from 'react';
import { Search, MapPin, ChevronRight, ArrowLeft, Filter } from 'lucide-react';
import BookingInterface from './BookingInterface';
import { api } from '../../services/api';
import Modal from '../layout/Modal'; // 1. Import Modal

const FacultyDirectory = ({ facultyList, schedules, appointments, currentUser, setAppointments }) => {
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState(''); 
  const [showSuccessModal, setShowSuccessModal] = useState(false); // 2. New State

  const schoolOptions = [
    "School of Technology",
    "School of Business",
    "School of Arts & Design",
    "School of Architecture & Planning",
    "School of Liberal Arts & Humanities",
    "School of Law",
    "School of Sciences"
  ];

  const filteredFaculty = facultyList.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (f.department && f.department.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSchool = selectedSchool === '' || f.school === selectedSchool;
    return matchesSearch && matchesSchool;
  });

  const handleBook = async (bookingData) => {
    if (!selectedFaculty || !currentUser) return;

    try {
        const payload = {
            ...bookingData,
            studentId: currentUser.id || currentUser._id,
            facultyId: selectedFaculty.id || selectedFaculty._id,
            facultyName: selectedFaculty.name
        };

        await api.bookAppointment(payload);
        // 3. Show Modal instead of Alert
        setShowSuccessModal(true); 
    } catch (error) {
        console.error("Booking failed:", error);
        alert("❌ Failed to send request. Please try again.");
    }
  };

  // 4. Handle Modal Close (Refresh Page)
  const handleCloseSuccess = () => {
      setShowSuccessModal(false);
      window.location.reload();
  };

  if (selectedFaculty) {
    return (
      <div className="animate-in slide-in-from-right duration-300">
        <button 
            onClick={() => setSelectedFaculty(null)} 
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-4 font-bold transition-colors"
        >
            <ArrowLeft className="w-5 h-5" /> Back to Directory
        </button>
        
        <BookingInterface 
            faculty={selectedFaculty}
            schedules={schedules}
            appointments={appointments}
            studentId={currentUser.id || currentUser._id}
            onClose={() => setSelectedFaculty(null)}
            onBook={handleBook}
        />

        {/* 5. SUCCESS MODAL */}
        <Modal 
            isOpen={showSuccessModal}
            title="Request Sent Successfully!"
            message={`Your appointment request for ${selectedFaculty.name} has been sent. Wait for approval.`}
            type="success"
            confirmText="Okay, Got it"
            onConfirm={handleCloseSuccess}
            onClose={handleCloseSuccess}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* ... (Search Header & Grid UI remains same) ... */}
      
      <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
        <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Find Faculty</h2>
            <p className="text-indigo-200 mb-6 text-sm">Search by name, department, or filter by school.</p>
            
            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-3.5 w-5 h-5 text-indigo-300" />
                    <input 
                        type="text" 
                        placeholder="Search faculty..." 
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-indigo-200 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all backdrop-blur-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative md:w-1/3">
                    <Filter className="absolute left-4 top-3.5 w-5 h-5 text-indigo-300" />
                    <select 
                        className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white focus:bg-white/20 focus:outline-none appearance-none cursor-pointer font-medium backdrop-blur-md"
                        value={selectedSchool}
                        onChange={(e) => setSelectedSchool(e.target.value)}
                    >
                        <option value="" className="text-slate-800">All Schools</option>
                        {schoolOptions.map(school => (
                            <option key={school} value={school} className="text-slate-800">{school}</option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-5 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-indigo-200 pointer-events-none"></div>
                </div>
            </div>
        </div>
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFaculty.map(faculty => (
           <div key={faculty.id || faculty._id} onClick={() => setSelectedFaculty(faculty)} className="group bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex items-center gap-4">
               <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform duration-300 border-2 border-white">
                  {faculty.avatar || '👨‍🏫'}
               </div>
               <div className="flex-1">
                  <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{faculty.name}</h3>
                  <p className="text-xs font-bold text-indigo-500 uppercase tracking-wide mb-1 line-clamp-1">{faculty.school || faculty.department || 'Faculty'}</p>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                     <MapPin className="w-3 h-3" /> {faculty.staffRoom || 'Staff Room'}
                  </p>
               </div>
               <div className="bg-slate-50 p-2 rounded-full text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                   <ChevronRight className="w-5 h-5" />
               </div>
           </div>
        ))}
      </div>
    </div>
  );
};

export default FacultyDirectory;