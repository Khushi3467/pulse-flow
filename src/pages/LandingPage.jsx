import React from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  ArrowRight,
  Layers,
  CheckSquare,
  Building2,
  FolderKanban,
  CalendarRange,
  ListChecks,
  Clock,
  Users,
  ChevronRight,
} from 'lucide-react';
import { BRAND } from '../config/brand';

export function LandingPage() {
  const hierarchyNodes = [
    {
      level: 'Level 1',
      title: 'Workspace',
      example: 'College Development Team',
      desc: 'The top-level engineering team or student laboratory hub.',
      icon: Building2,
      color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
    },
    {
      level: 'Level 2',
      title: 'Project',
      example: 'Website Development',
      desc: 'Dedicated deliverables and software products.',
      icon: FolderKanban,
      color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    },
    {
      level: 'Level 3',
      title: 'Work Period / Pending Work',
      example: 'Current Sprint / Sprint 3',
      desc: 'Two-week sprint cycle or prioritized backlog queue.',
      icon: CalendarRange,
      color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
    },
    {
      level: 'Level 4',
      title: 'Task',
      example: 'Create Login Page',
      desc: 'Actionable feature item assigned with deadline & estimated hours.',
      icon: CheckSquare,
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    },
    {
      level: 'Level 5',
      title: 'Subtask',
      example: 'Design Login Form',
      desc: 'Atomic checklist step with checkable verification.',
      icon: ListChecks,
      color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/20 selection:text-indigo-200">
      {/* Simple Top Navigation */}
      <header className="h-16 border-b border-white/5 bg-[#0b0f19]/90 backdrop-blur-md sticky top-0 z-30 px-6 sm:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Zap className="w-4 h-4 text-cyan-300" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-white">{BRAND.name}</span>
            <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-300 font-mono border border-indigo-500/20">
              College Edition
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/app/hierarchy"
            className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors hidden sm:inline-block"
          >
            Hierarchy Tree
          </Link>
          <Link
            to="/app"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <span>Open Application</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 sm:py-16 space-y-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-slate-300 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Interactive Project & Hierarchy Management</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Organize team projects with a clear{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              five-level hierarchy.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Designed for college software development teams to break large initiatives into
            tangible projects, sprints, tasks, and checkable subtasks.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/app"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-md transition-all"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/app/hierarchy"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-200 text-sm font-semibold transition-all"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Explore 5-Level Tree</span>
            </Link>
          </div>
        </div>

        {/* Visual Example of the 5-Level Hierarchy */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                How Work Is Structured: The 5-Level Hierarchy
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Every small subtask cleanly maps up to the overarching workspace objective.
              </p>
            </div>
            <Link
              to="/app/hierarchy"
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-medium"
            >
              <span>Open live interactive tree</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
            {hierarchyNodes.map((node, index) => {
              const Icon = node.icon;
              return (
                <div
                  key={node.level}
                  className="rounded-xl bg-slate-900/80 border border-white/5 p-4 flex flex-col justify-between space-y-3 hover:border-white/15 transition-all"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-semibold text-slate-400">
                        {node.level}
                      </span>
                      <div className={`p-1.5 rounded-lg border ${node.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                        {node.title}
                      </h3>
                      <p className="text-xs text-cyan-300 font-semibold mt-1 leading-snug">
                        {node.example}
                      </p>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed">{node.desc}</p>
                  </div>

                  <div className="pt-2 border-t border-white/5 text-[10px] text-slate-500 font-mono">
                    Tier {index + 1} of 5
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3 Core Focus Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-white/5 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">1. Expandable Hierarchy</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Expand and collapse each level from Workspace down to Subtasks. Create new projects,
              sprints, and tasks at any node.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-white/5 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">2. Simple Task Board</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Organized into three simple columns: <strong>To Do</strong>,{' '}
              <strong>In Progress</strong>, and <strong>Done</strong> with task details and live
              stopwatch timer.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-white/5 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">3. Team & Time Tracking</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track developer workload, hours logged per deliverable, and assignees without complex
              overhead.
            </p>
          </div>
        </div>

        {/* Simple Demonstration CTA */}
        <div className="rounded-2xl bg-slate-900/70 border border-white/10 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Ready to demonstrate your project?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Sample college data is loaded and persistent in browser localStorage.
            </p>
          </div>
          <Link
            to="/app"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shrink-0 shadow-md transition-all"
          >
            Launch Platform Demo
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 px-6 sm:px-12 text-center text-xs text-slate-500">
        <p>
          {BRAND.name} — Built for College Software Teams • 5-Level Hierarchy Engine
        </p>
      </footer>
    </div>
  );
}
