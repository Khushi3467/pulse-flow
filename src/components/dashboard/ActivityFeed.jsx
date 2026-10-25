import React from 'react';
import { Activity, Clock, CheckCircle2 } from 'lucide-react';
import { useData } from '../../context/DataContext';

export function ActivityFeed() {
  const { activities, members } = useData();

  return (
    <div className="rounded-2xl bg-slate-900/60 border border-white/10 p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">Live Team Activity</h3>
        </div>
        <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Realtime
        </span>
      </div>

      <div className="space-y-3">
        {activities.slice(0, 6).map((act) => {
          const user = members.find((m) => m.id === act.userId) || members[0];

          return (
            <div key={act.id} className="flex items-start gap-3 text-xs">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-7 h-7 rounded-full object-cover border border-slate-700 shrink-0 mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <p className="text-slate-300 leading-snug">
                  <strong className="text-white font-medium">{user?.name}</strong>{' '}
                  <span className="text-slate-400">{act.action}</span>{' '}
                  <span className="text-cyan-300 font-medium">"{act.target}"</span>
                </p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500 font-mono">
                  <span>{act.project}</span>
                  <span>•</span>
                  <span>{act.timestamp}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
