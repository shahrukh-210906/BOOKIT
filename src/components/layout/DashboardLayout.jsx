import React from 'react';
import { LogOut } from 'lucide-react';

const DashboardLayout = ({ 
  children,       
  user,           
  title,          
  themeColor,     
  tabs,           
  activeTab,      
  setActiveTab,
  onLogout 
}) => {
  
  // Dynamic color classes
  const colors = themeColor === 'indigo' 
    ? { bg: 'bg-indigo-50', text: 'text-indigo-900', light: 'bg-indigo-100', accent: 'text-indigo-600', badge: 'bg-red-500' }
    : { bg: 'bg-emerald-50', text: 'text-emerald-900', light: 'bg-emerald-100', accent: 'text-emerald-600', badge: 'bg-red-500' };

  return (
    <div className="min-h-screen bg-slate-50 pb-32 md:pb-24 flex flex-col">
      
      {/* --- TOP NAVBAR --- */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-40">
          <h1 className={`text-xl font-bold ${colors.text} flex items-center gap-2`}>
              <span className="text-2xl">🎓</span> BookIt 
              <span className={`text-xs ${colors.light} ${colors.accent} px-2 py-1 rounded-md`}>{title}</span>
          </h1>
          
          <div className="flex items-center gap-4">
              <button onClick={onLogout} className="hidden sm:flex text-xs font-bold text-red-400 hover:text-red-600 items-center gap-1 transition-colors">
                  <LogOut className="w-4 h-4" /> Logout
              </button>
              <div className={`w-10 h-10 ${colors.light} rounded-full flex items-center justify-center text-lg shadow-inner cursor-pointer hover:ring-2 ring-offset-2 ring-${themeColor}-200 transition-all`} onClick={() => setActiveTab('profile')}>
                  {user.avatar || '👤'}
              </div>
          </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8 animate-in fade-in">
          {children}
      </main>

      {/* --- FLOATING NAVIGATION DOCK (Visible on ALL Screens) --- */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-auto">
          <div className="bg-white/90 backdrop-blur-2xl border border-slate-200/60 shadow-2xl shadow-slate-300/50 rounded-full px-2 py-2 flex items-center gap-1 sm:gap-2">
              {tabs.map(tab => {
                  const isActive = activeTab === tab.id;
                  return (
                      <button 
                          key={tab.id} 
                          onClick={() => setActiveTab(tab.id)} 
                          className={`relative group p-3 sm:px-5 sm:py-3 rounded-full transition-all duration-300 ease-out flex items-center gap-2
                          ${isActive 
                              ? `${colors.accent} ${colors.bg} shadow-sm ring-1 ring-inset ring-black/5 translate-y-[-2px]` 
                              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                          }`}
                      >
                          <tab.icon className={`w-6 h-6 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                          
                          {/* Label (Hidden on small mobile, visible on tablet/desktop or when active) */}
                          <span className={`text-xs font-bold uppercase tracking-wider hidden sm:block ${isActive ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0 overflow-hidden group-hover:max-w-xs group-hover:opacity-100 transition-all duration-300'}`}>
                              {tab.label}
                          </span>

                          {/* Notification Badge */}
                          {tab.count > 0 && (
                              <span className={`absolute top-2 right-2 sm:top-1 sm:right-1 w-3 h-3 sm:w-4 sm:h-4 ${colors.badge} text-white text-[9px] flex items-center justify-center rounded-full border-2 border-white shadow-sm`}>
                                  {tab.count}
                              </span>
                          )}
                      </button>
                  );
              })}
          </div>
      </div>

    </div>
  );
};

export default DashboardLayout;