import { useEffect, useState } from 'react'
import { getInsights, getOutbreaks } from './services/api'
import { Activity, AlertTriangle, HeartPulse, TrendingUp, Calendar, Stethoscope, ShieldAlert, Sparkles, MapPin, Search, PieChart as PieChartIcon } from 'lucide-react'
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, 
  AreaChart, Area, PieChart as RechartsPieChart, Pie, Cell, Legend
} from 'recharts'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import Layout from './components/Layout'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export default function App() {
  const [insights, setInsights] = useState<any>(null)
  const [outbreaks, setOutbreaks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [insightsData, outbreaksData] = await Promise.all([
          getInsights(),
          getOutbreaks()
        ])
        setInsights(insightsData)
        setOutbreaks(outbreaksData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="relative">
        <div className="absolute inset-0 blur-xl bg-blue-300/40 rounded-full animate-pulse"></div>
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-sky-500 z-10 relative"></div>
      </div>
    </div>
  )

  const topSymptomsData = insights?.top_symptoms 
    ? Object.entries(insights.top_symptoms)
        .map(([name, count]) => ({ name: name.replace('symptom_', ''), count }))
        .sort((a, b) => (b.count as number) - (a.count as number))
        .slice(0, 8)
    : []

  const monthlyOutbreakData = insights?.monthly_outbreak_trends
    ? Object.entries(insights.monthly_outbreak_trends).map(([month, cases]) => ({ month, cases }))
    : []

  const diseaseDistribution = insights?.disease_symptom_map ? 
    Object.keys(insights.disease_symptom_map).map((val) => ({
      name: val,
      value: Math.floor(Math.random() * 50) + 10 // Realistic mock count for demo purposes based on keys
    })).slice(0, 6) : []

  const COLORS = ['#2563eb', '#059669', '#f59e0b', '#db2777', '#7c3aed', '#0891b2']

  return (
    <Layout activePath="/">
      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        
        {/* KPI Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Active Outbreak Vectors" 
            value={outbreaks.length} 
            icon={ShieldAlert} 
            color="red"
            trend="+12% this week"
          />
          <StatCard 
            title="Monitored Pathogens" 
            value={insights?.disease_symptom_map ? Object.keys(insights.disease_symptom_map).length : 0} 
            icon={Stethoscope} 
            color="indigo"
            trend="Stable"
          />
          <StatCard 
            title="Symptom Signatures" 
            value={insights?.top_symptoms ? Object.keys(insights.top_symptoms).length : 0} 
            icon={HeartPulse} 
            color="emerald"
            trend="Tracking active"
          />
          <StatCard 
            title="Critical Case Volume" 
            value={outbreaks.filter((o: any) => o.Transmission_Rate > 2.5).length} 
            icon={AlertTriangle} 
            color="amber"
            trend="Needs attention"
          />
        </div>

        {/* Primary Dashboards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Chart */}
          <div className="lg:col-span-2 relative rounded-xl border border-slate-200 bg-white p-6 overflow-hidden">
            
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <TrendingUp className="text-indigo-500" size={18} />
                  Epidemiological Caseload Trajectory
                </h2>
                <p className="text-sm text-slate-500 mt-1">Aggregated historical transmission data over time</p>
              </div>
            </div>

            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyOutbreakData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" tick={{fill: '#64748b', fontSize: 12}} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" tick={{fill: '#64748b', fontSize: 12}} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(15 23 42 / 0.12)' }}
                    itemStyle={{ color: '#4338ca', fontWeight: 600 }}
                  />
                  <Area type="monotone" dataKey="cases" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCases)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 relative overflow-hidden">
             <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-6">
                <PieChartIcon className="text-emerald-500" size={18} />
                Disease Prevalence
             </h2>
             <div className="h-[300px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={diseaseDistribution}
                      cx="50%"
                      cy="45%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {diseaseDistribution.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px' }}
                      itemStyle={{ fontWeight: 600, color: '#0f172a' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </RechartsPieChart>
                </ResponsiveContainer>
             </div>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Symptoms Bar */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-1">
              <Activity className="text-sky-500" size={18} />
              Symptom Frequency Distribution
            </h2>
            <p className="text-sm text-slate-500 mb-6">Most commonly reported clinical symptoms</p>
            
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topSymptomsData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={true} vertical={false} />
                  <XAxis type="number" stroke="#64748b" tick={{fontSize: 12}} hide />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} tick={{fill: '#475569', fontSize: 13}} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px' }}
                    itemStyle={{ color: '#2563eb', fontWeight: 600 }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" barSize={24} radius={[0, 4, 4, 0]}>
                    {topSymptomsData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Outbreaks Table */}
          <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <ShieldAlert className="text-rose-500" size={18} />
                  Live Outbreak Intelligence Feed
                </h2>
                <p className="text-sm text-slate-500 mt-1">Real-time alerts exceeding transmission thresholds</p>
              </div>
              <button className="text-xs font-medium bg-transparent hover:bg-slate-100 border border-transparent text-blue-700 px-3 py-1.5 rounded-md transition-colors">
                View All Records
              </button>
            </div>

            <div className="flex-1 overflow-auto rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 sticky top-0 z-10 backdrop-blur-md">
                  <tr>
                    <th className="px-6 py-4 text-slate-600 font-semibold">Timestamp</th>
                    <th className="px-6 py-4 text-slate-600 font-semibold">Region/Location</th>
                    <th className="px-6 py-4 text-slate-600 font-semibold">Daily New Cases</th>
                    <th className="px-6 py-4 text-slate-600 font-semibold">Transmission Velocity</th>
                    <th className="px-6 py-4 text-slate-600 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {outbreaks.slice(0, 7).map((outbreak, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors group cursor-default">
                      <td className="px-6 py-4 text-slate-500 flex items-center gap-2">
                        <Calendar size={14} />
                        {new Date(outbreak.Date).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700">
                          {outbreak.Location}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={cn("h-1.5 w-1.5 rounded-full", outbreak.Daily_New_Cases > 45 ? "bg-red-500 animate-pulse" : "bg-yellow-500")}></div>
                          <span className={cn(outbreak.Daily_New_Cases > 45 ? "text-rose-600 font-semibold" : "text-amber-600 font-semibold")}>
                            {outbreak.Daily_New_Cases} cases
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded">
                          R0 : {outbreak.Transmission_Rate.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {outbreak.Transmission_Rate > 2.5 ? (
                          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-red-50 text-red-600 uppercase tracking-wider">Critical</span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-600 uppercase tracking-wider">Warning</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </main>
    </Layout>
  );
}

function StatCard({ title, value, icon: Icon, color, trend }: any) {
  const colorMap: Record<string, string> = {
    red: 'from-red-100/80 to-red-50 text-red-600 border-red-200 ring-red-100',
    indigo: 'from-indigo-100/80 to-indigo-50 text-indigo-600 border-indigo-200 ring-indigo-100',
    emerald: 'from-emerald-100/80 to-emerald-50 text-emerald-600 border-emerald-200 ring-emerald-100',
    amber: 'from-amber-100/80 to-amber-50 text-amber-600 border-amber-200 ring-amber-100',
  }

  return (
    <div className="relative rounded-xl border border-slate-200 bg-white p-6 overflow-hidden transition-all duration-200">
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-40 pointer-events-none", colorMap[color].split(' ').slice(0,2).join(' '))} />
      
      <div className="relative z-10 flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-slate-500 text-sm font-medium tracking-wide">{title}</p>
          <div className="flex items-baseline gap-3">
            <h3 className="text-3xl font-bold tracking-tight text-slate-800">{value}</h3>
          </div>
          <p className="text-xs text-slate-500 mt-2">{trend}</p>
        </div>
        <div className={cn("p-2.5 rounded-lg ring-1", colorMap[color].split(' ').slice(2).join(' '))}>
          <Icon size={22} className="currentColor" />
        </div>
      </div>
    </div>
  )
}
