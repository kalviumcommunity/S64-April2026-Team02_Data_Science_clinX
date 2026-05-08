import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, ComposedChart, Area
} from 'recharts';
import { Users, Activity, ShieldAlert, FileText, TrendingUp, Calendar, ChevronRight, Brain } from 'lucide-react';
import { getReportSummary, default as api } from '../services/api';
import Layout from '../components/Layout';

const ReportsPage = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showExportOptions, setShowExportOptions] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const result = await getReportSummary();
        setData(result);
      } catch (error) {
        console.error('Error fetching report:', error);
        setError('Failed to load clinical reports. Please ensure the backend is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <Layout activePath="/reports">
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </Layout>
  );

  if (error || !data) return (
    <Layout activePath="/reports">
      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl text-center">
          <ShieldAlert className="mx-auto text-rose-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-rose-800">Connection Error</h2>
          <p className="text-rose-600 mt-2">{error || 'Data is unavailable'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 bg-rose-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-rose-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    </Layout>
  );

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      const response = await api.get(`/reports/export/${format}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `clinical_report.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setShowExportOptions(false);
    } catch (error) {
      console.error(`Error exporting ${format}:`, error);
    }
  };

  if (loading) return (
    <Layout activePath="/reports">
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </Layout>
  );

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <Layout activePath="/reports">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">System Analytics & Clinical Reports</h1>
            <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
              <Calendar size={14} />
              Generated on {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowExportOptions(!showExportOptions)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-md shadow-blue-200"
            >
              <FileText size={16} />
              Export Data
            </button>
            {showExportOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 py-2 overflow-hidden animate-in fade-in zoom-in-95">
                <button 
                  onClick={() => handleExport('csv')}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  Export as CSV
                </button>
                <button 
                  onClick={() => handleExport('pdf')}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  Export as PDF
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard 
            title="Registered Patients" 
            value={data.totalUsers} 
            icon={<Users className="text-blue-600" />} 
            trend="+8.2%" 
            color="bg-blue-50"
          />
          <MetricCard 
            title="Monitored Pathogens" 
            value={data.totalDiseases} 
            icon={<ShieldAlert className="text-rose-600" />} 
            trend="Stable" 
            color="bg-rose-50"
          />
          <MetricCard 
            title="Live Outbreaks" 
            value={data.totalCases} 
            icon={<Activity className="text-emerald-600" />} 
            trend="-2 cases" 
            color="bg-emerald-50"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Trends Line Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <TrendingUp size={18} className="text-blue-500" />
                Infection Volume Trends
              </h3>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.outbreakTrends}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Prevalence Bar Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 text-base mb-8 flex items-center gap-2">
              <ShieldAlert size={18} className="text-emerald-500" />
              Disease Prevalence Stats
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.diseaseStats.slice(0, 6)}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="title" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Category & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 text-base mb-6">Case Classification</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {data.categoryData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {data.categoryData.map((entry: any, index: number) => (
                <div key={entry.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-slate-600 font-medium">{entry.name}</span>
                  </div>
                  <span className="text-slate-400">{entry.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 via-[#0f172a] to-[#1e1b4b] text-white p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden border border-white/10 group transition-all duration-500 hover:shadow-purple-900/20 hover:border-white/20">
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-2xl font-black mb-1 flex items-center gap-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    <Brain className="text-purple-400" size={24} />
                    Predictive Health Forecast
                  </h3>
                  <p className="text-slate-400 text-sm max-w-xl leading-relaxed font-medium">
                    {data.forecast?.insights || 'Loading ML forecast data...'}
                  </p>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live AI Engine
                </div>
              </div>
              
              <div className="h-64 w-full mt-8 mb-8 bg-black/20 rounded-2xl p-4 backdrop-blur-sm border border-white/5">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={data.forecast?.chartData || []} margin={{top: 10, right: 10, left: -20, bottom: 0}}>
                    <defs>
                      <linearGradient id="colorConf" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorHist" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" strokeOpacity={0.5} />
                    <XAxis dataKey="day" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => val.replace('Day ', '')} dy={10} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} dx={-10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                      itemStyle={{ color: '#fff', fontWeight: 600 }}
                      labelStyle={{ color: '#94a3b8', marginBottom: '6px', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    />
                    
                    {/* Confidence Interval Area */}
                    <Area type="monotone" dataKey="upperBound" stroke="none" fill="url(#colorConf)" />
                    <Area type="monotone" dataKey="lowerBound" stroke="none" fill="#0f172a" fillOpacity={1} />
                    
                    {/* Historical Area & Line */}
                    <Area type="monotone" dataKey="historical" stroke="none" fill="url(#colorHist)" />
                    <Line type="monotone" dataKey="historical" name="Actual Cases" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} />
                    
                    {/* Forecasted Line */}
                    <Line type="monotone" dataKey="forecast" name="Predicted Cases" stroke="#a855f7" strokeWidth={3} strokeDasharray="6 6" dot={false} activeDot={{ r: 6, fill: '#a855f7', stroke: '#fff', strokeWidth: 2 }} animationDuration={2000} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <button 
                  onClick={() => handleExport('pdf')}
                  className="group flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 px-7 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:-translate-y-0.5 border border-white/10"
                >
                  Generate Full Prediction Report
                  <ChevronRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                </button>
                <div className="flex items-center gap-5 text-[10px] font-bold uppercase tracking-widest text-slate-300 bg-black/30 px-5 py-2.5 rounded-full border border-white/5 backdrop-blur-md">
                  <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981]"></div> Historical</span>
                  <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#a855f7] shadow-[0_0_8px_#a855f7]"></div> Forecast</span>
                  <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-purple-500/20 border border-purple-500/50"></div> 95% Conf</span>
                </div>
              </div>
            </div>
            
            {/* Ambient Background Glows */}
            <div className="absolute top-[-150px] right-[-150px] w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse duration-1000"></div>
            <div className="absolute bottom-[-150px] left-[-150px] w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse duration-1000 delay-700"></div>
            
            <div className="absolute right-[-30px] bottom-[-30px] opacity-[0.02] pointer-events-none transform -rotate-12 transition-transform duration-700 group-hover:rotate-0">
              <TrendingUp size={350} />
            </div>
          </div>

        

        </div>
      </div>
    </Layout>

  );
};

const MetricCard = ({ title, value, icon, trend, color }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between hover:border-blue-200 transition-colors cursor-default">
    <div className="space-y-1">
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
      <h3 className="text-2xl font-black text-slate-800 mt-1">{value}</h3>
      <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
        {trend} <span className="text-slate-400 font-medium">period over period</span>
      </p>
    </div>
    <div className={`p-3.5 rounded-2xl ${color} shadow-inner`}>
      {React.cloneElement(icon as React.ReactElement, { size: 24 })}
    </div>
  </div>
);

export default ReportsPage;
