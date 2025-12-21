import httpClient from "../api/httpClient";
import type { Repair } from "../models/Repair";
import type { PagedResult } from "../models/PagedResult";

export const getRepairs = async (page = 1, pageSize = 10): Promise<PagedResult<Repair>> => {
  const response = await httpClient.get<PagedResult<Repair>>("/repairs", {
    params: { page, pageSize },
  });
  return response.data;
};

export const getRepairById = async (id: number): Promise<Repair> => {
  const response = await httpClient.get<Repair>(`/repairs/${id}`);
  return response.data;
};