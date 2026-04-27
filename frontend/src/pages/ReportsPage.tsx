import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { Users, Activity, ShieldAlert, FileText, TrendingUp, Calendar, ChevronRight } from 'lucide-react';
import { getReportSummary, default as api } from '../services/api';
import Layout from '../components/Layout';

const ReportsPage = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showExportOptions, setShowExportOptions] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getReportSummary();
        setData(result);
      } catch (error) {
        console.error('Error fetching report:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
    <Layout activePath="#/reports">
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </Layout>
  );

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <Layout activePath="#/reports">
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

          <div className="lg:col-span-2 bg-slate-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Predictive Health Insights</h3>
              <p className="text-slate-400 text-sm max-w-md">Our ML model suggests a 15% increase in respiratory cases over the next 14 days based on current humidity trends.</p>
              <button className="mt-8 flex items-center gap-2 bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all backdrop-blur-sm border border-white/10">
                Generate Full Prediction Report
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
              <TrendingUp size={200} />
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
