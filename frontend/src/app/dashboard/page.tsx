"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Users, UserCheck, UserX, Building2 } from "lucide-react";
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

        const deptData = Array.from(depts.entries()).map(([name, value]) => ({ name, value }));

        setStats({
          total: employees.length,
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

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <h1 className="text-4xl font-bold text-indigo-950 dark:text-indigo-100">Welcome {user?.name || 'Admin'}!</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="glass-panel p-6 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-bold text-indigo-950/70 dark:text-indigo-100/70 uppercase tracking-wider">Total Employees</h3>
            <Users className="w-5 h-5 text-indigo-500" />
          </div>
          <span className="text-4xl font-bold text-indigo-950 dark:text-indigo-100">{stats.total}</span>
        </div>
        
        <div className="glass-panel p-6 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-bold text-emerald-700/70 dark:text-emerald-300/70 uppercase tracking-wider">Active Employees</h3>
            <UserCheck className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="text-4xl font-bold text-emerald-700 dark:text-emerald-300">{stats.active}</span>
        </div>

        <div className="glass-panel p-6 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-bold text-red-700/70 dark:text-red-300/70 uppercase tracking-wider">Inactive Employees</h3>
            <UserX className="w-5 h-5 text-red-500" />
          </div>
          <span className="text-4xl font-bold text-red-700 dark:text-red-300">{stats.inactive}</span>
        </div>

        <div className="glass-panel p-6 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-bold text-blue-700/70 dark:text-blue-300/70 uppercase tracking-wider">Departments</h3>
            <Building2 className="w-5 h-5 text-blue-500" />
          </div>
          <span className="text-4xl font-bold text-blue-700 dark:text-blue-300">{stats.departments}</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="glass-panel p-6 h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-indigo-950 dark:text-indigo-100">Employees by Department</h3>
          </div>
          <div className="flex-1 relative">
            {stats.departmentData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  >
                    {stats.departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', backgroundColor: 'rgba(255,255,255,0.8)' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-indigo-950/50 dark:text-indigo-100/50 font-medium">
                No departmental data available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
