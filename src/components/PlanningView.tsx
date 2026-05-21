import React, { useState } from "react";
import { 
  Plus, 
  Trash2, 
  Calendar, 
  User, 
  Layers, 
  Clock, 
  CheckCircle, 
  Search,
  Filter,
  CheckCircle2,
  X,
  PlusCircle,
  AlertTriangle
} from "lucide-react";
import { ProjectTask, ProjectModule, Resource } from "../types";

interface PlanningViewProps {
  tasks: ProjectTask[];
  modules: ProjectModule[];
  resources: Resource[];
  onAddTask: (task: Omit<ProjectTask, "id">) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTaskStatus: (taskId: string, status: "todo" | "doing" | "done" | "blocking") => void;
}

export default function PlanningView({
  tasks,
  modules,
  resources,
  onAddTask,
  onDeleteTask,
  onUpdateTaskStatus
}: PlanningViewProps) {
  const [selectedPriority, setSelectedPriority] = useState<"All" | "High" | "Medium" | "Low">("All");
  const [selectedStatus, setSelectedStatus] = useState<"All" | "todo" | "doing" | "done" | "blocking">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState("");
  const [newModuleId, setNewModuleId] = useState(modules[0]?.id || "");
  const [newAssignedId, setNewAssignedId] = useState(resources[0]?.id || "");
  const [newPriority, setNewPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [newStartDate, setNewStartDate] = useState("2026-05-25");
  const [newEndDate, setNewEndDate] = useState("2026-06-15");

  // Handle task submission
  const handleSubmitTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      title: newTitle,
      moduleId: newModuleId,
      assignedToId: newAssignedId,
      progress: 0,
      status: "todo",
      priority: newPriority,
      startDate: newStartDate,
      endDate: newEndDate
    });

    // Resetform
    setNewTitle("");
    setShowAddModal(false);
  };

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    const matchesPriority = selectedPriority === "All" || t.priority === selectedPriority;
    const matchesStatus = selectedStatus === "All" || t.status === selectedStatus;
    const matchesQuery = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesStatus && matchesQuery;
  });

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      
      {/* Search and Filters toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-5 bg-white dark:bg-brand-navy-light rounded-2xl border border-slate-200 dark:border-brand-navy-lighter/60 shadow-sm">
        
        {/* Filters Select */}
        <div className="flex flex-wrap items-center gap-3">
          
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-brand-navy/60 px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-brand-navy-lighter/40">
            <Filter size={13} className="text-slate-400" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Priorité :</span>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value as any)}
              className="bg-transparent border-none text-xs text-slate-700 dark:text-slate-300 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-white dark:bg-brand-navy dark:text-white">Toutes</option>
              <option value="High" className="bg-white dark:bg-brand-navy dark:text-white">Élevée</option>
              <option value="Medium" className="bg-white dark:bg-brand-navy dark:text-white">Moyenne</option>
              <option value="Low" className="bg-white dark:bg-brand-navy dark:text-white">Basse</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 dark:bg-brand-navy/60 px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-brand-navy-lighter/40">
            <CheckCircle2 size={13} className="text-slate-400" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Statut :</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="bg-transparent border-none text-xs text-slate-700 dark:text-slate-300 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-white dark:bg-brand-navy dark:text-white">Tous les statuts</option>
              <option value="todo" className="bg-white dark:bg-brand-navy dark:text-white">À Faire</option>
              <option value="doing" className="bg-white dark:bg-brand-navy dark:text-white">En Cours</option>
              <option value="done" className="bg-white dark:bg-brand-navy dark:text-white">Fait</option>
              <option value="blocking" className="bg-white dark:bg-brand-navy dark:text-white">Bloquant</option>
            </select>
          </div>

          {/* Search bar */}
          <div className="relative w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Search size={14} />
            </span>
            <input
              type="text"
              placeholder="Chercher une tâche..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-brand-navy/60 hover:bg-slate-100/80 border border-slate-200 dark:border-brand-navy-lighter/40 rounded-xl py-1.5 pl-9 pr-4 text-xs dark:text-white placeholder-slate-400 focus:outline-none"
            />
          </div>

        </div>

        {/* Trigger Task addition modal */}
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-navy dark:bg-brand-neon-green hover:bg-brand-navy-light dark:hover:bg-[#00b047] text-white dark:text-brand-navy rounded-xl text-xs font-bold transition-all duration-300 shadow-sm"
        >
          <PlusCircle size={15} />
          <span>Créer une Tâche</span>
        </button>

      </div>

      {/* Task Creation Modal Popup */}
      {showAddModal && (
        <div className="fixed inset-0 bg-brand-navy/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-brand-navy border border-slate-200 dark:border-brand-navy-lighter w-full max-w-lg rounded-2xl p-6 shadow-2xl relative animate-[fadeIn_0.2s_ease-out]">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-650"
            >
              <X size={20} />
            </button>

            <h3 className="text-base font-display font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              Créer une nouvelle tâche de migration
            </h3>

            <form onSubmit={handleSubmitTask} className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1">TITRE DE LA TÂCHE DE CONFIGURATION</label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Configurer Yousign pour de l'onboarding..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-brand-navy-light/60 border border-slate-205 dark:border-brand-navy-lighter rounded-lg p-2.5 text-xs dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-mono block mb-1">MODULE ASSOCIE</label>
                  <select
                    value={newModuleId}
                    onChange={(e) => setNewModuleId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-brand-navy-light/60 border border-slate-205 dark:border-brand-navy-lighter rounded-lg p-2.5 text-xs dark:text-white focus:outline-none"
                  >
                    {modules.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-mono block mb-1">RESPONSABLE EXPERT</label>
                  <select
                    value={newAssignedId}
                    onChange={(e) => setNewAssignedId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-brand-navy-light/60 border border-slate-205 dark:border-brand-navy-lighter rounded-lg p-2.5 text-xs dark:text-white focus:outline-none"
                  >
                    {resources.map((r) => (
                      <option key={r.id} value={r.id}>{r.name} ({r.company})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 font-mono block mb-1">PRIORITE</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-brand-navy-light/60 border border-slate-225 dark:border-brand-navy-lighter rounded-lg p-2.5 text-xs dark:text-white focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-mono block mb-1">DEBUT</label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-brand-navy-light/60 border border-slate-225 dark:border-brand-navy-lighter rounded-lg p-2.5 text-xs dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-mono block mb-1">FIN TARGET</label>
                  <input
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-brand-navy-light/60 border border-slate-225 dark:border-brand-navy-lighter rounded-lg p-2.5 text-xs dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-brand-navy-lighter/35">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-brand-navy-light dark:hover:bg-brand-navy-lighter border text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-navy dark:bg-brand-neon-green text-white dark:text-brand-navy hover:bg-brand-navy-light dark:hover:bg-[#00b047] rounded-xl text-xs font-bold"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Gantt Timeline lane view + Tasks database */}
      <div className="space-y-6">
        
        {/* Simplified high-fidelity Gantt Lane charts */}
        <div className="bg-white dark:bg-brand-navy-light rounded-2xl p-6 border border-slate-200 dark:border-brand-navy-lighter/60 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Timeline Plan de Route Gantt</span>
                <span className="text-[10px] bg-brand-accent-blue/10 text-brand-accent-blue font-mono px-2 py-0.5 rounded">Visualisation de vol</span>
              </h4>
              <p className="text-xs text-slate-500">Chronogramme de réalisation des chantiers (Mois de Mai - Septembre 2026)</p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-brand-navy-lighter/10 overflow-x-auto">
            {/* Legend months header */}
            <div className="grid grid-cols-12 text-center text-[10px] text-slate-400 font-mono py-1 font-bold border-b border-slate-100 dark:border-brand-navy-lighter/20 min-w-[700px]">
              <div className="col-span-3 text-left pl-3 text-slate-450 uppercase">MODULE</div>
              <div className="col-span-2">MAI 2026</div>
              <div className="col-span-2">JUIN 2026</div>
              <div className="col-span-2 font-semibold text-brand-neon-green">JUILLET 2026</div>
              <div className="col-span-2 uppercase">AOUT 2026</div>
              <div className="col-span-1 border-l border-slate-100 dark:border-brand-navy-lighter/20">TARGET</div>
            </div>

            {/* Render realistic Gantt bars matching the modules */}
            {modules.slice(0, 5).map((mod, i) => {
              // Custom placements for bars based on indexes to look like a actual Gantt chart
              const offsetCol = i === 0 ? "col-start-4 col-span-4" 
                              : i === 1 ? "col-start-5 col-span-3"
                              : i === 2 ? "col-start-7 col-span-4 bg-brand-navy-lighter"
                              : i === 3 ? "col-start-6 col-span-2"
                              : "col-start-8 col-span-3";
              
              const barColor = mod.status === "completed" 
                ? "bg-brand-neon-green text-brand-navy" 
                : mod.status === "in_progress" 
                ? "bg-brand-accent-blue text-white" 
                : "bg-amber-neon text-brand-navy";

              return (
                <div key={mod.id} className="grid grid-cols-12 items-center min-w-[700px] text-xs py-1.5 hover:bg-slate-50/60 dark:hover:bg-brand-navy/30 rounded-lg pr-2">
                  <div className="col-span-3 font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2 pl-3">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: mod.status === "completed" ? "#00C853" : mod.status === "in_progress" ? "#2F80ED" : "#FFB300" }}></span>
                    <span className="truncate">{mod.name.replace("Espace Employés — ", "")}</span>
                  </div>
                  
                  {/* Gantt block bar */}
                  <div className="col-span-8 grid grid-cols-8 h-8 relative items-center bg-slate-100/30 dark:bg-brand-navy-lighter/10 rounded-lg">
                    <div className={`${offsetCol} h-6 rounded px-2.5 flex items-center justify-between shadow-sm cursor-pointer hover:opacity-85 transition-opacity duration-150 relative ${barColor}`}>
                      <span className="font-semibold text-[10px] truncate">{mod.progress}% complet</span>
                      <span className="text-[8.5px] font-mono leading-none">{mod.workloadDays} j/h</span>
                    </div>
                  </div>

                  {/* Target date */}
                  <div className="col-span-1 text-center font-mono text-[10px] text-slate-500 font-bold border-l border-slate-100 dark:border-brand-navy-lighter/20">
                    {mod.targetGoLive.slice(5)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic task list grid data table */}
        <div className="bg-white dark:bg-brand-navy-light rounded-2xl p-6 border border-slate-200 dark:border-brand-navy-lighter/60 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-display font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Base de Suivi Unifiée ({filteredTasks.length})
            </h4>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-brand-navy-lighter text-slate-400 font-mono font-bold">
                  <th className="py-3 px-4 uppercase tracking-wider">Tâche de Configuration / Migration</th>
                  <th className="py-3 px-3 uppercase tracking-wider">Module Sage</th>
                  <th className="py-3 px-3 uppercase tracking-wider">Expert Assigné</th>
                  <th className="py-3 px-3 uppercase tracking-wider">Priorité</th>
                  <th className="py-3 px-3 uppercase tracking-wider text-center">Dates Calendrier</th>
                  <th className="py-3 px-3 uppercase tracking-wider text-right">Statut Clé (Interactif)</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-brand-navy-lighter/35">
                {filteredTasks.map((task) => {
                  const associatedModule = modules.find(m => m.id === task.moduleId);
                  const assignedResource = resources.find(r => r.id === task.assignedToId);

                  return (
                    <tr 
                      key={task.id} 
                      className="hover:bg-slate-50/50 dark:hover:bg-brand-navy/20 transition-colors duration-150"
                    >
                      {/* Name of task */}
                      <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-100 max-w-sm">
                        <div className="truncate" title={task.title}>{task.title}</div>
                      </td>

                      {/* Associated Module */}
                      <td className="py-4 px-3 text-slate-600 dark:text-slate-350">
                        <span className="px-2 py-0.5 bg-brand-accent-blue/5 text-brand-accent-blue rounded">
                          {associatedModule?.name.replace("Espace Employés — ", "") || "Sage Standard"}
                        </span>
                      </td>

                      {/* Assigned expert resource */}
                      <td className="py-4 px-3">
                        {assignedResource ? (
                          <div className="flex items-center gap-2">
                            <img 
                              src={assignedResource.avatar} 
                              alt={assignedResource.name} 
                              className="w-5 h-5 rounded-full object-cover border"
                              referrerPolicy="no-referrer"
                            />
                            <span className="font-medium text-slate-700 dark:text-slate-300">
                              {assignedResource.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Non assigné</span>
                        )}
                      </td>

                      {/* Priority */}
                      <td className="py-4 px-3">
                        <span className={`px-2 py-0.5 rounded font-bold font-mono text-[10px] ${
                          task.priority === "High" 
                            ? "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400"
                            : task.priority === "Medium"
                            ? "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400"
                            : "bg-slate-100 text-slate-500 dark:bg-slate-500/15 dark:text-slate-400"
                        }`}>
                          {task.priority || "Medium"}
                        </span>
                      </td>

                      {/* Calendar target */}
                      <td className="py-4 px-3 text-slate-450 text-center font-mono">
                        {task.startDate} à {task.endDate}
                      </td>

                      {/* Interactive Status pills selection */}
                      <td className="py-4 px-3 text-right">
                        <select
                          value={task.status}
                          onChange={(e) => onUpdateTaskStatus(task.id, e.target.value as any)}
                          className={`px-2 py-1 rounded font-mono font-bold text-[10px] border focus:outline-none cursor-pointer ${
                            task.status === "done"
                              ? "bg-brand-neon-green/10 text-brand-neon-green border-brand-neon-green/30"
                              : task.status === "todo"
                              ? "bg-slate-100 text-slate-500 border-slate-300 dark:bg-brand-navy/60 dark:text-slate-400 dark:border-brand-navy-lighter/60"
                              : task.status === "blocking"
                              ? "bg-rose-600 text-white animate-pulse border-rose-700"
                              : "bg-brand-accent-blue/10 text-brand-accent-blue border-brand-accent-blue/30"
                          }`}
                        >
                          <option value="todo" className="bg-white dark:bg-brand-navy dark:text-white">À Faire</option>
                          <option value="doing" className="bg-white dark:bg-brand-navy dark:text-white">En Cours</option>
                          <option value="done" className="bg-white dark:bg-brand-navy dark:text-white">Fait</option>
                          <option value="blocking" className="bg-white dark:bg-brand-navy dark:text-white">Bloqué</option>
                        </select>
                      </td>

                      {/* Delete button */}
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => onDeleteTask(task.id)}
                          className="p-1 hover:text-rose-neon text-slate-400 dark:text-slate-500 rounded transition-colors"
                          title="Supprimer la tâche"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
