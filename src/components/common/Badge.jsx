import React from 'react';

export function PriorityBadge({ priority }) {
  const p = (priority || 'Medium').toLowerCase();

  const styles = {
    urgent: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    high: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    medium: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    low: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
  };

  const dots = {
    urgent: 'bg-rose-400 animate-pulse',
    high: 'bg-amber-400',
    medium: 'bg-blue-400',
    low: 'bg-slate-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[p] || styles.medium}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dots[p] || dots.medium}`} />
      <span className="capitalize">{priority}</span>
    </span>
  );
}

export function StatusBadge({ status }) {
  const s = (status || 'To Do').toLowerCase();

  let style = 'bg-slate-800 text-slate-300 border-slate-700';

  if (s.includes('done') || s.includes('complete')) {
    style = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
  } else if (s.includes('progress') || s.includes('active')) {
    style = 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
  } else if (s.includes('review')) {
    style = 'bg-purple-500/15 text-purple-400 border-purple-500/30';
  } else if (s.includes('backlog') || s.includes('planning')) {
    style = 'bg-slate-800/80 text-slate-400 border-slate-700/60';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      <span>{status}</span>
    </span>
  );
}
