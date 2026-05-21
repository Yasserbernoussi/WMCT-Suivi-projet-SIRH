import React, { useState } from "react";
import { 
  Bell, 
  RefreshCw, 
  Download, 
  ChevronRight, 
  User, 
  Settings, 
  ShieldAlert, 
  Sparkles,
  Search,
  CheckCircle,
  Database
} from "lucide-react";

interface TopbarProps {
  projectName: string;
  projectSubtitle: string;
  activeTab: string;
  syncStatus: "synced" | "syncing" | "error";
  onSync: () => void;
  onExport: (format: "excel" | "pdf") => void;
  isDarkMode: boolean;
  globalSearch: string;
  setGlobalSearch: (term: string) => void;
  lastSyncTime: string;
  environment: string;
  setEnvironment: (env: string) => void;
}

export default function Topbar({
  projectName,
  projectSubtitle,
  activeTab,
  syncStatus,
  onSync,
  onExport,
  isDarkMode,
  globalSearch,
  setGlobalSearch,
  lastSyncTime,
  environment,
  setEnvironment
}: TopbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);

  const tabLabels: { [key: string]: string } = {
    global: "Suivi global",
    modules: "Situation modules",
    societies: "Situation sociétés",
    resources: "Équipe ressources",
    planning: "Planning & Tâches",
    risks: "Risques & Alertes",
    reporting: "Reporting & Rapports",
    settings: "Paramètres & Thème",
  };

  const notificationList = [
    { id: 1, text: "Moussa REDA a mis à jour la tâche 'Spécification ADV'", time: "Il y a 10 min", unread: true },
    { id: 2, text: "Validation réussie : Écritures automatiques de paie validées par Redouane EL MKAHEL", time: "Il y a 1h", unread: true },
    { id: 3, text: "Alerte Risque : Retard de transmission des soldes d'absences SAP (Niveau Élevé)", time: "Il y a 3h", unread: false },
    { id: 4, text: "Synchronisation automatique effectuée avec succès avec SAGE Espace Employés", time: "Ce matin", unread: false },
  ];

  return (
    <header className="h-20 bg-white dark:bg-brand-navy border-b border-slate-200 dark:border-brand-navy-light px-8 flex items-center justify-between shrink-0 transition-colors duration-300 relative z-20">
      
      {/* Left side: Project identity & Breadcrumb */}
      <div className="flex items-center gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>Thales Informatique</span>
            <ChevronRight size={12} />
            <span className="text-brand-accent-blue dark:text-brand-neon-green font-medium">
              {tabLabels[activeTab] || "Dashboard"}
            </span>
          </div>
          
          <div className="flex items-baseline gap-2.5 mt-1">
            <h1 className="text-xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
              {projectName}
            </h1>
            <span className="text-xs text-slate-500 dark:text-slate-400 border-l border-slate-300 dark:border-brand-navy-lighter pl-2.5 font-medium">
              {projectSubtitle}
            </span>
          </div>
        </div>

        {/* Environment Tag */}
        <div className="hidden md:flex items-center gap-1.5 bg-brand-bg-light dark:bg-brand-navy-light border border-slate-200 dark:border-brand-navy-lighter/60 px-3 py-1 rounded-full text-xs font-mono font-semibold">
          <span className={`w-2 h-2 rounded-full ${
            environment === "Production" 
              ? "bg-brand-neon-green neon-glow-active" 
              : environment === "Sandbox" 
              ? "bg-brand-accent-blue" 
              : "bg-amber-neon"
          }`}></span>
          <select 
            value={environment} 
            onChange={(e) => setEnvironment(e.target.value)}
            className="bg-transparent border-none text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer text-xs font-semibold py-0"
          >
            <option value="Production" className="bg-white dark:bg-brand-navy dark:text-white">PROD INTERNE</option>
            <option value="Sandbox" className="bg-white dark:bg-brand-navy dark:text-white">SANDBOX SAGE</option>
            <option value="Pré-Prod" className="bg-white dark:bg-brand-navy dark:text-white">PRE-PROD MIGRATION</option>
          </select>
        </div>
      </div>

      {/* Center: Search input */}
      <div className="hidden lg:flex w-72 relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
          <Search size={16} />
        </span>
        <input
          type="text"
          placeholder="Rechercher modules, tâches, experts..."
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          className="w-full bg-slate-100 dark:bg-brand-navy-light/50 hover:bg-slate-200/50 dark:hover:bg-brand-navy-light transition-colors duration-200 border border-slate-200 dark:border-brand-navy-lighter/40 rounded-lg py-1.5 pl-9 pr-4 text-xs dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-accent-blue"
        />
        {globalSearch && (
          <button 
            onClick={() => setGlobalSearch("")} 
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] bg-slate-200 dark:bg-brand-navy-lighter text-slate-600 dark:text-slate-400 hover:text-red-500 rounded px-1"
          >
            Effacer
          </button>
        )}
      </div>

      {/* Right side: Operations & Profile */}
      <div className="flex items-center gap-3">
        
        {/* Sync Trigger button */}
        <button
          onClick={onSync}
          disabled={syncStatus === "syncing"}
          className={`flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-brand-navy-light dark:hover:bg-brand-navy-lighter text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold border border-slate-200 dark:border-brand-navy-lighter/60 transition-all duration-300 group`}
          title={`Dernière synchro : ${lastSyncTime}`}
        >
          <RefreshCw 
            size={14} 
            className={`text-brand-accent-blue dark:text-brand-neon-green ${
              syncStatus === "syncing" ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"
            }`} 
          />
          <span className="hidden sm:inline">
            {syncStatus === "syncing" ? "Synchronisation..." : "Synchroniser"}
          </span>
        </button>

        {/* Export button with Dropdown menu */}
        <div className="relative">
          <button
            onClick={() => setShowExportOptions(!showExportOptions)}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-brand-navy dark:bg-brand-neon-green hover:bg-brand-navy-light dark:hover:bg-[#00b047] text-white dark:text-brand-navy rounded-lg text-xs font-semibold border border-brand-navy dark:border-brand-neon-green shadow-sm transition-all duration-300"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Exporter</span>
          </button>

          {showExportOptions && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-brand-navy-light border border-slate-200 dark:border-brand-navy-lighter rounded-xl shadow-xl overflow-hidden animate-[fadeIn_0.2s_ease-out]">
              <div className="p-2 border-b border-slate-100 dark:border-brand-navy-lighter/40 bg-slate-50 dark:bg-brand-navy/60">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-semibold px-2 block">Format d'export</span>
              </div>
              <button
                onClick={() => {
                  onExport("excel");
                  setShowExportOptions(false);
                }}
                className="w-full text-left px-4 py-2.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-brand-navy-lighter flex items-center gap-2.5 transition-colors duration-150"
              >
                <Database size={14} className="text-emerald-500" />
                <span>Rapport Excel (.xlsx)</span>
              </button>
              <button
                onClick={() => {
                  onExport("pdf");
                  setShowExportOptions(false);
                }}
                className="w-full text-left px-4 py-2.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-brand-navy-lighter flex items-center gap-2.5 transition-colors duration-150"
              >
                <ShieldAlert size={14} className="text-rose-500" />
                <span>Tableau de Bord PDF (.pdf)</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Icon with Indicator */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 hover:bg-slate-100 dark:hover:bg-brand-navy-light rounded-lg text-slate-500 dark:text-slate-400 relative transition-colors duration-200"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-neon animate-pulse"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-brand-navy-light border border-slate-200 dark:border-brand-navy-lighter rounded-xl shadow-2xl overflow-hidden animate-[fadeIn_0.2s_ease-out]">
              <div className="p-4 border-b border-slate-100 dark:border-brand-navy-lighter/40 bg-slate-50 dark:bg-brand-navy/60 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-white">Notifications ({notificationList.filter(n=>n.unread).length} neuves)</span>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-[10px] text-brand-accent-blue dark:text-brand-neon-green hover:underline"
                >
                  Tout marquer lu
                </button>
              </div>
              
              <div className="divide-y divide-slate-100 dark:divide-brand-navy-lighter/40 max-h-80 overflow-y-auto">
                {notificationList.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`p-3.5 hover:bg-slate-50 dark:hover:bg-brand-navy-lighter/60 transition-colors duration-150 text-left ${
                      notif.unread ? "bg-slate-50/60 dark:bg-brand-navy/30 border-l-2 border-brand-accent-blue" : ""
                    }`}
                  >
                    <p className="text-xs text-slate-700 dark:text-slate-200 leading-normal">{notif.text}</p>
                    <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-slate-400 font-mono">
                      <span>{notif.time}</span>
                      {notif.unread && <span className="w-1 h-1 bg-brand-accent-blue rounded-full"></span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Info avatar */}
        <div className="hidden sm:flex items-center gap-2.5 pl-2.5 border-l border-slate-200 dark:border-brand-navy-light">
          <div className="w-8 h-8 rounded-full bg-brand-accent-blue/10 dark:bg-brand-neon-green/10 flex items-center justify-center text-brand-accent-blue dark:text-brand-neon-green font-bold text-xs ring-2 ring-slate-100 dark:ring-brand-navy-light">
            YB
          </div>
          <div className="text-left leading-none">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Sage Integrator</p>
            <span className="text-[10px] text-slate-400 dark:text-slate-400">Yasser Bernoussi</span>
          </div>
        </div>

      </div>
    </header>
  );
}
