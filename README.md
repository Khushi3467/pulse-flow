# NovaPulse — Team Collaboration & Hierarchy Management Platform

A premium startup-grade frontend built from scratch with **React 19**, **Vite**, **Tailwind CSS**, **Lucide Icons**, and **Recharts**.

Designed specifically for college engineering teams and collaborative software labs.

---

## 🏗️ The 5-Level Architectural Hierarchy

The platform is structured around a strict five-tier operational hierarchy:

```
Level 1: Workspace
   └── Level 2: Project
          └── Level 3: Work Period / Pending Work (Sprint or Backlog)
                 └── Level 4: Task
                        └── Level 5: Subtask (Checklist Step)
```

### Hierarchy Breakdown with College Example:
- **Level 1 — Workspace**: `College Development Team` (CDT)
- **Level 2 — Project**: `Website Development`
- **Level 3 — Work Period**: `Current Sprint / Sprint 3` & `Pending Work / Backlog`
- **Level 4 — Task**: `Create Login Page`
- **Level 5 — Subtask**: `Design Login Form UI wireframe`, `Setup form validation`, etc.

---

## ⚡ Tech Stack
- **Framework**: React.js 19 (JSX, JavaScript)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 with custom dark neon and glassmorphic palette
- **Routing**: React Router DOM v7
- **Icons**: Lucide React
- **Analytics & Charts**: Recharts
- **State & Storage**: React Context + Browser `localStorage` (offline demo persistence)

---

## 🚀 How to Run the Project

1. Open PowerShell or Command Prompt.
2. Navigate into this project folder:
   ```bash
   cd "C:\Users\QZ\.gemini\antigravity\scratch\pulse-flow"
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the local URL displayed in your terminal (typically `http://localhost:5173`).

---

## 🎨 Branding & Customization
To rename the application from the temporary neutral title (`NovaPulse`) to your actual project name:
1. Open [`src/config/brand.js`](./src/config/brand.js).
2. Change the `name` and `subtitle` fields:
   ```javascript
   export const BRAND = {
     name: "YourRealProjectName",
     subtitle: "Your Custom Subtitle",
     ...
   };
   ```
3. Save the file. The title automatically updates across the Landing Page, Sidebar, Navbar, and Footer!

---

## 📱 Pages Built & Included

1. **Landing Page (`/`)**:
   - Modern SaaS dark-mode hero with glowing gradients
   - Deep dive into the 5-Level Hierarchy
   - Simulated dashboard preview
   - Feature highlight matrix & tech badges
2. **Dashboard (`/app`)**:
   - High-level metric cards: Active Projects, Completed Tasks, Hours Logged, Sprint Velocity
   - Active Sprints & Work Periods overview cards with progress bars
   - Upcoming deadlines widget with overdue tags
   - Real-time team activity feed
3. **Hierarchy Tree (`/app/hierarchy`)** *(Primary Feature)*:
   - Visual expandable and collapsible tree mapping from Workspace down to Subtasks
   - Expand All / Collapse All controls
   - Direct inline creation of Projects, Work Periods, Tasks, and Subtasks
   - Real-time subtask completion checkboxes
   - Progress meters recursively calculated at each level
4. **Projects Portfolio (`/app/projects`)**:
   - Grid view with category tags, deadlines, lead avatars, and task velocity
   - Search and category filters
   - "New Project" modal
5. **Kanban Sprints (`/app/kanban`)**:
   - Five agile workflow columns: `Backlog`, `To Do`, `In Progress`, `In Review`, `Done`
   - Native Drag-and-Drop and quick move controls
   - Project, Work Period, and Priority filters
6. **Task Details & Execution Modal**:
   - Accessible by clicking any task card in Kanban, Hierarchy, or Dashboard
   - Checkable subtask list with progress bar
   - Live stopwatch timer + manual hour logging
   - Comments & discussion feed with instant posting
   - Priority, Status, Assignee, and Deadline controls
7. **Team & Workload (`/app/team`)**:
   - Member profiles, roles, departments, workload capacity meters
   - Task assignment count and tracked hours
   - "Add Team Member" modal
8. **Engineering Analytics (`/app/analytics`)**:
   - Project completion comparison (Bar Chart)
   - Workspace status distribution (Donut / Pie Chart)
   - Sprint velocity & burndown trends (Area Chart)
   - Developer logged hours (Bar Chart)

---

## 💾 LocalStorage & Demo Data Reset
All changes (created projects, newly added tasks, completed subtasks, logged hours, comments) are saved in your browser's `localStorage`.

To restore the original college sample data at any time, click the **"Reset Demo"** button located in the top navbar.
