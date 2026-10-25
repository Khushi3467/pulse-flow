import React, { useState, useMemo } from 'react';
import {
  Building2,
  FolderKanban,
  CalendarRange,
  CheckSquare,
  ListChecks,
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Circle,
  ExternalLink,
  Clock,
  User,
  Sparkles,
  Filter,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { PriorityBadge, StatusBadge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { AddHierarchyModal } from './AddHierarchyModal';

export function HierarchyTree({ onSelectTask, onOpenNewTask }) {
  const {
    activeWorkspace,
    members,
    toggleSubtask,
    deleteSubtask,
    addSubtask,
    deleteTask,
    deleteWorkPeriod,
    deleteProject,
  } = useData();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('ALL');

  // Track expanded state of nodes: set of IDs
  const [expandedNodes, setExpandedNodes] = useState(() => {
    // Expand workspace and first project by default
    const set = new Set();
    if (activeWorkspace?.id) set.add(activeWorkspace.id);
    activeWorkspace?.projects?.forEach((p, idx) => {
      set.add(p.id);
      if (idx === 0) {
        p.workPeriods?.forEach((wp) => set.add(wp.id));
        p.workPeriods?.[0]?.tasks?.forEach((t) => set.add(t.id));
      }
    });
    return set;
  });

  // Modal state for adding Project or Work Period
  const [hierarchyModal, setHierarchyModal] = useState({
    isOpen: false,
    type: 'project', // 'project' | 'workPeriod'
    parentId: '',
    parentName: '',
  });

  // Inline subtask input tracking by taskId
  const [newSubtaskInputs, setNewSubtaskInputs] = useState({});

  const toggleNode = (id) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    const all = new Set();
    if (activeWorkspace) {
      all.add(activeWorkspace.id);
      activeWorkspace.projects?.forEach((p) => {
        all.add(p.id);
        p.workPeriods?.forEach((wp) => {
          all.add(wp.id);
          wp.tasks?.forEach((t) => all.add(t.id));
        });
      });
    }
    setExpandedNodes(all);
  };

  const collapseAll = () => {
    setExpandedNodes(new Set());
  };

  // Filter projects
  const filteredProjects = useMemo(() => {
    if (!activeWorkspace?.projects) return [];
    let list = activeWorkspace.projects;

    if (selectedProjectId !== 'ALL') {
      list = list.filter((p) => p.id === selectedProjectId);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) => {
        const matchesProj = p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
        const matchesTasks = p.workPeriods?.some((wp) =>
          wp.tasks?.some((t) => t.title.toLowerCase().includes(q))
        );
        return matchesProj || matchesTasks;
      });
    }

    return list;
  }, [activeWorkspace, selectedProjectId, searchQuery]);

  // Overall workspace stats
  const totalTasks = useMemo(() => {
    return (
      activeWorkspace?.projects?.reduce(
        (acc, p) =>
          acc + (p.workPeriods?.reduce((wacc, wp) => wacc + (wp.tasks?.length || 0), 0) || 0),
        0
      ) || 0
    );
  }, [activeWorkspace]);

  const completedTasks = useMemo(() => {
    return (
      activeWorkspace?.projects?.reduce(
        (acc, p) =>
          acc +
          (p.workPeriods?.reduce(
            (wacc, wp) => wacc + (wp.tasks?.filter((t) => t.status === 'Done').length || 0),
            0
          ) || 0),
        0
      ) || 0
    );
  }, [activeWorkspace]);

  const workspaceProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleInlineAddSubtask = (taskId) => {
    const title = newSubtaskInputs[taskId];
    if (title && title.trim()) {
      addSubtask(taskId, title.trim());
      setNewSubtaskInputs((prev) => ({ ...prev, [taskId]: '' }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-white/5 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-3">
          {/* Project Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="text-xs bg-slate-800 border border-white/10 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="ALL">All Projects ({activeWorkspace?.projects?.length || 0})</option>
              {activeWorkspace?.projects?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Filter Search */}
          <input
            type="text"
            placeholder="Search hierarchy items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs bg-slate-800 border border-white/10 rounded-xl px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-48 sm:w-60"
          />
        </div>

        {/* Tree controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Expand All</span>
          </button>
          <button
            onClick={collapseAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            <Minimize2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Collapse All</span>
          </button>
          <button
            onClick={() =>
              setHierarchyModal({
                isOpen: true,
                type: 'project',
                parentId: activeWorkspace?.id,
                parentName: activeWorkspace?.name,
              })
            }
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {/* Main Hierarchy Tree Container */}
      <div className="space-y-4">
        {/* ================= LEVEL 1: WORKSPACE ROOT ================= */}
        <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/40 via-slate-900/60 to-slate-900/80 shadow-2xl overflow-hidden backdrop-blur-md">
          {/* Level 1 Header Card */}
          <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 border-b border-indigo-500/20 bg-indigo-950/30">
            <div className="flex items-center gap-3.5">
              <button
                onClick={() => activeWorkspace && toggleNode(activeWorkspace.id)}
                className="p-1 rounded-lg hover:bg-indigo-500/20 text-indigo-400 transition-colors"
              >
                {expandedNodes.has(activeWorkspace?.id) ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </button>

              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                <Building2 className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Level 1 • Workspace
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    [{activeWorkspace?.code || 'WS'}]
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                  {activeWorkspace?.name || 'Active Workspace'}
                </h3>
              </div>
            </div>

            {/* Workspace Progress & Stats */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                  Overall Completion
                </p>
                <p className="text-sm font-bold font-mono text-indigo-300">
                  {completedTasks} / {totalTasks} Tasks ({workspaceProgress}%)
                </p>
              </div>

              <div className="w-28 sm:w-36">
                <ProgressBar progress={workspaceProgress} size="sm" color="indigo" />
              </div>

              <button
                onClick={() =>
                  setHierarchyModal({
                    isOpen: true,
                    type: 'project',
                    parentId: activeWorkspace?.id,
                    parentName: activeWorkspace?.name,
                  })
                }
                className="px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-xs font-medium text-indigo-200 flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Add Project</span>
              </button>
            </div>
          </div>

          {/* Level 1 Description */}
          {activeWorkspace?.description && (
            <div className="px-5 py-2.5 bg-slate-900/40 text-xs text-slate-400 border-b border-white/5">
              {activeWorkspace.description}
            </div>
          )}

          {/* ================= LEVEL 2: PROJECTS LIST ================= */}
          {expandedNodes.has(activeWorkspace?.id) && (
            <div className="p-3 sm:p-5 space-y-4">
              {filteredProjects.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">
                  No projects match your filter. Click "+ Add Project" to create one.
                </div>
              ) : (
                filteredProjects.map((proj) => {
                  const isProjExpanded = expandedNodes.has(proj.id);
                  const projLead = members.find((m) => m.id === proj.leadId) || members[0];

                  // Project task calculations
                  const projTasks = [];
                  proj.workPeriods?.forEach((wp) => projTasks.push(...(wp.tasks || [])));
                  const projDone = projTasks.filter((t) => t.status === 'Done').length;
                  const projPercent =
                    projTasks.length > 0 ? Math.round((projDone / projTasks.length) * 100) : 0;

                  return (
                    <div
                      key={proj.id}
                      className="rounded-2xl border border-cyan-500/20 bg-slate-900/70 overflow-hidden shadow-lg transition-all"
                    >
                      {/* Project Header */}
                      <div className="p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/5 bg-slate-800/40 hover:bg-slate-800/60 transition-colors">
                        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                          <button
                            onClick={() => toggleNode(proj.id)}
                            className="p-1 rounded-lg text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                          >
                            {isProjExpanded ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>

                          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shrink-0 shadow-md">
                            <FolderKanban className="w-4 h-4" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.2 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shrink-0">
                                Level 2 • Project
                              </span>
                              <span className="text-xs text-slate-400 hidden sm:inline truncate">
                                {proj.category}
                              </span>
                            </div>
                            <h4 className="text-sm sm:text-base font-bold text-white mt-0.5 break-words">
                              {proj.name}
                            </h4>
                          </div>
                        </div>

                        {/* Project Actions & Progress */}
                        <div className="flex items-center gap-3">
                          <div className="text-right hidden sm:block">
                            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                              Progress
                            </span>
                            <span className="text-xs font-mono font-bold text-cyan-300">
                              {projDone}/{projTasks.length} ({projPercent}%)
                            </span>
                          </div>

                          <div className="w-24 sm:w-28">
                            <ProgressBar progress={projPercent} size="sm" color="cyan" />
                          </div>

                          {/* Add Work Period button */}
                          <button
                            onClick={() =>
                              setHierarchyModal({
                                isOpen: true,
                                type: 'workPeriod',
                                parentId: proj.id,
                                parentName: proj.name,
                              })
                            }
                            className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-xs font-medium text-cyan-300 flex items-center gap-1 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                            <span className="hidden md:inline">Work Period</span>
                          </button>

                          {/* Delete Project */}
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete project "${proj.name}"?`)) {
                                deleteProject(proj.id);
                              }
                            }}
                            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
                            title="Delete Project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* ================= LEVEL 3: WORK PERIODS LIST ================= */}
                      {isProjExpanded && (
                        <div className="p-3 sm:p-4 space-y-3 pl-4 sm:pl-8 border-l-2 border-cyan-500/20 ml-4 sm:ml-6 my-2">
                          {(proj.workPeriods || []).length === 0 ? (
                            <div className="p-4 rounded-xl bg-slate-900/40 text-xs text-slate-500 italic text-center">
                              No work periods yet. Click "+ Work Period" above to create one.
                            </div>
                          ) : (
                            proj.workPeriods.map((wp) => {
                              const isWpExpanded = expandedNodes.has(wp.id);
                              const wpTasks = wp.tasks || [];
                              const wpDone = wpTasks.filter((t) => t.status === 'Done').length;
                              const wpPercent =
                                wpTasks.length > 0
                                  ? Math.round((wpDone / wpTasks.length) * 100)
                                  : 0;

                              return (
                                <div
                                  key={wp.id}
                                  className="rounded-xl border border-purple-500/20 bg-slate-900/60 overflow-hidden shadow"
                                >
                                  {/* Work Period Header */}
                                  <div className="p-3 flex flex-wrap items-center justify-between gap-3 bg-purple-950/20 border-b border-white/5">
                                    <div className="flex items-center gap-2.5 flex-1 min-w-[180px]">
                                      <button
                                        onClick={() => toggleNode(wp.id)}
                                        className="p-1 rounded-md text-purple-400 hover:bg-purple-500/20 transition-colors"
                                      >
                                        {isWpExpanded ? (
                                          <ChevronDown className="w-4 h-4" />
                                        ) : (
                                          <ChevronRight className="w-4 h-4" />
                                        )}
                                      </button>

                                      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shrink-0">
                                        <CalendarRange className="w-3.5 h-3.5" />
                                      </div>

                                      <div className="truncate">
                                        <div className="flex items-center gap-2">
                                          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                            Level 3 • Work Period
                                          </span>
                                          <span className="text-[10px] text-slate-400 font-mono">
                                            {wp.type}
                                          </span>
                                        </div>
                                        <h5 className="text-xs sm:text-sm font-semibold text-white mt-0.5 truncate">
                                          {wp.name}
                                        </h5>
                                      </div>
                                    </div>

                                    {/* Work Period Actions & Progress */}
                                    <div className="flex items-center gap-2.5">
                                      <span className="text-[11px] font-mono text-purple-300 font-medium hidden sm:inline">
                                        {wpDone}/{wpTasks.length} ({wpPercent}%)
                                      </span>

                                      <div className="w-20">
                                        <ProgressBar progress={wpPercent} size="xs" color="indigo" />
                                      </div>

                                      {/* Add Task directly to this Work Period */}
                                      <button
                                        onClick={() => onOpenNewTask(wp.id, proj.id)}
                                        className="px-2 py-0.8 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-[11px] font-semibold text-indigo-300 flex items-center gap-1 transition-colors"
                                      >
                                        <Plus className="w-3 h-3" />
                                        <span>Add Task</span>
                                      </button>

                                      {/* Delete Work Period */}
                                      <button
                                        onClick={() => {
                                          if (window.confirm(`Delete work period "${wp.name}"?`)) {
                                            deleteWorkPeriod(wp.id);
                                          }
                                        }}
                                        className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                                        title="Delete Work Period"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Work Period Goal */}
                                  {wp.goal && (
                                    <div className="px-3 py-1.5 bg-slate-900/50 text-[11px] text-slate-400 italic border-b border-white/5">
                                      Goal: {wp.goal}
                                    </div>
                                  )}

                                  {/* ================= LEVEL 4: TASKS LIST ================= */}
                                  {isWpExpanded && (
                                    <div className="p-2 sm:p-3 space-y-2 pl-3 sm:pl-6 border-l-2 border-purple-500/20 ml-3 sm:ml-5 my-1.5">
                                      {wpTasks.length === 0 ? (
                                        <div className="p-3 text-center text-[11px] text-slate-500 italic">
                                          No tasks in this period. Click "+ Add Task" to schedule work.
                                        </div>
                                      ) : (
                                        wpTasks.map((task) => {
                                          const isTaskExpanded = expandedNodes.has(task.id);
                                          const assignee =
                                            members.find((m) => m.id === task.assigneeId) ||
                                            members[0];
                                          const subtasks = task.subtasks || [];
                                          const completedSubtasks = subtasks.filter(
                                            (s) => s.completed
                                          ).length;

                                          return (
                                            <div
                                              key={task.id}
                                              className="rounded-xl border border-white/5 bg-slate-900/80 hover:border-indigo-500/30 transition-all shadow-sm"
                                            >
                                              {/* Task Row */}
                                              <div className="p-2.5 flex flex-wrap items-center justify-between gap-2.5">
                                                <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                                                  {subtasks.length > 0 ? (
                                                    <button
                                                      onClick={() => toggleNode(task.id)}
                                                      className="p-1 text-indigo-400 hover:bg-slate-800 rounded transition-colors"
                                                    >
                                                      {isTaskExpanded ? (
                                                        <ChevronDown className="w-3.5 h-3.5" />
                                                      ) : (
                                                        <ChevronRight className="w-3.5 h-3.5" />
                                                      )}
                                                    </button>
                                                  ) : (
                                                    <div className="w-5" />
                                                  )}

                                                  <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />

                                                  <div className="truncate flex-1">
                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                                                        Level 4 • Task
                                                      </span>
                                                      <PriorityBadge priority={task.priority} />
                                                      <StatusBadge status={task.status} />
                                                    </div>
                                                    <p
                                                      onClick={() =>
                                                        onSelectTask({
                                                          ...task,
                                                          projectName: proj.name,
                                                          workPeriodName: wp.name,
                                                        })
                                                      }
                                                      className="text-xs sm:text-sm font-semibold text-slate-100 hover:text-cyan-300 cursor-pointer transition-colors mt-0.5 truncate"
                                                    >
                                                      {task.title}
                                                    </p>
                                                  </div>
                                                </div>

                                                {/* Task Meta & Controls */}
                                                <div className="flex items-center gap-2.5">
                                                  {/* Assignee Avatar */}
                                                  <div
                                                    className="flex items-center gap-1.5 text-xs text-slate-400"
                                                    title={`Assigned to ${assignee?.name}`}
                                                  >
                                                    <img
                                                      src={assignee?.avatar}
                                                      alt={assignee?.name}
                                                      className="w-5 h-5 rounded-full object-cover border border-slate-700"
                                                    />
                                                    <span className="hidden xl:inline text-[11px]">
                                                      {assignee?.name.split(' ')[0]}
                                                    </span>
                                                  </div>

                                                  {/* Subtasks Count Badge */}
                                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                                                    {completedSubtasks}/{subtasks.length} subtasks
                                                  </span>

                                                  {/* Open Task Details */}
                                                  <button
                                                    onClick={() =>
                                                      onSelectTask({
                                                        ...task,
                                                        projectName: proj.name,
                                                        workPeriodName: wp.name,
                                                      })
                                                    }
                                                    className="p-1 rounded text-slate-400 hover:text-cyan-300 transition-colors"
                                                    title="Open Details & Timer"
                                                  >
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                  </button>

                                                  {/* Delete Task */}
                                                  <button
                                                    onClick={() => {
                                                      if (
                                                        window.confirm(
                                                          `Delete task "${task.title}"?`
                                                        )
                                                      ) {
                                                        deleteTask(task.id);
                                                      }
                                                    }}
                                                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                                                  >
                                                    <Trash2 className="w-3 h-3" />
                                                  </button>
                                                </div>
                                              </div>

                                              {/* ================= LEVEL 5: SUBTASKS LIST ================= */}
                                              {isTaskExpanded && (
                                                <div className="p-2.5 bg-slate-950/60 border-t border-white/5 space-y-1.5 pl-4 sm:pl-8 border-l-2 border-emerald-500/20 ml-4 sm:ml-6 my-1">
                                                  <div className="flex items-center justify-between pb-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                                    <span className="flex items-center gap-1.5">
                                                      <ListChecks className="w-3 h-3 text-amber-400" />
                                                      Level 5 • Subtasks ({completedSubtasks}/
                                                      {subtasks.length})
                                                    </span>
                                                  </div>

                                                  {subtasks.map((st) => (
                                                    <div
                                                      key={st.id}
                                                      className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-slate-900 text-xs text-slate-300 group"
                                                    >
                                                      <button
                                                        type="button"
                                                        onClick={() =>
                                                          toggleSubtask(task.id, st.id)
                                                        }
                                                        className="flex items-center gap-2 text-left flex-1"
                                                      >
                                                        {st.completed ? (
                                                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                                        ) : (
                                                          <Circle className="w-3.5 h-3.5 text-slate-500 hover:text-emerald-400 shrink-0" />
                                                        )}
                                                        <span
                                                          className={
                                                            st.completed
                                                              ? 'line-through text-slate-500'
                                                              : 'text-slate-200'
                                                          }
                                                        >
                                                          {st.title}
                                                        </span>
                                                      </button>

                                                      <button
                                                        type="button"
                                                        onClick={() =>
                                                          deleteSubtask(task.id, st.id)
                                                        }
                                                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                                                      >
                                                        <Trash2 className="w-3 h-3" />
                                                      </button>
                                                    </div>
                                                  ))}

                                                  {/* Inline Add Subtask Input */}
                                                  <div className="flex gap-2 pt-1.5">
                                                    <input
                                                      type="text"
                                                      placeholder="Add subtask step (hit Enter)..."
                                                      value={newSubtaskInputs[task.id] || ''}
                                                      onChange={(e) =>
                                                        setNewSubtaskInputs({
                                                          ...newSubtaskInputs,
                                                          [task.id]: e.target.value,
                                                        })
                                                      }
                                                      onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                          e.preventDefault();
                                                          handleInlineAddSubtask(task.id);
                                                        }
                                                      }}
                                                      className="flex-1 text-[11px] bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                                                    />
                                                    <button
                                                      type="button"
                                                      onClick={() =>
                                                        handleInlineAddSubtask(task.id)
                                                      }
                                                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium"
                                                    >
                                                      Add
                                                    </button>
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          );
                                        })
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Project / Work Period Modal */}
      <AddHierarchyModal
        isOpen={hierarchyModal.isOpen}
        onClose={() => setHierarchyModal({ ...hierarchyModal, isOpen: false })}
        targetType={hierarchyModal.type}
        targetParentId={hierarchyModal.parentId}
        targetParentName={hierarchyModal.parentName}
      />
    </div>
  );
}
