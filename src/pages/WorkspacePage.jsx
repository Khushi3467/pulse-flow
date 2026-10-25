import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { HierarchyTree } from '../components/hierarchy/HierarchyTree';
import { Layers, Sparkles, Building2, FolderKanban, CalendarRange, CheckSquare, ListChecks } from 'lucide-react';

export function WorkspacePage() {
  const { onSelectTask, onOpenNewTask } = useOutletContext();

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Five-Level Hierarchy & Projects
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Explore your complete project structure from the college workspace down to individual subtask steps.
              Expand and collapse levels, add items, and check off completed subtasks.
            </p>
          </div>

          {/* Quick Legend Chips */}
          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
              1. Workspace
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
              2. Project
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">
              3. Sprint
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
              4. Task
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
              5. Subtask
            </span>
          </div>
        </div>
      </div>

      {/* Main Hierarchy Tree View */}
      <HierarchyTree onSelectTask={onSelectTask} onOpenNewTask={onOpenNewTask} />
    </div>
  );
}
