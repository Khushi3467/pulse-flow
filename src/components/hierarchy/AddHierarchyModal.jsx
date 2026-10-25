import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useData } from '../../context/DataContext';

export function AddHierarchyModal({ isOpen, onClose, targetType, targetParentId, targetParentName }) {
  const { addProject, addWorkPeriod, activeWorkspaceId } = useData();

  // For Project
  const [projName, setProjName] = useState('');
  const [projCategory, setProjCategory] = useState('Web Application');
  const [projDesc, setProjDesc] = useState('');
  const [projDeadline, setProjDeadline] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  );

  // For Work Period
  const [wpName, setWpName] = useState('');
  const [wpType, setWpType] = useState('Sprint');
  const [wpGoal, setWpGoal] = useState('');
  const [wpStartDate, setWpStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [wpEndDate, setWpEndDate] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (targetType === 'project') {
      if (!projName.trim()) return;
      addProject(activeWorkspaceId, {
        name: projName.trim(),
        category: projCategory,
        description: projDesc.trim(),
        deadline: projDeadline,
      });
      setProjName('');
      setProjDesc('');
    } else if (targetType === 'workPeriod') {
      if (!wpName.trim() || !targetParentId) return;
      addWorkPeriod(targetParentId, {
        name: wpName.trim(),
        type: wpType,
        goal: wpGoal.trim(),
        startDate: wpStartDate,
        endDate: wpEndDate,
      });
      setWpName('');
      setWpGoal('');
    }
    onClose();
  };

  const title =
    targetType === 'project'
      ? `Add New Project to Workspace`
      : `Add Work Period to "${targetParentName || 'Project'}"`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {targetType === 'project' ? (
          <>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Project Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Campus Mobile Companion"
                value={projName}
                onChange={(e) => setProjName(e.target.value)}
                className="w-full text-sm bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={projCategory}
                  onChange={(e) => setProjCategory(e.target.value)}
                  className="w-full text-sm bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Web Application">Web Application</option>
                  <option value="Mobile Application">Mobile Application</option>
                  <option value="Machine Learning / AI">Machine Learning / AI</option>
                  <option value="Hardware & IoT">Hardware & IoT</option>
                  <option value="Research & Paper">Research & Paper</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Target Deadline
                </label>
                <input
                  type="date"
                  value={projDeadline}
                  onChange={(e) => setProjDeadline(e.target.value)}
                  className="w-full text-sm bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Description / Scope
              </label>
              <textarea
                rows={2}
                placeholder="Brief objective and purpose of this project..."
                value={projDesc}
                onChange={(e) => setProjDesc(e.target.value)}
                className="w-full text-sm bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Work Period / Sprint Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Sprint 2: Core Authentication or Pending Work"
                value={wpName}
                onChange={(e) => setWpName(e.target.value)}
                className="w-full text-sm bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Type
                </label>
                <select
                  value={wpType}
                  onChange={(e) => setWpType(e.target.value)}
                  className="w-full text-sm bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Sprint">Sprint</option>
                  <option value="Backlog">Pending Backlog</option>
                  <option value="Milestone">Milestone</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Start Date
                </label>
                <input
                  type="date"
                  value={wpStartDate}
                  onChange={(e) => setWpStartDate(e.target.value)}
                  className="w-full text-sm bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  End Date
                </label>
                <input
                  type="date"
                  value={wpEndDate}
                  onChange={(e) => setWpEndDate(e.target.value)}
                  className="w-full text-sm bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Work Period Goal / Objective
              </label>
              <textarea
                rows={2}
                placeholder="What is the team delivering in this period?"
                value={wpGoal}
                onChange={(e) => setWpGoal(e.target.value)}
                className="w-full text-sm bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>
          </>
        )}

        <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white text-xs font-semibold shadow-md hover:opacity-95"
          >
            Confirm & Create
          </button>
        </div>
      </form>
    </Modal>
  );
}
