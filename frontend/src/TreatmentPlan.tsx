import React, { useState } from 'react';
import { 
  Activity, AlertTriangle, ShieldAlert, HeartPulse, Thermometer,
  Clock, Stethoscope, Shield, Pill, ArrowRight, Users, CheckCircle, Bell, ArrowLeft, Beaker
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Layout from './components/Layout';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ---------------------------------------------------------
// DUMMY DATABASE
// ---------------------------------------------------------
const diseaseDatabase: Record<string, any> = {
  Influenza: {
    description: "A highly contagious viral infection that attacks the respiratory system — nose, throat, and lungs.",
    cause: "Influenza viruses (A, B, C)",
    type: "Acute",
    contagious: true,
    recoveryTime: "5 to 14 days",
    ageGroups: {
      "0-18": {
        symptoms: [
          { name: "High Fever", severity: "Severe" },
          { name: "Cough", severity: "Moderate" },
          { name: "Runny Nose", severity: "Mild" },
          { name: "Fatigue", severity: "Moderate" }
        ],
        stages: {
          Early: { intensity: "Mild to Moderate", risk: "Low", complications: "Dehydration, minor ear infections" },
          Moderate: { intensity: "High", risk: "Moderate", complications: "Bronchitis, sinus infections" },
          Severe: { intensity: "Severe", risk: "High", complications: "Pneumonia, respiratory failure" }
        },
        treatment: {
          medication: [
            { name: "Paracetamol", dosage: "Based on weight", duration: "3-5 days" },
            { name: "Oseltamivir", dosage: "30-75mg based on weight limit", duration: "5 days" }
          ],
          surgery: [],
          procedures: ["Oral rehydration therapy", "Nasal suction (for infants)"]
        },
        recovery: { mild: "3-5 days", moderate: "7-10 days", severe: "2-3 weeks" },
        rest: "3-7 days with limited physical activity. No school until 24hrs fever-free.",
        tests: ["Rapid Influenza Diagnostic Test (RIDT)", "Viral Culture"],
        precautions: ["Ensure hydration", "Monitor fever closely", "Avoid aspirin (risk of Reye's syndrome)"],
        alerts: ["Fast breathing or trouble breathing", "Bluish lips or face", "Not drinking enough fluids", "Severe muscle pain"]
      },
      "18-40": {
        symptoms: [
          { name: "Fever/Chills", severity: "Moderate" },
          { name: "Body Aches", severity: "Severe" },
          { name: "Fatigue", severity: "Severe" },
          { name: "Headache", severity: "Moderate" }
        ],
        stages: {
          Early: { intensity: "Mild", risk: "Low", complications: "Rare in healthy adults" },
          Moderate: { intensity: "Moderate to High", risk: "Low", complications: "Sinus and ear infections" },
          Severe: { intensity: "Severe", risk: "Moderate", complications: "Pneumonia, myocarditis" }
        },
        treatment: {
          medication: [
            { name: "Ibuprofen/Acetaminophen", dosage: "400mg/500mg every 6-8 hrs", duration: "As needed" },
            { name: "Antivirals (Oseltamivir)", dosage: "75mg twice daily", duration: "5 days" }
          ],
          surgery: [],
          procedures: []
        },
        recovery: { mild: "5-7 days", moderate: "1-2 weeks", severe: "2-4 weeks" },
        rest: "5-7 days of rest. Avoid strenuous workouts.",
        tests: ["Flu test (if severe)"],
        precautions: ["Stay home to prevent spread", "Cover coughs and sneezes", "Frequent handwashing"],
        alerts: ["Difficulty breathing or shortness of breath", "Pain or pressure in the chest or abdomen", "Sudden dizziness", "Confusion"]
      },
      "40+": {
        symptoms: [
          { name: "Fever", severity: "Moderate" },
          { name: "Severe Fatigue", severity: "Severe" },
          { name: "Cough", severity: "Moderate" },
          { name: "Shortness of Breath", severity: "Severe" }
        ],
        stages: {
          Early: { intensity: "Moderate", risk: "Moderate", complications: "Worsening of chronic medical conditions" },
          Moderate: { intensity: "High", risk: "High", complications: "Pneumonia, bronchitis" },
          Severe: { intensity: "Severe", risk: "Critical", complications: "ARDS, multi-organ failure" }
        },
        treatment: {
          medication: [
            { name: "Antivirals (Oseltamivir)", dosage: "75mg twice daily", duration: "5 days" },
            { name: "Antibiotics (if secondary bacterial infection)", dosage: "As prescribed", duration: "5-10 days" }
          ],
          surgery: [],
          procedures: ["Oxygen therapy (if SpO2 drops)", "IV Fluids"]
        },
        recovery: { mild: "1-2 weeks", moderate: "2-3 weeks", severe: "1+ months" },
        rest: "Strict bed rest for 7-10 days.",
        tests: ["CBC", "Chest X-ray", "Pulse Oximetry", "Comprehensive Metabolic Panel"],
        precautions: ["Monitor for secondary infections", "Manage existing chronic conditions carefully", "Ensure proper nutrition"],
        alerts: ["Severe shortness of breath", "Persistent chest pain", "Worsening of chronic conditions", "Severe weakness or unsteadiness"]
      }
    },
    global: {
      preventiveMeasures: [
        "Annual influenza vaccination",
        "Maintain good hand hygiene and use sanitizers",
        "Avoid close contact with sick individuals"
      ],
      followUpPlan: {
        timeline: "Checkup 1-2 weeks post symptom resolution, mostly if symptoms linger or complications suspected.",
        repeatTests: ["Chest X-ray if persistent cough", "Lung function test"]
      }
    }
  }
};

type AgeGroup = "0-18" | "18-40" | "40+";

interface TreatmentPlanProps {
  diseaseName: string;
}

export default function TreatmentPlan({ diseaseName }: TreatmentPlanProps) {
  const [activeSegment, setActiveSegment] = useState<AgeGroup>('18-40');
  
  // Find disease case or default to Influenza
  const key = Object.keys(diseaseDatabase).find(k => k.toLowerCase() === diseaseName.toLowerCase()) || "Influenza";
  const data = diseaseDatabase[key];
  const activeData = data.ageGroups[activeSegment];

  return (
    <Layout activePath={`#/treatment/${diseaseName}`}>
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        
        {/* Navigation & Header */}
        <div>
          <a href="#/diagnosis" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors mb-4 group">
            <ArrowLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Diagnosis
          </a>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
                {key} <span className="font-light text-slate-400">|</span> Treatment Plan
              </h1>
              <p className="text-slate-500 mt-1.5 text-sm lg:text-base max-w-2xl">
                Comprehensive clinical guidance and prescriptive protocols based on age segmentation and disease staging.
              </p>
            </div>
            {data.contagious && (
               <span className="px-3 py-1.5 rounded-full bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-widest border border-rose-100 flex items-center gap-1.5 shadow-sm">
                 <ShieldAlert size={14} className="animate-pulse" /> Highly Contagious
               </span>
            )}
          </div>
        </div>

        {/* 2. Disease Overview */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-1 space-y-4">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
               <Activity size={16} className="text-blue-500" />
               Disease Overview
            </h2>
            <p className="text-slate-700 leading-relaxed text-[15px]">
              {data.description}
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
               <div className="bg-slate-50 border border-slate-100 rounded-lg px-4 py-2 flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Primary Cause</span>
                  <span className="text-sm font-medium text-slate-700">{data.cause}</span>
               </div>
               <div className="bg-slate-50 border border-slate-100 rounded-lg px-4 py-2 flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Nature</span>
                  <span className="text-sm font-medium text-slate-700">{data.type}</span>
               </div>
               <div className="bg-slate-50 border border-slate-100 rounded-lg px-4 py-2 flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Avg. Recovery</span>
                  <span className="text-sm font-medium text-slate-700">{data.recoveryTime}</span>
               </div>
            </div>
          </div>
        </div>

        {/* 3. Age Group Segmentation Tabs */}
        <div className="bg-slate-100/50 p-1.5 rounded-xl flex items-center shadow-inner border border-slate-200/50">
          {(["0-18", "18-40", "40+"] as AgeGroup[]).map((tab) => (
             <button
                key={tab}
                onClick={() => setActiveSegment(tab)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200",
                  activeSegment === tab 
                    ? "bg-white text-blue-700 shadow border border-slate-200/60 ring-1 ring-black/5" 
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                )}
             >
                <Users size={18} className={activeSegment === tab ? "text-blue-500" : "text-slate-400"} />
                {tab === "0-18" ? "Infant to 18 yrs" : tab === "18-40" ? "18 to 40 yrs" : "40+ (Senior)"}
             </button>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500 ease-in-out">
          
          {/* Main Left Column */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* Disease Stages */}
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
               <div className="border-b border-slate-100 px-6 py-4 bg-slate-50/50 flex justify-between items-center">
                 <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                   <Thermometer className="text-rose-500" size={18} /> Disease Progression Stages
                 </h2>
               </div>
               <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {Object.entries(activeData.stages).map(([stage, details]: [string, any], i) => (
                    <div key={stage} className={cn(
                      "p-4 rounded-xl border relative overflow-hidden group",
                      i === 0 ? "border-green-200 bg-green-50/30" : i === 1 ? "border-amber-200 bg-amber-50/30" : "border-rose-200 bg-rose-50/30"
                    )}>
                      <div className="flex justify-between items-start mb-3">
                        <h3 className={cn(
                          "font-bold text-sm",
                          i === 0 ? "text-green-700" : i === 1 ? "text-amber-700" : "text-rose-700"
                        )}>{stage} Stage</h3>
                        <span className={cn(
                          "text-[10px] uppercase font-bold px-2 py-0.5 rounded-full",
                          i === 0 ? "bg-green-100 text-green-700" : i === 1 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"
                        )}>Risk: {details.risk}</span>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Intensity</p>
                          <p className="text-sm font-medium text-slate-700">{details.intensity}</p>
                        </div>
                        <div>
                           <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Complications</p>
                           <p className="text-xs text-slate-600 font-medium leading-relaxed">{details.complications}</p>
                        </div>
                      </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Treatment Approach */}
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <div className="border-b border-slate-100 px-6 py-4 bg-slate-50/50">
                  <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                    <Pill className="text-indigo-500" size={18} /> Prescribed Treatment Approach
                  </h2>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Medication */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-1.5"><HeartPulse size={16} className="text-slate-400"/> Primary Medication</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                       {activeData.treatment.medication.map((med: any, idx: number) => (
                         <div key={idx} className="flex flex-col p-3 rounded-lg border border-slate-100 bg-slate-50 gap-1.5">
                            <span className="font-semibold text-slate-800 text-sm">{med.name}</span>
                            <div className="flex justify-between items-center text-xs text-slate-500">
                               <span>Dosage: <span className="font-medium text-slate-700">{med.dosage}</span></span>
                               <span className="bg-white px-2 py-0.5 rounded shadow-sm border border-slate-100">{med.duration}</span>
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>

                  {/* Procedures if any */}
                  {activeData.treatment.procedures.length > 0 && (
                     <div>
                       <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-1.5"><Stethoscope size={16} className="text-slate-400"/> Other Clinical Procedures</h3>
                       <div className="flex flex-wrap gap-2">
                         {activeData.treatment.procedures.map((proc: string, idx: number) => (
                           <span key={idx} className="bg-indigo-50 text-indigo-700 text-xs px-3 py-1.5 rounded-full font-medium border border-indigo-100">{proc}</span>
                         ))}
                       </div>
                     </div>
                  )}
                </div>
            </div>

            {/* Rest & Recovery Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                   <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2 mb-4">
                     <Clock className="text-sky-500" size={18} /> Recovery Timeline
                   </h2>
                   <div className="space-y-4">
                     {Object.entries(activeData.recovery).map(([level, time]: [string, any]) => (
                        <div key={level} className="flex justify-between items-center">
                          <span className="text-sm font-medium text-slate-600 capitalize">{level} Case</span>
                          <span className="text-sm font-bold text-slate-800 bg-slate-50 px-2 py-1 rounded border border-slate-100">{time}</span>
                        </div>
                     ))}
                   </div>
               </div>

               <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                   <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2 mb-4">
                     <AlertTriangle className="text-amber-500" size={18} /> Bed Rest & Activity
                   </h2>
                   <div className="bg-amber-50 text-amber-800 p-4 rounded-xl border border-amber-100 text-sm leading-relaxed font-medium">
                      {activeData.rest}
                   </div>
               </div>
            </div>

          </div>

          {/* Right Column / Sidebar items */}
          <div className="space-y-6">
            
            {/* Symptoms */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="border-b border-slate-100 px-5 py-4 bg-slate-50/50">
                  <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                    <Activity className="text-violet-500" size={18} /> Common Symptoms
                  </h2>
                </div>
                <div className="p-0 divide-y divide-slate-100">
                  {activeData.symptoms.map((sym: any, i: number) => (
                    <div key={i} className="flex justify-between items-center p-4 hover:bg-slate-50 transition-colors">
                      <span className="text-sm font-medium text-slate-700">{sym.name}</span>
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full font-bold",
                        sym.severity === 'Severe' ? 'bg-rose-100 text-rose-700' :
                        sym.severity === 'Moderate' ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                      )}>{sym.severity}</span>
                    </div>
                  ))}
                </div>
            </div>

            {/* Diagnostic Tests */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
               <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2 mb-4">
                 <Beaker className="text-cyan-500" size={18} /> Required Diagnostics
               </h2>
               <ul className="space-y-2">
                 {activeData.tests.map((test: string, i: number) => (
                   <li key={i} className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                      <CheckCircle size={16} className="text-cyan-500 shrink-0 mt-0.5" />
                      {test}
                   </li>
                 ))}
               </ul>
            </div>

            {/* Alert Flags */}
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-5 shadow-sm">
               <h2 className="text-base font-bold text-rose-800 flex items-center gap-2 mb-3">
                 <Bell className="text-rose-600" size={18} /> Emergency Risk Alerts
               </h2>
               <p className="text-xs text-rose-600 font-semibold mb-3 uppercase tracking-wider">Seek immediate help if:</p>
               <ul className="space-y-2.5">
                 {activeData.alerts.map((alert: string, i: number) => (
                   <li key={i} className="flex items-start gap-2 text-sm text-rose-700 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-2"></div>
                      {alert}
                   </li>
                 ))}
               </ul>
            </div>
            
          </div>

        </div>

        {/* 5. Global Section */}
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="border-b border-slate-100 px-6 py-4 bg-slate-50/50">
              <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <Shield className="text-emerald-500" size={18} /> Global Preventive Measures & Follow-up
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
               <div>
                  <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">Preventive Measures</h3>
                  <ul className="space-y-3">
                    {data.global.preventiveMeasures.map((measure: string, i: number) => (
                      <li key={i} className="flex items-start gap-3">
                         <div className="bg-emerald-100 p-1 rounded">
                           <CheckCircle size={14} className="text-emerald-600" />
                         </div>
                         <span className="text-sm text-slate-600 font-medium">{measure}</span>
                      </li>
                    ))}
                  </ul>
               </div>
               
               <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                  <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">Follow-up Plan</h3>
                  <div className="space-y-4">
                     <div>
                       <p className="text-xs font-bold text-slate-400 mb-1">RECOMMENDED TIMELINE</p>
                       <p className="text-sm font-medium text-slate-700">{data.global.followUpPlan.timeline}</p>
                     </div>
                     {data.global.followUpPlan.repeatTests.length > 0 && (
                        <div>
                          <p className="text-xs font-bold text-slate-400 mb-1">REPEAT TESTS (IF NEEDED)</p>
                          <div className="flex flex-wrap gap-2">
                             {data.global.followUpPlan.repeatTests.map((test: string, i: number) => (
                               <span key={i} className="bg-white border border-slate-200 text-xs text-slate-600 px-2 py-1 rounded shadow-sm">
                                 {test}
                               </span>
                             ))}
                          </div>
                        </div>
                     )}
                  </div>
               </div>
            </div>
        </div>

      </div>
    </Layout>
  );
}
