import React, { useState } from "react";
import { 
  Building2, 
  Users, 
  Calendar, 
  TrendingUp, 
  CheckCircle, 
  CheckCircle2,
  Clock, 
  ShieldAlert,
  ArrowUpRight,
  Sparkles,
  Layers,
  Search,
  Plus
} from "lucide-react";
import { ClientSociety } from "../types";

interface SocietiesViewProps {
  societies: ClientSociety[];
  onUpdateSocietyProgress: (socId: string, progress: number) => void;
  onAddSociety: (soc: Omit<ClientSociety, "id">) => void;
}

export default function SocietiesView({
  societies,
  onUpdateSocietyProgress,
  onAddSociety
}: SocietiesViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSocName, setNewSocName] = useState("");
  const [newSocHeadcount, setNewSocHeadcount] = useState(300);
  const [newSocGoLive, setNewSocGoLive] = useState("2026-10-01");

  const handleCreateSociety = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSocName.trim()) return;

    onAddSociety({
      name: newSocName,
      headcount: newSocHeadcount,
      status: "pending",
      migrationPercentage: 0,
      goLiveDate: newSocGoLive
    });

    setNewSocName("");
    setShowAddForm(false);
  };

  const filteredSoc = societies.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      
      {/* Header operations bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-5 bg-white dark:bg-brand-navy-light rounded-2xl border border-slate-200 dark:border-brand-navy-lighter/60 shadow-sm">
        <div className="relative w-full sm:w-80">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <Search size={15} />
          </span>
          <input
            type="text"
            placeholder="Filtrer les entités juridiques..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 dark:bg-brand-navy/60 hover:bg-slate-200/50 dark:hover:bg-brand-navy/80 border border-slate-200/60 dark:border-brand-navy-lighter/40 rounded-xl py-2 pl-10 pr-4 text-xs dark:text-white placeholder-slate-400 focus:outline-none"
          />
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-navy dark:bg-brand-neon-green hover:bg-brand-navy-light dark:hover:bg-[#00b047] text-white dark:text-brand-navy rounded-xl text-xs font-bold transition-all duration-300 shadow-sm"
        >
          <Plus size={15} />
          <span>Intégrer une Entité</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreateSociety} className="p-5 bg-slate-50 dark:bg-brand-navy/55 rounded-2xl border border-dashed border-slate-200 dark:border-brand-navy-lighter/60 space-y-4 max-w-lg">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-250 font-mono uppercase">Créer une entité / Société cliente</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-slate-400 font-mono block mb-1">DÉNOMINATION SOCIALE</label>
              <input
                type="text"
                required
                placeholder="Ex: Sage France Logistics SARL"
                value={newSocName}
                onChange={(e) => setNewSocName(e.target.value)}
                className="w-full bg-white dark:bg-brand-navy-light border rounded-lg p-2 text-xs dark:text-white"
              />
            </div>
            
            <div>
              <label className="text-[10px] text-slate-400 font-mono block mb-1">DATE CHARGE TARGET</label>
              <input
                type="date"
                required
                value={newSocGoLive}
                onChange={(e) => setNewSocGoLive(e.target.value)}
                className="w-full bg-white dark:bg-brand-navy-light border rounded-lg p-2 text-xs dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-mono block mb-1">SALARIÉS IMPLIQUÉS / HEADCOUNT ({newSocHeadcount})</label>
            <input
              type="range"
              min="10"
              max="5000"
              step="10"
              value={newSocHeadcount}
              onChange={(e) => setNewSocHeadcount(parseInt(e.target.value))}
              className="w-full bg-slate-205 accent-brand-accent-blue dark:accent-brand-neon-green rounded-lg"
            />
          </div>

          <div className="flex gap-3 justify-end text-xs">
            <button 
              type="button" 
              onClick={() => setShowAddForm(false)}
              className="px-3.5 py-1.5 bg-slate-200 rounded text-slate-650"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="px-3.5 py-1.5 bg-brand-navy dark:bg-brand-neon-green text-white dark:text-brand-navy font-bold rounded"
            >
              Créer
            </button>
          </div>
        </form>
      )}

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSoc.map((soc) => (
          <div 
            key={soc.id}
            className="bg-white dark:bg-brand-navy-light border border-slate-200 dark:border-brand-navy-lighter/60 shadow-sm rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Badge Status */}
              <div className="flex justify-between items-center">
                <span className="text-[10px] bg-slate-100 dark:bg-brand-navy rounded px-2 py-0.5 font-mono text-slate-505 dark:text-slate-400">
                  ID: {soc.id}
                </span>

                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  soc.migrationPercentage >= 100
                    ? "bg-brand-neon-green/10 text-brand-neon-green"
                    : soc.migrationPercentage > 0
                    ? "bg-brand-accent-blue/10 text-brand-accent-blue"
                    : "bg-slate-200 text-slate-500"
                }`}>
                  {soc.migrationPercentage >= 100 ? "PRÊT GO-LIVE" : soc.migrationPercentage > 0 ? "EN MIGRATION" : "EN ATTENTE"}
                </span>
              </div>

              {/* Title group */}
              <div className="mt-4 flex items-center gap-3">
                <div className="w-9 h-9 bg-brand-accent-blue/5 dark:bg-brand-neon-green/5 text-brand-accent-blue dark:text-brand-neon-green rounded-xl flex items-center justify-center shrink-0">
                  <Building2 size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-150 leading-tight">
                    {soc.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mt-0.5 flex items-center gap-1">
                    <Users size={10} /> {soc.headcount} Salariés
                  </p>
                </div>
              </div>

              {/* Slider percentage migration */}
              <div className="mt-5 p-3.5 bg-slate-50/60 dark:bg-brand-navy/40 rounded-xl border border-slate-150/40 dark:border-brand-navy-lighter/20">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-500 font-medium">Avancement :</span>
                  <span className="font-mono font-extrabold text-brand-accent-blue dark:text-brand-neon-green">
                    {soc.migrationPercentage}%
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={soc.migrationPercentage}
                  onChange={(e) => onUpdateSocietyProgress(soc.id, parseInt(e.target.value))}
                  className="w-full accent-brand-accent-blue dark:accent-brand-neon-green h-1.5 bg-slate-200 dark:bg-brand-navy rounded hover:cursor-pointer"
                />
              </div>
            </div>

            {/* Target Date footer */}
            <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-brand-navy-lighter/25 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calendar size={12} /> Go-Live Cible
              </span>
              <span className="font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-brand-navy/40 px-2 py-0.5 rounded">
                {soc.goLiveDate}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
