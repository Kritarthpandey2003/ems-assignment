"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { MoreVertical } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    departments: 0,
    departmentData: [] as { name: string; value: number }[]
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/employees?limit=1000');
        const employees = response.data.data;

        const active = employees.filter((e: any) => e.status === 'ACTIVE').length;
        const inactive = employees.filter((e: any) => e.status === 'INACTIVE').length;
        
        const depts = new Map<string, number>();
        employees.forEach((e: any) => {
          if (e.department) {
            depts.set(e.department, (depts.get(e.department) || 0) + 1);
          }
        });

        // Ensure we have some default data for the pie chart if empty
        let deptData = Array.from(depts.entries()).map(([name, value]) => ({ name, value }));
        if (deptData.length === 0) {
          deptData = [{ name: 'Engineering', value: 10 }, { name: 'Marketing', value: 5 }];
        }

        setStats({
          total: employees.length > 0 ? employees.length : 32,
          active,
          inactive,
          departments: depts.size,
          departmentData: deptData,
        });
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      }
    };

    fetchStats();
  }, []);

  const PIE_COLORS = ['#38bdf8', '#fb7185', '#a78bfa', '#34d399', '#fbbf24'];
  
  // Mock data for Weekly Activity Line Chart
  const weeklyData = [
    { name: 'Sun', Animation: 10, Illustration: 35, UI: 32 },
    { name: 'Mon', Animation: 40, Illustration: 25, UI: 55 },
    { name: 'Tue', Animation: 90, Illustration: 40, UI: 30 },
    { name: 'Wed', Animation: 90, Illustration: 50, UI: 70 },
    { name: 'Thu', Animation: 30, Illustration: 80, UI: 75 },
    { name: 'Fri', Animation: 10, Illustration: 50, UI: 80 },
    { name: 'Sat', Animation: 15, Illustration: 60, UI: 65 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h1 className="text-4xl font-bold text-indigo-950 dark:text-indigo-100">Welcome {user?.name || 'Admin'}!</h1>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column (Stats + Activity) */}
        <div className="xl:col-span-2 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Total Employees Pie Chart */}
            <div className="glass-panel p-6 flex flex-col h-[280px]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-indigo-950 dark:text-indigo-100">Total Employees</h3>
                <span className="text-2xl font-bold text-indigo-950 dark:text-indigo-100">{stats.total}</span>
              </div>
              <div className="flex-1 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.departmentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {stats.departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', backgroundColor: 'rgba(255,255,255,0.8)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Skills */}
            <div className="glass-panel p-6 h-[280px]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-indigo-950 dark:text-indigo-100">Top Skills</h3>
                <MoreVertical className="w-5 h-5 text-neutral-500" />
              </div>
              <div className="space-y-6">
                {[
                  { name: 'UI/UX Design', percent: 90, projects: 100, color: 'bg-orange-400' },
                  { name: 'Illustration', percent: 85, projects: 85, color: 'bg-purple-400' },
                  { name: 'Animation', percent: 78, projects: 65, color: 'bg-blue-400' },
                ].map((skill) => (
                  <div key={skill.name} className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-md ${skill.color}`}>
                      {skill.percent}%
                    </div>
                    <div>
                      <div className="font-semibold text-indigo-950 dark:text-indigo-100">{skill.name}</div>
                      <div className="text-xs text-neutral-500">{skill.projects}+ Projects</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Weekly Activity Line Chart */}
          <div className="glass-panel p-6 h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-indigo-950 dark:text-indigo-100">Weekly Activity</h3>
              <select className="bg-white/40 dark:bg-black/40 border-none rounded-full px-4 py-1 text-sm font-medium text-indigo-950 outline-none">
                <option>December, 14 - 18th</option>
              </select>
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.3)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', backgroundColor: 'rgba(255,255,255,0.9)' }} />
                  <Line type="monotone" dataKey="Animation" stroke="#38bdf8" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="Illustration" stroke="#a78bfa" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="UI" stroke="#fb923c" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Right Column (Widgets) */}
        <div className="space-y-6">
          
          {/* Attendance Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="glass-panel py-4 px-2 flex flex-col items-center justify-center">
              <div className="text-xs text-neutral-600 dark:text-neutral-300 mb-1">Attendance</div>
              <div className="text-xl font-bold text-indigo-950 dark:text-indigo-100">30</div>
            </div>
            <div className="glass-panel py-4 px-2 flex flex-col items-center justify-center">
              <div className="text-xs text-neutral-600 dark:text-neutral-300 mb-1">Late</div>
              <div className="text-xl font-bold text-indigo-950 dark:text-indigo-100">3</div>
            </div>
            <div className="glass-panel py-4 px-2 flex flex-col items-center justify-center">
              <div className="text-xs text-neutral-600 dark:text-neutral-300 mb-1">Absent</div>
              <div className="text-xl font-bold text-indigo-950 dark:text-indigo-100">2</div>
            </div>
          </div>

          {/* Birthday Widget */}
          <div className="glass-panel p-6 relative overflow-hidden bg-gradient-to-br from-white/60 to-white/20 dark:from-white/10 dark:to-white/5">
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 rounded-full bg-neutral-200 shadow-inner flex items-center justify-center overflow-hidden">
                <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="font-bold text-lg text-indigo-950 dark:text-indigo-100">Terry Calzoni 🎈</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-300">Has birthday today</div>
              </div>
            </div>
            <button className="mt-6 w-full py-2 bg-white/60 dark:bg-white/20 hover:bg-white/80 transition-colors rounded-xl font-bold text-indigo-900 shadow-sm relative z-10">
              Wish Him
            </button>
          </div>

          {/* Employees on Holiday */}
          <div className="glass-panel p-6">
            <h3 className="text-lg font-bold text-indigo-950 dark:text-indigo-100 mb-4">Employees on holiday</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-200">
                     <img src="https://i.pravatar.cc/150?u=a042581f4e29026704c" alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <span className="font-medium text-sm text-indigo-950 dark:text-indigo-100">Unhealthy</span>
                </div>
                <span className="text-xs font-semibold text-red-500">Only today</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-200">
                     <img src="https://i.pravatar.cc/150?u=a042581f4e29026704e" alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <span className="font-medium text-sm text-indigo-950 dark:text-indigo-100">On holiday</span>
                </div>
                <span className="text-xs font-semibold text-red-500">21th to 22th</span>
              </div>
            </div>
          </div>

          {/* Calendar Widget (Simplified) */}
          <div className="glass-panel p-6">
            <h3 className="text-center font-bold text-indigo-950 dark:text-indigo-100 mb-4">December</h3>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-neutral-500 mb-2">
              <div>SU</div><div>MO</div><div>TU</div><div>WE</div><div>TH</div><div>FR</div><div>SA</div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium">
              <div className="text-neutral-300">29</div><div className="text-neutral-300">30</div>
              {[...Array(31)].map((_, i) => (
                <div key={i} className={`p-1 rounded-md ${i + 1 === 21 ? 'bg-blue-400 text-white shadow-md' : 'text-indigo-950 dark:text-indigo-100'}`}>
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
