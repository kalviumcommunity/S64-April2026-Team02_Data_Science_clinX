import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  Search, Brain, Zap, MessageCircle, BarChart3, Stethoscope, ArrowRight
} from 'lucide-react';
import Layout from './components/Layout';
import { Link } from 'react-router-dom';

// Mock Datasets
const pieData = [
  { name: 'Asthma', value: 20 },
  { name: 'Coronary Artery Disease', value: 15 },
  { name: 'Diabetes', value: 25 },
  { name: 'Hyperthyroidism', value: 12 },
  { name: 'Influenza', value: 18 },
  { name: 'Pneumonia', value: 10 },
];

const PIE_COLORS: Record<string, string> = {
  'Asthma': '#10b981', 'Coronary Artery Disease': '#f59e0b', 'Diabetes': '#ef4444', 
  'Hyperthyroidism': '#8b5cf6', 'Influenza': '#14b8a6', 'Pneumonia': '#2563eb'
};

const barData = [
  { name: 'Fatigue', value: 92, fill: '#0d9488' },
  { name: 'Nausea', value: 85, fill: '#3b82f6' },
  { name: 'Shortness of Breath', value: 82, fill: '#e11d48' },
  { name: 'Body Ache', value: 78, fill: '#f59e0b' },
  { name: 'Cough', value: 74, fill: '#10b981' },
  { name: 'Headache', value: 70, fill: '#8b5cf6' },
  { name: 'Fever', value: 68, fill: '#0f766e' },
];

const diseaseDetails: Record<string, any> = {
  'Asthma': { prevalence: 20, regions: ['Urban', 'Suburban'], trend: [12, 15, 18, 20], symptoms: ['Shortness of Breath', 'Cough', 'Fatigue'] },
  'Coronary Artery Disease': { prevalence: 15, regions: ['Urban', 'Rural'], trend: [14, 14, 15, 15], symptoms: ['Fatigue', 'Shortness of Breath', 'Nausea'] },
  'Diabetes': { prevalence: 25, regions: ['Urban', 'Suburban', 'Rural'], trend: [20, 22, 24, 25], symptoms: ['Fatigue', 'Nausea', 'Body Ache'] },
  'Hyperthyroidism': { prevalence: 12, regions: ['Urban'], trend: [8, 10, 11, 12], symptoms: ['Fatigue', 'Headache', 'Nausea'] },
  'Influenza': { prevalence: 18, regions: ['Suburban', 'Rural'], trend: [5, 12, 15, 18], symptoms: ['Fever', 'Cough', 'Fatigue', 'Headache', 'Body Ache'] },
  'Pneumonia': { prevalence: 10, regions: ['Rural', 'Urban'], trend: [4, 6, 8, 10], symptoms: ['Cough', 'Shortness of Breath', 'Fever', 'Fatigue'] }
};

const allSymptoms = ['Fatigue', 'Nausea', 'Shortness of Breath', 'Body Ache', 'Cough', 'Headache', 'Fever'];

// Sub-component for modularity
const DetailPanel = ({ selectedDisease }: { selectedDisease: string }) => {
  const details = diseaseDetails[selectedDisease];
  if (!details) {
    return (
      <div className="bg-white rounded-[14px] border border-slate-200/80 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] p-6 flex flex-col items-center justify-center min-h-[350px]">
        <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mb-4 ring-1 ring-slate-100">
          <Search className="text-slate-300 stroke-[2]" size={26} />
        </div>
        <p className="text-slate-400 text-sm font-medium">Click a disease slice to view details</p>
      </div>
    );
  }

  const trendData = details.trend.map((val: number, i: number) => ({ name: `P${i+1}`, value: val }));

  return (
    <div className="bg-white rounded-[14px] border border-slate-200/80 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] p-7 min-h-[350px] flex flex-col transition-all duration-300">
      <div className="flex justify-between items-start mb-5">
        <div>
          <h3 className="text-[18px] font-bold tracking-tight" style={{ color: PIE_COLORS[selectedDisease] }}>
            {selectedDisease} <span className="text-slate-400 font-medium text-sm ml-1">Detail View</span>
          </h3>
          <p className="text-sm text-slate-500 font-medium mt-0.5">Prevalence: {details.prevalence}% of cases</p>
          <Link
            to={`/treatment/${encodeURIComponent(selectedDisease)}`}
            className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-[11px] font-semibold uppercase tracking-wide rounded-md border border-indigo-200 transition-colors"
          >
            <Stethoscope size={12} />
            View Treatment Plan
          </Link>
        </div>
        <div className="flex gap-1.5 flex-wrap justify-end">
          {details.regions.map((r: string) => (
            <span key={r} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-semibold uppercase tracking-wider rounded-md border border-slate-200/50">
              {r}
            </span>
          ))}
        </div>
      </div>
      
      <div className="h-[140px] w-full mb-5 relative">
        <p className="absolute -top-1 left-2 text-[10px] uppercase font-bold text-slate-400 z-10">4-Period Trend</p>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData} margin={{ top: 15, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 500}} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 500}} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ fontWeight: 600, color: PIE_COLORS[selectedDisease] }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={PIE_COLORS[selectedDisease]} 
              strokeWidth={3} 
              dot={{r: 4, strokeWidth: 2, fill: '#fff'}} 
              activeDot={{r: 6}} 
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-auto">
        <p className="text-[11px] text-slate-400 font-bold mb-2.5 uppercase tracking-wider">Associated Core Symptoms</p>
        <div className="flex flex-wrap gap-2">
          {details.symptoms.map((sym: string) => (
            <span key={sym} className="px-3 py-1 bg-blue-50/50 text-blue-700 text-[12px] font-medium rounded-full border border-blue-200/60 shadow-sm">
              {sym}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function DiagnosisTrends() {
  const [selectedDisease, setSelectedDisease] = useState<string>('Influenza');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [predictionProb, setPredictionProb] = useState<number>(0);
  const [diseaseScores, setDiseaseScores] = useState<{name: string, score: number}[]>([]);

  // Inference Engine Logic: Recompute predictions automatically when symptoms change
  useEffect(() => {
    if (selectedSymptoms.length === 0) {
      setPredictionProb(0);
      setDiseaseScores([]);
      return;
    }
    
    let maxMatch = 0;
    let bestMatch = selectedDisease; // persist current if no match

    const newScores = Object.entries(diseaseDetails).map(([disease, data]) => {
      const matchCount = data.symptoms.filter((s: string) => selectedSymptoms.includes(s)).length;
      const score = Math.round((matchCount / data.symptoms.length) * 100);
      const displayScore = Math.min(score, 99); // Max out at 99% for realism

      if (matchCount > maxMatch) {
        maxMatch = matchCount;
        bestMatch = disease;
      }
      return { name: disease, score: displayScore };
    });

    // Sort by score descending
    newScores.sort((a, b) => b.score - a.score);
    setDiseaseScores(newScores.filter(d => d.score > 0));

    if (maxMatch > 0) {
      if (bestMatch !== selectedDisease) {
        setSelectedDisease(bestMatch);
      }
      setPredictionProb(newScores.find(d => d.name === bestMatch)?.score || 0);
    } else {
      setPredictionProb(0);
      setDiseaseScores([]);
    }
  }, [selectedSymptoms]);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  return (
    <Layout activePath="/diagnosis">
      
      <div className="p-8 pb-24 relative max-w-[1200px] mx-auto">
        <div className="mb-6">
          <h2 className="text-[22px] font-bold text-slate-800 flex items-center gap-2.5">
            <BarChart3 className="text-blue-500 shrink-0" size={26} /> 
            Drill-Down Analytics
          </h2>
          <p className="text-[13px] text-slate-500 mt-1 ml-[36px]">Click on any disease or symptom for detailed analysis</p>
        </div>

        <div className="space-y-6">
          
          {/* ROW 1: Pie Chart & Dynamic Detail View */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Card 1: Disease Prevalence */}
            <div className="bg-white rounded-[14px] border border-slate-200/80 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] p-6 min-h-[350px] flex flex-col">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-2 text-sm">
                <Stethoscope className="text-purple-500" size={18} />
                Disease Prevalence (Click to drill down)
              </h3>
              
              <div className="flex-1 w-full flex flex-col items-center justify-center relative mt-4">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="45%"
                      innerRadius={65}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                      className="cursor-pointer outline-none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={PIE_COLORS[entry.name]} 
                          onClick={() => setSelectedDisease(entry.name)}
                          className={`transition-all duration-300 outline-none hover:opacity-100 ${
                            selectedDisease === entry.name 
                              ? 'opacity-100' 
                              : 'opacity-40'
                          }`}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ fontWeight: 600 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Custom Legend */}
                <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-[-10px] w-full px-4">
                  {pieData.map((entry, index) => (
                    <div 
                      key={entry.name} 
                      onClick={() => setSelectedDisease(entry.name)}
                      className={`flex items-center gap-1.5 text-[12px] font-medium cursor-pointer transition-colors ${selectedDisease === entry.name ? 'text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      <span className="w-3 h-3 rounded-full shadow-sm transition-opacity" style={{ backgroundColor: PIE_COLORS[entry.name], opacity: selectedDisease === entry.name ? 1 : 0.4 }}></span>
                      {entry.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2: Dynamic Detail Panel */}
            <DetailPanel selectedDisease={selectedDisease} />
          </div>

          {/* SECTION 2: Inference Engine */}
          <div className="bg-white rounded-[14px] border border-slate-200/80 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] p-7">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-1.5 text-[15px]">
                  <Brain className="text-blue-600" size={20} />
                  Symptom <span className="opacity-40 font-normal mx-0.5">→</span> Disease Inference Engine
                </h3>
                <p className="text-[13px] text-slate-500">Select observed symptoms to get probable disease rankings</p>
              </div>
              
              {/* Dynamic Readout */}
              <div className="text-right">
                {selectedSymptoms.length > 0 ? (
                  <div className="inline-flex flex-col items-end animate-in fade-in slide-in-from-right-4 duration-500">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Confidence Rate</span>
                    <span className="text-sm font-semibold mt-0.5" style={{ color: PIE_COLORS[selectedDisease] }}>
                      {selectedDisease} ({predictionProb}%)
                    </span>
                  </div>
                ) : (
                  <span className="text-[12px] font-medium text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">Awaiting input...</span>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3.5 mb-8 px-1">
              {allSymptoms.map((symptom) => {
                const isSelected = selectedSymptoms.includes(symptom);
                return (
                  <button 
                    key={symptom}
                    onClick={() => toggleSymptom(symptom)}
                    className={`px-5 py-2 text-[13px] font-medium rounded-full transition-all duration-200 border shadow-sm outline-none transform active:scale-95 ${
                      isSelected 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-blue-600/30' 
                        : 'bg-[#f1f5f9] text-slate-600 border-slate-200/60 hover:bg-slate-200 hover:text-slate-800'
                    }`}
                  >
                    {symptom}
                  </button>
                );
              })}
            </div>
            
            {diseaseScores.length > 0 ? (
              <div className="pt-5 pb-1 border-t border-slate-100 animate-in fade-in duration-500">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-4">Calculated Probabilities</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {diseaseScores.map((ds) => (
                    <div key={ds.name} className="flex flex-col gap-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100 animate-in slide-in-from-bottom-2 fade-in relative group hover:border-blue-200/50 hover:shadow-sm transition-all">
                       <div className="flex justify-between items-start">
                          <div className="flex flex-col">
                             <span className="text-[13px] font-semibold text-slate-700 leading-tight">{ds.name}</span>
                             <Link to={`/treatment/${encodeURIComponent(ds.name)}`} className="text-[10px] text-blue-500 hover:text-blue-700 font-bold uppercase tracking-wider flex items-center gap-1 mt-1.5 w-max group-hover:translate-x-0.5 transition-transform">
                               <Stethoscope size={10} /> View Plan <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-0.5" />
                             </Link>
                          </div>
                          <span className="text-[13px] font-bold" style={{color: PIE_COLORS[ds.name]}}>{ds.score}%</span>
                       </div>
                       <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${ds.score}%`, backgroundColor: PIE_COLORS[ds.name] }}></div>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center pt-3 pb-1 border-t border-slate-100">
                <p className="text-[12px] text-slate-400 font-medium">Select symptoms above to see disease probabilities update in real-time.</p>
              </div>
            )}
          </div>

          {/* SECTION 3: Frequency Distribution */}
          <div className="bg-white rounded-[14px] border border-slate-200/80 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] p-7">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-1 text-[15px]">
                <Zap className="text-orange-500 fill-orange-500" size={20} />
                Symptom Frequency Distribution
            </h3>
            <p className="text-[13px] text-slate-500 mb-8">Most commonly reported clinical symptoms</p>
            
            <div className="h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 30, left: 30, bottom: 0 }} barSize={18}>
                  <CartesianGrid strokeDasharray="4 4" horizontal={false} vertical={true} stroke="#cbd5e1" opacity={0.5} />
                  <XAxis 
                    type="number" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} 
                    domain={[0, 100]}
                  />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} 
                    width={140} 
                  />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontWeight: 600 }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} className="hover:opacity-80 transition-opacity cursor-pointer delay-75" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Chat Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#2563eb] hover:bg-[#1d4ed8] transition-colors text-white rounded-full flex items-center justify-center shadow-[0_8px_20px_-6px_rgba(37,99,235,0.5)] z-50">
        <MessageCircle size={26} className="fill-white/10" strokeWidth={1.5} />
      </button>

    </Layout>
  );
}
