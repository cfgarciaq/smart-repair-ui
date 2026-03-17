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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getRepairs } from "@/services/repairsService";
import type { Repair } from "@/models/Repair";
import { Info, History, User, Wrench, DollarSign, Calendar } from "lucide-react";

const RepairsList = () => {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRepair, setSelectedRepair] = useState<Repair | null>(null);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) return <div className="text-center p-4">Loading repairs...</div>;
  if (error) return <div className="text-center p-4 text-destructive">{error}</div>;

  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>A list of recent vehicle repairs.</TableCaption>
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
              <TableRow 
                key={repair.id} 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => setSelectedRepair(repair)}
              >
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

      <Sheet open={!!selectedRepair} onOpenChange={(open) => !open && setSelectedRepair(null)}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          {selectedRepair && (
            <>
              <SheetHeader className="mb-6">
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-2xl flex items-center gap-2">
                    <Wrench className="h-6 w-6 text-primary" />
                    {selectedRepair.device}
                  </SheetTitle>
                  {getStatusBadge(selectedRepair.status)}
                </div>
                <SheetDescription>
                  Repair ID: #{selectedRepair.id}
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6">
                {/* Details Section */}
                <section className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg border">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <User className="h-3 w-3" /> Client
                      </p>
                      <p className="text-sm font-medium">{selectedRepair.client.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <DollarSign className="h-3 w-3" /> Cost
                      </p>
                      <p className="text-sm font-medium">${selectedRepair.cost.toFixed(2)}</p>
                    </div>
                    <div className="col-span-2 space-y-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Wrench className="h-3 w-3" /> Technician
                      </p>
                      <p className="text-sm font-medium">
                        {selectedRepair.technician 
                          ? `${selectedRepair.technician.name} (${selectedRepair.technician.specialization})`
                          : "Unassigned"}
                      </p>
                    </div>
                    <div className="col-span-2 space-y-1">
                      <p className="text-xs text-muted-foreground">Description</p>
                      <p className="text-sm italic">"{selectedRepair.description}"</p>
                    </div>
                  </div>
                </section>

                {/* History Section */}
                <section className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <History className="h-4 w-4" />
                    Repair History
                  </h3>
                  <div className="relative space-y-4 pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                    {selectedRepair.history.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic">No history recorded yet.</p>
                    ) : (
                      selectedRepair.history
                        .sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime())
                        .map((item) => (
                        <div key={item.id} className="relative">
                          <div className="absolute -left-[1.35rem] top-1.5 h-3 w-3 rounded-full border-2 border-background bg-primary" />
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold uppercase tracking-tight">
                                {item.status}
                              </span>
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(item.changedAt)}
                              </span>
                            </div>
                            {item.notes && (
                              <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                                {item.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default RepairsList;
