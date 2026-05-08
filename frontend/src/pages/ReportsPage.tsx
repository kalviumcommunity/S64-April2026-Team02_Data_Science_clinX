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

          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">

            {/* Header — matches other chart cards */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <Brain size={18} className="text-blue-500" />
                  Predictive Case Forecast
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md leading-relaxed">
                  {data.forecast?.insights || 'Loading ML model output...'}
                </p>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ml-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
                Live model
              </div>
            </div>

            {/* Stat strip — 3 numbers in a row */}
            <div className="grid grid-cols-3 divide-x divide-slate-100 bg-slate-50 border border-slate-200 rounded-xl mb-5 overflow-hidden">
              <div className="px-4 py-3">
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Horizon</p>
                <p className="text-base font-bold text-slate-800">14 days</p>
              </div>
              <div className="px-4 py-3">
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Avg Cases / Day</p>
                <p className="text-base font-bold text-blue-600">
                  {data.forecast?.chartData
                    ? Math.round(data.forecast.chartData.slice(0, 30).reduce((s: number, d: any) => s + (d.historical || 0), 0) / 30)
                    : '—'}
                </p>
              </div>
              <div className="px-4 py-3">
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Algorithm</p>
                <p className="text-base font-bold text-slate-800">Trend + CI</p>
              </div>
            </div>

            {/* Chart — same height and style as other charts on page */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data.forecast?.chartData || []} margin={{top: 5, right: 5, left: -22, bottom: 0}}>
                  <defs>
                    <linearGradient id="gradConf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity={0.08}/>
                      <stop offset="100%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="gradHist" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.12}/>
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="day"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dy={6}
                    interval={6}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    }}
                    labelStyle={{ color: '#64748b', fontWeight: 600, fontSize: '11px', marginBottom: '4px' }}
                    itemStyle={{ color: '#334155' }}
                    formatter={(value: any, name: string) => {
                      if (value === null || value === undefined) return [null, name];
                      if (name === 'historical_fill') return [null, null]; // suppress duplicate
                      return [value, name];
                    }}
                    filterNull={true}
                  />
                  {/* Confidence band */}
                  <Area type="monotone" dataKey="upperBound" name="Upper Bound (95% CI)" stroke="none" fill="url(#gradConf)" legendType="none" />
                  <Area type="monotone" dataKey="lowerBound" name="Lower Bound (95% CI)" stroke="none" fill="#fff" fillOpacity={1} legendType="none" />
                  {/* Historical fill — uses renamed key to avoid tooltip conflict */}
                  <Area type="monotone" dataKey="historical" name="historical_fill" stroke="none" fill="url(#gradHist)" legendType="none" />
                  <Line
                    type="monotone"
                    dataKey="historical"
                    name="Historical Cases"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                  />
                  {/* Forecast */}
                  <Line
                    type="monotone"
                    dataKey="forecast"
                    name="Predicted Cases"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    strokeDasharray="5 4"
                    dot={false}
                    activeDot={{ r: 5, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-5">
                <span className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <span className="w-5 h-[2.5px] bg-emerald-500 rounded-full inline-block"></span>
                  Historical cases
                </span>
                <span className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <svg width="20" height="4" viewBox="0 0 20 4"><line x1="0" y1="2" x2="20" y2="2" stroke="#2563eb" strokeWidth="2.5" strokeDasharray="5 3"/></svg>
                  14-day forecast
                </span>
                <span className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <span className="w-3.5 h-3.5 bg-blue-50 border border-blue-200 inline-block rounded"></span>
                  95% confidence
                </span>
              </div>
              <button
                onClick={() => handleExport('pdf')}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all shadow-sm shadow-blue-200"
              >
                <FileText size={13} />
                Export Report
              </button>
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
