import React, { useState } from "react";
import { 
  FileSpreadsheet, 
  Download, 
  Award, 
  Activity, 
  CheckCircle, 
  PieChart, 
  Briefcase, 
  Sliders,
  Bell,
  CheckCircle2,
  FileCheck2,
  Bookmark
} from "lucide-react";
import { ProjectModule, Resource, ProjectTask } from "../types";

interface ReportingViewProps {
  modules: ProjectModule[];
  resources: Resource[];
  tasks: ProjectTask[];
  onExport: (format: "excel" | "pdf") => void;
}

export default function ReportingView({
  modules,
  resources,
  tasks,
  onExport
}: ReportingViewProps) {
  const [activeReportSubTab, setActiveReportSubTab] = useState<"standard" | "adv">("standard");

  const completedTasks = tasks.filter(t => t.status === "done").length;
  const totalTasks = tasks.length;
  const auditProgress = Math.round((completedTasks / totalTasks) * 100);

  // Checklists
  const standardAuditSteps = [
    { id: 1, label: "Reprise des dossiers salariés dans le coffre-fort numérique", completed: true },
    { id: 2, label: "Validation RGPD sur l'hébergement cloud des fiches de paies", completed: true },
    { id: 3, label: "Paramétrage multi-établissement Sage 100c Paie & RH", completed: true },
    { id: 4, label: "Dématérialisation automatique des fiches de frais et OCR justificatif", completed: false },
    { id: 5, label: "Double calcul comparatif paie de contrôle (Mai - Juin)", completed: false },
    { id: 6, label: "Calcul d'impact des axes analytiques sur le reporting", completed: false },
  ];

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      
      {/* Top action grid reporting templates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Rapid download corporate stats */}
        <div className="bg-white dark:bg-brand-navy-light rounded-2xl p-6 border border-slate-200 dark:border-brand-navy-lighter/60 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 bg-brand-accent-blue/5 rounded-xl flex items-center justify-center mb-4">
              <FileSpreadsheet className="text-brand-accent-blue" size={20} />
            </div>
            
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono uppercase tracking-wider">
              RAPPORT EXCEL DETAILLÉ
            </h4>
            <p className="text-xs text-slate-500 mt-2">
              Comprend les budgets de jours passés par prestataire, le tableau de charges et le registre unifié de Gantt.
            </p>
          </div>

          <button
            onClick={() => onExport("excel")}
            className="w-full mt-5 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-brand-navy-lighter/60 dark:hover:bg-brand-navy-lighter text-slate-800 dark:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all"
          >
            <Download size={14} /> Telecharger .xlsx
          </button>
        </div>

        {/* Rapid executive PDF download */}
        <div className="bg-white dark:bg-brand-navy-light rounded-2xl p-6 border border-slate-200 dark:border-brand-navy-lighter/60 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 bg-brand-neon-green/5 rounded-xl flex items-center justify-center mb-4">
              <Award className="text-brand-neon-green" size={20} />
            </div>
            
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono uppercase tracking-wider">
              TABLEAU DE BORD EXÉCUTIF
            </h4>
            <p className="text-xs text-slate-500 mt-2">
              Une impression vectorielle haute définition du statut global, de la santé financière et des statuts de risques.
            </p>
          </div>

          <button
            onClick={() => onExport("pdf")}
            className="w-full mt-5 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-brand-navy-lighter/60 dark:hover:bg-brand-navy-lighter text-slate-800 dark:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all"
          >
            <Download size={14} /> Télécharger Rapport .pdf
          </button>
        </div>

        {/* Real-time compliance health scoring */}
        <div className="bg-white dark:bg-brand-navy-light rounded-2xl p-6 border border-slate-200 dark:border-brand-navy-lighter/60 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 bg-amber-neon/5 rounded-xl flex items-center justify-center mb-4">
              <Activity className="text-amber-neon" size={20} />
            </div>
            
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono uppercase tracking-wider">
              SCORE D'AUDIT SAGE SUITE
            </h4>
            <p className="text-xs text-slate-500 mt-2">
              Le taux de réalisation globale d'intégration par rapport à la grille normative Sage Partner.
            </p>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-xs font-mono font-bold text-slate-850 dark:text-white mb-1.5">
              <span>Score de conformité</span>
              <span>{auditProgress}%</span>
            </div>
            <div className="w-full bg-slate-150 dark:bg-brand-navy rounded-full h-2 overflow-hidden">
              <div 
                className="bg-amber-neon h-full rounded-full transition-all duration-700"
                style={{ width: `${auditProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

      </div>

      {/* Audit items checklists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Interactive list of compliance (Span 2) */}
        <div className="lg:col-span-2 bg-white dark:bg-brand-navy-light rounded-2xl p-6 border border-slate-200 dark:border-brand-navy-lighter/60 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-display font-bold text-slate-900 dark:text-white">Grille d'Audit de Migration Réglementaire & Technique</h3>
            <p className="text-xs text-slate-500">Validation des étapes clés d'interfaçage par rapport au règlement RGPD & DSN.</p>
          </div>

          <div className="space-y-3.5 pt-2">
            {standardAuditSteps.map((step) => (
              <div 
                key={step.id}
                className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-brand-navy/35 rounded-xl border border-slate-150/40 dark:border-brand-navy-lighter/10 hover:border-slate-200 transition-all duration-150"
              >
                <div className="mt-0.5 shrink-0">
                  {step.id <= completedTasks ? (
                    <span className="w-4 h-4 rounded-full bg-brand-neon-green/10 text-brand-neon-green flex items-center justify-center text-[10px]">
                      &#10003;
                    </span>
                  ) : (
                    <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-[10px]">
                      &middot;
                    </span>
                  )}
                </div>
                <div>
                  <p className={`text-xs font-medium leading-tight ${
                    step.id <= completedTasks ? "text-slate-600 dark:text-slate-350 line-through" : "text-slate-800 dark:text-slate-150 font-bold"
                  }`}>
                    {step.label}
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 inline-block">Étape : {step.id} / 6</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Audit trends index summary (Span 1) */}
        <div className="bg-white dark:bg-brand-navy-light rounded-2xl p-6 border border-slate-200 dark:border-brand-navy-lighter/60 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-display font-bold text-slate-900 dark:text-white mb-2">Index d'Intégration</h3>
            <p className="text-xs text-slate-500">Visualisations globales agrégées des flux.</p>
          </div>

          <div className="space-y-4 my-6">
            <div className="p-3.5 bg-slate-50 dark:bg-brand-navy/30 rounded-xl border">
              <span className="text-[10px] uppercase font-mono text-slate-400">Flux d'archivages sécurisés</span>
              <p className="text-lg font-display font-extrabold text-brand-accent-blue mt-1">100% NATIFS</p>
              <p className="text-[10px] text-slate-400 mt-1">Conformité DSN & de cryptage SSL.</p>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-brand-navy/30 rounded-xl border">
              <span className="text-[10px] uppercase font-mono text-slate-400">Disponibilité des connecteurs</span>
              <p className="text-lg font-display font-extrabold text-brand-neon-green mt-1">99.98% SERVICE</p>
              <p className="text-[10px] text-slate-400 mt-1">Accès permanent à SAGE Espace Employés.</p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-150/40 text-center text-[10px] text-slate-400">
            Rapport mis à jour en temps réel selon les statuts de suivi terrain.
          </div>
        </div>

      </div>

    </div>
  );
}
