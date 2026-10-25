import React from 'react';
import { Calendar, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { PriorityBadge } from '../common/Badge';

export function UpcomingDeadlines({ tasks, onSelectTask }) {
  // Sort tasks by deadline
  const pendingWithDeadlines = tasks
    .filter((t) => t.deadline && t.status !== 'Done')
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 5);

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
    <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">Upcoming Deadlines</h3>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          {pendingWithDeadlines.length} Due Soon
        </span>
      </div>

      <div className="space-y-2.5">
        {pendingWithDeadlines.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center italic">
            No upcoming deadlines! Great work.
          </p>
        ) : (
          pendingWithDeadlines.map((task) => {
            const urgency = calculateDaysRemaining(task.deadline);

            return (
              <div
                key={task.id}
                onClick={() => onSelectTask(task)}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-white/5 hover:border-cyan-500/30 transition-all cursor-pointer group"
              >
                <div className="truncate mr-3">
                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={task.priority} />
                    <span className="text-[10px] text-slate-400 font-mono">
                      {task.projectName}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors mt-1 truncate">
                    {task.title}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full font-mono ${
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
  );
}
