export interface ProjectModule {
  id: string;
  name: string;
  category: "Paie_RH" | "Espace_Employes" | "ERP_X3" | "Interface";
  status: "not_started" | "in_progress" | "testing" | "completed";
  progress: number; // 0 to 100
  responsibleId: string;
  workloadDays: number; // in man-days (jours/homme)
  targetGoLive: string;
  description: string;
  tasksCount: number;
  completedTasksCount: number;
}

export interface Resource {
  id: string;
  name: string;
  company: "Thales" | "SBD" | "TI" | "Sage Partner" | "MarsaMaroc" | "Thales Informatique";
  role: string;
  workloadAllocated: number; // total allocated days
  workloadUsed: number; // days spent
  avatar: string;
  status: "active" | "away" | "offline";
  email: string;
}

export interface ProjectTask {
  id: string;
  title: string;
  moduleId: string;
  assignedToId: string;
  progress: number; // 0 to 100
  status: "todo" | "doing" | "done" | "blocking";
  priority: "Low" | "Medium" | "High";
  startDate: string;
  endDate: string;
}

export interface ProjectRisk {
  id: string;
  title: string;
  category: string;
  severity: "Low" | "Medium" | "High";
  status: "Mitigated" | "Active" | "Critical";
  mitigation: string;
  reporterId: string;
}

export interface ClientSociety {
  id: string;
  name: string;
  headcount: number;
  status: "completed" | "in_progress" | "pending";
  migrationPercentage: number;
  goLiveDate: string;
}

export interface DashboardState {
  modules: ProjectModule[];
  resources: Resource[];
  tasks: ProjectTask[];
  risks: ProjectRisk[];
  societies: ClientSociety[];
  syncStatus: "synced" | "syncing" | "error";
  lastSyncTime: string;
}
