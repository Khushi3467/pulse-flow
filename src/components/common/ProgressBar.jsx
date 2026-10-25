import React from 'react';

export function ProgressBar({ progress = 0, size = 'md', showLabel = false, color = 'indigo' }) {
  const clamped = Math.min(100, Math.max(0, Math.round(progress)));

  const sizeClasses = {
    xs: 'h-1.5',
    sm: 'h-2',
    md: 'h-2.5',
    lg: 'h-3.5',
  };

  const gradientColors = {
    indigo: 'from-violet-500 via-indigo-500 to-cyan-400',
    cyan: 'from-cyan-500 to-blue-500',
    emerald: 'from-emerald-500 to-teal-400',
    amber: 'from-amber-500 to-orange-400',
  };

  return (
    <div className="w-full">
      <div className={`w-full bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-white/5 ${sizeClasses[size] || sizeClasses.md}`}>
        <div
          className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ease-out ${
            gradientColors[color] || gradientColors.indigo
          }`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between items-center mt-1 text-xs text-slate-400 font-medium">
          <span>Progress</span>
          <span className="text-slate-200">{clamped}%</span>
        </div>
      )}
    </div>
  );
}
