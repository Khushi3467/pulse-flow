import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { KanbanBoard } from '../components/kanban/KanbanBoard';
import { Kanban } from 'lucide-react';

export function KanbanPage() {
  const { onSelectTask, onOpenNewTask } = useOutletContext();

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Task Board</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              3 Columns
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize active sprint tasks into <strong>To Do</strong>, <strong>In Progress</strong>, and <strong>Done</strong>.
            Click any task card to open subtasks, discussion, and time tracking.
          </p>
        </div>
      </div>

      {/* Main Kanban Board */}
      <KanbanBoard onSelectTask={onSelectTask} onOpenNewTask={onOpenNewTask} />
    </div>
  );
}
