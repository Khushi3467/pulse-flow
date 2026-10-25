import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { INITIAL_WORKSPACES, INITIAL_MEMBERS, INITIAL_ACTIVITIES } from '../data/initialData';
import { useToast } from './ToastContext';

const STORAGE_KEY = 'pulseflow_state_v1';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { addToast } = useToast();

  // Load from localStorage or fallback to initial
  const [workspaces, setWorkspaces] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_workspaces`);
      return saved ? JSON.parse(saved) : INITIAL_WORKSPACES;
    } catch (e) {
      console.error('Failed to load workspaces from localStorage', e);
      return INITIAL_WORKSPACES;
    }
  });

  const [activeWorkspaceId, setActiveWorkspaceId] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_active_ws`);
      return saved || (INITIAL_WORKSPACES[0]?.id ?? 'ws-1');
    } catch {
      return 'ws-1';
    }
  });

  const [members, setMembers] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_members`);
      return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
    } catch (e) {
      console.error('Failed to load members from localStorage', e);
      return INITIAL_MEMBERS;
    }
  });

  const [activities, setActivities] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_activities`);
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });

  // Current active timer state: { taskId, title, running, seconds }
  const [activeTimer, setActiveTimer] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_timer`);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_workspaces`, JSON.stringify(workspaces));
    } catch (e) {
      console.error(e);
    }
  }, [workspaces]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_active_ws`, activeWorkspaceId);
    } catch (e) {
      console.error(e);
    }
  }, [activeWorkspaceId]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_members`, JSON.stringify(members));
    } catch (e) {
      console.error(e);
    }
  }, [members]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_activities`, JSON.stringify(activities));
    } catch (e) {
      console.error(e);
    }
  }, [activities]);

  useEffect(() => {
    try {
      if (activeTimer) {
        localStorage.setItem(`${STORAGE_KEY}_timer`, JSON.stringify(activeTimer));
      } else {
        localStorage.removeItem(`${STORAGE_KEY}_timer`);
      }
    } catch (e) {
      console.error(e);
    }
  }, [activeTimer]);

  // Timer interval
  useEffect(() => {
    let interval = null;
    if (activeTimer && activeTimer.running) {
      interval = setInterval(() => {
        setActiveTimer((prev) => (prev ? { ...prev, seconds: prev.seconds + 1 } : null));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimer?.running]);

  // Derived current workspace
  const activeWorkspace = useMemo(() => {
    return workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0] || null;
  }, [workspaces, activeWorkspaceId]);

  // Flattened lists for easy querying
  const currentProjects = useMemo(() => {
    return activeWorkspace?.projects || [];
  }, [activeWorkspace]);

  // Flattened tasks with project and workPeriod metadata
  const allTasks = useMemo(() => {
    const list = [];
    workspaces.forEach((ws) => {
      ws.projects?.forEach((proj) => {
        proj.workPeriods?.forEach((wp) => {
          wp.tasks?.forEach((task) => {
            list.push({
              ...task,
              workspaceId: ws.id,
              workspaceName: ws.name,
              projectId: proj.id,
              projectName: proj.name,
              projectCode: proj.code,
              workPeriodId: wp.id,
              workPeriodName: wp.name,
              workPeriodType: wp.type,
            });
          });
        });
      });
    });
    return list;
  }, [workspaces]);

  // Helper to record activity
  const recordActivity = useCallback((userId, action, target, projectName) => {
    const newAct = {
      id: `act-${Date.now()}`,
      userId,
      action,
      target,
      project: projectName || 'General',
      timestamp: 'Just now',
    };
    setActivities((prev) => [newAct, ...prev.slice(0, 19)]);
  }, []);

  // --- ACTIONS: WORKSPACE ---
  const switchWorkspace = useCallback((wsId) => {
    setActiveWorkspaceId(wsId);
    const target = workspaces.find((w) => w.id === wsId);
    addToast(`Switched to workspace "${target?.name || wsId}"`, 'info');
  }, [workspaces, addToast]);

  const addWorkspace = useCallback((wsData) => {
    const newId = `ws-${Date.now()}`;
    const newWs = {
      id: newId,
      name: wsData.name || 'Untitled Workspace',
      code: wsData.code || 'WS',
      description: wsData.description || '',
      leadId: wsData.leadId || members[0]?.id || 'tm-1',
      color: wsData.color || 'from-indigo-600 to-violet-700',
      icon: 'Building2',
      createdAt: new Date().toISOString().split('T')[0],
      projects: [],
    };
    setWorkspaces((prev) => [...prev, newWs]);
    setActiveWorkspaceId(newId);
    addToast(`Workspace "${newWs.name}" created!`, 'success');
    return newWs;
  }, [members, addToast]);

  // --- ACTIONS: PROJECT ---
  const addProject = useCallback((workspaceId, projData) => {
    const newId = `proj-${Date.now()}`;
    const newProject = {
      id: newId,
      workspaceId,
      name: projData.name || 'New Project',
      code: projData.code || `PRJ-${Math.floor(100 + Math.random() * 900)}`,
      category: projData.category || 'General',
      description: projData.description || '',
      leadId: projData.leadId || members[0]?.id || 'tm-1',
      status: projData.status || 'In Progress',
      priority: projData.priority || 'Medium',
      deadline: projData.deadline || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      budgetHours: Number(projData.budgetHours) || 80,
      tags: projData.tags || ['Frontend', 'Collab'],
      workPeriods: [
        {
          id: `wp-${Date.now()}`,
          projectId: newId,
          name: 'Sprint 1 / Kickoff',
          type: 'Sprint',
          status: 'Active',
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
          goal: 'Initial sprint kick-off and environment setup',
          tasks: [],
        },
        {
          id: `wp-${Date.now() + 1}`,
          projectId: newId,
          name: 'Pending Work / Backlog',
          type: 'Backlog',
          status: 'Planning',
          startDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
          endDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
          goal: 'Future pending tasks & enhancements',
          tasks: [],
        },
      ],
    };

    setWorkspaces((prev) =>
      prev.map((ws) => {
        if (ws.id === workspaceId) {
          return { ...ws, projects: [...(ws.projects || []), newProject] };
        }
        return ws;
      })
    );

    recordActivity(members[0]?.id || 'tm-1', 'created project', newProject.name, newProject.name);
    addToast(`Project "${newProject.name}" created!`, 'success');
    return newProject;
  }, [members, recordActivity, addToast]);

  const updateProject = useCallback((projectId, updatedFields) => {
    setWorkspaces((prev) =>
      prev.map((ws) => ({
        ...ws,
        projects: ws.projects.map((p) => {
          if (p.id === projectId) {
            return { ...p, ...updatedFields };
          }
          return p;
        }),
      }))
    );
    addToast('Project updated successfully', 'success');
  }, [addToast]);

  const deleteProject = useCallback((projectId) => {
    let deletedName = '';
    setWorkspaces((prev) =>
      prev.map((ws) => {
        const found = ws.projects.find((p) => p.id === projectId);
        if (found) deletedName = found.name;
        return {
          ...ws,
          projects: ws.projects.filter((p) => p.id !== projectId),
        };
      })
    );
    addToast(`Project "${deletedName || projectId}" deleted`, 'info');
  }, [addToast]);

  // --- ACTIONS: WORK PERIOD / PENDING WORK ---
  const addWorkPeriod = useCallback((projectId, wpData) => {
    const newWp = {
      id: `wp-${Date.now()}`,
      projectId,
      name: wpData.name || 'New Work Period',
      type: wpData.type || 'Sprint',
      status: wpData.status || 'Active',
      startDate: wpData.startDate || new Date().toISOString().split('T')[0],
      endDate: wpData.endDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      goal: wpData.goal || '',
      tasks: [],
    };

    setWorkspaces((prev) =>
      prev.map((ws) => ({
        ...ws,
        projects: ws.projects.map((p) => {
          if (p.id === projectId) {
            return { ...p, workPeriods: [...(p.workPeriods || []), newWp] };
          }
          return p;
        }),
      }))
    );

    addToast(`Work Period "${newWp.name}" added`, 'success');
    return newWp;
  }, [addToast]);

  const updateWorkPeriod = useCallback((workPeriodId, updatedFields) => {
    setWorkspaces((prev) =>
      prev.map((ws) => ({
        ...ws,
        projects: ws.projects.map((p) => ({
          ...p,
          workPeriods: (p.workPeriods || []).map((wp) => {
            if (wp.id === workPeriodId) {
              return { ...wp, ...updatedFields };
            }
            return wp;
          }),
        })),
      }))
    );
    addToast('Work period updated', 'success');
  }, [addToast]);

  const deleteWorkPeriod = useCallback((workPeriodId) => {
    setWorkspaces((prev) =>
      prev.map((ws) => ({
        ...ws,
        projects: ws.projects.map((p) => ({
          ...p,
          workPeriods: (p.workPeriods || []).filter((wp) => wp.id !== workPeriodId),
        })),
      }))
    );
    addToast('Work period deleted', 'info');
  }, [addToast]);

  // --- ACTIONS: TASKS ---
  const addTask = useCallback((workPeriodId, taskData) => {
    const newId = `task-${Date.now()}`;
    const newTask = {
      id: newId,
      workPeriodId,
      title: taskData.title || 'Untitled Task',
      description: taskData.description || '',
      priority: taskData.priority || 'Medium',
      status: taskData.status || 'To Do',
      assigneeId: taskData.assigneeId || members[0]?.id || 'tm-1',
      deadline: taskData.deadline || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      estimatedHours: Number(taskData.estimatedHours) || 6,
      loggedHours: 0,
      tags: taskData.tags || ['Feature'],
      subtasks: taskData.subtasks || [],
      comments: [],
    };

    let targetProjectName = '';

    setWorkspaces((prev) =>
      prev.map((ws) => ({
        ...ws,
        projects: ws.projects.map((p) => {
          let hasPeriod = false;
          const updatedPeriods = (p.workPeriods || []).map((wp) => {
            if (wp.id === workPeriodId) {
              hasPeriod = true;
              return { ...wp, tasks: [...(wp.tasks || []), newTask] };
            }
            return wp;
          });
          if (hasPeriod) targetProjectName = p.name;
          return { ...p, workPeriods: updatedPeriods };
        }),
      }))
    );

    recordActivity(
      newTask.assigneeId,
      'created task',
      newTask.title,
      targetProjectName || 'Project'
    );
    addToast(`Task "${newTask.title}" created!`, 'success');
    return newTask;
  }, [members, recordActivity, addToast]);

  const updateTask = useCallback((taskId, updatedFields) => {
    setWorkspaces((prev) =>
      prev.map((ws) => ({
        ...ws,
        projects: ws.projects.map((p) => ({
          ...p,
          workPeriods: (p.workPeriods || []).map((wp) => ({
            ...wp,
            tasks: (wp.tasks || []).map((t) => {
              if (t.id === taskId) {
                return { ...t, ...updatedFields };
              }
              return t;
            }),
          })),
        })),
      }))
    );
    addToast('Task updated', 'success');
  }, [addToast]);

  const updateTaskStatus = useCallback((taskId, newStatus) => {
    let taskTitle = '';
    let projectName = '';
    let assigneeId = 'tm-1';

    setWorkspaces((prev) =>
      prev.map((ws) => ({
        ...ws,
        projects: ws.projects.map((p) => ({
          ...p,
          workPeriods: (p.workPeriods || []).map((wp) => ({
            ...wp,
            tasks: (wp.tasks || []).map((t) => {
              if (t.id === taskId) {
                taskTitle = t.title;
                projectName = p.name;
                assigneeId = t.assigneeId;
                return { ...t, status: newStatus };
              }
              return t;
            }),
          })),
        })),
      }))
    );

    recordActivity(assigneeId, `moved task to ${newStatus}`, taskTitle, projectName);
    addToast(`Task moved to ${newStatus}`, 'info');
  }, [recordActivity, addToast]);

  const deleteTask = useCallback((taskId) => {
    let deletedTitle = '';
    setWorkspaces((prev) =>
      prev.map((ws) => ({
        ...ws,
        projects: ws.projects.map((p) => ({
          ...p,
          workPeriods: (p.workPeriods || []).map((wp) => {
            const found = (wp.tasks || []).find((t) => t.id === taskId);
            if (found) deletedTitle = found.title;
            return {
              ...wp,
              tasks: (wp.tasks || []).filter((t) => t.id !== taskId),
            };
          }),
        })),
      }))
    );
    addToast(`Task "${deletedTitle || taskId}" deleted`, 'info');
  }, [addToast]);

  // --- ACTIONS: SUBTASKS ---
  const addSubtask = useCallback((taskId, title) => {
    if (!title.trim()) return;
    const newSubtask = {
      id: `sub-${Date.now()}`,
      title: title.trim(),
      completed: false,
    };

    setWorkspaces((prev) =>
      prev.map((ws) => ({
        ...ws,
        projects: ws.projects.map((p) => ({
          ...p,
          workPeriods: (p.workPeriods || []).map((wp) => ({
            ...wp,
            tasks: (wp.tasks || []).map((t) => {
              if (t.id === taskId) {
                return {
                  ...t,
                  subtasks: [...(t.subtasks || []), newSubtask],
                };
              }
              return t;
            }),
          })),
        })),
      }))
    );
    addToast(`Subtask added`, 'success');
  }, [addToast]);

  const toggleSubtask = useCallback((taskId, subtaskId) => {
    let subtaskTitle = '';
    let completed = false;
    let projName = '';
    let assignee = 'tm-1';

    setWorkspaces((prev) =>
      prev.map((ws) => ({
        ...ws,
        projects: ws.projects.map((p) => ({
          ...p,
          workPeriods: (p.workPeriods || []).map((wp) => ({
            ...wp,
            tasks: (wp.tasks || []).map((t) => {
              if (t.id === taskId) {
                projName = p.name;
                assignee = t.assigneeId;
                const updatedSubtasks = (t.subtasks || []).map((st) => {
                  if (st.id === subtaskId) {
                    subtaskTitle = st.title;
                    completed = !st.completed;
                    return { ...st, completed: !st.completed };
                  }
                  return st;
                });
                return { ...t, subtasks: updatedSubtasks };
              }
              return t;
            }),
          })),
        })),
      }))
    );

    recordActivity(
      assignee,
      completed ? 'completed subtask' : 'unmarked subtask',
      subtaskTitle,
      projName
    );
  }, [recordActivity]);

  const deleteSubtask = useCallback((taskId, subtaskId) => {
    setWorkspaces((prev) =>
      prev.map((ws) => ({
        ...ws,
        projects: ws.projects.map((p) => ({
          ...p,
          workPeriods: (p.workPeriods || []).map((wp) => ({
            ...wp,
            tasks: (wp.tasks || []).map((t) => {
              if (t.id === taskId) {
                return {
                  ...t,
                  subtasks: (t.subtasks || []).filter((st) => st.id !== subtaskId),
                };
              }
              return t;
            }),
          })),
        })),
      }))
    );
    addToast('Subtask removed', 'info');
  }, [addToast]);

  // --- ACTIONS: COMMENTS ---
  const addTaskComment = useCallback((taskId, text, authorId = 'tm-1') => {
    if (!text.trim()) return;
    const newComment = {
      id: `c-${Date.now()}`,
      authorId,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };

    setWorkspaces((prev) =>
      prev.map((ws) => ({
        ...ws,
        projects: ws.projects.map((p) => ({
          ...p,
          workPeriods: (p.workPeriods || []).map((wp) => ({
            ...wp,
            tasks: (wp.tasks || []).map((t) => {
              if (t.id === taskId) {
                return {
                  ...t,
                  comments: [...(t.comments || []), newComment],
                };
              }
              return t;
            }),
          })),
        })),
      }))
    );
    addToast('Comment posted', 'success');
  }, [addToast]);

  // --- ACTIONS: TIME TRACKING ---
  const logTaskHours = useCallback((taskId, addedHours) => {
    const hours = parseFloat(addedHours);
    if (isNaN(hours) || hours <= 0) return;

    let taskTitle = '';
    let projName = '';
    let assignee = 'tm-1';

    setWorkspaces((prev) =>
      prev.map((ws) => ({
        ...ws,
        projects: ws.projects.map((p) => ({
          ...p,
          workPeriods: (p.workPeriods || []).map((wp) => ({
            ...wp,
            tasks: (wp.tasks || []).map((t) => {
              if (t.id === taskId) {
                taskTitle = t.title;
                projName = p.name;
                assignee = t.assigneeId;
                return { ...t, loggedHours: (Number(t.loggedHours) || 0) + hours };
              }
              return t;
            }),
          })),
        })),
      }))
    );

    // Also update member total hours
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === assignee) {
          return { ...m, hoursTracked: Number((m.hoursTracked + hours).toFixed(1)) };
        }
        return m;
      })
    );

    recordActivity(assignee, `logged ${hours} hrs on`, taskTitle, projName);
    addToast(`Logged ${hours}h on task`, 'success');
  }, [recordActivity, addToast]);

  // Timer controls
  const startTimer = useCallback((taskId, title) => {
    setActiveTimer({
      taskId,
      title,
      running: true,
      seconds: 0,
    });
    addToast(`Timer started: ${title}`, 'info');
  }, [addToast]);

  const pauseTimer = useCallback(() => {
    setActiveTimer((prev) => (prev ? { ...prev, running: !prev.running } : null));
  }, []);

  const stopAndLogTimer = useCallback(() => {
    if (!activeTimer) return;
    const hours = (activeTimer.seconds / 3600).toFixed(2);
    if (activeTimer.seconds >= 30) {
      logTaskHours(activeTimer.taskId, hours);
      addToast(`Stopped timer and logged ${hours}h!`, 'success');
    } else {
      addToast('Timer stopped (less than 30s not logged)', 'info');
    }
    setActiveTimer(null);
  }, [activeTimer, logTaskHours, addToast]);

  const cancelTimer = useCallback(() => {
    setActiveTimer(null);
    addToast('Timer discarded', 'info');
  }, [addToast]);

  // --- ACTIONS: MEMBERS ---
  const addMember = useCallback((memberData) => {
    const newId = `tm-${Date.now()}`;
    const initials = (memberData.name || 'User')
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const colors = [
      'from-cyan-500 to-blue-600',
      'from-purple-500 to-indigo-600',
      'from-emerald-500 to-teal-600',
      'from-pink-500 to-rose-600',
      'from-amber-500 to-orange-600',
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newMember = {
      id: newId,
      name: memberData.name || 'New Member',
      email: memberData.email || 'member@college.edu',
      role: memberData.role || 'Software Engineer',
      department: memberData.department || 'Computer Science',
      avatar:
        memberData.avatar ||
        `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      initials,
      color: randomColor,
      workload: Number(memberData.workload) || 40,
      tasksCompleted: 0,
      hoursTracked: 0,
      status: 'online',
    };

    setMembers((prev) => [...prev, newMember]);
    addToast(`Added team member "${newMember.name}"!`, 'success');
    return newMember;
  }, [addToast]);

  // Reset to Demo Data
  const resetToDemoData = useCallback(() => {
    setWorkspaces(INITIAL_WORKSPACES);
    setActiveWorkspaceId('ws-1');
    setMembers(INITIAL_MEMBERS);
    setActivities(INITIAL_ACTIVITIES);
    setActiveTimer(null);
    localStorage.removeItem(`${STORAGE_KEY}_workspaces`);
    localStorage.removeItem(`${STORAGE_KEY}_active_ws`);
    localStorage.removeItem(`${STORAGE_KEY}_members`);
    localStorage.removeItem(`${STORAGE_KEY}_activities`);
    localStorage.removeItem(`${STORAGE_KEY}_timer`);
    addToast('Reset demo state to original sample data', 'info');
  }, [addToast]);

  const value = {
    workspaces,
    activeWorkspaceId,
    activeWorkspace,
    currentProjects,
    allTasks,
    members,
    activities,
    activeTimer,
    switchWorkspace,
    addWorkspace,
    addProject,
    updateProject,
    deleteProject,
    addWorkPeriod,
    updateWorkPeriod,
    deleteWorkPeriod,
    addTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    addTaskComment,
    logTaskHours,
    startTimer,
    pauseTimer,
    stopAndLogTimer,
    cancelTimer,
    addMember,
    recordActivity,
    resetToDemoData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
