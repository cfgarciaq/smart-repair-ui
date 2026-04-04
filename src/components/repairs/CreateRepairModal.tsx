import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

// Explicit imports for types to avoid verbatimModuleSyntax error
import type { SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { typedZodResolver } from "@/lib/zod-helpers";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription,
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { getClients, getTechnicians, createRepair } from "@/services/repairsService";
import { useToast } from "@/hooks/use-toast";
import type { Client } from "@/models/Client";
import type { Technician } from "@/models/Repair";

// Definition of Zod schema for repair form validation Zod
const repairSchema = z.object({
  device: z.string()
    .min(1, "Device is required")
    .max(100, "Device cannot exceed 100 characters"),
  description: z.string()
    .min(1, "Description is required")
    .max(500, "Description cannot exceed 500 characters"),
  cost: z.coerce.string()
    .refine((val) => val === "" || !isNaN(Number(val)), "Cost must be a number")
    .transform((val) => (val === "" ? 0 : Number(val))),
  clientId: z.coerce.number()
    .min(1, "Please select a client"),
  technicianId: z.coerce.number()
    .min(1, "Please select a technician"),
});

// Dejamos que Zod infiera el tipo automáticamente para que coincida perfectamente con el resolver
type RepairFormValues = z.infer<typeof repairSchema>;

interface CreateRepairModalProps {
  onSuccess?: () => void;
}

export function CreateRepairModal({ onSuccess }: CreateRepairModalProps) {
  const { addToast } = useToast();
  const [open, setOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Inicializamos el formulario con el tipo inferido de Zod
  const form = useForm<RepairFormValues>({
    // Use the typed helper to avoid TS compatibility issues between Zod versions and RHF
    resolver: typedZodResolver<RepairFormValues>(repairSchema),
    defaultValues: {
      device: "",
      description: "",
      cost: "" as unknown as number, // Initialize as empty string to avoid leading zero
      clientId: 0,
      technicianId: 0,
    },
  });

  useEffect(() => {
    let isMounted = true;
    if (open) {
      const loadData = async () => {
        try {
          setLoading(true);
          setLoadError(null);
          
          // Use try-catch for each call to prevent one failure from breaking everything
          const [c, t] = await Promise.allSettled([getClients(), getTechnicians()]);
          
          if (isMounted) {
            const clientsData = c.status === 'fulfilled' ? c.value : [];
            const techniciansData = t.status === 'fulfilled' ? t.value : [];
            
            setClients(Array.isArray(clientsData) ? clientsData : []);
            setTechnicians(Array.isArray(techniciansData) ? techniciansData : []);

            if (c.status === 'rejected' || t.status === 'rejected') {
              setLoadError("Some data could not be loaded. Please try again later.");
            }
          }
        } catch (err) {
          console.error("Error loading modal data:", err);
          if (isMounted) {
            setLoadError("Failed to load required data.");
            setClients([]);
            setTechnicians([]);
          }
        } finally {
          if (isMounted) setLoading(false);
        }
      };
      loadData();
    }
    return () => { isMounted = false; };
  }, [open]);

  const onSubmit: SubmitHandler<RepairFormValues> = async (data) => {
    try {
      await createRepair(data);
      addToast({
        id: "create-success",
        title: "Repair Created",
        description: "The repair has been successfully registered.",
      });
      setOpen(false);
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Create repair error:", error);
      addToast({
        id: "create-error",
        title: "Error",
        description: "Failed to create repair.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="h-9 px-4 bg-brand-gradient hover:opacity-90 shadow-brand-glow border-none transition-all active:scale-95"
          style={{ color: "var(--brand-foreground)" }}
        >
          <Plus className="mr-2 h-4 w-4" style={{ color: "var(--brand-foreground)" }} />
          <span className="font-semibold">New Repair</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur-xl border shadow-2xl">
        <DialogHeader>
          <DialogTitle>Register New Repair</DialogTitle>
          <DialogDescription>
            Fill in the details below to register a new device repair in the system.
          </DialogDescription>
          {loadError && (
            <div className="p-2 text-xs font-medium text-red-500 bg-red-500/10 rounded border border-red-500/20">
              {loadError}
            </div>
          )}
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            <FormField
              control={form.control}
              name="device"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. iPhone 15"
                      {...field}
                      className="pl-9 h-9 w-full rounded-md border border-slate-300/50 dark:border-white/10 bg-white/50 dark:bg-background/50 backdrop-blur-sm px-3 py-2 text-sm focus-visible:ring-1 focus-visible:ring-blue-400 transition-all"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the issue..."
                      className="resize-none rounded-md border border-slate-300/50 dark:border-white/10 bg-white/50 dark:bg-background/50 backdrop-blur-sm px-3 py-2 text-sm focus-visible:ring-1 focus-visible:ring-blue-400 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      value={field.value === 0 && form.formState.defaultValues?.cost === "" as unknown as number ? "" : field.value}
                      className="pl-9 h-9 w-full rounded-md border border-slate-300/50 dark:border-white/10 bg-white/50 dark:bg-background/50 backdrop-blur-sm px-3 py-2 text-sm focus-visible:ring-1 focus-visible:ring-blue-400 transition-all"
                      onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <Select 
                      onValueChange={(val) => field.onChange(Number(val))} 
                      value={field.value ? field.value.toString() : undefined}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder={loading ? "Loading..." : "Select a client"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.isArray(clients) && clients.length > 0 ? (
                          clients.map((c) => (
                            <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                          ))
                        ) : (
                          <SelectItem value="0" disabled>No clients available</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="technicianId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technician</FormLabel>
                    <Select 
                      onValueChange={(val) => field.onChange(Number(val))} 
                      value={field.value ? field.value.toString() : undefined}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder={loading ? "Loading..." : "Select a technician"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-background/95 backdrop-blur-xl border-slate-200 dark:border-white/10">
                        {Array.isArray(technicians) && technicians.length > 0 ? (
                          technicians.map((t) => (
                            <SelectItem key={t.id} value={t.id.toString()} className="focus:bg-brand-gradient focus:text-white">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{t.name}</span>
                                <span className="text-xs opacity-70 italic">— Spec: {t.specialization || "General"}</span>
                              </div>
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="0" disabled>No technicians available</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Saving..." : "Save Repair"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
