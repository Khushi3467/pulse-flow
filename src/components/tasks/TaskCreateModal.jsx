import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useData } from '../../context/DataContext';
import { Plus, Trash2, Calendar, Clock, AlertCircle } from 'lucide-react';

export function TaskCreateModal({ isOpen, onClose, defaultWorkPeriodId, defaultProjectId, initialStatus = 'To Do' }) {
  const { currentProjects, members, addTask } = useData();

  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedWorkPeriodId, setSelectedWorkPeriodId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('To Do');
  const [assigneeId, setAssigneeId] = useState('');
  const [deadline, setDeadline] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('8');
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  // Synchronize defaults when modal opens
  useEffect(() => {
    if (isOpen) {
      const projId = defaultProjectId || currentProjects[0]?.id || '';
      setSelectedProjectId(projId);

      const targetProject = currentProjects.find((p) => p.id === projId) || currentProjects[0];
      const wpId =
        defaultWorkPeriodId ||
        targetProject?.workPeriods?.[0]?.id ||
        '';
      setSelectedWorkPeriodId(wpId);

      setAssigneeId(members[0]?.id || 'tm-1');
      setDeadline(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setStatus(initialStatus || 'To Do');
      setEstimatedHours('8');
      setSubtasks([]);
      setNewSubtaskTitle('');
    }
  }, [isOpen, defaultProjectId, defaultWorkPeriodId, currentProjects, members]);

  // When selected project changes, update work period options
  const activeProj = currentProjects.find((p) => p.id === selectedProjectId);
  const workPeriodOptions = activeProj?.workPeriods || [];

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      setSubtasks([
        ...subtasks,
        {
          id: `sub-${Date.now()}`,
          title: newSubtaskTitle.trim(),
          completed: false,
        },
      ]);
      setNewSubtaskTitle('');
    }
  };

  const handleRemoveSubtask = (index) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !selectedWorkPeriodId) return;

    addTask(selectedWorkPeriodId, {
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      assigneeId,
      deadline,
      estimatedHours: parseFloat(estimatedHours) || 4,
      subtasks,
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Task" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Project & Work Period Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Project <span className="text-rose-400">*</span>
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => {
                const newPId = e.target.value;
                setSelectedProjectId(newPId);
                const proj = currentProjects.find((p) => p.id === newPId);
                if (proj && proj.workPeriods?.length > 0) {
                  setSelectedWorkPeriodId(proj.workPeriods[0].id);
                } else {
                  setSelectedWorkPeriodId('');
                }
              }}
              className="w-full text-sm bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            >
              {currentProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Work Period / Pending Work <span className="text-rose-400">*</span>
            </label>
            <select
              value={selectedWorkPeriodId}
              onChange={(e) => setSelectedWorkPeriodId(e.target.value)}
              required
              className="w-full text-sm bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            >
              {workPeriodOptions.length === 0 ? (
                <option value="">No work periods available</option>
              ) : (
                workPeriodOptions.map((wp) => (
                  <option key={wp.id} value={wp.id}>
                    {wp.name} ({wp.type})
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* Task Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Task Title <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g., Design OAuth Login Component"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-sm bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Description
          </label>
          <textarea
            rows={3}
            placeholder="Detailed description, requirements, or test criteria..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-sm bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
          />
        </div>

        {/* Priority, Status, Assignee */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full text-sm bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Urgent">🔥 Urgent</option>
              <option value="High">⚡ High</option>
              <option value="Medium">🔷 Medium</option>
              <option value="Low">🌱 Low</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full text-sm bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Assignee
            </label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full text-sm bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.role.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Deadline & Estimated Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              Deadline
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full text-sm bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Estimated Hours
            </label>
            <input
              type="number"
              min="1"
              max="200"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
              className="w-full text-sm bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Initial Subtasks checklist */}
        <div className="pt-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Initial Subtasks (Level 5)
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Add subtask step (e.g., Wireframe form layout)..."
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSubtask();
                }
              }}
              className="flex-1 text-xs bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddSubtask}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {subtasks.length > 0 && (
            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
              {subtasks.map((st, index) => (
                <div
                  key={st.id || index}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-white/5 text-xs text-slate-300"
                >
                  <span className="truncate">{st.title}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(index)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim() || !selectedWorkPeriodId}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-95 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            Create Task
          </button>
        </div>
      </form>
    </Modal>
  );
}
