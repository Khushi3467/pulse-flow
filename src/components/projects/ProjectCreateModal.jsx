import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useData } from '../../context/DataContext';

export function ProjectCreateModal({ isOpen, onClose }) {
  const { addProject, activeWorkspaceId, members } = useData();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState('Web Application');
  const [description, setDescription] = useState('');
  const [leadId, setLeadId] = useState(members[0]?.id || 'tm-1');
  const [priority, setPriority] = useState('High');
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  );
  const [budgetHours, setBudgetHours] = useState('160');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    addProject(activeWorkspaceId, {
      name: name.trim(),
      code: code.trim() || `PRJ-${Math.floor(100 + Math.random() * 900)}`,
      category,
      description: description.trim(),
      leadId,
      priority,
      deadline,
      budgetHours: parseFloat(budgetHours) || 80,
    });

    setName('');
    setDescription('');
    setCode('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Project" maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Project Name <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g., Campus Robotics Navigation System"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!code) {
                const words = e.target.value.split(' ').filter(Boolean);
                const generatedCode = words.map((w) => w[0]).join('').slice(0, 4).toUpperCase();
                if (generatedCode) setCode(`PRJ-${generatedCode}`);
              }
            }}
            className="w-full text-sm bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Project Identifier Code
            </label>
            <input
              type="text"
              placeholder="e.g., ROB-NAV"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full text-sm bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-sm bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Web Application">Web Application</option>
              <option value="Mobile Application">Mobile Application</option>
              <option value="Machine Learning / AI">Machine Learning / AI</option>
              <option value="Hardware & IoT">Hardware & IoT</option>
              <option value="Security & Infrastructure">Security & Infrastructure</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Scope & Objectives
          </label>
          <textarea
            rows={2}
            placeholder="What will this project accomplish? What are the main deliverables?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-sm bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Project Lead
            </label>
            <select
              value={leadId}
              onChange={(e) => setLeadId(e.target.value)}
              className="w-full text-sm bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

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
              Target Deadline
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full text-sm bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-95 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all"
          >
            Initialize Project
          </button>
        </div>
      </form>
    </Modal>
  );
}
