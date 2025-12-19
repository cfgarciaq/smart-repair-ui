import type { Client } from "./Client";

export interface Repair
{
    id: number;
    Device: string;
    Description: string;
    cost: number;
    createdAt: string;
    client: Client;
}