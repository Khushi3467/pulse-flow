import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { MemberCard } from '../components/team/MemberCard';
import { InviteMemberModal } from '../components/team/InviteMemberModal';
import { Users, UserPlus, Clock, CheckSquare, Search } from 'lucide-react';

export function TeamPage() {
  const { members, allTasks } = useData();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = m.name.toLowerCase().includes(q);
        const matchesRole = m.role.toLowerCase().includes(q);
        const matchesDept = m.department.toLowerCase().includes(q);
        if (!matchesName && !matchesRole && !matchesDept) return false;
      }
      return true;
    });
  }, [members, searchQuery]);

  // Total hours across the team
  const totalHours = useMemo(() => {
    return members.reduce((acc, m) => acc + (m.hoursTracked || 0), 0).toFixed(1);
  }, [members]);

  const totalAssignedTasks = allTasks.filter((t) => t.assigneeId).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Team & Time Tracking
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            View team members, active task assignments, and logged working hours.
          </p>
        </div>

        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Member</span>
        </button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Team Members</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-white">{members.length}</p>
          <p className="text-[11px] text-slate-500">Active university developers</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Hours Logged</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-purple-300">{totalHours}h</p>
          <p className="text-[11px] text-slate-500">Tracked across sprint tasks</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Tasks Currently Assigned</span>
            <CheckSquare className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-400">{totalAssignedTasks}</p>
          <p className="text-[11px] text-slate-500">Distributed across members</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-white/5">
        <div className="relative w-full max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search member by name or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-slate-800 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <span className="text-xs text-slate-400 font-mono">
          {filteredMembers.length} Members
        </span>
      </div>

      {/* Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMembers.map((member) => {
          const assigned = allTasks.filter((t) => t.assigneeId === member.id);
          return <MemberCard key={member.id} member={member} assignedTasks={assigned} />;
        })}
      </div>

      {/* Invite Member Modal */}
      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
    </div>
  );
}
