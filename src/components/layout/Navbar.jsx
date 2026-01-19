import React from 'react';
import { Calendar, LogOut, Bell, User, ChevronDown } from 'lucide-react';

const Navbar = ({ title, subtitle, user, onLogout, notifications = [], activeTab, setActiveTab }) => {
  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60 supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-200"></div>
                <div className="relative bg-white p-2 rounded-lg shadow-sm">
                    <Calendar className="w-6 h-6 text-indigo-600" />
                </div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 tracking-tight leading-none">{title}</h1>
              {subtitle && <p className="text-xs text-slate-500 font-medium mt-0.5">{subtitle}</p>}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {setActiveTab && (
              <button 
                onClick={() => setActiveTab('notifications')}
                className={`relative p-2.5 rounded-full transition-all duration-200 ${activeTab === 'notifications' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-2 right-2.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
                )}
              </button>
            )}
            
            <div className="h-6 w-px bg-slate-200 mx-2"></div>

            <div className="flex items-center gap-3 group cursor-pointer" title="View Profile">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-700 leading-tight">{user?.name}</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{user?.role}</p>
              </div>
              <div className="h-10 w-10 bg-gradient-to-br from-indigo-50 to-slate-100 rounded-full flex items-center justify-center text-lg border border-white shadow-sm ring-2 ring-transparent group-hover:ring-indigo-100 transition-all">
                {user?.avatar || <User className="w-5 h-5 text-indigo-300"/>}
              </div>
              <button 
                onClick={onLogout} 
                className="ml-2 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;