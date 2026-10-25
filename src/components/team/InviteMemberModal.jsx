import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useData } from '../../context/DataContext';

export function InviteMemberModal({ isOpen, onClose }) {
  const { addMember } = useData();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Frontend Engineer');
  const [department, setDepartment] = useState('Computer Science');
  const [workload, setWorkload] = useState('50');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    addMember({
      name: name.trim(),
      email: email.trim(),
      role,
      department,
      workload: parseInt(workload, 10) || 50,
    });

    setName('');
    setEmail('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Team Member" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Full Name <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g., Jordan Blake"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full text-sm bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Email Address <span className="text-rose-400">*</span>
          </label>
          <input
            type="email"
            required
            placeholder="jordan.b@college.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full text-sm bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full text-sm bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Frontend Engineer">Frontend Engineer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Full Stack Lead">Full Stack Lead</option>
              <option value="UI/UX Designer">UI/UX Designer</option>
              <option value="DevOps & Cloud">DevOps & Cloud</option>
              <option value="QA & Testing">QA & Testing</option>
              <option value="AI / ML Researcher">AI / ML Researcher</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Department
            </label>
            <input
              type="text"
              placeholder="Computer Science"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full text-sm bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Initial Workload Capacity ({workload}%)
          </label>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={workload}
            onChange={(e) => setWorkload(e.target.value)}
            className="w-full accent-indigo-500"
          />
        </div>

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
            Add Member
          </button>
        </div>
      </form>
    </Modal>
  );
}
