import React from 'react';
import { Mail, CheckCircle2, Clock, CheckSquare, Briefcase } from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';

export function MemberCard({ member, assignedTasks = [] }) {
  const activeTasks = assignedTasks.filter((t) => t.status !== 'Done');
  const completedTasks = assignedTasks.filter((t) => t.status === 'Done');

  // Workload color
  let workloadColor = 'emerald';
  if (member.workload >= 80) workloadColor = 'amber';
  if (member.workload >= 90) workloadColor = 'rose';

  return (
    <div className="rounded-2xl bg-slate-900/70 border border-white/10 hover:border-indigo-500/40 p-5 shadow-xl hover:shadow-2xl hover:shadow-indigo-950/40 transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Header: Avatar, Name, Status */}
        <div className="flex items-start gap-3.5">
          <div className="relative">
            <img
              src={member.avatar}
              alt={member.name}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-indigo-500/30 shadow-md"
            />
            <span
              className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#090d16] ${
                member.status === 'online'
                  ? 'bg-emerald-400'
                  : member.status === 'away'
                  ? 'bg-amber-400'
                  : 'bg-slate-500'
              }`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                {member.name}
              </h3>
              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                {member.department.split(' ')[0]}
              </span>
            </div>
            <p className="text-xs text-indigo-300 font-medium leading-snug mt-0.5">
              {member.role}
            </p>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">{member.email}</p>
          </div>
        </div>

        {/* Workload Capacity Meter */}
        <div className="mt-5 p-3 rounded-xl bg-slate-800/40 border border-white/5 space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Sprint Capacity</span>
            <span
              className={`font-mono font-bold ${
                member.workload >= 85 ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {member.workload}%
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                member.workload >= 85
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                  : 'bg-gradient-to-r from-cyan-500 to-emerald-400'
              }`}
              style={{ width: `${member.workload}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-500 text-right">
            {member.workload >= 85 ? 'High load • Near max bandwidth' : 'Optimal load • Available'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mt-3 text-center">
          <div className="p-2 rounded-xl bg-slate-800/30 border border-white/5">
            <p className="text-[10px] text-slate-400 uppercase">Assigned</p>
            <p className="text-sm font-bold font-mono text-white mt-0.5">
              {assignedTasks.length}
            </p>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/30 border border-white/5">
            <p className="text-[10px] text-slate-400 uppercase">Completed</p>
            <p className="text-sm font-bold font-mono text-emerald-400 mt-0.5">
              {member.tasksCompleted || completedTasks.length}
            </p>
          </div>
          <div className="p-2 rounded-xl bg-slate-800/30 border border-white/5">
            <p className="text-[10px] text-slate-400 uppercase">Hours</p>
            <p className="text-sm font-bold font-mono text-cyan-400 mt-0.5">
              {member.hoursTracked || 0}h
            </p>
          </div>
        </div>
      </div>

      {/* Active Tasks list */}
      <div className="mt-4 pt-3 border-t border-white/5">
        <p className="text-[11px] font-semibold text-slate-400 mb-2">
          Current Focus ({activeTasks.length})
        </p>
        {activeTasks.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-1">No active tasks assigned.</p>
        ) : (
          <div className="space-y-1.5">
            {activeTasks.slice(0, 2).map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-slate-800/40 text-slate-300"
              >
                <span className="truncate pr-2">{t.title}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300 shrink-0">
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
