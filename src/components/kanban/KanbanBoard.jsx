import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { TaskCard } from './TaskCard';
import { Plus, Filter, FolderKanban, CalendarRange, CheckCircle2, Clock, ListTodo } from 'lucide-react';

export function KanbanBoard({ onSelectTask, onOpenNewTask }) {
  const { allTasks, currentProjects, updateTaskStatus } = useData();

  const [selectedProjectId, setSelectedProjectId] = useState('ALL');
  const [selectedWorkPeriodId, setSelectedWorkPeriodId] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Available work periods based on project filter
  const availableWorkPeriods = useMemo(() => {
    if (selectedProjectId === 'ALL') {
      const list = [];
      currentProjects.forEach((p) => {
        p.workPeriods?.forEach((wp) => list.push({ ...wp, projectName: p.name }));
      });
      return list;
    }
    const proj = currentProjects.find((p) => p.id === selectedProjectId);
    return proj?.workPeriods || [];
  }, [selectedProjectId, currentProjects]);

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return allTasks.filter((task) => {
      if (selectedProjectId !== 'ALL' && task.projectId !== selectedProjectId) return false;
      if (selectedWorkPeriodId !== 'ALL' && task.workPeriodId !== selectedWorkPeriodId)
        return false;
      if (selectedPriority !== 'ALL' && task.priority !== selectedPriority) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(q);
        const matchesDesc = task.description?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc) return false;
      }
      return true;
    });
  }, [allTasks, selectedProjectId, selectedWorkPeriodId, selectedPriority, searchQuery]);

  // Simple 3 standard columns requested by user: To Do, In Progress, Done
  const columns = [
    {
      id: 'To Do',
      label: 'To Do',
      icon: ListTodo,
      color: 'border-slate-700/80',
      badge: 'bg-slate-800 text-slate-300',
      matcher: (status) => status === 'To Do' || status === 'Backlog',
    },
    {
      id: 'In Progress',
      label: 'In Progress',
      icon: Clock,
      color: 'border-cyan-500/30',
      badge: 'bg-cyan-500/15 text-cyan-300',
      matcher: (status) => status === 'In Progress' || status === 'In Review',
    },
    {
      id: 'Done',
      label: 'Done',
      icon: CheckCircle2,
      color: 'border-emerald-500/30',
      badge: 'bg-emerald-500/15 text-emerald-300',
      matcher: (status) => status === 'Done',
    },
  ];

  // Drag and drop handlers
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      updateTaskStatus(taskId, targetStatus);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-white/5">
        <div className="flex flex-wrap items-center gap-3">
          {/* Project Filter */}
          <div className="flex items-center gap-1.5">
            <FolderKanban className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                setSelectedWorkPeriodId('ALL');
              }}
              className="text-xs bg-slate-800 border border-white/10 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-medium"
            >
              <option value="ALL">All Projects</option>
              {currentProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Work Period Filter */}
          <div className="flex items-center gap-1.5">
            <CalendarRange className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <select
              value={selectedWorkPeriodId}
              onChange={(e) => setSelectedWorkPeriodId(e.target.value)}
              className="text-xs bg-slate-800 border border-white/10 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-purple-500 font-medium max-w-[240px] sm:max-w-[300px]"
            >
              <option value="ALL">All Sprints / Periods</option>
              {availableWorkPeriods.map((wp) => (
                <option key={wp.id} value={wp.id}>
                  {wp.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="text-xs bg-slate-800 border border-white/10 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
          >
            <option value="ALL">All Priorities</option>
            <option value="Urgent">🔥 Urgent</option>
            <option value="High">⚡ High</option>
            <option value="Medium">🔷 Medium</option>
            <option value="Low">🌱 Low</option>
          </select>

          {/* Search */}
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs bg-slate-800 border border-white/10 rounded-lg px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-36 sm:w-44"
          />
        </div>

        {/* New Task CTA */}
        <button
          onClick={() => onOpenNewTask()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Task</span>
        </button>
      </div>

      {/* Simple 3 Column Board: To Do, In Progress, Done with smooth horizontal scrolling on mobile/tablets */}
      <div className="flex md:grid md:grid-cols-3 gap-4 items-start overflow-x-auto pb-4 snap-x">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => col.matcher(t.status));
          const ColIcon = col.icon;

          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`rounded-xl border ${col.color} bg-slate-950/40 p-3.5 min-h-[480px] flex flex-col min-w-[285px] sm:min-w-[310px] md:min-w-0 flex-1 shrink-0 snap-start`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <ColIcon className="w-4 h-4 text-slate-400" />
                  <h3 className="text-xs font-bold text-white tracking-wide uppercase">
                    {col.label}
                  </h3>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${col.badge}`}>
                    {colTasks.length}
                  </span>
                </div>

                <button
                  onClick={() => onOpenNewTask(null, null, col.id)}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title={`Add Task to ${col.label}`}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Tasks in this column */}
              <div className="space-y-3 flex-1">
                {colTasks.length === 0 ? (
                  <div className="h-32 border border-dashed border-white/10 rounded-xl flex items-center justify-center text-xs text-slate-500 italic">
                    Drop tasks here or click + above
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                    >
                      <TaskCard
                        task={task}
                        onSelectTask={onSelectTask}
                        onMoveStatus={updateTaskStatus}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
