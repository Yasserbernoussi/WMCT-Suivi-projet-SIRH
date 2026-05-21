import React, { useState } from "react";
import { 
  Users, 
  Mail, 
  Briefcase, 
  Layers, 
  BarChart4, 
  TrendingUp, 
  CheckCircle, 
  FileCheck,
  Percent,
  Cpu,
  Bookmark
} from "lucide-react";
import { Resource, ProjectTask, ProjectModule } from "../types";

interface RessourcesViewProps {
  resources: Resource[];
  tasks: ProjectTask[];
  modules: ProjectModule[];
  onUpdateResourceWorkload: (resourceId: string, workload: number) => void;
}

export default function RessourcesView({
  resources,
  tasks,
  modules,
  onUpdateResourceWorkload
}: RessourcesViewProps) {
  const [selectedResourceId, setSelectedResourceId] = useState<string>("res-1");

  const selectedResource = resources.find(r => r.id === selectedResourceId) || resources[0];
  const resourceTasks = tasks.filter(t => t.assignedToId === selectedResource?.id);
  
  // Stats calculations
  const totalThalesDays = resources.filter(r => r.company === "Thales" || r.company === "Thales Informatique").reduce((s, r) => s + r.workloadAllocated, 0); 
  const totalThalesUsed = resources.filter(r => r.company === "Thales" || r.company === "Thales Informatique").reduce((s, r) => s + r.workloadUsed, 0);
  const totalSBDDays = resources.filter(r => r.company === "MarsaMaroc" || r.company === "SBD").reduce((s, r) => s + r.workloadAllocated, 0); 
  const totalSBDUsed = resources.filter(r => r.company === "MarsaMaroc" || r.company === "SBD").reduce((s, r) => s + r.workloadUsed, 0);
  const grandTotalDays = totalThalesDays + totalSBDDays; 

  const thalesConsumedPct = totalThalesDays > 0 ? Math.round((totalThalesUsed / totalThalesDays) * 100) : 0;
  const sbdConsumedPct = totalSBDDays > 0 ? Math.round((totalSBDUsed / totalSBDDays) * 100) : 0;

  const completedResourceTasks = resourceTasks.filter(t => t.status === "done").length;

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      
      {/* Upper workloads summary board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Total stats card */}
        <div className="bg-white dark:bg-brand-navy-light rounded-2xl p-6 border border-slate-200 dark:border-brand-navy-lighter/60 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">SYNTHESE DES PRESTATAIRES</span>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-3xl font-display font-bold text-slate-900 dark:text-white">{grandTotalDays} j/h</span>
              <span className="text-xs text-slate-500">charge globale</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Réplication conforme des contrats d'intégration d'ingénierie.</p>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-brand-navy-lighter/25 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-slate-400 font-mono">PARTENAIRE THALES</p>
              <p className="text-lg font-display font-extrabold text-brand-accent-blue">{totalThalesDays} j/h</p>
              <span className="text-[10px] text-slate-400">Ressources Lead</span>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-mono">EQUIPE MARSAMAROC</p>
              <p className="text-lg font-display font-extrabold text-brand-neon-green">{totalSBDDays} j/h</p>
              <span className="text-[10px] text-slate-400">Experts SIRH Interne</span>
            </div>
          </div>
        </div>

        {/* Thales Load card */}
        <div className="bg-white dark:bg-brand-navy-light rounded-2xl p-6 border border-slate-200 dark:border-brand-navy-lighter/60 shadow-sm space-y-4">
          <div>
            <span className="text-[10px] font-mono text-brand-accent-blue font-bold tracking-widest uppercase bg-brand-accent-blue/5 px-2.5 py-1 rounded">Thales Team Load</span>
            <p className="text-xs text-slate-500 mt-3">Représentation de la charge allouée aux architectes & consultants Thales (Lead technique de la migration).</p>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Capacité utilisée</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{totalThalesUsed} / {totalThalesDays} jours dépensés</span>
              </div>
              <div className="w-full bg-slate-150 dark:bg-brand-navy/60 h-2 rounded-full overflow-hidden">
                <div className="bg-brand-accent-blue h-full rounded-full animate-[progressBar_1s_ease-out-forward]" style={{ width: `${thalesConsumedPct}%` }}></div>
              </div>
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-400">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-brand-accent-blue"></span> {resources.filter(r => r.company === "Thales" || r.company === "Thales Informatique").length} Experts impliqués</span>
              <span>{thalesConsumedPct}% consommés</span>
            </div>
          </div>
        </div>

        {/* SBD Load card */}
        <div className="bg-white dark:bg-brand-navy-light rounded-2xl p-6 border border-slate-200 dark:border-brand-navy-lighter/60 shadow-sm space-y-4">
          <div>
            <span className="text-[10px] font-mono text-brand-neon-green font-bold tracking-widest uppercase bg-brand-neon-green/5 px-2.5 py-1 rounded">MarsaMaroc Team Load</span>
            <p className="text-xs text-slate-500 mt-3">Ressources fonctionnelles et métiers de l'équipe interne MarsaMaroc (Spécialistes SIRH & gestion du changement).</p>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Capacité utilisée</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{totalSBDUsed} / {totalSBDDays} jours dépensés</span>
              </div>
              <div className="w-full bg-slate-150 dark:bg-brand-navy/60 h-2 rounded-full overflow-hidden">
                <div className="bg-brand-neon-green h-full rounded-full animate-[progressBar_1s_ease-out-forward]" style={{ width: `${sbdConsumedPct}%` }}></div>
              </div>
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-400">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-brand-neon-green"></span> {resources.filter(r => r.company === "MarsaMaroc" || r.company === "SBD").length} Experts impliqués</span>
              <span>{sbdConsumedPct}% consommés</span>
            </div>
          </div>
        </div>

      </div>

      {/* Grid: 2 Columns - Resources horizontal slider lists, Right resource detail and workload reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left Hand: Team List (Span 2) */}
        <div className="lg:col-span-2 space-y-4">
          <span className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider block">Membres du Projet</span>
          
          <div className="space-y-3">
            {resources.map((res) => {
              const worksCountForRes = tasks.filter(t => t.assignedToId === res.id).length;
              const isSelected = selectedResourceId === res.id;
              
              return (
                <div
                  key={res.id}
                  onClick={() => setSelectedResourceId(res.id)}
                  className={`p-4 rounded-xl text-left border cursor-pointer pointer-events-auto transition-all duration-300 flex items-center justify-between group ${
                    isSelected
                      ? "bg-brand-navy dark:bg-brand-navy-light border-brand-accent-blue dark:border-brand-neon-green text-white shadow-lg"
                      : "bg-white dark:bg-brand-navy-light border-slate-200 dark:border-brand-navy-lighter/40 text-slate-800 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-500"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <img 
                        src={res.avatar} 
                        alt={res.name} 
                        className="w-10 h-10 rounded-full border-2 border-white dark:border-brand-navy-light object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border ${
                        res.status === "active" 
                          ? "bg-brand-neon-green border-white" 
                          : res.status === "away" 
                          ? "bg-amber-neon border-white" 
                          : "bg-slate-400 border-white"
                      }`}></span>
                    </div>

                    <div className="min-w-0">
                      <h4 className={`text-xs font-bold ${isSelected ? "text-white" : "text-slate-900 dark:text-white"}`}>
                        {res.name}
                      </h4>
                      <p className={`text-[10px] truncate ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                        {res.role}
                      </p>
                      <span className={`text-[9px] font-mono mt-1 inline-block ${
                        res.company === "Thales" || res.company === "Thales Informatique" ? "text-brand-accent-blue font-bold" : "text-brand-neon-green font-bold"
                      }`}>
                        {res.company}
                      </span>
                    </div>
                  </div>

                  {/* Allocated Badge */}
                  <div className="text-right shrink-0 ml-2">
                    <p className="text-[11px] font-mono font-bold">{res.workloadAllocated} j</p>
                    <span className="text-[9px] text-slate-400">{worksCountForRes} tâches</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Hand: Resource Inspector Detail (Span 3) */}
        <div className="lg:col-span-3">
          {selectedResource ? (
            <div className="bg-white dark:bg-brand-navy-light rounded-2xl p-6 border border-slate-200 dark:border-brand-navy-lighter/60 shadow-sm space-y-6">
              
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-100 dark:border-brand-navy-lighter/30 gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src={selectedResource.avatar} 
                      alt={selectedResource.name} 
                      className="w-16 h-16 rounded-full border-2 border-brand-accent-blue dark:border-brand-neon-green object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-1 right-1 h-3 w-3 rounded-full bg-brand-neon-green border border-white"></span>
                  </div>
                  <div>
                    <h3 className="text-base font-display font-bold text-slate-900 dark:text-white">
                      {selectedResource.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{selectedResource.role}</p>
                    <span className={`px-2 py-0.5 text-[10px] rounded font-mono font-bold inline-block mt-2 ${
                      selectedResource.company === "Thales" || selectedResource.company === "Thales Informatique"
                        ? "bg-brand-accent-blue/10 text-brand-accent-blue"
                        : "bg-brand-neon-green/10 text-brand-neon-green"
                    }`}>
                      Société Partenaire : {selectedResource.company}
                    </span>
                  </div>
                </div>

                {/* Contact Email Action button */}
                <a 
                  href={`mailto:${selectedResource.email}`}
                  className="flex items-center gap-1.5 px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-brand-navy-lighter text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-brand-navy border border-slate-200 dark:border-brand-navy-lighter/50 rounded-xl text-xs font-semibold"
                >
                  <Mail size={13} className="text-brand-accent-blue dark:text-brand-neon-green" />
                  <span>Contacter par Email</span>
                </a>
              </div>

              {/* Adjust workload slider */}
              <div className="p-4 bg-slate-50 dark:bg-brand-navy/40 rounded-xl border border-slate-150 dark:border-brand-navy-lighter/20">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <TrendingUp size={14} className="text-brand-accent-blue" />
                    Ajuster l'allocation contractuelle :
                  </span>
                  <span className="text-sm font-mono font-extrabold text-brand-accent-blue dark:text-brand-neon-green">
                    {selectedResource.workloadAllocated} jours total
                  </span>
                </div>
                
                <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
                  Modifier la charge allouée en jours/homme à cet ingénieur d'intégration.
                </p>

                <input
                  type="range"
                  min="5"
                  max="120"
                  step="1"
                  value={selectedResource.workloadAllocated}
                  onChange={(e) => onUpdateResourceWorkload(selectedResource.id, parseInt(e.target.value))}
                  className="w-full accent-brand-accent-blue dark:accent-brand-neon-green h-2 bg-slate-200 dark:bg-brand-navy rounded-lg appearance-none cursor-pointer"
                />

                {/* Progress represent */}
                <div className="pt-4 mt-4 border-t border-slate-200/40 flex justify-between items-center text-[11px]">
                  <span className="text-slate-500">Jours dépensés historiquement :</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {selectedResource.workloadUsed} jours ({Math.round((selectedResource.workloadUsed / selectedResource.workloadAllocated)*100)}%)
                  </span>
                </div>
              </div>

              {/* Assigned Tasks list checklist */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider flex items-center justify-between">
                  <span>Tâches de configuration assignées ({resourceTasks.length})</span>
                  <span className="text-[10px] text-brand-neon-green bg-brand-neon-green/10 px-2 py-0.5 rounded">
                    {completedResourceTasks} terminées ({resourceTasks.length > 0 ? Math.round((completedResourceTasks/resourceTasks.length)*100) : 0}%)
                  </span>
                </h4>

                {resourceTasks.length > 0 ? (
                  <div className="space-y-2.5 max-h-64 overflow-y-auto">
                    {resourceTasks.map((task) => {
                      const belongModule = modules.find(m => m.id === task.moduleId);
                      
                      return (
                        <div 
                          key={task.id}
                          className="p-3 bg-slate-50/60 dark:bg-brand-navy/20 border border-slate-150 dark:border-brand-navy-lighter/30 rounded-lg flex items-center justify-between"
                        >
                          <div>
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                              {task.title}
                            </p>
                            <span className="text-[9px] text-slate-400 font-mono mt-1 inline-block">
                              Module : {belongModule?.name || "Standard Sage"} | Cible : {task.endDate}
                            </span>
                          </div>

                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-extrabold capitalize ${
                            task.status === "done" 
                              ? "bg-brand-neon-green text-brand-navy" 
                              : task.status === "todo" 
                              ? "bg-slate-200 text-slate-600" 
                              : "bg-brand-accent-blue text-white"
                          }`}>
                            {task.status === "done" ? "Terminé" : task.status === "todo" ? "A faire" : "En cours"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4 italic">Aucune tâche active assignée à ce contributeur pour l'instant.</p>
                )}
              </div>

            </div>
          ) : (
            <div className="bg-slate-150 dark:bg-brand-navy-light text-center py-12 rounded-2xl text-slate-400 italic">
              Veuillez sélectionner un membre pour inspecter ses allocations de charge et tâches.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
