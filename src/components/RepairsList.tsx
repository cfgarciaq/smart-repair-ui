import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getRepairs } from "@/services/repairsService";
import type { Repair } from "@/models/Repair";

const RepairsList = () => {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getRepairs(1, 10);
        setRepairs(data.items);
        setError(null);
      } catch {
        setError("Failed to fetch repairs. Check console for details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    switch (s) {
      case "pending":
        return <Badge variant="pending">Pending</Badge>;
      case "inprogress":
        return <Badge variant="inProgress">In Progress</Badge>;
      case "completed":
        return <Badge variant="completed">Completed</Badge>;
      case "delivered":
        return <Badge variant="delivered">Delivered</Badge>;
      case "cancelled":
        return <Badge variant="cancelled">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) return <div className="text-center p-4">Loading repairs...</div>;
  if (error) return <div className="text-center p-4 text-destructive">{error}</div>;

  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>A list of recent device repairs.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Device</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Technician</TableHead>
            <TableHead className="text-right">Cost</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {repairs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center h-24">
                No repairs found.
              </TableCell>
            </TableRow>
          ) : (
            repairs.map((repair) => (
              <TableRow key={repair.id}>
                <TableCell className="font-medium">{repair.id}</TableCell>
                <TableCell>{repair.client.name}</TableCell>
                <TableCell>{repair.device}</TableCell>
                <TableCell>{getStatusBadge(repair.status)}</TableCell>
                <TableCell>
                  {repair.technician?.name || "Unassigned"}
                </TableCell>
                <TableCell className="text-right">
                  ${repair.cost.toFixed(2)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RepairsList;
