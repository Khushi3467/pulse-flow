import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Kanban,
  Users,
  ChevronRight,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { BRAND } from '../../config/brand';
import { useData } from '../../context/DataContext';

export function Sidebar({ mobileOpen, onCloseMobile }) {
  const { currentProjects, allTasks } = useData();

  // Exactly the 4 essential app sections requested by user:
  // 1. Dashboard, 2. Hierarchy / Projects, 3. Task Board, 4. Team & Time Tracking
  const navLinks = [
    {
      to: '/app',
      label: 'Dashboard',
      icon: LayoutDashboard,
      end: true,
    },
    {
      to: '/app/hierarchy',
      label: 'Hierarchy & Projects',
      icon: Layers,
      badge: `${currentProjects.length} Proj`,
      end: false,
    },
    {
      to: '/app/board',
      label: 'Task Board',
      icon: Kanban,
      badge: `${allTasks.length}`,
      end: false,
    },
    {
      to: '/app/team',
      label: 'Team & Time',
      icon: Users,
      end: false,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0a0e1a] border-r border-white/5 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 p-0.5 shadow-md group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0a0e1a] rounded-[6px] flex items-center justify-center">
              <Zap className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                {BRAND.name}
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/15 text-indigo-400 font-mono font-medium border border-indigo-500/20">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400">College Team Edition</p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
          Workspace Menu
        </div>

        {navLinks.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-200 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 text-indigo-400" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400 font-mono">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}

        {/* 5-Level Structure Reference Widget */}
        <div className="pt-6 px-1">
          <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                5-Level Hierarchy
              </span>
              <Link
                to="/app/hierarchy"
                onClick={onCloseMobile}
                className="text-[10px] text-cyan-400 hover:underline flex items-center gap-0.5"
              >
                <span>View</span>
                <ChevronRight className="w-2.5 h-2.5" />
              </Link>
            </div>

            <div className="space-y-1 text-[11px] text-slate-400 font-mono">
              <div className="flex items-center justify-between">
                <span>1. Workspace</span>
                <span className="text-indigo-400">1</span>
              </div>
              <div className="flex items-center justify-between">
                <span>2. Projects</span>
                <span className="text-cyan-400">{currentProjects.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>3. Sprints / Backlog</span>
                <span className="text-purple-400">
                  {currentProjects.reduce((acc, p) => acc + (p.workPeriods?.length || 0), 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>4. Tasks</span>
                <span className="text-emerald-400">{allTasks.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>5. Subtasks</span>
                <span className="text-amber-400">
                  {allTasks.reduce((acc, t) => acc + (t.subtasks?.length || 0), 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Footer / Landing Page Switcher */}
      <div className="p-3 border-t border-white/5 bg-slate-900/30">
        <Link
          to="/"
          className="flex items-center justify-between p-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            <span>Landing Page</span>
          </span>
          <span className="text-[10px] text-slate-500">Demo</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-56 shrink-0 h-screen sticky top-0 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-64 max-w-full z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
