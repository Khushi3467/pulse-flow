import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { PriorityBadge, StatusBadge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { useData } from '../../context/DataContext';
import {
  Calendar,
  Clock,
  User,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  MessageSquare,
  Play,
  Pause,
  Square,
  Send,
  Sparkles,
  AlertCircle,
  CheckSquare,
} from 'lucide-react';

export function TaskDetailModal({ task, isOpen, onClose }) {
  const {
    allTasks,
    members,
    updateTask,
    updateTaskStatus,
    deleteTask,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    addTaskComment,
    logTaskHours,
    activeTimer,
    startTimer,
    pauseTimer,
    stopAndLogTimer,
  } = useData();

  // Always look up the live, reactive task object from global state
  const currentTask = allTasks.find((t) => t.id === task?.id) || task;

  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [manualHours, setManualHours] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(currentTask?.title || '');

  if (!currentTask) return null;

  const assignee = members.find((m) => m.id === currentTask.assigneeId) || members[0];
  const subtasks = currentTask.subtasks || [];
  const completedSubtasks = subtasks.filter((s) => s.completed).length;
  const progressPercent =
    subtasks.length > 0
      ? Math.round((completedSubtasks / subtasks.length) * 100)
      : currentTask.status === 'Done'
      ? 100
      : 0;

  const isCurrentTimerActive = activeTimer && activeTimer.taskId === currentTask.id;

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (newSubtaskTitle.trim()) {
      addSubtask(currentTask.id, newSubtaskTitle.trim());
      setNewSubtaskTitle('');
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (newCommentText.trim()) {
      addTaskComment(currentTask.id, newCommentText.trim(), 'tm-1');
      setNewCommentText('');
    }
  };

  const handleManualLog = (e) => {
    e.preventDefault();
    if (manualHours && !isNaN(parseFloat(manualHours))) {
      logTaskHours(currentTask.id, manualHours);
      setManualHours('');
    }
  };

  const handleSaveTitle = () => {
    if (editTitle.trim() && editTitle !== currentTask.title) {
      updateTask(currentTask.id, { title: editTitle.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete task "${currentTask.title}"?`)) {
      deleteTask(currentTask.id);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Task Specifications & Execution" maxWidth="max-w-3xl">
      <div className="space-y-6">
        {/* Top Hierarchy Breadcrumb & Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/5">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-indigo-400">{currentTask.projectName || 'Project'}</span>
            <span>/</span>
            <span className="text-cyan-400">{currentTask.workPeriodName || 'Work Period'}</span>
            <span>/</span>
            <span className="text-slate-300 font-mono">#{currentTask.id}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Status Dropdown */}
            <select
              value={currentTask.status === 'Backlog' ? 'To Do' : currentTask.status === 'In Review' ? 'In Progress' : currentTask.status}
              onChange={(e) => updateTaskStatus(currentTask.id, e.target.value)}
              className="text-xs bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>

            {/* Priority Dropdown */}
            <select
              value={currentTask.priority}
              onChange={(e) => updateTask(currentTask.id, { priority: e.target.value })}
              className="text-xs bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="Urgent">🔥 Urgent</option>
              <option value="High">⚡ High</option>
              <option value="Medium">🔷 Medium</option>
              <option value="Low">🌱 Low</option>
            </select>
          </div>
        </div>

        {/* Task Title (Editable) */}
        <div>
          {isEditingTitle ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                autoFocus
                className="flex-1 text-lg font-bold bg-slate-900 border border-indigo-500 rounded-xl px-3 py-1.5 text-white focus:outline-none"
              />
              <button
                onClick={handleSaveTitle}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditingTitle(false)}
                className="px-3 py-1.5 text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>
          ) : (
            <h2
              onClick={() => {
                setEditTitle(currentTask.title);
                setIsEditingTitle(true);
              }}
              className="text-xl font-bold text-white hover:text-cyan-300 cursor-pointer transition-colors flex items-center gap-2 group"
              title="Click to edit title"
            >
              <span>{currentTask.title}</span>
              <span className="text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity font-normal">
                (edit)
              </span>
            </h2>
          )}

          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            {currentTask.description || 'No detailed description provided.'}
          </p>
        </div>

        {/* Meta Bar: Assignee, Deadline, Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-white/5">
          <div className="flex items-center gap-2.5">
            <img
              src={assignee?.avatar}
              alt={assignee?.name}
              className="w-8 h-8 rounded-full object-cover border border-indigo-500/30"
            />
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Assignee
              </p>
              <p className="text-xs font-medium text-slate-200">{assignee?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Deadline
              </p>
              <p className="text-xs font-medium text-slate-200">{currentTask.deadline || 'No deadline'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Time Logged
              </p>
              <p className="text-xs font-medium text-cyan-300 font-mono">
                {currentTask.loggedHours || 0}h / {currentTask.estimatedHours || 0}h
              </p>
            </div>
          </div>
        </div>

        {/* Level 5: Subtasks Checklist Section */}
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-semibold text-white">
                Subtasks ({completedSubtasks}/{subtasks.length})
              </h4>
            </div>
            <span className="text-xs font-mono font-medium text-cyan-400">
              {progressPercent}% Complete
            </span>
          </div>

          <ProgressBar progress={progressPercent} size="sm" color="cyan" />

          {/* Subtasks List */}
          <div className="space-y-1.5 pt-1">
            {subtasks.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2 text-center">
                No subtasks created yet. Add one below to breakdown this task.
              </p>
            ) : (
              subtasks.map((st) => (
                <div
                  key={st.id}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                    st.completed
                      ? 'bg-slate-900/40 border-white/5 text-slate-400 line-through'
                      : 'bg-slate-900/80 border-white/10 text-slate-200 hover:border-indigo-500/30'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleSubtask(currentTask.id, st.id)}
                    className="flex items-center gap-2.5 text-left flex-1"
                  >
                    {st.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-500 hover:text-indigo-400 shrink-0" />
                    )}
                    <span className="text-xs sm:text-sm font-medium">{st.title}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteSubtask(currentTask.id, st.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Add Subtask Input */}
          <form onSubmit={handleAddSubtask} className="flex gap-2 pt-1">
            <input
              type="text"
              placeholder="Add next subtask step..."
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              className="flex-1 text-xs bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!newSubtaskTitle.trim()}
              className="px-3.5 py-2 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-medium transition-colors disabled:opacity-40 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Subtask</span>
            </button>
          </form>
        </div>

        {/* Time Tracking Widget */}
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <h4 className="text-sm font-semibold text-white">Time Tracking</h4>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Total: <strong className="text-white">{currentTask.loggedHours || 0} hrs</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            {/* Live Timer Control */}
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-white/10">
              {isCurrentTimerActive ? (
                <>
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping mr-1" />
                  <span className="font-mono text-cyan-300 font-bold text-sm flex-1">
                    Timer Running
                  </span>
                  <button
                    onClick={pauseTimer}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                  >
                    {activeTimer.running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={stopAndLogTimer}
                    className="p-1.5 rounded-lg bg-emerald-600/80 text-white hover:bg-emerald-600"
                    title="Stop & Log"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => startTimer(currentTask.id, currentTask.title)}
                  className="w-full py-1.5 px-3 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-xs font-semibold text-indigo-300 flex items-center justify-center gap-2 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Live Timer</span>
                </button>
              )}
            </div>

            {/* Manual Log Input */}
            <form onSubmit={handleManualLog} className="flex gap-2">
              <input
                type="number"
                step="0.5"
                min="0.25"
                placeholder="Log hrs (e.g. 2.5)"
                value={manualHours}
                onChange={(e) => setManualHours(e.target.value)}
                className="w-full text-xs bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
              />
              <button
                type="submit"
                disabled={!manualHours}
                className="px-3.5 py-2 rounded-xl bg-cyan-600/80 hover:bg-cyan-600 text-white text-xs font-medium transition-colors disabled:opacity-40"
              >
                Log
              </button>
            </form>
          </div>
        </div>

        {/* Activity & Comments Stream */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-purple-400" />
            <h4 className="text-sm font-semibold text-white">
              Discussion & Updates ({(currentTask.comments || []).length})
            </h4>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {(!currentTask.comments || currentTask.comments.length === 0) ? (
              <p className="text-xs text-slate-500 italic py-2 text-center">
                No comments yet. Start the team discussion below.
              </p>
            ) : (
              currentTask.comments.map((c) => {
                const author = members.find((m) => m.id === c.authorId) || members[0];
                return (
                  <div
                    key={c.id}
                    className="flex gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-white/5"
                  >
                    <img
                      src={author?.avatar}
                      alt={author?.name}
                      className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-200">
                          {author?.name}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5 leading-snug">{c.text}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* New Comment Input */}
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              placeholder="Write an update, question, or code review comment..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              className="flex-1 text-xs bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!newCommentText.trim()}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors disabled:opacity-40 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 px-3 py-1.5 rounded-xl transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Task</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
