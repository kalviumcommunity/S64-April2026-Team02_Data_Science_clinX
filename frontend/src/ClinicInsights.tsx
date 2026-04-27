import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import { Building, Bed, Users, AlertTriangle, Sparkles, MapPin } from 'lucide-react';
import { getInsights } from './services/api';
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
  const [staticData] = useState(STATIC_DATA);
  const [realInsights, setRealInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRealInsights = async () => {
      try {
        const data = await getInsights();
        setRealInsights(data);
      } catch (err) {
        console.error("Error fetching real insights:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRealInsights();
  }, []);

  const overloadedCount = staticData.clinics.filter(c => (c.beds.occupied / c.beds.total) * 100 > 85).length;
  const hospitalData = realInsights?.hospital_infrastructure;

  if (loading) return (
    <Layout activePath="/clinics">
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    </Layout>
  );

  return (
    <Layout activePath="/clinics">
      <div className="p-8 pb-24 max-w-[1400px] mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Building className="text-purple-500 shrink-0" size={26} /> 
            Health Infrastructure Insights
          </h2>
          <p className="text-sm text-slate-500 mt-1 ml-[34px]">Real-time national stats & local capacity monitoring</p>
        </div>

        {/* SECTION 1: REAL NATIONAL DATA */}
        {hospitalData && (
          <section className="space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <Sparkles className="text-amber-500" size={18} />
              <h3 className="text-lg font-bold text-slate-700">National Infrastructure (Actual Data)</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Rural vs Urban Beds */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h4 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">Bed Distribution</h4>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600">Urban Beds</span>
                      <span className="font-bold text-slate-800">{hospitalData.rural_vs_urban_beds.total_urban_beds.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-500 h-full" 
                        style={{ width: `${(hospitalData.rural_vs_urban_beds.total_urban_beds / (hospitalData.rural_vs_urban_beds.total_urban_beds + hospitalData.rural_vs_urban_beds.total_rural_beds)) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600">Rural Beds</span>
                      <span className="font-bold text-slate-800">{hospitalData.rural_vs_urban_beds.total_rural_beds.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full" 
                        style={{ width: `${(hospitalData.rural_vs_urban_beds.total_rural_beds / (hospitalData.rural_vs_urban_beds.total_urban_beds + hospitalData.rural_vs_urban_beds.total_rural_beds)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Facility Types */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm lg:col-span-2">
                <h4 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">Government Facility Network</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'PHC', value: hospitalData.facility_types.PHC, desc: 'Primary Health Centers', color: 'text-blue-600' },
                    { label: 'CHC', value: hospitalData.facility_types.CHC, desc: 'Comm. Health Centers', color: 'text-indigo-600' },
                    { label: 'SDH', value: hospitalData.facility_types.SDH, desc: 'Sub-District Hospitals', color: 'text-purple-600' },
                    { label: 'DH', value: hospitalData.facility_types.DH, desc: 'District Hospitals', color: 'text-rose-600' },
                  ].map((f, i) => (
                    <div key={i} className="p-4 rounded-lg bg-slate-50 border border-slate-100 text-center">
                      <p className={cn("text-xl font-bold", f.color)}>{f.value.toLocaleString()}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{f.label}</p>
                      <p className="text-[9px] text-slate-500 leading-tight mt-1">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top States */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h4 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">Top States by Total Bed Capacity</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {hospitalData.top_states_by_beds.slice(0, 5).map((state: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                    <div className="h-8 w-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-400">
                      #{i + 1}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 truncate max-w-[120px]">{state['State/UT']}</p>
                      <p className="text-[10px] text-slate-500">{state.Total_Beds.toLocaleString()} Beds</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SECTION 2: SIMULATED LOCAL CLINICS */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <MapPin className="text-blue-500" size={18} />
            <h3 className="text-lg font-bold text-slate-700">Simulated Regional Clinics</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SummaryCard 
              title="Total Clinics" 
              value={staticData.summary.totalClinics} 
              icon={Building} 
              colorClass="text-blue-500" 
            />
            <SummaryCard 
              title="Local Beds" 
              value={staticData.summary.totalBeds} 
              subtitle={`${staticData.summary.occupiedBeds} occupied`} 
              icon={Bed} 
              colorClass="text-indigo-500" 
            />
            <SummaryCard 
              title="Total Staff" 
              value={staticData.summary.totalStaff} 
              subtitle={`${staticData.summary.activeStaff} active`} 
              icon={Users} 
              colorClass="text-emerald-500" 
            />
            <SummaryCard 
              title="Over Capacity" 
              value={overloadedCount} 
              icon={AlertTriangle} 
              colorClass="text-amber-500 bg-amber-50" 
              highlightValue={true}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staticData.clinics.map((clinic, idx) => (
               <ClinicCard key={idx} clinic={clinic} />
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}

