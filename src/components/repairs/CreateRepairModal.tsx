// Using English for code/comments as per industry standard
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Plus } from "lucide-react";

/**
 * Validation schema matching Backend RepairCreateDto and RepairCreateValidator.
 * Backend rules:
 * - Device: Required, Max 100
 * - Description: Required, Max 500
 * - Cost: >= 0
 * - ClientId: > 0
 */
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
    .min(1, "ClientId must be a positive integer"),
  technicianId: z.coerce.number()
    .min(1, "TechnicianId must be a positive integer"),
});

type RepairFormValues = z.infer<typeof repairSchema>;

export function CreateRepairModal() {
  const form = useForm<RepairFormValues>({
    resolver: zodResolver(repairSchema),
    defaultValues: {
      device: "",
      description: "",
      cost: 0,
      clientId: 0,
      technicianId: 0,
    },
  });

  const onSubmit = async (data: RepairFormValues) => {
    try {
      // Logic to call your POST api/Repairs endpoint will go here
      console.log("Submitting:", data);
    } catch (error) {
      console.error("Failed to create repair", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" /> New Repair
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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
                    <Input placeholder="e.g. iPhone 15" {...field} />
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
                      className="resize-none" 
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
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client ID</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="technicianId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technician ID</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full">Save Repair</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
