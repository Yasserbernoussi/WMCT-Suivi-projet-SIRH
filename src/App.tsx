import React, { useState, useEffect } from "react";
import { 
  AnimatePresence 
} from "motion/react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import DashboardGlobal from "./components/DashboardGlobal";
import ModulesView from "./components/ModulesView";
import RessourcesView from "./components/RessourcesView";
import PlanningView from "./components/PlanningView";
import SocietiesView from "./components/SocietiesView";
import RisksView from "./components/RisksView";
import ReportingView from "./components/ReportingView";
import ParametresView from "./components/ParametresView";

import { 
  initialModules, 
  initialResources, 
  initialTasks, 
  initialRisks, 
  initialSocieties 
} from "./data";

import { 
  ProjectModule, 
  Resource, 
  ProjectTask, 
  ProjectRisk, 
  ClientSociety 
} from "./types";

import { 
  Cpu, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  X,
  Sparkles,
  Bookmark
} from "lucide-react";

export default function App() {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<string>("global");

  // Core structured states
  const [modules, setModules] = useState<ProjectModule[]>(initialModules.filter(m => m.category !== "ERP_X3"));
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [tasks, setTasks] = useState<ProjectTask[]>(initialTasks.filter(t => {
    const parent = initialModules.find(m => m.id === t.moduleId);
    return parent ? parent.category !== "ERP_X3" : true;
  }));
  const [risks, setRisks] = useState<ProjectRisk[]>(initialRisks);
  const [societies, setSocieties] = useState<ClientSociety[]>(initialSocieties);

  // Search & Global state
  const [globalSearch, setGlobalSearch] = useState<string>("");
  const [syncStatus, setSyncStatus] = useState<"synced" | "syncing" | "error">("synced");
  const [lastSyncTime, setLastSyncTime] = useState<string>("Aujourd'hui, 08:30");
  const [environment, setEnvironment] = useState<string>("Production");

  // Custom project titles
  const [projectName, setProjectName] = useState<string>("Projet SIRH");
  const [projectSubtitle, setProjectSubtitle] = useState<string>("Sage 100c Paie & RH");

  // Premium themes and extras
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [simulatedRealtime, setSimulatedRealtime] = useState<boolean>(false);
  const [toastNotification, setToastNotification] = useState<{ id: string; message: string; type: "success" | "info" | "warning" } | null>(null);

  // Simulated progressive export overlay
  const [exportOverlay, setExportOverlay] = useState<{ active: boolean; progress: number; format: string } | null>(null);

  // Toggle Dark/Light Mode on HTML body
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Toast helper function
  const triggerToast = (message: string, type: "success" | "info" | "warning" = "success") => {
    setToastNotification({
      id: Math.random().toString(36).substring(7),
      message,
      type
    });
  };

  // Close toast automatically
  useEffect(() => {
    if (toastNotification) {
      const timer = setTimeout(() => {
        setToastNotification(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastNotification]);

  // Simulated syncing logic trigger
  const handleSync = () => {
    setSyncStatus("syncing");
    triggerToast("Lancement de la synchronisation avec les environnements Sage...", "info");
    
    setTimeout(() => {
      setSyncStatus("synced");
      const hoursMinutes = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
      setLastSyncTime(`Aujourd'hui, ${hoursMinutes}`);
      
      // Slightly update random task progresses for realism!
      setTasks(prev => 
        prev.map(t => {
          if (t.status === "doing" && t.progress < 90) {
            return { ...t, progress: Math.min(100, t.progress + 5) };
          }
          return t;
        })
      );

      triggerToast("Données synchronisées avec succès depuis le serveur Sage !", "success");
    }, 1500);
  };

  // Simulated export trigger
  const handleExport = (format: "excel" | "pdf") => {
    setExportOverlay({ active: true, progress: 10, format });
    triggerToast(`Préparation du fichier d'exportation .${format}...`, "info");

    const interval = setInterval(() => {
      setExportOverlay(prev => {
        if (!prev) return null;
        if (prev.progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setExportOverlay(null);
            triggerToast(`Rapport exporté avec succès en format ${format.toUpperCase()} !`, "success");
          }, 300);
          return { ...prev, progress: 100 };
        }
        return { ...prev, progress: prev.progress + 20 };
      });
    }, 250);
  };

  // Simulated Real-Time Auto Feed trigger
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (simulatedRealtime) {
      triggerToast("Planificateur de flux temps réel activé !", "success");
      interval = setInterval(() => {
        // Random choose a task that is NOT finished, and make progress
        setTasks(prev => {
          const undone = prev.filter(t => t.status !== "done");
          if (undone.length === 0) return prev;
          const randomTask = undone[Math.floor(Math.random() * undone.length)];
          const newProgress = Math.min(100, randomTask.progress + 20);
          const newStatus = newProgress === 100 ? "done" : randomTask.status;
          
          if (newProgress === 100) {
            triggerToast(`Notification : Tâche complétée automatiquement par l'agent : ${randomTask.title}`, "success");
          } else {
            triggerToast(`Mise à jour : ${randomTask.title} passe à ${newProgress}%`, "info");
          }

          return prev.map(t => {
            if (t.id === randomTask.id) {
              return { ...t, progress: newProgress, status: newStatus };
            }
            return t;
          });
        });
      }, 7000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [simulatedRealtime]);

  // Recalculability handlers for interactive sliders

  const handleUpdateModuleProgress = (moduleId: string, progress: number) => {
    setModules(prev => prev.map(m => {
      if (m.id === moduleId) {
        let newStatus = m.status;
        if (progress === 100) newStatus = "completed";
        else if (progress >= 75) newStatus = "testing";
        else if (progress > 0) newStatus = "in_progress";
        else newStatus = "not_started";
        
        return { ...m, progress, status: newStatus };
      }
      return m;
    }));
  };

  const handleUpdateTaskStatus = (taskId: string, status: "todo" | "doing" | "done" | "blocking") => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const completedWeight = status === "done" ? 100 : status === "todo" ? 0 : t.progress;
        return { ...t, status, progress: completedWeight };
      }
      return t;
    }));

    // Update parent module completed count
    const relativeTask = tasks.find(t => t.id === taskId);
    if (!relativeTask) return;
    
    // Automatically trigger notification toast
    triggerToast(`Statut de la tâche '${relativeTask.title.slice(0, 30)}...' défini sur ${status}`, "info");

    // Dynamic Module progress increments if a task is set to "done"
    if (status === "done") {
      setModules(prev => prev.map(m => {
        if (m.id === relativeTask.moduleId) {
          const totalTasksForM = tasks.filter(t => t.moduleId === m.id).length;
          const doneTasksForM = tasks.filter(t => t.moduleId === m.id && (t.id === taskId ? "done" : t.status) === "done").length;
          const calculatedPct = totalTasksForM > 0 ? Math.round((doneTasksForM / totalTasksForM) * 100) : m.progress;
          return { 
            ...m, 
            completedTasksCount: doneTasksForM,
            progress: Math.min(100, calculatedPct)
          };
        }
        return m;
      }));
    }
  };

  const handleUpdateResourceWorkload = (resId: string, workloadAllocated: number) => {
    setResources(prev => prev.map(r => {
      if (r.id === resId) {
        return { ...r, workloadAllocated };
      }
      return r;
    }));
  };

  const handleUpdateSocietyProgress = (socId: string, progress: number) => {
    setSocieties(prev => prev.map(s => {
      if (s.id === socId) {
        let state: "completed" | "in_progress" | "pending" = "in_progress";
        if (progress === 100) state = "completed";
        else if (progress === 0) state = "pending";
        return { ...s, migrationPercentage: progress, status: state };
      }
      return s;
    }));
  };

  // Add tasks
  const handleAddTask = (newTask: Omit<ProjectTask, "id">) => {
    const freshId = `task-${tasks.length + 1}`;
    const fresh: ProjectTask = {
      ...newTask,
      id: freshId
    };
    setTasks(prev => [fresh, ...prev]);

    // Update parent modules taskCount
    setModules(prev => prev.map(m => {
      if (m.id === newTask.moduleId) {
        return { ...m, tasksCount: m.tasksCount + 1 };
      }
      return m;
    }));

    triggerToast(`Nouvelle tâche de migration ajoutée : ${newTask.title.slice(0, 35)}...`, "success");
  };

  const handleDeleteTask = (taskId: string) => {
    const toDelete = tasks.find(t => t.id === taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));
    
    if (toDelete) {
      setModules(prev => prev.map(m => {
        if (m.id === toDelete.moduleId) {
          const removedTotal = Math.max(0, m.tasksCount - 1);
          const wasCompleted = toDelete.status === "done";
          const removedDone = wasCompleted ? Math.max(0, m.completedTasksCount - 1) : m.completedTasksCount;
          return { ...m, tasksCount: removedTotal, completedTasksCount: removedDone };
        }
        return m;
      }));
      triggerToast("Tâche supprimée du plan de route", "warning");
    }
  };

  const handleAddRisk = (newRisk: Omit<ProjectRisk, "id">) => {
    const riskId = `risk-${risks.length + 1}`;
    setRisks(prev => [{ ...newRisk, id: riskId }, ...prev]);
    triggerToast(`Alerte Risque enregistrée : ${newRisk.title.slice(0, 25)}...`, "warning");
  };

  const handleUpdateRiskStatus = (riskId: string, status: "Mitigated" | "Active" | "Critical") => {
    setRisks(prev => prev.map(r => {
      if (r.id === riskId) {
        return { ...r, status };
      }
      return r;
    }));
    triggerToast(`Opération de remédiation validée pour l'alerte`, "success");
  };

  const handleAddSociety = (newSoc: Omit<ClientSociety, "id">) => {
    const socId = `soc-${societies.length + 1}`;
    setSocieties(prev => [...prev, { ...newSoc, id: socId }]);
    triggerToast(`Nouvelle filiale intégrée avec succès : ${newSoc.name}`, "success");
  };

  // Full reset state back to origins
  const handleResetData = () => {
    setModules(initialModules.filter(m => m.category !== "ERP_X3"));
    setResources(initialResources);
    setTasks(initialTasks.filter(t => {
      const parent = initialModules.find(m => m.id === t.moduleId);
      return parent ? parent.category !== "ERP_X3" : true;
    }));
    setRisks(initialRisks);
    setSocieties(initialSocieties);
    setSyncStatus("synced");
    setLastSyncTime("Aujourd'hui, 08:30");
    setProjectName("Projet SIRH");
    setProjectSubtitle("Sage 100c Paie & RH");
    setEnvironment("Production");
    triggerToast("La base de données du projet a été restaurée à blanc !", "success");
  };

  // Rendering Routing Views Selector
  const renderActiveView = () => {
    // We filter lists based on current Search term if it exists to support global real-time search across pages!
    const searchFilteredModules = modules.filter(m => m.name.toLowerCase().includes(globalSearch.toLowerCase()));
    const searchFilteredTasks = tasks.filter(t => t.title.toLowerCase().includes(globalSearch.toLowerCase()));
    const searchFilteredResources = resources.filter(r => r.name.toLowerCase().includes(globalSearch.toLowerCase()));

    switch (activeTab) {
      case "global":
        return (
          <DashboardGlobal
            modules={modules}
            resources={resources}
            tasks={tasks}
            risks={risks}
            societies={societies}
            onNavigateToTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onQuickTaskComplete={(taskId) => handleUpdateTaskStatus(taskId, "done")}
          />
        );
      case "modules":
        return (
          <ModulesView
            modules={searchFilteredModules}
            resources={resources}
            tasks={tasks}
            onUpdateModuleProgress={handleUpdateModuleProgress}
            onUpdateTaskStatus={handleUpdateTaskStatus}
          />
        );
      case "societies":
        return (
          <SocietiesView
            societies={societies}
            onUpdateSocietyProgress={handleUpdateSocietyProgress}
            onAddSociety={handleAddSociety}
          />
        );
      case "resources":
        return (
          <RessourcesView
            resources={searchFilteredResources}
            tasks={tasks}
            modules={modules}
            onUpdateResourceWorkload={handleUpdateResourceWorkload}
          />
        );
      case "planning":
        return (
          <PlanningView
            tasks={searchFilteredTasks}
            modules={modules}
            resources={resources}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onUpdateTaskStatus={handleUpdateTaskStatus}
          />
        );
      case "risks":
        return (
          <RisksView
            risks={risks}
            resources={resources}
            onAddRisk={handleAddRisk}
            onUpdateRiskStatus={handleUpdateRiskStatus}
          />
        );
      case "reporting":
        return (
          <ReportingView
            modules={modules}
            resources={resources}
            tasks={tasks}
            onExport={handleExport}
          />
        );
      case "settings":
        return (
          <ParametresView
            projectName={projectName}
            setProjectName={setProjectName}
            projectSubtitle={projectSubtitle}
            setProjectSubtitle={setProjectSubtitle}
            environment={environment}
            setEnvironment={setEnvironment}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            simulatedRealtime={simulatedRealtime}
            onToggleRealtime={() => setSimulatedRealtime(!simulatedRealtime)}
            onResetData={handleResetData}
          />
        );
      default:
        return <div className="p-8 text-center text-slate-400">Section en cours de chargement...</div>;
    }
  };

  return (
    <div className={`min-h-screen flex text-slate-800 dark:text-slate-100 bg-[#F5F7FA] dark:bg-brand-navy select-none transition-colors duration-300 font-sans`}>
      
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isDarkMode={isDarkMode}
      />

      {/* Main Container Right */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative">
        
        {/* Top Header Controls bar */}
        <Topbar
          projectName={projectName}
          projectSubtitle={projectSubtitle}
          activeTab={activeTab}
          syncStatus={syncStatus}
          onSync={handleSync}
          onExport={handleExport}
          isDarkMode={isDarkMode}
          globalSearch={globalSearch}
          setGlobalSearch={setGlobalSearch}
          lastSyncTime={lastSyncTime}
          environment={environment}
          setEnvironment={setEnvironment}
        />

        {/* Scrollable primary content canvas */}
        <main className="flex-1 overflow-y-auto p-8 max-w-[1600px] w-full mx-auto">
          {renderActiveView()}
        </main>
        
        {/* Float action Synchronizer at the bottom right */}
        <button
          onClick={handleSync}
          disabled={syncStatus === "syncing"}
          className={`fixed bottom-6 right-6 h-12 px-5 bg-brand-neon-green hover:bg-[#00b047] text-brand-navy font-bold rounded-full shadow-lg shadow-brand-neon-green-glow/40 flex items-center gap-2 transition-all duration-300 pointer-events-auto hover:scale-105 z-40`}
          title={`Dernière sychronisation : ${lastSyncTime}`}
        >
          <RefreshCw size={15} className={`${syncStatus === "syncing" ? "animate-spin" : ""}`} />
          <span>Synchroniser</span>
        </button>

      </div>

      {/* Custom Progressive Export Overlay */}
      {exportOverlay && (
        <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-brand-navy border border-brand-navy-lighter rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl relative">
            <div className="animate-spin h-8 w-8 border-4 border-brand-accent-blue dark:border-brand-neon-green border-t-transparent rounded-full mx-auto mb-4"></div>
            
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Génération du Rapport d'Audit</h4>
            <p className="text-xs text-slate-500 mt-1">Exportation vers format .{exportOverlay.format} en cours...</p>
            
            {/* Progress Bar indicator */}
            <div className="mt-4 w-full bg-slate-100 dark:bg-brand-navy-light rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-brand-accent-blue dark:bg-brand-neon-green h-full rounded-full transition-all duration-300" 
                style={{ width: `${exportOverlay.progress}%` }}
              ></div>
            </div>
            <span className="text-[10px] font-mono text-slate-400 mt-2 block">{exportOverlay.progress}% complété</span>
          </div>
        </div>
      )}

      {/* Elegant Custom Notification Toast Alerts */}
      {toastNotification && (
        <div className="fixed bottom-6 left-6 max-w-sm bg-white dark:bg-brand-navy-light text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-brand-navy-lighter rounded-2xl p-4 shadow-2xl z-50 flex gap-3 animate-[fadeIn_0.3s_ease-out] relative">
          <span className={`p-1.5 rounded-xl shrink-0 ${
            toastNotification.type === "success" 
              ? "bg-brand-neon-green/10 text-brand-neon-green" 
              : toastNotification.type === "warning" 
              ? "bg-rose-100/10 text-rose-500" 
              : "bg-brand-accent-blue/10 text-brand-accent-blue"
          }`}>
            {toastNotification.type === "success" && <CheckCircle size={16} />}
            {toastNotification.type === "warning" && <AlertCircle size={16} />}
            {toastNotification.type === "info" && <Cpu size={16} />}
          </span>
          <div>
            <p className="text-xs font-bold leading-normal">{toastNotification.message}</p>
            <span className="text-[9px] text-slate-400 font-mono mt-0.5 inline-block">Émission : Système Thales Informatique</span>
          </div>
          <button 
            onClick={() => setToastNotification(null)}
            className="text-slate-400 hover:text-slate-600 absolute top-2 right-2 p-0.5 hover:bg-slate-50 dark:hover:bg-brand-navy/60 rounded"
          >
            <X size={12} />
          </button>
        </div>
      )}

    </div>
  );
}
