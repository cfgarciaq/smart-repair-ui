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
import { DeleteRepairModal } from "@/components/repairs/DeleteRepairModal";
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
  Save, X, Trash2, CircleUserRound, Pencil, SearchX, RefreshCw 
} from "lucide-react";
import StatusBadge from "@/components/ui/status-badge";

  const getStatusBadge = (status: string) => <StatusBadge status={status} />;

const RepairsList = () => {
  const { addToast } = useToast();
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRepair, setSelectedRepair] = useState<Repair | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
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
    
    try {
      setIsUpdating(true);
      await deleteRepair(selectedRepair.id);
      addToast({
        id: `delete-${selectedRepair.id}`,
        title: "Repair Deleted",
        description: `Repair #${selectedRepair.id} has been successfully removed.`,
      });
      setIsDeleteDialogOpen(false);
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

  // Status rendering is handled by StatusBadge component (LED-style indicator)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("es-ES", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const renderSheetActions = () => (
    <div className="flex gap-3 w-full">
      {isEditing ? (
        <>
          <Button 
            variant="outline" 
            onClick={() => setIsEditing(false)} 
            className="flex-1 bg-background/50 backdrop-blur-sm border-muted-foreground/20 hover:bg-muted"
          >
            <X className="h-4 w-4 mr-2" /> Cancel
          </Button>
          <Button 
            className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20"
            onClick={handleUpdate}
            disabled={isUpdating}
          >
            <Save className="h-4 w-4 mr-2" /> {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </>
      ) : (
        <>
          <Button 
            variant="outline" 
            onClick={() => setIsEditing(true)} 
            className="flex-1 bg-background/50 backdrop-blur-sm border-muted-foreground/20 hover:bg-muted"
          >
            <Pencil className="h-4 w-4 mr-2" /> Edit Repair
          </Button>
          <Button 
            variant="destructive"
            className="flex-1 bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={isUpdating}
          >
            <Trash2 className="h-4 w-4 mr-2" /> Delete
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
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-3 p-2 bg-background/50 backdrop-blur-md rounded-lg border shadow-sm w-full md:flex-1">
          <div className="relative w-full md:flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search repairs..."
                  className="pl-9 h-9 w-full rounded-md border border-slate-300/50 dark:border-white/10 bg-white/50 dark:bg-background/50 backdrop-blur-sm px-3 py-2 text-sm focus-visible:ring-1 focus-visible:ring-blue-400 transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                size="sm"
                className="h-9 px-4 bg-brand-gradient hover:opacity-90 text-white dark:text-[#0D1117] border-none shrink-0 transition-all active:scale-95"
              >
                <Search className="h-4 w-4 mr-2" />
                <span className="font-medium">Search</span>
              </Button>
          </div>

          <div className="flex items-center justify-between w-full md:w-auto gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-foreground uppercase tracking-wider">Price</span>
                <input
                  type="number"
                  placeholder="Min"
                  className="h-9 w-[70px] rounded-md border border-slate-300/50 dark:border-white/10 bg-white/50 dark:bg-background/50 backdrop-blur-sm px-2 py-2 text-sm focus-visible:ring-1 focus-visible:ring-blue-400 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={minCost}
                  onChange={(e) => setMinCost(e.target.value === "" ? "" : Number(e.target.value))}
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="h-9 w-[70px] rounded-md border border-slate-300/50 dark:border-white/10 bg-white/50 dark:bg-background/50 backdrop-blur-sm px-2 py-2 text-sm focus-visible:ring-1 focus-visible:ring-blue-400 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={maxCost}
                  onChange={(e) => setMaxCost(e.target.value === "" ? "" : Number(e.target.value))}
                />
              </div>

            <div className="h-6 w-[1px] bg-border hidden md:block mx-1" />

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-foreground uppercase tracking-wider">Show</span>
              <select
                className="h-9 w-[65px] rounded-md border border-slate-300/50 dark:border-white/10 bg-white/50 dark:bg-background/50 backdrop-blur-sm px-3 py-2 text-sm focus-visible:ring-1 focus-visible:ring-blue-400 transition-all"
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

            {error && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={fetchData}
                className="h-9 px-2 text-amber-500 hover:text-amber-600 hover:bg-amber-500/10 border border-amber-500/20"
              >
                <RefreshCw className="h-4 w-4 mr-1 animate-spin-slow" />
                <span className="text-xs font-bold uppercase">Retry</span>
              </Button>
            )}
          </div>
        </form>

        <div className="w-full md:w-auto flex justify-center">
          <CreateRepairModal onSuccess={fetchData} />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-card/50 backdrop-blur-md shadow-sm overflow-hidden">
        <Table>
          <TableCaption>A list of recent device repairs.</TableCaption>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-b border-border/50">
              <TableHead className="w-[100px] font-semibold text-muted-foreground cursor-pointer hover:text-primary transition-colors hidden sm:table-cell" onClick={() => handleSort("createdat")}>
                <div className="flex items-center gap-1">Date {getSortIcon("createdat")}</div>
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort("client")}>
                <div className="flex items-center gap-1">Client {getSortIcon("client")}</div>
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort("device")}>
                <div className="flex items-center gap-1">Device {getSortIcon("device")}</div>
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground cursor-pointer hover:text-primary transition-colors hidden md:table-cell" onClick={() => handleSort("technician")}>
                <div className="flex items-center gap-1">Technician {getSortIcon("technician")}</div>
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort("status")}>
                <div className="flex items-center gap-1">Status {getSortIcon("status")}</div>
              </TableHead>
              <TableHead className="text-right font-semibold text-muted-foreground cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort("cost")}>
                <div className="flex items-center justify-end gap-1">Cost {getSortIcon("cost")}</div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`} className="border-b border-border/40">
                  <TableCell className="hidden sm:table-cell"><div className="h-4 w-20 bg-black/5 dark:bg-white/5 rounded animate-pulse" /></TableCell>
                  <TableCell><div className="h-4 w-32 bg-black/5 dark:bg-white/5 rounded animate-pulse" /></TableCell>
                  <TableCell><div className="h-4 w-24 bg-black/5 dark:bg-white/5 rounded animate-pulse" /></TableCell>
                  <TableCell className="hidden md:table-cell"><div className="h-4 w-28 bg-black/5 dark:bg-white/5 rounded animate-pulse" /></TableCell>
                  <TableCell><div className="h-6 w-20 bg-black/5 dark:bg-white/5 rounded-full animate-pulse" /></TableCell>
                  <TableCell className="text-right"><div className="h-4 w-16 bg-black/5 dark:bg-white/5 rounded animate-pulse ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : repairs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-3 text-slate-400/60">
                    <SearchX className="h-12 w-12" />
                    <div className="flex flex-col gap-1">
                      <p className="text-lg font-medium">No matches found</p>
                      <p className="text-sm">Try adjusting your filters or search terms.</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : repairs.map((repair) => (
              <TableRow 
                key={repair.id} 
                className="cursor-pointer hover:bg-muted/30 transition-colors border-b border-border/40 animate-in fade-in slide-in-from-bottom-1 duration-300" 
                onClick={() => setSelectedRepair(repair)}
              >
                <TableCell className="font-medium text-foreground/90 hidden sm:table-cell">{formatDate(repair.createdAt).split(',')[0]}</TableCell>
                <TableCell className="text-foreground/80">{repair.client?.name || "N/A"}</TableCell>
                <TableCell className="text-foreground/80">{repair.device}</TableCell>
                <TableCell className="hidden md:table-cell">
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
        <SheetContent className="sm:max-w-md bg-background/80 backdrop-blur-xl border-l shadow-2xl flex flex-col p-0">
          <div className="flex-1 overflow-y-auto p-6 pb-24">
            <SheetHeader className="border-b pb-4">
              <SheetTitle className="text-2xl flex items-center gap-2">
                <Wrench className="h-6 w-6 text-primary" />
                Repair #{selectedRepair?.id}
              </SheetTitle>
              <SheetDescription className="pt-2">
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
                        <SelectTrigger className="h-8 w-full sm:w-32 bg-background/50">
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
                          className="pl-8 h-8 w-full sm:w-28 text-right font-bold bg-background/50" 
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
          </div>

          {/* Fixed Footer Actions */}
          {selectedRepair && (
            <div className="absolute bottom-0 left-0 w-full p-6 bg-background/80 backdrop-blur-xl border-t shadow-[0_-10px_20px_rgba(0,0,0,0.1)]">
              {renderSheetActions()}
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Modal */}
      <DeleteRepairModal
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        repairId={selectedRepair?.id}
        isDeleting={isUpdating}
      />
    </div>
  );
};

export default RepairsList;
