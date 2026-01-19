import React from 'react';
import { Users, CheckCircle, Bell, LayoutDashboard } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'directory', label: 'Faculty Directory', icon: <Users className="w-5 h-5" /> },
    { id: 'appointments', label: 'My Appointments', icon: <CheckCircle className="w-5 h-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
  ];

  return (
    <div className="w-full md:w-64 flex-shrink-0 bg-white rounded-2xl shadow-sm border border-slate-200 p-4 h-fit">
      <div className="mb-4 px-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Menu</h3>
      </div>
      <div className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span className={`${activeTab === item.id ? 'text-indigo-600' : 'text-slate-400'}`}>
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;