import { useEffect, useState, useCallback } from "react";
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
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getRepairs } from "@/services/repairsService";
import type { Repair } from "@/models/Repair";
import { History, User, Wrench, DollarSign, Calendar, Search, ChevronLeft, ChevronRight, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

const RepairsList = () => {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRepair, setSelectedRepair] = useState<Repair | null>(null);
  
  // Pagination & Filters State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [minCost, setMinCost] = useState<number | "">("");
  const [maxCost, setMaxCost] = useState<number | "">("");

  // Sorting State
  const [sortBy, setSortBy] = useState<string>("createdat");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getRepairs(page, pageSize, sortBy, sortDirection, {
        search: search || undefined,
        minCost: minCost === "" ? undefined : minCost,
        maxCost: maxCost === "" ? undefined : maxCost,
      });
      setRepairs(data.items);
      setTotalPages(data.totalPages);
      setError(null);
    } catch {
      setError("Failed to fetch repairs. Check console for details.");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, minCost, maxCost, sortBy, sortDirection]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchData();
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
    setPage(1); // Reset to page 1 on sort
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4 text-primary" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4 text-primary" />
    );
  };

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

  if (error) return <div className="text-center p-4 text-destructive">{error}</div>;

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <form onSubmit={handleSearch} className="flex flex-wrap items-end gap-4 p-4 bg-card/50 backdrop-blur-md rounded-lg border shadow-sm">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Search</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Client, Device, Tech..."
              className="pl-9 h-10 w-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Min Price</label>
          <input
            type="number"
            placeholder="0"
            className="h-10 w-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={minCost}
            onChange={(e) => setMinCost(e.target.value === "" ? "" : Number(e.target.value))}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Max Price</label>
          <input
            type="number"
            placeholder="1000"
            className="h-10 w-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={maxCost}
            onChange={(e) => setMaxCost(e.target.value === "" ? "" : Number(e.target.value))}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Page Size</label>
          <select
            className="h-10 w-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </div>

        <Button type="submit" className="h-10">
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </form>

      {/* Table */}
      <div className="rounded-md border bg-card/50 backdrop-blur-md shadow-sm overflow-hidden">
        <Table>
          <TableCaption>A list of recent device repairs.</TableCaption>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead 
                className="w-[80px] font-bold cursor-pointer hover:text-primary transition-colors"
                onClick={() => handleSort("createdat")}
              >
                <div className="flex items-center">Date {getSortIcon("createdat")}</div>
              </TableHead>
              <TableHead 
                className="font-bold cursor-pointer hover:text-primary transition-colors"
                onClick={() => handleSort("client")}
              >
                <div className="flex items-center">Client {getSortIcon("client")}</div>
              </TableHead>
              <TableHead 
                className="font-bold cursor-pointer hover:text-primary transition-colors"
                onClick={() => handleSort("device")}
              >
                <div className="flex items-center">Device {getSortIcon("device")}</div>
              </TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead 
                className="font-bold cursor-pointer hover:text-primary transition-colors"
                onClick={() => handleSort("technician")}
              >
                <div className="flex items-center">Technician {getSortIcon("technician")}</div>
              </TableHead>
              <TableHead 
                className="text-right font-bold cursor-pointer hover:text-primary transition-colors"
                onClick={() => handleSort("cost")}
              >
                <div className="flex items-center justify-end">Cost {getSortIcon("cost")}</div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-32">
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    <span>Loading repairs...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : repairs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  No repairs found.
                </TableCell>
              </TableRow>
            ) : (
              repairs.map((repair) => (
                <TableRow
                  key={repair.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setSelectedRepair(repair)}
                >
                  <TableCell className="font-medium">{formatDate(repair.createdAt).split(',')[0]}</TableCell>
                  <TableCell>{repair.client?.name || "N/A"}</TableCell>
                  <TableCell>{repair.device}</TableCell>
                  <TableCell>{getStatusBadge(repair.status)}</TableCell>
                  <TableCell>{repair.technician?.name || "Unassigned"}</TableCell>
                  <TableCell className="text-right font-semibold">
                    ${repair.cost.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-2">
        <p className="text-sm text-muted-foreground">
          Page {page} of {totalPages || 1}
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || totalPages === 0 || loading}
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Detail Sheet */}
      <Sheet open={!!selectedRepair} onOpenChange={() => setSelectedRepair(null)}>
        <SheetContent className="sm:max-w-md bg-background/80 backdrop-blur-xl border-l shadow-2xl">
          <SheetHeader className="border-b pb-4">
            <SheetTitle className="text-2xl flex items-center gap-2">
              <Wrench className="h-6 w-6 text-primary" />
              Repair Details #{selectedRepair?.id}
            </SheetTitle>
            <SheetDescription>
              Comprehensive view of the repair status and history.
            </SheetDescription>
          </SheetHeader>

          {selectedRepair && (
            <div className="py-6 space-y-6">
              {/* Status & Cost */}
              <div className="flex justify-between items-center bg-muted/30 p-4 rounded-lg">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase">Current Status</p>
                  {getStatusBadge(selectedRepair.status)}
                </div>
                <div className="text-right space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase">Total Cost</p>
                  <p className="text-2xl font-bold text-primary flex items-center justify-end">
                    <DollarSign className="h-5 w-5" />
                    {selectedRepair.cost.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-start gap-3 p-3 rounded-md border bg-card/50">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold">Client Information</p>
                    <p className="text-sm text-muted-foreground">{selectedRepair.client?.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedRepair.client?.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-md border bg-card/50">
                  <Wrench className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold">Device & Issue</p>
                    <p className="text-sm text-muted-foreground">{selectedRepair.device}</p>
                    <p className="text-sm italic mt-1">"{selectedRepair.description}"</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-md border bg-card/50">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold">Created At</p>
                    <p className="text-sm text-muted-foreground">{formatDate(selectedRepair.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* History Section */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold flex items-center gap-2 px-1">
                  <History className="h-4 w-4" />
                  Status History
                </h4>
                <div className="relative space-y-4 pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                  {selectedRepair.history?.length > 0 ? (
                    selectedRepair.history.map((h, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[22px] top-1.5 h-3 w-3 rounded-full border-2 border-background bg-primary" />
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium leading-none">{h.status}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(h.changedAt)}</p>
                          </div>
                          <p className="text-xs text-muted-foreground italic">
                            {h.notes || "No comments provided."}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground italic">No history records found.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default RepairsList;
