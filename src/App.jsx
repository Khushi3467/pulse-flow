import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { DataProvider } from './context/DataContext';

import { LandingPage } from './pages/LandingPage';
import { AppLayout } from './components/common/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { KanbanPage } from './pages/KanbanPage';
import { TeamPage } from './pages/TeamPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <ToastProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            {/* 1. Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Essential App Pages under AppLayout */}
            <Route path="/app" element={<AppLayout />}>
              {/* 2. Dashboard */}
              <Route index element={<DashboardPage />} />

              {/* 3. Hierarchy / Projects */}
              <Route path="hierarchy" element={<WorkspacePage />} />
              <Route path="projects" element={<Navigate to="/app/hierarchy" replace />} />
              <Route path="workspace" element={<Navigate to="/app/hierarchy" replace />} />

              {/* 4. Task Board (To Do, In Progress, Done) */}
              <Route path="board" element={<KanbanPage />} />
              <Route path="kanban" element={<Navigate to="/app/board" replace />} />

              {/* 5. Team & Time Tracking */}
              <Route path="team" element={<TeamPage />} />
            </Route>

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </ToastProvider>
  );
}
