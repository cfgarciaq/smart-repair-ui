import httpClient from "../api/httpClient";
import type { Repair } from "../models/Repair";
import type { PagedResult } from "../models/PagedResult";

export async function getRepairs(
  page: number,
  pageSize: number,
  sortBy?: string,
  sortDirection?: 'asc' | 'desc',
  filters?: RepairFilters
): Promise<PagedResult<Repair>> {

  const params: Record<string, string | number> = {
    page,
    pageSize,
  };

  // sorting
  if (sortBy) {
    params.sort =
      sortDirection === 'desc'
        ? `${sortBy.toLowerCase()}_desc`
        : sortBy.toLowerCase();
  }

  // filtering
  if (filters?.search ) {
    params.search = filters.search;
  }

  if (filters?.minCost !== undefined) {
    params.minCost = filters.minCost;
  }

  if  (filters?.maxCost !== undefined) {
    params.maxCost = filters.maxCost;
  }

  const response = await httpClient.get<PagedResult<Repair>>(
    "/repairs",
    { params }
  );

  return response.data;
}

export const getRepairById = async (id: number): Promise<Repair> => {
  const response = await httpClient.get<Repair>(`/repairs/${id}`);
  return response.data;
};

export interface RepairFilters {
  search?: string;
  minCost?: number;
  maxCost?: number;
}