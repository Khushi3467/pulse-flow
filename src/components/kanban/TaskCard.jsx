import React from 'react';
import { PriorityBadge } from '../common/Badge';
import { CheckSquare, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useData } from '../../context/DataContext';

export function TaskCard({ task, onSelectTask, onMoveStatus }) {
  const { members } = useData();

  const assignee = members.find((m) => m.id === task.assigneeId) || members[0];
  const subtasks = task.subtasks || [];
  const completedSubtasks = subtasks.filter((s) => s.completed).length;

  // Simple 3 standard columns requested by user: To Do, In Progress, Done
  const columns = ['To Do', 'In Progress', 'Done'];
  
  // Normalize current column index
  let normalizedStatus = task.status;
  if (normalizedStatus === 'Backlog') normalizedStatus = 'To Do';
  if (normalizedStatus === 'In Review') normalizedStatus = 'In Progress';
  
  const currentIndex = Math.max(0, columns.indexOf(normalizedStatus));
  const canMoveLeft = currentIndex > 0;
  const canMoveRight = currentIndex < columns.length - 1;

  return (
    <div
      onClick={() => onSelectTask(task)}
      className="group relative rounded-xl bg-slate-900/90 border border-white/10 hover:border-indigo-500/40 p-3.5 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-2.5"
    >
      {/* Top Bar: Priority & Quick Move Arrows */}
      <div className="flex items-center justify-between gap-2">
        <PriorityBadge priority={task.priority} />

        <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          {canMoveLeft && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMoveStatus(task.id, columns[currentIndex - 1]);
              }}
              title={`Move to ${columns[currentIndex - 1]}`}
              className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}
          {canMoveRight && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMoveStatus(task.id, columns[currentIndex + 1]);
              }}
              title={`Move to ${columns[currentIndex + 1]}`}
              className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Task Title */}
      <h4 className="text-xs sm:text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors leading-snug">
        {task.title}
      </h4>

      {/* Project & Sprint Badges */}
      <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400 font-mono">
        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 font-medium shrink-0" title={task.projectName}>
          {task.projectName}
        </span>
        <span className="text-slate-600">•</span>
        <span className="text-slate-300 font-medium" title={task.workPeriodName}>
          {task.workPeriodName}
        </span>
      </div>

      {/* Subtasks checklist progress */}
      {subtasks.length > 0 && (
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-[11px]">
            <CheckSquare className="w-3 h-3 text-cyan-400" />
            <span>
              {completedSubtasks}/{subtasks.length} subtasks
            </span>
          </span>
          <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-400 rounded-full transition-all"
              style={{
                width: `${Math.round((completedSubtasks / subtasks.length) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Footer: Assignee & Hours / Deadline */}
      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <img
            src={assignee?.avatar}
            alt={assignee?.name}
            className="w-4 h-4 rounded-full object-cover border border-slate-700"
          />
          <span className="text-slate-300 font-medium">
            {assignee?.name.split(' ')[0]}
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[10px]">
          {task.loggedHours > 0 && (
            <span className="flex items-center gap-1 text-cyan-400">
              <Clock className="w-3 h-3" />
              <span>{task.loggedHours}h</span>
            </span>
          )}
          {task.deadline && (
            <span className="flex items-center gap-1 text-slate-400">
              <Calendar className="w-3 h-3 text-slate-500" />
              <span>{task.deadline.slice(5)}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
