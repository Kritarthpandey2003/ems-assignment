"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, Network, LogOut } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen items-center justify-center p-4 sm:p-8">
      <div className="flex h-full w-full max-w-[1600px] overflow-hidden glass-card">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/20 flex flex-col bg-white/10 dark:bg-black/10 backdrop-blur-sm">
          <div className="h-20 flex flex-col justify-center items-center px-6 border-b border-white/20">
            <h2 className="font-bold text-lg tracking-wider text-center text-indigo-900 dark:text-indigo-200">
              EMPLOYEE<br />MANAGEMENT
            </h2>
          </div>
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
            <Link href="/dashboard" className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${pathname === '/dashboard' ? 'bg-white/40 dark:bg-white/10 shadow-sm' : 'hover:bg-white/20 dark:hover:bg-white/5'}`}>
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Link>
            <Link href="/dashboard/employees" className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${pathname.includes('/employees') ? 'bg-white/40 dark:bg-white/10 shadow-sm' : 'hover:bg-white/20 dark:hover:bg-white/5'}`}>
              <Users className="h-5 w-5" />
              Employees
            </Link>
            <Link href="/dashboard/attendance" className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${pathname.includes('/attendance') ? 'bg-white/40 dark:bg-white/10 shadow-sm' : 'hover:bg-white/20 dark:hover:bg-white/5'}`}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Attendance
            </Link>
            <Link href="/dashboard/organization" className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${pathname.includes('/organization') ? 'bg-white/40 dark:bg-white/10 shadow-sm' : 'hover:bg-white/20 dark:hover:bg-white/5'}`}>
              <Network className="h-5 w-5" />
              Org Chart
            </Link>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          <header className="h-20 flex items-center justify-between px-8 py-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="search employee" 
                  className="w-full bg-white/30 dark:bg-black/30 border border-white/40 dark:border-white/10 rounded-full py-2 px-10 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
                />
                <svg className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 cursor-pointer hover:bg-white/20 p-2 rounded-full transition-colors">
                <div className="h-8 w-8 rounded-full bg-indigo-500/80 flex items-center justify-center text-white font-bold shadow-inner">
                  {user.name.charAt(0)}
                </div>
                <span className="font-medium text-sm hidden sm:block">Notification</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <button onClick={logout} className="flex items-center gap-2 font-medium text-sm hover:bg-white/20 p-2 rounded-full transition-colors">
                Logout
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </header>
          
          <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
