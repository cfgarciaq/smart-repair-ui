import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

// Explicit imports for types to avoid verbatimModuleSyntax error
import type { SubmitHandler } from "react-hook-form";
import * as z from "zod";
import { typedZodResolver } from "@/lib/zod-helpers";
import { 
  Dialog, 
  DialogContent, 
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

// Definition of Zod schema for repair form validation Zod
const repairSchema = z.object({
  device: z.string()
    .min(1, "Device is required")
    .max(100, "Device cannot exceed 100 characters"),
  description: z.string()
    .min(1, "Description is required")
    .max(500, "Description cannot exceed 500 characters"),
  cost: z.coerce.number()
    .min(0, "Cost must be a non-negative value"),
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
  const [clients, setClients] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Inicializamos el formulario con el tipo inferido de Zod
  const form = useForm<RepairFormValues>({
    // Use the typed helper to avoid TS compatibility issues between Zod versions and RHF
    resolver: typedZodResolver<RepairFormValues>(repairSchema),
    defaultValues: {
      device: "",
      description: "",
      cost: 0,
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
          // Use try-catch for each call to prevent one failure from breaking everything
          const [c, t] = await Promise.allSettled([getClients(), getTechnicians()]);
          
          if (isMounted) {
            setClients(c.status === 'fulfilled' ? c.value : []);
            setTechnicians(t.status === 'fulfilled' ? t.value : []);
          }
        } catch (err) {
          console.error("Error loading modal data:", err);
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
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" /> New Repair
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur-xl border shadow-2xl">
        <DialogHeader>
          <DialogTitle>Register New Repair</DialogTitle>
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
                    <Input placeholder="e.g. iPhone 15" {...field} className="bg-background/50" />
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
                      className="resize-none bg-background/50" 
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
                      {...field}
                      className="bg-background/50"
                      onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
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
                        {clients.map((c) => (
                          <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                        ))}
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
                      <SelectContent>
                        {technicians.map((t) => (
                          <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>
                        ))}
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