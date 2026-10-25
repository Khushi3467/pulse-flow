import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { SearchModal } from './SearchModal';
import { TaskCreateModal } from '../tasks/TaskCreateModal';
import { TaskDetailModal } from '../tasks/TaskDetailModal';

export function AppLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [createTaskModal, setCreateTaskModal] = useState({
    isOpen: false,
    workPeriodId: null,
    projectId: null,
    initialStatus: 'To Do',
  });
  const [selectedTask, setSelectedTask] = useState(null);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenNewTask = (workPeriodId = null, projectId = null, initialStatus = 'To Do') => {
    setCreateTaskModal({
      isOpen: true,
      workPeriodId,
      projectId,
      initialStatus,
    });
  };

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 flex flex-col lg:flex-row font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Navbar
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenNewTask={() => handleOpenNewTask()}
          onToggleMobileMenu={() => setMobileSidebarOpen((prev) => !prev)}
        />

        {/* Page View with outlet context passing action triggers */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-300">
          <Outlet
            context={{
              onSelectTask: (task) => setSelectedTask(task),
              onOpenNewTask: handleOpenNewTask,
            }}
          />
        </main>
      </div>

      {/* Global Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTask={(task) => setSelectedTask(task)}
      />

      <TaskCreateModal
        isOpen={createTaskModal.isOpen}
        onClose={() => setCreateTaskModal({ ...createTaskModal, isOpen: false })}
        defaultWorkPeriodId={createTaskModal.workPeriodId}
        defaultProjectId={createTaskModal.projectId}
        initialStatus={createTaskModal.initialStatus}
      />

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          isOpen={Boolean(selectedTask)}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}
