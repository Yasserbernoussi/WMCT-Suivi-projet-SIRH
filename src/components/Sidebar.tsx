import React from "react";
import { 
  LayoutDashboard, 
  Box, 
  Users
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
}

export default function Sidebar({ activeTab, setActiveTab, isDarkMode }: SidebarProps) {
  const menuItems = [
    { id: "global", name: "Suivi global", icon: LayoutDashboard },
    { id: "modules", name: "Situation modules", icon: Box },
    { id: "resources", name: "Équipe ressources", icon: Users },
  ];

  return (
    <aside className="w-64 bg-brand-navy min-h-screen text-slate-300 flex flex-col justify-between border-r border-brand-navy-light shrink-0 select-none z-10 transition-colors duration-300">
      {/* Upper Brand Section */}
      <div>
        <div className="p-6 border-b border-brand-navy-light">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-brand-neon-green rounded-lg flex items-center justify-center shadow-lg shadow-brand-neon-green-glow animate-pulse">
              <span className="text-brand-navy font-display font-bold text-xl">T</span>
            </div>
            <div>
              <h2 className="text-white font-display font-bold tracking-tight text-sm leading-tight">Thales Informatique</h2>
              <span className="text-xs text-brand-neon-green font-mono font-medium tracking-widest uppercase">PROJET SIRH</span>
            </div>
          </div>
          
          {/* Client Indicator */}
          <div className="mt-4 bg-brand-navy-light/60 border border-brand-navy-lighter/50 rounded-lg p-2.5 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Client Actuel</p>
              <p className="text-xs font-semibold text-white truncate max-w-[130px]">MarsaMaroc</p>
            </div>
            <span className="h-1.5 w-1.5 rounded-full bg-brand-neon-green neon-glow-active"></span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1.5 mt-4">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-lg text-sm text-left transition-all duration-300 pointer-events-auto group ${
                  isActive
                    ? "bg-brand-navy-light text-brand-neon-green border-l-2 border-brand-neon-green font-medium"
                    : "text-slate-400 hover:bg-brand-navy-light/40 hover:text-white"
                }`}
              >
                <Icon 
                  size={18} 
                  className={`transition-transform duration-300 group-hover:scale-110 ${
                    isActive ? "text-brand-neon-green" : "text-slate-400 group-hover:text-slate-200"
                  }`} 
                />
                <span className="truncate">{item.name}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-neon-green shadow-sm shadow-brand-neon-green"></span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Partnership / Consultant Card */}
      <div className="p-4 border-t border-brand-navy-light bg-brand-navy-light/30">
        <div className="relative p-3 bg-brand-navy-light/80 border border-brand-navy-lighter/60 rounded-xl overflow-hidden glass-effect">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-accent-blue/10 rounded-full blur-xl -mr-6 -mt-6"></div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src="https://res.cloudinary.com/dmutnjgp8/image/upload/v1779381879/1775549450078_evhq3n.jpg" 
                alt="Expert Consultant" 
                className="w-10 h-10 rounded-full border-2 border-brand-neon-green/30 object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-brand-neon-green border border-brand-navy neon-glow-active"></span>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-brand-neon-green font-mono uppercase tracking-widest font-semibold flex items-center gap-1">
                CONSULTANT TI
              </p>
              <p className="text-xs font-bold text-white truncate">Yasser B.</p>
              <p className="text-[10px] text-slate-400 truncate">Partenaire Intégrateur</p>
            </div>
          </div>
          
          <div className="mt-3.5 pt-2.5 border-t border-brand-navy-lighter/50 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Collaboration :</span>
            <span className="text-white font-semibold bg-brand-navy-lighter px-2 py-0.5 rounded text-[10px]">
              Thales Informatique x MarsaMaroc
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
