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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CreateRepairModal } from "@/components/repairs/CreateRepairModal";
import { getRepairs, updateRepair, deleteRepair } from "@/services/repairsService";
import type { Repair } from "@/models/Repair";
import { useToast } from "@/hooks/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  History, User, Wrench, DollarSign, Calendar, Search, 
  ChevronLeft, ChevronRight, ArrowUp, ArrowDown, ArrowUpDown,
  Save, X, Trash2, CircleUserRound, Pencil 
} from "lucide-react";

const RepairsList = () => {
  const { addToast } = useToast();
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRepair, setSelectedRepair] = useState<Repair | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
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

  const handleUpdate = async () => {
    if (!selectedRepair) return;
    try {
      setIsUpdating(true);
      // Align with RepairUpdateDto: Id, Device, Description, Cost, Status
      const updateData = {
        id: selectedRepair.id,
        device: selectedRepair.device,
        description: selectedRepair.description,
        cost: selectedRepair.cost,
        status: selectedRepair.status
      };
      await updateRepair(selectedRepair.id, updateData);
      addToast({
        id: `update-${selectedRepair.id}`,
        title: "Repair Updated",
        description: `Repair #${selectedRepair.id} has been successfully updated.`,
      });
      setIsEditing(false);
      fetchData();
    } catch (error) {
      console.error("Update error:", error);
      addToast({
        id: `error-${selectedRepair.id}`,
        title: "Update Failed",
        description: "There was an error updating the repair.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Handles the deletion of a repair.
   * Asks for confirmation before calling the service.
   */
  const handleDelete = async () => {
    if (!selectedRepair) return;
    
    if (!window.confirm(`Are you sure you want to delete repair #${selectedRepair.id}?`)) {
      return;
    }

    try {
      setIsUpdating(true);
      await deleteRepair(selectedRepair.id);
      addToast({
        id: `delete-${selectedRepair.id}`,
        title: "Repair Deleted",
        description: `Repair #${selectedRepair.id} has been successfully removed.`,
      });
      closeSheet();
      fetchData();
    } catch (error) {
      console.error("Delete error:", error);
      addToast({
        id: `error-delete-${selectedRepair.id}`,
        title: "Delete Failed",
        description: "There was an error deleting the repair.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

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
    setPage(1);
  };

  const closeSheet = () => {
    setSelectedRepair(null);
    setIsEditing(false);
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
      case "pending": return <Badge variant="pending">Pending</Badge>;
      case "inprogress": return <Badge variant="inProgress">In Progress</Badge>;
      case "completed": return <Badge variant="completed">Completed</Badge>;
      case "delivered": return <Badge variant="delivered">Delivered</Badge>;
      case "cancelled": return <Badge variant="cancelled">Cancelled</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("es-ES", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const renderSheetActions = () => (
    <div className="flex gap-2 mr-6">
      {isEditing ? (
        <>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => setIsEditing(false)} 
            className="h-8 w-8 hover:bg-muted text-muted-foreground hover:text-foreground"
            title="Cancel"
          >
            <X className="h-4 w-4" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 hover:bg-muted text-green-600 hover:text-green-500"
            title="Save"
            onClick={handleUpdate}
            disabled={isUpdating}
          >
            <Save className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => setIsEditing(true)} 
            className="h-8 w-8 hover:bg-muted text-muted-foreground hover:text-foreground"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 hover:bg-muted text-red-600 hover:text-red-500"
            title="Delete"
            onClick={handleDelete}
            disabled={isUpdating}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );

  if (error) return <div className="text-center p-4 text-destructive">{error}</div>;

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-3 p-2 bg-background/50 backdrop-blur-md rounded-lg border shadow-sm flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search repairs..."
              className="pl-9 h-9 w-full rounded-md border border-input bg-background/50 backdrop-blur-sm px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Price</span>
            <input
              type="number"
              placeholder="Min"
              className="h-9 w-[70px] rounded-md border border-input bg-background/50 backdrop-blur-sm px-2 py-2 text-sm"
              value={minCost}
              onChange={(e) => setMinCost(e.target.value === "" ? "" : Number(e.target.value))}
            />
            <input
              type="number"
              placeholder="Max"
              className="h-9 w-[70px] rounded-md border border-input bg-background/50 backdrop-blur-sm px-2 py-2 text-sm"
              value={maxCost}
              onChange={(e) => setMaxCost(e.target.value === "" ? "" : Number(e.target.value))}
            />
          </div>

          <div className="h-6 w-[1px] bg-border mx-1" />

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Show</span>
            <select
              className="h-9 w-[65px] rounded-md border border-input bg-background/50 backdrop-blur-sm px-1 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>

          <Button type="submit" size="sm" variant="secondary" className="h-9 px-3">
            <Search className="h-4 w-4" />
          </Button>
        </form>

        <CreateRepairModal onSuccess={fetchData} />
      </div>

      {/* Table */}
      <div className="rounded-md border bg-card/50 backdrop-blur-md shadow-sm overflow-hidden">
        <Table>
          <TableCaption>A list of recent device repairs.</TableCaption>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-b border-border/50">
              <TableHead className="w-[100px] font-semibold text-muted-foreground cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort("createdat")}>
                <div className="flex items-center gap-1">Date {getSortIcon("createdat")}</div>
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort("client")}>
                <div className="flex items-center gap-1">Client {getSortIcon("client")}</div>
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort("device")}>
                <div className="flex items-center gap-1">Device {getSortIcon("device")}</div>
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort("technician")}>
                <div className="flex items-center gap-1">Technician {getSortIcon("technician")}</div>
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground">Status</TableHead>
              <TableHead className="text-right font-semibold text-muted-foreground cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort("cost")}>
                <div className="flex items-center justify-end gap-1">Cost {getSortIcon("cost")}</div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center h-32 text-muted-foreground italic">Loading repairs...</TableCell></TableRow>
            ) : repairs.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center h-32 text-muted-foreground italic">No repairs found.</TableCell></TableRow>
            ) : repairs.map((repair) => (
              <TableRow key={repair.id} className="cursor-pointer hover:bg-muted/30 transition-colors border-b border-border/40" onClick={() => setSelectedRepair(repair)}>
                <TableCell className="font-medium text-foreground/90">{formatDate(repair.createdAt).split(',')[0]}</TableCell>
                <TableCell className="text-foreground/80">{repair.client?.name || "N/A"}</TableCell>
                <TableCell className="text-foreground/80">{repair.device}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-foreground/80">
                    <CircleUserRound className="h-4 w-4 text-muted-foreground/70" />
                    <span>{repair.technician?.name || "Unassigned"}</span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(repair.status)}</TableCell>
                <TableCell className="text-right font-semibold text-primary/90">${repair.cost.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-2">
        <p className="text-sm text-muted-foreground">Page {page} of {totalPages || 1}</p>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1 || loading}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0 || loading}>
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Detail Sheet */}
      <Sheet open={!!selectedRepair} onOpenChange={closeSheet}>
        <SheetContent className="sm:max-w-md bg-background/80 backdrop-blur-xl border-l shadow-2xl overflow-y-auto">
          <SheetHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-2xl flex items-center gap-2">
                <Wrench className="h-6 w-6 text-primary" />
                Repair #{selectedRepair?.id}
              </SheetTitle>
              {selectedRepair && renderSheetActions()}
            </div>
            <SheetDescription>
              {isEditing ? "Editing mode active." : "Comprehensive view of the repair status and history."}
            </SheetDescription>
          </SheetHeader>

          {selectedRepair && (
            <div className="py-6 space-y-6">
              {/* Status & Cost */}
              <div className="flex justify-between items-center bg-muted/30 p-4 rounded-lg">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase">Status</p>
                  {isEditing ? (
                    <Select 
                      value={selectedRepair.status} 
                      onValueChange={(val) => setSelectedRepair({...selectedRepair, status: val})}
                    >
                      <SelectTrigger className="h-8 w-32 bg-background/50">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="InProgress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    getStatusBadge(selectedRepair.status)
                  )}
                </div>
                <div className="text-right space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase">Total Cost</p>
                  {isEditing ? (
                    <div className="relative">
                      <DollarSign className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="number" 
                        className="pl-7 h-8 w-28 text-right font-bold bg-background/50" 
                        value={selectedRepair.cost} 
                        onChange={(e) => setSelectedRepair({...selectedRepair, cost: Number(e.target.value)})}
                      />
                    </div>
                  ) : (
                    <p className="text-2xl font-bold text-primary flex items-center justify-end">
                      <DollarSign className="h-5 w-5" />
                      {selectedRepair.cost.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-start gap-3 p-3 rounded-md border bg-card/50">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">Client Information</p>
                    <p className="text-sm text-muted-foreground">{selectedRepair.client?.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedRepair.client?.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-md border bg-card/50">
                  <CircleUserRound className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">Technician</p>
                    <p className="text-sm text-muted-foreground">{selectedRepair.technician?.name || "Unassigned"}</p>
                    {selectedRepair.technician?.specialization && (
                      <p className="text-xs text-muted-foreground italic">{selectedRepair.technician.specialization}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-md border bg-card/50">
                  <Wrench className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1 space-y-2">
                    <p className="text-sm font-semibold">Device & Issue</p>
                    {isEditing ? (
                      <>
                        <div className="space-y-1">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">Device</p>
                          <Input 
                            value={selectedRepair.device} 
                            className="h-8 text-sm bg-background/50" 
                            onChange={(e) => setSelectedRepair({...selectedRepair, device: e.target.value})}
                          />
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">Description</p>
                          <Textarea 
                            value={selectedRepair.description} 
                            className="text-sm min-h-[80px] bg-background/50" 
                            onChange={(e) => setSelectedRepair({...selectedRepair, description: e.target.value})}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-muted-foreground">{selectedRepair.device}</p>
                        <p className="text-sm italic mt-1">"{selectedRepair.description}"</p>
                      </>
                    )}
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
              {!isEditing && (
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
                            <p className="text-xs text-muted-foreground italic">{h.notes || "No comments."}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground italic pl-2">No history records found.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default RepairsList;