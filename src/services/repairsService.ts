import httpClient from "../api/httpClient";
import type { Repair } from "../models/Repair";

export const getRepairs = async (): Promise<Repair[]> => {
  const response = await httpClient.get<Repair[]>("/repairs");
  return response.data;
};

export const getRepairById = async (id: number): Promise<Repair> => {
  const response = await httpClient.get<Repair>(`/repairs/${id}`);
  return response.data;
}