import httpClient from "../api/httpClient";
import type { Repair } from "../models/Repair";
import type { PagedResult } from "../models/PagedResult";

export async function getRepairs(
  page: number,
  pageSize: number,
  sortBy?: string,
  sortDirection?: 'asc' | 'desc'
): Promise<PagedResult<Repair>> {

  const params: Record<string, string | number> = {
    page,
    pageSize,
  };

  if (sortBy) {
    params.sort =
      sortDirection === 'desc'
        ? `${sortBy.toLowerCase()}_desc`
        : sortBy.toLowerCase();
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