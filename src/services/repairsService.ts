import httpClient from "../api/httpClient";
import type { Repair, Technician } from "../models/Repair";
import type { PagedResult } from "../models/PagedResult";
import { AxiosError } from "axios";
import type { Client } from "@/models/Client";

export interface RepairFilters {
  search?: string;
  minCost?: number;
  maxCost?: number;
}

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

  try {
    const response = await httpClient.get<PagedResult<Repair>>(
      "/repairs",
      { params }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (!error.response) {
        console.error("API is unreachable. Please check if the backend is running and CORS is configured.", error);
      } else {
        console.error(`API error (${error.response.status}):`, error.response.data);
      }
    } else {
      console.error("An unexpected error occurred:", error);
    }
    throw error;
  }
}

export const getRepairById = async (id: number): Promise<Repair> => {
  try {
    const response = await httpClient.get<Repair>(`/repairs/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching repair ${id}:`, error);
    throw error;
  }
};

export const updateRepair = async (id: number, data: Partial<Repair>): Promise<Repair> => {
  try {
    const response = await httpClient.put<Repair>(`/repairs/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating repair ${id}:`, error);
    throw error;
  }
};

export const createRepair = async (data: Partial<Repair>): Promise<Repair> => {
  try {
    const response = await httpClient.post<Repair>("/repairs", data);
    return response.data;
  } catch (error) {
    console.error("Error creating repair:", error);
    throw error;
  }
};

export const getClients = async (): Promise<Client[]> => {
  try {
    const response = await httpClient.get<Client[]>("/clients/all");
    return response.data;
  } catch (error) {
    console.error("Error fetching clients:", error);
    return [];
  }
};

export const getTechnicians = async (): Promise<Technician[]> => {
  try {
    const response = await httpClient.get<Technician[]>("/technicians");
    return response.data;
  } catch (error) {
    console.error("Error fetching technicians:", error);
    return [];
  }
};


/**
 * Deletes a repair by its ID.
 * @param id The ID of the repair to delete.
 */
export const deleteRepair = async (id: number): Promise<void> => {
  try {
    await httpClient.delete(`/repairs/${id}`);
  } catch (error) {
    console.error(`Error deleting repair ${id}:`, error); // Log error for debugging
    throw error; // Re-throw to handle in UI
  }
};
