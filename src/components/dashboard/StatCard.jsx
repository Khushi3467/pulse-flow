import React from 'react';

export function StatCard({ title, value, change, trend = 'up', icon: Icon, color = 'indigo' }) {
  const colorSchemes = {
    indigo: {
      border: 'hover:border-indigo-500/40',
      bg: 'from-indigo-600/10 to-transparent',
      iconBg: 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30',
      text: 'text-indigo-400',
    },
    cyan: {
      border: 'hover:border-cyan-500/40',
      bg: 'from-cyan-600/10 to-transparent',
      iconBg: 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/30',
      text: 'text-cyan-400',
    },
    purple: {
      border: 'hover:border-purple-500/40',
      bg: 'from-purple-600/10 to-transparent',
      iconBg: 'bg-purple-600/20 text-purple-400 border border-purple-500/30',
      text: 'text-purple-400',
    },
    emerald: {
      border: 'hover:border-emerald-500/40',
      bg: 'from-emerald-600/10 to-transparent',
      iconBg: 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30',
      text: 'text-emerald-400',
    },
  };

  const scheme = colorSchemes[color] || colorSchemes.indigo;

  return (
    <div
      className={`relative rounded-2xl bg-gradient-to-br ${scheme.bg} bg-slate-900/60 border border-white/10 ${scheme.border} p-5 backdrop-blur-xl shadow-xl transition-all duration-300 hover:-translate-y-1 group`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
        <div className={`p-2 rounded-xl ${scheme.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {value}
        </span>
        {change && (
          <span
            className={`text-xs font-semibold ${
              trend === 'up' ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
