import React from 'react';
import { ProgressBar } from '../common/ProgressBar';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import {
  FolderKanban,
  Calendar,
  Clock,
  Layers,
  ArrowRight,
  MoreVertical,
  Trash2,
  Edit,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';

export function ProjectCard({ project, onEdit }) {
  const { members, deleteProject } = useData();
  const navigate = useNavigate();

  const leader = members.find((m) => m.id === project.leadId) || members[0];

  // Calculate project metrics
  const allProjTasks = [];
  project.workPeriods?.forEach((wp) => {
    allProjTasks.push(...(wp.tasks || []));
  });

  const completedCount = allProjTasks.filter((t) => t.status === 'Done').length;
  const progressPercent =
    allProjTasks.length > 0 ? Math.round((completedCount / allProjTasks.length) * 100) : 0;

  const totalLoggedHours = allProjTasks.reduce((acc, t) => acc + (t.loggedHours || 0), 0);

  return (
    <div className="rounded-2xl bg-slate-900/70 border border-white/10 hover:border-indigo-500/40 p-5 shadow-xl hover:shadow-2xl hover:shadow-indigo-950/40 transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Top: Category & Actions */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
            {project.category}
          </span>

          <div className="flex items-center gap-1.5">
            <StatusBadge status={project.status} />
            <button
              onClick={() => {
                if (window.confirm(`Delete project "${project.name}"?`)) {
                  deleteProject(project.id);
                }
              }}
              className="p-1 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
              title="Delete Project"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Project Title & Code */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shrink-0 shadow-md">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400">[{project.code}]</span>
            <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
              {project.name}
            </h3>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
          {project.description || 'No detailed scope description.'}
        </p>

        {/* Progress */}
        <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Task Velocity</span>
            <span className="font-mono text-white font-bold">
              {completedCount}/{allProjTasks.length} ({progressPercent}%)
            </span>
          </div>
          <ProgressBar progress={progressPercent} size="sm" color="cyan" />
        </div>

        {/* Work Periods Badge */}
        <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span>{(project.workPeriods || []).length} Work Periods / Sprints</span>
        </div>
      </div>

      {/* Footer Info & Action */}
      <div className="mt-5 pt-3.5 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2" title={`Project Lead: ${leader?.name}`}>
          <img
            src={leader?.avatar}
            alt={leader?.name}
            className="w-6 h-6 rounded-full object-cover border border-indigo-400/30"
          />
          <div className="text-[11px] text-slate-400">
            <span className="text-slate-200 font-medium">{leader?.name.split(' ')[0]}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {project.deadline && (
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-500" />
              <span>{project.deadline.slice(5)}</span>
            </span>
          )}

          <button
            onClick={() => navigate('/app/hierarchy')}
            className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white transition-all"
            title="Inspect Hierarchy"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
