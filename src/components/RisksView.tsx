import React, { useState } from "react";
import { 
  ShieldAlert, 
  PlusCircle, 
  Clock, 
  HelpCircle, 
  CheckCircle2, 
  X,
  AlertTriangle,
  User,
  Plus,
  Compass
} from "lucide-react";
import { ProjectRisk, Resource } from "../types";

interface RisksViewProps {
  risks: ProjectRisk[];
  resources: Resource[];
  onAddRisk: (risk: Omit<ProjectRisk, "id">) => void;
  onUpdateRiskStatus: (riskId: string, status: "Mitigated" | "Active" | "Critical") => void;
}

export default function RisksView({
  risks,
  resources,
  onAddRisk,
  onUpdateRiskStatus
}: RisksViewProps) {
  const [selectedSeverity, setSelectedSeverity] = useState<"All" | "High" | "Medium" | "Low">("All");
  const [showAddForm, setShowAddForm] = useState(false);
  
  // New risk form states
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Technique");
  const [newSeverity, setNewSeverity] = useState<"High" | "Medium" | "Low">("Medium");
  const [newMitigation, setNewMitigation] = useState("");
  const [newReporterId, setNewReporterId] = useState(resources[0]?.id || "");

  const handleCreateRisk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMitigation.trim()) return;

    onAddRisk({
      title: newTitle,
      category: newCategory,
      severity: newSeverity,
      status: "Active",
      mitigation: newMitigation,
      reporterId: newReporterId
    });

    setNewTitle("");
    setNewMitigation("");
    setShowAddForm(false);
  };

  const filteredRisks = risks.filter(r => 
    selectedSeverity === "All" || r.severity === selectedSeverity
  );

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      
      {/* Search Header and filter actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-5 bg-white dark:bg-brand-navy-light rounded-2xl border border-slate-200 dark:border-brand-navy-lighter/60 shadow-sm">
        
        {/* State filters */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setSelectedSeverity("All")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedSeverity === "All"
                ? "bg-brand-navy dark:bg-brand-neon-green text-white dark:text-brand-navy font-bold"
                : "text-slate-500 bg-slate-100 hover:text-slate-800 dark:bg-brand-navy/60 dark:text-slate-300"
            }`}
          >
            Tous les niveaux ({risks.length})
          </button>
          <button
            onClick={() => setSelectedSeverity("High")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedSeverity === "High"
                ? "bg-rose-500 text-white font-bold"
                : "text-slate-500 bg-slate-100 hover:text-slate-800 dark:bg-brand-navy/60 dark:text-slate-300"
            }`}
          >
            Inquiétude Élevée
          </button>
          <button
            onClick={() => setSelectedSeverity("Medium")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedSeverity === "Medium"
                ? "bg-amber-neon text-brand-navy font-bold"
                : "text-slate-500 bg-slate-100 hover:text-slate-800 dark:bg-brand-navy/60 dark:text-slate-300"
            }`}
          >
            Modéré
          </button>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-navy dark:bg-brand-neon-green hover:bg-brand-navy-light dark:hover:bg-[#00b047] text-white dark:text-brand-navy rounded-xl text-xs font-bold transition-all duration-300 shadow-sm"
        >
          <Plus size={15} />
          <span>Déclarer un Risque</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreateRisk} className="p-5 bg-slate-50 dark:bg-brand-navy/55 rounded-2xl border border-dashed border-slate-200 dark:border-brand-navy-lighter/60 space-y-4 max-w-lg">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-250 font-mono uppercase">Déclaration réglementaire ou technique</h4>
          
          <div>
            <label className="text-[10px] text-slate-400 font-mono block mb-1">TITRE COURT DU RISQUE :</label>
            <input
              type="text"
              required
              placeholder="Ex: Latence DSN sur le serveur d'intégration"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-white dark:bg-brand-navy-light border rounded-lg p-2 text-xs dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-slate-400 font-mono block mb-1">SÉVÉRITÉ :</label>
              <select
                value={newSeverity}
                onChange={(e) => setNewSeverity(e.target.value as any)}
                className="w-full bg-white dark:bg-brand-navy-light border rounded-lg p-2 text-xs dark:text-white"
              >
                <option value="High">High (Élevé)</option>
                <option value="Medium">Medium (Moyen)</option>
                <option value="Low">Low (Bassin)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-mono block mb-1">CONCERNÉ :</label>
              <input
                type="text"
                required
                placeholder="Ex: Législation, DSN, Sécurité"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-white dark:bg-brand-navy-light border rounded-lg p-2 text-xs dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-mono block mb-1">PLAN DE CONTINGENCE (MITIGATION OU CONDUITE D'ACTION) :</label>
            <textarea
              required
              placeholder="Décrivez les actions d'atténuation immédiates..."
              value={newMitigation}
              onChange={(e) => setNewMitigation(e.target.value)}
              className="w-full bg-white dark:bg-brand-navy-light border rounded-lg p-2 text-xs dark:text-white h-20"
            />
          </div>

          <div className="flex gap-2 justify-end text-xs">
            <button 
              type="button" 
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1 bg-slate-200 rounded text-slate-650"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="px-3 py-1 bg-brand-navy dark:bg-brand-neon-green text-white dark:text-brand-navy font-bold rounded"
            >
              Enregistrer
            </button>
          </div>
        </form>
      )}

      {/* Primary Risks Display Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRisks.map((risk) => {
          const reporter = resources.find(r => r.id === risk.reporterId);
          
          return (
            <div 
              key={risk.id}
              className={`bg-white dark:bg-brand-navy-light border rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between ${
                risk.severity === "High" && risk.status !== "Mitigated"
                  ? "border-rose-550 dark:border-rose-500/50 relative overflow-hidden ring-1 ring-rose-500/20"
                  : "border-slate-200 dark:border-brand-navy-lighter/60"
              }`}
            >
              <div>
                {/* Meta status header */}
                <div className="flex justify-between items-center">
                  <span className="text-[9px] text-slate-400 font-mono">CODE: {risk.id.toUpperCase()}</span>
                  <div className="flex gap-1.5 items-center">
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                      risk.severity === "High" 
                        ? "bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-450"
                        : "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-450"
                    }`}>
                      {risk.severity} SÉVÉRITÉ
                    </span>

                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                      risk.status === "Mitigated"
                        ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-450"
                        : "bg-brand-accent-blue/15 text-brand-accent-blue"
                    }`}>
                      {risk.status === "Mitigated" ? "MITIGÉ" : "ACTIF"}
                    </span>
                  </div>
                </div>

                {/* Primary risk Title */}
                <div className="flex items-start gap-3 mt-4">
                  <span className={`p-2 rounded-xl shrink-0 ${
                    risk.status === "Mitigated"
                      ? "bg-emerald-100/10 text-emerald-500"
                      : "bg-rose-100/10 text-rose-500 animate-pulse"
                  }`}>
                    <ShieldAlert size={18} />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-150 leading-tight">
                      {risk.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5 inline-block">Chantier : {risk.category}</span>
                  </div>
                </div>

                {/* Mitigation summary */}
                <div className="bg-slate-50 dark:bg-brand-navy/40 p-3 rounded-xl border border-slate-150/40 dark:border-brand-navy-lighter/20 mt-4">
                  <p className="text-[10px] font-bold text-slate-650 dark:text-slate-350 font-mono uppercase">Plan Directeur d'Atténuation :</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {risk.mitigation}
                  </p>
                </div>
              </div>

              {/* Action Solvers */}
              <div className="pt-4 border-t border-slate-100 dark:border-brand-navy-lighter/20 flex flex-wrap items-center justify-between text-[11px] gap-2">
                {reporter && (
                  <div className="flex items-center gap-1.5">
                    <img 
                      src={reporter.avatar} 
                      alt={reporter.name} 
                      className="w-5 h-5 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-slate-400">Signalé par : {reporter.name.split(" ")[0]}</span>
                  </div>
                )}

                {risk.status !== "Mitigated" ? (
                  <button
                    onClick={() => onUpdateRiskStatus(risk.id, "Mitigated")}
                    className="px-2.5 py-1 text-[10px] bg-emerald-100 hover:bg-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-250/50 rounded font-bold transition-all duration-150"
                  >
                    Activer le correctif / Prêt
                  </button>
                ) : (
                  <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                    <CheckCircle2 size={12} /> Résolu ou sous contrôle
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
