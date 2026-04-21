import React, { useState } from 'react';
import Layout from './components/Layout';
import { Building, Bed, Users, AlertTriangle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Design mockup data
const STATIC_DATA = {
  summary: {
    totalClinics: 5,
    totalBeds: 225,
    occupiedBeds: 193,
    totalStaff: 108,
    activeStaff: 97
  },
  clinics: [
    {
      name: "City Central Clinic",
      type: "Urban",
      beds: { occupied: 46, total: 50 },
      staff: { active: 22, total: 24 },
      medicineStock: 85,
      dailyPatients: 120
    },
    {
      name: "Greenfield Rural Health",
      type: "Rural",
      beds: { occupied: 12, total: 20 },
      staff: { active: 7, total: 8 },
      medicineStock: 60,
      dailyPatients: 45
    },
    {
      name: "Westside Medical Center",
      type: "Urban",
      beds: { occupied: 72, total: 80 },
      staff: { active: 35, total: 40 },
      medicineStock: 72,
      dailyPatients: 200
    },
    {
      name: "Lakeside Community Clinic",
      type: "Rural",
      beds: { occupied: 8, total: 15 },
      staff: { active: 5, total: 6 },
      medicineStock: 90,
      dailyPatients: 30
    },
    {
      name: "Metro Diagnostic Hub",
      type: "Urban",
      beds: { occupied: 55, total: 60 },
      staff: { active: 28, total: 30 },
      medicineStock: 45,
      dailyPatients: 180
    }
  ]
};

// Sub-components
function SummaryCard({ title, value, subtitle, icon: Icon, colorClass, highlightValue = false }: any) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-start justify-between shadow-sm">
      <div className="space-y-1">
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <div className="flex items-baseline gap-2">
           <h3 className={cn("text-2xl font-bold", highlightValue ? "text-amber-500" : "text-slate-800")}>{value}</h3>
        </div>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
      <div className={cn("p-2.5 rounded-lg bg-slate-50 border border-slate-100", colorClass)}>
        <Icon size={20} className="currentColor" />
      </div>
    </div>
  );
}

function ProgressBar({ label, current, total, percentage, isRed, icon: Icon }: any) {
  return (
    <div className="space-y-1.5 mb-4">
      <div className="flex justify-between text-xs font-semibold text-slate-500">
        <div className="flex items-center gap-1.5">
          <Icon size={14} className="text-slate-400" />
          {label}
        </div>
        <span className={cn(isRed ? "text-red-500" : "text-slate-800")}>
          {current !== undefined && total !== undefined ? `${current}/${total}` : `${percentage}%`}
        </span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2">
        <div 
          className={cn("h-2 rounded-full", isRed ? "bg-red-500" : "bg-blue-600")} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

function ClinicCard({ clinic }: { clinic: typeof STATIC_DATA['clinics'][0] }) {
  const capacityPct = Math.round((clinic.beds.occupied / clinic.beds.total) * 100);
  const isOverloaded = capacityPct > 85;
  const staffPct = Math.round((clinic.staff.active / clinic.staff.total) * 100);
  const isMedLow = clinic.medicineStock < 50;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-base font-bold text-slate-800">{clinic.name}</h3>
          <span className={cn(
            "inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider",
            clinic.type === "Urban" ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
          )}>
            {clinic.type}
          </span>
        </div>
        {isOverloaded && (
          <span className="px-2 py-1 bg-red-50 text-red-600 text-[10px] uppercase font-bold rounded-md tracking-wider">
            Overloaded
          </span>
        )}
      </div>

      <div className="mt-4 flex-1">
        <ProgressBar 
          label="Bed Occupancy" 
          current={clinic.beds.occupied} 
          total={clinic.beds.total} 
          percentage={capacityPct}
          isRed={isOverloaded}
          icon={Bed}
        />
        <ProgressBar 
          label="Staff Active" 
          current={clinic.staff.active} 
          total={clinic.staff.total} 
          percentage={staffPct}
          isRed={false}
          icon={Users}
        />
        <ProgressBar 
          label="Medicine Stock" 
          percentage={clinic.medicineStock}
          isRed={isMedLow}
          icon={Building} // Placeholder icon for med
        />
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
        <span className="text-slate-500 font-medium">Daily Patients: <span className="text-slate-800 font-bold">{clinic.dailyPatients}</span></span>
        <span className="text-slate-500 font-medium">Capacity: <span className={cn("font-bold", isOverloaded ? "text-red-500" : "text-slate-800")}>{capacityPct}%</span></span>
      </div>
    </div>
  );
}

export default function ClinicInsights() {
  const [data] = useState(STATIC_DATA);

  const overloadedCount = data.clinics.filter(c => (c.beds.occupied / c.beds.total) * 100 > 85).length;

  return (
    <Layout activePath="#/clinics">
      <div className="p-8 pb-24 max-w-[1400px] mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Building className="text-purple-500 shrink-0" size={26} /> 
            Clinic-Level Insights
          </h2>
          <p className="text-sm text-slate-500 mt-1 ml-[34px]">Patient load, resource usage, and capacity monitoring</p>
        </div>

        {/* Summary Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <SummaryCard 
            title="Total Clinics" 
            value={data.summary.totalClinics} 
            icon={Building} 
            colorClass="text-blue-500" 
          />
          <SummaryCard 
            title="Total Beds" 
            value={data.summary.totalBeds} 
            subtitle={`${data.summary.occupiedBeds} occupied`} 
            icon={Bed} 
            colorClass="text-indigo-500" 
          />
          <SummaryCard 
            title="Total Staff" 
            value={data.summary.totalStaff} 
            subtitle={`${data.summary.activeStaff} active`} 
            icon={Users} 
            colorClass="text-emerald-500" 
          />
          <SummaryCard 
            title="Over 85% Capacity" 
            value={overloadedCount} 
            icon={AlertTriangle} 
            colorClass="text-amber-500 bg-amber-50" 
            highlightValue={true}
          />
        </div>

        {/* Clinic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.clinics.map((clinic, idx) => (
             <ClinicCard key={idx} clinic={clinic} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
