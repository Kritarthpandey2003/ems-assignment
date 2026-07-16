"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function AttendancePage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/employees?search=${search}&limit=50`);
      setEmployees(response.data.data);
    } catch (error) {
      console.error("Failed to fetch employees", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [search]);

  // Derive "Attendance" from the only real data we have (Status)
  const presentCount = employees.filter(e => e.status === 'ACTIVE').length;
  const absentCount = employees.filter(e => e.status === 'INACTIVE').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold tracking-tight text-indigo-950 dark:text-indigo-100">Attendance Report</h2>
      </div>

      <div className="grid gap-6 grid-cols-3 mb-6">
        <div className="glass-panel py-4 px-6 flex flex-col items-center justify-center col-span-3 sm:col-span-1">
          <div className="text-sm font-semibold text-indigo-950/70 dark:text-indigo-100/70 mb-1 uppercase tracking-wider">Total Roster</div>
          <div className="text-3xl font-bold text-indigo-950 dark:text-indigo-100">{employees.length}</div>
        </div>
        <div className="glass-panel py-4 px-6 flex flex-col items-center justify-center col-span-3 sm:col-span-1">
          <div className="text-sm font-semibold text-emerald-600/70 dark:text-emerald-300/70 mb-1 uppercase tracking-wider">Active (Present)</div>
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-300">{presentCount}</div>
        </div>
        <div className="glass-panel py-4 px-6 flex flex-col items-center justify-center col-span-3 sm:col-span-1">
          <div className="text-sm font-semibold text-red-600/70 dark:text-red-300/70 mb-1 uppercase tracking-wider">Inactive (Absent)</div>
          <div className="text-3xl font-bold text-red-600 dark:text-red-300">{absentCount}</div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500" />
          <Input
            placeholder="Search employee attendance..."
            className="pl-8 bg-white/30 dark:bg-black/30 border-white/40 focus:ring-white/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Current Status</TableHead>
              <TableHead className="text-right">Last Recorded</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 font-medium">Loading attendance data...</TableCell>
              </TableRow>
            ) : employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 font-medium">No employees found in roster.</TableCell>
              </TableRow>
            ) : (
              employees.map((emp) => (
                <TableRow key={emp.id} className="hover:bg-white/10 transition-colors border-b-white/10">
                  <TableCell className="font-medium text-indigo-950 dark:text-indigo-100">{emp.name}</TableCell>
                  <TableCell className="text-indigo-950/70 dark:text-indigo-100/70">{emp.department || '-'}</TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${emp.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {emp.status === 'ACTIVE' ? 'PRESENT' : 'ABSENT'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-sm text-indigo-950/50 dark:text-indigo-100/50">
                    {new Date(emp.updatedAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
