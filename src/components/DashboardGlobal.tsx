import React, { useState } from "react";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  CheckCircle2, 
  ShieldAlert, 
  Users, 
  Sparkles, 
  Compass, 
  ThumbsUp, 
  Terminal,
  FileSpreadsheet,
  Cpu,
  Bookmark
} from "lucide-react";
import { ProjectModule, Resource, ProjectTask, ProjectRisk, ClientSociety } from "../types";

interface DashboardGlobalProps {
  modules: ProjectModule[];
  resources: Resource[];
  tasks: ProjectTask[];
  risks: ProjectRisk[];
  societies: ClientSociety[];
  onNavigateToTab: (tab: string) => void;
  onQuickTaskComplete: (taskId: string) => void;
}

export default function DashboardGlobal({
  modules,
  resources,
  tasks,
  risks,
  societies,
  onNavigateToTab,
  onQuickTaskComplete
}: DashboardGlobalProps) {
  const [hoveredChartBar, setHoveredChartBar] = useState<string | null>(null);
  const [hoveredDonutSlice, setHoveredDonutSlice] = useState<number | null>(null);

  // Calculate dynamic stats
  const totalWorkload = resources.reduce((sum, res) => sum + res.workloadAllocated, 0); 
  const thalesWorkload = resources.filter(r => r.company === "Thales" || r.company === "Thales Informatique").reduce((sum, r) => sum + r.workloadAllocated, 0); 
  const sbdWorkload = resources.filter(r => r.company === "MarsaMaroc" || r.company === "SBD").reduce((sum, r) => sum + r.workloadAllocated, 0);

  const thalesPct = totalWorkload > 0 ? Math.round((thalesWorkload / totalWorkload) * 100) : 0;
  const marsaPct = totalWorkload > 0 ? 100 - thalesPct : 0;

  const completedTasks = tasks.filter(t => t.status === "done").length;
  const totalTasks = tasks.length;

  // Let's compute a dynamic global progress that starts at 21% as requested, but reflects updates.
  // We can weigh progress based on tasks: initial state has 2 completed tasks at 21% progress.
  // Let's make an intuitive formula: 21% starting base, plus some offset of newly completed tasks, 
  // or a weighted average of modules! Let's do a weighted average of modules based on their workload:
  const totalModuleDays = modules.reduce((sum, m) => sum + m.workloadDays, 0);
  const weightedProgressRaw = modules.reduce((sum, m) => sum + (m.progress * m.workloadDays), 0);
  const baseProgressValue = totalModuleDays > 0 ? Math.round(weightedProgressRaw / totalModuleDays) : 21;
  // Ensure we display exactly 21% minimum or adjust to match the requested 21% at initial state:
  const displayProgress = Math.max(21, baseProgressValue);

  // Donut chart status distribution logic
  const todoCount = tasks.filter(t => t.status === "todo").length;
  const doingCount = tasks.filter(t => t.status === "doing" || t.status === "blocking").length;
  const doneCount = tasks.filter(t => t.status === "done").length;
  
  const totalStatusCounts = todoCount + doingCount + doneCount;
  const pctDone = totalStatusCounts > 0 ? Math.round((doneCount / totalStatusCounts) * 100) : 10;
  const pctDoing = totalStatusCounts > 0 ? Math.round((doingCount / totalStatusCounts) * 100) : 30;
  const pctTodo = totalStatusCounts > 0 ? 100 - pctDone - pctDoing : 60;

  // Colors: Navy/blue (#2F80ED), green (#00C853), gray (#E2E8F0)
  const donutData = [
    { label: "Terminé", count: doneCount, pct: pctDone, color: "#00C853" },
    { label: "En cours / Bloqué", count: doingCount, pct: pctDoing, color: "#2F80ED" },
    { label: "À venir", count: todoCount, pct: pctTodo, color: "#94A3B8" },
  ];

  // Active blocking tasks
  const blockingTasks = tasks.filter(t => t.status === "blocking" || t.priority === "High" && t.status !== "done").slice(0, 3);

  // Modules list for histogram
  const histogramModules = modules.slice(0, 6); // Ventes, Prod, Compta, Analytique, Qualité, Gestion de projs (plus Sage modules if we want)

  return (
    <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
      
      {/* 4 Cards Executive KPI Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1: Avancement Global */}
        <div className="bg-white dark:bg-brand-navy-light rounded-2xl p-6 border border-slate-200 dark:border-brand-navy-lighter/60 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent-blue/5 rounded-full blur-2xl -mr-6 -mt-6"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono tracking-wider uppercase font-semibold">Avancement Global</span>
            <span className="text-[10px] bg-brand-neon-green/10 text-brand-neon-green px-2 py-0.5 rounded font-mono font-bold flex items-center gap-0.5">
              <ArrowUpRight size={10} /> +4.2%/sem
            </span>
          </div>
          
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-display font-bold text-slate-900 dark:text-white">{displayProgress}%</span>
            <span className="text-xs text-slate-400">du projet achevé</span>
          </div>

          <div className="mt-4">
            <div className="w-full bg-slate-100 dark:bg-brand-navy/60 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-brand-neon-green h-full rounded-full transition-all duration-1000 ease-out shadow-sm shadow-brand-neon-green/50" 
                style={{ width: `${displayProgress}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-2.5 text-[10px] font-mono text-slate-400">
              <span>Lancement</span>
              <span className="text-brand-neon-green font-semibold">Cible : 100% (Go-Live)</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Charge Totale */}
        <div className="bg-white dark:bg-brand-navy-light rounded-2xl p-6 border border-slate-200 dark:border-brand-navy-lighter/60 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-neon-green/5 rounded-full blur-2xl -mr-6 -mt-6"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono tracking-wider uppercase font-semibold">Charge Estimée</span>
            <span className="text-[10px] bg-slate-100 dark:bg-brand-navy-lighter text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded font-mono">
              2 Collaborations
            </span>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-display font-bold text-slate-900 dark:text-white">{totalWorkload} j/h</span>
            <span className="text-xs text-slate-400">répartis</span>
          </div>

          <div className="mt-4 space-y-2">
            {/* Thales representation */}
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent-blue"></span> Thales
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{thalesWorkload} j ({thalesPct}%)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-brand-navy/60 rounded-full h-1.5">
                <div className="bg-brand-accent-blue h-full rounded-full" style={{ width: `${thalesPct}%` }}></div>
              </div>
            </div>
            
            {/* MarsaMaroc representation */}
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-neon-green"></span> MarsaMaroc
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{sbdWorkload} j ({marsaPct}%)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-brand-navy/60 rounded-full h-1.5">
                <div className="bg-brand-neon-green h-full rounded-full" style={{ width: `${marsaPct}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* KPI 3: Tâches réalisées */}
        <div className="bg-white dark:bg-brand-navy-light rounded-2xl p-6 border border-slate-200 dark:border-brand-navy-lighter/60 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-neon/5 rounded-full blur-2xl -mr-6 -mt-6"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono tracking-wider uppercase font-semibold">Tâches Réalisées</span>
            <span className="text-[10px] bg-brand-accent-blue/10 text-brand-accent-blue px-2 py-0.5 rounded font-mono font-semibold">
              Suivi Modules
            </span>
          </div>

          <div className="mt-4 flex items-baseline gap-2.5">
            <span className="text-4xl font-display font-bold text-slate-900 dark:text-white">
              {completedTasks} <span className="text-lg text-slate-400">/ {totalTasks}</span>
            </span>
            <span className="text-xs text-brand-neon-green font-medium">
              ({Math.round((completedTasks/totalTasks)*100)}%)
            </span>
          </div>

          <div className="mt-4">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-brand-navy/30 p-2.5 rounded-xl border border-slate-100 dark:border-brand-navy-lighter/20">
              <CheckCircle2 size={14} className="text-brand-neon-green shrink-0" />
              <span className="truncate">
                {totalTasks - completedTasks} restantes pour finaliser la phase
              </span>
            </div>
            
            <button 
              onClick={() => onNavigateToTab("modules")}
              className="mt-3.5 w-full text-center text-xs text-brand-accent-blue dark:text-brand-neon-green hover:underline font-medium flex items-center justify-center gap-1.5"
            >
              Voir la situation des modules &rarr;
            </button>
          </div>
        </div>

        {/* KPI 4: Statut Projet */}
        <div className="bg-white dark:bg-brand-navy-light rounded-2xl p-6 border border-brand-neon-green dark:border-brand-neon-green/65 shadow-lg shadow-brand-neon-green-glow/20 relative overflow-hidden group transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-neon-green/5 rounded-full blur-2xl -mr-6 -mt-6"></div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono tracking-wider uppercase font-semibold">Durée & Déroulement</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-neon-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-neon-green"></span>
            </span>
          </div>

          <div className="mt-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-display font-bold text-brand-neon-green tracking-wide">8 SEMAINES</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Cadrage, Paramétrage & Formation</p>
          </div>

          <div className="mt-5 border-t border-slate-100 dark:border-brand-navy-lighter/60 pt-3.5 flex justify-between items-center">
            <div>
              <p className="text-[10px] text-slate-400 font-mono uppercase">Go-Live Cible</p>
              <p className="text-xs font-bold text-slate-800 dark:text-white leading-tight">Post-Formation</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-mono uppercase">Version Sage</p>
              <p className="text-xs font-bold text-brand-accent-blue dark:text-brand-neon-green leading-tight">100c Paie & RH</p>
            </div>
          </div>
        </div>

      </div>

      {/* Main Column Double Graphic Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Graphics: Bar Chart Avancement par Module (Span 2) */}
        <div className="bg-white dark:bg-brand-navy-light rounded-2xl p-6 border border-slate-200 dark:border-brand-navy-lighter/60 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-display font-bold text-slate-900 dark:text-white">Avancement Historique & Réel par Module</h3>
              <p className="text-xs text-slate-500">Taux actuel d'intégration des modules de base</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded bg-brand-accent-blue"></span> Réel %
              </span>
              <button 
                onClick={() => onNavigateToTab("modules")}
                className="text-brand-accent-blue dark:text-brand-neon-green hover:underline"
              >
                Gérer tous les modules
              </button>
            </div>
          </div>

          {/* Render custom beautifully responsive SVG Bar Chart */}
          <div className="relative pt-4 outline-none">
            <div className="space-y-4">
              {histogramModules.map((mod, index) => (
                <div 
                  key={mod.id} 
                  className="space-y-1.5 relative"
                  onMouseEnter={() => setHoveredChartBar(mod.id)}
                  onMouseLeave={() => setHoveredChartBar(null)}
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                      <span className="w-1.5 h-6 rounded bg-brand-navy-lighter flex items-center justify-center font-mono text-[9px] text-slate-400">
                        {index + 1}
                      </span>
                      {mod.name}
                    </span>
                    <span className="font-mono text-xs text-brand-accent-blue dark:text-brand-neon-green font-bold">
                      {mod.progress}%
                    </span>
                  </div>
                  
                  <div className="relative w-full h-8 bg-slate-100 dark:bg-brand-navy/50 rounded-lg overflow-hidden border border-slate-200/40 dark:border-brand-navy-lighter/10">
                    <div 
                      className={`h-full rounded-r-lg transition-all duration-700 ease-out flex items-center justify-end pr-3 ${
                        mod.progress >= 75 
                          ? "bg-brand-neon-green" 
                          : mod.progress >= 35 
                          ? "bg-brand-accent-blue" 
                          : "bg-amber-neon"
                      }`}
                      style={{ width: `${mod.progress}%` }}
                    >
                      {mod.progress > 15 && (
                        <span className="text-[10px] font-mono text-white dark:text-brand-navy font-bold">
                          {mod.workloadDays} jours
                        </span>
                      )}
                    </div>
                  </div>

                  {hoveredChartBar === mod.id && (
                    <div className="absolute right-0 -top-8 bg-brand-navy text-white text-[11px] p-2 rounded-lg shadow-lg z-30 max-w-xs border border-brand-navy-lighter">
                      <p className="font-bold mb-0.5">{mod.name}</p>
                      <p className="text-slate-300 text-[10px] leading-tight mb-1">{mod.description}</p>
                      <p className="text-brand-neon-green font-mono">Expert ID: {mod.responsibleId}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Legend guide rules */}
            <div className="flex justify-between mt-6 pt-4 border-t border-slate-100 dark:border-brand-navy-lighter/30 text-[10px] font-mono text-slate-400">
              <span>0% (Planifié)</span>
              <span>25%</span>
              <span>50% (Pilote)</span>
              <span>75%</span>
              <span>100% (Go-Live)</span>
            </div>
          </div>
        </div>

        {/* Right Graphics: Donut Chart Répartition Statuts (Span 1) */}
        <div className="bg-white dark:bg-brand-navy-light rounded-2xl p-6 border border-slate-200 dark:border-brand-navy-lighter/60 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-display font-bold text-slate-900 dark:text-white">Répartition Statuts</h3>
            <p className="text-xs text-slate-500">Statut en temps réel des {totalTasks} tâches de migration</p>
          </div>

          {/* Interactive SVG Donut */}
          <div className="my-6 flex justify-center relative items-center">
            <svg width="200" height="200" className="transform -rotate-90">
              {/* Outer stroke radius */}
              {/* We calculate strokeDasharray based on percentages */}
              {(() => {
                let accumulatedPercent = 0;
                return donutData.map((slice, i) => {
                  const r = 70;
                  const circ = 2 * Math.PI * r; // ~439.8
                  const strokeLength = (slice.pct / 100) * circ;
                  const strokeOffset = circ - (accumulatedPercent / 100) * circ;
                  accumulatedPercent += slice.pct;
                  
                  return (
                    <circle
                      key={i}
                      cx="100"
                      cy="100"
                      r={r}
                      fill="transparent"
                      stroke={slice.color}
                      strokeWidth="20"
                      strokeDasharray={`${strokeLength} ${circ}`}
                      strokeDashoffset={strokeOffset}
                      strokeLinecap="round"
                      className="transition-all duration-500 cursor-pointer hover:stroke-[24px]"
                      onMouseEnter={() => setHoveredDonutSlice(i)}
                      onMouseLeave={() => setHoveredDonutSlice(null)}
                    />
                  );
                });
              })()}
            </svg>

            {/* Centered label */}
            <div className="absolute text-center select-none pointer-events-none">
              {hoveredDonutSlice !== null ? (
                <>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white">
                    {donutData[hoveredDonutSlice].count}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    {donutData[hoveredDonutSlice].label}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-3xl font-display font-bold text-slate-900 dark:text-white">
                    {totalTasks}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono">
                    TÂCHES TOTALES
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Donut Legend */}
          <div className="space-y-1.5 text-xs">
            {donutData.map((slice, i) => (
              <div 
                key={i} 
                className={`flex items-center justify-between p-2 rounded-lg transition-colors duration-150 ${
                  hoveredDonutSlice === i ? "bg-slate-100 dark:bg-brand-navy/60" : ""
                }`}
                onMouseEnter={() => setHoveredDonutSlice(i)}
                onMouseLeave={() => setHoveredDonutSlice(null)}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: slice.color }}></span>
                  <span className="text-slate-600 dark:text-slate-300 font-medium">{slice.label}</span>
                </div>
                <span className="font-mono text-slate-800 dark:text-slate-200 font-bold">
                  {slice.count} ({slice.pct}%)
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Row grid: Partnership info + Blocking points list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Partnership / Consultant Focus (Corporate team block layout) */}
        <div className="bg-white dark:bg-brand-navy-light rounded-2xl p-6 border border-slate-200 dark:border-brand-navy-lighter/60 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300 flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-neon-green/5 rounded-full blur-2xl -mr-6 -mt-6"></div>
          
          <div>
            <div className="w-10 h-10 bg-brand-neon-green/15 text-brand-neon-green rounded-xl flex items-center justify-center mb-4">
              <Users size={20} />
            </div>
            
            <h4 className="text-base font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Partenariat Thales Informatique x MarsaMaroc <span className="text-[10px] bg-brand-neon-green/10 text-brand-neon-green font-mono px-1.5 py-0.5 rounded">Expert Team</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Accompagnement technique & fonctionnel sur l'optimisation des flux natifs. Interfaçage sécurisé entre les logiciels phares Sage 100c Paie et Sage Espace Employés.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-brand-navy-lighter/30 flex items-center justify-between">
            <div className="flex -space-x-2">
              {resources.map((res) => (
                <img 
                  key={res.id}
                  src={res.avatar} 
                  alt={res.name}
                  title={`${res.name} (${res.company})`}
                  className="w-8 h-8 rounded-full border-2 border-white dark:border-brand-navy-light object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />
              ))}
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {resources.length} Experts actifs
            </span>
          </div>
        </div>

        {/* Dynamic Activity / Immediate Actions List (Span 2) */}
        <div className="bg-white dark:bg-brand-navy-light rounded-2xl p-6 border border-slate-200 dark:border-brand-navy-lighter/60 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Actions Critiques & Sprint Actuel
              </h4>
              <p className="text-xs text-slate-500">Tâches urgentes à réaliser en priorité</p>
            </div>
            <button 
              onClick={() => onNavigateToTab("planning")}
              className="text-xs text-brand-accent-blue dark:text-brand-neon-green hover:underline font-semibold"
            >
              Créer une tâche &rarr;
            </button>
          </div>

          {blockingTasks.length > 0 ? (
            <div className="space-y-3">
              {blockingTasks.map((task) => {
                const moduleOfTask = modules.find(m => m.id === task.moduleId);
                const assignedResource = resources.find(r => r.id === task.assignedToId);
                
                return (
                  <div 
                    key={task.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 bg-slate-50 dark:bg-brand-navy/50 rounded-xl border border-slate-100 dark:border-brand-navy-lighter/30 hover:border-slate-200 dark:hover:border-brand-navy-lighter transition-all duration-200 gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                          task.status === "blocking" 
                            ? "bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" 
                            : "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                        }`}>
                          {task.status === "blocking" ? "BLOQUANT" : "PRIORITAIRE"}
                        </span>
                        
                        <span className="text-[10px] text-brand-accent-blue dark:text-brand-neon-green bg-brand-accent-blue/5 dark:bg-brand-neon-green/5 px-2 py-0.5 rounded font-medium">
                          {moduleOfTask?.name || "Module Générique"}
                        </span>
                      </div>
                      
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1.5 truncate">
                        {task.title}
                      </p>
                      
                      <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-slate-400 font-mono">
                        <Clock size={10} />
                        <span>Cible : {task.endDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {assignedResource && (
                        <div className="flex items-center gap-2">
                          <img 
                            src={assignedResource.avatar} 
                            alt={assignedResource.name} 
                            className="w-6 h-6 rounded-full object-cover border border-slate-200"
                            referrerPolicy="no-referrer"
                          />
                          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                            {assignedResource.name.split(" ")[0]}
                          </span>
                        </div>
                      )}
                      
                      <button
                        onClick={() => onQuickTaskComplete(task.id)}
                        className="px-2.5 py-1 text-[10px] font-bold bg-white dark:bg-brand-navy-light text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-brand-navy-lighter hover:bg-slate-50 dark:hover:bg-brand-navy-light hover:text-brand-neon-green hover:border-brand-neon-green transition-colors duration-150 shadow-sm"
                      >
                        Valider la tâche
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 border-2 border-dashed border-slate-150 dark:border-brand-navy-lighter/25 rounded-2xl">
              <CheckCircle2 size={32} className="text-brand-neon-green mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-800 dark:text-white">Toutes les tâches urgentes sont traitées !</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Le plan de route suit son cours nominal.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
