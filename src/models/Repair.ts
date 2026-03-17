import type { Client } from "./Client";

export interface Repair {
  id: number;
  device: string;
  description: string;
  cost: number;
  createdAt: string;
  client: Client;
  technician?: Technician;
  status: string;
  history: RepairHistory[];
}

export interface Technician {
  id: number;
  name: string;
  specialization: string;
}

export interface RepairHistory {
  id: number;
  repairId: number;
  status: string;
  notes: string;
  changedAt: string;
}
