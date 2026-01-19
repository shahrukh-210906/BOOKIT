import React, { useState } from 'react';
import { Search, MapPin, ArrowLeft, Filter } from 'lucide-react';
import FacultyTimetable from './FacultyTimetable';

const FacultySearch = ({ users, schedules, appointments }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState(''); // New Filter State
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const schoolOptions = [
    "School of Technology",
    "School of Business",
    "School of Arts & Design",
    "School of Architecture & Planning",
    "School of Liberal Arts & Humanities",
    "School of Law",
    "School of Sciences"
  ];

  // Enhanced Filter Logic
  const facultyList = users.filter(u => {
      const isFaculty = u.role === 'faculty';
      const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (u.department && u.department.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesSchool = selectedSchool === '' || u.school === selectedSchool;

      return isFaculty && matchesSearch && matchesSchool;
  });

  if (selectedFaculty) {
    return (
      <div className="animate-in slide-in-from-right duration-300">
        <button onClick={() => setSelectedFaculty(null)} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-6 font-bold transition-colors">
            <ArrowLeft className="w-5 h-5" /> Back to Search
        </button>
        <FacultyTimetable 
            schedules={schedules} 
            setSchedules={() => {}} 
            currentUser={selectedFaculty} 
            appointments={appointments}
            readOnly={true} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-lg">
         <h2 className="text-2xl font-bold mb-4">Faculty Directory</h2>
         
         <div className="flex flex-col md:flex-row gap-4">
             {/* Text Search */}
             <div className="relative flex-1">
                 <Search className="absolute left-4 top-3.5 w-5 h-5 text-indigo-300" />
                 <input 
                     type="text" 
                     placeholder="Search by name or department..." 
                     className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-indigo-200 outline-none focus:bg-white/30 transition-all"
                     value={searchTerm}
                     onChange={e => setSearchTerm(e.target.value)}
                 />
             </div>

             {/* School Filter Dropdown */}
             <div className="relative md:w-1/3">
                 <Filter className="absolute left-4 top-3.5 w-5 h-5 text-indigo-300" />
                 <select 
                    className="w-full pl-12 pr-10 py-3 rounded-xl bg-white/20 border border-white/30 text-white outline-none focus:bg-white/30 appearance-none cursor-pointer font-medium"
                    value={selectedSchool}
                    onChange={(e) => setSelectedSchool(e.target.value)}
                 >
                    <option value="" className="text-slate-800">All Schools</option>
                    {schoolOptions.map(school => (
                        <option key={school} value={school} className="text-slate-800">{school}</option>
                    ))}
                 </select>
                 <div className="absolute right-4 top-4 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-indigo-200 pointer-events-none"></div>
             </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {facultyList.length === 0 ? (
              <div className="col-span-full text-center py-10 text-slate-400">No faculty members match your filters.</div>
          ) : (
              facultyList.map(faculty => (
                <div key={faculty.id || faculty._id} onClick={() => setSelectedFaculty(faculty)} className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all cursor-pointer flex items-center gap-4 group">
                    <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        {faculty.avatar || '👨‍🏫'}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 group-hover:text-indigo-600">{faculty.name}</h3>
                        <p className="text-xs font-bold text-indigo-500 uppercase">{faculty.school || faculty.department || 'Faculty'}</p>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> {faculty.staffRoom || 'Staff Room'}</p>
                    </div>
                </div>
              ))
          )}
      </div>
    </div>
  );
};

export default FacultySearch;