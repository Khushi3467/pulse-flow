import React, { useState, useMemo } from 'react';
import { Search, X, CheckSquare, FolderKanban, Users, ArrowRight } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';

export function SearchModal({ isOpen, onClose, onSelectTask }) {
  const [query, setQuery] = useState('');
  const { allTasks, currentProjects, members } = useData();
  const navigate = useNavigate();

  const results = useMemo(() => {
    if (!query.trim()) return { tasks: [], projects: [], members: [] };
    const q = query.toLowerCase();

    return {
      tasks: allTasks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.projectName?.toLowerCase().includes(q)
      ).slice(0, 5),
      projects: currentProjects.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      ).slice(0, 4),
      members: members.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.role?.toLowerCase().includes(q) ||
          m.department?.toLowerCase().includes(q)
      ).slice(0, 3),
    };
  }, [query, allTasks, currentProjects, members]);

  const hasResults =
    results.tasks.length > 0 || results.projects.length > 0 || results.members.length > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      <div className="relative w-full max-w-2xl bg-[#0d1322] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 bg-slate-900/60">
          <Search className="w-5 h-5 text-indigo-400 mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Search projects, tasks, hierarchy, team members..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent border-none text-slate-100 placeholder-slate-400 focus:outline-none text-base"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="ml-2 text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
            ESC
          </span>
        </div>

        {/* Results Container */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-4">
          {!query.trim() && (
            <div className="text-center py-8 text-slate-400 text-sm">
              <p className="font-medium text-slate-300">Quick Command Search</p>
              <p className="text-xs text-slate-500 mt-1">
                Type a task title, project name, or teammate to instantly jump to it.
              </p>
            </div>
          )}

          {query.trim() && !hasResults && (
            <div className="text-center py-8 text-slate-400 text-sm">
              No results found for <span className="text-slate-200 font-medium">"{query}"</span>
            </div>
          )}

          {/* Tasks Results */}
          {results.tasks.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2 flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
                Tasks ({results.tasks.length})
              </div>
              <div className="space-y-1">
                {results.tasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => {
                      onClose();
                      if (onSelectTask) onSelectTask(task);
                      else navigate('/app/board');
                    }}
                    className="w-full text-left flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/70 border border-transparent hover:border-white/5 transition-all group"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-200 group-hover:text-cyan-300 transition-colors">
                        {task.title}
                      </p>
                      <p className="text-xs text-slate-400">
                        {task.projectName} • {task.workPeriodName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {task.status}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Projects Results */}
          {results.projects.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2 flex items-center gap-1.5">
                <FolderKanban className="w-3.5 h-3.5 text-cyan-400" />
                Projects ({results.projects.length})
              </div>
              <div className="space-y-1">
                {results.projects.map((proj) => (
                  <button
                    key={proj.id}
                    onClick={() => {
                      onClose();
                      navigate('/app/hierarchy');
                    }}
                    className="w-full text-left flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/70 border border-transparent hover:border-white/5 transition-all group"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-200 group-hover:text-cyan-300 transition-colors">
                        {proj.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {proj.category} • {proj.status}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Members Results */}
          {results.members.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                Team Members ({results.members.length})
              </div>
              <div className="space-y-1">
                {results.members.map((mem) => (
                  <button
                    key={mem.id}
                    onClick={() => {
                      onClose();
                      navigate('/app/team');
                    }}
                    className="w-full text-left flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/70 border border-transparent hover:border-white/5 transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={mem.avatar}
                        alt={mem.name}
                        className="w-7 h-7 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-200 group-hover:text-emerald-300 transition-colors">
                          {mem.name}
                        </p>
                        <p className="text-xs text-slate-400">{mem.role}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
