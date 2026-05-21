import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  Edit3, 
  Calendar, 
  User, 
  Clock, 
  Layers, 
  TrendingUp,
  CheckCircle,
  FileText,
  AlertCircle
} from "lucide-react";
import { ProjectModule, Resource, ProjectTask } from "../types";

interface ModulesViewProps {
  modules: ProjectModule[];
  resources: Resource[];
  tasks: ProjectTask[];
  onUpdateModuleProgress: (moduleId: string, progress: number) => void;
  onUpdateTaskStatus: (taskId: string, status: "todo" | "doing" | "done" | "blocking") => void;
}

export default function ModulesView({
  modules,
  resources,
  tasks,
  onUpdateModuleProgress,
  onUpdateTaskStatus
}: ModulesViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<"All" | "Paie_RH" | "Espace_Employes" | "ERP_X3" | "Interface">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>("mod-paie");

  // Categories translation
  const categoriesMap = {
    Paie_RH: "Sage 100c Paie & RH",
    Espace_Employes: "Sage Espace Employés Modules",
    ERP_X3: "Sage X3 Modules d'Intégration",
    Interface: "Interface",
  };

  // Filter modules
  const filteredModules = modules.filter(m => {
    const matchesCategory = selectedCategory === "All" || m.category === selectedCategory;
    const matchesQuery = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  // Current selected module detailed info
  const selectedModule = modules.find(m => m.id === selectedModuleId) || modules[0];
  
  // Tasks for current selected module
  const moduleTasks = tasks.filter(t => t.moduleId === selectedModule?.id);
  const selectedModuleLead = resources.find(r => r.id === selectedModule?.responsibleId);

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      
      {/* Search and Category Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-white dark:bg-brand-navy-light rounded-2xl border border-slate-200 dark:border-brand-navy-lighter/60 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors duration-150 ${
              selectedCategory === "All"
                ? "bg-brand-navy dark:bg-brand-neon-green text-white dark:text-brand-navy font-bold"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 dark:bg-brand-navy/40"
            }`}
          >
            Tout ({modules.length})
          </button>
          <button
            onClick={() => setSelectedCategory("Paie_RH")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors duration-150 ${
              selectedCategory === "Paie_RH"
                ? "bg-brand-navy dark:bg-brand-neon-green text-white dark:text-brand-navy font-bold"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 dark:bg-brand-navy/40"
            }`}
          >
            Sage 100c Paie & RH
          </button>
          <button
            onClick={() => setSelectedCategory("Espace_Employes")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors duration-150 ${
              selectedCategory === "Espace_Employes"
                ? "bg-brand-navy dark:bg-brand-neon-green text-white dark:text-brand-navy font-bold"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 dark:bg-brand-navy/40"
            }`}
          >
            Sage Espace Employés
          </button>
          <button
            onClick={() => {
              setSelectedCategory("Interface");
              setSelectedModuleId("mod-interface-sap");
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors duration-150 ${
              selectedCategory === "Interface"
                ? "bg-brand-navy dark:bg-brand-neon-green text-white dark:text-brand-navy font-bold"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 dark:bg-brand-navy/40"
            }`}
          >
            Interface
          </button>
        </div>

        <div className="relative w-full md:w-80">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <Search size={15} />
          </span>
          <input
            type="text"
            placeholder="Filtrer les modules de la suite..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 dark:bg-brand-navy/40 hover:bg-slate-200/50 dark:hover:bg-brand-navy/80 border border-slate-200 dark:border-brand-navy-lighter/40 rounded-xl py-2 pl-10 pr-4 text-xs dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-accent-blue"
          />
        </div>
      </div>

      {/* Grid: 2 Columns - Left list of modules, Right selected module details */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left Hand: Modules Grid List (takes 3/5 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center px-2">
            <span className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">Situation Réelle des Modules</span>
            <span className="text-xs text-slate-500">{filteredModules.length} Modules trouvés</span>
          </div>

          <div className="space-y-3.5">
            {filteredModules.map((mod) => {
              const isSelected = selectedModuleId === mod.id;
              const moduleLead = resources.find(r => r.id === mod.responsibleId);
              
              // Count tasks and progress
              const totalTasksForMod = tasks.filter(t => t.moduleId === mod.id).length;
              const completedTasksForMod = tasks.filter(t => t.moduleId === mod.id && t.status === "done").length;
              
              return (
                <div
                  key={mod.id}
                  onClick={() => setSelectedModuleId(mod.id)}
                  className={`p-5 rounded-2xl text-left border cursor-pointer pointer-events-auto transition-all duration-300 relative overflow-hidden group hover:translate-x-1 ${
                    isSelected
                      ? "bg-brand-navy dark:bg-brand-navy-light text-white border-brand-accent-blue dark:border-brand-neon-green shadow-lg"
                      : "bg-white dark:bg-brand-navy-light text-slate-800 dark:text-slate-300 border-slate-200 dark:border-brand-navy-lighter/40 hover:border-slate-300 dark:hover:border-slate-500 shadow-sm"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded ${
                        isSelected 
                          ? "bg-brand-neon-green/15 text-brand-neon-green" 
                          : "bg-slate-100 dark:bg-brand-navy/80 text-slate-500 dark:text-slate-400"
                      }`}>
                        {categoriesMap[mod.category] || mod.category}
                      </span>
                      <h3 className={`text-sm font-bold font-display mt-2 ${
                        isSelected ? "text-white" : "text-slate-900 dark:text-white group-hover:text-brand-accent-blue"
                      }`}>
                        {mod.name}
                      </h3>
                    </div>
                    
                    <span className={`text-xs font-mono font-bold ${
                      mod.progress >= 75 
                        ? "text-brand-neon-green" 
                        : mod.progress >= 35 
                        ? "text-brand-accent-blue" 
                        : "text-amber-neon"
                    }`}>
                      {mod.progress}%
                    </span>
                  </div>

                  {/* Descriptions block */}
                  <p className={`text-xs mt-2 line-clamp-2 leading-relaxed ${
                    isSelected ? "text-slate-300" : "text-slate-500"
                  }`}>
                    {mod.description}
                  </p>

                  {/* Horizontal progress indicators */}
                  <div className="mt-4">
                    <div className="w-full bg-slate-100 dark:bg-brand-navy/40 rounded-full h-1/5 h-1 md:h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          isSelected ? "bg-brand-neon-green shadow-sm" : "bg-brand-accent-blue"
                        }`}
                        style={{ width: `${mod.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Inline Footer details */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-brand-navy-lighter/20 flex flex-wrap items-center justify-between text-[11px] gap-2">
                    {moduleLead && (
                      <div className="flex items-center gap-1.5">
                        <img 
                          src={moduleLead.avatar} 
                          alt={moduleLead.name} 
                          className="w-5 h-5 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className={isSelected ? "text-slate-300" : "text-slate-600 dark:text-slate-400"}>
                          {moduleLead.name.split(" ")[0]}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {mod.workloadDays} j/h
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText size={12} /> {completedTasksForMod}/{totalTasksForMod} Tâches
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Hand: Module Details & Task Inspector (takes 2/5 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">Inspecteur de Configuration</span>
          </div>

          {selectedModule ? (
            <div className="bg-white dark:bg-brand-navy-light rounded-2xl p-6 border border-slate-200 dark:border-brand-navy-lighter/60 shadow-sm space-y-6">
              
              {/* Module Main Title */}
              <div>
                <span className="text-[10px] font-mono text-brand-accent-blue dark:text-brand-neon-green font-bold uppercase tracking-widest bg-brand-accent-blue/5 dark:bg-brand-neon-green/5 px-2.5 py-1 rounded">
                  {categoriesMap[selectedModule.category]}
                </span>
                <h3 className="text-base font-display font-bold text-slate-900 dark:text-white mt-3 leading-snug">
                  {selectedModule.name}
                </h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {selectedModule.description}
                </p>
              </div>

              {/* Diagramme Interface Comptable SAP-FI */}
              {selectedModule.id === "mod-interface-sap" && (
                <div className="p-4 bg-slate-50 dark:bg-brand-navy/60 rounded-xl border border-slate-200/50 dark:border-brand-navy-lighter/30 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase font-mono tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-brand-neon-green inline-block animate-pulse"></span>
                    Diagramme : Interface Comptable SAP-FI
                  </h4>
                  <p className="text-[11px] text-slate-500">Flux d'intégration automatisé des écritures de paie d'OD</p>
                  
                  {/* Flow Diagram Illustration */}
                  <div className="pt-2 pb-1 flex flex-col items-center gap-3">
                    {/* Node 1 */}
                    <div className="w-full bg-white dark:bg-brand-navy-light border border-slate-150 dark:border-brand-navy-lighter/60 p-2.5 rounded-lg flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 font-bold font-mono text-[10px] flex items-center justify-center">S</span>
                        <div>
                          <p className="text-[11px] font-bold text-slate-800 dark:text-slate-100">Sage 100c Paie</p>
                          <p className="text-[9px] text-slate-400 font-mono">Génération des écritures d'OD</p>
                        </div>
                      </div>
                      <span className="text-[9px] bg-slate-100 dark:bg-brand-navy px-1.5 py-0.5 rounded text-slate-500 font-mono">OD_PAIE.csv</span>
                    </div>

                    {/* Down arrow */}
                    <div className="flex flex-col items-center">
                      <div className="h-3 w-0.5 bg-gradient-to-b from-brand-accent-blue to-brand-neon-green"></div>
                      <span className="text-[8px] text-slate-400 font-mono my-0.5">Transfert FTP</span>
                      <div className="h-3 w-0.5 bg-gradient-to-b from-brand-neon-green to-brand-accent-blue"></div>
                    </div>

                    {/* Node 2 - Mapping Engine */}
                    <div className="w-full bg-gradient-to-r from-brand-accent-blue/5 to-brand-neon-green/5 border border-brand-accent-blue/30 dark:border-brand-neon-green/20 p-2.5 rounded-lg flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-brand-accent-blue/10 dark:bg-brand-accent-blue/20 text-brand-accent-blue font-bold font-mono text-[10px] flex items-center justify-center">SC</span>
                        <div>
                          <p className="text-[11px] font-bold text-slate-800 dark:text-slate-100">Sage Connect (Pivot)</p>
                          <p className="text-[9px] text-slate-400 font-mono">Mapping comptes 641, 421 & Analytique</p>
                        </div>
                      </div>
                      <span className="text-[9px] bg-brand-neon-green/10 text-brand-neon-green px-1.5 py-0.5 rounded font-mono font-bold">Auto-Validation</span>
                    </div>

                    {/* Down arrow */}
                    <div className="flex flex-col items-center">
                      <div className="h-3 w-0.5 bg-gradient-to-b from-brand-neon-green to-brand-accent-blue"></div>
                      <span className="text-[8px] text-slate-400 font-mono my-0.5">API REST / SAP FTPS</span>
                      <div className="h-3 w-0.5 bg-gradient-to-b from-brand-accent-blue to-brand-neon-green"></div>
                    </div>

                    {/* Node 3 - Destination */}
                    <div className="w-full bg-white dark:bg-brand-navy-light border border-slate-150 dark:border-brand-navy-lighter/60 p-2.5 rounded-lg flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 font-bold font-mono text-[10px] flex items-center justify-center">SAP</span>
                        <div>
                          <p className="text-[11px] font-bold text-slate-800 dark:text-slate-100">SAP-FI (Comptabilité)</p>
                          <p className="text-[9px] text-slate-400 font-mono">Enregistrement & Écritures générales</p>
                        </div>
                      </div>
                      <span className="text-[9px] bg-brand-accent-blue/10 text-brand-accent-blue px-1.5 py-0.5 rounded font-mono font-bold">Format IDoc ok</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Slider for updating module progress */}
              <div className="p-4 bg-slate-50 dark:bg-brand-navy/50 rounded-xl border border-slate-100 dark:border-brand-navy-lighter/30">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <TrendingUp size={14} className="text-brand-accent-blue" />
                    Réviser l'avancement :
                  </span>
                  <span className="text-sm font-mono font-extrabold text-brand-accent-blue dark:text-brand-neon-green bg-white dark:bg-brand-navy px-2 py-0.5 rounded shadow-sm">
                    {selectedModule.progress}%
                  </span>
                </div>
                
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={selectedModule.progress}
                  onChange={(e) => onUpdateModuleProgress(selectedModule.id, parseInt(e.target.value))}
                  className="w-full accent-brand-accent-blue dark:accent-brand-neon-green h-2 bg-slate-200 dark:bg-brand-navy rounded-lg appearance-none cursor-pointer mt-2"
                />
                
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-2">
                  <span>Planifié</span>
                  <span>En test</span>
                  <span>Opérationnel (100%)</span>
                </div>
              </div>

              {/* Consultant Responsible Card */}
              {selectedModuleLead && (
                <div className="flex items-center gap-3 p-3 bg-slate-100/50 dark:bg-brand-navy/20 rounded-xl border border-slate-200/40 dark:border-brand-navy-lighter/10">
                  <img 
                    src={selectedModuleLead.avatar} 
                    alt={selectedModuleLead.name} 
                    className="w-9 h-9 rounded-full object-cover border"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <p className="text-[10px] text-slate-400 font-mono">EXPERT CONSULTANT</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{selectedModuleLead.name}</p>
                    <p className="text-[10px] text-brand-accent-blue dark:text-brand-neon-green">{selectedModuleLead.role} ({selectedModuleLead.company})</p>
                  </div>
                </div>
              )}

              {/* Tasks Checklist for selected module */}
              <div className="space-y-3.5 pt-2 border-t border-slate-100 dark:border-brand-navy-lighter/30">
                <h4 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">Tâches de configuration ({moduleTasks.length})</h4>
                
                {moduleTasks.length > 0 ? (
                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {moduleTasks.map((task) => (
                      <div 
                        key={task.id}
                        className="p-3 bg-slate-50 dark:bg-brand-navy/30 rounded-lg border border-slate-150 dark:border-brand-navy-lighter/25 flex flex-col gap-2 hover:border-slate-200 transition-all duration-150"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                            {task.title}
                          </p>
                          <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            task.priority === "High" 
                              ? "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400"
                              : task.priority === "Medium"
                              ? "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400"
                              : "bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-400"
                          }`}>
                            {task.priority}
                          </span>
                        </div>

                        {/* Status Selection Pill Buttons */}
                        <div className="flex items-center justify-between text-[11px] pt-1 mt-1 border-t border-slate-100 dark:border-brand-navy-light/40">
                          <span className="text-[10px] text-slate-400 font-mono">Statut :</span>
                          <div className="flex gap-1.5">
                            {(["todo", "doing", "done", "blocking"] as const).map((st) => (
                              <button
                                key={st}
                                onClick={() => onUpdateTaskStatus(task.id, st)}
                                className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-mono transition-colors duration-150 capitalize ${
                                  task.status === st
                                    ? st === "done"
                                      ? "bg-brand-neon-green text-brand-navy"
                                      : st === "todo"
                                      ? "bg-slate-300 text-slate-800"
                                      : st === "blocking"
                                      ? "bg-rose-neon text-white animate-pulse"
                                      : "bg-brand-accent-blue text-white"
                                    : "bg-slate-100 dark:bg-brand-navy text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                                }`}
                              >
                                {st === "doing" ? "En Cours" : st === "done" ? "Fait" : st === "blocking" ? "Bloqué" : "À Faire"}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4 italic">Aucune tâche assignée à ce module pour l'instant.</p>
                )}
              </div>

            </div>
          ) : (
            <div className="bg-slate-100 dark:bg-brand-navy-light rounded-2xl p-6 text-center text-slate-400 italic">
              Sélectionnez un module de la Sage Suite pour inspecter ses configurations.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
