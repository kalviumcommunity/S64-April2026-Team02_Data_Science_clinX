import React, { useState } from 'react';
import { Activity, BarChart3, Building, FileText, Bell, AlertTriangle, LayoutTemplate } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activePath?: string;
}

export default function Layout({ children, activePath = '#/' }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 font-sans overflow-hidden">
      
      {/* Left Sidebar */}
      <aside className={`flex-shrink-0 border-r border-slate-200 bg-white flex flex-col z-10 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-[240px]' : 'w-[72px]'}`}>
        
        <div className={`py-6 flex items-center overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'px-6 gap-3' : 'px-0 justify-center'}`}>
          <div className="bg-blue-600 text-white p-2 rounded-lg shadow-sm shrink-0">
            <Activity size={22} className="stroke-[2.5]" />
          </div>
          {isSidebarOpen && (
            <div className="whitespace-nowrap transition-opacity">
              <h1 className="font-bold text-slate-800 text-[15px] leading-tight">ClinX Sentinel</h1>
              <p className="text-[11px] text-slate-500 font-medium tracking-wide">Clinic Diagnosis Support</p>
            </div>
          )}
        </div>
        
        <div className={`py-4 flex-1 transition-all duration-300 ${isSidebarOpen ? 'px-4' : 'px-3'}`}>
          {isSidebarOpen ? (
            <p className="text-[11px] text-slate-400 mb-4 px-3 uppercase tracking-wider font-semibold whitespace-nowrap">Navigation</p>
          ) : (
            <div className="h-4 mb-4"></div>
          )}
          
          <nav className="space-y-2">
            <a 
              href="#/" 
              title="Dashboard"
              className={`flex items-center rounded-lg transition-colors text-sm overflow-hidden whitespace-nowrap ${
                activePath === '#/' 
                  ? 'bg-[#f0f6ff] text-blue-700 font-semibold' 
                  : 'text-slate-600 hover:bg-slate-50 font-medium'
              } ${isSidebarOpen ? 'px-3 py-2.5 gap-3' : 'py-3 justify-center'}`}
            >
              <Activity size={18} className={`shrink-0 ${activePath === '#/' ? "text-blue-600" : "text-slate-400"}`} />
              {isSidebarOpen && <span>Dashboard</span>}
            </a>
            
            <a 
              href="#/diagnosis" 
              title="Diagnosis & Trends"
              className={`flex items-center rounded-lg transition-colors text-sm overflow-hidden whitespace-nowrap ${
                activePath === '#/diagnosis' 
                  ? 'bg-[#f0f6ff] text-blue-700 font-semibold' 
                  : 'text-slate-600 hover:bg-slate-50 font-medium'
              } ${isSidebarOpen ? 'px-3 py-2.5 gap-3' : 'py-3 justify-center'}`}
            >
              <BarChart3 size={18} className={`shrink-0 ${activePath === '#/diagnosis' ? "text-blue-600" : "text-slate-400"}`} />
              {isSidebarOpen && <span>Diagnosis & Trends</span>}
            </a>
            
            <a 
              href="#/clinics" 
              title="Clinic Insights"
              className={`flex items-center rounded-lg transition-colors text-sm overflow-hidden whitespace-nowrap ${
                activePath === '#/clinics' 
                  ? 'bg-[#f0f6ff] text-blue-700 font-semibold' 
                  : 'text-slate-600 hover:bg-slate-50 font-medium'
              } ${isSidebarOpen ? 'px-3 py-2.5 gap-3' : 'py-3 justify-center'}`}
            >
              <Building size={18} className={`shrink-0 ${activePath === '#/clinics' ? "text-blue-600" : "text-slate-400"}`} />
              {isSidebarOpen && <span>Clinic Insights</span>}
            </a>
            
            <a 
              href="#" 
              title="Reports"
              className={`flex items-center rounded-lg transition-colors text-sm overflow-hidden whitespace-nowrap text-slate-600 hover:bg-slate-50 font-medium ${isSidebarOpen ? 'px-3 py-2.5 gap-3' : 'py-3 justify-center'}`}
            >
              <FileText size={18} className="shrink-0 text-slate-400" />
              {isSidebarOpen && <span>Reports</span>}
            </a>
          </nav>
        </div>
      </aside>

      {/* Main Content Area wrapper */}
      <main className="flex-1 flex flex-col h-full bg-transparent relative overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 flex-shrink-0 z-10 w-full transition-all duration-300">
          <div>
            <LayoutTemplate onClick={() => setIsSidebarOpen(!isSidebarOpen)} size={20} className="text-slate-400 cursor-pointer hover:text-slate-600 transition-colors" />
          </div>
          <div className="flex items-center gap-5">
            {activePath === '#/diagnosis' && (
              <div className="flex items-center gap-2 bg-[#fffbeb] border border-[#fde68a] text-amber-700 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm">
                <AlertTriangle size={14} className="text-amber-500" />
                2 symptom clusters need review
              </div>
            )}
            <div className="relative cursor-pointer group">
              <div className="p-2 rounded-full group-hover:bg-slate-100 transition-colors">
                <Bell size={20} className="text-slate-500 group-hover:text-slate-700" />
              </div>
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white box-content shadow-sm">2</span>
            </div>
          </div>
        </header>

        {/* Scrollable Children Content */}
        <div className="flex-1 overflow-auto relative w-full h-full">
          {children}
        </div>
        
      </main>
    </div>
  );
}
