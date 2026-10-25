import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';
import { BarChart3, TrendingUp, Clock, CheckCircle2, AlertTriangle, Zap } from 'lucide-react';

export function AnalyticsPage() {
  const { currentProjects, allTasks, members } = useData();

  // 1. Task Status Distribution (Pie Data)
  const statusData = useMemo(() => {
    const counts = {
      Done: 0,
      'In Progress': 0,
      'In Review': 0,
      'To Do': 0,
      Backlog: 0,
    };
    allTasks.forEach((t) => {
      if (counts[t.status] !== undefined) counts[t.status]++;
      else counts['To Do']++;
    });

    return [
      { name: 'Done', value: counts.Done, color: '#10b981' },
      { name: 'In Progress', value: counts['In Progress'], color: '#06b6d4' },
      { name: 'In Review', value: counts['In Review'], color: '#8b5cf6' },
      { name: 'To Do', value: counts['To Do'], color: '#f59e0b' },
      { name: 'Backlog', value: counts.Backlog, color: '#64748b' },
    ].filter((d) => d.value > 0);
  }, [allTasks]);

  // 2. Project Progress Bar Data
  const projectProgressData = useMemo(() => {
    return currentProjects.map((p) => {
      const projTasks = [];
      p.workPeriods?.forEach((wp) => projTasks.push(...(wp.tasks || [])));
      const completed = projTasks.filter((t) => t.status === 'Done').length;
      const total = projTasks.length;
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

      return {
        name: p.name.length > 18 ? p.name.slice(0, 16) + '...' : p.name,
        completed,
        total,
        progress: percent,
      };
    });
  }, [currentProjects]);

  // 3. Member Hours & Workload Data
  const memberWorkloadData = useMemo(() => {
    return members.map((m) => {
      const assigned = allTasks.filter((t) => t.assigneeId === m.id);
      const hours = assigned.reduce((acc, t) => acc + (t.loggedHours || 0), 0);

      return {
        name: m.name.split(' ')[0],
        hours: Number(hours.toFixed(1)),
        tasks: assigned.length,
        workload: m.workload,
      };
    });
  }, [members, allTasks]);

  // 4. Sprint Velocity Timeline (Simulated cycle velocity)
  const velocityTimelineData = [
    { sprint: 'Sprint 1', planned: 20, completed: 18, efficiency: 90 },
    { sprint: 'Sprint 2', planned: 24, completed: 22, efficiency: 92 },
    { sprint: 'Current (Sprint 3)', planned: 28, completed: 26, efficiency: 93 },
    { sprint: 'Upcoming (Sprint 4)', planned: 30, completed: 8, efficiency: 65 },
  ];

  const totalLoggedHours = allTasks.reduce((acc, t) => acc + (t.loggedHours || 0), 0).toFixed(1);
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter((t) => t.status === 'Done').length;
  const overallRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Custom Dark Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0f172a] border border-white/10 rounded-xl p-3 shadow-xl text-xs space-y-1">
          <p className="font-bold text-white mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color || entry.fill }}>
              {entry.name}: <strong className="font-mono">{entry.value}</strong>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Engineering Analytics & Velocity
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Quantitative telemetry across project deliverables, member bandwidth, and sprint execution.
        </p>
      </div>

      {/* KPI Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Overall Completion Rate
          </span>
          <p className="text-2xl font-extrabold text-white mt-1 font-mono">{overallRate}%</p>
          <p className="text-xs text-emerald-400 mt-0.5 font-medium">
            {completedTasks} of {totalTasks} tasks finished
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Tracked Engineering Time
          </span>
          <p className="text-2xl font-extrabold text-cyan-400 mt-1 font-mono">
            {totalLoggedHours} hrs
          </p>
          <p className="text-xs text-slate-400 mt-0.5">Across all sprint cycles</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Sprint Velocity Index
          </span>
          <p className="text-2xl font-extrabold text-indigo-400 mt-1 font-mono">92.4 pts</p>
          <p className="text-xs text-indigo-300 mt-0.5">+4.8% vs last sprint</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Team Health
          </span>
          <p className="text-2xl font-extrabold text-emerald-400 mt-1 font-mono">Optimal</p>
          <p className="text-xs text-slate-400 mt-0.5">Zero blocked critical paths</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Project Progress Comparison */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Project Task Velocity</h3>
              <p className="text-xs text-slate-400">Completed vs Planned deliverables per project</p>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 font-semibold">Live Data</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectProgressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                <Bar dataKey="completed" name="Completed Tasks" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="total" name="Total Tasks" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Task Status Distribution */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Task Status Breakdown</h3>
              <p className="text-xs text-slate-400">Current state across the entire workspace</p>
            </div>
            <span className="text-[11px] font-mono text-indigo-400 font-semibold">
              {allTasks.length} Total
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Sprint Velocity Trend */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Sprint Velocity & Burndown</h3>
              <p className="text-xs text-slate-400">Planned capacity vs actual delivered points</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={velocityTimelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPlanned" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="sprint" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                <Area
                  type="monotone"
                  dataKey="planned"
                  name="Planned Velocity"
                  stroke="#8b5cf6"
                  fillOpacity={1}
                  fill="url(#colorPlanned)"
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  name="Completed Velocity"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorCompleted)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Member Workload & Logged Hours */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Developer Logged Hours</h3>
              <p className="text-xs text-slate-400">Accumulated time tracked per team member</p>
            </div>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={memberWorkloadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                <Bar dataKey="hours" name="Hours Logged" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="tasks" name="Active Tasks" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
