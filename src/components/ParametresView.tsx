import React, { useState } from "react";
import { 
  Settings, 
  Moon, 
  Sun, 
  RotateCcw, 
  Sparkles, 
  ShieldAlert, 
  Database,
  Terminal,
  ChevronRight,
  User,
  Activity,
  CheckCircle2,
  Lock
} from "lucide-react";

interface ParametresViewProps {
  projectName: string;
  setProjectName: (name: string) => void;
  projectSubtitle: string;
  setProjectSubtitle: (sub: string) => void;
  environment: string;
  setEnvironment: (env: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  simulatedRealtime: boolean;
  onToggleRealtime: () => void;
  onResetData: () => void;
}

export default function ParametresView({
  projectName,
  setProjectName,
  projectSubtitle,
  setProjectSubtitle,
  environment,
  setEnvironment,
  isDarkMode,
  onToggleDarkMode,
  simulatedRealtime,
  onToggleRealtime,
  onResetData
}: ParametresViewProps) {
  
  const handleResetClick = () => {
    if (confirm("Réinitialiser les états de configuration aux valeurs d'origine ?")) {
      onResetData();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-[fadeIn_0.3s_ease-out]">
      
      {/* Configuration layout card */}
      <div className="bg-white dark:bg-brand-navy-light rounded-2xl p-6 border border-slate-200 dark:border-brand-navy-lighter/60 shadow-sm space-y-6">
        
        <div>
          <h3 className="text-base font-display font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings size={18} className="text-brand-accent-blue dark:text-brand-neon-green" />
            Paramètres et Variables du Portail
          </h3>
          <p className="text-xs text-slate-500">Personnaliser l'environnement d'affichage et l'identité de votre projet de migration.</p>
        </div>

        {/* Form Inputs for project metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-slate-100 dark:border-brand-navy-lighter/25">
          
          <div>
            <label className="text-[10px] text-slate-400 font-mono block mb-1.5 uppercase font-bold">NOM DU PROJET</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-brand-navy/60 hover:bg-slate-100 dark:hover:bg-brand-navy border border-slate-200 dark:border-brand-navy-lighter/40 rounded-xl p-3 text-xs dark:text-white font-semibold focus:outline-none focus:ring-1 focus:ring-brand-accent-blue"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-mono block mb-1.5 uppercase font-bold">VERSION / SOUS-TITRE</label>
            <input
              type="text"
              value={projectSubtitle}
              onChange={(e) => setProjectSubtitle(e.target.value)}
              className="w-full bg-slate-50 dark:bg-brand-navy/60 hover:bg-slate-100 dark:hover:bg-brand-navy border border-slate-200 dark:border-brand-navy-lighter/40 rounded-xl p-3 text-xs dark:text-white font-semibold focus:outline-none focus:ring-1 focus:ring-brand-accent-blue"
            />
          </div>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          
          {/* Environment */}
          <div>
            <label className="text-[10px] text-slate-400 font-mono block mb-1.5 uppercase font-bold">ENVIRONNEMENT ACTUEL</label>
            <select
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
              className="w-full bg-slate-50 dark:bg-brand-navy/60 hover:bg-slate-100 dark:hover:bg-brand-navy border border-slate-200 dark:border-brand-navy-lighter/40 rounded-xl p-3 text-xs dark:text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="Production">PROD INTERNE</option>
              <option value="Sandbox">SANDBOX SAGE</option>
              <option value="Pré-Prod">PRE-PROD MIGRATION</option>
            </select>
          </div>

          {/* Theme customizer toggle */}
          <div>
            <label className="text-[10px] text-slate-400 font-mono block mb-1.5 uppercase font-bold">THÈME COULEUR PRINCIPAL</label>
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="w-full flex items-center justify-between bg-slate-50 dark:bg-brand-navy/60 hover:bg-slate-105 border border-slate-250 dark:border-brand-navy-lighter/40 rounded-xl p-3 text-xs dark:text-white font-semibold transition-all"
            >
              <span className="flex items-center gap-2">
                {isDarkMode ? (
                  <>
                    <Moon size={14} className="text-brand-neon-green" />
                    <span>Mode Sombre Premium</span>
                  </>
                ) : (
                  <>
                    <Sun size={14} className="text-amber-neon" />
                    <span>Mode Clair Minimaliste</span>
                  </>
                )}
              </span>

              <span className="text-[10px] bg-slate-200 dark:bg-brand-navy-lighter text-slate-655 dark:text-slate-350 px-2 py-0.5 rounded font-mono">
                Basculer
              </span>
            </button>
          </div>

        </div>

      </div>

      {/* Bonus Executive Premium Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Real-time automated simulation */}
        <div className="bg-white dark:bg-brand-navy-light rounded-2xl p-6 border border-slate-200 dark:border-brand-navy-lighter/60 shadow-sm space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[9px] font-mono text-brand-neon-green bg-brand-neon-green/10 px-2 py-0.5 rounded font-bold uppercase">
                Simulateur de flux IA
              </span>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-220 mt-2.5">Mode Synchro de flux temps réel</h4>
              <p className="text-[11px] text-slate-505 leading-relaxed mt-1">
                Activer la simulation autonome de rentrées de données pour voir l'avancement s'incrémenter de manière réaliste et autonome.
              </p>
            </div>
            
            <div className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={simulatedRealtime} 
                onChange={onToggleRealtime}
                className="sr-only peer" 
              />
              <div className="w-9 h-5 bg-slate-200 dark:bg-brand-navy rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-slate-300 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-neon-green"></div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-brand-navy-lighter/25 flex items-center justify-between text-[11px] text-slate-400">
            <span>État de l'agent :</span>
            <span className={simulatedRealtime ? "font-bold text-brand-neon-green flex items-center gap-1.5 uppercase" : "font-mono uppercase"}>
              <span className={`w-1.5 h-1.5 rounded-full ${simulatedRealtime ? "bg-brand-neon-green neon-glow-active" : "bg-slate-400"}`}></span>
              {simulatedRealtime ? "Simulateur ACTIF" : "DÉSACTIVÉ"}
            </span>
          </div>
        </div>

        {/* Global Reset and Database Wipe */}
        <div className="bg-white dark:bg-brand-navy-light rounded-2xl p-6 border border-slate-200 dark:border-brand-navy-lighter/60 shadow-sm space-y-4">
          <div>
            <span className="text-[9px] font-mono text-amber-neon bg-amber-neon/10 px-2 py-0.5 rounded font-bold uppercase">
              Rétablir l'usine
            </span>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-220 mt-2.5">Réinitialiser les KPIs du projet</h4>
            <p className="text-[11px] text-slate-505 leading-relaxed mt-1">
              Effacer toutes les modifications de charge de travail, de pourcentage et de tâches pour restaurer la maquette premium initiale du projet ERP.
            </p>
          </div>

          <button
            onClick={handleResetClick}
            className="w-full px-4 py-2 bg-slate-50 hover:bg-rose-50 dark:bg-brand-navy/60 dark:hover:bg-rose-950/20 text-slate-700 hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-400 rounded-xl text-xs font-bold border border-slate-200 dark:border-brand-navy-lighter/60 flex items-center justify-center gap-2 transition-all"
          >
            <RotateCcw size={14} /> Restaurer la base de données
          </button>
        </div>

      </div>

    </div>
  );
}
