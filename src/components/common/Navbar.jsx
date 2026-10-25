import React, { useState } from 'react';
import {
  Search,
  Building2,
  ChevronDown,
  Plus,
  RotateCcw,
  Clock,
  Square,
  Play,
  Pause,
  Menu,
  CheckCircle2,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { BRAND } from '../../config/brand';

export function Navbar({ onOpenSearch, onOpenNewTask, onToggleMobileMenu }) {
  const {
    workspaces,
    activeWorkspaceId,
    activeWorkspace,
    switchWorkspace,
    addWorkspace,
    activeTimer,
    pauseTimer,
    stopAndLogTimer,
    resetToDemoData,
    members,
  } = useData();

  const [showWsMenu, setShowWsMenu] = useState(false);
  const [showNewWsInput, setShowNewWsInput] = useState(false);
  const [newWsName, setNewWsName] = useState('');

  const currentUser = members[0]; // Primary active student / user (Alex Rivera)

  const handleCreateWs = (e) => {
    e.preventDefault();
    if (newWsName.trim()) {
      addWorkspace({ name: newWsName.trim() });
      setNewWsName('');
      setShowNewWsInput(false);
      setShowWsMenu(false);
    }
  };

  const formatTimerSeconds = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="h-16 border-b border-white/5 bg-[#0a0f1d]/80 backdrop-blur-xl sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Workspace Switcher */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Workspace Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowWsMenu(!showWsMenu)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-white/10 hover:border-indigo-500/30 transition-all text-left group"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-900/30">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs text-slate-400 font-medium leading-none">Workspace</p>
              <p className="text-sm font-semibold text-white leading-tight mt-0.5 truncate max-w-[160px]">
                {activeWorkspace?.name || 'College Workspace'}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-white transition-transform" />
          </button>

          {showWsMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => {
                  setShowWsMenu(false);
                  setShowNewWsInput(false);
                }}
              />
              <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-[#0f172a] border border-white/10 shadow-2xl z-50 p-2 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Workspaces
                </div>

                <div className="space-y-1">
                  {workspaces.map((ws) => (
                    <button
                      key={ws.id}
                      onClick={() => {
                        switchWorkspace(ws.id);
                        setShowWsMenu(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-sm transition-all ${
                        ws.id === activeWorkspaceId
                          ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                          : 'text-slate-300 hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <div className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                          {ws.code || ws.name.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="truncate font-medium">{ws.name}</span>
                      </div>
                      {ws.id === activeWorkspaceId && (
                        <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-2 pt-2 border-t border-white/5">
                  {!showNewWsInput ? (
                    <button
                      onClick={() => setShowNewWsInput(true)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition-colors"
                    >
                      <Plus className="w-4 h-4 text-indigo-400" />
                      Create New Workspace
                    </button>
                  ) : (
                    <form onSubmit={handleCreateWs} className="p-1 space-y-2">
                      <input
                        type="text"
                        placeholder="Workspace name..."
                        value={newWsName}
                        onChange={(e) => setNewWsName(e.target.value)}
                        autoFocus
                        className="w-full text-xs px-3 py-2 rounded-lg bg-slate-900 border border-indigo-500/40 text-white focus:outline-none"
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="flex-1 py-1 px-2 text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowNewWsInput(false)}
                          className="py-1 px-2 text-xs text-slate-400 hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Middle: Quick Search button */}
      <button
        onClick={onOpenSearch}
        className="flex-1 max-w-md hidden md:flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-white/10 hover:border-indigo-500/40 text-slate-400 text-sm transition-all shadow-inner"
      >
        <div className="flex items-center gap-2.5">
          <Search className="w-4 h-4 text-indigo-400" />
          <span>Quick search tasks, hierarchy, projects...</span>
        </div>
        <kbd className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700/80 font-mono">
          Ctrl K
        </kbd>
      </button>

      {/* Right: Actions, Active Timer, New Task & User Profile */}
      <div className="flex items-center gap-3">
        {/* Mobile Search Button */}
        <button
          onClick={onOpenSearch}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Active Timer Floating Pill */}
        {activeTimer && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-200 text-xs shadow-lg animate-pulse">
            <Clock className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span className="font-mono font-bold text-cyan-300">
              {formatTimerSeconds(activeTimer.seconds)}
            </span>
            <span className="hidden xl:inline max-w-[100px] truncate text-slate-300">
              {activeTimer.title}
            </span>
            <button
              onClick={pauseTimer}
              title={activeTimer.running ? 'Pause Timer' : 'Resume Timer'}
              className="p-1 hover:text-white text-indigo-300"
            >
              {activeTimer.running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={stopAndLogTimer}
              title="Stop & Log Time"
              className="p-1 text-emerald-400 hover:text-emerald-300"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        )}

        {/* Reset Demo Data button */}
        <button
          onClick={() => {
            if (window.confirm('Reset all projects and tasks back to initial demo data?')) {
              resetToDemoData();
            }
          }}
          title="Reset sample data"
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-white/5 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Reset Demo</span>
        </button>

        {/* New Task CTA */}
        <button
          onClick={onOpenNewTask}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/25 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2 pl-1 border-l border-white/10">
          <div className="relative">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-8 h-8 rounded-full object-cover border border-indigo-400/30"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0a0f1d]" />
          </div>
          <div className="hidden xl:block">
            <p className="text-xs font-medium text-slate-200 leading-none">{currentUser?.name}</p>
            <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{currentUser?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
