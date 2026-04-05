import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface DeleteRepairModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  repairId: number | undefined;
  isDeleting: boolean;
}

/**
 * Modal component for confirming the deletion of a repair.
 * Follows the Obsidian/Glassmorphism aesthetic.
 */
export const DeleteRepairModal = ({
  isOpen,
  onClose,
  onConfirm,
  repairId,
  isDeleting,
}: DeleteRepairModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-background/80 backdrop-blur-xl border shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 text-red-500 mb-2">
            <div className="p-2 rounded-full bg-red-500/10">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <DialogTitle className="text-xl">Confirm Deletion</DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground">
            Are you sure you want to delete repair <span className="font-bold text-foreground">#{repairId}</span>? 
            This action cannot be undone and all associated data will be permanently removed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 gap-2 sm:gap-0">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isDeleting}
            className="hover:bg-muted"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20"
          >
            {isDeleting ? "Deleting..." : "Delete Repair"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
