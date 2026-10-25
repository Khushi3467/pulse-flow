import React, { useMemo } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ProgressBar } from '../components/common/ProgressBar';
import { PriorityBadge } from '../components/common/Badge';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  Layers,
  Plus,
  ArrowRight,
  Calendar,
  AlertCircle,
  Activity,
} from 'lucide-react';

export function DashboardPage() {
  const { onSelectTask, onOpenNewTask } = useOutletContext();
  const { activeWorkspace, currentProjects, allTasks, activities, members } = useData();

  // Metrics requested: Total projects, pending tasks, completed tasks, upcoming deadlines
  const totalProjects = currentProjects.length;
  const completedTasks = allTasks.filter((t) => t.status === 'Done').length;
  const pendingTasks = allTasks.filter((t) => t.status !== 'Done').length;

  // Upcoming deadlines sorted by nearest date
  const upcomingDeadlines = useMemo(() => {
    return allTasks
      .filter((t) => t.deadline && t.status !== 'Done')
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 4);
  }, [allTasks]);

  const calculateDaysRemaining = (deadlineStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(deadlineStr);
    deadline.setHours(0, 0, 0, 0);
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: `${Math.abs(diffDays)}d overdue`, urgent: true };
    if (diffDays === 0) return { text: 'Due today', urgent: true };
    if (diffDays === 1) return { text: 'Due tomorrow', urgent: true };
    return { text: `In ${diffDays} days`, urgent: diffDays <= 3 };
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900/60 border border-white/5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Team Workspace Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Active workspace: <strong className="text-slate-200">{activeWorkspace?.name}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onOpenNewTask()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
          <Link
            to="/app/hierarchy"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-white/5 transition-all"
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>View Hierarchy</span>
          </Link>
        </div>
      </div>

      {/* Useful Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Projects */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Projects</span>
            <FolderKanban className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-white">{totalProjects}</p>
          <p className="text-[11px] text-slate-500">Active university initiatives</p>
        </div>

        {/* Metric 2: Pending Tasks */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Pending Tasks</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-amber-400">{pendingTasks}</p>
          <p className="text-[11px] text-slate-500">In sprint backlog or in progress</p>
        </div>

        {/* Metric 3: Completed Tasks */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Completed Tasks</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-400">{completedTasks}</p>
          <p className="text-[11px] text-slate-500">
            {allTasks.length > 0 ? Math.round((completedTasks / allTasks.length) * 100) : 0}% completion rate
          </p>
        </div>

        {/* Metric 4: Upcoming Deadlines count */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Upcoming Deadlines</span>
            <Calendar className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-indigo-300">
            {upcomingDeadlines.length}
          </p>
          <p className="text-[11px] text-slate-500">Due within current sprints</p>
        </div>
      </div>

      {/* Two Column Section: Project Progress & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Progress Overview */}
        <div className="rounded-xl bg-slate-900/60 border border-white/5 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-cyan-400" />
              <span>Project Deliverables & Progress</span>
            </h3>
            <Link
              to="/app/hierarchy"
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
            >
              <span>See All Hierarchy</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {currentProjects.map((p) => {
              const projTasks = [];
              p.workPeriods?.forEach((wp) => projTasks.push(...(wp.tasks || [])));
              const done = projTasks.filter((t) => t.status === 'Done').length;
              const percent = projTasks.length > 0 ? Math.round((done / projTasks.length) * 100) : 0;

              return (
                <div
                  key={p.id}
                  className="p-3 rounded-lg bg-slate-800/40 border border-white/5 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-white">{p.name}</span>
                      <span className="ml-2 text-[10px] text-slate-400 font-mono">[{p.code}]</span>
                    </div>
                    <span className="font-mono text-cyan-300 font-medium">
                      {done}/{projTasks.length} ({percent}%)
                    </span>
                  </div>
                  <ProgressBar progress={percent} size="xs" color="cyan" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Deadlines Widget */}
        <div className="rounded-xl bg-slate-900/60 border border-white/5 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>Upcoming Deadlines</span>
            </h3>
            <Link
              to="/app/board"
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
            >
              <span>Task Board</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {upcomingDeadlines.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center italic">
                No upcoming deadlines scheduled.
              </p>
            ) : (
              upcomingDeadlines.map((task) => {
                const urgency = calculateDaysRemaining(task.deadline);
                return (
                  <div
                    key={task.id}
                    onClick={() => onSelectTask(task)}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/40 hover:bg-slate-800 border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer group text-xs"
                  >
                    <div className="truncate mr-3">
                      <div className="flex items-center gap-2">
                        <PriorityBadge priority={task.priority} />
                        <span className="text-[10px] text-slate-400 font-mono">
                          {task.projectName}
                        </span>
                      </div>
                      <p className="font-medium text-slate-200 group-hover:text-cyan-300 transition-colors mt-1 truncate">
                        {task.title}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                          urgency.urgent
                            ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {urgency.text}
                      </span>
                      <p className="text-[10px] text-slate-500 mt-0.5">{task.deadline}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Recent Team Activity Feed */}
      <div className="rounded-xl bg-slate-900/60 border border-white/5 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Recent Activity</span>
          </h3>
          <span className="text-[10px] text-slate-500 font-mono">Live updates</span>
        </div>

        <div className="space-y-2.5">
          {activities.slice(0, 4).map((act) => {
            const user = members.find((m) => m.id === act.userId) || members[0];
            return (
              <div key={act.id} className="flex items-center gap-3 text-xs">
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-6 h-6 rounded-full object-cover border border-slate-700 shrink-0"
                />
                <div className="flex-1 truncate">
                  <span className="font-semibold text-white">{user?.name}</span>{' '}
                  <span className="text-slate-400">{act.action}</span>{' '}
                  <span className="text-cyan-300 font-medium">"{act.target}"</span>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0 font-mono">
                  {act.timestamp}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
