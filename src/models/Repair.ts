import type { Client } from "./Client";

export interface Repair
{
    id: number;
    device: string;
    description: string;
    cost: number;
    createdAt: string;
    client?: Client;
}